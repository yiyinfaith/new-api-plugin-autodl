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
    choice.add_argument('--request', help='统一参数请求 JSON 文件')
    choice.add_argument('--example', help='examples.json 中的官网工作流 ID；必需媒体要先替换为真实 URL')
    parser.add_argument('--format', choices=['openai', 'minimax', 'autodl'], default='openai', help='请求格式；默认保持现有 OpenAI 格式')
    parser.add_argument('--model', help='AutoDL 原生 --request 请求的官网工作流 ID，放在 URL 中，不加入 body')
    parser.add_argument('--out', required=True, help='输出文件，禁止覆盖已有文件')
    parser.add_argument('--artifact', help='产物 key，默认下载第一个')
    parser.add_argument('--timeout', type=int, default=1800)
    parser.add_argument('--interval', type=int, default=5)
    args = parser.parse_args()
    if args.timeout <= 0 or args.interval <= 0:
        raise ValueError('timeout 和 interval 必须大于零')
    base = os.environ.get('NEW_API_BASE_URL', 'http://127.0.0.1:3000').rstrip('/')
    key = os.environ.get('NEW_API_KEY', '').strip()
    if not key:
        raise ValueError('请设置 NEW_API_KEY 为 New API 的 API 密钥')
    if args.request:
        body = json.loads(pathlib.Path(args.request).read_text(encoding='utf-8-sig'))
    else:
        examples = json.loads(pathlib.Path(__file__).with_name('examples.json').read_text(encoding='utf-8'))
        if args.example not in examples:
            raise ValueError('工作流 ID 未列入 examples.json')
        if args.format == 'openai':
            body = examples[args.example]
        else:
            body = examples['_formats'][args.format][args.example]
            if args.format == 'autodl':
                body = body['body']
    if not isinstance(body, dict):
        raise ValueError('JSON 请求必须是对象')
    submit_path = '/autodl/v1/tasks' if args.format == 'minimax' else '/v1/tasks/autodl'
    if args.format == 'autodl':
        model = args.model or args.example
        if not model:
            raise ValueError('AutoDL 原生 --request 必须同时提供 --model 工作流 ID')
        submit_path = '/autodl/v1/raw/' + urllib.parse.quote(model, safe='')
    elif not body.get('model'):
        raise ValueError('JSON 请求必须包含 model')
    if 'your-public-file-host.example' in json.dumps(body):
        raise ValueError('请将媒体占位 URL 替换为公开可下载的真实图片、音频或视频 URL，再通过 --request 提交')
    output = pathlib.Path(args.out).expanduser().resolve()
    temporary = output.with_name(output.name + '.part')
    if output.exists() or temporary.exists():
        raise ValueError('输出文件或 .part 文件已存在，请选择其他 --out 路径')
    headers = {'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'}
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
    public_id = submitted.get('task_id')
    if not isinstance(public_id, str) or not public_id:
        raise RuntimeError('提交响应缺少 New API 公开 task_id')
    print('task_id: ' + public_id, flush=True)
    path = '/v1/tasks/' + urllib.parse.quote(public_id, safe='')
    failures = 0
    while time.monotonic() < deadline:
        try:
            task = call('GET', path)
            failures = 0
        except (RuntimeError, urllib.error.URLError, TimeoutError):
            failures += 1
            if failures >= 5:
                raise
            time.sleep(min(args.interval, max(0, deadline - time.monotonic())))
            continue
        status = task.get('status')
        print('status: ' + str(status), flush=True)
        if status == 'FAILURE':
            raise RuntimeError('任务失败，请查看 New API 任务记录中的 fail_reason')
        if status == 'SUCCESS':
            items = call('GET', path + '/artifacts').get('artifacts', [])
            artifact = next((item for item in items if not args.artifact or item.get('key') == args.artifact), None)
            if not artifact:
                raise RuntimeError('没有匹配的产物')
            content = path + '/artifacts/' + urllib.parse.quote(artifact['key'], safe='') + '/content'
            created = False
            try:
                with temporary.open('xb') as file:
                    created = True
                    with urllib.request.urlopen(urllib.request.Request(base + content, headers=headers), timeout=60) as response:
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
