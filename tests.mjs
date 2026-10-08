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
  assert.deepEqual(p.meta.models.sort(), Object.keys(catalog).sort());
  assert.equal(p.meta.protocols[0].models.length, 16);
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
writeFileSync(new URL('./golden.json', import.meta.url), JSON.stringify({ cases: fixtures }, null, 2) + '\n');
console.log(`PASS: ${checks} checks; generated ${fixtures.length} official host fixture cases for all 17 workflows.`);
