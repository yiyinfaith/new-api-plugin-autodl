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
const referenceValues = value => value === undefined ? [] : (Array.isArray(value) ? value : [value]);
const mediaValues = (input, kind) => kind === 'input_reference' ? referenceValues(input[kind]).map(ref => ref === null ? null : ref.image_url) : (input[kind] || []);
const mediaInput = (kind, values) => kind === 'input_reference' ? values.map(url => url === null ? null : ({ image_url: url })) : values;
const ctx = (model, requestBody = examples[model]) => ({ ...base, model, upstreamModel: model, requestBody });
const envelope = (status, results = [], extras = {}) => ({ code: 'Success', data: { task_id: 'upstream-123', status, results, ...extras } });
test('exact official catalog coverage', () => {
  assert.equal(p.meta.version, '1.0.0');
  assert.equal(official.length, 17);
  assert.deepEqual(Object.values(catalog).map(c => c.workflowId).sort(), official.map(c => c.uuid).sort());
  assert.deepEqual(p.meta.models.slice().sort(), [...Object.keys(catalog), 'MiniMax-H3', 'MiniMax-H3-Max'].sort());
  assert.equal(p.meta.protocols[0].models.length, 18);
  assert.ok(!p.meta.protocols[0].models.includes('indextts2-v1'));
});
for (const [model, config] of Object.entries(catalog)) {
  const source = official.find(row => row.uuid === config.workflowId);
  const input = examples[model];
  for (const value of [[], ['https://cdn.example.com/old.png']]) reject(model + ': removed reference field ' + JSON.stringify(value), 'buildSubmitRequest', [ctx(model, { ...input, images: value })], 'images is no longer supported');
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
  for (const kind of ['input_reference', 'audios', 'videos']) for (let i = 0; i < mediaValues(input, kind).length; i++) expectedBody[config[kind][i]] = mediaValues(input, kind)[i];
  if (config.type === 'audio') expectedBody.emo_control_method = '与音色参考音频相同';
  const action = config.type === 'audio' ? 'text_to_audio' : input.videos?.length ? 'video_to_video' : referenceValues(input.input_reference).length ? 'image_to_video' : 'text_to_video';
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
  for (const kind of ['input_reference', 'audios', 'videos']) {
    const countError = kind === 'input_reference' && !config[kind].length ? 'does not accept input_reference' : 'too many ' + kind;
    reject(model + ': media count ' + kind, 'buildSubmitRequest', [ctx(model, { ...input, [kind]: mediaInput(kind, Array(config[kind].length + 1).fill('https://cdn.example.com/a')) })], countError);
    for (let i = 0; i < config[kind].length; i++) if (source.input_rules[config[kind][i]].required) {
      const values = [...mediaValues(input, kind)]; values[i] = null;
      reject(model + ': required ' + kind + '[' + i + ']', 'buildSubmitRequest', [ctx(model, { ...input, [kind]: mediaInput(kind, values) })], kind === 'input_reference' ? 'input_reference' : kind + '[' + i + '] is required');
    }
    if (config[kind].length) {
      test(model + ': all optional media slots map', () => {
        const values = Array(config[kind].length).fill('https://cdn.example.com/reference');
        const result = p.buildSubmitRequest(ctx(model, { ...input, [kind]: mediaInput(kind, values) }));
        for (const key of config[kind]) assert.equal(result.body[key], values[0]);
      });
    }
    if (kind === 'input_reference' && config[kind].length) {
      const refs = referenceValues(input.input_reference);
      if (refs.length === 1) test(model + ': object and one-element array have identical mapping', () => assert.deepEqual(p.buildSubmitRequest(ctx(model, { ...input, input_reference: refs[0] })), p.buildSubmitRequest(ctx(model, { ...input, input_reference: refs }))));
      test(model + ': unique image URLs retain positional mapping', () => {
        const refs = config[kind].map((_, i) => ({ image_url: 'https://cdn.example.com/image-' + i + '.png' }));
        const result = p.buildSubmitRequest(ctx(model, { ...input, input_reference: refs }));
        config[kind].forEach((field, i) => assert.equal(result.body[field], refs[i].image_url));
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
const referenceModel = 'minimax_h3_lightx2v_v5';
const referenceContext = ctx(referenceModel);
const singleReference = { image_url: 'https://cdn.example.com/first.png' };
const secondReference = { image_url: 'https://cdn.example.com/second.png' };
fixture('single image_url object maps to first upstream slot', 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: singleReference })], {
  url: 'https://autodl.art/api/v1/comfyui/comfyui_workflow/' + referenceModel, method: 'POST', action: 'image_to_video',
  headers: { Authorization: base.apiKey, 'Content-Type': 'application/json' },
  body: { prompt: referenceContext.requestBody.prompt, duration: referenceContext.requestBody.seconds, resolution: '768p竖', ref_image_0: singleReference.image_url },
});
for (const value of [false, null, 1, [[singleReference]], [null], [singleReference, 123], singleReference.image_url, [singleReference.image_url], [singleReference.image_url, secondReference.image_url], [singleReference, secondReference.image_url]]) reject('invalid reference shape ' + JSON.stringify(value), 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: value })], 'image_url object');
for (const value of [{ file_id: 'file-123' }, [{ file_id: 'file-123' }], { ...singleReference, file_id: 'file-123' }, [singleReference, { file_id: 'file-123' }]]) reject('unsupported file_id ' + JSON.stringify(value), 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: value })], 'this adapter only supports image_url');
for (const value of [{}, { url: singleReference.image_url }, { ...singleReference, extra: true }]) reject('unsupported reference keys ' + JSON.stringify(value), 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: value })], 'only image_url');
for (const value of ['data:image/png;base64,abc', 'file:///image.png', 'C:/image.png', '', null, 1, [], {}]) reject('unsupported reference URL ' + JSON.stringify(value), 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: { image_url: value } })], 'public HTTP(S)');
for (const value of ['https://u:p@cdn.example.com/image.png', ' https://cdn.example.com/image.png']) reject('invalid public reference URL ' + value, 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: { image_url: value } })], 'AutoDL:');
const referenceFields = { model: [referenceModel], prompt: [referenceContext.requestBody.prompt], seconds: ['5'], size: ['768x1344'] };
for (const kind of ['form', 'multipart']) {
  for (const values of [[JSON.stringify(singleReference)], [JSON.stringify([singleReference, secondReference])], [JSON.stringify(singleReference), JSON.stringify(secondReference)]]) {
    test(kind + ': reference object and ordered references ' + JSON.stringify(values), () => {
      const decoded = p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, input_reference: values }, files: [] } });
      const body = p.buildSubmitRequest(ctx(referenceModel, decoded.requestBody)).body;
      assert.equal(decoded.action, 'image_to_video'); assert.equal(body.ref_image_0, singleReference.image_url);
      if (values.length > 1 || values[0].startsWith('[')) assert.equal(body.ref_image_1, secondReference.image_url);
    });
  }
  test(kind + ': removed reference field is rejected', () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, images: ['[]'], input_reference: [JSON.stringify(singleReference)] }, files: [] } }), /images is no longer supported/));
  test(kind + ': malformed reference array rejected', () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, input_reference: ['[broken'] }, files: [] } }), /forms must be a JSON image_url object or object array/));
  for (const value of [singleReference.image_url, JSON.stringify(singleReference.image_url), JSON.stringify([singleReference.image_url, secondReference.image_url]), JSON.stringify({file_id: 'file-123'})]) test(kind + ': unsupported reference input ' + value, () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, input_reference: [value] }, files: [] } }), /image_url/));
}
test('same-field multipart image files fail explicitly for URL-only adapter', () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind: 'multipart', fields: referenceFields, files: [{ field: 'input_reference', ref: 'request_file:input_reference' }, { field: 'input_reference', ref: 'request_file:input_reference#1' }] } }), /binary uploads.*input_reference URLs/));
test('generic native single reference matches protocol', () => {
  const body = { ...referenceContext.requestBody, input_reference: singleReference };
  assert.deepEqual(p.native.create({ body: { kind: 'json', value: body } }), p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind: 'json', value: body } }));
});
for (const [id, config] of Object.entries(catalog)) {
  const fields = config.input_reference;
  if (!fields.length) {
    for (const refs of [[], [singleReference], singleReference]) reject(id + ': no reference parameter allowed ' + JSON.stringify(refs), 'buildSubmitRequest', [ctx(id, { ...examples[id], input_reference: refs })], 'does not accept input_reference');
  } else {
    const minimum = fields.reduce((n, field, i) => config.rules[field].required ? i + 1 : n, 0);
    if (minimum) for (let count = 0; count < minimum; count++) reject(id + ': reference count below minimum ' + count, 'buildSubmitRequest', [ctx(id, { ...examples[id], input_reference: Array(count).fill(singleReference) })], 'requires at least ' + minimum);
    if (fields.length === 1) fixture(id + ': exactly one reference', 'buildSubmitRequest', [ctx(id, { ...examples[id], input_reference: singleReference })], p.buildSubmitRequest(ctx(id, { ...examples[id], input_reference: [singleReference] })));
    if (fields.length === 2 && minimum === 2) test(id + ': exactly two ordered first/last frames', () => {
      const body = p.buildSubmitRequest(ctx(id, { ...examples[id], input_reference: [singleReference, secondReference] })).body;
      assert.equal(body.first_frame, singleReference.image_url); assert.equal(body.last_frame, secondReference.image_url);
    });
  }
}
test('motion size is not guessed from inconsistent official dimensions', () => assert.ok(catalog['wan2.2animate-v4-motion_retargeting'].resolutions.every(r => !r.size)));
test('multiple output stable artifact keys and audio string fallback', () => {
  assert.deepEqual(p.listArtifacts({ status: 'SUCCESS', action: 'text_to_audio', data: envelope('SUCCESS', ['https://cdn.example.com/a', 'https://cdn.example.com/b']) }).map(a => a.key), ['audio', 'audio-2']);
});
fixture('running task has no artifacts', 'listArtifacts', [{ status: 'IN_PROGRESS', data: envelope('RUNNING') }], []);
const formats = examples._formats;
test('three format example catalog coverage', () => {
  assert.deepEqual(Object.keys(formats.minimax).sort(), [...Object.keys(catalog), 'MiniMax-H3', 'MiniMax-H3-Max'].sort());
  assert.deepEqual(Object.keys(formats.autodl).sort(), Object.keys(catalog).sort());
  assert.ok(p.meta.routes.some(r => r.path === '/api/v1/comfyui/comfyui_workflow/:workflow_id' && r.decode === 'rawCreate'));
});
const rawContext = (model, body) => ({ method: 'POST', path: '/api/v1/comfyui/comfyui_workflow/' + model, params: { workflow_id: model }, body: { kind: 'json', value: body } });
const nativeInput = body => ({ __autodl_fields: Object.entries(body) });
for (const [model, config] of Object.entries(catalog)) {
  const original = p.buildSubmitRequest(ctx(model));
  const facts = p.extractUsage(ctx(model));
  const mini = formats.minimax[model], raw = formats.autodl[model].body;
  fixture(model + ': MiniMax equivalent submit', 'buildSubmitRequest', [ctx(model, mini)], original);
  fixture(model + ': MiniMax equivalent billing', 'extractUsage', [ctx(model, mini)], facts);
  const intent = p.native.rawCreate(rawContext(model, raw));
  test(model + ': raw decoder model and action', () => {
    assert.equal(intent.model, model); assert.equal(intent.action, original.action);
    assert.deepEqual(Object.fromEntries(intent.requestBody.__autodl_fields), raw);
  });
  fixture(model + ': raw equivalent submit', 'buildSubmitRequest', [ctx(model, intent.requestBody)], original);
  fixture(model + ': raw equivalent billing', 'extractUsage', [ctx(model, intent.requestBody)], facts);
  test(model + ': MiniMax persisted task facts', () => assert.deepEqual(p.parseSubmitResponse(ctx(model, mini), { statusCode: 200, body: envelope('QUEUED') }), p.parseSubmitResponse(ctx(model), { statusCode: 200, body: envelope('QUEUED') })));
  test(model + ': native MiniMax decode normalizes request and facts', () => {
    const decoded = p.native.miniCreate({ path: '/v2/video_generation', body: { kind: 'json', value: mini } }).requestBody;
    assert.deepEqual(Object.fromEntries(decoded.__autodl_fields), raw); assert.deepEqual(p.extractUsage(ctx(model, decoded)), facts);
  });
  if (config.type === 'video') test(model + ': OpenAI protocol carries MiniMax JSON', () => {
    const decoded = p.protocols.openai_video.decodeRequest({ model, body: { kind: 'json', value: mini } });
    assert.equal(decoded.action, original.action); assert.deepEqual(p.buildSubmitRequest(ctx(model, decoded.requestBody)), original);
  });
  reject(model + ': raw unknown field', 'buildSubmitRequest', [ctx(model, nativeInput({ ...raw, unknown_control: 1 }))], 'internal AutoDL field');
  reject(model + ': raw rejects unified packaging', 'buildSubmitRequest', [ctx(model, nativeInput({ ...raw, input_reference: singleReference }))], 'internal AutoDL field');
  reject(model + ': MiniMax cannot mix seconds', 'buildSubmitRequest', [ctx(model, { ...mini, seconds: 5 })], 'mixed MiniMax field');
  for (const field of ['duration', 'audio_duration']) {
    if (config.rules[field]) {
      const rule = config.rules[field];
      for (const value of [rule.min, rule.max]) {
        const expected = { ...original, body: { ...original.body, [field]: value } };
        fixture(model + ': MiniMax ' + field + '=' + value, 'buildSubmitRequest', [ctx(model, { ...mini, [field]: value })], expected);
        fixture(model + ': raw ' + field + '=' + value, 'buildSubmitRequest', [ctx(model, nativeInput({ ...raw, [field]: value }))], expected);
      }
      for (const value of [rule.min - 1, rule.max + 1, 1.5, false, null]) {
        reject(model + ': MiniMax bad ' + field + '=' + value, 'buildSubmitRequest', [ctx(model, { ...mini, [field]: value })], field + ' must');
        reject(model + ': raw bad ' + field + '=' + value, 'buildSubmitRequest', [ctx(model, nativeInput({ ...raw, [field]: value }))], field + ' must');
      }
    } else reject(model + ': MiniMax unsupported ' + field, 'buildSubmitRequest', [ctx(model, { ...mini, [field]: 5 })], 'does not support ' + field);
  }
  if (config.rules.seed) {
    fixture(model + ': MiniMax seed extension', 'buildSubmitRequest', [ctx(model, { ...mini, seed: config.rules.seed.min })], { ...original, body: { ...original.body, seed: config.rules.seed.min } });
    reject(model + ': MiniMax bad seed', 'buildSubmitRequest', [ctx(model, { ...mini, seed: config.rules.seed.max + 1 })], 'seed must');
  } else reject(model + ': MiniMax unsupported seed', 'buildSubmitRequest', [ctx(model, { ...mini, seed: 1 })], 'does not support seed');
  const qualityNames = { '480p': '480P', '768p': '768P', '1440p': '2K' };
  const ratioNames = { landscape: '16:9', portrait: '9:16', square: '1:1' };
  for (const r of config.resolutions) {
    const expected = { ...original, body: { ...original.body, resolution: r.upstream } };
    const defaultDirection = config.resolutions.find(entry => entry.upstream === config.rules.resolution.default).orientation;
    const miniChoice = config.input_reference.includes('first_frame') ? config.resolutions.find(entry => entry.resolution === r.resolution && entry.orientation === defaultDirection) : r;
    const miniExpected = { ...original, body: { ...original.body, resolution: miniChoice.upstream } };
    fixture(model + ': MiniMax tier/ratio ' + r.upstream, 'buildSubmitRequest', [ctx(model, { ...mini, resolution: qualityNames[r.resolution] || r.resolution, ratio: ratioNames[r.orientation] })], miniExpected);
    fixture(model + ': raw exact resolution ' + r.upstream, 'buildSubmitRequest', [ctx(model, nativeInput({ ...raw, resolution: r.upstream }))], expected);
    if (!qualityNames[r.resolution]) fixture(model + ': MiniMax exact extension tier ' + r.upstream, 'buildSubmitRequest', [ctx(model, { ...mini, resolution: r.upstream, ratio: ratioNames[r.orientation] })], miniExpected);
  }
  if (config.resolutions.length) {
    for (const ratio of ['2:1', '', false, null]) reject(model + ': unsupported ratio ' + ratio, 'buildSubmitRequest', [ctx(model, { ...mini, ratio })], 'MiniMax ratio');
    const missingRatio = { ...mini }; delete missingRatio.ratio;
    if (mini.content.some(item => item.type !== 'text')) fixture(model + ': media ratio defaults to adaptive', 'buildSubmitRequest', [ctx(model, missingRatio)], original);
    else reject(model + ': explicit text ratio required', 'buildSubmitRequest', [ctx(model, missingRatio)], 'text-to-video ratio');
    reject(model + ': invalid resolution', 'buildSubmitRequest', [ctx(model, { ...mini, resolution: '4K' })], 'resolution/ratio');
  } else reject(model + ': no ratio control', 'buildSubmitRequest', [ctx(model, { ...mini, ratio: '16:9' })], 'no resolution or ratio');
  for (const field of Object.keys(config.rules).filter(k => config.rules[k].required && ['image', 'audio', 'video', 'prompt', 'string'].includes(config.rules[k].type))) {
    const missing = { ...raw }; delete missing[field];
    reject(model + ': raw required ' + field, 'buildSubmitRequest', [ctx(model, nativeInput(missing))], field + ' is required');
  }
  for (const kind of ['input_reference', 'audios', 'videos']) {
    const type = { input_reference: 'image_url', audios: 'audio_url', videos: 'video_url' }[kind];
    const role = { input_reference: 'reference_image', audios: 'reference_audio', videos: 'reference_video' }[kind];
    if (config.input_reference.includes('first_frame') && kind === 'input_reference') continue;
    const content = mini.content.filter(item => item.type !== type);
    const tooMany = [...content, ...Array.from({ length: config[kind].length + 1 }, () => ({ type, [type]: { url: 'https://cdn.example.com/extra' }, role }))];
    reject(model + ': MiniMax too many ' + type, 'buildSubmitRequest', [ctx(model, { ...mini, content: tooMany })], config.input_reference.includes('first_frame') ? 'cannot be mixed' : kind === 'videos' && !config.videos.length ? '当前 AutoDL 适配器没有对应的 reference_video workflow' : 'too many ' + type);
  }
}
const miniBase = formats.minimax[referenceModel];
const rawBase = formats.autodl[referenceModel].body;
const canonicalBase = p.native.rawCreate(rawContext(referenceModel, rawBase)).requestBody;
for (const [key, value] of Object.entries({ requests: 0, seconds: 1, resolution: '480p', orientation: 'landscape' })) {
  reject('normalized billing facts cannot override ' + key, 'buildSubmitRequest', [ctx(referenceModel, { ...canonicalBase, [key]: value })], 'usage facts conflict');
}
for (const fields of [null, [['prompt']], [[false, 'bad']], [...canonicalBase.__autodl_fields, canonicalBase.__autodl_fields[0]], [...canonicalBase.__autodl_fields, ['unknown_control', 1]]]) {
  reject('normalized field structure rejects ' + JSON.stringify(fields), 'buildSubmitRequest', [ctx(referenceModel, { ...canonicalBase, __autodl_fields: fields })], 'AutoDL: invalid');
}
reject('normalized request cannot mix another dialect', 'buildSubmitRequest', [ctx(referenceModel, { ...canonicalBase, content: miniBase.content })], 'invalid internal normalized request');
fixture('normalized request revalidates media URLs', 'extractUsage', [ctx(referenceModel, canonicalBase)], p.extractUsage(ctx(referenceModel)));
reject('normalized request rejects invalid media before billing', 'extractUsage', [ctx(referenceModel, { ...canonicalBase, __autodl_fields: canonicalBase.__autodl_fields.map(([key, value]) => [key, key === 'ref_image_0' ? 'data:image/png;base64,abc' : value]) })], 'invalid media URL');
for (const content of [null, {}, 'text', [null], [{ type: 'reference_image' }], [{ type: 'image_url', image_url: { file_id: 'f' }, role: 'reference_image' }], [{ type: 'text', text: 'a', extra: true }]]) reject('MiniMax malformed content ' + JSON.stringify(content), 'buildSubmitRequest', [ctx(referenceModel, { ...miniBase, content })], 'AutoDL:');
reject('MiniMax duplicate text', 'buildSubmitRequest', [ctx(referenceModel, { ...miniBase, content: [...miniBase.content, { type: 'text', text: 'duplicate' }] })], 'only one text');
reject('MiniMax URL must be public', 'buildSubmitRequest', [ctx(referenceModel, { ...miniBase, content: [{ type: 'text', text: 'a' }, { type: 'image_url', image_url: { url: 'data:image/png;base64,abc' }, role: 'reference_image' }] })], 'invalid media URL');
for (const field of ['prompt', 'input_reference', 'images', 'audios', 'videos', 'size', 'orientation', 'callback_url', 'extra']) reject('MiniMax mixed/unsupported top-level ' + field, 'buildSubmitRequest', [ctx(referenceModel, { ...miniBase, [field]: 'unsupported' })], 'mixed MiniMax field');
test('MiniMax source model remains workflow ID with channel mapping', () => {
  const decoded = p.protocols.openai_video.decodeRequest({ model: 'client-alias', upstreamModel: referenceModel, body: { kind: 'json', value: { ...miniBase, model: 'ignored-body-model' } } });
  assert.equal(decoded.model, 'client-alias');
  assert.equal(p.buildSubmitRequest({ ...base, model: 'client-alias', upstreamModel: referenceModel, requestBody: decoded.requestBody }).url, 'https://autodl.art/api/v1/comfyui/comfyui_workflow/' + referenceModel);
});
for (const field of ['ratio', 'contentX', '__autodl_fields', 'ref_image_0']) test('OpenAI still rejects ' + field, () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind: 'json', value: { ...examples[referenceModel], [field]: {} } } }), /unsupported request field/));
test('raw body cannot be guessed from prompt/duration', () => assert.throws(() => p.native.create({ body: { kind: 'json', value: { model: referenceModel, ...rawBase } } }), /unsupported request field/));
test('raw endpoint requires explicit model in URL and JSON', () => {
  assert.throws(() => p.native.rawCreate({ body: { kind: 'json', value: rawBase } }), /workflow ID in the URL/);
  assert.throws(() => p.native.rawCreate({ params: { workflow_id: referenceModel }, body: { kind: 'form', fields: {} } }), /requires a JSON object/);
});
const frameModel = 'minimax_h3_lightx2v';
const frameMini = formats.minimax[frameModel];
fixture('MiniMax frame roles override array position', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: frameMini.content.slice().reverse() })], p.buildSubmitRequest(ctx(frameModel)));
const frameItems = frameMini.content.filter(i => i.type === 'image_url');
reject('MiniMax duplicate first frame', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: [...frameMini.content, frameItems[0]] })], 'duplicate first_frame');
reject('MiniMax missing last frame', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: frameMini.content.filter(i => i.role !== 'last_frame') })], 'last_frame is required');
reject('MiniMax frame/reference mix', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: [...frameMini.content, { type: 'audio_url', audio_url: { url: 'https://cdn.example.com/a.wav' }, role: 'reference_audio' }] })], 'cannot be mixed');
fixture('raw optional image slots retain original indices', 'buildSubmitRequest', [ctx(referenceModel, nativeInput({ ...rawBase, ref_image_8: secondReference.image_url }))], { ...p.buildSubmitRequest(ctx(referenceModel)), body: { ...rawBase, ref_image_8: secondReference.image_url } });
const ttsRaw = JSON.parse(official.find(r => r.uuid === 'indextts2-v1').input_example);
fixture('official native indexTTS2 body is preserved', 'buildSubmitRequest', [ctx('indextts2-v1', nativeInput(ttsRaw))], { ...p.buildSubmitRequest(ctx('indextts2-v1')), body: ttsRaw });
reject('native emotion reference requires audio', 'buildSubmitRequest', [ctx('indextts2-v1', nativeInput({ prompt_text: 'Hello', prompt_simple: 'https://cdn.example.com/a.wav', emo_control_method: '使用情感参考音频' }))], 'emo_ref_audio is required');
const officialRatios = { '21:9': 'landscape', '16:9': 'landscape', '4:3': 'landscape', '1:1': 'square', '3:4': 'portrait', '9:16': 'portrait' };
const officialCases = formats.minimax_scenarios;
test('official alias examples cover all routing branches and square precedence', () => {
  assert.equal(officialCases.length, 15);
  const reachable = new Set(officialCases.map(row => p.buildSubmitRequest(ctx(row.request.model, row.request)).url.split('/').pop()));
  const special = p.buildSubmitRequest(ctx('minimax_h3_image_audio_to_video', formats.minimax['minimax_h3_image_audio_to_video']));
  assert.ok(!('rewriteModel' in special)); reachable.add(special.url.split('/').pop());
  const excluded = ['indextts2-v1', 'wan2.2animate-v4-motion_retargeting', 'minimax_h3_b99_001', 'minimax_h3_b99_002', 'minimax_h3_b99_003_12s'];
  assert.deepEqual([...reachable].sort(), Object.keys(catalog).filter(model => !excluded.includes(model)).sort());
});
function ratioTarget(request, target) {
  const images = request.content.filter(item => item.role === 'reference_image').length;
  const audio = request.content.some(item => item.role === 'reference_audio');
  if (request.model === 'MiniMax-H3' && images) return images >= 7 || request.ratio === '1:1' ? 'minimax_h3_zm_u24' : audio ? 'minimax_h3_z0903' : 'minimax_h3_z0902';
  if (request.model === 'MiniMax-H3-Max' && images && audio) return request.ratio === '1:1' ? 'minimax_h3_zm_u08' : request.duration <= 10 ? 'minimax_h3_image_audio_to_video_v2' : 'minimax_h3_image_audio_to_video_v2_15s';
  return target;
}
function equivalentOfficial(request, target) {
  const config = catalog[target], quality = { '480P': '480p', '768P': '768p', '2K': '1440p' }[request.resolution];
  const defaultDirection = config.resolutions.find(r => r.upstream === config.rules.resolution.default).orientation;
  const frames = request.content.some(item => ['first_frame', 'last_frame'].includes(item.role));
  let orientation = frames || !request.ratio || request.ratio === 'adaptive' ? defaultDirection : officialRatios[request.ratio];
  if (orientation === 'square' && !config.resolutions.some(r => r.resolution === quality && r.orientation === orientation)) orientation = defaultDirection;
  const input = { model: target, prompt: request.content.find(item => item.type === 'text').text, seconds: request.duration, resolution: quality, orientation };
  const imageItems = request.content.filter(item => item.type === 'image_url');
  if (imageItems.length) input.input_reference = (frames ? ['first_frame', 'last_frame'].map(role => imageItems.find(item => item.role === role)) : imageItems).map(item => ({ image_url: item.image_url.url }));
  const audios = request.content.filter(item => item.type === 'audio_url');
  if (audios.length) input.audios = audios.map(item => item.audio_url.url);
  return p.buildSubmitRequest(ctx(target, input));
}
for (const { name, request, expected_workflow: target } of officialCases) {
  const expected = { ...equivalentOfficial(request, target), rewriteModel: target };
  fixture(name + ': automatic workflow selection', 'buildSubmitRequest', [ctx(request.model, request)], expected);
  const intent = p.native.miniCreate({ path: '/v2/video_generation', body: { kind: 'json', value: request } });
  const facts = p.extractUsage(ctx(target, { ...examples[target], seconds: request.duration }));
  fixture(name + ': canonical official request maps identically', 'buildSubmitRequest', [ctx(request.model, intent.requestBody)], expected);
  fixture(name + ': official billing facts', 'extractUsage', [ctx(request.model, intent.requestBody)], { ...facts, orientation: p.extractUsage(ctx(request.model, request)).orientation });
  test(name + ': protocol preserves public model', () => {
    const decoded = p.protocols.openai_video.decodeRequest({ model: request.model, body: { kind: 'json', value: request } });
    assert.equal(decoded.model, request.model);
    assert.deepEqual(p.buildSubmitRequest(ctx(request.model, decoded.requestBody)), expected);
  });
  test(name + ': rewritten upstream survives submission and polling', () => {
    const submittedContext = { ...ctx(request.model, intent.requestBody), upstreamModel: target };
    const parsed = p.parseSubmitResponse(submittedContext, { statusCode: 200, body: envelope('QUEUED') });
    assert.equal(parsed.state.workflowId, target); assert.deepEqual(parsed.state.facts, p.extractUsage(submittedContext));
    const queryContext = { ...submittedContext, taskId: 'upstream-123', state: parsed.state };
    assert.equal(p.parseTaskResult(queryContext, envelope('SUCCESS', [{ type: 'video', url: 'https://cdn.example.com/a.mp4' }]), { status: 200 }).status, 'SUCCESS');
    assert.deepEqual(p.extractUsageOnComplete(queryContext, { status: 'SUCCESS' }), parsed.state.facts);
  });
  const isText = request.content.every(item => item.type === 'text');
  for (const ratio of ['adaptive', ...Object.keys(officialRatios)]) {
    const input = { ...request, ratio };
    if (isText && ratio === 'adaptive') reject(name + ': text adaptive rejected by official semantics', 'buildSubmitRequest', [ctx(request.model, input)], 'text-to-video ratio');
    else {
      const selected = ratioTarget(input, target);
      fixture(name + ': official ratio ' + ratio, 'buildSubmitRequest', [ctx(request.model, input)], { ...equivalentOfficial(input, selected), rewriteModel: selected });
    }
  }
  const omitted = { ...request }; delete omitted.ratio;
  if (isText) reject(name + ': text ratio is required', 'buildSubmitRequest', [ctx(request.model, omitted)], 'text-to-video ratio');
  else {
    const selected = ratioTarget(omitted, target);
    fixture(name + ': reference ratio defaults to adaptive', 'buildSubmitRequest', [ctx(request.model, omitted)], { ...equivalentOfficial(omitted, selected), rewriteModel: selected });
  }
}
for (const alias of ['MiniMax-H3', 'MiniMax-H3-Max']) {
  const input = formats.minimax[alias];
  for (const duration of alias === 'MiniMax-H3' ? [4, 15] : [5, 15]) fixture(alias + ': official duration ' + duration, 'buildSubmitRequest', [ctx(alias, { ...input, duration })], { ...equivalentOfficial({ ...input, duration }, alias === 'MiniMax-H3' ? 'minimax_h3_z0901' : 'minimax_h3_lightx2v_no_pic'), rewriteModel: alias === 'MiniMax-H3' ? 'minimax_h3_z0901' : 'minimax_h3_lightx2v_no_pic' });
  for (const duration of [0, 3, 16, 5.5, '5', null, false, undefined]) reject(alias + ': invalid official duration ' + duration, 'buildSubmitRequest', [ctx(alias, { ...input, duration })], 'duration must be an integer');
  if (alias === 'MiniMax-H3-Max') reject(alias + ': four seconds rejected', 'buildSubmitRequest', [ctx(alias, { ...input, duration: 4 })], 'duration must be an integer');
  for (const resolution of alias === 'MiniMax-H3' ? ['480P', '768p', '1080p', null, undefined] : ['2K', '768p', '1080p', null, undefined]) reject(alias + ': invalid official resolution ' + resolution, 'buildSubmitRequest', [ctx(alias, { ...input, resolution })], 'resolution must be');
  for (const text of ['', ' ', 'a'.repeat(7001), null]) reject(alias + ': invalid official prompt', 'buildSubmitRequest', [ctx(alias, { ...input, content: [{ type: 'text', text }] })], 'one non-empty text');
  reject(alias + ': missing official prompt', 'buildSubmitRequest', [ctx(alias, { ...input, content: [] })], 'one non-empty text');
  reject(alias + ': duplicate official prompt', 'buildSubmitRequest', [ctx(alias, { ...input, content: [...input.content, input.content[0]] })], 'one non-empty text');
  reject(alias + ': reference video has no workflow', 'buildSubmitRequest', [ctx(alias, { ...input, content: [...input.content, { type: 'video_url', role: 'reference_video', video_url: { url: 'https://cdn.example.com/v.mp4' } }] })], '当前 AutoDL 适配器没有对应的 reference_video workflow');
  test(alias + ': OpenAI cannot use official alias after shared-model discovery', () => {
    const intent = p.protocols.openai_video.decodeRequest({ model: alias, body: { kind: 'json', value: { model: alias, prompt: 'test', seconds: 5 } } });
    assert.throws(() => p.buildSubmitRequest(ctx(alias, intent.requestBody)), /content must be an array/);
  });
  test(alias + ': raw cannot use official alias', () => assert.throws(() => p.native.rawCreate(rawContext(alias, { prompt: 'test' })), /unsupported model/));
  const profile = p.meta.usageProfiles.find(profile => profile.models.includes(alias));
  test(alias + ': alias usage profile has official qualities', () => assert.deepEqual(profile.schema.resolution.enum, alias === 'MiniMax-H3' ? ['768p', '1440p'] : ['480p', '768p']));
}
const h3Text = formats.minimax['MiniMax-H3'];
const h3Frames = officialCases.find(row => row.name === 'MiniMax-H3_frames').request;
const h3Seven = officialCases.find(row => row.name === 'MiniMax-H3_seven_images').request;
for (const name of ['MiniMax-H3-Max_images', 'MiniMax-H3-Max_images_audio', 'MiniMax-H3-Max_images_audio_square']) {
  const sample = officialCases.find(row => row.name === name);
  for (const duration of [5, 10, 11, 15]) {
    const request = { ...sample.request, duration };
    const target = name.endsWith('_square') ? 'minimax_h3_zm_u08' : name.endsWith('_audio') ? duration <= 10 ? 'minimax_h3_image_audio_to_video_v2' : 'minimax_h3_image_audio_to_video_v2_15s' : duration <= 10 ? 'minimax_h3_lightx2v_v5' : 'minimax_h3_lightx2v_v5_15s';
    fixture(name + ': duration routing boundary ' + duration, 'buildSubmitRequest', [ctx(request.model, request)], { ...equivalentOfficial(request, target), rewriteModel: target });
  }
}
const referenceImage = i => ({ type: 'image_url', role: 'reference_image', image_url: { url: 'https://cdn.example.com/reference-' + i + '.png' } });
const referenceAudio = i => ({ type: 'audio_url', role: 'reference_audio', audio_url: { url: 'https://cdn.example.com/reference-' + i + '.wav' } });
for (const count of [1, 6, 7, 9]) {
  for (const audioCount of [0, 3]) {
    const request = { ...h3Text, ratio: 'adaptive', content: [...h3Text.content, ...Array.from({ length: count }, (_, i) => referenceImage(i)), ...Array.from({ length: audioCount }, (_, i) => referenceAudio(i))] };
    const target = count >= 7 ? 'minimax_h3_zm_u24' : audioCount ? 'minimax_h3_z0903' : 'minimax_h3_z0902';
    fixture('H3 media routing boundary images=' + count + ' audio=' + audioCount, 'buildSubmitRequest', [ctx(request.model, request)], { ...equivalentOfficial(request, target), rewriteModel: target });
  }
}
for (const alias of ['MiniMax-H3', 'MiniMax-H3-Max']) {
  const input = formats.minimax[alias];
  reject(alias + ': ten images exceed official count', 'buildSubmitRequest', [ctx(alias, { ...input, content: [...input.content, ...Array.from({ length: 10 }, (_, i) => referenceImage(i))] })], 'reference limits');
  reject(alias + ': four audio clips exceed official count', 'buildSubmitRequest', [ctx(alias, { ...input, content: [...input.content, referenceImage(1), ...Array.from({ length: 4 }, (_, i) => referenceAudio(i))] })], 'reference limits');
  reject(alias + ': only last frame has no target', 'buildSubmitRequest', [ctx(alias, { ...input, content: [...input.content, { ...referenceImage(1), role: 'last_frame' }] })], 'requires both first_frame and last_frame');
  reject(alias + ': only audio has no target', 'buildSubmitRequest', [ctx(alias, { ...input, content: [...input.content, referenceAudio(1)] })], '暂无对应 AutoDL workflow for reference_audio without reference_image');
}
fixture('official H3 2K text preserves requested quality', 'buildSubmitRequest', [ctx('MiniMax-H3', { ...h3Text, resolution: '2K' })], { ...equivalentOfficial({ ...h3Text, resolution: '2K' }, 'minimax_h3_z0901'), rewriteModel: 'minimax_h3_z0901' });
reject('official H3 2K frame workflow cannot fulfill quality', 'buildSubmitRequest', [ctx('MiniMax-H3', { ...h3Frames, resolution: '2K' })], 'cannot provide 2K');
reject('official H3 seven images cannot use 2K', 'buildSubmitRequest', [ctx('MiniMax-H3', { ...h3Seven, resolution: '2K' })], 'cannot provide 2K');
reject('official H3 square reference routing cannot provide 2K', 'buildSubmitRequest', [ctx('MiniMax-H3', { ...officialCases.find(row => row.name === 'MiniMax-H3_images_square').request, resolution: '2K' })], 'cannot provide 2K');
reject('official aliases cannot silently fill missing last frame', 'buildSubmitRequest', [ctx('MiniMax-H3', { ...h3Frames, content: h3Frames.content.filter(item => item.role !== 'last_frame') })], 'requires both first_frame and last_frame');
const savedOfficial = p.native.miniCreate({ path: '/v2/video_generation', body: { kind: 'json', value: h3Text } }).requestBody;
for (const [name, override, message] of [['adaptive', { ratio: 'adaptive' }, 'text-to-video ratio'], ['duration', { duration: 3 }, 'duration must be'], ['resolution', { resolution: '480P' }, 'resolution must be'], ['unsupported extension', { extra: {} }, 'mixed MiniMax field']]) {
  const intent = p.protocols.openai_video.decodeRequest({ model: 'MiniMax-H3', body: { kind: 'json', value: { ...h3Text, ...override } } });
  reject('shared-model preflight preserves real error: ' + name, 'buildSubmitRequest', [ctx('MiniMax-H3', intent.requestBody)], message);
}
reject('official canonical fields cannot bypass source request', 'buildSubmitRequest', [ctx('MiniMax-H3', { ...savedOfficial, __autodl_fields: savedOfficial.__autodl_fields.map(([key, value]) => [key, key === 'duration' ? 6 : value]) })], 'fields conflict');
reject('official canonical source cannot be malformed', 'buildSubmitRequest', [ctx('MiniMax-H3', { ...savedOfficial, __autodl_minimax: '{broken' })], 'invalid internal MiniMax source');
reject('official canonical source cannot select another alias', 'buildSubmitRequest', [ctx('MiniMax-H3-Max', savedOfficial)], 'workflow identity conflicts');
test('public channel alias retains official machine routing', () => {
  const intent = p.protocols.openai_video.decodeRequest({ model: 'public-client-alias', upstreamModel: 'MiniMax-H3', body: { kind: 'json', value: h3Text } });
  assert.equal(intent.model, 'public-client-alias');
  assert.equal(p.buildSubmitRequest({ ...ctx('public-client-alias', intent.requestBody), upstreamModel: 'MiniMax-H3' }).rewriteModel, 'minimax_h3_z0901');
});
for (const [model, config] of Object.entries(catalog).filter(([, config]) => config.resolutions.length)) {
  const mini = formats.minimax[model], media = mini.content.some(item => item.type !== 'text');
  if (media) fixture(model + ': adaptive accepted with documented default direction', 'buildSubmitRequest', [ctx(model, { ...mini, ratio: 'adaptive' })], p.buildSubmitRequest(ctx(model, mini)));
  else reject(model + ': workflow-name pure text adaptive follows official rule', 'buildSubmitRequest', [ctx(model, { ...mini, ratio: 'adaptive' })], 'text-to-video ratio');
}
function nativeFixture(name, member, args, expected, expectedError) {
  if (expectedError) assert.throws(() => p.native[member](...args), error => error.message.includes(expectedError), name);
  else assert.deepEqual(p.native[member](...args), expected, name);
  fixtures.push({ name, hook: 'native', member, args, ...(expectedError ? { expectedError } : { expected }) }); checks++;
}
// rc.41 marshals request maps with sorted keys before crossing the JS boundary.
// Mirror that order for fixtures that include the saved JSON source string.
function hostJSON(value) {
  if (Array.isArray(value)) return value.map(hostJSON);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, hostJSON(value[key])]));
  return value;
}
const v2Context = request => ({ method: 'POST', path: '/v2/video_generation', body: { kind: 'json', value: hostJSON(request) } });
test('declared public routes use the three requested interface styles', () => {
  assert.deepEqual(p.meta.routes.map(r => [r.method, r.path]), [
    ['POST', '/v2/video_generation'], ['GET', '/v2/query/video_generation/:task_id'],
    ['POST', '/api/v1/comfyui/comfyui_workflow/:workflow_id'], ['GET', '/api/v1/comfyui/comfyui_workflow/result/:task_id'],
  ]);
  assert.equal(formats.minimax_api.create_path, '/v2/video_generation');
  assert.equal(formats.minimax_api.query_path, '/v2/query/video_generation/{task_id}');
  for (const [model, entry] of Object.entries(formats.autodl)) {
    assert.equal(entry.path, '/api/v1/comfyui/comfyui_workflow/' + model);
    assert.equal(entry.query_path, '/api/v1/comfyui/comfyui_workflow/result/{task_id}');
  }
});
for (const [model, request] of Object.entries(formats.minimax)) {
  const expected = p.native.create(v2Context(request));
  nativeFixture(model + ': official V2 decoder shares normalized intent', 'miniCreate', [v2Context(request)], expected);
}
for (const row of officialCases) {
  test(row.name + ': official V2 example has the official path', () => assert.equal(row.path, '/v2/video_generation'));
  const intent = p.native.miniCreate(v2Context(row.request));
  fixture(row.name + ': V2 submit maps identically', 'buildSubmitRequest', [ctx(row.request.model, intent.requestBody)], { ...equivalentOfficial(row.request, row.expected_workflow), rewriteModel: row.expected_workflow });
  if (row.request.model === 'MiniMax-H3-Max') {
    const request = { ...row.request, model: 'MiniMax-H3-MAX' };
    const aliasIntent = p.native.miniCreate(v2Context(request));
    assert.equal(aliasIntent.model, 'MiniMax-H3-Max');
    fixture(row.name + ': uppercase MAX compatibility alias', 'buildSubmitRequest', [ctx(request.model, aliasIntent.requestBody)], { ...equivalentOfficial(row.request, row.expected_workflow), rewriteModel: row.expected_workflow });
  }
}
for (const body of [{ kind: 'none' }, { kind: 'form', fields: {} }, { kind: 'json', value: [] }, { kind: 'json', value: { model: 'MiniMax-H3', prompt: 'test' } }]) nativeFixture('V2 rejects non-content request ' + JSON.stringify(body), 'miniCreate', [{ path: '/v2/video_generation', body }], null, 'requires a JSON object with model and content');
nativeFixture('V2 create response is the official task_id object', 'miniCreated', [{}, { task_id: 'task_public', data: envelope('QUEUED') }], { task_id: 'task_public' });
const v2QueryContext = { method: 'GET', path: '/v2/query/video_generation/task_public', params: { task_id: 'task_public' } };
for (const [status, external] of Object.entries({ NOT_START: 'queued', SUBMITTED: 'queued', QUEUED: 'queued', IN_PROGRESS: 'running', UNKNOWN: 'running', CANCELLED: 'cancelled' })) nativeFixture('V2 pending status ' + status, 'miniTask', [v2QueryContext, { task_id: 'task_public', status, created_at: 10, updated_at: 11 }], { task: { id: 'task_public', status: external, task_type: 'generation', modality: 'video', created_at: 10, updated_at: 11 } });
nativeFixture('V2 success returns official task content URL without invented metadata', 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'SUCCESS', created_at: 10, updated_at: 11, data: envelope('SUCCESS', [{ type: 'video', url: 'https://cdn.example.com/result.mp4' }], { duration: 196 }) }], { task: { id: 'task_public', status: 'succeeded', task_type: 'generation', modality: 'video', created_at: 10, updated_at: 11, content: { url: 'https://cdn.example.com/result.mp4' } } });
nativeFixture('V2 failure includes official task error structure', 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'FAILURE', fail_reason: 'mock failure' }], { task: { id: 'task_public', status: 'failed', task_type: 'generation', modality: 'video', error: { code: 'video_generation_failed', message: 'mock failure' } } });
for (const type of ['video', 'audio']) nativeFixture('V2 ignores auxiliary image before ' + type, 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'SUCCESS', data: envelope('SUCCESS', [{ type: 'image', url: 'https://cdn.example.com/preview.png' }, { type, url: 'https://cdn.example.com/output.' + (type === 'video' ? 'mp4' : 'wav') }]) }], { task: { id: 'task_public', status: 'succeeded', task_type: 'generation', modality: type, content: { url: 'https://cdn.example.com/output.' + (type === 'video' ? 'mp4' : 'wav') } } });
nativeFixture('V2 video takes precedence over auxiliary audio', 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'SUCCESS', data: envelope('SUCCESS', [{ type: 'audio', url: 'https://cdn.example.com/aux.wav' }, { type: 'video', url: 'https://cdn.example.com/result.mp4' }]) }], { task: { id: 'task_public', status: 'succeeded', task_type: 'generation', modality: 'video', content: { url: 'https://cdn.example.com/result.mp4' } } });
nativeFixture('ComfyUI query retains original task response', 'task', [{ path: '/api/v1/comfyui/comfyui_workflow/result/task_public' }, { task_id: 'task_public', status: 'SUCCESS', data: envelope('SUCCESS', [{ type: 'video', url: 'https://cdn.example.com/result.mp4' }]) }], { task_id: 'task_public', status: 'SUCCESS', progress: '', fail_reason: '', results: [{ url: 'https://cdn.example.com/result.mp4', type: 'video' }] });
writeFileSync(new URL('./golden.json', import.meta.url), JSON.stringify({ cases: fixtures }, null, 2) + '\n');
console.log(`PASS: ${checks} checks; generated ${fixtures.length} official host fixture cases for all 17 workflows.`);
