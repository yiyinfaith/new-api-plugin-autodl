# AutoDL — New API Task Plugin

插件 key：`autodl`；显示名：**AutoDL**；版本：**1.1.1**。

通过官方 Task Plugin API v1 将 AutoDL.Art ComfyUI 工作流接入 New API。当前覆盖官网全部 **17 个工作流（16 个视频、1 个音频）**，模型名与官网工作流 ID 完全一致，对外使用统一参数。插件是单个自包含同步 JavaScript 模块，不修改 New API 核心源码，不使用 Node、网络 SDK、文件系统或虚构的 SDK 方法。

## 支持模型

下面的图片、音频、视频范围表示必需的最少数量和允许的最多数量；媒体按数组顺序对应官网字段。完整默认值、枚举、参数上下限和精确尺寸映射见 [workflows.json](workflows.json)，每个模型的统一请求示例见 [examples.json](examples.json)。

| 模型名 / 官网工作流 ID | 官网名称 | seconds 范围 | 输入媒体数量 | resolution |
|---|---|---|---|---|
| `minimax_h3_z0903` | H3六图三音频生视频（高质量音画融合） | 1–15 秒 | 图 1–6, 音频 1–3 | 480p/768p/1088p/1440p |
| `minimax_h3_z0902` | H3六图生视频（多图一致性创作） | 1–15 秒 | 图 1–6 | 480p/768p/1088p/1440p |
| `minimax_h3_z0901` | H3文生视频（高质量创意直出） | 1–15 秒 | 无需媒体 | 480p/768p/1088p/1440p |
| `minimax_h3_zm_u24` | H3多图多音频生视频(升级画质) | 1–15 秒 | 图 1–9, 音频 0–3 | 480p/768p |
| `minimax_h3_zm_u08` | H3多图多音频生视频(高速版) | 1–15 秒 | 图 1–9, 音频 0–3 | 480p/768p |
| `minimax_h3_b99_002` | H3首尾帧生成视频 | 1–15 秒 | 图 2–2 | 736p |
| `minimax_h3_b99_001` | H3文生视频 | 1–15 秒 | 无需媒体 | 736p |
| `minimax_h3_b99_003_12s` | H3多图生视频12秒 | 1–12 秒 | 图 1–9 | 736p |
| `wan2.2animate-v4-motion_retargeting` | 动作迁移 | 无时长控制 | 图 1–1, 视频 1–1 | 832p/464p |
| `minimax_h3_image_audio_to_video_v2_15s` | H3多图多音频生视频15秒 | 1–15 秒 | 图 0–9, 音频 0–3 | 480p/768p |
| `minimax_h3_lightx2v_v5_15s` | H3多图生视频15秒 | 1–15 秒 | 图 1–9 | 480p/768p |
| `minimax_h3_image_audio_to_video_v2` | H3多图多音频生视频 | 1–10 秒 | 图 0–9, 音频 0–3 | 480p/768p/1080p |
| `minimax_h3_image_audio_to_video` | H3图生视频-音频同步(自动对口型) | 1–15 秒 | 图 1–1, 音频 1–1 | 480p/768p/1080p |
| `minimax_h3_lightx2v_v5` | H3多图参考生视频 | 1–10 秒 | 图 1–9 | 480p/768p/1080p |
| `minimax_h3_lightx2v_no_pic` | H3文生视频 | 1–15 秒 | 无需媒体 | 480p/768p |
| `minimax_h3_lightx2v` | H3首尾帧生成视频 | 1–15 秒 | 图 2–2 | 480p/768p |
| `indextts2-v1` | indextts2 | 无时长控制 | 音频 1–2 | 无 |

官网 API 定义快照保存在 [official-workflows.json](official-workflows.json)，获取日期为 2026-10-07。指定 7 个模型的价格在 2026-10-08 再次从官网读取核实。未来新增工作流时，添加 `WORKFLOWS` 条目、统一字段映射及测试，不需要修改 New API。

## 安装与渠道配置

已使用 New API **v1.0.0-rc.41** 的实际运行二进制验证。安装到其他版本前，需确认支持 API v1、`usageProfiles`、`openai_video` 和 `credentialless` 产物下载。

1. Root 账户进入「任务插件」，启用任务插件功能，上传 [plugin.js](plugin.js)，启用 **AutoDL**。`export const meta` 就是官方 Manifest，无需额外 manifest 文件。
2. 新建渠道，类型选 **Task Plugin（61）**，插件选 **AutoDL / autodl**。
3. Base URL 填 `https://autodl.art`，不追加 `/api/v1`。
4. 密钥填写 AutoDL **ComfyUI 分组**的原始 Token，不加 `Bearer `。不要将 Token 写入插件、仓库或示例文件。
5. 模型选择需要开放的官网工作流 ID；可选全部 17 个。分组与调用端 New API 密钥的分组保持一致。
6. 为需要使用的模型设置价格，再启用渠道。未配置价格的模型可能返回 `model_price_error`。

官方绑定字段是 `setting.task_plugin_key: "autodl"`。插件不声明 `meta.channelTypes: [61]`，该字段用于旧渠道类型，官方禁止用它声明 Task Plugin 类型。

调用端的 `Authorization: Bearer <NEW_API_KEY>` 是 New API 密钥；插件访问 AutoDL 使用 `Authorization: <AUTODL_TOKEN>`，直接读取渠道 `ctx.apiKey`。访问媒体 CDN 时不发送 AutoDL 或 New API 密钥。

模型名现在使用官网完整 ID，旧版 `autodl-minimax-h3` 已改为 `minimax_h3_lightx2v_no_pic`。与内置 Hailuo 的 `MiniMax-H3` 无同名冲突，可保留内置插件。

## 统一参数

| 参数 | 类型 | 说明 |
|---|---|---|
| `model` | string | 官网工作流 ID，必填 |
| `prompt` | string | 文本；自动映射 `prompt` 或 TTS 的 `prompt_text`；不接受文本的工作流不应传 |
| `seconds` | integer | 秒数；自动映射 `duration` 或 `audio_duration`；按模型校验范围 |
| `resolution` | string | `480p`、`768p` 等统一档位；支持值以模型表为准 |
| `orientation` | string | `portrait` 竖屏、`landscape` 横屏、`square` 方形；按工作流枚举校验 |
| `size` | string | 可选精确尺寸，如 `864x480`；只对已确认尺寸的工作流支持；与上述参数冲突时报错 |
| `images` | string[] | 公开 HTTP(S) 图片 URL；按顺序映射首尾帧或 `ref_image_0...` |
| `audios` | string[] | 公开 HTTP(S) 音频 URL；按顺序映射参考音频；TTS 第一段是音色，第二段是情感参考 |
| `videos` | string[] | 公开 HTTP(S) 视频 URL；动作迁移 `videos[0]` 映射 `ref_video` |
| `seed` | integer | 按官网该工作流的种子范围校验；没种子控制的工作流拒绝 |
| `emotion` | object | indexTTS2 情感参数，见下文；其他工作流拒绝 |

省略可选参数时采用该工作流官网默认值。工作流能力不同，统一的是**参数名字**，不代表全部工作流具有相同的分辨率和时长控制。

动作迁移工作流没有 `prompt` 或 `seconds` 控制，时长跟随参考视频；indexTTS2 没有 `seconds`、`resolution` 或 `orientation` 控制，音频时长由文本合成决定。插件会明确拒绝这些不支持的控制。

TTS `emotion.mode` 接受 `voice`（默认，沿用音色参考情感）、`reference`（必须 `audios[1]`）、`vector`（情感向量）。向量参数为 `afraid`、`angry`、`calm`、`disgusted`、`happy`、`melancholic`、`sad`、`surprised`，范围见 catalog；`emotion.random` 是 boolean。官网当前 `surprised` 枚举仅有字符串 `"0"`，本插件接受统一数值 `0` 并转换，拒绝其他值。

JSON 和文本表单均可使用统一参数；表单里的媒体数组和 `emotion` 必须 JSON 编码。二进制 multipart 文件上传不受本适配器支持，使用公开可下载的媒体 URL。URL 的过期时间要覆盖任务排队和处理。

## 调用示例

16 个视频模型支持标准 `POST /v1/videos`。所有 17 个工作流均支持 `POST /v1/tasks/autodl`；TTS 使用通用 Task API。

```bash
export NEW_API_BASE_URL='https://your-new-api.example'
export NEW_API_KEY='填写NewAPI密钥'
curl -sS "$NEW_API_BASE_URL/v1/videos" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"minimax_h3_lightx2v_no_pic","prompt":"一只猫在雪地中奔跑","seconds":5,"resolution":"480p","orientation":"landscape"}'
```

响应 `id` 是 New API 的公开任务 ID，后续不用 AutoDL 私有 ID。每隔 5–10 秒查询一次，到 `completed` / `failed` 停止，最长 30 分钟：

```bash
TASK_ID='提交返回的id'
curl -sS "$NEW_API_BASE_URL/v1/videos/$TASK_ID" -H "Authorization: Bearer $NEW_API_KEY"
curl -f "$NEW_API_BASE_URL/v1/videos/$TASK_ID/content" -H "Authorization: Bearer $NEW_API_KEY" --output result.mp4
```

成功标准视频响应包含 `url` 和 `results`；公共 ID、状态及时间字段由宿主生成。插件不会编造中间进度，只在成功时报告 100%。

首尾帧（两张图片，顺序为首帧和尾帧）：

```json
{"model":"minimax_h3_lightx2v","prompt":"镜头平稳推进","seconds":5,"resolution":"480p","orientation":"landscape","images":["https://your-public-file-host.example/first.png","https://your-public-file-host.example/last.png"]}
```

图生视频、音频同步（没有文本输入，`seconds` 转为 `audio_duration`）：

```json
{"model":"minimax_h3_image_audio_to_video","seconds":5,"resolution":"480p","orientation":"portrait","images":["https://your-public-file-host.example/person.png"],"audios":["https://your-public-file-host.example/voice.wav"]}
```

动作迁移（无秒数、无文本控制）：

```json
{"model":"wan2.2animate-v4-motion_retargeting","resolution":"464p","orientation":"portrait","images":["https://your-public-file-host.example/person.png"],"videos":["https://your-public-file-host.example/motion.mp4"]}
```

TTS 语音合成，通过通用 Task API 提交：

```bash
curl -sS "$NEW_API_BASE_URL/v1/tasks/autodl" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"indextts2-v1","prompt":"你好，这是语音合成测试","audios":["https://your-public-file-host.example/voice.wav"],"emotion":{"mode":"vector","calm":0.3,"random":false}}'
```

通用接口的响应字段是 `task_id`；查询与下载：

```bash
TASK_ID='提交返回的task_id'
curl -sS "$NEW_API_BASE_URL/v1/tasks/$TASK_ID" -H "Authorization: Bearer $NEW_API_KEY"
curl -sS "$NEW_API_BASE_URL/v1/tasks/$TASK_ID/artifacts" -H "Authorization: Bearer $NEW_API_KEY"
curl -f "$NEW_API_BASE_URL/v1/tasks/$TASK_ID/artifacts/audio/content" -H "Authorization: Bearer $NEW_API_KEY" --output result.wav
```

通用任务查询不保证直接返回资源 URL；需要 URL 时查询插件原生接口 `GET /autodl/v1/tasks/{task_id}`，或使用标准视频接口。插件原生提交为 `POST /autodl/v1/tasks`。

## 指定 7 个模型的官方价格

下面每格是 **高峰 / 空闲，人民币元/生成秒**。官网高峰为北京时间 08:00–24:00，空闲为 00:00–08:00。官网内部整数价除以 1000 后得到此金额；[prices.json](prices.json) 包含官方来源与完整 New API 表达式。

| 模型 | 480p | 768p | 1080p |
|---|---|---|---|
| `minimax_h3_lightx2v_no_pic` | 0.03 / 0.02 | 0.04 / 0.03 | — |
| `minimax_h3_lightx2v_v5` | 0.03 / 0.02 | 0.04 / 0.03 | 0.09 / 0.05 |
| `minimax_h3_lightx2v` | 0.03 / 0.02 | 0.04 / 0.03 | — |
| `minimax_h3_image_audio_to_video_v2` | 0.03 / 0.02 | 0.04 / 0.03 | 0.10 / 0.06 |
| `minimax_h3_image_audio_to_video` | 0.03 / 0.02 | 0.04 / 0.03 | 0.09 / 0.05 |
| `minimax_h3_image_audio_to_video_v2_15s` | 0.03 / 0.02 | 0.04 / 0.03 | — |
| `minimax_h3_lightx2v_v5_15s` | 0.03 / 0.02 | 0.04 / 0.03 | — |

这 7 个模型使用 `tiered_expr` 按 `u("seconds")`、`u("resolution")` 和 `hour("Asia/Shanghai")` 计费。例如一个 5 秒 480p 视频，高峰基础价为 ¥0.15，空闲为 ¥0.10。其余 10 个模型未提供本次默认价格，可在 New API 中自行配置。

当前指定实例使用 CNY 展示、`USDExchangeRate=1`，表达式直接填写上述数值，未做外汇换算或加价。其他实例如使用不同展示汇率，应由管理员按站点币种设置换算，不能盲目复制；既有分组倍率仍由 New API 应用。官网价格后续变化不会自动同步，本文件是已核实日期的快照。

每个模型有独立 `usageProfiles`。可控时长视频上报请求次数、请求秒数、分辨率和方向；动作迁移及 TTS 不伪造输出秒数，可先按次配置价格。上游 `data.duration` 是运行耗时，不是视频秒数，绝不用于本插件的按秒结算。完成时沿用保存的请求用量；失败结算次数/秒数归零。宿主时间函数在预扣和结算时计算当前时间，跨 00:00/08:00 的任务可能命中不同时段；AutoDL 公共资料未明确其跨时段判定时点。

## 自动测试客户端

Python 脚本只依赖标准库。真实调用会消耗 AutoDL 余额，先完成渠道和价格配置。

```powershell
$env:NEW_API_BASE_URL = 'https://your-new-api.example'
$env:NEW_API_KEY = '填写NewAPI密钥'
python .\test-video.py --prompt '一个红色小球' --seconds 1 --size 864x480 --out result.mp4
python .\test-task.py --request request.json --out result.wav
```

`test-task.py` 可调用任意工作流：统一请求 JSON → 提交一次 → 有截止时间的轮询 → 认证下载第一个产物，也可用 `--artifact` 选择产物。`--example <工作流ID>` 可选示例，但必需媒体占位 URL 要先换为真实地址。连续查询失败五次停止，不覆盖已有输出文件。两个脚本默认 Base URL 是本机 `http://127.0.0.1:3000`，调用远程实例时设置环境变量。

## 错误、轮询与产物

- `QUEUED` → `QUEUED`，`RUNNING` → `IN_PROGRESS`，`SUCCESS` / `completed` → `SUCCESS`，`FAILED` → `FAILURE`。其他状态为 `UNKNOWN`。
- 401/403 检查 ComfyUI 分组和原始 Token；400/422 是参数错误；404/410 是任务或工作流不存在；429 是限流；5xx 是上游服务异常。
- 无效 JSON、成功响应缺少 `task_id`、空/异常 `results`、非法媒体 URL 都会报错或进入失败终态。错误文本中的渠道 Token 会脱敏。
- 重试/后台轮询由 New API 负责。正常排队、运行和未知状态有 30 分钟插件截止时间；不会取消上游任务，也不保证 AutoDL 退款。宿主默认连续轮询错误上限为 20，最终遵循实例配置。
- 单次 HTTP 超时由宿主 `RELAY_TIMEOUT`、`RELAY_RESPONSE_HEADER_TIMEOUT` 控制；插件 API v1 无请求级 `timeout` 字段。部署未改动生产超时配置或重启生产容器。
- 产物支持 video/audio/image/file，稳定 key 如 `video`、`audio`、`video-2`。音频识别 WAV、MP3、FLAC，视频识别 MP4、WebM。
- `/content` 支持 GET、HEAD 和宿主安全转发的 Range。AutoDL 的 TOS 结果 URL 按 GET 签名，因此插件统一用 GET 请求 CDN；客户端请求 HEAD 时，rc.41 宿主复制响应头后关闭上游正文，只返回响应头。使用 `credentialless: true`，不把渠道密钥发给 CDN；宿主校验目标和重定向。
- AutoDL 结果 URL 有效期较短，代理下载不会延长 URL 有效期。本插件没有自动转存，需要长期保存时及时下载到自己的存储。

## 精确尺寸与需确认项目

`resolution` 档位相同不等于所有工作流的实际宽高相同。例如 z0902/z0903 的 768p 竖屏是 768×1376，z0901 和原文生视频的对应尺寸是 768×1344。尺寸按工作流独立映射，未知尺寸不猜测。

原文生视频支持六个精确 `size`：`480x864`、`864x480`、`480x480`、`768x1344`、`1344x768`、`768x768`。`1280x720` 不在其枚举内，明确拒绝。

**此项需要确认：**动作迁移官网枚举标签为 464×832 / 832×464，内部节点值却为 468/832。插件保留官方选项，通过 `resolution: "464p"` 和方向选择，不承诺精确 `size`。如果必须保证最终像素，需要工作流维护者确认实际输出尺寸或提供真实生成文件信息。

## 验证与官方资料

```bash
node tests.mjs
/new-api plugin lint plugin.js
/new-api plugin test plugin.js --fixture golden.json
```

`node tests.mjs` 执行 **653 项检查**并生成 **583 个官方 host fixture**。1.1.1 已在 rc.41 实际二进制通过 lint 和 583/583 fixture，新增 GET 签名 URL 和 HEAD 的回归覆盖。

1.1.0 的隔离 HTTP 测试使用生产同镜像、独立 SQLite、模拟 AutoDL，上游参数与原始 Authorization 按全部 17 个工作流逐一断言，24 项检查覆盖视频/通用任务/原生路由、音频视频产物、HEAD/Range 下载及错误处理。1.1.1 的内容修复另在真实生产任务上验证。这些模拟测试不产生 AutoDL 费用，不能代替每个工作流真实付费生成的验证。

2026-10-08 生产验证仅提交了一次真实任务：`minimax_h3_lightx2v_no_pic`，1 秒、480p、横屏，成功生成 MP4，New API 记账 ¥0.03。升级至 1.1.1 后复用同一个任务，源站及公网域名均通过认证 HEAD（200）和 Range GET（206），完整 MP4 下载也通过。未重复付费生成，也未对其余 16 个工作流进行付费生成测试。¥0.03 为 New API 的记录，AutoDL 账户余额未另外核对。

- [New API Task Plugin API v1](https://docs.newapi.pro/zh/docs/plugins/api-reference)
- [New API 插件开发指南](https://docs.newapi.pro/zh/docs/plugins/development)
- [New API 官方插件示例](https://github.com/QuantumNous/new-api-plugins)
- [AutoDL ComfyUI API 文档](https://autodl.art/docs/comfyui_api/)
- [AutoDL 官网工作流列表](https://www.autodl.art/large-model/comfyui)

许可证沿用此仓库的 [AGPL-3.0 LICENSE](LICENSE)。
