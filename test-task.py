"""Unified Task API client: submit once, poll with a deadline, download an artifact."""
import argparse
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


def main():
    parser = argparse.ArgumentParser(description='通过 New API AutoDL 插件调用任意工作流并下载产物')
    choice = parser.add_mutually_exclusive_group(required=True)
    choice.add_argument('--request', help='所选格式的请求 JSON 文件；原生模式只放 AutoDL body')
    choice.add_argument('--example', help='examples.json 中的官网工作流 ID；必需媒体要先替换为真实 URL')
    parser.add_argument('--format', choices=['openai', 'minimax', 'autodl', 'dashscope'], default='openai', help='请求格式；默认保持现有 OpenAI 格式')
    parser.add_argument('--model', help='AutoDL 原生 --request 请求的官网工作流 ID，放在 URL 中，不加入 body')
    parser.add_argument('--out', required=True, help='输出文件，禁止覆盖已有文件')
    parser.add_argument('--artifact', help='产物类型，如 video 或 audio；默认下载首个适用产物')
    parser.add_argument('--timeout', type=int, default=1800)
    parser.add_argument('--interval', type=int, default=5)
    args = parser.parse_args()
    if args.timeout <= 0 or args.interval <= 0:
        raise ValueError('timeout 和 interval 必须大于零')
    supported_artifacts = {'openai': ['video'], 'minimax': ['video', 'audio'], 'autodl': ['video', 'audio', 'image', 'file'], 'dashscope': ['video']}
    if args.artifact and args.artifact not in supported_artifacts[args.format]:
        raise ValueError('所选格式不支持 --artifact ' + args.artifact)
    base = os.environ.get('NEW_API_BASE_URL', 'http://127.0.0.1:3000').rstrip('/')
    key = os.environ.get('NEW_API_KEY', '').strip()
    if not key:
        raise ValueError('请设置 NEW_API_KEY 为 New API 的 API 密钥')
    if args.request:
        body = json.loads(pathlib.Path(args.request).read_text(encoding='utf-8-sig'))
    else:
        examples = json.loads(pathlib.Path(__file__).with_name('examples.json').read_text(encoding='utf-8'))
        selected_examples = examples if args.format == 'openai' else examples['_formats'][args.format]
        if args.example not in selected_examples:
            raise ValueError('模型未列入 examples.json 的所选格式')
        if args.format == 'openai':
            body = examples[args.example]
        else:
            body = examples['_formats'][args.format][args.example]
            if args.format == 'autodl':
                body = body['body']
    if not isinstance(body, dict):
        raise ValueError('JSON 请求必须是对象')
    submit_path = '/v2/video_generation' if args.format == 'minimax' else '/v1/videos'
    if args.format == 'dashscope':
        submit_path = '/api/v1/services/aigc/image2video/video-synthesis'
    if args.format == 'autodl':
        model = args.model or args.example
        if not model:
            raise ValueError('AutoDL 原生 --request 必须同时提供 --model 工作流 ID')
        submit_path = '/api/v1/comfyui/comfyui_workflow/' + urllib.parse.quote(model, safe='')
    elif not body.get('model'):
        raise ValueError('JSON 请求必须包含 model')
    if 'your-public-file-host.example' in json.dumps(body):
        raise ValueError('请将媒体占位 URL 替换为公开可下载的真实图片、音频或视频 URL，再通过 --request 提交')
    output = pathlib.Path(args.out).expanduser().resolve()
    temporary = output.with_name(output.name + '.part')
    if output.exists() or temporary.exists():
        raise ValueError('输出文件或 .part 文件已存在，请选择其他 --out 路径')
    headers = {'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'}
    if args.format == 'dashscope':
        headers['X-DashScope-Async'] = 'enable'
    deadline = time.monotonic() + args.timeout

    def call(method, path, payload=None):
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise TimeoutError('客户端已达到截止时间；上游任务可能仍在运行')
        raw = None if payload is None else json.dumps(payload, ensure_ascii=False).encode()
        request = urllib.request.Request(base + path, data=raw, method=method, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=min(60, remaining)) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            raise RuntimeError('New API HTTP ' + str(error.code) + '；请检查渠道 Token、价格、分组和工作流参数') from None

    submitted = call('POST', submit_path, body)
    public_id = (submitted.get('output') or {}).get('task_id') if args.format == 'dashscope' else submitted.get('id' if args.format == 'openai' else 'task_id')
    if not isinstance(public_id, str) or not public_id:
        raise RuntimeError('提交响应缺少 New API 公开 task_id')
    print('task_id: ' + public_id, flush=True)
    query_prefix = {'openai': '/v1/videos/', 'minimax': '/v2/query/video_generation/', 'autodl': '/api/v1/comfyui/comfyui_workflow/result/', 'dashscope': '/api/v1/tasks/'}[args.format]
    path = query_prefix + urllib.parse.quote(public_id, safe='')
    failures = 0
    while time.monotonic() < deadline:
        try:
            task = call('GET', path)
            if args.format == 'minimax':
                task = task.get('task')
                if not isinstance(task, dict):
                    raise RuntimeError('MiniMax V2 查询响应缺少 task 对象')
            if args.format == 'dashscope':
                task = task.get('output')
                if not isinstance(task, dict):
                    raise RuntimeError('DashScope 查询响应缺少 output 对象')
            failures = 0
        except (RuntimeError, urllib.error.URLError, TimeoutError):
            failures += 1
            if failures >= 5:
                raise
            time.sleep(min(args.interval, max(0, deadline - time.monotonic())))
            continue
        status = task.get('task_status' if args.format == 'dashscope' else 'status')
        print('status: ' + str(status), flush=True)
        if status in ['FAILURE', 'failed', 'cancelled', 'FAILED', 'CANCELED']:
            raise RuntimeError('任务失败，请查看任务错误信息：' + str(task.get('error') or task.get('fail_reason') or task.get('message') or status))
        if status in ['SUCCESS', 'succeeded', 'completed', 'SUCCEEDED']:
            if args.format in ['minimax', 'dashscope']:
                if args.artifact and task.get('modality', 'video') != args.artifact:
                    raise ValueError('MiniMax V2 返回的产物类型与 --artifact 不一致')
                url = (task.get('results') or {}).get('video_url') if args.format == 'dashscope' else (task.get('content') or {}).get('url')
                parsed = urllib.parse.urlsplit(url) if isinstance(url, str) else None
                if not parsed or parsed.scheme not in ['http', 'https'] or not parsed.hostname or parsed.username or parsed.password:
                    raise RuntimeError('查询响应缺少公开 HTTP(S) 产物 URL')
                # Official V2 returns a public provider URL. Never forward the
                # New API bearer token to the provider's media host.
                download = urllib.request.Request(url)
            elif args.format == 'autodl':
                items = task.get('results', [])
                artifact = next((item for item in items if not args.artifact or item.get('type') == args.artifact), None)
                url = artifact.get('url') if isinstance(artifact, dict) else None
                parsed = urllib.parse.urlsplit(url) if isinstance(url, str) else None
                if not parsed or parsed.scheme not in ['http', 'https'] or not parsed.hostname or parsed.username or parsed.password:
                    raise RuntimeError('原生查询响应缺少公开 HTTP(S) 产物 URL')
                download = urllib.request.Request(url)
            else:
                if args.artifact and args.artifact != 'video':
                    raise ValueError('OpenAI Video --artifact 只支持 video')
                download = urllib.request.Request(base + path + '/content', headers=headers)
            created = False
            try:
                with temporary.open('xb') as file:
                    created = True
                    with urllib.request.urlopen(download, timeout=60) as response:
                        while True:
                            chunk = response.read(1024 * 1024)
                            if not chunk:
                                break
                            file.write(chunk)
                if temporary.stat().st_size == 0:
                    raise RuntimeError('产物下载为空')
                # Exclusive destination creation also protects against a concurrent file.
                with output.open('xb') as destination, temporary.open('rb') as source:
                    while True:
                        chunk = source.read(1024 * 1024)
                        if not chunk:
                            break
                        destination.write(chunk)
            finally:
                if created:
                    temporary.unlink(missing_ok=True)
            print('已保存：' + str(output))
            return
        time.sleep(min(args.interval, max(0, deadline - time.monotonic())))
    raise TimeoutError('客户端轮询达到截止时间；New API / AutoDL 上游任务可能仍在运行')


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
