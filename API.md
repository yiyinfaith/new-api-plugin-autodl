# AutoDL 插件接口参考

版本 **1.1.5**。本文件是调用方的字段参考；安装、渠道和价格配置见 [README](README.md)。示例中的 `https://media.example.com/...` 需换成真实可公开访问的媒体。

## 接口一览

| 格式 | 创建 | 查询 | 成功产物 | 模型 |
|---|---|---|---|---|
| OpenAI Videos | `POST /v1/videos` | `GET /v1/videos/{id}` | `url`、`results[]`；`GET /v1/videos/{id}/content` 下载 | 26 个视频工作流 |
| MiniMax V2 | `POST /v2/video_generation` | `GET /v2/query/video_generation/{task_id}` | `task.content.url` | 全部 27 个 |
| AutoDL 原生 | `POST /autodl/api/v1/comfyui/comfyui_workflow/{workflow_id}` | `GET /autodl/api/v1/comfyui/comfyui_workflow/result/{task_id}` | `data.results[].url` | 全部 27 个 |
| 阿里云百炼 DashScope | `POST /autodl/api/v1/services/aigc/image2video/video-synthesis` | `GET /autodl/api/v1/tasks/{task_id}` | `output.results.video_url` | `wan2.2-animate-move` |

- **AutoDL 原生和 DashScope 的路径必须带 `/autodl` 前缀**：它们的官方路径以 `/api/` 开头，而 `/api` 属于 New API 自己，宿主（rc.48+）只在插件 key 前缀下提供这两组路由。调用方把官方 Base URL 换成 `https://你的域名/autodl`，路径其余部分照抄官方。
- 鉴权用 New API 的 Key：`Authorization: Bearer <NEW_API_KEY>`，不要传 AutoDL Token。AutoDL 原生格式也可以照官方写法不带 `Bearer`。
- 路径决定格式，`model` 决定工作流。`model` 填 workflow ID（AutoDL 原生格式写在路径里）；`wan2.2-animate-move`（动作迁移）和 `IndexTTS-2`（TTS）是插件自带别名。
- 任务是异步的：创建后用返回的 New API 任务 ID 轮询，不要用上游 ID，也不要重复提交。

## 通用规则

- **媒体输入**：公网 HTTP(S) URL，或标准 Base64 Data URL（如 `data:image/png;base64,…`、`data:audio/wav;base64,…`、`data:video/mp4;base64,…`）。MIME 类别必须与字段一致，Base64 必须是标准字母表且补位正确。不支持裸 Base64、文件路径、`file_id` 和文件上传。大文件请用 URL（宿主限制请求体大小）。官网接受的格式：图片 JPEG/PNG/WebP；音频 MP3/WAV（多数 H3 还接受 FLAC）；视频 MP4/WebM。
- **严格校验**：媒体数量、时长、分辨率、文本长度超出工作流范围直接报错，插件不截断、不补齐、不降档，报错的请求不会扣费。
- **未知字段**：OpenAI、MiniMax、DashScope 拒绝未知字段（`unsupported request field …` / `unsupported or mixed MiniMax field …` / `unsupported DashScope … field …`），避免拼错的参数被静默丢弃；少数官方兼容字段例外，见各格式说明。AutoDL 原生格式是透传，未知字段原样发给 AutoDL。
- **超时**：排队或运行超过 30 分钟，任务按失败结束并退回 New API 预扣；上游任务可能仍在运行，AutoDL 侧不会因此退款。
- **产物**：只返回 HTTP(S) URL，是 24 小时有效的签名链接，请及时保存。下载链接不附带任何密钥。

## OpenAI Videos

### 请求字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `model` | string | 必填。视频 workflow ID 或 `wan2.2-animate-move`。 |
| `prompt` | string | 有文本槽位的工作流必填（角色替换可省略）；对口型和动作迁移不接受。长度上限见工作流表。 |
| `seconds` | integer / 数字字符串 | 可选，默认 5（角色替换 10）。范围见工作流表。`duration` 是等价写法，两者同时传必须一致。动作迁移只用于预扣，可为 1–3600 的小数。 |
| `resolution` | string | 可选，档位如 `480p`、`768p`、`1088p`、`736p`、`960p`、`464p`，可用值见工作流表。 |
| `orientation` | string | 可选，`portrait` / `landscape` / `square`，默认竖屏。 |
| `size` | string | 可选，精确像素 `宽x高`，只对下方尺寸表里的工作流有效；与 resolution/orientation 冲突时报错。 |
| `input_reference` | object / object[] | 参考图：`{"image_url":"…"}` 或其数组，也接受 URL 字符串或字符串数组。首尾帧传 2 张，依次为首帧、尾帧。 |
| `images` | string[] | `input_reference` 的旧写法（New API Sora 风格），二者只能选一个。 |
| `audios` | string[] | 参考音频，依次填入 `ref_audio_0…`。 |
| `videos` | string[] | 参考视频，动作迁移和角色替换必填 1 个。 |
| `seed` | integer / 数字字符串 | 可选，仅有 seed 的工作流；范围多为 1–999999999999999（zm_u08/u22/u24/u30 允许 0）。 |
| `mode` | string | 801/802/803：`高速模式` / `高质模式`（默认）。 |
| `style_preset` | string | 804/805：`文戏模式-真人-文戏`、`文戏模式-真人-文戏+真实质感`、`武打模式-真人-武戏`、`武打模式-真人-武戏+真实质感`（默认）、`漫剧模式-漫剧-文戏`、`漫剧模式-漫剧-武戏`。 |
| `video_subject_to_replace` | string | titim：视频中要替换的主体，英文，多个用英文逗号分隔，默认 `person`，1–100 字符。 |

兼容字段 `metadata`、`user`、`n`、`response_format`、`fps`、`width`、`height`、`callback_url`、`extra`，以及工作流未声明时的 `mode`，会被接受并忽略（OpenAI/Sora 客户端常带这些字段）。`minimax_h3_lightx2v_no_pic` 额外兼容完整官网标签（如 `"resolution":"480p横"`）。表单（multipart/form）提交时，`input_reference` 可以是 JSON、裸 URL 或重复字段，`audios` / `videos` 需 JSON 编码。

### 示例

```bash
curl -sS -X POST "$NEW_API_BASE_URL/v1/videos" \
  -H "Authorization: Bearer $NEW_API_KEY" -H 'Content-Type: application/json' \
  -d '{"model":"minimax_h3_lightx2v_no_pic","prompt":"一只猫在雪地中奔跑","seconds":1,"size":"864x480"}'
```

```json
{"model":"minimax_h3_801","prompt":"人物向镜头微笑","seconds":5,"resolution":"768p","orientation":"portrait","mode":"高速模式","input_reference":[{"image_url":"https://media.example.com/a.png"},{"image_url":"https://media.example.com/b.png"}]}
```

```json
{"model":"minimax_h3_lightx2v","prompt":"镜头平稳推进","seconds":5,"size":"864x480","input_reference":[{"image_url":"https://media.example.com/first.png"},{"image_url":"https://media.example.com/last.png"}]}
```

```json
{"model":"minimax_h3_zm_titi","seconds":5,"resolution":"768p","orientation":"portrait","videos":["https://media.example.com/source.mp4"],"input_reference":{"image_url":"https://media.example.com/role.png"}}
```

用本地图片时先转成 Data URL：

```bash
IMAGE="data:image/png;base64,$(base64 -w0 person.png)"
curl -sS -X POST "$NEW_API_BASE_URL/v1/videos" -H "Authorization: Bearer $NEW_API_KEY" -H 'Content-Type: application/json' \
  -d "{\"model\":\"minimax_h3_lightx2v_v5\",\"prompt\":\"人物向镜头微笑\",\"seconds\":1,\"size\":\"864x480\",\"input_reference\":{\"image_url\":\"$IMAGE\"}}"
```

### 响应

```json
{"id":"task_xxx","object":"video","status":"queued","created_at":1785125529}
```

```json
{"id":"task_xxx","object":"video","status":"completed","url":"https://…/result.mp4","results":[{"url":"https://…/result.mp4","type":"video"}]}
```

状态依次为 `queued` → `in_progress` → `completed` / `failed`，失败时 `error.message` 是脱敏后的上游原因。`/content` 支持 GET、HEAD 和 Range。

## MiniMax V2

### 请求字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `model` | string | 必填。workflow ID 或别名。 |
| `content` | object[] | 必填。文本和媒体，见下表。 |
| `resolution` | string | 有分辨率的工作流必填。`480P`、`768P`、`2K`（=1440p）；其他档位写小写，如 `736p`、`960p`、`1080p`、`1088p`、`464p`；也接受完整官网标签。不接受小写的 `480p` / `768p` / `1440p`。 |
| `ratio` | string | `adaptive`、`21:9`、`16:9`、`4:3`、`1:1`、`3:4`、`9:16`，决定方向。纯文生视频必填且不能是 `adaptive`；有参考媒体时可省略（按 `adaptive`）。 |
| `duration` | integer / 数字字符串 | 可选，默认 5（角色替换 10）。对口型工作流改用 `audio_duration`。动作迁移只用于预扣，可为 1–3600 的小数。 |
| `audio_duration` | integer / 数字字符串 | 仅 `minimax_h3_image_audio_to_video`，1–15，默认 5。 |
| `seed` | integer / 数字字符串 | 可选，仅有 seed 的工作流。 |
| 工作流参数 | 按官网类型 | `mode`、`style_preset`、`video_subject_to_replace`、TTS 的 `emo_*` 写在顶层，取值同 OpenAI 表和 TTS 一节。 |
| `callback_url`、`extra` | — | MiniMax 官方字段，接受并忽略（状态由 New API 轮询）。 |

`content` 的每一项：

| `type` | 结构 | `role` | 说明 |
|---|---|---|---|
| `text` | `{"type":"text","text":"…"}` | 不传 | 最多 1 条，对应 prompt。 |
| `image_url` | `{"type":"image_url","image_url":{"url":"…"},"role":"…"}` | `first_frame` / `last_frame` / `reference_image`，省略为 `first_frame` | 首尾帧工作流必须同时给 `first_frame` 和 `last_frame`；其他工作流用 `reference_image`，按出现顺序填入图片槽位。首尾帧和参考媒体不能混用。 |
| `audio_url` | `{"type":"audio_url","audio_url":{"url":"…"},"role":"reference_audio"}` | 必填 `reference_audio` | 按顺序填入音频槽位。 |
| `video_url` | `{"type":"video_url","video_url":{"url":"…"},"role":"reference_video"}` | 必填 `reference_video` | 仅动作迁移、角色替换。 |

方向规则：`16:9`、`21:9`、`4:3` 为横屏，`9:16`、`3:4` 为竖屏，`1:1` 为方形（不支持方形时用默认方向）；`adaptive` 和首尾帧一律用官网默认方向（竖屏），插件不读取媒体尺寸。

### 示例

```json
{"model":"minimax_h3_z0901","content":[{"type":"text","text":"一只猫在雪地中奔跑"}],"resolution":"768P","ratio":"16:9","duration":5}
```

```json
{"model":"minimax_h3_zm_u08","resolution":"768P","ratio":"9:16","duration":5,"seed":123,"content":[
  {"type":"text","text":"人物面向镜头说话"},
  {"type":"image_url","role":"reference_image","image_url":{"url":"https://media.example.com/person.png"}},
  {"type":"audio_url","role":"reference_audio","audio_url":{"url":"https://media.example.com/speech.wav"}}]}
```

```json
{"model":"minimax_h3_lightx2v","resolution":"480P","duration":5,"content":[
  {"type":"text","text":"镜头平稳推进"},
  {"type":"image_url","role":"first_frame","image_url":{"url":"https://media.example.com/first.png"}},
  {"type":"image_url","role":"last_frame","image_url":{"url":"https://media.example.com/last.png"}}]}
```

```json
{"model":"minimax_h3_805","content":[{"type":"text","text":"侠客在竹林中拔剑"}],"resolution":"480P","ratio":"9:16","duration":5,"style_preset":"武打模式-真人-武戏"}
```

### 响应

```json
{"task_id":"task_xxx"}
```

```json
{"task":{"id":"task_xxx","status":"succeeded","task_type":"generation","modality":"video","content":{"url":"https://…/result.mp4"}}}
```

```json
{"task":{"id":"task_xxx","status":"failed","task_type":"generation","modality":"video","error":{"code":"video_generation_failed","message":"上游失败原因"}}}
```

状态为 `queued` / `running` / `succeeded` / `failed` / `cancelled`；TTS 成功时 `modality` 为 `audio`。

### TTS（indextts2-v1 / IndexTTS-2）

走 MiniMax V2（下面的写法）或 [AutoDL 原生](#autodl-原生)（官网字段 `prompt_text`、`prompt_simple`、`emo_ref_audio`、`emo_*`）。不传 `duration` / `resolution` / `ratio`（传了会报错）。`text` 1–2048 字符；`audio_url` 1–2 段：第 1 段是音色参考（必填），第 2 段是情感参考。

| 顶层字段 | 取值 |
|---|---|
| `emo_control_method` | `与音色参考音频相同`（默认，1 段音频）/ `使用情感参考音频`（需第 2 段音频）/ `使用情感向量控制` |
| `emo_happy`、`emo_angry`、`emo_sad`、`emo_afraid`、`emo_disgusted`、`emo_melancholic`、`emo_surprised`、`emo_calm` | 0–1.4，向量控制时生效 |
| `emo_random` | 布尔，随机情感 |

```json
{"model":"IndexTTS-2","content":[{"type":"text","text":"用平静的语气读这句话。"},{"type":"audio_url","role":"reference_audio","audio_url":{"url":"https://media.example.com/voice.wav"}}],"emo_control_method":"使用情感向量控制","emo_calm":0.3}
```

## AutoDL 原生

和 [AutoDL ComfyUI API](https://autodl.art/docs/comfyui_api/) 相同，只是地址换成 `https://你的域名/autodl`、密钥换成 New API Key：

| 官方 | 经 New API |
|---|---|
| `POST https://autodl.art/api/v1/comfyui/comfyui_workflow/{workflow_id}` | `POST https://你的域名/autodl/api/v1/comfyui/comfyui_workflow/{workflow_id}` |
| `GET https://autodl.art/api/v1/comfyui/comfyui_workflow/result/{task_id}` | `GET https://你的域名/autodl/api/v1/comfyui/comfyui_workflow/result/{task_id}` |

- 路径里的 `workflow_id` 就是模型（也可以是别名或渠道映射名），body 不需要 `model`。
- body 用 AutoDL 官网字段：文本 `prompt`（TTS 为 `prompt_text`）、时长 `duration`（对口型为 `audio_duration`）、分辨率是**完整官网标签**（如 `768p竖`、`768p横(1344*768)`、`464*832px(竖版)`，不接受 `768p` 这种档位简写）、图片 `ref_image_0…` / `first_frame` / `last_frame` / `ref_image`、音频 `ref_audio_0…` / `prompt_simple` / `emo_ref_audio`、视频 `ref_video`，以及 `seed`、`mode`、`style_preset`、`video_subject_to_replace`、`emo_*` 等。每个工作流的完整字段见 [examples.json](examples.json) 的 `_formats.autodl` 和 [workflows.json](workflows.json)。
- **原样转发**：body（含未知字段、数字字符串）一字不改地发给 AutoDL，省略的字段也不补默认值。插件只做计费需要的检查：`duration` / `audio_duration` 在范围内（省略按官网默认值计费），`resolution` 是该工作流的标签（省略按默认档位计费），媒体字段是 HTTP(S) URL 或标准 Data URL；工作流没有的 `duration` / `resolution` 会报错。必填项、文本长度等业务规则由 AutoDL 校验，失败的任务不扣费。
- 动作迁移没有时长字段，固定预扣 5 秒，结算按成片实测；TTS 预扣 10 秒，结算按成片实测。

```bash
curl -sS -X POST "$NEW_API_BASE_URL/autodl/api/v1/comfyui/comfyui_workflow/minimax_h3_lightx2v" \
  -H "Authorization: Bearer $NEW_API_KEY" -H 'Content-Type: application/json' \
  -d '{"prompt":"镜头平稳推进","duration":5,"resolution":"480p横","first_frame":"https://media.example.com/first.png","last_frame":"https://media.example.com/last.png"}'
```

```json
{"code":"Success","msg":"","data":{"task_id":"task_xxx","status":"QUEUED"},"request_id":""}
```

```json
{"code":"Success","msg":"","data":{"task_id":"task_xxx","status":"SUCCESS","results":[{"url":"https://…/result.mp4","type":"video","file_type":"mp4","output_type":"output"}]},"request_id":""}
```

`data.status` 为 `QUEUED` / `RUNNING` / `SUCCESS` / `FAILED`，与官网一致；失败时 `data.message` 是脱敏后的原因。`task_id` 是 New API 任务 ID。

## 阿里云百炼 DashScope

和百炼 [wan2.2-animate-move（图生动作）](https://www.alibabacloud.com/help/en/model-studio/wan-animate-move-api) 相同，只是地址换成 `https://你的域名/autodl`、密钥换成 New API Key，背后跑 AutoDL 的动作迁移工作流：

| 官方 | 经 New API |
|---|---|
| `POST https://dashscope.aliyuncs.com/api/v1/services/aigc/image2video/video-synthesis` | `POST https://你的域名/autodl/api/v1/services/aigc/image2video/video-synthesis` |
| `GET https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}` | `GET https://你的域名/autodl/api/v1/tasks/{task_id}` |

| 字段 | 说明 |
|---|---|
| `model` | 必填，只能是 `wan2.2-animate-move`。 |
| `input.image_url` | 必填，人物图片，HTTP(S) URL 或标准 Data URL。 |
| `input.video_url` | 必填，动作参考视频，HTTP(S) URL 或标准 Data URL。 |
| `input.watermark` | 可选，只能省略或 `false`（AutoDL 不加水印）。 |
| `parameters.mode` | 必填，只能是 `wan-std`；`wan-pro` 会报错（AutoDL 没有对应的专业模式）。 |
| `parameters.check_image` | 可选，布尔，接受但不起作用。 |
| `parameters.orientation` | AutoDL 扩展，可选：`portrait`（默认，464×832）/ `landscape`（832×464）。百炼按输入图比例出片，AutoDL 需要显式选方向。 |
| `parameters.resolution` | AutoDL 扩展，可选：`464p`（目前唯一档位）。 |

其他字段一律报错。`X-DashScope-Async: enable` 可带可不带（本接口总是异步）。

```bash
curl -sS -X POST "$NEW_API_BASE_URL/autodl/api/v1/services/aigc/image2video/video-synthesis" \
  -H "Authorization: Bearer $NEW_API_KEY" -H 'Content-Type: application/json' -H 'X-DashScope-Async: enable' \
  -d '{"model":"wan2.2-animate-move","input":{"image_url":"https://media.example.com/person.png","video_url":"https://media.example.com/dance.mp4"},"parameters":{"mode":"wan-std","orientation":"landscape"}}'
```

```json
{"request_id":"","output":{"task_id":"task_xxx","task_status":"PENDING"}}
```

```json
{"request_id":"","output":{"task_id":"task_xxx","task_status":"SUCCEEDED","submit_time":"2026-11-05 10:00:00.000","end_time":"2026-11-05 10:03:00.000","results":{"video_url":"https://…/result.mp4"}}}
```

`task_status` 为 `PENDING` / `RUNNING` / `SUCCEEDED` / `FAILED` / `CANCELED`；失败时带 `output.code`、`output.message`。官方的 `usage` 块不返回（计费以 New API 账单为准），`request_id` 为空。预扣 5 秒，结算按成片实测时长。

## 工作流

价格为 2026-11-05 官网单价（元/成片秒，北京时间 08:00–24:00 高峰，00:00–08:00 低峰）。媒体数量「0–9」表示可以不传。完整规则见 [workflows.json](workflows.json)，四种格式的请求示例见 [examples.json](examples.json)，官网原始定义见 [official-workflows.json](official-workflows.json)。

| 模型（workflow ID） | 输入媒体 | 文本 | 时长（秒） | 分辨率（方向） | 额外参数 | 官方价 元/秒<br>高峰/低峰 |
|---|---|---|---|---|---|---|
| `minimax_h3_b99_001`<br>H3文生视频 | — | ≤20000 | 1–15 | 736p（竖横方） | `seed` | 736p 0.06/0.04 |
| `minimax_h3_lightx2v_no_pic`<br>H3文生视频 | — | ≤20000 | 1–15 | 480p/768p（竖横方） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04 |
| `minimax_h3_z0901`<br>H3文生视频（高质量创意直出） | — | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed` | 480p 0.05/0.04<br>768p 0.08/0.06<br>1088p 0.08/0.06<br>1440p 0.09/0.07 |
| `minimax_h3_801`<br>H3九图15s(无字幕版) | 图 1–9 | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed`、`mode` | 480p 0.05/0.04<br>768p 0.06/0.05<br>1088p 0.07/0.06<br>1440p 0.08/0.07 |
| `minimax_h3_802`<br>H3九图15s(画质增强版) | 图 0–9 | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed`、`mode` | 480p 0.04/0.03<br>768p 0.05/0.04<br>1088p 0.06/0.05<br>1440p 0.07/0.06 |
| `minimax_h3_804`<br>H3九图15s(多模式版) | 图 0–9 | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed`、`style_preset` | 480p 0.04/0.03<br>768p 0.05/0.04<br>1088p 0.06/0.05<br>1440p 0.07/0.06 |
| `minimax_h3_b99_003_12s`<br>H3多图生视频12秒 | 图 1–9 | ≤20000 | 1–15 | 736p（竖横方） | `seed` | 736p 0.06/0.04 |
| `minimax_h3_lightx2v_v5`<br>H3多图参考生视频 | 图 1–9 | ≤20000 | 1–10 | 480p/768p/1080p（竖横方） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04<br>1080p 0.1/0.06 |
| `minimax_h3_lightx2v_v5_15s`<br>H3多图生视频15秒 | 图 1–9 | ≤20000 | 1–15 | 480p/768p（竖横方） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04 |
| `minimax_h3_z0902`<br>H3六图生视频（多图一致性创作） | 图 1–6 | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed` | 480p 0.05/0.04<br>768p 0.08/0.06<br>1088p 0.08/0.06<br>1440p 0.09/0.07 |
| `minimax_h3_803`<br>H3九图三音15s(画质增强版) | 图 0–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed`、`mode` | 480p 0.04/0.03<br>768p 0.05/0.04<br>1088p 0.06/0.05<br>1440p 0.07/0.06 |
| `minimax_h3_805`<br>H3九图三音15s(多模式版) | 图 0–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed`、`style_preset` | 480p 0.04/0.03<br>768p 0.05/0.04<br>1088p 0.06/0.05<br>1440p 0.07/0.06 |
| `minimax_h3_image_audio_to_video`<br>H3图生视频-音频同步(自动对口型) | 图 1，音频 1 | ✗ | 1–15 | 480p/768p/1080p（竖横） | — | 480p 0.04/0.03<br>768p 0.05/0.04<br>1080p 0.1/0.06 |
| `minimax_h3_image_audio_to_video_v2`<br>H3多图多音频生视频 | 图 0–9，音频 0–3 | ≤20000 | 1–10 | 480p/768p/1080p（竖横） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04<br>1080p 0.11/0.07 |
| `minimax_h3_image_audio_to_video_v2_15s`<br>H3多图多音频生视频15秒 | 图 0–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p（竖横） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04 |
| `minimax_h3_z0903`<br>H3六图三音频生视频（高质量音画融合） | 图 1–6，音频 1–3 | ≤20000 | 1–15 | 480p/768p/1088p/1440p（竖横） | `seed` | 480p 0.05/0.04<br>768p 0.08/0.06<br>1088p 0.08/0.06<br>1440p 0.09/0.07 |
| `minimax_h3_zm_nono`<br>H3多图多音频生视频(影视画质) | 图 1–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p/960p（竖横） | — | 480p 0.04/0.03<br>768p 0.05/0.04<br>960p 0.1/0.09 |
| `minimax_h3_zm_u08`<br>H3多图多音频生视频(高速版) | 图 1–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p（竖横方） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04 |
| `minimax_h3_zm_u22`<br>H3多图多音频生视频(短剧带货版) | 图 1–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p（竖横） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04 |
| `minimax_h3_zm_u24`<br>H3多图多音频生视频(升级画质) | 图 1–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p（竖横方） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04 |
| `minimax_h3_zm_u30`<br>H3多图多音频生视频(超清画质) | 图 1–9，音频 0–3 | ≤20000 | 1–15 | 480p/768p/960p（竖横） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04<br>960p 0.09/0.08 |
| `minimax_h3_b99_002`<br>H3首尾帧生成视频 | 图 2 | ≤20000 | 1–15 | 736p（竖横方） | `seed` | 736p 0.06/0.04 |
| `minimax_h3_lightx2v`<br>H3首尾帧生成视频 | 图 2 | ≤20000 | 1–15 | 480p/768p（竖横方） | `seed` | 480p 0.04/0.03<br>768p 0.05/0.04 |
| `minimax_h3_zm_titi`<br>H3全自动角色动迁替换 | 图 1，视频 1 | 可选 ≤2048 | 5–25 | 768p（竖横） | — | 768p 0.1/0.09 |
| `minimax_h3_zm_titim`<br>H3全自动多角色动迁替换 | 图 1–9，视频 1 | 可选 ≤2048 | 5–25 | 768p（竖横） | `video_subject_to_replace` | 768p 0.11/0.1 |
| `wan2.2animate-v4-motion_retargeting`<br>动作迁移<br>别名 `wan2.2-animate-move` | 图 1，视频 1 | ✗ | 按成片实测 | 464p（竖横） | `seed` | 0.04/0.03 |
| `indextts2-v1`<br>indextts2<br>别名 `IndexTTS-2` | 音频 1–2 | ≤2048 | 按成片实测 | — | `emo_*` | 0.001/0.001（最低 0.01 元） |

| 档位 | 方向 | `size` | 支持的工作流数 |
|---|---|---|---|
| 480p | 竖 | `480x864` | 15 |
| 480p | 横 | `864x480` | 15 |
| 480p | 方 | `480x480` | 4 |
| 768p | 竖 | `768x1344` | 8 |
| 768p | 竖 | `768x1376` | 7 |
| 768p | 横 | `1344x768` | 8 |
| 768p | 横 | `1376x768` | 7 |
| 768p | 方 | `768x768` | 4 |
| 1080p | 竖 | `1080x1920` | 3 |
| 1080p | 横 | `1920x1080` | 3 |
| 1080p | 方 | `1080x1080` | 1 |
| 1088p | 竖 | `1088x1920` | 8 |
| 1088p | 横 | `1920x1088` | 8 |
| 1440p | 竖 | `1440x2560` | 8 |
| 1440p | 横 | `2560x1440` | 8 |

同一档位在不同工作流的像素可能不同（768p 竖屏有 768x1344 和 768x1376 两种）。zm_* 系列、b99 系列、角色替换和动作迁移没有可确认的像素，只能用 `resolution` + 方向。

**动作迁移**：1 图 + 1 视频，不接受文本；档位 `464p`，竖屏 464×832、横屏 832×464。旧写法继续兼容：`832p` 等于 464p 竖屏；OpenAI 只写 `464p` 不带 `orientation` 时为横屏。

## 计费与结算

插件向 New API 上报用量，单价由管理员配置（教程见 README，现成表达式见 [prices.json](prices.json)）。

| 工作流 | 计费秒数 `u("seconds")` |
|---|---|
| H3 系列 | 请求里的时长（省略时为默认值） |
| 动作迁移 | 成片实测时长：优先结算时重新探测成片，其次轮询时记录的成片时长，再次上游 usage；都取不到时按预扣（请求声明，默认 5 秒）。参考视频的时长不计费。 |
| TTS | 成片音频实测时长（WAV/MP3），不足 10 秒按 10 秒；测不出时按 10 秒。 |

- 其他用量字段：`u("resolution")`（档位）、`u("orientation")`、`u("requests")`（成功为 1）。
- 失败、取消、超时的任务把 `requests` 和 `seconds` 结算为 0，预扣全额退回。
- 上游返回的 `duration` 是运行耗时，不会被当作视频时长。
- H3 成片通常比请求略长（如请求 1 秒、成片 1.63 秒，上游按帧组取整），按请求秒数计费。

## 渠道模型映射

四种格式的 `model`（AutoDL 原生格式是路径里的 workflow ID）都可以是你在渠道里配置的映射名：

- 映射到声明过的工作流时，按该工作流的规则校验和计费；调用方填的是声明过的工作流、渠道又把它映射到别的上游 ID 时，仍按调用方填的工作流校验和计费，请求发往映射后的 ID。
- MiniMax、AutoDL 原生、DashScope 接口解码时还拿不到映射，插件会在提交时按映射后的工作流重新校验和计费，效果与 OpenAI 格式一致。DashScope 的 `wan2.2-animate-move` 只能映射到动作迁移工作流。
- 映射到插件不认识的工作流时只做结构校验（字段、媒体格式），范围由上游校验。
- 已移除的官方模型名 `MiniMax-H3`、`MiniMax-H3-Max` 不能通过映射恢复。
- 映射名需要单独配置价格。

## 错误速查

| 报错 | 原因 / 处理 |
|---|---|
| `model_price_error` | 请求的 model（包括别名、映射名）没有配置价格。 |
| AutoDL 原生 / DashScope 返回 404 或网页 | 路径前漏了 `/autodl`。 |
| `no_eligible_channel` | 渠道未启用、没有该模型，或 Key 所在分组无权使用。 |
| `invalid media URL` | 不是 HTTP(S) URL 或标准 Data URL，或 MIME 与字段不符。 |
| `unsupported request field …` / `unsupported or mixed MiniMax field …` / `unsupported DashScope … field …` | 未知或拼错的字段，或该工作流不支持此参数。 |
| `this workflow has no duration field` / `unsupported resolution for this workflow` | AutoDL 原生格式里时长字段名或分辨率标签不对，按报错列出的官网标签改。 |
| `wan-pro is not available` / `cannot add a watermark` | DashScope 只支持 `wan-std`、不加水印。 |
| `… must be … between …` | 时长、seed 等超出范围。 |
| `unsupported resolution/orientation combination` / `unsupported MiniMax resolution/ratio combination` | 该工作流没有这个档位或方向。 |
| `this workflow does not accept a text prompt` | 对口型、动作迁移不接受文本。 |
| `MiniMax text-to-video ratio is required` | 纯文生视频必须给具体比例。 |
| `AutoDL: authentication failed` | 渠道密钥要填 ComfyUI 分组 Token 原文，不加 `Bearer`。 |
| `generation exceeded the 30-minute plugin deadline` | 超时按失败结算并退款。 |
| 429 / 5xx | 上游限流或异常；先查询已有任务，再退避重试，避免重复扣费。 |
