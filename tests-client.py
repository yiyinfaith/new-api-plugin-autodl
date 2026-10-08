"""Verify submit request shapes with urlopen mocked; never contact a service."""
import importlib.util, io, json, os, pathlib, sys, tempfile
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('autodl_client', ROOT/'test-task.py')
client = importlib.util.module_from_spec(spec)
spec.loader.exec_module(client)
examples = json.loads((ROOT/'examples.json').read_text(encoding='utf-8'))
model = 'minimax_h3_lightx2v_no_pic'
class Captured(Exception): pass
checks = 0
with tempfile.TemporaryDirectory(prefix='autodl-client-qa-') as directory:
    folder = pathlib.Path(directory)
    for dialect in ['openai', 'minimax', 'autodl']:
        expected = examples[model] if dialect == 'openai' else examples['_formats'][dialect][model]
        if dialect == 'autodl': expected = expected['body']
        path = {'openai': '/v1/videos', 'minimax': '/v2/video_generation', 'autodl': '/api/v1/comfyui/comfyui_workflow/'+model}[dialect]
        for source in ['example', 'request']:
            request_file = folder/(dialect+'.json')
            request_file.write_text(json.dumps(expected), encoding='utf-8')
            argv = ['test-task.py', '--'+source, model if source=='example' else str(request_file), '--out', str(folder/'output.mp4')]
            if dialect != 'openai': argv += ['--format', dialect]
            if dialect == 'autodl' and source == 'request': argv += ['--model', model]
            def capture(request, **kwargs):
                assert request.full_url == 'https://newapi.example'+path
                assert request.method == 'POST'
                assert request.headers['Authorization'] == 'Bearer fake-newapi-key'
                assert json.loads(request.data) == expected
                raise Captured()
            with patch.dict(os.environ, {'NEW_API_BASE_URL': 'https://newapi.example', 'NEW_API_KEY':'fake-newapi-key'}), patch.object(sys, 'argv', argv), patch.object(client.urllib.request, 'urlopen', capture):
                try: client.main()
                except Captured: checks += 1
                else: raise AssertionError('Expected submit capture')
    for alias in ['MiniMax-H3', 'MiniMax-H3-Max']:
        expected = examples['_formats']['minimax'][alias]
        def capture_alias(request, **kwargs):
            assert request.full_url == 'https://newapi.example/v2/video_generation'
            assert json.loads(request.data) == expected
            raise Captured()
        argv = ['test-task.py', '--format', 'minimax', '--example', alias, '--out', str(folder/'output.mp4')]
        with patch.dict(os.environ, {'NEW_API_BASE_URL':'https://newapi.example', 'NEW_API_KEY':'fake-newapi-key'}), patch.object(sys, 'argv', argv), patch.object(client.urllib.request, 'urlopen', capture_alias):
            try: client.main()
            except Captured: checks += 1
            else: raise AssertionError('Expected official alias capture')
    with patch.dict(os.environ, {'NEW_API_KEY':'fake-newapi-key'}), patch.object(sys,'argv',['test-task.py','--format','autodl','--request',str(folder/'autodl.json'),'--out',str(folder/'output.mp4')]), patch.object(client.urllib.request,'urlopen') as network:
        try: client.main()
        except ValueError as error: assert '--model' in str(error); checks += 1
        else: raise AssertionError('Missing raw URL model accepted')
        network.assert_not_called()
with tempfile.TemporaryDirectory(prefix='autodl-client-flow-') as directory:
    folder = pathlib.Path(directory)
    for dialect in ['openai', 'minimax', 'autodl']:
        path = {'openai': '/v1/videos', 'minimax': '/v2/video_generation', 'autodl': '/api/v1/comfyui/comfyui_workflow/'+model}[dialect]
        query = {'openai': '/v1/videos/task_test', 'minimax': '/v2/query/video_generation/task_test', 'autodl': '/api/v1/comfyui/comfyui_workflow/result/task_test'}[dialect]
        video = 'https://cdn.example.com/result.mp4'
        result = {'openai': {'status':'completed'}, 'minimax': {'task':{'id':'task_test','status':'succeeded','content':{'url':video}}}, 'autodl': {'task_id':'task_test','status':'SUCCESS','results':[{'url':video,'type':'video'}]}}[dialect]
        calls = []
        def network(request, **kwargs):
            calls.append((request.get_method(),request.full_url))
            if request.get_method() == 'POST':
                assert request.full_url=='https://newapi.example'+path
                assert request.headers['Authorization']=='Bearer fake-newapi-key'
                return io.BytesIO(json.dumps({'id' if dialect=='openai' else 'task_id':'task_test'}).encode())
            if request.full_url=='https://newapi.example'+query:
                assert request.headers['Authorization']=='Bearer fake-newapi-key'
                return io.BytesIO(json.dumps(result).encode())
            if dialect=='openai':
                assert request.full_url=='https://newapi.example'+query+'/content'
                assert request.headers['Authorization']=='Bearer fake-newapi-key'
            else:
                assert request.full_url==video and not request.has_header('Authorization')
            return io.BytesIO(b'fake-video-content')
        output=folder/(dialect+'.mp4')
        argv=['test-task.py','--format',dialect,'--example',model,'--out',str(output)]
        with patch.dict(os.environ,{'NEW_API_BASE_URL':'https://newapi.example','NEW_API_KEY':'fake-newapi-key'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',network):
            client.main()
        assert output.read_bytes()==b'fake-video-content' and len(calls)==3
        assert not output.with_name(output.name+'.part').exists()
        checks+=1

# Audit regressions never submit a real job: all urlopen calls are replaced.
spec = importlib.util.spec_from_file_location('autodl_video_client', ROOT/'test-video.py')
video_client = importlib.util.module_from_spec(spec)
spec.loader.exec_module(video_client)
with tempfile.TemporaryDirectory(prefix='autodl-client-audit-') as directory:
    folder = pathlib.Path(directory)
    for dialect in ['openai', 'minimax', 'autodl']:
        argv=['test-task.py','--format',dialect,'--example',model,'--artifact','not-a-type','--out',str(folder/'invalid.mp4')]
        with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen') as network:
            try:client.main()
            except ValueError as error:assert '--artifact' in str(error)
            else:raise AssertionError('Invalid artifact option accepted')
            network.assert_not_called();checks+=1
    request_file=folder/'tts.json'
    request_file.write_text(json.dumps({'model':'indextts2-v1','content':[{'type':'text','text':'Hello'},{'type':'audio_url','role':'reference_audio','audio_url':{'url':'https://cdn.example.com/reference.wav'}}]}),encoding='utf-8')
    audio_url='https://cdn.example.com/result.wav'
    output=folder/'result.wav'
    def audio_network(request,**kwargs):
        if request.get_method()=='POST':return io.BytesIO(b'{"task_id":"task_audio"}')
        if request.full_url.endswith('/v2/query/video_generation/task_audio'):return io.BytesIO(json.dumps({'task':{'status':'succeeded','modality':'audio','content':{'url':audio_url}}}).encode())
        assert request.full_url==audio_url and not request.has_header('Authorization')
        return io.BytesIO(b'fake-audio')
    argv=['test-task.py','--format','minimax','--request',str(request_file),'--artifact','audio','--out',str(output)]
    with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',audio_network):client.main()
    assert output.read_bytes()==b'fake-audio';checks+=1
    output=folder/'existing.mp4';part=folder/'existing.mp4.part';part.write_bytes(b'other-download')
    with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',['test-video.py','--out',str(output)]),patch.object(video_client.urllib.request,'urlopen') as network:
        try:video_client.main()
        except ValueError:pass
        else:raise AssertionError('Existing partial download accepted')
        network.assert_not_called();assert part.read_bytes()==b'other-download';checks+=1
    for race in ['output','part']:
        output=folder/(race+'.mp4');part=output.with_name(output.name+'.part')
        def race_network(request,**kwargs):
            if request.get_method()=='POST':return io.BytesIO(b'{"id":"task_test"}')
            if request.full_url.endswith('/content'):
                if race=='output':output.write_bytes(b'concurrent-output')
                return io.BytesIO(b'fake-video')
            if race=='part':part.write_bytes(b'concurrent-part')
            return io.BytesIO(b'{"status":"completed"}')
        with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',['test-video.py','--out',str(output)]),patch.object(video_client.urllib.request,'urlopen',race_network):
            try:video_client.main()
            except FileExistsError:pass
            else:raise AssertionError('Concurrent file overwritten')
        if race=='output':assert output.read_bytes()==b'concurrent-output' and not part.exists()
        else:assert part.read_bytes()==b'concurrent-part' and not output.exists()
        checks+=1
with tempfile.TemporaryDirectory(prefix='autodl-dashscope-client-') as directory:
    folder = pathlib.Path(directory)
    wan = 'wan2.2-animate-move'
    body = examples['_formats']['dashscope'][wan]
    request_file = folder/'dashscope.json'
    request_file.write_text(json.dumps(body), encoding='utf-8')
    for source in ['example', 'request']:
        argv = ['test-task.py', '--format', 'dashscope', '--'+source, wan if source=='example' else str(request_file), '--out', str(folder/'capture.mp4')]
        def capture_dash(request, **kwargs):
            assert request.full_url == 'https://newapi.example/api/v1/services/aigc/image2video/video-synthesis'
            assert request.get_header('X-dashscope-async') == 'enable'
            assert request.get_header('Authorization') == 'Bearer fake-newapi-key'
            assert json.loads(request.data) == body
            raise Captured()
        with patch.dict(os.environ, {'NEW_API_BASE_URL':'https://newapi.example','NEW_API_KEY':'fake-newapi-key'}), patch.object(sys,'argv',argv), patch.object(client.urllib.request,'urlopen',capture_dash):
            try: client.main()
            except Captured: checks += 1
            else: raise AssertionError('Expected DashScope submit capture')
    output = folder/'dashscope.mp4'
    states = iter(['PENDING', 'RUNNING', 'SUCCEEDED'])
    calls = []
    def dash_network(request, **kwargs):
        calls.append(request.full_url)
        if request.get_method()=='POST':
            return io.BytesIO(b'{"output":{"task_status":"PENDING","task_id":"task_dash"},"request_id":""}')
        if request.full_url == 'https://newapi.example/api/v1/tasks/task_dash':
            assert request.get_header('Authorization')=='Bearer fake-newapi-key'
            result={'task_id':'task_dash','task_status':next(states)}
            if result['task_status']=='SUCCEEDED':result['results']={'video_url':'https://cdn.example.com/result.mp4'}
            return io.BytesIO(json.dumps({'output':result,'request_id':''}).encode())
        assert request.full_url=='https://cdn.example.com/result.mp4'
        assert not request.has_header('Authorization') and not request.has_header('X-dashscope-async')
        return io.BytesIO(b'fake-dashscope-video')
    argv=['test-task.py','--format','dashscope','--request',str(request_file),'--out',str(output),'--interval','1']
    with patch.dict(os.environ, {'NEW_API_BASE_URL':'https://newapi.example','NEW_API_KEY':'fake-newapi-key'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',dash_network),patch.object(client.time,'sleep'):
        client.main()
    assert output.read_bytes()==b'fake-dashscope-video' and len(calls)==5
    checks+=1
    for status in ['FAILED','CANCELED']:
        def failed_dash(request, **kwargs):
            if request.get_method()=='POST':return io.BytesIO(b'{"output":{"task_id":"task_dash"}}')
            return io.BytesIO(json.dumps({'output':{'task_status':status,'message':'actual failure'}}).encode())
        argv=['test-task.py','--format','dashscope','--request',str(request_file),'--out',str(folder/(status+'.mp4'))]
        with patch.dict(os.environ,{'NEW_API_KEY':'fake-newapi-key'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',failed_dash):
            try:client.main()
            except RuntimeError as error:assert 'actual failure' in str(error)
            else:raise AssertionError('DashScope failed task accepted')
        checks+=1
print(f'PASS: {checks} zero-network client request, full-flow and audit checks')
