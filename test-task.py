"""Unified Task API client: submit once, poll with a deadline, download an artifact.

Supports all four request formats: OpenAI Videos, MiniMax V2, AutoDL's own API and
Alibaba Cloud DashScope (the last two under the /autodl prefix).
"""
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
    choice.add_argument('--request', help='所选格式的请求 JSON 文件')
    choice.add_argument('--example', help='examples.json 中的官网工作流 ID；必需媒体要先替换为真实 URL')
    parser.add_argument('--format', choices=FORMATS, default='openai', help='请求格式；默认 OpenAI Videos')
    parser.add_argument('--workflow', help='AutoDL 原生格式配合 --request 时的 workflow ID（写在路径里）')
    parser.add_argument('--out', required=True, help='输出文件，禁止覆盖已有文件')
    parser.add_argument('--artifact', help='产物类型，如 video 或 audio；默认下载首个适用产物')
    parser.add_argument('--timeout', type=int, default=1800)
    parser.add_argument('--interval', type=int, default=5)
    args = parser.parse_args()
    if args.timeout <= 0 or args.interval <= 0:
        raise ValueError('timeout 和 interval 必须大于零')
    supported_artifacts = {'openai': ['video'], 'minimax': ['video', 'audio'], 'autodl': ['video', 'audio'], 'dashscope': ['video']}
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
        body = selected_examples[args.example]
    if not isinstance(body, dict):
        raise ValueError('JSON 请求必须是对象')
    if args.format == 'autodl':
        # AutoDL's own API names the workflow in the path, not in the body.
        workflow = args.example or args.workflow
        if not workflow:
            raise ValueError('AutoDL 原生格式需要 --workflow 指定 workflow ID')
        submit_path = '/autodl/api/v1/comfyui/comfyui_workflow/' + urllib.parse.quote(workflow, safe='')
    else:
        if args.workflow:
            raise ValueError('--workflow 只用于 --format autodl')
        if not body.get('model'):
            raise ValueError('JSON 请求必须包含 model')
        submit_path = SUBMIT_PATHS[args.format]
    if 'your-public-file-host.example' in json.dumps(body):
        raise ValueError('请将媒体占位 URL 替换为公开可下载的真实图片、音频或视频 URL / 标准 Data URL，再通过 --request 提交')
    output = pathlib.Path(args.out).expanduser().resolve()
    temporary = output.with_name(output.name + '.part')
    if output.exists() or temporary.exists():
        raise ValueError('输出文件或 .part 文件已存在，请选择其他 --out 路径')
    headers = {'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'}
    submit_headers = dict(headers, **({'X-DashScope-Async': 'enable'} if args.format == 'dashscope' else {}))
    deadline = time.monotonic() + args.timeout

    def call(method, path, payload=None, extra=None):
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise TimeoutError('客户端已达到截止时间；上游任务可能仍在运行')
        raw = None if payload is None else json.dumps(payload, ensure_ascii=False).encode()
        request = urllib.request.Request(base + path, data=raw, method=method, headers=extra or headers)
        try:
            with urllib.request.urlopen(request, timeout=min(60, remaining)) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            raise RuntimeError('New API HTTP ' + str(error.code) + '；请检查渠道 Token、价格、分组和工作流参数') from None

    submitted = call('POST', submit_path, body, submit_headers)
    public_id = _submitted_id(args.format, submitted)
    if not isinstance(public_id, str) or not public_id:
        raise RuntimeError('提交响应缺少 New API 公开 task_id')
    print('task_id: ' + public_id, flush=True)
    query_prefix = QUERY_PREFIXES[args.format]
    path = query_prefix + urllib.parse.quote(public_id, safe='')
    failures = 0
    while time.monotonic() < deadline:
        try:
            task = call('GET', path)
            task = _task_view(args.format, task)
            failures = 0
        except (RuntimeError, urllib.error.URLError, TimeoutError):
            failures += 1
            if failures >= 5:
                raise
            time.sleep(min(args.interval, max(0, deadline - time.monotonic())))
            continue
        status = task.get('status')
        print('status: ' + str(status), flush=True)
        if status in ['FAILURE', 'failed', 'cancelled', 'FAILED', 'CANCELED']:
            raise RuntimeError('任务失败，请查看任务错误信息：' + str(task.get('error') or task.get('fail_reason') or task.get('message') or status))
        if status in ['SUCCESS', 'succeeded', 'completed', 'SUCCEEDED']:
            if args.format in ['autodl', 'dashscope']:
                # Provider URLs are signed; never send the New API key to the media host.
                download = urllib.request.Request(_public_url(_result_url(args.format, task, args.artifact)))
            elif args.format == 'minimax':
                if args.artifact and task.get('modality', 'video') != args.artifact:
                    raise ValueError('MiniMax V2 返回的产物类型与 --artifact 不一致')
                # Official V2 returns a public provider URL. Never forward the
                # New API bearer token to the provider's media host.
                download = urllib.request.Request(_public_url((task.get('content') or {}).get('url')))
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


FORMATS = ['openai', 'minimax', 'autodl', 'dashscope']
SUBMIT_PATHS = {'openai': '/v1/videos', 'minimax': '/v2/video_generation', 'dashscope': '/autodl/api/v1/services/aigc/image2video/video-synthesis'}
QUERY_PREFIXES = {'openai': '/v1/videos/', 'minimax': '/v2/query/video_generation/', 'autodl': '/autodl/api/v1/comfyui/comfyui_workflow/result/', 'dashscope': '/autodl/api/v1/tasks/'}


def _submitted_id(fmt, submitted):
    if fmt == 'openai':
        return submitted.get('id')
    if fmt == 'minimax':
        return submitted.get('task_id')
    if fmt == 'autodl':
        return (submitted.get('data') or {}).get('task_id')
    return (submitted.get('output') or {}).get('task_id')


def _task_view(fmt, task):
    """Reduce each format's query response to a dict with `status` for the polling loop."""
    if fmt == 'minimax':
        task = task.get('task')
        if not isinstance(task, dict):
            raise RuntimeError('MiniMax V2 查询响应缺少 task 对象')
        return task
    if fmt == 'autodl':
        data = task.get('data')
        if not isinstance(data, dict):
            raise RuntimeError('AutoDL 查询响应缺少 data 对象')
        return data
    if fmt == 'dashscope':
        output = task.get('output')
        if not isinstance(output, dict):
            raise RuntimeError('DashScope 查询响应缺少 output 对象')
        return dict(output, status=output.get('task_status'))
    return task


def _result_url(fmt, task, artifact):
    if fmt == 'dashscope':
        return (task.get('results') or {}).get('video_url')
    for item in task.get('results') or []:
        if isinstance(item, dict) and (not artifact or item.get('type') == artifact):
            return item.get('url')
    raise RuntimeError('查询响应里没有所需类型的产物')


def _public_url(url):
    parsed = urllib.parse.urlsplit(url) if isinstance(url, str) else None
    if not parsed or parsed.scheme not in ['http', 'https'] or not parsed.hostname or parsed.username or parsed.password:
        raise RuntimeError('查询响应缺少公开 HTTP(S) 产物 URL')
    return url


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
