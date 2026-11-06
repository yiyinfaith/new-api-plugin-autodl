# AutoDL — New API 任务插件

把 [AutoDL.Art](https://www.autodl.art/large-model/comfyui) 的 ComfyUI 工作流接入 New API：全部 **27 个**官网工作流（26 个视频 + 1 个 TTS），支持 OpenAI Videos、MiniMax V2、AutoDL 原生、阿里云百炼 DashScope 四种请求格式，按成片秒数计费，失败不收费。

当前版本 **v1.1.5**，插件 key `autodl`，单文件 `plugin.js`，无需改宿主、无需转发配置。已在官方镜像 `calciumion/new-api` **v1.0.0-rc.48** 上验证；AutoDL 原生和 DashScope 两种格式需要 rc.48 及以上。

详细字段、响应示例和报错对照见 [API.md](API.md)。

## 安装

1. 用 **Root 账户**登录 New API 后台 →「任务插件」→「上传插件」→「从 URL 导入」，填入下面的 Raw 地址并读取（不能填仓库首页地址）：

   ```text
   https://raw.githubusercontent.com/yiyinfaith/new-api-plugin-autodl/main/plugin.js
   ```

2. 确认 key 为 `autodl`，安装并启用为当前版本。更新时重复这一步即可，渠道、价格和任务记录都会保留。
3. 新建渠道：类型 **Task Plugin（61）**，插件选 **AutoDL**；Base URL 填 `https://autodl.art`（不加 `/api/v1`）；密钥填 AutoDL **ComfyUI 分组**的原始 Token（不加 `Bearer `）。
4. 在渠道里勾选要用的 workflow ID，并按下文[配置价格](#计费配置)。没配价格的模型会返回 `model_price_error`。

## 调用

四种格式都能调用**全部 27 个工作流和两个别名**（`wan2.2-animate-move`、`IndexTTS-2`）。`model` 填 workflow ID（AutoDL 原生格式写在路径里），提交后用返回的 New API 任务 ID 查询，任务约 30 分钟未完成按失败处理并退款。

| 格式 | 提交 | 查询 |
| --- | --- | --- |
| OpenAI Videos | `POST /v1/videos` | `GET /v1/videos/{id}`，下载 `GET /v1/videos/{id}/content` |
| MiniMax V2 | `POST /v2/video_generation` | `GET /v2/query/video_generation/{task_id}` |
| AutoDL 原生 | `POST /autodl/api/v1/comfyui/comfyui_workflow/{workflow_id}` | `GET /autodl/api/v1/comfyui/comfyui_workflow/result/{task_id}` |
| 阿里云百炼 DashScope | `POST /autodl/api/v1/services/aigc/video-generation/video-synthesis`（`image2video/video-synthesis`、`multimodal-generation/generation` 也行） | `GET /autodl/api/v1/tasks/{task_id}` |

> **AutoDL 原生和 DashScope 必须在官方路径前加 `/autodl`。** 这两种官方路径都以 `/api/` 开头，`/api` 是 New API 自己的路径，宿主（rc.48 起）不会把插件挂在顶层的 `/api/...`，只挂在插件 key 前缀下。所以调用方把官方 Base URL（`https://autodl.art`、`https://dashscope.aliyuncs.com`）换成 `https://你的域名/autodl` 即可，后面的路径不变；不加 `/autodl` 会落到 New API 自己的接口上，返回 404 `Invalid URL`。OpenAI 和 MiniMax 两种格式不用加。

```bash
# OpenAI：单图生视频，1 秒 480p 横屏
curl https://你的域名/v1/videos -H "Authorization: Bearer $NEW_API_KEY" -H "Content-Type: application/json" -d '{
  "model": "minimax_h3_801", "prompt": "一只橘猫在窗台上伸懒腰", "seconds": 1,
  "resolution": "480p", "orientation": "landscape", "mode": "高速模式",
  "input_reference": {"image_url": "https://example.com/cat.png"}
}'

# MiniMax V2：文生视频
curl https://你的域名/v2/video_generation -H "Authorization: Bearer $NEW_API_KEY" -H "Content-Type: application/json" -d '{
  "model": "minimax_h3_z0901", "content": [{"type": "text", "text": "雨中的霓虹街道"}],
  "resolution": "768P", "ratio": "16:9", "duration": 5
}'

# AutoDL 原生：body 与 AutoDL 官网完全相同，原样转发
curl https://你的域名/autodl/api/v1/comfyui/comfyui_workflow/minimax_h3_z0901 -H "Authorization: Bearer $NEW_API_KEY" -H "Content-Type: application/json" -d '{
  "prompt": "雨中的霓虹街道", "duration": 5, "resolution": "768p横(1344*768)"
}'

# 阿里云百炼 DashScope：首尾帧生视频（百炼 Wan 2.7 的 media 写法）
curl https://你的域名/autodl/api/v1/services/aigc/video-generation/video-synthesis -H "Authorization: Bearer $NEW_API_KEY" -H "Content-Type: application/json" -H "X-DashScope-Async: enable" -d '{
  "model": "minimax_h3_lightx2v",
  "input": {"prompt": "镜头平稳推进", "media": [
    {"type": "first_frame", "url": "https://example.com/first.png"},
    {"type": "last_frame", "url": "https://example.com/last.png"}]},
  "parameters": {"resolution": "480P", "duration": 5}
}'
```

四种格式的字段对照：

| 内容 | OpenAI Videos | MiniMax V2 | AutoDL 原生 | DashScope |
| --- | --- | --- | --- | --- |
| 提示词 | `prompt` | `content` 里的 `{"type":"text","text":"…"}` | `prompt`（TTS 为 `prompt_text`） | `input.prompt`（TTS 也可 `input.text`） |
| 时长 | `seconds`（或 `duration`） | `duration`；对口型为 `audio_duration` | `duration` / `audio_duration` | `parameters.duration` |
| 分辨率 | `resolution` + `orientation`，或精确 `size` 如 `864x480` | `resolution` + `ratio` | 完整官网标签，如 `768p竖` | `parameters.resolution` + `ratio`，或 `size` 如 `1280*720` |
| 图片 | `input_reference` / `images` | `image_url` + `reference_image`；首尾帧 `first_frame` / `last_frame` | `ref_image_0…`、`first_frame`、`last_frame`、`ref_image` | `media` 的 `first_frame` / `last_frame` / `reference_image`，或旧写法 `img_url`、`first_frame_url`、`last_frame_url`、`ref_images_url`、`reference_urls`、`image_url` |
| 音频 | `audios`（TTS 也可 `voice`） | `audio_url` + `reference_audio` | `ref_audio_0…`、`prompt_simple`、`emo_ref_audio` | `media` 的 `driving_audio` / `reference_voice`，或 `audio_url`；TTS 音色用 `input.voice` |
| 视频 | `videos` | `video_url` + `reference_video` | `ref_video` | `media` 的 `reference_video`，或 `video_url`、`reference_video_urls` |
| 额外参数 | 同名字段，如 `mode`、`style_preset`、`seed`、`emotion` | 同名顶层字段（含 TTS 的 `emo_*`） | 官网同名字段 | `parameters` 里同名，如 `seed`、`mode`、`style_preset`、`orientation`、`emotion` |

- 媒体支持公网 HTTP(S) URL 和标准 Base64 Data URL（如 `data:image/png;base64,…`），不支持文件上传。
- 媒体数量、时长超出工作流范围会直接报错，**不截断、不补齐**，也不会产生费用。
- **分辨率容错**：大小写都认（`480P` = `480p`，`2K` = `1440p`）；工作流没有的档位就近匹配到它有的、相差不超过 48 的档位（`720P` → `736p`/`768p`，`1080P` ↔ `1088p`），差得更远才报错。省略分辨率或方向时用工作流默认值（多为竖屏）。
- OpenAI、MiniMax、DashScope 都拒绝未知或拼错的字段，避免参数没生效却照常扣费；官方客户端常带、但 AutoDL 没有对应能力的字段会被接受并忽略：OpenAI 的 `metadata`、`user`、`n`、`instructions`、`speed` 等，MiniMax 的 `callback_url`、`extra`，DashScope 的 `negative_prompt`、`prompt_extend`、`watermark`、`shot_type`、`audio`、`check_image`、`language_type`。
- **AutoDL 原生**：路径里的 workflow ID 就是模型，body 用 AutoDL 官网字段，**原样转发**，未知字段也照传；插件只检查计费要用的时长、分辨率标签和媒体链接格式，其余由 AutoDL 校验。响应也是 AutoDL 的 `{"code":"Success","data":{…}}` 结构。鉴权可写 `Authorization: Bearer <NEW_API_KEY>`，也可以像 AutoDL 官方那样不带 `Bearer`。
- **DashScope**：百炼没有 H3 / IndexTTS 这些模型名，所以 `model` 直接填 workflow ID 或别名，其余字段沿用百炼写法，新旧两代（`media` 数组和 `img_url` 等）都认，三个创建路径任选。`parameters.mode` 在 801/802/803 上是 AutoDL 的速度/质量模式，在其他工作流上只接受 `wan-std`（AutoDL 没有 wan-pro）。TTS 按 Qwen-TTS 写 `input.text` + `input.voice`，但 `voice` 填音色参考音频链接；百炼的 TTS 是同步接口，这里仍是异步任务，需要用 `/autodl/api/v1/tasks/{task_id}` 查询，结果在 `output.audio.url`。
- **OpenAI 调 TTS**：`model` 填 `IndexTTS-2`，`prompt`（或 `input`）是文本，`audios`（或 `voice`）放参考音频链接，`emotion` 控制情感；成品用 `/v1/videos/{id}/content` 下载。

## 支持的工作流

价格为 2026-11-05 官网单价（元/成片秒，北京时间 08:00–24:00 高峰、00:00–08:00 低峰）。「图 0–9」表示可不传图。

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

额外参数：

| 参数 | 适用 | 取值 |
| --- | --- | --- |
| `mode` | `minimax_h3_801` / `802` / `803` | `高速模式`、`高质模式`（默认） |
| `style_preset` | `minimax_h3_804` / `805` | `文戏模式-真人-文戏`、`文戏模式-真人-文戏+真实质感`、`武打模式-真人-武戏`、`武打模式-真人-武戏+真实质感`（默认）、`漫剧模式-漫剧-文戏`、`漫剧模式-漫剧-武戏` |
| `video_subject_to_replace` | `minimax_h3_zm_titim` | 视频中要替换的主体，英文，多个用英文逗号分隔，默认 `person`，1–100 字符 |
| `seed` | 表中标注的工作流 | 整数，范围见 [workflows.json](workflows.json) |
| 情感控制 | `indextts2-v1` | MiniMax 和原生写 `emo_control_method`（`与音色参考音频相同` 默认 / `使用情感参考音频` 需第 2 段音频 / `使用情感向量控制`）及 `emo_happy` 等 8 种强度 0–1.4、`emo_random` 布尔；OpenAI 和 DashScope 写 `emotion` 对象：`{"mode":"voice\|reference\|vector","happy":0.8,…,"random":false}` |

使用要点：

- **首尾帧**（`minimax_h3_lightx2v`、`minimax_h3_b99_002`）：OpenAI 传 2 张图，依次为首帧、尾帧；MiniMax 用 `first_frame` 和 `last_frame` 两个 role。
- **动迁替换**（`minimax_h3_zm_titi` / `titim`）：1 个参考视频 + 角色图，提示词可省略；时长 5–25 秒。
- **动作迁移**：1 图 + 1 视频，不接受提示词；档位 `464p`，用 `orientation`（MiniMax 用 `ratio`）选竖横，旧写法 `832p` 仍表示竖屏；`seconds` 只用于预扣（DashScope 用 `parameters.duration`，AutoDL 原生没有时长字段、固定预扣 5 秒），结算按成片实测时长。四种格式都可直接用别名 `wan2.2-animate-move`；DashScope 还认百炼 animate-move 的 `input.image_url` + `input.video_url` 写法。
- **TTS**（`indextts2-v1`，别名 `IndexTTS-2`）：四种格式都能调，写法见上方[字段对照](#调用)，音色参考音频必填、情感参考音频可选；按成片实测秒数计费，不足 10 秒按 10 秒（官方最低 0.01 元）。
- **渠道模型映射**：可以在渠道里把自定义名字映射到上面的 workflow ID，四种格式都可用；校验和计费规则跟随映射到的工作流，别名需要单独配价格。

## 计费配置

插件把用量上报给 New API，单价由你在 New API 里配置：后台「模型价格」→ 找到模型名 → 计费方式选**表达式**，填入表达式。每个模型名（包括别名）都要单独配置。

可用的用量字段：

| 字段 | 含义 |
| --- | --- |
| `u("seconds")` | 计费秒数：H3 为请求时长，动作迁移和 TTS 为成片实测时长（TTS 最少 10） |
| `u("resolution")` | 档位，如 `480p`、`768p`、`1088p` |
| `u("orientation")` | `portrait` / `landscape` / `square` |
| `u("requests")` | 成功为 1 |

失败、取消、超时的任务会把 `requests` 和 `seconds` 都结算为 0，所以按秒计费天然不扣失败的钱。

**推荐做法：**直接复制 [prices.json](prices.json) 里对应模型的 `expression`，那是按官网价格生成的完整表达式，包含高峰/低峰和全部档位。

自己写时的三种模板（数字换成你的单价）：

```text
u("seconds") * 0.04
```

```text
hour("Asia/Shanghai") < 8 ? tier("off_peak", u("seconds") * 0.03) : tier("peak", u("seconds") * 0.04)
```

```text
hour("Asia/Shanghai") < 8 ? (u("resolution") == "480p" ? tier("off_peak_480p", u("seconds") * 0.03) : (tier("off_peak_768p", u("seconds") * 0.04))) : (u("resolution") == "480p" ? tier("peak_480p", u("seconds") * 0.04) : (tier("peak_768p", u("seconds") * 0.05)))
```

注意：

- TTS 只写单价（`tier("base", u("seconds") * 0.001)`），**不要**把最低价写成 `max()`：插件已把结算秒数下限抬到 10 秒，而嵌套 `max()` 的表达式在模型广场显示不出来。
- `hour()` 取的是预扣和结算各自的时刻，任务跨 00:00 / 08:00 时两者可能落在不同时段；用户组倍率由 New API 另外叠加。
- 价格页只显示原始表达式、不显示单价表时，先在「任务插件」确认 AutoDL 处于 registered 状态。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| `model_price_error` | 给实际请求的模型名（包括别名）配置价格 |
| AutoDL 原生 / DashScope 返回 404 `Invalid URL` | 路径前漏了 `/autodl`，见[调用](#调用) |
| 401 / 403 | 渠道密钥必须是 ComfyUI 分组 Token 原文，不加 `Bearer` |
| `unsupported …` / `must be …` | 参数超出该工作流范围，按报错和上表调整，不会扣费 |
| `this workflow does not accept a text prompt` | 对口型和动作迁移不接受提示词 |
| 成功但链接打不开 | 产物是短期签名链接，请及时下载保存 |

## 维护：同步官网工作流

AutoDL 会不定期新增工作流、修改已有工作流的参数或调价。仓库里的 `tools/sync_workflows.py` 负责把插件和官网保持一致（只用 Python 标准库）：

```bash
python tools/sync_workflows.py            # 拉取官网，重新生成全部数据和 plugin.js 里的工作流表，并列出官网改了什么
python tools/sync_workflows.py --table    # 输出 README / API.md 用的模型表和尺寸表
python tools/sync_workflows.py --check    # 不联网，检查生成文件是否和快照一致（CI 会跑）
```

拉取后会打印变化，如 `+ 新工作流`、`- 下架工作流`、`~ 某工作流 input_rules: duration, prompt`、`~ 某工作流 billing_config`。接下来：跑 `node tests.mjs`；新工作流如果带了插件没见过的参数类型，脚本会直接报错提示；把 `--table` 的输出贴进文档；最后在 `plugin.js` 里改版本号。官网价格变了时 `prices.json` 会更新，但 New API 里已配置的价格不会自动改，需要手动复制新表达式。

## 本地测试

```bash
node tests.mjs              # 离线回归测试，不访问网络
python tools/sync_workflows.py --check   # 生成文件与官网快照一致
python tests-client.py      # 测试客户端自检
NEW_API_BASE_URL=https://你的域名 NEW_API_KEY=sk-xxx python test-task.py --format minimax --example minimax_h3_z0901 --out out.mp4
```

`--format` 可选 `openai`、`minimax`、`autodl`、`dashscope`（后两种自动加 `/autodl` 前缀；`autodl` 配 `--request` 时用 `--workflow` 指定 workflow ID）。`test-task.py` 会真实提交并消耗 AutoDL 余额；`--example` 读取 [examples.json](examples.json)，需要媒体的示例要先把占位 URL 换成真实地址。

## 交流与反馈

使用问题、Bug 反馈和功能建议欢迎加群交流：

| 吟枢苑✨吟窝（插件反馈群） |
| :---: |
| 群号：1059351824 |
| <img src="https://raw.githubusercontent.com/yiyinfaith/new-api-plugin-autodl/main/assets/qq-group-chat.jpg" alt="插件反馈群二维码" width="240" /> |

## 参考与许可

项目：[yiyinfaith/new-api-plugin-autodl](https://github.com/yiyinfaith/new-api-plugin-autodl)。参考 [New API 任务插件 API](https://github.com/QuantumNous/new-api/blob/main/docs/plugin-api/v1.md)、[官方插件示例](https://github.com/QuantumNous/new-api/tree/main/plugins/tasks)、[AutoDL ComfyUI API 文档](https://autodl.art/docs/comfyui_api/)。工作流定义快照见 [official-workflows.json](official-workflows.json)，历史测试记录在 [archive 分支](https://github.com/yiyinfaith/new-api-plugin-autodl/tree/archive)。遵守本仓库 [AGPL-3.0](LICENSE) 许可证及 AutoDL 的使用条款。
