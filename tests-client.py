"""Verify submit request shapes with urlopen mocked; never contact a service.

Only the two remaining surfaces are exercised: OpenAI Videos and MiniMax V2.
"""
import importlib.util, io, json, os, pathlib, sys, tempfile
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('autodl_client', ROOT/'test-task.py')
client = importlib.util.module_from_spec(spec)
spec.loader.exec_module(client)
examples = json.loads((ROOT/'examples.json').read_text(encoding='utf-8'))
model = 'minimax_h3_lightx2v_no_pic'
motion = 'wan2.2animate-v4-motion_retargeting'
DIALECTS = ['openai', 'minimax']
SUBMIT_PATH = {'openai': '/v1/videos', 'minimax': '/v2/video_generation'}
QUERY_PATH = {'openai': '/v1/videos/task_test', 'minimax': '/v2/query/video_generation/task_test'}
class Captured(Exception): pass
checks = 0
with tempfile.TemporaryDirectory(prefix='autodl-client-qa-') as directory:
    folder = pathlib.Path(directory)
    # 1. Both dialects submit exactly the documented body to the documented path.
    for dialect in DIALECTS:
        expected = examples[model] if dialect == 'openai' else examples['_formats']['minimax'][model]
        path = SUBMIT_PATH[dialect]
        for source in ['example', 'request']:
            request_file = folder/(dialect+'.json')
            request_file.write_text(json.dumps(expected), encoding='utf-8')
            argv = ['test-task.py', '--'+source, model if source=='example' else str(request_file), '--out', str(folder/'output.mp4')]
            if dialect != 'openai': argv += ['--format', dialect]
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
    # 2. The removed surfaces are no longer selectable formats.
    for removed in ['autodl', 'dashscope', 'native']:
        with patch.dict(os.environ, {'NEW_API_KEY':'fake-newapi-key'}), patch.object(sys,'argv',['test-task.py','--format',removed,'--request',str(folder/'openai.json'),'--out',str(folder/'x.mp4')]), patch.object(client.urllib.request,'urlopen') as network:
            try: client.main()
            except (ValueError, SystemExit): checks += 1
            else: raise AssertionError(removed + ' format still accepted')
            network.assert_not_called()
    # 3. The removed official model aliases can no longer be selected.
    for alias in ['MiniMax-H3', 'MiniMax-H3-Max']:
        with patch.dict(os.environ, {'NEW_API_KEY':'fake-newapi-key'}), patch.object(sys,'argv',['test-task.py','--format','minimax','--example',alias,'--out',str(folder/'x.mp4')]), patch.object(client.urllib.request,'urlopen') as network:
            try: client.main()
            except (ValueError, SystemExit, KeyError): checks += 1
            else: raise AssertionError(alias + ' alias still accepted')
            network.assert_not_called()
# 4. Full submit -> poll -> download flow for both dialects.
with tempfile.TemporaryDirectory(prefix='autodl-client-flow-') as directory:
    folder = pathlib.Path(directory)
    for dialect in DIALECTS:
        path = SUBMIT_PATH[dialect]
        query = QUERY_PATH[dialect]
        video = 'https://cdn.example.com/result.mp4'
        result = {'openai': {'status':'completed'}, 'minimax': {'task':{'id':'task_test','status':'succeeded','content':{'url':video}}}}[dialect]
        calls = []
        def network(request, **kwargs):
            calls.append((request.get_method(), request.full_url))
            if request.get_method() == 'POST':
                assert request.full_url == 'https://newapi.example'+path
                assert request.headers['Authorization'] == 'Bearer fake-newapi-key'
                return io.BytesIO(json.dumps({'id' if dialect=='openai' else 'task_id':'task_test'}).encode())
            if request.full_url == 'https://newapi.example'+query:
                assert request.headers['Authorization'] == 'Bearer fake-newapi-key'
                return io.BytesIO(json.dumps(result).encode())
            if dialect == 'openai':
                assert request.full_url == 'https://newapi.example'+query+'/content'
                assert request.headers['Authorization'] == 'Bearer fake-newapi-key'
            else:
                assert request.full_url == video and not request.has_header('Authorization')
            return io.BytesIO(b'fake-video-content')
        output = folder/(dialect+'.mp4')
        argv = ['test-task.py','--format',dialect,'--example',model,'--out',str(output)]
        with patch.dict(os.environ,{'NEW_API_BASE_URL':'https://newapi.example','NEW_API_KEY':'fake-newapi-key'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',network):
            client.main()
        assert output.read_bytes() == b'fake-video-content' and len(calls) == 3
        assert not output.with_name(output.name+'.part').exists()
        checks += 1
# 5. Audit regressions never submit a real job: all urlopen calls are replaced.
spec = importlib.util.spec_from_file_location('autodl_video_client', ROOT/'test-video.py')
video_client = importlib.util.module_from_spec(spec)
spec.loader.exec_module(video_client)
with tempfile.TemporaryDirectory(prefix='autodl-client-audit-') as directory:
    folder = pathlib.Path(directory)
    for dialect in DIALECTS:
        argv = ['test-task.py','--format',dialect,'--example',model,'--artifact','not-a-type','--out',str(folder/'invalid.mp4')]
        with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen') as network:
            try: client.main()
            except ValueError as error: assert '--artifact' in str(error)
            else: raise AssertionError('Invalid artifact option accepted')
            network.assert_not_called(); checks += 1
    # A MiniMax audio workflow keeps its modality and downloads the audio artifact.
    request_file = folder/'tts.json'
    request_file.write_text(json.dumps({'model':'indextts2-v1','content':[{'type':'text','text':'Hello'},{'type':'audio_url','role':'reference_audio','audio_url':{'url':'https://cdn.example.com/reference.wav'}}]}),encoding='utf-8')
    audio_url = 'https://cdn.example.com/result.wav'
    output = folder/'result.wav'
    def audio_network(request, **kwargs):
        if request.get_method() == 'POST': return io.BytesIO(b'{"task_id":"task_audio"}')
        if request.full_url.endswith('/v2/query/video_generation/task_audio'): return io.BytesIO(json.dumps({'task':{'status':'succeeded','modality':'audio','content':{'url':audio_url}}}).encode())
        assert request.full_url == audio_url and not request.has_header('Authorization')
        return io.BytesIO(b'fake-audio')
    argv = ['test-task.py','--format','minimax','--request',str(request_file),'--artifact','audio','--out',str(output)]
    with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',audio_network): client.main()
    assert output.read_bytes() == b'fake-audio'; checks += 1
    output = folder/'existing.mp4'; part = folder/'existing.mp4.part'; part.write_bytes(b'other-download')
    with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',['test-video.py','--out',str(output)]),patch.object(video_client.urllib.request,'urlopen') as network:
        try: video_client.main()
        except ValueError: pass
        else: raise AssertionError('Existing partial download accepted')
        network.assert_not_called(); assert part.read_bytes() == b'other-download'; checks += 1
    for race in ['output','part']:
        output = folder/(race+'.mp4'); part = output.with_name(output.name+'.part')
        def race_network(request, **kwargs):
            if request.get_method() == 'POST': return io.BytesIO(b'{"id":"task_test"}')
            if request.full_url.endswith('/content'):
                if race == 'output': output.write_bytes(b'concurrent-output')
                return io.BytesIO(b'fake-video')
            if race == 'part': part.write_bytes(b'concurrent-part')
            return io.BytesIO(b'{"status":"completed"}')
        with patch.dict(os.environ,{'NEW_API_KEY':'fake'}),patch.object(sys,'argv',['test-video.py','--out',str(output)]),patch.object(video_client.urllib.request,'urlopen',race_network):
            try: video_client.main()
            except FileExistsError: pass
            else: raise AssertionError('Concurrent file overwritten')
        if race == 'output': assert output.read_bytes() == b'concurrent-output' and not part.exists()
        else: assert part.read_bytes() == b'concurrent-part' and not output.exists()
        checks += 1
# 6. Inline input must survive client serialization unchanged for both formats.
with tempfile.TemporaryDirectory(prefix='autodl-inline-client-') as directory:
    folder = pathlib.Path(directory)
    image = 'data:image/png;base64,AAAA'
    audio = 'data:audio/wav;base64,AAAA'
    video = 'data:video/mp4;base64,AAAA'
    cases = {
        'openai': {'model': motion, 'seconds': 1, 'input_reference': {'image_url': image}, 'videos': [video]},
        'minimax': {'model': motion, 'duration': 1, 'content': [
            {'type':'image_url','role':'reference_image','image_url':{'url':image}},
            {'type':'video_url','role':'reference_video','video_url':{'url':video}}]},
        'openai-audio': {'model':'minimax_h3_image_audio_to_video_v2','input_reference':{'image_url':image},'audios':[audio],'prompt':'Hello','seconds':1},
        'minimax-audio': {'model':'minimax_h3_image_audio_to_video_v2','duration':1,'content':[
            {'type':'text','text':'Hello'},
            {'type':'audio_url','role':'reference_audio','audio_url':{'url':audio}}]},
    }
    for case, expected in cases.items():
        dialect = case.split('-')[0]
        request_file = folder/(case+'.json')
        request_file.write_text(json.dumps(expected), encoding='utf-8')
        argv = ['test-task.py','--format',dialect,'--request',str(request_file),'--out',str(folder/(case+'.mp4'))]
        def capture_inline(request, _path=SUBMIT_PATH[dialect], _expected=expected, **kwargs):
            assert request.full_url == 'https://newapi.example'+_path
            assert request.get_method() == 'POST'
            assert json.loads(request.data) == _expected
            raise Captured()
        with patch.dict(os.environ,{'NEW_API_BASE_URL':'https://newapi.example','NEW_API_KEY':'fake-newapi-key'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',capture_inline):
            try: client.main()
            except Captured: checks += 1
            else: raise AssertionError('Expected inline input capture')
# 7. Motion transfer declares its billed seconds in the request body, never a query.
with tempfile.TemporaryDirectory(prefix='autodl-billing-client-') as directory:
    folder = pathlib.Path(directory)
    declarations = {
        'openai': {'model': motion, 'seconds': 3.25, 'input_reference': {'image_url': 'https://cdn.example/a.png'}, 'videos': ['https://cdn.example/a.mp4']},
        'minimax': {'model': motion, 'duration': 3.25, 'content': [{'type':'image_url','role':'reference_image','image_url':{'url':'https://cdn.example/a.png'}},{'type':'video_url','role':'reference_video','video_url':{'url':'https://cdn.example/a.mp4'}}]},
    }
    for dialect, body in declarations.items():
        request_file = folder/(dialect+'-motion.json')
        request_file.write_text(json.dumps(body), encoding='utf-8')
        def capture_billing(request, _path=SUBMIT_PATH[dialect], _body=body, **kwargs):
            assert request.full_url == 'https://newapi.example'+_path
            assert '?' not in request.full_url
            assert json.loads(request.data) == _body
            raise Captured()
        argv = ['test-task.py','--format',dialect,'--request',str(request_file),'--out',str(folder/'motion.mp4')]
        with patch.dict(os.environ,{'NEW_API_BASE_URL':'https://newapi.example','NEW_API_KEY':'fake-key'}),patch.object(sys,'argv',argv),patch.object(client.urllib.request,'urlopen',capture_billing):
            try: client.main()
            except Captured: checks += 1
            else: raise AssertionError('expected motion declaration capture')
print(f'PASS: {checks} zero-network client request, full-flow and audit checks')
