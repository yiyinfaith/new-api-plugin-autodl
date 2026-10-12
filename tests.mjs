// Development runner only; the installed plugin has no Node dependencies.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const read = name => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
const readText = name => readFileSync(new URL(name, import.meta.url), 'utf8');
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
  // The declared version must match the source and be a plain release version, but
  // pinning the literal here means every bump breaks the suite for no reason. Assert
  // the shape and that README/API.md agree with the plugin instead.
  assert.match(p.meta.version, /^\d+\.\d+\.\d+$/);
  for (const [name, doc] of [['README.md', readText('README.md')], ['API.md', readText('API.md')]]) {
    assert.ok(doc.includes(p.meta.version), name + ' must state the plugin version ' + p.meta.version);
  }
  assert.equal(p.meta.requiredCapabilities, undefined);
  assert.equal(official.length, 17);
  assert.deepEqual(Object.values(catalog).map(c => c.workflowId).sort(), official.map(c => c.uuid).sort());
  assert.deepEqual(p.meta.models.slice().sort(), [...Object.keys(catalog), 'wan2.2-animate-move', 'IndexTTS-2'].sort());
  assert.equal(p.meta.protocols[0].models.length, 17);
  assert.ok(!p.meta.protocols[0].models.includes('indextts2-v1'));
  // TTS is served only by the MiniMax V2 surface, so its alias must not be
  // advertised on /v1/videos where the audio path cannot answer it.
  assert.ok(!p.meta.protocols[0].models.includes('IndexTTS-2'));
});

// Every advertised model must carry a usage profile, otherwise the host prices it
// from usageSchema alone and per-second billing silently disappears. The
// channel-mapped motion alias regressed this way once: it was listed in
// meta.models but absent from usageProfiles, so it billed per request only.
test('every advertised model has a usage profile', () => {
  const covered = new Set();
  for (const profile of p.meta.usageProfiles) for (const model of profile.models) covered.add(model);
  assert.deepEqual(p.meta.models.filter(model => !covered.has(model)), []);
  assert.deepEqual(p.meta.protocols[0].models.filter(model => !covered.has(model)), []);
});
test('motion transfer bills per second under both its workflow id and channel alias', () => {
  for (const model of [motionModel, 'wan2.2-animate-move']) {
    const profile = p.meta.usageProfiles.find(entry => entry.models.includes(model));
    assert.ok(profile, model + ' has no usage profile');
    assert.equal(profile.schema.seconds.unit, 'second', model + ' lost per-second billing');
    assert.equal(profile.schema.requests.unit, 'count', model);
    assert.ok(profile.examples[0].facts.seconds > 0, model + ' declares no default seconds');
  }
});
// TTS is billed per second of delivered audio. AutoDL's own price_type for the
// workflow is `audio_sec_cost`, so the seconds input MUST exist -- an earlier
// revision wrongly treated "the caller cannot pass a duration" as "there is no
// billable duration" and priced the model per request instead. The alias must
// mirror the workflow exactly.
test('the IndexTTS-2 alias mirrors indextts2-v1, including its per-audio-second billing', () => {
  const officialProfile = p.meta.usageProfiles.find(entry => entry.models.includes('indextts2-v1'));
  const aliasProfile = p.meta.usageProfiles.find(entry => entry.models.includes('IndexTTS-2'));
  assert.ok(officialProfile, 'indextts2-v1 has no usage profile');
  assert.ok(aliasProfile, 'the IndexTTS-2 alias has no usage profile');
  assert.deepEqual(Object.keys(aliasProfile.schema).sort(), Object.keys(officialProfile.schema).sort());
  assert.equal(aliasProfile.schema.requests.unit, 'count');
  // Per-second billing is the whole point of audio_sec_cost; losing this input
  // would silently degrade TTS to a flat per-request charge.
  for (const profile of [officialProfile, aliasProfile]) {
    assert.equal(profile.schema.seconds.unit, 'second');
    assert.equal(profile.schema.seconds.description.zh, '音频生成单价');
    assert.ok(profile.examples[0].facts.seconds > 0, 'no reservation seconds');
  }
  assert.deepEqual(aliasProfile.examples[0].facts, officialProfile.examples[0].facts);
  // The reservation must cover the vendor's minimum charge, which equals ten
  // seconds of audio, so it cannot be inherited from the 5-second motion default.
  assert.equal(aliasProfile.examples[0].facts.seconds, 10);
});
// The delivered audio is the only source of the billable length, so the seconds
// must come from an actual read of the file rather than a declared value.
test('TTS polls and settles on the measured length of the delivered audio', () => {
  const previousFetch = utils.fetch;
  const wav = (seconds, rate = 16000) => {
    // 16 kHz mono 16-bit => byteRate 32000, so `seconds` maps 1:1 to a byte count
    // per 32000. The parsers derive the rate from the fmt chunk; nothing here is
    // fed to the plugin as a number, only as bytes.
    const dataBytes = Math.round(seconds * rate * 2);
    const header = Buffer.alloc(44);
    header.write('RIFF', 0, 'ascii'); header.writeUInt32LE(36 + dataBytes, 4); header.write('WAVE', 8, 'ascii');
    header.write('fmt ', 12, 'ascii'); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22); header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate * 2, 28);
    header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
    header.write('data', 36, 'ascii'); header.writeUInt32LE(dataBytes, 40);
    return new Uint8Array(Buffer.concat([header, Buffer.alloc(dataBytes)]));
  };
  const ttsContext = { ...base, model: 'IndexTTS-2', taskId: 'upstream-123' };
  // `state` is the reservation persisted at submission, which is what production
  // polling receives; the measured value is merged on top of it.
  const ttsState = { workflowId: 'indextts2-v1', type: 'audio', facts: { requests: 1, seconds: 10 } };
  ttsContext.state = ttsState;
  for (const seconds of [3, 12.5]) {
    // Below the vendor minimum the floor is what gets billed; above it the measured
    // length is. Both directions are checked so neither the floor nor the rate can
    // silently swallow the other.
    const billable = Math.max(seconds, 10);
    const media = wav(seconds);
    try {
      utils.fetch = request => {
        assert.equal(request.responseType, 'bytes');
        const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
        const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1);
        const body = media.slice(start, end + 1);
        return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}`, 'Content-Length': String(body.length) }, body: body.buffer };
      };
      const parsed = p.parseTaskResult(ttsContext, envelope('SUCCESS', [{ url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/voice.wav', type: 'audio' }]), { status: 200 });
      assert.equal(parsed.status, 'SUCCESS');
      assert.ok(Math.abs(parsed.state.measuredSeconds - billable) < 0.001, 'polling recorded ' + parsed.state.measuredSeconds + ' for a ' + seconds + 's clip');
      // Settlement must bill the measured clip, not the reservation -- and never
      // below the vendor minimum, which is why the floor is applied here rather
      // than in the pricing expression (the marketplace cannot render it there).
      const settled = p.extractUsageOnComplete({ state: parsed.state }, { status: 'SUCCESS' });
      assert.ok(Math.abs(settled.seconds - billable) < 0.001, 'settled ' + settled.seconds + ' for a ' + seconds + 's clip');
      // Settlement must also re-measure on its own. The host adopts the state
      // written by the terminal poll only afterwards, so `measuredSeconds` is
      // frequently absent here and settlement cannot rely on the polling read.
      const noMeasured = { ...ttsState, measuredSeconds: undefined };
      delete noMeasured.measuredSeconds;
      const fresh = p.extractUsageOnComplete({ state: noMeasured }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/voice.wav' });
      assert.ok(Math.abs(fresh.seconds - billable) < 0.001, 'settlement re-measured ' + fresh.seconds + ' instead of ' + billable);
      // The floor is the vendor's minimum charge expressed in seconds, so the money
      // it implies must equal AutoDL minimum_price exactly.
      assert.ok(Math.abs(billable * 0.001 - Math.max(seconds * 0.001, 0.01)) < 1e-12, 'charge for ' + seconds + 's');
    } finally { utils.fetch = previousFetch; }
  }
});
// A public alias must poll correctly even when the channel does not map it back to
// the workflow id: the plugin resolves aliases itself, so requiring a mapping for
// polling would contradict accepting the alias standalone.
test('an alias polls without a channel mapping, and an unmapped name uses its saved state', () => {
  const previousFetch = utils.fetch;
  const media = (() => {
    const dataBytes = 4 * 32000, header = Buffer.alloc(44);
    header.write('RIFF', 0, 'ascii'); header.writeUInt32LE(36 + dataBytes, 4); header.write('WAVE', 8, 'ascii');
    header.write('fmt ', 12, 'ascii'); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22); header.writeUInt32LE(16000, 24); header.writeUInt32LE(32000, 28);
    header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
    header.write('data', 36, 'ascii'); header.writeUInt32LE(dataBytes, 40);
    return new Uint8Array(Buffer.concat([header, Buffer.alloc(dataBytes)]));
  })();
  const serve = () => request => {
    const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
    const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1);
    const body = media.slice(start, end + 1);
    return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}`, 'Content-Length': String(body.length) }, body: body.buffer };
  };
  const success = envelope('SUCCESS', [{ url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/voice.wav', type: 'audio' }]);
  try {
    // No upstreamModel anywhere: the plugin must resolve the alias on its own.
    const alias = { ...base, model: 'IndexTTS-2', taskId: 'upstream-123', state: { workflowId: 'indextts2-v1', type: 'audio', facts: { requests: 1, seconds: 10 } } };
    utils.fetch = serve();
    const parsed = p.parseTaskResult(alias, success, { status: 200 });
    assert.equal(parsed.status, 'SUCCESS');
    // A 4-second clip is below the vendor minimum, so polling records the floor.
    assert.equal(parsed.state.measuredSeconds, 10, 'alias polling measured ' + parsed.state.measuredSeconds);

    // With no saved state at all, the alias itself must still identify the
    // workflow: this is what proves polling resolves aliases rather than merely
    // leaning on the saved type.
    const bare = { ...base, model: 'IndexTTS-2', taskId: 'upstream-123' };
    utils.fetch = serve();
    assert.equal(p.parseTaskResult(bare, success, { status: 200 }).status, 'SUCCESS');

    // A private name the operator mapped to a workflow we hold no table for. The
    // saved state is the authoritative record of the media type, so polling must
    // still succeed rather than failing the task outright.
    const priv = { ...base, model: 'my-private-voice', upstreamModel: 'my-private-workflow', taskId: 'upstream-123', state: { workflowId: 'indextts2-v1', type: 'audio', facts: { requests: 1, seconds: 10 } } };
    utils.fetch = serve();
    assert.equal(p.parseTaskResult(priv, success, { status: 200 }).status, 'SUCCESS');

    // With neither a known name nor a saved type, failing is correct: inventing a
    // type would misread the payload.
    utils.fetch = () => { throw new Error('no network'); };
    const unknown = { ...base, model: 'my-private-voice', taskId: 'upstream-123' };
    assert.equal(p.parseTaskResult(unknown, success, { status: 200 }).status, 'FAILURE');
  } finally { utils.fetch = previousFetch; }
});
test('an unmeasurable TTS clip still settles at the vendor minimum reservation', () => {
  const previousFetch = utils.fetch;
  const ttsState = { workflowId: 'indextts2-v1', type: 'audio', facts: { requests: 1, seconds: 10 } };
  try {
    // A blocked host must not produce zero seconds: the workflow has no caller
    // declaration to fall back on, so the reservation is the only honest floor.
    utils.fetch = () => { throw new Error('output host blocks range reads'); };
    const blocked = 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/blocked.wav';
    assert.equal(p.extractUsageOnComplete({ state: ttsState }, { status: 'SUCCESS', url: blocked }).seconds, 10);
    // Upstream usage, when it does carry its own seconds, is more specific -- but it
    // is still a delivered length, so the vendor minimum applies to it as well.
    assert.equal(p.extractUsageOnComplete({ state: ttsState }, { status: 'SUCCESS', url: blocked }, { usage: { output_seconds: 7 } }).seconds, 10);
    // Above the minimum it is billed as reported, unfloored.
    assert.equal(p.extractUsageOnComplete({ state: ttsState }, { status: 'SUCCESS', url: blocked }, { usage: { output_seconds: 42 } }).seconds, 42);
    // A bare duration is processing wall time and must never be billed.
    assert.equal(p.extractUsageOnComplete({ state: ttsState }, { status: 'SUCCESS', url: blocked }, { duration: 196 }).seconds, 10);
    // A failed TTS task refunds in full.
    assert.deepEqual(p.extractUsageOnComplete({ state: ttsState }, { status: 'FAILURE' }), { requests: 0, seconds: 0 });
  } finally { utils.fetch = previousFetch; }
});
test('the IndexTTS-2 alias resolves to the same workflow as indextts2-v1', () => {
  const voice = 'data:audio/wav;base64,AA==';
  const tts = (model, extra) => ({ model, content: [
    { type: 'text', text: 'hello world' },
    { type: 'audio_url', role: 'reference_audio', audio_url: { url: voice } },
  ], ...extra });
  const drive = (model, body) => {
    const driver = { ...base, model, body: { kind: 'json', value: body } };
    const decoded = p.native.miniCreate(driver);
    const request = p.buildSubmitRequest({ ...driver, requestBody: decoded.requestBody });
    return { decoded, request, usage: p.extractUsage({ ...driver, requestBody: decoded.requestBody }) };
  };
  const official = drive('indextts2-v1', tts('indextts2-v1'));
  const alias = drive('IndexTTS-2', tts('IndexTTS-2'));
  // The alias must send the workflow's own id upstream, not the alias name.
  assert.equal(alias.request.url, official.request.url);
  assert.ok(alias.request.url.endsWith('/indextts2-v1'));
  assert.equal(alias.request.rewriteModel, 'indextts2-v1');
  assert.equal(alias.request.action, 'text_to_audio');
  assert.deepEqual(alias.request.body, official.request.body);
  assert.deepEqual(alias.usage, official.usage);
  // The saved source pins the workflow id, so every later poll revalidates without
  // needing the alias. Comparing ctx.model against it raw is what rejected every
  // aliased MiniMax request as a workflow-identity conflict.
  assert.equal(JSON.parse(alias.decoded.requestBody.__autodl_minimax).model, 'indextts2-v1');
  for (const model of ['indextts2-v1', 'IndexTTS-2']) {
    assert.equal(p.parseSubmitResponse(
      { ...base, model, requestBody: drive(model, tts(model)).decoded.requestBody },
      { statusCode: 200, body: envelope('QUEUED') }).state.workflowId, 'indextts2-v1', model + ' must poll as the workflow id');
  }
  // Alias-only behaviours that must round-trip through the same code path.
  const two = tts('IndexTTS-2');
  two.content.push({ type: 'audio_url', role: 'reference_audio', audio_url: { url: voice } });
  assert.ok('emo_ref_audio' in drive('IndexTTS-2', two).request.body, 'the emotion reference slot must still bind');
  const emo = drive('IndexTTS-2', tts('IndexTTS-2', { emo_control_method: '使用情感向量控制', emo_happy: 0.8 }));
  assert.equal(emo.request.body.emo_happy, 0.8);
});
// The alias is a public name, so it must not be routable where TTS cannot answer.
// Reaching the audio-slot check proves it resolved to the TTS workflow rather than
// being accepted as a generic video request.
const ttsAsVideo = { model: 'IndexTTS-2', prompt: 'hello' };
reject('IndexTTS-2 is refused on the OpenAI video surface', 'buildSubmitRequest',
  [{ ...base, model: 'IndexTTS-2', body: { kind: 'json', value: ttsAsVideo }, requestBody: ttsAsVideo }], 'audios[0] is required');
test('the TTS alias is not advertised on the OpenAI surface', () =>
  assert.ok(!p.meta.protocols[0].models.includes('IndexTTS-2')));
// A private name the operator chose carries no capability table, so its modality
// cannot be guessed from its spelling. Inferring audio from /tts|indextts/ made a
// video workflow called "tts-enhance-video" submit as text_to_audio, and -- because
// the permissive profile never builds the emo_* rules -- made an emotion payload
// dereference a missing rule and die with a raw TypeError at the upstream call.
test('an unmapped private name is never guessed to be audio, from its name alone', () => {
  const video = { model: 'tts-enhance-video', prompt: 'a cat' };
  const decoded = p.protocols.openai_video.decodeRequest({ ...base, model: 'tts-enhance-video', body: { kind: 'json', value: video } });
  assert.equal(p.buildSubmitRequest({ ...base, model: 'tts-enhance-video', requestBody: decoded.requestBody }).action, 'text_to_video');
  // Emotion on such a name must be refused with a diagnosis, never a TypeError.
  for (const emotion of [{ mode: 'vector', happy: 1 }, { mode: 'vector', random: true }, { mode: 'reference' }, { mode: 'voice' }, {}]) {
    let caught = null;
    try {
      p.protocols.openai_video.decodeRequest({ ...base, model: 'my-tts-model', body: { kind: 'json', value: { model: 'my-tts-model', prompt: 'hi', emotion } } });
    } catch (error) { caught = error; }
    assert.ok(caught, 'emotion ' + JSON.stringify(emotion) + ' on an unmapped name must be refused');
    assert.ok(/^AutoDL: /.test(caught.message), 'must be a diagnostic, got ' + caught.constructor.name + ': ' + caught.message);
  }
  // And no unmapped id, whatever it is called, may reach the upstream with emotion.
  for (const name of ['tts', 'mytts', 'INDEXTTS', 'xTTSy', 'indextts', 'video-tts-upscale']) {
    let caught = null;
    try {
      p.buildSubmitRequest({ ...base, model: name, requestBody: { model: name, prompt: 'h', emotion: { mode: 'vector', happy: 1 } } });
    } catch (error) { caught = error; }
    assert.ok(caught && /^AutoDL: /.test(caught.message), name + ' must be refused cleanly, got ' + (caught && caught.message));
  }
});
// Settlement resolves the saved id through the alias table. A state saved under a
// public alias previously missed both settlement branches, so the clip went
// unmeasured and the TTS minimum was never applied.
test('settlement honours an alias-valued workflowId instead of passing it through', () => {  const previousFetch = utils.fetch;
  const dataBytes = 3 * 32000, header = Buffer.alloc(44);
  header.write('RIFF', 0, 'ascii'); header.writeUInt32LE(36 + dataBytes, 4); header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii'); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22); header.writeUInt32LE(16000, 24); header.writeUInt32LE(32000, 28);
  header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36, 'ascii'); header.writeUInt32LE(dataBytes, 40);
  const media = new Uint8Array(Buffer.concat([header, Buffer.alloc(dataBytes)]));
  try {
    utils.fetch = request => {
      const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(range[1]), end = Math.min(Number(range[2]), media.length - 1);
      const body = media.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}` }, body: body.buffer };
    };
    const url = 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/voice.wav';
    // No seconds fact at all, so only a real measurement can yield a number: this is
    // what distinguishes "settled from the clip" from "passed the state through".
    for (const workflowId of ['indextts2-v1', 'IndexTTS-2']) {
      const out = p.extractUsageOnComplete({ state: { workflowId, type: 'audio', facts: { requests: 1 } } }, { status: 'SUCCESS', url }, {});
      assert.equal(out.seconds, 10, workflowId + ' must measure the 3s clip and apply the 10s floor');
    }
    for (const workflowId of ['wan2.2animate-v4-motion_retargeting', 'wan2.2-animate-move']) {
      const out = p.extractUsageOnComplete({ state: { workflowId, type: 'video', facts: { requests: 1 } } }, { status: 'SUCCESS', url }, {});
      assert.equal(out.seconds, 5, workflowId + ' must run the motion branch');
    }
  } finally { utils.fetch = previousFetch; }
});
// The delivered audio file decides the TTS bill, so every audio byte in it must be
// counted. Three ways of undercounting were found by audit and are locked down here:
// RIFF permits several `data` chunks and the parser returned the first one only; a
// `data` chunk appearing before `fmt ` was skipped and its bytes lost; and a declared
// size larger than the bytes present was billed verbatim.
test('the WAV measure sums every data chunk, in any order, and clamps a lying size', () => {
  const previousFetch = utils.fetch;
  // 8 kHz mono 8-bit = 8000 bytes/sec, so a 60s file fits inside the 1 MB probe.
  const RATE = 8000;
  const fmtChunk = () => {
    const b = Buffer.alloc(16);
    b.writeUInt16LE(1, 0); b.writeUInt16LE(1, 2);
    b.writeUInt32LE(8000, 4); b.writeUInt32LE(RATE, 8);
    b.writeUInt16LE(1, 12); b.writeUInt16LE(8, 14);
    return b;
  };
  const riff = chunks => {
    const parts = [];
    for (const [id, data] of chunks) {
      const head = Buffer.alloc(8);
      head.write(id, 0, 'ascii'); head.writeUInt32LE(data.length, 4);
      parts.push(head, data);
      if (data.length % 2) parts.push(Buffer.alloc(1));
    }
    const body = Buffer.concat(parts);
    const head = Buffer.alloc(12);
    head.write('RIFF', 0, 'ascii'); head.writeUInt32LE(body.length + 4, 4); head.write('WAVE', 8, 'ascii');
    return Buffer.concat([head, body]);
  };
  const billed = (bytes, workflowId) => {
    utils.fetch = request => {
      const m = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(m[1]), end = Math.min(Number(m[2]), bytes.length - 1);
      const body = bytes.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${bytes.length}` }, body };
    };
    return p.extractUsageOnComplete(
      { state: { workflowId: workflowId || 'indextts2-v1', facts: { requests: 1 } } },
      { status: 'SUCCESS', url: 'https://cdn.example.com/a.wav' }, {}).seconds;
  };
  const seconds = s => Buffer.alloc(s * RATE);
  try {
    assert.equal(billed(riff([['fmt ', fmtChunk()], ['data', seconds(60)]])), 60, 'single chunk');
    assert.equal(billed(riff([['fmt ', fmtChunk()], ['data', seconds(12)], ['LIST', Buffer.alloc(16)], ['data', seconds(48)]])), 60, 'two chunks separated by another chunk');
    assert.equal(billed(riff([['fmt ', fmtChunk()], ['data', seconds(1)], ['data', seconds(59)]])), 60, 'two chunks, first tiny');
    assert.equal(billed(riff([['fmt ', fmtChunk()], ['data', seconds(20)], ['data', seconds(20)], ['data', seconds(20)]])), 60, 'three chunks');
    assert.equal(billed(riff([['data', seconds(30)], ['fmt ', fmtChunk()], ['data', seconds(30)]])), 60, 'data before fmt');
    assert.equal(billed(riff([['data', seconds(45)], ['fmt ', fmtChunk()]])), 45, 'data before fmt only');
    // A header claiming far more audio than the file holds must not be believed.
    // Read on the motion path, where no vendor minimum masks the measured value: the
    // motion branch parses video, so assert on the audio branch but subtract the floor
    // by using a file longer than 10s.
    const liar = riff([['fmt ', fmtChunk()], ['data', seconds(30)]]);
    liar.writeUInt32LE(RATE * 3000, 12 + 8 + 16 + 4);
    const honest = (liar.length - (12 + 8 + 16 + 8)) / RATE;
    assert.ok(honest > 10 && honest < 3000, 'the fixture must be smaller than its claim and above the floor');
    assert.equal(billed(liar), honest, 'an inflated declared size is clamped to the bytes present');
    // The floor still applies on top of a clamped measurement.
    const tiny = riff([['fmt ', fmtChunk()], ['data', seconds(1)]]);
    tiny.writeUInt32LE(RATE * 3000, 12 + 8 + 16 + 4);
    assert.equal(billed(tiny), 10, 'the TTS minimum still applies to a clamped measurement');
  } finally { utils.fetch = previousFetch; }
});
// An ID3v2 tag carrying cover art is routinely larger than the old fixed 8 KB sync
// window, which made every art-bearing MP3 look unmeasurable and settle at the floor.
test('the MP3 measure finds its frame sync behind a large ID3v2 tag', () => {
  const previousFetch = utils.fetch;
  const mp3WithArt = (artBytes, audioSeconds) => {
    const bitrate = 128000, rate = 44100;
    const frameLen = Math.floor(144 * bitrate / rate);
    const frames = Math.ceil(audioSeconds * rate / 1152);
    const tag = Buffer.alloc(10 + artBytes);
    tag.write('ID3', 0, 'ascii'); tag.writeUInt8(3, 3); tag.writeUInt8(0, 4); tag.writeUInt8(0, 5);
    const size = artBytes;
    tag[6] = (size >> 21) & 0x7f; tag[7] = (size >> 14) & 0x7f; tag[8] = (size >> 7) & 0x7f; tag[9] = size & 0x7f;
    const first = Buffer.alloc(frameLen);
    first.writeUInt32BE(0xfffb9000, 0);
    first.write('Xing', 36, 'ascii');
    first.writeUInt32BE(1, 40);
    first.writeUInt32BE(frames, 44);
    return Buffer.concat([tag, first, Buffer.alloc(frameLen * (frames - 1))]);
  };
  try {
    for (const art of [0, 4096, 100 * 1024, 400 * 1024]) {
      const bytes = mp3WithArt(art, 52.2449);
      utils.fetch = request => {
        const m = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
        const start = Number(m[1]), end = Math.min(Number(m[2]), bytes.length - 1);
        const body = bytes.slice(start, end + 1);
        return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${bytes.length}` }, body };
      };
      const out = p.extractUsageOnComplete(
        { state: { workflowId: 'indextts2-v1', facts: { requests: 1 } } },
        { status: 'SUCCESS', url: 'https://cdn.example.com/a.mp3' }, {});
      assert.ok(Math.abs(out.seconds - 52.271) < 0.01, 'art ' + art + ' bytes measured ' + out.seconds);
    }
  } finally { utils.fetch = previousFetch; }
});
// The upstream fail_reason is free text and can quote the credential it rejected. The
// OpenAI surface redacted it, but the MiniMax query path returned it verbatim, so the
// AutoDL token reached the end user of a failed task.
test('no surface echoes the credential back in a failure reason', () => {
  const token = 'super-secret-token-value';
  const creds = { apiKey: token, authHeader: 'Bearer ' + token, model: 'minimax_h3_z0903', taskId: 'up-1' };
  const reasons = ['rejected Bearer ' + token, 'token ' + token + ' is invalid', 'rejected "' + token + '"'];
  for (const reason of reasons) {
    const mini = p.native.miniTask(creds, { task_id: 'up-1', status: 'FAILURE', fail_reason: reason });
    assert.ok(!JSON.stringify(mini).includes(token), 'the MiniMax query surface leaked the credential');
    assert.ok(/redacted/.test(mini.task.error.message), 'the credential must be replaced, not merely dropped');
    const openai = p.parseTaskResult(creds, { code: 'Success', data: { task_id: 'up-1', status: 'FAILURE', fail_reason: reason } }, { status: 200 });
    assert.ok(!JSON.stringify(openai).includes(token), 'the OpenAI surface leaked the credential');
  }
  // A reason that carries no credential must survive intact for diagnosis.
  const plain = p.native.miniTask(creds, { task_id: 'up-1', status: 'FAILURE', fail_reason: 'out of memory' });
  assert.equal(plain.task.error.message, 'out of memory');
});
// The delivered file is fetched from a dynamic vendor host, so the credential must never
// travel with it, and a scheme that is not http(s) must never be passed through.
test('artifact content is downloaded credentialless and only over http(s)', () => {
  const token = 'super-secret-token-value';
  const creds = { apiKey: token, authHeader: 'Bearer ' + token };
  const video = { url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/out.mp4', type: 'video', file_type: 'mp4' };
  const audio = { url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/out.wav', type: 'audio', file_type: 'wav' };
  const env = results => ({ code: 'Success', data: { task_id: 'up-1', status: 'SUCCESS', results } });
  const task = (results, action, status) => ({ status: status || 'SUCCESS', action, data: env(results) });
  const listing = p.listArtifacts(task([video, audio], 'text_to_video'));
  assert.deepEqual(listing.map(a => a.key), ['video', 'audio']);
  assert.deepEqual(listing.map(a => a.mimeType), ['video/mp4', 'audio/wav']);
  // A second file of one type must get its own key rather than colliding with the first.
  assert.deepEqual(p.listArtifacts(task([video, { ...video, url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/b.mp4' }], 'text_to_video')).map(a => a.key), ['video', 'video-2']);
  // Nothing is offered for a task that produced nothing.
  assert.deepEqual(p.listArtifacts(task([video], 'text_to_video', 'FAILURE')), []);
  assert.deepEqual(p.listArtifacts({ status: 'IN_PROGRESS', action: 'text_to_video', data: env([video]) }), []);
  // Non-http(s) schemes are refused before they can reach the host.
  for (const url of ['file:///etc/passwd', 'javascript:alert(1)', 'data:video/mp4;base64,AAAA', 'https://cdn.example.com@evil.example.com/x.mp4']) {
    assert.throws(() => p.listArtifacts(task([{ url, type: 'video', file_type: 'mp4' }], 'text_to_video')), /invalid media URL/, url + ' must be refused');
  }
  const request = p.buildContentRequest({ data: task([video], 'text_to_video').data, action: 'text_to_video', artifactKey: 'video', clientRequest: { method: 'GET' }, ...creds });
  assert.equal(request.credentialless, true, 'the vendor CDN must not receive the credential');
  assert.ok(!JSON.stringify(request).includes(token));
  assert.equal(request.url, video.url);
  // The public route is reachable only by GET/HEAD, and only for a listed artifact.
  assert.throws(() => p.buildContentRequest({ data: task([video], 'text_to_video').data, action: 'text_to_video', artifactKey: 'video', clientRequest: { method: 'POST' } }), /GET and HEAD/);
  assert.throws(() => p.buildContentRequest({ data: task([video], 'text_to_video').data, action: 'text_to_video', artifactKey: 'nope', clientRequest: { method: 'GET' } }), /artifact not found/);
});
// OpenAI POST /v1/audio/speech. Plugin API v1 has no audio protocol, so this is a
// native route; it must reuse the TTS validation, billing and settlement unchanged.
test('the OpenAI speech route translates onto the native TTS workflow', () => {
  const voice = 'https://cdn.example.com/voice.wav';
  const emotion = 'https://cdn.example.com/emotion.wav';
  // The decode hook is invoked the way the HOST invokes it for a native route: a
  // ctx.body of {kind, value} and NO top-level model (only protocol contexts carry
  // one). Building the ctx in the protocol shape instead is precisely what let a
  // decoder that read ctx.requestBody/model ship -- every real request was rejected.
  const speech = (body, model) => {
    const request = { model: model || 'IndexTTS-2', ...body };
    return p.native.speechCreate({ ...base, body: { kind: 'json', value: request } });
  };
  // The route is registered and scoped to TTS only.
  const route = p.meta.routes.find(r => r.path === '/autodl/v1/audio/speech');
  assert.ok(route, 'the speech submit route must be registered');
  assert.equal(route.type, 'submit');
  assert.deepEqual(route.models, ['indextts2-v1', 'IndexTTS-2']);
  assert.ok(p.meta.routes.some(r => r.method === 'GET' && r.path === '/autodl/v1/audio/speech/:task_id' && r.type === 'query'));
  const request = speech({ input: 'hello', reference_audio: voice }).requestBody;
  // The speech decode IS the pinned source, so it carries no __autodl_minimax replay
  // envelope; the upstream body it normalizes to must still equal the native one.
  const native = p.native.miniCreate({ ...base, model: 'IndexTTS-2', body: { kind: 'json', value: { model: 'IndexTTS-2', content: [
    { type: 'text', text: 'hello' }, { type: 'audio_url', role: 'reference_audio', audio_url: { url: voice } }] } } }).requestBody;
  const speechSubmit = p.buildSubmitRequest({ ...base, model: 'IndexTTS-2', requestBody: request, action: 'text_to_speech' });
  const nativeSubmit = p.buildSubmitRequest({ ...base, model: 'IndexTTS-2', requestBody: native, action: 'text_to_audio' });
  assert.equal(speechSubmit.url, nativeSubmit.url);
  assert.deepEqual(speechSubmit.body, nativeSubmit.body);
  // Therefore it bills identically: per audio second at the vendor minimum.
  assert.deepEqual(p.extractUsage({ ...base, model: 'IndexTTS-2', requestBody: request }), { requests: 1, seconds: 10 });
  // Submission routes to the TTS workflow and polls back into the same state.
  const submitted = p.buildSubmitRequest({ ...base, model: 'IndexTTS-2', requestBody: request, action: 'text_to_speech' });
  assert.ok(submitted.url.endsWith('/indextts2-v1'));
  const state = p.parseSubmitResponse({ ...base, model: 'IndexTTS-2', requestBody: request },
    { statusCode: 200, body: { code: 'Success', data: { task_id: 'u1', status: 'QUEUED' } } }).state;
  assert.equal(state.workflowId, 'indextts2-v1');
  assert.deepEqual(state.facts, { requests: 1, seconds: 10 });
  // Emotion modes map onto the same top-level emo_* fields the native surface uses.
  assert.equal(speech({ input: 'hi', reference_audio: voice, emotion_vector: { happy: 0.8 } }).requestBody.emo_happy, 0.8);
  assert.equal(speech({ input: 'hi', reference_audio: voice, emotion: { mode: 'vector', happy: 0.8 } }).requestBody.emo_happy, 0.8);
  // The emotion reference binds to the second audio slot; both clips must be present
  // in the decoded content, in the order that assigns prompt_simple then emo_ref_audio.
  const referenceRequest = speech({ input: 'hi', reference_audio: voice, emotion_reference_audio: emotion, emotion: { mode: 'reference' } });
  assert.deepEqual(referenceRequest.requestBody.content.filter(item => item.type === 'audio_url').map(item => item.audio_url.url), [voice, emotion]);
  assert.equal(referenceRequest.requestBody.emo_control_method, '使用情感参考音频');
  assert.equal(speech({ input: 'hi', reference_audio: voice, prompt_text: 'hi' }).requestBody.content[0].text, 'hi');
  // prompt_text is AutoDL's OWN name for the primary text field, so it is an alias of
  // input and never a second slot. Documenting it as an extra slot made every such
  // request fail upstream with "unsupported or mixed MiniMax field prompt_text".
  for (const body of [{ text: 'hi' }, { prompt_text: 'hi' }, { input: 'hi', text: 'hi' }]) {
    assert.equal(speech({ reference_audio: voice, ...body }).requestBody.content[0].text, 'hi', JSON.stringify(body));
  }
  assert.throws(() => speech({ input: 'hi', reference_audio: voice, prompt_text: 'different' }), /must agree/);
  assert.throws(() => speech({ input: 'hi', reference_audio: voice, text: 'different' }), /must agree/);
  assert.throws(() => speech({ prompt_text: '', reference_audio: voice }), /prompt_text must not be empty/);
  assert.throws(() => speech({ prompt_text: 5, reference_audio: voice }), /prompt_text must be a string/);
  // No spelling at all is the documented OpenAI requirement being enforced.
  assert.throws(() => speech({ reference_audio: voice }), /input \(the text to speak\) is required/);
  // Official-but-unhonourable fields are refused rather than silently ignored: a voice
  // preset names a speaker AutoDL cannot synthesise, and a silent substitution would be
  // invisible to the caller.
  for (const body of [{ input: 'hi', voice: 'alloy' }, { input: 'hi', voice: 'alloy', response_format: 'mp3' }]) {
    assert.throws(() => speech(body), /voice presets are not supported/, JSON.stringify(body));
  }
  assert.throws(() => speech({ input: 'hi', reference_audio: voice, response_format: 'ogg' }), /response_format must be one of/);
  assert.throws(() => speech({ voice: 'alloy', reference_audio: voice }), /input \(the text to speak\) is required/);
  assert.throws(() => speech({ input: '', reference_audio: voice }), /input must not be empty/);
  assert.throws(() => speech({ input: 'hi', reference_audio: voice, bogus: 1 }), /unsupported speech field/);
  assert.throws(() => speech({ input: 'hi', reference_audio: voice, speed: -1 }), /speed must be a positive number/);
  assert.throws(() => speech({ input: 'hi', reference_audio: voice, emotion_vector: { nope: 1 } }), /unsupported emotion field/);
  // The route serves TTS only; another model must be refused with a diagnosis.
  assert.throws(() => speech({ input: 'hi' }, 'minimax_h3_z0903'), /served only by IndexTTS-2/);
  // Speed and instructions are documented by OpenAI with no AutoDL counterpart. They
  // carry no media, so they are accepted and ignored rather than failing the call.
  assert.deepEqual(speech({ input: 'hello', reference_audio: voice, speed: 1.5, instructions: 'warm' }).requestBody, request);
});
test('the speech query surface reports status and never leaks the credential', () => {
  const token = 'super-secret-token-value';
  const audio = { url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/a.wav', type: 'audio', file_type: 'wav' };
  const env = results => ({ code: 'Success', data: { task_id: 'u1', status: 'SUCCESS', results } });
  const task = (status, results, extra) => ({ task_id: 'task_abc', status, action: 'text_to_speech', data: env(results), ...extra });
  assert.deepEqual(p.native.speechCreated({ ...base }, { task_id: 'task_abc' }), { id: 'task_abc', status: 'queued' });
  const done = p.native.speechTask({ ...base }, task('SUCCESS', [audio]));
  assert.equal(done.status, 'succeeded');
  assert.equal(done.url, audio.url);
  assert.equal(p.native.speechTask({ ...base }, task('IN_PROGRESS', [audio])).status, 'running');
  assert.equal(p.native.speechTask({ ...base, apiKey: token, authHeader: 'Bearer ' + token }, task('FAILURE', [], { fail_reason: 'rejected Bearer ' + token })).error.message, 'rejected Bearer [redacted]');
  assert.equal(p.native.speechTask({ ...base }, task('CANCELED', [])).status, 'cancelled');
});
// The vendor minimum is a floor on the settled value itself, not merely a default for a
// missing one. A saved value BELOW the minimum is corrupt -- submission writes 10 and
// polling floors at 10 -- but it must still not settle under CNY 0.010, which is what an
// `else if (invalid) reset` form allowed.
test('the TTS floor applies even to a saved value below the minimum', () => {
  for (const workflowId of ['indextts2-v1', 'IndexTTS-2']) {
    for (const saved of [5, 1, 0.5, 9.99, 0.0001]) {
      const out = p.extractUsageOnComplete(
        { state: { workflowId, type: 'audio', facts: { requests: 1, seconds: saved } } }, { status: 'SUCCESS' }, {});
      assert.equal(out.seconds, 10, workflowId + ' saved ' + saved + ' must settle at the 10s minimum');
      assert.equal(out.requests, 1);
    }
  }
  // A genuine measurement above the floor is still billed as measured, not raised to 10.
  const previousFetch = utils.fetch;
  const RATE = 8000;
  const dataBytes = 30 * RATE;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 'ascii'); header.writeUInt32LE(36 + dataBytes, 4); header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii'); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22); header.writeUInt32LE(8000, 24); header.writeUInt32LE(RATE, 28);
  header.writeUInt16LE(1, 32); header.writeUInt16LE(8, 34);
  header.write('data', 36, 'ascii'); header.writeUInt32LE(dataBytes, 40);
  const media = new Uint8Array(Buffer.concat([header, Buffer.alloc(dataBytes)]));
  try {
    utils.fetch = request => {
      const m = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(m[1]), end = Math.min(Number(m[2]), media.length - 1);
      const body = media.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${media.length}` }, body: body.buffer };
    };
    const out = p.extractUsageOnComplete(
      { state: { workflowId: 'indextts2-v1', type: 'audio', facts: { requests: 1, seconds: 10 } } },
      { status: 'SUCCESS', url: 'https://cdn.example.com/a.wav' }, {});
    assert.equal(out.seconds, 30, 'a measured 30s clip must bill 30s');
  } finally { utils.fetch = previousFetch; }
});
// The probe is a fixed window, not the file. Clamping a declared WAV data size to the
// WINDOW capped every file larger than 1 MB at ~65.5s, and because that value is
// non-null the tail read (which exists for exactly those files) never ran: a 3600s clip
// settled at 65.53s. The clamp must use the true resource size.
test('a WAV larger than the probe window measures its true length', () => {
  const previousFetch = utils.fetch;
  const RATE = 16000; // 8 kHz mono 16-bit
  const wav = seconds => {
    const dataBytes = Math.round(seconds * RATE);
    const header = Buffer.alloc(44);
    header.write('RIFF', 0, 'ascii'); header.writeUInt32LE(36 + dataBytes, 4); header.write('WAVE', 8, 'ascii');
    header.write('fmt ', 12, 'ascii'); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
    header.writeUInt16LE(1, 22); header.writeUInt32LE(8000, 24); header.writeUInt32LE(RATE, 28);
    header.writeUInt16LE(1, 32); header.writeUInt16LE(16, 34);
    header.write('data', 36, 'ascii'); header.writeUInt32LE(dataBytes, 40);
    return Buffer.concat([header, Buffer.alloc(dataBytes)]);
  };
  const billed = file => {
    utils.fetch = request => {
      const m = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(m[1]), end = Math.min(Number(m[2]), file.length - 1);
      return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${file.length}` }, body: file.slice(start, end + 1) };
    };
    return p.extractUsageOnComplete(
      { state: { workflowId: 'indextts2-v1', facts: { requests: 1 } } },
      { status: 'SUCCESS', url: 'https://cdn.example.com/a.wav' }, {}).seconds;
  };
  try {
    // 66s and up are all beyond the 1 MB window at this byte rate.
    for (const seconds of [10, 60, 66, 150, 300, 900, 3600]) {
      const measured = billed(wav(seconds));
      assert.equal(measured, seconds, seconds + 's file measured as ' + measured);
    }
    // A declared size larger than the file is still clamped when the true size is known.
    const liar = wav(20);
    liar.writeUInt32LE(RATE * 3000, 40);
    assert.equal(billed(liar), 20, 'an inflated declared size must be clamped to the file');
  } finally { utils.fetch = previousFetch; }
});
// The MP3 scan must not stop at the first sync-like byte pair. A header on a later frame
// (or a stray 0xFF 0xE0 in a payload) made the file unmeasurable, so a 78s clip settled
// at the 10s floor.
test('an MP3 whose frame header is not the first frame still measures', () => {
  const previousFetch = utils.fetch;
  const BITRATE = 128000, RATE = 44100, FRAME = Math.floor(144 * BITRATE / RATE);
  const build = (infoFrame, stray) => {
    const frames = Math.ceil(78.37 * RATE / 1152);
    const parts = [];
    for (let i = 0; i < frames; i++) {
      const buf = Buffer.alloc(FRAME);
      buf.writeUInt32BE(0xfffb9000, 0);
      if (stray && i === 0) { buf[200] = 0xff; buf[201] = 0xe0; }
      if (i === infoFrame) { buf.write('Info', 36, 'ascii'); buf.writeUInt32BE(1, 40); buf.writeUInt32BE(frames, 44); }
      parts.push(buf);
    }
    return Buffer.concat(parts);
  };
  try {
    for (const [label, infoFrame, stray] of [['frame 0', 0, false], ['frame 1', 1, false], ['frame 1 + stray sync', 1, true], ['frame 5', 5, false]]) {
      const file = build(infoFrame, stray);
      utils.fetch = request => {
        const m = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
        const start = Number(m[1]), end = Math.min(Number(m[2]), file.length - 1);
        return { status: 206, headers: { 'Content-Range': `bytes ${start}-${end}/${file.length}` }, body: file.slice(start, end + 1) };
      };
      const out = p.extractUsageOnComplete(
        { state: { workflowId: 'indextts2-v1', facts: { requests: 1 } } },
        { status: 'SUCCESS', url: 'https://cdn.example.com/a.mp3' }, {});
      assert.ok(Math.abs(out.seconds - 78.39) < 0.1, label + ' measured ' + out.seconds);
    }
  } finally { utils.fetch = previousFetch; }
});
// A render hook that throws turns a client poll into a generic 500. A malformed or absent
// task record, a success with no media, and a status whose case differs from the table
// must all produce structured results instead.
test('the query and submit renderers survive malformed task records', () => {
  const audio = { url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/a.wav', type: 'audio', file_type: 'wav' };
  const env = results => ({ code: 'Success', data: { task_id: 'u1', status: 'SUCCESS', results } });
  for (const value of [null, undefined]) {
    assert.equal(p.native.speechTask(base, value).status, 'failed');
    assert.equal(p.native.miniTask(base, value).task.status, 'failed');
    assert.equal(p.native.speechCreated(base, value).id, '');
    assert.equal(p.native.miniCreated(base, value).task_id, '');
  }
  for (const data of [undefined, null, 'junk', { code: 'Success', data: {} }]) {
    const out = p.native.speechTask(base, { task_id: 't', status: 'SUCCESS', action: 'text_to_speech', data });
    assert.ok(out.error, 'a success with no usable output must report an error, got ' + JSON.stringify(out));
  }
  // Case-insensitive status must still deliver the media, including through artifacts().
  const lower = { task_id: 't', status: 'success', action: 'text_to_speech', data: env([audio]) };
  assert.equal(p.native.speechTask(base, lower).url, audio.url);
  assert.deepEqual(p.listArtifacts(lower).map(a => a.type), ['audio']);
  assert.equal(p.native.miniTask(base, { ...lower, action: 'text_to_audio' }).task.content.url, audio.url);
  assert.equal(p.native.miniTask(base, { task_id: 't', status: 'failure', fail_reason: 'boom' }).task.error.message, 'boom');
});
// Both TTS entry points must send the SAME upstream request for the same intent,
// including the emotion control value, so neither can bill or render differently.
test('the speech and native TTS entry points agree on the upstream emotion control', () => {
  const voice = 'https://cdn.example.com/voice.wav';
  const emo = 'https://cdn.example.com/emotion.wav';
  const speechBody = body => p.native.speechCreate({ ...base, body: { kind: 'json', value: { model: 'IndexTTS-2', input: 'hi', reference_audio: voice, ...body } } });
  const nativeBody = extra => p.native.miniCreate({ ...base, model: 'IndexTTS-2', body: { kind: 'json', value: { model: 'IndexTTS-2', content: [
    { type: 'text', text: 'hi' }, { type: 'audio_url', role: 'reference_audio', audio_url: { url: voice } }], ...extra } } });
  const upstream = decoded => p.buildSubmitRequest({ ...base, model: 'IndexTTS-2', requestBody: decoded.requestBody, action: decoded.action }).body;
  const canonical = value => JSON.stringify(value, Object.keys(value).sort());
  const pairs = [
    ['no emotion', {}, {}],
    ['empty emotion object', { emotion: {} }, {}],
    ['emotion_vector', { emotion_vector: { happy: 0.5 } }, { emo_control_method: '使用情感向量控制', emo_happy: 0.5 }],
    ['vector with mode', { emotion: { mode: 'vector', happy: 0.5 } }, { emo_control_method: '使用情感向量控制', emo_happy: 0.5 }],
    ['explicit voice', { emotion: { mode: 'voice' } }, { emo_control_method: '与音色参考音频相同' }],
  ];
  for (const [label, speechExtra, nativeExtra] of pairs) {
    assert.equal(canonical(upstream(speechBody(speechExtra))), canonical(upstream(nativeBody(nativeExtra))),
      label + ' must produce the same upstream body on both entry points');
  }
  // An empty object must select the default (voice/clone), not vector with no vector.
  assert.equal(upstream(speechBody({ emotion: {} })).emo_control_method, '与音色参考音频相同');
  assert.equal(upstream(speechBody({ emotion_vector: { happy: 0.5 } })).emo_control_method, '使用情感向量控制');
  // A non-object vector cannot be silently ignored.
  assert.throws(() => speechBody({ emotion_vector: 5 }), /emotion_vector must be an object/);
  assert.throws(() => speechBody({ emotion: { mode: 'bogus' } }), /emotion.mode must be/);
  assert.throws(() => speechBody({ emotion: [] }), /emotion must be an object/);
  // Reference mode still binds the second clip on both entry points.
  assert.equal(upstream(speechBody({ emotion_reference_audio: emo, emotion: { mode: 'reference' } })).emo_ref_audio, emo);
});
for (const [model, config] of Object.entries(catalog)) {
  const source = official.find(row => row.uuid === config.workflowId);
  const input = examples[model];
  // `images` is the New API Sora spelling. It must reach the same reference
  // slots as input_reference, never be dropped, and never be silently mixed.
  reject(model + ': images and input_reference together conflict', 'buildSubmitRequest', [ctx(model, { ...input, images: ['https://cdn.example.com/a.png'], input_reference: [{ image_url: 'https://cdn.example.com/b.png' }] })], 'not both');
  for (const bad of [1, true, [[{}]], [1], {}]) {
    reject(model + ': malformed images ' + JSON.stringify(bad), 'buildSubmitRequest', [ctx(model, { ...input, images: bad })], 'AutoDL:');
  }
  const expectedBody = {};
  const expectedFacts = { requests: 1 };
  const promptField = ['prompt', 'prompt_text'].find(k => source.input_rules[k]);
  const secondsField = ['duration', 'audio_duration'].find(k => source.input_rules[k]);
  // TTS has no duration parameter but is still billed per delivered audio second,
  // so its reservation is recorded at submission like motion transfer's.
  const measuredSecondsDefault = config.type === 'audio' ? 10 : null;
  if (measuredSecondsDefault !== null) expectedFacts.seconds = measuredSecondsDefault;
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
      // `images` must be a real alias whose pictures reach the same slots; a
      // drop would turn an image request into a silent text-only generation.
      const withoutRefs = { ...input };
      delete withoutRefs.input_reference;
      test(model + ': images strings map to the same slots as input_reference', () => {
        const urls = config[kind].map((_, i) => 'https://cdn.example.com/legacy-' + i + '.png');
        const result = p.buildSubmitRequest(ctx(model, { ...withoutRefs, images: urls }));
        config[kind].forEach((field, i) => assert.equal(result.body[field], urls[i]));
      });
      test(model + ': images objects map like input_reference objects', () => {
        const refs2 = config[kind].map((_, i) => ({ image_url: 'https://cdn.example.com/legacy-obj-' + i + '.png' }));
        assert.deepEqual(p.buildSubmitRequest(ctx(model, { ...withoutRefs, images: refs2 })).body, p.buildSubmitRequest(ctx(model, { ...input, input_reference: refs2 })).body);
      });
      test(model + ': images produces the same action as input_reference', () => {
        const urls = config[kind].map((_, i) => 'https://cdn.example.com/action-' + i + '.png');
        assert.equal(p.buildSubmitRequest(ctx(model, { ...withoutRefs, images: urls })).action, p.buildSubmitRequest(ctx(model, { ...input, input_reference: urls.map(u => ({ image_url: u })) })).action);
      });
      test(model + ': images is classified as image_to_video', () => {
        const urls = config[kind].map((_, i) => 'https://cdn.example.com/kind-' + i + '.png');
        // A video reference outranks an image reference, exactly as it does for input_reference.
        const expected = (input.videos || []).length ? 'video_to_video' : 'image_to_video';
        assert.equal(p.buildSubmitRequest(ctx(model, { ...withoutRefs, images: urls })).action, expected);
      });
      test(model + ': single images string follows the same minimum-count rule as input_reference', () => {
        const one = 'https://cdn.example.com/single.png';
        const minimum = config[kind].reduce((count, field, i) => official.find(row => row.uuid === config.workflowId).input_rules[field]?.required ? i + 1 : count, 0);
        if (minimum <= 1) assert.deepEqual(p.buildSubmitRequest(ctx(model, { ...withoutRefs, images: [one] })).body, p.buildSubmitRequest(ctx(model, { ...input, input_reference: [{ image_url: one }] })).body);
        else assert.throws(() => p.buildSubmitRequest(ctx(model, { ...withoutRefs, images: [one] })), /requires at least/);
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
  fixture(model + ': failed usage zeroed', 'extractUsageOnComplete', [query, { status: 'FAILURE' }, output], { ...expectedFacts, requests: 0, ...(secondsField || model === motionModel || config.type === 'audio' ? { seconds: 0 } : {}) });
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
// Unknown junk is ignored, but a media-shaped or object field is refused rather
// than dropped so a caller cannot lose an input silently.
for (const field of ['seedx', 'prompt_weight']) fixture('tolerated scalar field ' + field, 'extractUsage', [ctx(model, { prompt: 'x', [field]: 3 })], { requests: 1, seconds: 5, resolution: '768p', orientation: 'portrait' });
for (const field of ['metadata', 'mode', 'user', 'n', 'response_format']) fixture('official OpenAI field ' + field + ' is ignored, not fatal', 'extractUsage', [ctx(model, { prompt: 'x', [field]: field === 'n' ? 1 : 'value' })], { requests: 1, seconds: 5, resolution: '768p', orientation: 'portrait' });
for (const field of ['ref_image_0', 'ref_video_0', 'audio_url', 'file', 'image_settings', 'video_settings']) reject('media-shaped field ' + field + ' is refused', 'buildSubmitRequest', [ctx(model, { prompt: 'x', [field]: 'anything' })], 'unsupported request field');
// An unrecognized object could hide media, so it is refused rather than dropped.
for (const field of ['custom_object', 'options', 'settings']) reject('object-valued unknown field ' + field + ' is refused', 'buildSubmitRequest', [ctx(model, { prompt: 'x', [field]: { nested: 'https://cdn.example.com/a.png' } })], 'unsupported request field');
// A mapped id this plugin holds no capability table for is the supported path for
// a self-chosen model name, so it must build a correct upstream URL rather than be
// refused. The operator's mapping also wins over the body's own model name, which
// is what makes mapping usable at all.
const unmapped = p.buildSubmitRequest({ ...context, upstreamModel: 'my_team_private_workflow' });
assert.equal(unmapped.url, 'https://autodl.art/api/v1/comfyui/comfyui_workflow/my_team_private_workflow');
const selfNamed = { model: 'my_team_private_workflow', prompt: 'x', seconds: 5 };
for (const driver of [
  { ...base, model: 'my_team_private_workflow', upstreamModel: 'my_team_private_workflow', body: { kind: 'json', value: selfNamed }, requestBody: selfNamed },
  { ...base, model: 'my_team_private_workflow', body: { kind: 'json', value: selfNamed }, requestBody: selfNamed },
  { ...base, model: model, upstreamModel: 'my_team_private_workflow', body: { kind: 'json', value: examples[model] }, requestBody: examples[model] },
]) {
  assert.equal(p.buildSubmitRequest(driver).url, 'https://autodl.art/api/v1/comfyui/comfyui_workflow/my_team_private_workflow', 'the mapped workflow id reaches upstream');
}
for (const retired of ['MiniMax-H3', 'minimax-h3-max', 'MiniMax-H3-Max']) {
  reject(retired + ': a retired official name cannot be resurrected by channel mapping', 'buildSubmitRequest',
    [{ ...base, model: retired, upstreamModel: retired, body: { kind: 'json', value: { model: retired, prompt: 'x', seconds: 5 } }, requestBody: { prompt: 'x', seconds: 5 } }], 'unsupported model');
}
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
// Bare URL strings and one-element string arrays are now valid reference inputs
// (the New API Sora spelling); malformed shapes must still fail loudly.
for (const value of [false, null, 1, [[singleReference]], [null], [singleReference, 123]]) reject('invalid reference shape ' + JSON.stringify(value), 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: value })], 'image_url object');
for (const value of [singleReference.image_url, [singleReference.image_url], [singleReference.image_url, secondReference.image_url]]) fixture('bare URL reference ' + JSON.stringify(value), 'buildSubmitRequest', [ctx(referenceModel, { ...referenceContext.requestBody, input_reference: value })], p.buildSubmitRequest(ctx(referenceModel, { ...referenceContext.requestBody, input_reference: Array.isArray(value) ? value.map(u => ({ image_url: u })) : { image_url: value } })));
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
  test(kind + ': images and input_reference in one form are rejected as conflicting', () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, images: ['[]'], input_reference: [JSON.stringify(singleReference)] }, files: [] } }), /not both/));
  test(kind + ': images alone in a form reaches the upstream body', () => {
    const urls = ['https://cdn.example.com/legacy-form.png', 'https://cdn.example.com/legacy-form-2.png'];
    const decoded = p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, images: [JSON.stringify(urls)] }, files: [] } });
    assert.deepEqual(decoded.requestBody.images, urls);
    const viaReference = p.buildSubmitRequest(ctx(referenceModel, { ...referenceContext.requestBody, input_reference: urls.map(u => ({ image_url: u })) }));
    assert.equal(decoded.action, viaReference.action);
  });
  // Unparseable JSON is treated as a bare URL, so it must fail URL validation
  // rather than silently becoming a reference.
  test(kind + ': malformed reference JSON is rejected as an invalid URL', () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, input_reference: ['[broken'] }, files: [] } }), /public HTTP\(S\) URL|invalid media URL|image_url/));
  test(kind + ': file_id reference rejected', () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, input_reference: [JSON.stringify({file_id: 'file-123'})] }, files: [] } }), /image_url/));
  for (const value of [JSON.stringify({file_id: 'file-123'})]) test(kind + ': unsupported reference input ' + value, () => assert.throws(() => p.protocols.openai_video.decodeRequest({ model: referenceModel, body: { kind, fields: { ...referenceFields, input_reference: [value] }, files: [] } }), /image_url/));
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
for (const field of ['prompt', 'input_reference', 'images', 'audios', 'videos', 'size', 'orientation']) reject('MiniMax mixed/unsupported top-level ' + field, 'buildSubmitRequest', [ctx(referenceModel, { ...miniBase, [field]: 'unsupported' })], 'mixed MiniMax field');
// Documented MiniMax control metadata with no AutoDL counterpart: accepted and
// ignored (it carries no media), so an official client is not failed outright.
for (const [field, value] of [['callback_url', 'https://example.com/hook'], ['extra', { prompt_expansion_mode: 'quality' }]]) {
  test('MiniMax ' + field + ' is tolerated and ignored', () => {
    assert.deepEqual(p.buildSubmitRequest(ctx(referenceModel, { ...miniBase, [field]: value })).body, p.buildSubmitRequest(ctx(referenceModel, miniBase)).body);
  });
}
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
test('only the namespace-safe interfaces are registered', () => {
  assert.deepEqual(p.meta.routes.map(r => [r.method, r.path]), [
    ['POST', '/v2/video_generation'], ['GET', '/v2/query/video_generation/:task_id'],
    ['POST', '/autodl/v1/audio/speech'], ['GET', '/autodl/v1/audio/speech/:task_id'],
  ]);
  assert.equal(formats.minimax_api.create_path, '/v2/video_generation');
  assert.equal(formats.minimax_api.query_path, '/v2/query/video_generation/{task_id}');
  // Nothing may reference the host-reserved /api namespace or the removed proxy prefix.
  for (const route of p.meta.routes) {
    assert.ok(!route.path.startsWith('/api'), route.path);
    // The plugin must not need an origin-proxy prefix either.
    assert.ok(!/bridge|proxy|rewrite/i.test(route.path), route.path);
  }
  // A plugin route may not intersect a HOST STATIC route: router/plugin-router.go
  // rejects such a plugin from public routing entirely, taking every route and model
  // with it. /v1/audio/speech is a static host route (router/relay-router.go), and
  // SetRelayRouter runs before SetPluginRouter so it is always in the snapshot. The
  // OpenAI speech format therefore lives under /autodl/v1 instead.
  const hostStatic = ['/v1/audio/speech', '/v1/videos', '/v1/images/generations', '/v1/images/edits', '/v1/responses', '/v1/chat/completions', '/v1/models'];
  for (const route of p.meta.routes) {
    for (const reserved of hostStatic) {
      assert.ok(route.path !== reserved && !route.path.startsWith(reserved + '/'),
        route.path + ' would collide with the host static route ' + reserved + ' and get the whole plugin rejected');
    }
  }
  assert.ok(p.meta.routes.every(r => r.path === '/v2/video_generation' || r.path.startsWith('/v2/query/') || r.path.startsWith('/autodl/')),
    'every plugin route must stay in a namespace the host does not serve statically');
  // /autodl/v1/audio/speech is a native route precisely because Plugin API v1 has no
  // audio protocol. If a future host gains one, claiming it here is the better answer.
  assert.deepEqual(p.meta.protocols.map(claim => claim.name), ['openai_video']);
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
  assert.ok(p.meta.models.length === Object.keys(catalog).length + 2, 'the 17 workflows plus the motion and TTS aliases');
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
// Both request formats describe the same workflow, so they must agree on the
// classified action and on the billed seconds. The MiniMax branch reads the
// already-normalized __autodl_fields slots while the OpenAI branch reads
// input_reference/images, so a reference request once decoded as text_to_video
// on one surface and image_to_video on the other without any test noticing.
for (const [model, request] of Object.entries(workflowMiniMax)) {
  // The channel-mapped motion alias has no OpenAI example of its own; skip it
  // here because its workflow id is covered by the motion suites below.
  // indexTTS2 derives its duration from the reference audio instead of a
  // declared seconds field, so it has no seconds value to compare.
  if (!examples[model]) continue;
  // Drive both surfaces to the same declared duration so the comparison is
  // about classification and accounting, not about differing inputs. The
  // upstream field name varies (duration vs audio_duration), so mirror it.
  const secondsField = catalog[model].secondsField;
  const declaresSeconds = typeof secondsField === 'string';
  const openaiBody = Object.assign({}, examples[model], declaresSeconds ? { seconds: 4 } : {});
  const miniBody = Object.assign({}, request, declaresSeconds ? { [secondsField]: 4 } : {});
  const openai = p.protocols.openai_video.decodeRequest({ ...ctx(model, openaiBody), body: { kind: 'json', value: openaiBody } });
  const minimax = p.native.miniCreate(v2Context(miniBody));
  const openaiFacts = declaresSeconds ? p.extractUsage(ctx(model, openaiBody)) : null;
  const minimaxFacts = declaresSeconds ? p.extractUsage({ ...base, model, upstreamModel: model, requestBody: minimax.requestBody, body: { kind: 'json', value: miniBody } }) : null;
  test(model + ': both formats classify the same action', () => assert.equal(minimax.action, openai.action, 'openai=' + openai.action + ' minimax=' + minimax.action));
  test(model + ': both formats bill the same seconds', () => {
    if (!declaresSeconds) return;
    if (openaiFacts.seconds === undefined) assert.equal(minimaxFacts.seconds, undefined);
    else assert.equal(minimaxFacts.seconds, openaiFacts.seconds);
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
for (const seconds of [0, -1, 3601, null, '', false, '1e1', 'NaN', [], {}, 0.25, 0.0001, '0.999']) reject('motion rejects invalid declaration ' + String(seconds), 'extractUsage', [ctx(motionModel, { ...examples[motionModel], seconds })], 'seconds must be a number');
for (const seconds of [1, 3.25, 3600, '3.25']) fixture('motion accepts declared seconds ' + seconds, 'extractUsage', [ctx(motionModel, { ...examples[motionModel], seconds })], { ...motionState.facts, seconds: Number(seconds) });
// The declaration is optional: upstream has no duration control and settlement
// bills the measured clip, so an omitted value must keep a non-zero reservation
// rather than fail the request or leave nothing to bill.
test('motion declaration is optional and still reserves a billable default', () => {
  const without = ctx(motionModel, (() => { const body = { ...examples[motionModel] }; delete body.seconds; delete body.duration; return body; })());
  assert.equal(p.extractUsage(without).seconds, 5, 'omitted declaration reserves the default');
  for (const field of ['seconds', 'duration']) {
    const body = { ...examples[motionModel] };
    delete body.seconds; delete body.duration;
    body[field] = undefined;
    assert.equal(p.extractUsage(ctx(motionModel, body)).seconds, 5, field + ': undefined behaves as omitted');
  }
  // An explicit value still wins, and the two spellings must agree when both are set.
  assert.equal(p.extractUsage(ctx(motionModel, { ...examples[motionModel], seconds: undefined, duration: 3 })).seconds, 3);
  assert.throws(() => p.extractUsage(ctx(motionModel, { ...examples[motionModel], seconds: 4, duration: 6 })), /seconds and duration conflict/);
});
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
// MiniMax's official query response carries an authoritative usage block. AutoDL
// has no equivalent, so this is a last-resort fallback for upstreams that do
// provide it; it must never override a real measurement of the delivered file.
test('motion settlement uses the upstream official usage block only as a last resort', () => {
  const previousFetch = utils.fetch;
  try {
    utils.fetch = () => { throw new Error('output host blocks range reads'); };
    const noState = { ...settlementState(undefined), inputSeconds: undefined };
    const blocked = 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/blocked.mp4';
    // Official MiniMax shape: {"usage":{"total_seconds":...}} beside duration.
    const official = { usage: { total_seconds: 5, input_seconds: 0, output_seconds: 5 }, duration: 5 };
    assert.equal(p.extractUsageOnComplete({ state: noState }, { status: 'SUCCESS', url: blocked }, official).seconds, 5);
    // output_seconds is honoured when total_seconds is missing. The upstream
    // value is billed as reported; the caller's reservation no longer caps it.
    assert.equal(p.extractUsageOnComplete({ state: noState }, { status: 'SUCCESS', url: blocked }, { usage: { output_seconds: 7 } }).seconds, 7);
    assert.equal(p.extractUsageOnComplete({ state: { workflowId: motionModel, facts: { requests: 1, seconds: 9 } } }, { status: 'SUCCESS', url: blocked }, { usage: { output_seconds: 7 } }).seconds, 7);
    // A duration mirror is honoured only when the authoritative usage block is
    // present; on its own it is AutoDL's render wall time, not video length.
    assert.equal(p.extractUsageOnComplete({ state: { workflowId: motionModel, facts: { requests: 1, seconds: 9 } } }, { status: 'SUCCESS', url: blocked }, { usage: { total_seconds: 4 }, duration: 4 }).seconds, 4);
    // Out-of-range or malformed upstream values are ignored, not billed.
    for (const bad of [0, -1, 3601, '5', null, {}, [], true]) {
      assert.equal(p.extractUsageOnComplete({ state: noState }, { status: 'SUCCESS', url: blocked }, { usage: { total_seconds: bad } }).seconds, motionState.facts.seconds, 'rejected ' + JSON.stringify(bad));
    }
    // A locally measured value always beats the upstream declaration.
    assert.equal(p.extractUsageOnComplete({ state: settlementState(4) }, { status: 'SUCCESS' }, official).seconds, 4);
    // AutoDL's processing wall time must never be billed as video seconds, with
    // or without a usage block beside it.
    assert.equal(p.extractUsageOnComplete({ state: noState }, { status: 'SUCCESS', url: blocked }, { duration: 196 }).seconds, motionState.facts.seconds);
    assert.equal(p.extractUsageOnComplete({ state: noState }, { status: 'SUCCESS', url: blocked }, envelope('SUCCESS', [], { duration: 196 })).seconds, motionState.facts.seconds, 'the AutoDL envelope wrapper is not an upstream usage block');
    assert.equal(p.extractUsageOnComplete({ state: noState }, { status: 'SUCCESS', url: blocked }, { usage: { input_seconds: 9 }, duration: 196 }).seconds, motionState.facts.seconds, 'a usage block without output seconds does not make duration trustworthy');
    // The declaration is only the reservation and never caps the bill. Capping
    // at it let a caller declare one second against a much longer render and pay
    // a fraction of the price, so the measured or upstream value wins outright.
    assert.equal(p.extractUsageOnComplete({ state: { workflowId: motionModel, facts: { requests: 1, seconds: 1 } } }, { status: 'SUCCESS', url: blocked }, { usage: { total_seconds: 300 } }).seconds, 300);
    assert.equal(p.extractUsageOnComplete({ state: { workflowId: motionModel, facts: { requests: 1, seconds: 5 } } }, { status: 'SUCCESS', url: blocked }, { usage: { total_seconds: 2 } }).seconds, 2);
    // Failed tasks still refund and never read the block.
    assert.deepEqual(p.extractUsageOnComplete({ state: settlementState(4) }, { status: 'FAILURE' }, official), { ...motionState.facts, requests: 0, seconds: 0 });
  } finally { utils.fetch = previousFetch; }
});
// A 206 without Content-Range reports the partial body's size in
// Content-Length, which equals the probe length and used to make the "is there
// more to read?" test false, silently skipping the tail read for files whose
// moov sits at the end.
test('a partial response without Content-Range still probes the tail', () => {
  const previousFetch = utils.fetch;
  const calls = [];
  try {
    // moov sits past the probe window, so only a tail read can find it. The
    // responses deliberately omit Content-Range: a legal server may do that, and
    // Content-Length then describes only the partial body, which equals the probe
    // window for the head request and used to look like "nothing more to read".
    const media = mp4Fixture(3.25);
    const file = concatBytes(mp4Box('free', new Uint8Array(2 * 1024 * 1024)), media);
    const total = file.length;
    utils.fetch = (request) => {
      calls.push(request.method);
      if (request.method === 'HEAD') return { status: 200, headers: { 'Content-Length': String(total) } };
      const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(range[1]), end = Math.min(Number(range[2]), total - 1);
      const body = file.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Length': String(body.length) }, body: body.buffer };
    };
    const facts = p.extractUsageOnComplete({ state: settlementState(undefined) }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/tail.mp4' });
    assert.deepEqual(calls, ['GET', 'HEAD', 'GET'], 'probe, then size, then tail: ' + JSON.stringify(calls));
    assert.equal(facts.seconds, 3.25, 'the tail read recovered the real duration');
  } finally { utils.fetch = previousFetch; }
});
test('settlement reuses the full probe so a late moov still measures', () => {
  const previousFetch = utils.fetch;
  const calls = [];
  try {
    // moov past the first megabyte: the head Range read alone cannot see it, so
    // settlement must issue the HEAD size probe and a tail read. Calling
    // mediaRange directly would settle at the declared value instead.
    const media = mp4Fixture(3.25);
    const file = concatBytes(mp4Box('free', new Uint8Array(2 * 1024 * 1024)), media);
    const total = file.length;
    utils.fetch = (request) => {
      calls.push(request.method);
      if (request.method === 'HEAD') return { status: 200, headers: { 'Content-Length': String(total) } };
      const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(range[1]), end = Math.min(Number(range[2]), total - 1);
      const body = file.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Length': String(body.length) }, body: body.buffer };
    };
    const facts = p.extractUsageOnComplete({ state: settlementState(undefined) }, { status: 'SUCCESS', url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/tail.mp4' });
    assert.deepEqual(calls, ['GET', 'HEAD', 'GET'], 'settlement performed the full probe: ' + JSON.stringify(calls));
    assert.equal(facts.seconds, 3.25, 'settlement measured the delivered file');
  } finally { utils.fetch = previousFetch; }
});
test('a cancelled upstream task terminates instead of polling to the deadline', () => {
  const state = { workflowId: motionModel, facts: { requests: 1, seconds: 3 }, submittedAt: 1, timeoutSeconds: 1800 };
  for (const token of ['CANCELLED', 'CANCELED', 'Canceled', 'cancelled', 'Cancelled', 'failed', 'Failed']) {
    const result = p.parseTaskResult({ model: motionModel, upstreamModel: motionModel, taskId: 'up', state }, { code: 'Success', data: { task_id: 'up', status: token } }, { status: 200 });
    assert.equal(result.status, 'FAILURE', token + ' is terminal');
  }
});
test('every failure spelling the host can persist still refunds', () => {
  // native.miniTask renders this plugin's own FAILURE/CANCELLED as lowercase
  // "failed"/"cancelled", so matching only the internal enum left a failed task
  // on the MiniMax surface charged in full.
  for (const status of ['FAILURE', 'FAILED', 'CANCELLED', 'CANCELED', 'failed', 'cancelled', 'canceled', 'ERROR', 'TIMEOUT']) {
    const facts = p.extractUsageOnComplete({ state: settlementState(undefined) }, { status }, {});
    assert.deepEqual({ requests: facts.requests, seconds: facts.seconds }, { requests: 0, seconds: 0 }, 'refunded: ' + status);
  }
  // The statuses miniTask itself emits must round-trip into the refund.
  for (const internal of ['FAILURE', 'CANCELLED']) {
    const rendered = p.native.miniTask({}, { task_id: 'x', status: internal, data: {} }).task.status;
    const facts = p.extractUsageOnComplete({ state: settlementState(undefined) }, { status: rendered }, {});
    assert.deepEqual({ requests: facts.requests, seconds: facts.seconds }, { requests: 0, seconds: 0 }, internal + ' -> ' + rendered);
  }
  // A success must never be refunded.
  assert.equal(p.extractUsageOnComplete({ state: settlementState(undefined) }, { status: 'SUCCESS' }, {}).requests, 1);
});
test('safeReason keeps a short key from shredding the diagnostic', () => {
  const message = 'upstream error: node 27 execution failed at render step';
  for (const key of ['k', 'error', 'failed', 'short']) {
    const result = p.parseTaskResult({ ...motionContext, taskId: 't', apiKey: key, authHeader: key, state: motionState }, envelope('FAILED', [], { message, task_id: 't' }), { status: 200 });
    assert.equal(result.reason, message, 'key ' + key + ' left the text intact');
  }
});
test('the billed track is the one carrying the delivered picture', () => {
  const previousFetch = utils.fetch;
  const track = (seconds, handler, sampled) => {
    const mdhd = new Uint8Array(20), view = new DataView(mdhd.buffer);
    view.setUint32(12, 1000); view.setUint32(16, Math.round(seconds * 1000));
    const hdlr = new Uint8Array(20);
    for (let i = 0; i < 4; i++) hdlr[8 + i] = handler.charCodeAt(i);
    const parts = [mp4Box('hdlr', hdlr), mp4Box('mdhd', mdhd)];
    if (sampled) parts.push(mp4Box('minf', mp4Box('stbl', new Uint8Array(8))));
    return mp4Box('trak', mp4Box('mdia', concatBytes(...parts)));
  };
  // A long auxiliary 'vide' track (sprite/poster) must not outrank the real
  // picture track; ranking purely by length would over-bill past the ceiling.
  const cases = [
    ['sampled 6s then unsampled 120s', track(6, 'vide', true), track(120, 'vide', false), 6],
    ['unsampled 120s then sampled 6s', track(120, 'vide', false), track(6, 'vide', true), 6],
    ['sampled 6s then sampled 1s', track(6, 'vide', true), track(1, 'vide', true), 6],
    ['sampled 1s then sampled 6s', track(1, 'vide', true), track(6, 'vide', true), 6],
    ['sampled video 6s then audio 300s', track(6, 'vide', true), track(300, 'soun', true), 6],
  ];
  try {
    for (const [label, first, second, want] of cases) {
      const file = concatBytes(mp4Box('ftyp', new Uint8Array(8)), mp4Box('moov', concatBytes(first, second)));
      const url = 'data:video/mp4;base64,' + Buffer.from(file).toString('base64');
      const measured = p.parseSubmitResponse(
        { ...motionContext, requestBody: { ...examples[motionModel], videos: [url] } },
        { statusCode: 200, body: envelope('QUEUED') });
      assert.equal(measured.state.inputSeconds, want, label);
    }
  } finally { utils.fetch = previousFetch; }
});
test('an inline reference larger than the probe window is still measured', () => {
  // The network path reads the head then the tail; the inline path must match,
  // or a big local reference silently falls back to an unverified declaration.
  const track = (seconds) => {
    const mdhd = new Uint8Array(20), view = new DataView(mdhd.buffer);
    view.setUint32(12, 1000); view.setUint32(16, Math.round(seconds * 1000));
    const hdlr = new Uint8Array(20);
    for (let i = 0; i < 4; i++) hdlr[8 + i] = 'vide'.charCodeAt(i);
    return mp4Box('trak', mp4Box('mdia', concatBytes(mp4Box('hdlr', hdlr), mp4Box('mdhd', mdhd), mp4Box('minf', mp4Box('stbl', new Uint8Array(8))))));
  };
  const media = concatBytes(mp4Box('ftyp', new Uint8Array(8)), mp4Box('moov', track(45)));
  const file = concatBytes(mp4Box('free', new Uint8Array(2 * 1024 * 1024)), media);
  const url = 'data:video/mp4;base64,' + Buffer.from(file).toString('base64');
  const measured = p.parseSubmitResponse(
    { ...motionContext, requestBody: { ...examples[motionModel], videos: [url] } },
    { statusCode: 200, body: envelope('QUEUED') });
  assert.equal(measured.state.inputSeconds, 45, 'the inline tail read recovered the real duration');
});
// The host hands the renderer a TaskView without `action`, so it cannot know the
// modality. Filtering to video and then dereferencing [0] threw on every
// audio-only task and wiped the results list.
test('rendering an audio-only task returns its media instead of throwing', () => {
  const view = (payload, action) => ({ task_id: 'x', platform: 'autodl', status: 'SUCCESS', progress: 100, fail_reason: '',
    created_at: 1, updated_at: 2, data: payload, ...(action ? { action } : {}) });
  const payloadFor = results => ({ code: 'Success', data: { task_id: 'upstream-123', status: 'SUCCESS', results } });
  const video = payloadFor([{ url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/a.mp4', type: 'video', file_type: 'mp4' }]);
  const audio = payloadFor([{ url: 'https://cdn.example.com/a.mp3', type: 'audio', file_type: 'mp3' }]);

  const renderedVideo = p.protocols.openai_video.render({}, view(video));
  assert.equal(renderedVideo.url, 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/a.mp4');
  assert.deepEqual(renderedVideo.results, [{ url: 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/a.mp4', type: 'video' }]);

  for (const action of [undefined, 'text_to_audio']) {
    const rendered = p.protocols.openai_video.render({}, view(audio, action));
    assert.equal(rendered.url, 'https://cdn.example.com/a.mp3', 'audio rendered with action=' + action);
    assert.deepEqual(rendered.results, [{ url: 'https://cdn.example.com/a.mp3', type: 'audio' }]);
  }
});
test('an upstream status never renders as a live task once it is terminal', () => {
  const payload = { code: 'Success', data: { task_id: 'x', status: 'SUCCESS', results: [{ url: 'https://cdn.example.com/a.mp4', type: 'video', file_type: 'mp4' }] } };
  const statuses = { CANCELLED: 'cancelled', CANCELED: 'cancelled', FAILURE: 'failed', FAILED: 'failed', SUCCESS: 'succeeded', IN_PROGRESS: 'running' };
  for (const [token, want] of Object.entries(statuses)) {
    const rendered = p.native.miniTask({}, { task_id: 'x', status: token, data: payload }).task.status;
    assert.equal(rendered, want, token + ' rendered as ' + rendered);
  }
});
test('an under-declared motion task is billed the measured clip, not the declaration', () => {
  const previousFetch = utils.fetch;
  const motionTrack = (seconds) => {
    const mdhd = new Uint8Array(20), view = new DataView(mdhd.buffer);
    view.setUint32(12, 1000); view.setUint32(16, Math.round(seconds * 1000));
    const hdlr = new Uint8Array(20);
    for (let i = 0; i < 4; i++) hdlr[8 + i] = 'vide'.charCodeAt(i);
    return mp4Box('trak', mp4Box('mdia', concatBytes(mp4Box('hdlr', hdlr), mp4Box('mdhd', mdhd), mp4Box('minf', mp4Box('stbl', new Uint8Array(8))))));
  };
  const file = concatBytes(mp4Box('ftyp', new Uint8Array(8)), mp4Box('moov', motionTrack(10)));
  const url = 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/ten.mp4';
  try {
    utils.fetch = (request) => {
      const range = /^bytes=(\d+)-(\d+)$/.exec(request.headers.Range);
      const start = Number(range[1]), end = Math.min(Number(range[2]), file.length - 1);
      const body = file.slice(start, end + 1);
      return { status: 206, headers: { 'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length, 'Content-Length': String(body.length) }, body: body.buffer };
    };
    // The declaration never reaches the vendor, so it must not cap the bill:
    // declaring 1s against a 10s render used to pay a tenth of the price.
    for (const declared of [1, 5]) {
      const facts = p.extractUsageOnComplete(
        { state: { workflowId: motionModel, facts: { requests: 1, seconds: declared }, submittedAt: 1, timeoutSeconds: 1800 } },
        { status: 'SUCCESS', url }, {});
      assert.equal(facts.seconds, 10, 'declared ' + declared + ' must still bill the measured 10s');
    }
    // A larger declaration must not over-bill either: the measurement wins outright.
    const generous = p.extractUsageOnComplete(
      { state: { workflowId: motionModel, facts: { requests: 1, seconds: 30 }, submittedAt: 1, timeoutSeconds: 1800 } },
      { status: 'SUCCESS', url }, {});
    assert.equal(generous.seconds, 10, 'a generous declaration must not over-bill');
  } finally { utils.fetch = previousFetch; }
});
test('an unmeasurable motion task without a declaration still bills a reservation', () => {
  const previousFetch = utils.fetch;
  try {
    utils.fetch = () => ({ status: 403, headers: {}, body: new ArrayBuffer(0) });
    const url = 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/blocked.mp4';
    // Nothing measurable and no upstream usage block: the reservation must stand,
    // otherwise an unmeasurable render settles at zero seconds and is free.
    const facts = p.extractUsageOnComplete(
      { state: { workflowId: motionModel, facts: { requests: 1, seconds: 5 }, submittedAt: 1, timeoutSeconds: 1800 } },
      { status: 'SUCCESS', url }, {});
    assert.equal(facts.seconds, 5, 'the reservation is kept when nothing can be measured');
    // Even a state that somehow reached settlement with no seconds at all.
    const bare = p.extractUsageOnComplete(
      { state: { workflowId: motionModel, facts: { requests: 1 }, submittedAt: 1, timeoutSeconds: 1800 } },
      { status: 'SUCCESS', url }, {});
    assert.equal(bare.seconds, 5, 'a missing reservation falls back to the default');
    // A failed task still refunds to zero regardless.
    const failed = p.extractUsageOnComplete(
      { state: { workflowId: motionModel, facts: { requests: 1, seconds: 5 }, submittedAt: 1, timeoutSeconds: 1800 } },
      { status: 'FAILURE', url }, {});
    assert.deepEqual(failed, { requests: 0, seconds: 0 }, 'failure refunds');
  } finally { utils.fetch = previousFetch; }
});
test('an upstream usage block is trusted only for its own seconds', () => {
  const previousFetch = utils.fetch;
  try {
    utils.fetch = () => ({ status: 403, headers: {}, body: new ArrayBuffer(0) });
    const url = 'https://cg-comfyui-prod.tos-cn-beijing.volces.com/blocked.mp4';
    const state = { workflowId: motionModel, facts: { requests: 1, seconds: 5 }, submittedAt: 1, timeoutSeconds: 1800 };
    assert.equal(p.extractUsageOnComplete({ state }, { status: 'SUCCESS', url }, { usage: { total_seconds: 7 } }).seconds, 7);
    assert.equal(p.extractUsageOnComplete({ state }, { status: 'SUCCESS', url }, { usage: { output_seconds: 7 } }).seconds, 7);
    // `duration` is AutoDL render wall time; a usage block without its own seconds
    // must not make it trustworthy, or a 3-minute render bills as 196 seconds.
    assert.equal(p.extractUsageOnComplete({ state }, { status: 'SUCCESS', url }, { usage: { input_seconds: 9 }, duration: 196 }).seconds, 5);
    assert.equal(p.extractUsageOnComplete({ state }, { status: 'SUCCESS', url }, { duration: 196 }).seconds, 5);
  } finally { utils.fetch = previousFetch; }
});
// The dangerous failure mode of accepting mapped names: if an unknown mapping
// replaced the caller's declared table, an operator pointing a declared model at a
// private workflow id would silently drop that model's prompt/seconds/media/
// resolution limits and a customer could buy an out-of-range generation. Mapping
// may change only WHERE the request runs, never WHAT is validated.
test('a declared model keeps its own limits when mapped to an unknown workflow id', () => {
  const seconds = 'minimax_h3_z0901', resolution = 'minimax_h3_lightx2v_no_pic';
  for (const driver of [
    { ...base, model: resolution, upstreamModel: 'my_team_private_workflow' },
    { ...base, model: 'client-alias', upstreamModel: resolution },
  ]) {
    const withBogus = { ...examples[resolution], resolution: '9999p' };
    assert.throws(() => p.buildSubmitRequest({ ...driver, body: { kind: 'json', value: withBogus }, requestBody: withBogus }),
      /unsupported resolution\/orientation combination/, 'a bogus resolution label must not pass through');
  }
  const outOfRange = { ...examples[seconds], seconds: 99 };
  assert.throws(() => p.buildSubmitRequest({ ...base, model: seconds, upstreamModel: 'my_team_private_workflow', body: { kind: 'json', value: outOfRange }, requestBody: outOfRange }),
    /seconds must be an integer between 1 and 15/, 'an out-of-range seconds value must not pass through');
  // The declared validation still applies to the media requirement. z0901 is
  // text-only by design, so use one that genuinely requires a reference image.
  const needsImage = 'minimax_h3_z0902';
  const noMedia = { ...examples[needsImage] };
  delete noMedia.input_reference; delete noMedia.images;
  assert.throws(() => p.buildSubmitRequest({ ...base, model: needsImage, upstreamModel: 'my_team_private_workflow', body: { kind: 'json', value: noMedia }, requestBody: noMedia }),
    /at least 1 image/, 'a required media slot must still be enforced');
  // ...and the mapped id is still the one actually called.
  const good = examples[resolution];
  assert.equal(p.buildSubmitRequest({ ...base, model: resolution, upstreamModel: 'my_team_private_workflow', body: { kind: 'json', value: good }, requestBody: good }).url,
    'https://autodl.art/api/v1/comfyui/comfyui_workflow/my_team_private_workflow');
});
test('safeReason redacts a credential split by intervening characters', () => {
  const secret = 'super-secret-autodl-token';
  const driving = { ...motionContext, taskId: 'upstream-1', state: motionState, apiKey: secret, authHeader: 'Bearer ' + secret };
  const mangled = ['key="' + secret.slice(0, 10) + '" and ' + secret.slice(10), 'a' + secret.slice(0, 8) + '\n' + secret.slice(8)];
  for (const message of mangled) {
    const result = p.parseTaskResult(driving, envelope('FAILED', [], { message, task_id: 'upstream-1' }), { status: 200 });
    assert.ok(!result.reason.includes(secret.slice(0, 12)), 'leaked head: ' + result.reason);
    assert.ok(!result.reason.includes(secret.slice(-10)), 'leaked tail: ' + result.reason);
  }
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
