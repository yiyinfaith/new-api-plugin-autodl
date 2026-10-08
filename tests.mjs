// Development runner only; the installed plugin has no Node dependencies.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const read = name => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
globalThis.utils = { unixNow: () => 2000 };
const p = await import('data:text/javascript;base64,' + readFileSync(new URL('./plugin.js', import.meta.url)).toString('base64'));
const catalog = read('./workflows.json').workflows;
const examples = read('./examples.json');
const official = read('./official-workflows.json');
const fixtures = [];
let checks = 0;
function test(name, fn) { fn(); checks++; }
function fixture(name, hook, args, expected) { assert.deepEqual(p[hook](...args), expected, name); fixtures.push({ name, hook, args, expected }); checks++; }
function reject(name, hook, args, expectedError) { assert.throws(() => p[hook](...args), e => e.message.includes(expectedError), name); fixtures.push({ name, hook, args, expectedError }); checks++; }
const base = { baseUrl: 'https://autodl.art/', apiKey: 'fake-autodl-token', authHeader: 'Bearer fake-autodl-token' };
const ctx = (model, requestBody = examples[model]) => ({ ...base, model, upstreamModel: model, requestBody });
const envelope = (status, results = [], extras = {}) => ({ code: 'Success', data: { task_id: 'upstream-123', status, results, ...extras } });
test('exact official catalog coverage', () => {
  assert.equal(official.length, 17);
  assert.deepEqual(Object.values(catalog).map(c => c.workflowId).sort(), official.map(c => c.uuid).sort());
  assert.deepEqual(p.meta.models.sort(), Object.keys(catalog).sort());
  assert.equal(p.meta.protocols[0].models.length, 16);
  assert.ok(!p.meta.protocols[0].models.includes('indextts2-v1'));
});
for (const [model, config] of Object.entries(catalog)) {
  const source = official.find(row => row.uuid === config.workflowId);
  const input = examples[model];
  const expectedBody = {};
  const expectedFacts = { requests: 1 };
  const promptField = ['prompt', 'prompt_text'].find(k => source.input_rules[k]);
  const secondsField = ['duration', 'audio_duration'].find(k => source.input_rules[k]);
  if (promptField) expectedBody[promptField] = input.prompt;
  if (secondsField) { expectedBody[secondsField] = input.seconds; expectedFacts.seconds = input.seconds; }
  if (source.input_rules.resolution) {
    expectedBody.resolution = source.input_rules.resolution.default;
    expectedFacts.resolution = input.resolution; expectedFacts.orientation = input.orientation;
  }
  for (const kind of ['images', 'audios', 'videos']) for (let i = 0; i < (input[kind] || []).length; i++) expectedBody[config[kind][i]] = input[kind][i];
  if (config.type === 'audio') expectedBody.emo_control_method = '与音色参考音频相同';
  const action = config.type === 'audio' ? 'text_to_audio' : input.videos?.length ? 'video_to_video' : input.images?.length ? 'image_to_video' : 'text_to_video';
  fixture(model + ': official submit mapping', 'buildSubmitRequest', [ctx(model)], {
    url: 'https://autodl.art/api/v1/comfyui/comfyui_workflow/' + encodeURIComponent(source.uuid), method: 'POST', action,
    headers: { Authorization: base.apiKey, 'Content-Type': 'application/json' }, body: expectedBody,
  });
  fixture(model + ': billing facts', 'extractUsage', [ctx(model)], expectedFacts);
  fixture(model + ': query URL', 'buildQueryRequest', [{ ...ctx(model), taskId: 'upstream-123' }], {
    url: 'https://autodl.art/api/v1/comfyui/comfyui_workflow/result/upstream-123', method: 'GET', headers: { Authorization: base.apiKey, 'Content-Type': 'application/json' },
  });
  if (secondsField) {
    const rule = source.input_rules[secondsField];
    for (const seconds of [rule.min, rule.max]) fixture(model + ': seconds ' + seconds, 'extractUsage', [ctx(model, { ...input, seconds })], { ...expectedFacts, seconds });
    for (const seconds of [rule.min - 1, rule.max + 1, 1.5, false, null, '', 'abc']) reject(model + ': reject seconds ' + JSON.stringify(seconds), 'extractUsage', [ctx(model, { ...input, seconds })], 'seconds must');
  } else reject(model + ': no seconds control', 'buildSubmitRequest', [ctx(model, { ...input, seconds: 5 })], 'no seconds control');
  for (const choice of config.resolutions) {
    assert.ok(source.input_rules.resolution.options.some(o => o.label === choice.upstream));
    const mapped = { ...expectedBody, resolution: choice.upstream };
    fixture(model + ': resolution ' + choice.upstream, 'buildSubmitRequest', [ctx(model, { ...input, resolution: choice.resolution, orientation: choice.orientation })], {
      url: 'https://autodl.art/api/v1/comfyui/comfyui_workflow/' + encodeURIComponent(source.uuid), method: 'POST', action,
      headers: { Authorization: base.apiKey, 'Content-Type': 'application/json' }, body: mapped,
    });
    if (choice.size) fixture(model + ': size ' + choice.size, 'extractUsage', [ctx(model, { ...input, resolution: choice.resolution, orientation: choice.orientation, size: choice.size })], { ...expectedFacts, resolution: choice.resolution, orientation: choice.orientation });
  }
  reject(model + ': invalid resolution', 'buildSubmitRequest', [ctx(model, { ...input, resolution: '720p' })], config.resolutions.length ? 'unsupported resolution' : 'no resolution');
  for (const kind of ['images', 'audios', 'videos']) {
    reject(model + ': media count ' + kind, 'buildSubmitRequest', [ctx(model, { ...input, [kind]: Array(config[kind].length + 1).fill('https://cdn.example.com/a') })], 'too many ' + kind);
    for (let i = 0; i < config[kind].length; i++) if (source.input_rules[config[kind][i]].required) {
      const values = [...(input[kind] || [])]; values[i] = null;
      reject(model + ': required ' + kind + '[' + i + ']', 'buildSubmitRequest', [ctx(model, { ...input, [kind]: values })], kind + '[' + i + '] is required');
    }
    if (config[kind].length) {
      test(model + ': all optional media slots map', () => {
        const values = Array(config[kind].length).fill('https://cdn.example.com/reference');
        const result = p.buildSubmitRequest(ctx(model, { ...input, [kind]: values }));
        for (const key of config[kind]) assert.equal(result.body[key], values[0]);
      });
    }
  }
  if (source.input_rules.seed) {
    const seed = source.input_rules.seed.min;
    test(model + ': seed range', () => assert.equal(p.buildSubmitRequest(ctx(model, { ...input, seed })).body.seed, seed));
    reject(model + ': invalid seed', 'buildSubmitRequest', [ctx(model, { ...input, seed: source.input_rules.seed.max + 1 })], 'seed must');
  } else reject(model + ': no seed control', 'buildSubmitRequest', [ctx(model, { ...input, seed: 1 })], 'no seed control');
  const state = { facts: expectedFacts, type: config.type, submittedAt: 2000, timeoutSeconds: 1800, workflowId: config.workflowId };
  test(model + ': submit persists facts and media type', () => {
    assert.deepEqual(p.parseSubmitResponse(ctx(model), { statusCode: 200, body: envelope('QUEUED') }).state, state);
    assert.equal(p.native.create({ body: { kind: 'json', value: input } }).action, action);
  });
  const query = { ...ctx(model), taskId: 'upstream-123', state };
  const output = envelope('completed', [{ url: 'https://cdn.example.com/out', type: config.type, file_type: config.type === 'audio' ? 'wav' : 'mp4' }], { duration: 196 });
  fixture(model + ': successful result', 'parseTaskResult', [query, output, { status: 200 }], { status: 'SUCCESS', progress: '100%', url: 'https://cdn.example.com/out' });
  fixture(model + ': processing duration is not output seconds', 'extractUsageOnComplete', [query, { status: 'SUCCESS' }, output], expectedFacts);
  fixture(model + ': failed usage zeroed', 'extractUsageOnComplete', [query, { status: 'FAILURE' }, output], { ...expectedFacts, requests: 0, ...(secondsField ? { seconds: 0 } : {}) });
  const task = { status: 'SUCCESS', action, data: output };
  fixture(model + ': output artifact', 'listArtifacts', [task], [{ key: config.type, type: config.type, mimeType: config.type === 'audio' ? 'audio/wav' : 'video/mp4' }]);
  for (const method of ['GET', 'HEAD']) fixture(model + ': credentialless ' + method, 'buildContentRequest', [{ ...query, action, data: output, artifactKey: config.type, clientRequest: { method, headers: { Range: 'bytes=0-31' } } }], { url: 'https://cdn.example.com/out', method: 'GET', credentialless: true });
}
const model = 'minimax_h3_lightx2v_no_pic', context = ctx(model);
const signedURL = 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/example.mp4?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Signature=fake-signature-for-qa';
const contentContext = { ...context, action: 'text_to_video', artifactKey: 'video', data: envelope('SUCCESS', [{ url: signedURL, type: 'video', file_type: 'mp4' }]) };
for (const method of ['GET', 'HEAD']) fixture('TOS signed URL preserved for ' + method, 'buildContentRequest', [{ ...contentContext, clientRequest: { method, headers: {} } }], { url: signedURL, method: 'GET', credentialless: true });
reject('content rejects unsupported method', 'buildContentRequest', [{ ...contentContext, clientRequest: { method: 'POST', headers: {} } }], 'content only supports GET and HEAD');
const query = { ...context, taskId: 'upstream-123', state: { facts: { requests: 1, seconds: 5, resolution: '768p', orientation: 'portrait' }, submittedAt: 4102444800, timeoutSeconds: 1800 } };
test('channel alias resolves upstream model', () => assert.equal(p.buildSubmitRequest({ ...context, model: 'public-alias' }).body.duration, 5));
fixture('legacy H3 fields remain compatible', 'extractUsage', [ctx(model, { prompt: 'x', duration: 6, resolution: '480p横' })], { requests: 1, seconds: 6, resolution: '480p', orientation: 'landscape' });
reject('legacy duration conflict', 'extractUsage', [ctx(model, { prompt: 'x', seconds: 5, duration: 6 })], 'seconds and duration conflict');
reject('unsupported 720p size', 'extractUsage', [ctx(model, { prompt: 'x', size: '1280x720' })], 'unsupported size');
reject('size resolution conflict', 'extractUsage', [ctx(model, { prompt: 'x', size: '864x480', resolution: '768p' })], 'size, resolution and orientation conflict');
reject('reject blank prompt', 'buildSubmitRequest', [ctx(model, { prompt: ' ' })], 'prompt must');
reject('reject vendor fields', 'buildSubmitRequest', [ctx(model, { prompt: 'x', ref_image_0: 'anything' })], 'unsupported request field');
reject('reject unknown model', 'buildSubmitRequest', [{ ...context, upstreamModel: 'unknown' }], 'unsupported model');
reject('reject bearer vendor key', 'buildSubmitRequest', [{ ...context, apiKey: 'Bearer fake-token' }], 'without Bearer');
reject('reject placeholder key', 'buildSubmitRequest', [{ ...context, apiKey: '__CONFIGURE_AUTODL_COMFYUI_TOKEN__' }], 'configure the channel');
reject('reject binary upload', 'buildSubmitRequest', [{ ...context, files: [{ ref: 'f' }] }], 'binary uploads');
for (const [upstream, status] of [['QUEUED', 'QUEUED'], ['RUNNING', 'IN_PROGRESS']]) fixture('status ' + upstream, 'parseTaskResult', [query, envelope(upstream), { status: 200 }], { status });
fixture('unknown status', 'parseTaskResult', [query, envelope('OTHER'), { status: 200 }], { status: 'UNKNOWN', reason: 'AutoDL: unknown upstream task status' });
fixture('failure redacts channel token', 'parseTaskResult', [query, envelope('FAILED', [], { message: 'failed with fake-autodl-token' }), { status: 200 }], { status: 'FAILURE', reason: 'failed with [redacted]' });
for (const status of ['QUEUED', 'RUNNING', 'OTHER']) fixture('bounded deadline ' + status, 'parseTaskResult', [{ ...query, state: { ...query.state, submittedAt: 1 } }, envelope(status), { status: 200 }], { status: 'FAILURE', reason: 'AutoDL: generation exceeded the 30-minute plugin deadline; the upstream task may still be running' });
for (const status of [400, 401, 429, 503]) reject('submit HTTP ' + status, 'parseSubmitResponse', [context, { statusCode: status, body: {} }], 'AutoDL:');
for (const status of [400, 404, 410, 422]) test('terminal query HTTP ' + status, () => assert.equal(p.parseTaskResult(query, {}, { status }).status, 'FAILURE'));
for (const status of [401, 429, 503]) reject('transient query HTTP ' + status, 'parseTaskResult', [query, {}, { status }], 'AutoDL:');
reject('missing submit ID', 'parseSubmitResponse', [context, { statusCode: 200, body: { code: 'Success', data: {} } }], 'no valid task_id');
reject('invalid JSON', 'parseTaskResult', [query, '{broken', { status: 200 }], 'invalid JSON');
reject('invalid business code', 'parseTaskResult', [query, { code: 'Error', data: {} }, { status: 200 }], 'unsuccessful API response');
reject('mismatched query ID', 'parseTaskResult', [query, envelope('RUNNING', [], { task_id: 'wrong' }), { status: 200 }], 'does not match');
for (const [name, results, reason] of [['empty', [], 'empty or invalid'], ['object', {}, 'empty or invalid'], ['number', [123], 'entry must'], ['scheme', ['file:///secret'], 'invalid media URL'], ['credentials', ['https://user:pass@cdn.example.com/a'], 'invalid media URL'], ['wrong media', [{ url: 'https://cdn.example.com/a.png', type: 'image' }], 'no expected media']]) test('invalid successful results ' + name, () => {
  const result = p.parseTaskResult(query, envelope('SUCCESS', results), { status: 200 });
  assert.equal(result.status, 'FAILURE'); assert.ok(result.reason.includes(reason));
});
const audio = ctx('indextts2-v1');
test('TTS unified emotion', () => {
  const r = p.buildSubmitRequest({ ...audio, requestBody: { ...audio.requestBody, emotion: { mode: 'vector', calm: 0.3, surprised: 0, random: false } } });
  assert.equal(r.body.prompt_text, audio.requestBody.prompt); assert.equal(r.body.prompt_simple, audio.requestBody.audios[0]);
  assert.equal(r.body.emo_control_method, '使用情感向量控制'); assert.equal(r.body.emo_calm, 0.3); assert.equal(r.body.emo_surprised, '0'); assert.equal(r.body.emo_random, false);
});
reject('TTS unsupported surprised value', 'buildSubmitRequest', [{ ...audio, requestBody: { ...audio.requestBody, emotion: { surprised: 0.5 } } }], 'supports only 0');
reject('TTS emotion reference requires audio', 'buildSubmitRequest', [{ ...audio, requestBody: { ...audio.requestBody, emotion: { mode: 'reference' } } }], 'audios[1] is required');
test('TTS emotion reference maps secondary audio', () => assert.equal(p.buildSubmitRequest({ ...audio, requestBody: { ...audio.requestBody, audios: ['https://cdn.example.com/voice.wav', 'https://cdn.example.com/emotion.wav'], emotion: { mode: 'reference' } } }).body.emo_ref_audio, 'https://cdn.example.com/emotion.wav'));
test('form arrays use JSON', () => {
  const r = p.native.create({ body: { kind: 'form', fields: { model: ['indextts2-v1'], prompt: ['hello'], audios: ['["https://cdn.example.com/voice.wav"]'], emotion: ['{"mode":"vector","calm":0.2}'] } } });
  assert.equal(r.action, 'text_to_audio'); assert.equal(r.requestBody.emotion.calm, 0.2);
});
test('multipart rejects repeated fields and binary', () => {
  assert.throws(() => p.protocols.openai_video.decodeRequest({ model, body: { kind: 'multipart', fields: { prompt: ['a', 'b'] }, files: [] } }), /exactly once/);
  assert.throws(() => p.protocols.openai_video.decodeRequest({ model, body: { kind: 'multipart', fields: {}, files: [{ ref: 'f' }] } }), /binary uploads/);
});
test('motion size is not guessed from inconsistent official dimensions', () => assert.ok(catalog['wan2.2animate-v4-motion_retargeting'].resolutions.every(r => !r.size)));
test('multiple output stable artifact keys and audio string fallback', () => {
  assert.deepEqual(p.listArtifacts({ status: 'SUCCESS', action: 'text_to_audio', data: envelope('SUCCESS', ['https://cdn.example.com/a', 'https://cdn.example.com/b']) }).map(a => a.key), ['audio', 'audio-2']);
});
fixture('running task has no artifacts', 'listArtifacts', [{ status: 'IN_PROGRESS', data: envelope('RUNNING') }], []);
writeFileSync(new URL('./golden.json', import.meta.url), JSON.stringify({ cases: fixtures }, null, 2) + '\n');
console.log(`PASS: ${checks} checks; generated ${fixtures.length} official host fixture cases for all 17 workflows.`);
