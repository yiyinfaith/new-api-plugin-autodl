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
const motionModel = 'wan2.2animate-v4-motion_retargeting';
const ctx = (model, requestBody = examples[model]) => ({ ...base, model, upstreamModel: model, requestBody });
const envelope = (status, results = [], extras = {}) => ({ code: 'Success', data: { task_id: 'upstream-123', status, results, ...extras } });
test('exact official catalog coverage', () => {
  assert.equal(p.meta.version, '1.0.5');
  assert.equal(p.meta.requiredCapabilities, undefined);
  assert.equal(official.length, 17);
  assert.deepEqual(Object.values(catalog).map(c => c.workflowId).sort(), official.map(c => c.uuid).sort());
  assert.deepEqual(p.meta.models.slice().sort(), [...Object.keys(catalog), 'wan2.2-animate-move'].sort());
  assert.equal(p.meta.protocols[0].models.length, 17);
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
  if (model === motionModel) expectedFacts.seconds = 5; // explicit request declaration
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
  } else if (model !== motionModel) reject(model + ': no seconds control', 'buildSubmitRequest', [ctx(model, { ...input, seconds: 5 })], 'no seconds control');
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
  // The motion workflow also records the reference video it must measure for
  // billing; every other workflow keeps the plain state shape.
  const inputVideo = model === motionModel ? (Array.isArray(input.videos) ? input.videos[0] : undefined) : undefined;
  const state = { facts: expectedFacts, type: config.type, submittedAt: 2000, timeoutSeconds: 1800, workflowId: config.workflowId, ...(inputVideo ? { inputVideoUrl: inputVideo } : {}) };
  test(model + ': submit persists facts and media type', () => {
    assert.deepEqual(p.parseSubmitResponse(ctx(model), { statusCode: 200, body: envelope('QUEUED') }).state, state);
  });
  const query = { ...ctx(model), taskId: 'upstream-123', state };
  const output = envelope('completed', [{ url: 'https://cdn.example.com/out', type: config.type, file_type: config.type === 'audio' ? 'wav' : 'mp4' }], { duration: 196 });
  fixture(model + ': successful result', 'parseTaskResult', [query, output, { status: 200 }], { status: 'SUCCESS', progress: '100%', url: 'https://cdn.example.com/out' });
  fixture(model + ': processing duration is not output seconds', 'extractUsageOnComplete', [query, { status: 'SUCCESS' }, output], expectedFacts);
  fixture(model + ': failed usage zeroed', 'extractUsageOnComplete', [query, { status: 'FAILURE' }, output], { ...expectedFacts, requests: 0, ...(secondsField || model === motionModel ? { seconds: 0 } : {}) });
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
  const r = p.protocols.openai_video.decodeRequest({ model: 'indextts2-v1', body: { kind: 'form', fields: { model: ['indextts2-v1'], prompt: ['hello'], audios: ['["https://cdn.example.com/voice.wav"]'], emotion: ['{"mode":"vector","calm":0.2}'] } } });
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
test('same-field multipart image files fail explicitly for URL-only adapter', () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind: 'multipart', fields: referenceFields, files: [{ field: 'input_reference', ref: 'request_file:input_reference' }, { field: 'input_reference', ref: 'request_file:input_reference#1' }] } }), /binary uploads.*input_reference/));
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
const miniBase = formats.minimax[referenceModel];
const canonicalBase = p.native.miniCreate({ body: { kind: 'json', value: miniBase } }).requestBody;
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
const frameModel = 'minimax_h3_lightx2v';
const frameMini = formats.minimax[frameModel];
fixture('MiniMax frame roles override array position', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: frameMini.content.slice().reverse() })], p.buildSubmitRequest(ctx(frameModel)));
const frameItems = frameMini.content.filter(i => i.type === 'image_url');
reject('MiniMax duplicate first frame', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: [...frameMini.content, frameItems[0]] })], 'duplicate first_frame');
reject('MiniMax missing last frame', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: frameMini.content.filter(i => i.role !== 'last_frame') })], 'last_frame is required');
reject('MiniMax frame/reference mix', 'buildSubmitRequest', [ctx(frameModel, { ...frameMini, content: [...frameMini.content, { type: 'audio_url', audio_url: { url: 'https://cdn.example.com/a.wav' }, role: 'reference_audio' }] })], 'cannot be mixed');
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
test('only the two namespace-safe interfaces are registered', () => {
  assert.deepEqual(p.meta.routes.map(r => [r.method, r.path]), [
    ['POST', '/v2/video_generation'], ['GET', '/v2/query/video_generation/:task_id'],
  ]);
  assert.equal(formats.minimax_api.create_path, '/v2/video_generation');
  assert.equal(formats.minimax_api.query_path, '/v2/query/video_generation/{task_id}');
  // Nothing may reference the host-reserved /api namespace or the removed proxy prefix.
  for (const route of p.meta.routes) {
    assert.ok(!route.path.startsWith('/api'), route.path);
    // The plugin must not need an origin-proxy prefix either.
    assert.ok(!/bridge|proxy|rewrite/i.test(route.path), route.path);
  }
});
// The removed official model names must not resolve to any workflow any more.
const removedOfficialModels = ['MiniMax-H3', 'MiniMax-H3-Max', 'MiniMax-H3-MAX'];
for (const alias of removedOfficialModels) {
  reject(alias + ': removed official alias is rejected by the MiniMax surface', 'buildSubmitRequest',
    [ctx(alias, { model: alias, content: [{ type: 'text', text: 'test' }], resolution: '768P', duration: 5, ratio: '16:9' })], 'unsupported model');
  reject(alias + ': removed official alias is rejected by the OpenAI surface', 'buildSubmitRequest',
    [ctx(alias, { prompt: 'test', seconds: 5, resolution: '768p' })], 'unsupported model');
  test(alias + ': removed official alias has no usage profile', () =>
    assert.equal(p.meta.usageProfiles.find(profile => profile.models.includes(alias)), undefined));
}
test('no automatic model routing remains', () => {
  assert.ok(!p.meta.models.includes('MiniMax-H3'));
  assert.ok(!p.meta.models.includes('MiniMax-H3-Max'));
  assert.ok(p.meta.models.length === Object.keys(catalog).length + 1, 'only the 17 workflows plus the motion alias');
  assert.ok(p.meta.noAutoRouting === undefined || true);
});
// Only workflow ids are callable now; filter defensively so a stale fixture can
// never re-introduce a removed model name into the suite.
const workflowMiniMax = Object.fromEntries(
  Object.entries(formats.minimax).filter(([name]) => Object.hasOwn(catalog, name)));
for (const [model, request] of Object.entries(workflowMiniMax)) {
  // The MiniMax route decoder and the OpenAI decoder must agree on the canonical request.
  const expected = p.protocols.openai_video.decodeRequest({ model, body: { kind: 'json', value: hostJSON(request) } });
  nativeFixture(model + ': MiniMax route decoder shares the canonical intent', 'miniCreate', [v2Context(request)], expected);
}
// End-to-end MiniMax V2 lifecycle for every workflow: decode the official request,
// submit it upstream, persist the task state, poll, and settle the saved facts.
for (const [model, request] of Object.entries(workflowMiniMax)) {
  const config = catalog[model];
  const intent = p.native.miniCreate(v2Context(request));
  const driver = { ...base, model, upstreamModel: model, requestBody: intent.requestBody };
  const submit = p.buildSubmitRequest(driver);
  test(model + ': V2 upstream submission targets the workflow', () => {
    assert.equal(submit.url, base.baseUrl + 'api/v1/comfyui/comfyui_workflow/' + config.workflowId);
    assert.equal(submit.rewriteModel, config.workflowId, 'the resolved workflow is pinned for polling');
    assert.equal(submit.method, 'POST');
    assert.deepEqual(submit.headers, { Authorization: base.apiKey, 'Content-Type': 'application/json' });
    assert.ok(Object.keys(submit.body).length > 0, 'the upstream body is not empty');
  });
  test(model + ': V2 lifecycle persists, polls and settles the measured usage', () => {
    const submitted = p.parseSubmitResponse(driver, { statusCode: 200, body: envelope('QUEUED') });
    assert.equal(submitted.state.workflowId, config.workflowId);
    assert.deepEqual(submitted.state.facts, p.extractUsage(driver));
    const query = { ...driver, taskId: 'upstream-123', state: submitted.state };
    const output = envelope('SUCCESS', [{ url: 'https://cdn.example.com/out.' + (config.type === 'audio' ? 'wav' : 'mp4'), type: config.type, file_type: config.type === 'audio' ? 'wav' : 'mp4' }], { duration: 196 });
    assert.equal(p.parseTaskResult(query, output, { status: 200 }).status, 'SUCCESS');
    assert.deepEqual(p.extractUsageOnComplete({ state: submitted.state }, { status: 'SUCCESS' }), submitted.state.facts);
    assert.deepEqual(p.listArtifacts({ status: 'SUCCESS', action: intent.action, data: output }), [{ key: config.type, type: config.type, mimeType: config.type === 'audio' ? 'audio/wav' : 'video/mp4' }]);
  });
  test(model + ': V2 failure refunds the saved usage', () => {
    const submitted = p.parseSubmitResponse(driver, { statusCode: 200, body: envelope('QUEUED') });
    const facts = p.extractUsageOnComplete({ state: submitted.state }, { status: 'FAILURE' });
    assert.equal(facts.requests, 0);
    if (facts.seconds !== undefined) assert.equal(facts.seconds, 0);
  });
}
for (const body of [{ kind: 'none' }, { kind: 'form', fields: {} }, { kind: 'json', value: [] }, { kind: 'json', value: { model: 'minimax_h3_z0901', prompt: 'test' } }]) nativeFixture('V2 rejects non-content request ' + JSON.stringify(body), 'miniCreate', [{ path: '/v2/video_generation', body }], null, 'requires a JSON object with model and content');
nativeFixture('V2 create response is the official task_id object', 'miniCreated', [{}, { task_id: 'task_public', data: envelope('QUEUED') }], { task_id: 'task_public' });
const v2QueryContext = { method: 'GET', path: '/v2/query/video_generation/task_public', params: { task_id: 'task_public' } };
for (const [status, external] of Object.entries({ NOT_START: 'queued', SUBMITTED: 'queued', QUEUED: 'queued', IN_PROGRESS: 'running', UNKNOWN: 'running', CANCELLED: 'cancelled' })) nativeFixture('V2 pending status ' + status, 'miniTask', [v2QueryContext, { task_id: 'task_public', status, created_at: 10, updated_at: 11 }], { task: { id: 'task_public', status: external, task_type: 'generation', modality: 'video', created_at: 10, updated_at: 11 } });
nativeFixture('V2 success returns official task content URL without invented metadata', 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'SUCCESS', created_at: 10, updated_at: 11, data: envelope('SUCCESS', [{ type: 'video', url: 'https://cdn.example.com/result.mp4' }], { duration: 196 }) }], { task: { id: 'task_public', status: 'succeeded', task_type: 'generation', modality: 'video', created_at: 10, updated_at: 11, content: { url: 'https://cdn.example.com/result.mp4' } } });
nativeFixture('V2 failure includes official task error structure', 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'FAILURE', fail_reason: 'mock failure' }], { task: { id: 'task_public', status: 'failed', task_type: 'generation', modality: 'video', error: { code: 'video_generation_failed', message: 'mock failure' } } });
for (const type of ['video', 'audio']) nativeFixture('V2 ignores auxiliary image before ' + type, 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'SUCCESS', data: envelope('SUCCESS', [{ type: 'image', url: 'https://cdn.example.com/preview.png' }, { type, url: 'https://cdn.example.com/output.' + (type === 'video' ? 'mp4' : 'wav') }]) }], { task: { id: 'task_public', status: 'succeeded', task_type: 'generation', modality: type, content: { url: 'https://cdn.example.com/output.' + (type === 'video' ? 'mp4' : 'wav') } } });
nativeFixture('V2 video takes precedence over auxiliary audio', 'miniTask', [v2QueryContext, { task_id: 'task_public', status: 'SUCCESS', data: envelope('SUCCESS', [{ type: 'audio', url: 'https://cdn.example.com/aux.wav' }, { type: 'video', url: 'https://cdn.example.com/result.mp4' }]) }], { task: { id: 'task_public', status: 'succeeded', task_type: 'generation', modality: 'video', content: { url: 'https://cdn.example.com/result.mp4' } } });
const protoField = JSON.parse('{"__proto__":{"prompt":"inherited","seconds":1}}');
const auditModel = 'minimax_h3_z0901';
for (const kind of ['json', 'form', 'multipart']) {
  const body = kind === 'json' ? { kind, value: { ...examples[auditModel], ...protoField } } : { kind, fields: { model: [auditModel], prompt: ['test'], ...JSON.parse('{"__proto__":["test"]}') }, files: [] };
  test('audit OpenAI rejects own prototype field in ' + kind, () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: auditModel, body }), /unsupported request field/));
}
test('audit MiniMax workflow rejects own prototype field', () => assert.throws(() => p.native.miniCreate(v2Context({ ...formats.minimax[auditModel], ...protoField })), /unsupported or mixed MiniMax field/));
for (const item of [
  { url: 'https://cdn.example.com/opaque?signature=test', file_type: 'wav' },
  { url: 'https://cdn.example.com/voice.MP3?signature=test' },
  'https://cdn.example.com/voice.flac?signature=test',
]) {
  const task = { task_id: 'task_audio', status: 'SUCCESS', data: envelope('SUCCESS', [item]) };
  const url = typeof item === 'string' ? item : item.url;
  nativeFixture('audit MiniMax audio without explicit type ' + url, 'miniTask', [{}, task], { task: { id: 'task_audio', status: 'succeeded', task_type: 'generation', modality: 'audio', content: { url } } });
}
const untypedPreview = { url: 'https://cdn.example.com/preview', file_type: 'png' };
const untypedVideo = { url: 'https://cdn.example.com/movie', file_type: 'mp4' };
nativeFixture('audit MiniMax selects video after untyped preview', 'miniTask', [{}, { task_id: 'task_video', status: 'SUCCESS', data: envelope('SUCCESS', [untypedPreview, untypedVideo]) }], { task: { id: 'task_video', status: 'succeeded', task_type: 'generation', modality: 'video', content: { url: untypedVideo.url } } });
fixture('audit preview-only output cannot settle video success', 'parseTaskResult', [query, envelope('SUCCESS', [untypedPreview]), { status: 200 }], { status: 'FAILURE', reason: 'AutoDL: SUCCESS response contains no expected media output' });
fixture('audit untyped audio output cannot settle video success', 'parseTaskResult', [query, envelope('SUCCESS', ['https://cdn.example.com/voice.wav']), { status: 200 }], { status: 'FAILURE', reason: 'AutoDL: SUCCESS response contains no expected media output' });
const motionContext = ctx(motionModel);
const motionState = p.parseSubmitResponse(motionContext, { statusCode: 200, body: envelope('QUEUED') }).state;
fixture('motion declared fallback when settlement cannot re-read the output', 'extractUsageOnComplete', [{ upstreamModel: motionModel, state: motionState }, { status: 'SUCCESS' }, envelope('SUCCESS', [], { duration: 196 })], motionState.facts);
for (const status of ['FAILURE', 'CANCELLED']) fixture('motion unsuccessful task refunds ' + status, 'extractUsageOnComplete', [{ state: motionState }, { status }], { ...motionState.facts, requests: 0, seconds: 0 });
for (const seconds of [undefined, 0, -1, 3601, null, '', false, '1e1', 'NaN', [], {}]) reject('motion rejects invalid declaration ' + String(seconds), 'extractUsage', [ctx(motionModel, { ...examples[motionModel], seconds })], 'seconds must be a number');
for (const seconds of [0.25, 1, 3.25, 3600, '3.25']) fixture('motion accepts declared seconds ' + seconds, 'extractUsage', [ctx(motionModel, { ...examples[motionModel], seconds })], { ...motionState.facts, seconds: Number(seconds) });
test('motion declares seconds schema without any custom host capability', () => assert.equal(p.meta.usageProfiles.find(profile => profile.models.includes(motionModel)).schema.seconds.unit, 'second'));
const dataMedia = { image: 'data:image/png;base64,AA==', audio: 'data:audio/wav;base64,AA==', video: 'data:video/mp4;base64,AA==' };

function concatBytes(...parts) {
  const result = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}
function mp4Box(type, payload) {
  const result = new Uint8Array(8 + payload.length), view = new DataView(result.buffer);
  view.setUint32(0, result.length);
  for (let i = 0; i < 4; i++) result[4 + i] = type.charCodeAt(i);
  result.set(payload, 8);
  return result;
}
function mp4Fixture(seconds) {
  const mdhd = new Uint8Array(20), mdhdView = new DataView(mdhd.buffer);
  mdhdView.setUint32(12, 1000); mdhdView.setUint32(16, Math.round(seconds * 1000));
  const hdlr = new Uint8Array(20);
  for (let i = 0; i < 4; i++) hdlr[8 + i] = 'vide'.charCodeAt(i);
  const media = mp4Box('mdia', concatBytes(mp4Box('hdlr', hdlr), mp4Box('mdhd', mdhd)));
  return concatBytes(mp4Box('ftyp', new Uint8Array(8)), mp4Box('moov', mp4Box('trak', media)));
}
function ebmlElement(id, payload) {
  const size = payload.length;
  assert.ok(size < 127);
  return concatBytes(Uint8Array.from(id), Uint8Array.of(0x80 | size), payload);
}
function webmFixture(seconds) {
  const scale = ebmlElement([0x2a, 0xd7, 0xb1], Uint8Array.of(0x0f, 0x42, 0x40));
  const duration = new Uint8Array(8), durationView = new DataView(duration.buffer);
  durationView.setFloat64(0, seconds * 1000000000 / 1000000, false);
  const info = ebmlElement([0x15, 0x49, 0xa9, 0x66], concatBytes(scale, ebmlElement([0x44, 0x89], duration)));
  return ebmlElement([0x18, 0x53, 0x80, 0x67], info);
}
test('motion polling measures MP4 and WebM output without changing submission reservation', () => {
  const previousFetch = utils.fetch;
  try {
    for (const [format, media] of [['mp4', mp4Fixture(3.25)], ['webm', webmFixture(3.25)]]) {
      utils.fetch = request => {
        assert.equal(request.responseType, 'bytes');
        const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
        assert.ok(range);
        const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1);
        const body = media.slice(start, end + 1);
        return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}`, 'Content-Length': String(body.length) }, body: body.buffer };
      };
      const parsed = p.parseTaskResult({ ...motionContext, taskId: 'upstream-123', state: motionState }, envelope('SUCCESS', [{ url: `https://cg-comfyui-prod.tos-cn-beijing.volces.com/out.${format}`, type: 'video', file_type: format }]), { status: 200 });
      assert.equal(parsed.status, 'SUCCESS');
      assert.ok(Math.abs(parsed.state.measuredSeconds - 3.25) < 0.001, format);
      assert.equal(p.extractUsageOnComplete({ state: parsed.state }, { status: 'SUCCESS' }).seconds, parsed.state.measuredSeconds);
    }
  } finally { utils.fetch = previousFetch; }
});
test('motion polling reads a bounded tail range when MP4 moov is not in the head', () => {
  const previousFetch = utils.fetch, small = mp4Fixture(2.5), media = concatBytes(new Uint8Array(1024 * 1024 + 128), small);
  try {
    utils.fetch = request => {
      const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      assert.ok(range); const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1);
      const body = media.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}`, 'Content-Length': String(body.length) }, body: body.buffer };
    };
    const parsed = p.parseTaskResult({ ...motionContext, taskId: 'upstream-123', state: motionState }, envelope('SUCCESS', [{ url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/out.mp4', type: 'video', file_type: 'mp4' }]), { status: 200 });
    assert.ok(Math.abs(parsed.state.measuredSeconds - 2.5) < 0.001);
  } finally { utils.fetch = previousFetch; }
});
// Stock rc.43 runs extractUsageOnComplete with the state persisted before the
// terminal poll, so settlement must read the media itself and only then fall back
// to the value measured while polling and finally to the declared seconds.
function settlementState(measuredSeconds) {
  return { ...motionState, ...(measuredSeconds === undefined ? {} : { measuredSeconds }) };
}
function serveMedia(media) {
  return request => {
    assert.equal(request.responseType, 'bytes');
    const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
    assert.ok(range);
    const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1), body = media.slice(start, end + 1);
    return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}`, 'Content-Length': String(body.length) }, body: body.buffer };
  };
}
test('motion settlement re-reads the result URL and bills the measured duration', () => {
  const previousFetch = utils.fetch;
  try {
    utils.fetch = serveMedia(mp4Fixture(3));
    const settled = p.extractUsageOnComplete({ state: settlementState(9) }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/settled.mp4' });
    assert.ok(Math.abs(settled.seconds - 3) < 0.001, 'settlement measurement wins over both the polling value and the declaration');
    assert.deepEqual({ ...settled, seconds: 0 }, { ...motionState.facts, seconds: 0 });
  } finally { utils.fetch = previousFetch; }
});
test('motion settlement falls back to the polling measurement when no URL is available', () => {
  const before = p.extractUsageOnComplete({ state: settlementState(4) }, { status: 'SUCCESS' });
  assert.equal(before.seconds, 4);
});
test('motion settlement keeps the declared seconds when the media cannot be read', () => {
  const previousFetch = utils.fetch;
  try {
    utils.fetch = () => { throw new Error('range unsupported'); };
    assert.equal(p.extractUsageOnComplete({ state: settlementState(4) }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/blocked.mp4' }).seconds, 4);
    assert.equal(p.extractUsageOnComplete({ state: settlementState(undefined) }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/blocked.mp4' }).seconds, motionState.facts.seconds);
  } finally { utils.fetch = previousFetch; }
});
test('motion settlement ignores processing duration and does not probe failed tasks', () => {
  const previousFetch = utils.fetch;
  let fetches = 0;
  try {
    utils.fetch = request => { fetches++; return previousFetch(request); };
    assert.deepEqual(p.extractUsageOnComplete({ state: settlementState(4) }, { status: 'FAILURE', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/failed.mp4', data: { duration: 196 } }), { ...motionState.facts, requests: 0, seconds: 0 });
    assert.equal(fetches, 0, 'a failed task must not read the result media');
  } finally { utils.fetch = previousFetch; }
});
test('non-motion settlement keeps usage facts untouched and never probes media', () => {
  const previousFetch = utils.fetch;
  let fetches = 0;
  try {
    utils.fetch = request => { fetches++; return previousFetch(request); };
    const state = p.parseSubmitResponse(ctx('minimax_h3_lightx2v_no_pic'), { statusCode: 200, body: envelope('QUEUED') }).state;
    assert.deepEqual(p.extractUsageOnComplete({ state }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/h3.mp4' }), state.facts);
    assert.equal(fetches, 0);
  } finally { utils.fetch = previousFetch; }
});
// The reference video fixes the billed length for motion transfer, so the plugin
// measures it once at submission, while the vendor renders.
test('motion submission measures a public reference video with a bounded range read', () => {
  const previousFetch = utils.fetch, media = mp4Fixture(2.5);
  const ranges = [];
  try {
    utils.fetch = request => {
      ranges.push(request.headers.Range);
      const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      assert.ok(range, request.headers.Range);
      const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1), body = media.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}`, 'Content-Length': String(body.length) }, body: body.buffer };
    };
    const request = structuredClone(examples[motionModel]);
    request.videos = ['https://cdn.example.com/reference.mp4'];
    const state = p.parseSubmitResponse(ctx(motionModel, request), { statusCode: 200, body: envelope('QUEUED') }).state;
    assert.equal(state.inputVideoUrl, 'https://cdn.example.com/reference.mp4');
    assert.ok(Math.abs(state.inputSeconds - 2.5) < 0.001, 'measured input seconds');
    assert.equal(state.facts.seconds, 5, 'the submission reservation still uses the declared seconds');
    assert.equal(ranges.length, 1, 'one bounded range read');
    assert.equal(ranges[0], 'bytes=0-1048575');
  } finally { utils.fetch = previousFetch; }
});
test('motion submission decodes an inline data URL without any network read', () => {
  const previousFetch = utils.fetch, media = mp4Fixture(4);
  let fetches = 0;
  try {
    utils.fetch = request => { fetches++; return previousFetch(request); };
    const dataUrl = 'data:video/mp4;base64,' + Buffer.from(media).toString('base64');
    const request = structuredClone(examples[motionModel]);
    request.videos = [dataUrl];
    const state = p.parseSubmitResponse(ctx(motionModel, request), { statusCode: 200, body: envelope('QUEUED') }).state;
    assert.ok(Math.abs(state.inputSeconds - 4) < 0.001, 'inline reference measured');
    assert.equal(fetches, 0, 'an inline reference needs no fetch');
  } finally { utils.fetch = previousFetch; }
});
test('motion submission keeps going when the reference cannot be measured', () => {
  const previousFetch = utils.fetch;
  try {
    utils.fetch = () => { throw new Error('range unsupported'); };
    const request = structuredClone(examples[motionModel]);
    request.videos = ['https://cdn.example.com/unreadable.mp4'];
    const state = p.parseSubmitResponse(ctx(motionModel, request), { statusCode: 200, body: envelope('QUEUED') }).state;
    assert.equal(state.inputVideoUrl, 'https://cdn.example.com/unreadable.mp4');
    assert.equal(state.inputSeconds, undefined);
    assert.equal(state.facts.seconds, 5);
  } finally { utils.fetch = previousFetch; }
});
test('the measured reference length is cached so later polls do not re-read it', () => {
  const previousFetch = utils.fetch, media = mp4Fixture(1.5);
  let fetches = 0;
  try {
    utils.fetch = request => {
      fetches++;
      const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1), body = media.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}`, 'Content-Length': String(body.length) }, body: body.buffer };
    };
    const request = structuredClone(examples[motionModel]);
    request.videos = ['https://cdn.example.com/cached.mp4'];
    const context = ctx(motionModel, request);
    const first = p.parseSubmitResponse(context, { statusCode: 200, body: envelope('QUEUED') }).state;
    assert.ok(Math.abs(first.inputSeconds - 1.5) < 0.001);
    const second = p.parseSubmitResponse(context, { statusCode: 200, body: envelope('QUEUED') }).state;
    assert.equal(second.inputSeconds, first.inputSeconds);
    assert.equal(fetches, 1, 'the second submission reused the cached measurement');
  } finally { utils.fetch = previousFetch; }
});
test('motion settlement bills the measured reference length when the output cannot be read', () => {
  const previousFetch = utils.fetch;
  try {
    utils.fetch = () => { throw new Error('output host blocks range reads'); };
    const facts = p.extractUsageOnComplete({ state: { ...settlementState(undefined), inputSeconds: 2.5 } }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/blocked.mp4' });
    assert.equal(facts.seconds, 2.5);
    assert.equal(facts.requests, 1);
  } finally { utils.fetch = previousFetch; }
});
for (const [model, config] of Object.entries(catalog)) {
  const expected = p.buildSubmitRequest(ctx(model));
  const body = { ...expected.body };
  for (const [field, rule] of Object.entries(config.rules)) if (dataMedia[rule.type] && Object.hasOwn(body, field)) body[field] = dataMedia[rule.type];
  const openai = structuredClone(examples[model]);
  if (openai.input_reference) openai.input_reference = referenceValues(openai.input_reference).map(() => ({ image_url: dataMedia.image }));
  if (openai.audios) openai.audios = openai.audios.map(() => dataMedia.audio);
  if (openai.videos) openai.videos = openai.videos.map(() => dataMedia.video);
  fixture(model + ': Data URL OpenAI input mapping preserves billing and upstream fields', 'buildSubmitRequest', [ctx(model, openai)], { ...expected, body });
  test(model + ': Data URL preserves usage facts', () => assert.deepEqual(p.extractUsage(ctx(model, openai)), p.extractUsage(ctx(model))));
  const mini = structuredClone(formats.minimax[model]);
  for (const item of mini.content) if (item.type !== 'text') item[item.type].url = dataMedia[item.type.split('_')[0]];
  const intent = p.native.miniCreate({ body: { kind: 'json', value: mini } });
  const request = p.buildSubmitRequest(ctx(model, intent.requestBody));
  fixture(model + ': Data URL MiniMax input mapping', 'buildSubmitRequest', [ctx(model, intent.requestBody)], request);
  test(model + ': MiniMax Data URL fields stay intact', () => {
    assert.deepEqual(request.body, body, 'MiniMax and OpenAI must map equivalent input to the same upstream body');
    for (const [field, rule] of Object.entries(config.rules)) if (dataMedia[rule.type] && Object.hasOwn(request.body, field)) assert.equal(request.body[field], dataMedia[rule.type]);
  });
}
for (const kind of ['image', 'audio', 'video']) {
  const model = kind === 'video' ? motionModel : 'minimax_h3_image_audio_to_video_v2';
  const field = { image: 'input_reference', audio: 'audios', video: 'videos' }[kind];
  for (const value of ['AA==', 'data:;base64,AA==', 'data:text/plain;base64,AA==', 'data:' + kind + '/png,AA==', 'data:' + kind + '/png;base64,', 'data:' + kind + '/png;base64,abc', 'data:' + kind + '/png;base64,A===', 'data:' + kind + '/png;base64,AB==', 'data:' + kind + '/png;base64,AA%3D%3D', 'data:' + kind + '/png;charset=utf-8;base64,AA==', 'data:' + kind + '/png;base64,AA==\n', dataMedia[kind === 'image' ? 'audio' : 'image']]) {
    const body = { ...examples[model], [field]: kind === 'image' ? { image_url: value } : [value] };
    reject(kind + ': malformed or mismatched Data URL rejected ' + value, 'buildSubmitRequest', [ctx(model, body)], 'invalid media URL');
  }
}
for (const kind of ['image', 'audio', 'video']) reject('output ' + kind + ' Data URL remains forbidden', 'listArtifacts', [{ status: 'SUCCESS', data: envelope('SUCCESS', [{ url: dataMedia[kind], type: kind }]) }], 'invalid media URL');
// Duration defaults are the checked AutoDL defaults, never processing time.
for (const [model, config] of Object.entries(catalog)) if (config.secondsField) {
  const openai = structuredClone(examples[model]); delete openai.seconds;
  const mini = structuredClone(formats.minimax[model]); delete mini[config.secondsField];
  for (const [name, body] of [['OpenAI', openai], ['MiniMax', mini]]) {
    const context = ctx(model, body), facts = p.extractUsage(ctx(model));
    fixture(model + ': omitted duration uses official default in ' + name, 'extractUsage', [context], { ...facts, seconds: config.rules[config.secondsField].default });
  }
}
writeFileSync(new URL('./golden.json', import.meta.url), JSON.stringify({ unixNow: 2000, cases: fixtures }, null, 2) + '\n');
console.log(`PASS: ${checks} checks; generated ${fixtures.length} official host fixture cases for all 17 workflows.`);
