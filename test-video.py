"""Submit -> bounded polling -> authenticated video download. Python standard library only."""
import argparse, json, os, pathlib, sys, time, urllib.error, urllib.request

def main():
    p = argparse.ArgumentParser(description='通过 New API 的 AutoDL 插件生成并下载视频')
    p.add_argument('--prompt',default='一只猫在雪地中奔跑')
    p.add_argument('--model',default='minimax_h3_lightx2v_no_pic')
    p.add_argument('--input-reference',action='append',default=[],metavar='IMAGE_URL',help='公开 HTTP(S) 图片 URL；多图时重复此选项，按顺序生成 input_reference 字符串数组')
    p.add_argument('--seconds',type=int,default=5)
    p.add_argument('--size',default='864x480')
    p.add_argument('--out',default='autodl-result.mp4')
    p.add_argument('--timeout',type=int,default=1800)
    p.add_argument('--interval',type=int,default=5)
    args=p.parse_args()
    base=os.environ.get('NEW_API_BASE_URL','http://127.0.0.1:3000').rstrip('/')
    key=os.environ.get('NEW_API_KEY','').strip()
    if not key:raise ValueError('请设置 NEW_API_KEY 为你的 New API API 密钥')
    if args.timeout<=0 or args.interval<=0:raise ValueError('timeout 和 interval 必须大于零')
    output=pathlib.Path(args.out).expanduser().resolve()
    if output.exists():raise ValueError('输出文件已存在，请通过 --out 选择其他路径')
    headers={'Authorization':'Bearer '+key,'Content-Type':'application/json'}
    def call(method,path,body=None):
        raw=None if body is None else json.dumps(body,ensure_ascii=False).encode()
        try:
            with urllib.request.urlopen(urllib.request.Request(base+path,data=raw,method=method,headers=headers),timeout=60) as r:return json.load(r)
        except urllib.error.HTTPError as e:
            # Do not print request headers, keys, or the complete upstream payload.
            raise RuntimeError('New API HTTP '+str(e.code)+'；请检查渠道 Token、模型价格、分组和请求参数') from None
    body={'model':args.model,'prompt':args.prompt,'seconds':str(args.seconds),'size':args.size}
    if args.input_reference:
        body['input_reference']=args.input_reference[0] if len(args.input_reference)==1 else args.input_reference
    task=call('POST','/v1/videos',body)
    task_id=task.get('id')
    if not isinstance(task_id,str) or not task_id:raise RuntimeError('New API 提交响应缺少公开任务 ID')
    print('task_id: '+task_id,flush=True)
    deadline=time.monotonic()+args.timeout
    errors=0
    path='/v1/videos/'+urllib.parse.quote(task_id,safe='')
    while time.monotonic()<deadline:
        try:task=call('GET',path);errors=0
        except (RuntimeError,urllib.error.URLError,TimeoutError):
            errors+=1
            if errors>=5:raise
            time.sleep(args.interval);continue
        status=task.get('status');print('status: '+str(status),flush=True)
        if status=='failed':raise RuntimeError('视频任务失败，请检查 New API 任务记录中的 fail_reason')
        if status=='completed':
            temporary=output.with_name(output.name+'.part')
            if temporary.exists():raise RuntimeError('临时下载文件已存在，请选择其他 --out 路径')
            try:
                with urllib.request.urlopen(urllib.request.Request(base+path+'/content',headers=headers),timeout=60) as r, temporary.open('xb') as f:
                    while True:
                        chunk=r.read(1024*1024)
                        if not chunk:break
                        f.write(chunk)
                if temporary.stat().st_size==0:raise RuntimeError('下载的视频为空')
                temporary.rename(output)
            except Exception:
                temporary.unlink(missing_ok=True);raise
            print('已保存：'+str(output));return
        time.sleep(args.interval)
    raise TimeoutError('客户端轮询达到截止时间；New API / AutoDL 上游任务可能仍在运行')

if __name__=='__main__':
    try:main()
    except Exception as e:print(str(e),file=sys.stderr);sys.exit(1)
