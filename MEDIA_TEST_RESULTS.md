# 输入媒体真实测试记录

> **1.0.12 计费语义变更：**动作迁移的 `seconds` / `duration` 改为**可选**（省略时按默认 5 秒预扣），且**不再作为结算上限**——结算完全以实测成片时长为准。动作迁移上游没有时长参数，声明永远不发给供应商，而把它当作上限会让调用方声明 1 秒、上传 10 秒参考视频、只付十分之一的价钱；实测值来自实际交付的文件，才是应得计费。同时收紧 `upstreamDeclaredSeconds`：只采信上游 `usage` 块自身的 `total_seconds` / `output_seconds`，裸 `duration`（渲染耗时）不再被信任——它此前正是被声明上限掩盖的。为保证不产生 0 秒账单，四项候选都取不到时保留预扣值。
> **版本说明：**1.0.5 起插件只保留 **OpenAI Videos**（`POST /v1/videos`）与 **MiniMax 官方 V2**（`POST /v2/video_generation`）两种请求格式，并移除了官方模型名（`MiniMax-H3` / `MiniMax-H3-Max`）自动路由，调用时请直接使用 AutoDL 工作流 ID。1.0.12 修复了 MiniMax 入口把带参考媒体的请求误标为 `text_to_video` 的动作分类缺陷（OpenAI 入口一直正确），并让结算优先读取上游官方 `usage.total_seconds`（仅在本地无法测量时作为兜底，绝不覆盖真实测量值）。1.0.12 还修复了动作迁移结算的成片探测：结算钩子此前直接调用 `mediaRange` 只读首个 1 MiB，当 MP4 的 `moov` 位于 1 MiB 之后（稍长的成片普遍如此）时读不到时长，会静默沿用声明值而非实测值；现已复用完整的 `measuredOutputDuration`（头部探测 → HEAD 取总长 → 尾部重读）。同时收紧计费边界：声明秒数下限从 `>0` 提高到 `>=1`（原先可声明 0.0001 秒近乎免费），结算结果以声明秒数为上限（可向下退还、不会超收），`CANCELLED`/`CANCELED` 上游状态映射为终态（此前会轮询到 30 分钟超时才结束），`Content-Length` 只在 200 响应时才当作总长度，MP4 多视频轨取最长轨，内联 Base64 解码限制在探测窗口内，`safeReason` 对拆分的凭据片段分别脱敏。第二轮审计又发现并修复了上述修复自身引入的回归：（1）结算的退款分支只匹配 `FAILURE`/`CANCELLED` 内部枚举，而 `miniTask` 会把自己的枚举渲染成小写 `failed`/`cancelled` 交给宿主，导致 **MiniMax 入口的失败任务按全额计费**；现按语义比较状态，`failed`/`cancelled`/`canceled`/`error`/`timeout` 一律退款。（2）状态查表区分大小写，`Canceled`/`cancelled` 会落到 UNKNOWN 并轮询到 30 分钟超时；现改为大小写不敏感。（3）MP4 取最长视频轨的启发式会使辅助轨（雪碧图/封面）抬高计费；改为优先选择带样本表（`minf`）的真正画面轨。（4）内联 Base64 曾按 1 MiB 截断，导致大于该值的本地参考视频完全测不出时长；现与网络路径一致，先读头部窗口、再读尾部窗口，实测 2 MiB 且 `moov` 位于末尾的文件可正确读出时长。（5）`safeReason` 对短渠道密钥会误伤正常诊断文本（如 `error` 命中英文单词）；现低于 8 字符不替换，并对长密钥按滑动窗口脱敏任意切分位置。（6）结算上限改为无条件生效，声明秒数即为最终计费上限。第三轮审计修复了渲染钩子的崩溃：`protocols.openai_video.render` 在宿主提供的 TaskView （不含 `action` 字段）下硬编码按 `video` 过滤产物，纯音频任务（TTS）取到空数组后仍解引用 `outputs[0].url` 而抛错，并把 `results` 一并清空；现改为优先取视频产物、回退到任务实际产出的媒体，无产物时返回明确错误而非崩溃。同时 `miniTask` 的状态映射补全 `CANCELED`/`FAILED`/`ERROR`/`TIMEOUT` 并改为大小写不敏感，避免终态被渲染成 `running` 让宿主继续轮询。1.0.7 起动作迁移的渠道别名 `wan2.2-animate-move` 恢复按秒计费（此前该别名缺少 seconds usage profile，按秒表达式取不到秒数，静默退化为按次）；1.0.6 在不放松真实校验的前提下提升了官方格式容错（`images` 恢复为等价兼容别名、`duration` 全工作流开放、官方非媒体字段接受并忽略）。本文件 1.0.0–1.0.4 章节中的 AutoDL 原生、DashScope Wan 以及官方别名记录是**当时的历史证据**，对应的能力已按要求删除；保留原文是为了不篡改历史测试结论。

2026-10-09；插件 `1.0.0`。全部创建与查询请求通过 `https://api.example.com`，不是 mock。15 个任务轮询至成功，下载 MP4 并以 ffprobe 确认视频轨道，覆盖 22 个协议/媒体/输入类型组合及纯文本回归。New API 实扣合计 **¥0.541**；9 个失败任务结算额度为 0。该金额是 New API 任务账目，不代表独立核验的 AutoDL 账单。

输入使用 JPEG、WAV、MP4；Data URL 使用匹配的 MIME 与标准 Base64。图片和音频合并在同一 H3 任务中测试以减少费用。输出均为公网 URL，签名有效期为签发后 24 小时。签名查询字符串包含临时访问凭证，GitHub 密钥保护规则拒绝将其写入仓库；完整结果 URL 已随交付报告提供。此表保留公开任务 ID 和视频验证结论。

| 请求方式 | 输入媒体 | 输入形式 | model / workflow | 公开任务 ID | 结果 | 视频验证 | New API 实扣 |
|---|---|---|---|---|---|---|---|
| OpenAI | 图片 + 音频 | Data URL | `minimax_h3_image_audio_to_video_v2` | `task_eVZyCAUirnCGf0iX6biRfMxZ6QHjqMbl` | 成功 | MP4 已下载并验证 | ¥0.020 |
| OpenAI | 图片 + 音频 | URL | `minimax_h3_image_audio_to_video_v2` | `task_4HoxcZAlZ5lDm2NeUrCQKi5hmhxHVVEl` | 成功 | MP4 已下载并验证 | ¥0.020 |
| OpenAI | 图片 + 视频 | Data URL | `wan2.2-animate-move` | `task_ZpetCiA1tXK7qUQLgkE9UHi2Jcu8GvSE` | 成功 | MP4 已下载并验证 | ¥0.029 |
| OpenAI | 图片 + 视频 | URL | `wan2.2-animate-move` | `task_mElbHBzZPpLwnQ34euRq04B3k6rn4tiz` | 成功 | MP4 已下载并验证 | ¥0.029 |
| OpenAI | 纯文本回归 | 无媒体 | `minimax_h3_lightx2v_no_pic` | `task_wDO338zB5XSLrlGNpxNKn05FHSWnb4eN` | 成功 | MP4 已下载并验证 | ¥0.020 |
| MiniMax V2 | 图片 + 音频 | Data URL | `minimax_h3_image_audio_to_video_v2` | `task_hHuXA9gEEfhXiAiBNl0l5zevJZ4AbFBy` | 成功 | MP4 已下载并验证 | ¥0.020 |
| MiniMax V2 | 图片 + 音频 | URL | `minimax_h3_image_audio_to_video_v2` | `task_unXsinejMbOitJ4eMbaLMMBhQKhYKubY` | 成功 | MP4 已下载并验证 | ¥0.020 |
| MiniMax V2 | 图片 + 视频 | Data URL | `wan2.2animate-v4-motion_retargeting` | `task_LcipUeT0RKO8q4YshsR9Siisgt3XJ9IE` | 成功 | MP4 已下载并验证 | ¥0.029 |
| MiniMax V2 | 图片 + 视频 | URL | `wan2.2animate-v4-motion_retargeting` | `task_enWghiwtGa0jknFz2HnRFx8QE1NCUZhr` | 成功 | MP4 已下载并验证 | ¥0.029 |
| AutoDL 原生 | 图片 + 音频 | Data URL | `minimax_h3_image_audio_to_video_v2` | `task_f7qsuDxfkkQhtKMo6oGD9Gu3ZvGzInJU` | 成功 | MP4 已下载并验证 | ¥0.020 |
| AutoDL 原生 | 图片 + 音频 | URL | `minimax_h3_image_audio_to_video_v2` | `task_u6OkNQDdAt8CBAJC9VAQBGONqgIEd8ip` | 成功 | MP4 已下载并验证 | ¥0.020 |
| AutoDL 原生 | 图片 + 视频 | Data URL | `wan2.2animate-v4-motion_retargeting` | `task_bJMRfNI7xGXrR8DsmYu71AYwp28RBi9w` | 成功 | MP4 已下载并验证 | ¥0.029 |
| AutoDL 原生 | 图片 + 视频 | URL | `wan2.2animate-v4-motion_retargeting` | `task_FJ91drNLDeYWWARYadFLagigkJUrVLGK` | 成功 | MP4 已下载并验证 | ¥0.029 |
| DashScope Wan | 图片 + 视频 | Data URL | `wan2.2-animate-move` | `task_kQO0VnHEjs6SfsKAbGAAYvOD0EamgxgM` | 成功 | MP4 已下载并验证 | ¥0.059 |
| DashScope Wan | 图片 + 视频 | URL | `wan2.2-animate-move` | `task_SQTkOQkZmOiRnKZb3LbqNy12BJ7u4W8l` | 成功 | MP4 已下载并验证 | ¥0.168 |

时长：H3 与纯文本均请求 1 秒；OpenAI、MiniMax、原生动作迁移使用约 1 秒参考视频。动作迁移没有 duration 参数，成片按实际视频轨道时长结算。DashScope Data URL 使用官方最短的 2 秒参考视频；URL 对照使用官方公开的 5.616 秒示例，原生工作流无法单独缩短 duration。

中途失败与处理：

- 首轮低分辨率、低帧率且移除音轨的裁剪素材生成失败；保留原视频属性后 1 秒/2 秒 Data URL 成功。未单独确定哪项素材属性触发上游限制。
- 临时托管的视频 URL 生成失败；相同短片 Data URL 可成功，改用已验证可读取的 AutoDL 公网短视频 URL 后成功。没有为此改变 URL 校验或任务状态映射。
- 临时测试渠道出现两次 `no_eligible_channel`，未创建任务；刷新宿主后对应工作流请求成功。测试结束已删除临时渠道、价格配置、密钥和素材服务，保留原生产渠道。

协议边界：DashScope Wan 无音频字段；MiniMax 官方模型别名没有对应 reference_video 工作流。MiniMax V2 直接使用支持视频的 AutoDL workflow ID 可调用 reference_video，已真实通过。没有伪造官方字段或自动路由。

历史 1.0.0 离线验证：2,559 项 JavaScript 检查、2,253 项宿主 fixtures、31 项客户端检查；当时使用的自定义宿主已不再是 1.0.1 的部署前提。


## 1.0.2 官方 rc.43 计费回归（含轮询视频探测）（2026-10-10）

使用未修改的官方 New API rc.43 镜像；只更新插件及 Nginx 官方路径转发。2,647 项 JavaScript 检查、2,320 项官方镜像 fixtures、38 项客户端检查通过。27 个隔离 HTTP 任务使用 mock 上游（没有 AutoDL 费用），覆盖四种入口、Data URL、H3 缺省 5 秒/显式 1 秒、Wan 声明 3.25 秒、rewriteModel 和 7 个失败任务退款；用户余额与 token 额度净扣款均等于成功任务总额。

本版本按请求字段/AutoDL 默认时长预扣，Wan 无固定默认，要求调用端声明参考视频秒数。stock rc.43 的插件轮询 hook 对成功动作迁移成片最多读取首尾各 1 MiB，解析 MP4/WebM 视频轨道时长后结算；Range、主机或格式不满足时回退声明值。整个能力只在插件内实现，不修改 New API 源码。失败归零指 New API 账务，不能代表 AutoDL 上游退款。

通过生产域名完成 3 笔真实生成，均用 `minimax_h3_lightx2v_no_pic`、480p、1 秒。New API 实扣合计 **¥0.09**（每笔 ¥0.03）；本轮不重复付费生成 Wan，DashScope 使用上述完整隔离测试及公网鉴权/参数校验。

| 入口 | task_id | 终态 | 秒数 | New API 实扣 |
|---|---|---|---:|---:|
| native | `task_fqYpBecFeLEeii1zFHU3R8OF9jp6pg1G` | SUCCESS | 1 | ¥0.03 |
| openai | `task_jkBXkSEL4nX2ZajYNQm7XAE0S68bocQH` | completed | 1 | ¥0.03 |
| minimax | `task_mpkPOhFLpY6rcypMPoqDYqchW4vDrIMP` | succeeded | 1 | ¥0.03 |

旧任务 `task_qC9dwZMsJi5elwpSHfAKvOy4LzUGhWPz` 在插件恢复注册后自动完成：15 秒、¥0.60。生产 13 个既有模型的按秒 usage schema 恢复，价格表达式及渠道配置保持不变。

## 1.0.3 按成片时长结算的实测边界（2026-10-11）

动作迁移的目标是按成片实际秒数结算。生产任务 `task_Qojxt0nkDDr1Q7IwGWW4Q0qxybgAr4n9` 证明了探测本身可用，也暴露了当前官方 rc.43 的边界：

| 观测项 | 值 | 来源 |
|---|---|---|
| 探测结果 | `measuredSeconds = 0.9666666666666667` | `tasks.private_data.plugin_state` |
| 结算用量 | `usage_facts.seconds = 1` | `tasks.private_data.billing_context.tiered_snapshot` |
| 结算额度 | `quota = 20000`（¥0.04，等于声明的 1 秒） | `tasks.quota` |
| 结算日志 | `pre-consumed quota matches the actual quota` | 宿主日志 |

为定位差异，在官方镜像 `sha256:da2f0f06…` 的隔离实例上用 mock 上游和真实 MP4 字节复现（不产生 AutoDL 费用）：

- 插件在轮询成功时确实读到成片时长并写入 `plugin_state.measuredSeconds`（声明 5 秒 / 实测 3 秒、声明 8 秒 / 实测 12 秒两种组合都复现）。
- 结算钩子拿到的 `task.state` 是**上一次轮询**持久化的状态，因此不含本次探测结果；`task.data` 同理。
- 该钩子**能**读到 `result.url`，也**能**用 `utils.fetch` 做 Range 读取并解析时长；但无论返回探测值还是声明值，宿主最终采用的 `billing_context.usage_facts.seconds` 始终是提交时声明的秒数。

（**此结论已被 1.0.12 推翻，见文首变更说明；下列文字保留为当时的排查记录**）结论：**在未修改的官方 rc.43 上，动作迁移按秒计费的输入是调用方声明的秒数；成片真实时长可以在插件内测出并记录，但不会改变最终结算额度。** 要让实测值参与结算，需要宿主提供更完整的完成钩子上下文或官方 `measureUsage` 能力，本插件不修改 New API 源码，因此不做该改动。

插件侧据此保留可用的部分并明确回退顺序：结算钩子先用 `result.url`（或持久化状态中的结果 URL）做一次受限探测，失败则用轮询记录的 `measuredSeconds`，再失败则沿用声明值。请求声明只决定预扣、不封顶结算（1.0.12 起），失败任务按 0 秒退款。

离线覆盖：`node tests.mjs` 的 2,654 项检查包含动作迁移结算的三种分支（重新探测成功、回退轮询值、回退声明值），并断言失败任务与 15 个 H3 工作流不会触发媒体探测。


## 1.0.3 生产部署与实时验证（2026-10-11）

1.0.4 只改动 plugin.js 内部：完成钩子先按结果 URL 重新探测成片，再回退到轮询记录，最后回退到声明秒数，并容忍缺少 
esult 参数的宿主。它仍然只注册非保留路径、不声明额外宿主能力，因此安装方式与 1.0.2 完全一致：只导入同一个 Raw URL，不需要修改 New API 源码。

| 项目 | 结果 |
|---|---|
| 生产激活插件 | utodl **1.0.4**，ctive=true，
untime_status=registered，plugin_errors={} |
| 插件源码哈希 | 97be25c3c7b51db73bbb832509d83f08f36efdc349432d38218ca3c7f340766c（与 GitHub main 一致） |
| 13 个模型价格表达式 | 部署前后逐条比对一致，illing_usage_schema.seconds.unit = second |
| 行数核对 | channels 106 / tasks 3371 / abilities 414 / models 181，部署前后一致 |
| 实时测试 | POST /v1/videos 创建 200，查询 completed，任务 SUCCESS，实扣 **¥0.04** |
| 实测时长 | plugin_state.measuredSeconds = 0.9666666666666667 |
| 产物 | GET /v1/videos/{id}/content 返回 200、738,724 字节、文件头含 typ |
| 临时凭据 | 测试用 New API Key 与管理 token 均已删除 |

历史 12 个 MiniMax 任务与动作迁移任务保持原状（重新核对：全部 SUCCESS，实扣合计 ¥0.43），没有重复提交任何付费任务。结算额度仍等于调用方声明的秒数，原因见上一节；插件侧的探测与回退顺序已按设计实现并有离线覆盖。

## 1.0.4 提交阶段测量输入视频（2026-10-11）

动作迁移的计费秒数现在由插件在**提交阶段**测出，而不是等结算。`parseSubmitResponse`
在任务创建成功后立刻对输入的 `ref_video` 做一次受限 Range 读取（公网 URL）或内联解码
（`data:video/...;base64`），把结果写进任务状态的 `inputSeconds`，并缓存该 URL 以免重复读取。
生成任务此时已经在跑，所以这段测量与渲染并行，不占用客户端等待时间。

结算取值顺序为：**成片新探测 → 轮询记录的成片时长 → 提交阶段测得的输入时长 → 声明秒数**。
声明值只决定提交时的预扣、不再封顶结算（1.0.12 起）；失败任务按 0 秒退款。

| 输入形式 | 测量方式 | 网络读取 |
|---|---|---|
| 公网 HTTP(S) MP4/WebM | `bytes=0-1048575` Range 读取 + JS 解析 | 1 次 |
| `data:video/...;base64` | 内联 Base64 解码 + JS 解析 | 0 次 |
| 无法读取或无法解析 | 不测量，继续尝试后续候选值；都失败则保留预扣值 | 0 次 |

离线覆盖：`node tests.mjs` 的 2,659 项检查覆盖公网测量、内联解码、不可读回退、
URL 缓存复用，以及结算时成片不可读而改用输入测量值的分支。

## 1.0.4 生产实时验证与 AutoDL 官方可用性（2026-10-11）

**AutoDL 官方动作迁移可用。** 用项目提供的官方 key 直连 `https://autodl.art`，两次提交都创建成功并产出真实 MP4：

| 输入形式 | 官方任务 | 终态 | 输出视频轨 | 输出文件 |
|---|---|---|---|---|
| Data URL（`data:image/jpeg;base64` + `data:video/mp4;base64`） | `9738c2ae-…c16699` | SUCCESS | 0.9667 秒 | 738,724 字节，含 `ftyp`/`moov`/`vide`+`soun` |
| 公网 URL | `7d120939-…b5a6` | SUCCESS | 5.712 秒 | 4,122,834 字节，含 `ftyp`/`moov`/`vide`+`soun` |

之前的失败是**占位 URL 不可达**导致的 `参数 ref_image URL地址不合法/不存在`，不是工作流或 key 的问题。空 body 会返回 `缺少必填参数：ref_image`，错误 token 返回 401，说明鉴权与参数校验都正常。

**New API 侧真实扣费验证（1.0.4）**，`POST /v1/videos`，`wan2.2-animate-move`，Data URL 输入：

| 项目 | 值 |
|---|---|
| 调用方声明秒数 | 3 |
| 提交阶段实测输入视频 | **1.000 秒**（`plugin_state.inputSeconds`，内联解码，0 次网络读取） |
| 提交预扣 | ¥0.12（3 秒 × ¥0.04） |
| 查询终态 | `completed`，任务 `SUCCESS` |
| 实测成片时长 | **0.9666666666666667 秒**（`plugin_state.measuredSeconds`） |
| 最终实扣 | **¥0.04** |
| 宿主结算日志 | `settles the difference: delta=¥-0.080000 quota (actual ¥0.040000 quota, pre-consumed ¥0.120000 quota)` |
| 产物 | `GET /v1/videos/{id}/content` 返回 200、746,488 字节、文件头含 `ftyp` |
| 临时凭据 | 测试用 New API Key 与管理 token 均已删除 |

这条日志证明结算确实按实测时长走：预扣按声明的 3 秒，最终按实测的 1 秒退回差额。宿主把实测秒数取整到整数秒后再乘单价（0.9667 → 1 秒 → ¥0.04）。

**部署状态：** `autodl` **1.0.4** `active=true`、`runtime_status=registered`、`plugin_errors={}`，源码哈希 `816bff7bbfd04973266e19dc6a7a64430da74c8c94a4cf7cec59e9886ac7f91a`，13 个模型价格表达式与 channels/tasks/abilities/models 行数部署前后一致。

## 1.0.5 请求格式收敛（2026-10-11）

按需求收敛插件表面：**只保留 OpenAI Videos 与 MiniMax 官方 V2 两种请求格式**，并**删除官方模型名自动路由**。

**已删除的能力**

| 已删除 | 说明 |
|---|---|
| AutoDL 原生 / ComfyUI 透传 | `POST /api/v1/comfyui/comfyui_workflow/{workflow_id}`、`GET .../result/{task_id}`；原生 body 透传、旁路计费校验、`?billing_seconds=` 查询参数一并移除 |
| DashScope Wan | `POST /api/v1/services/aigc/image2video/video-synthesis`、`GET /api/v1/tasks/{task_id}`，以及 `input` / `parameters` 风格的请求校验 |
| 官方模型名自动路由 | `MiniMax-H3`、`MiniMax-H3-Max`、`MiniMax-H3-MAX` 不再存在，也不再由模型名路由到不同工作流；`model` 直接填工作流 ID |
| Nginx 路径转发 | 插件只注册 `/v2/...` 路由，不与宿主保留命名空间相交，**不再需要任何 Nginx 配置** |

**保留的能力**

- 17 个 AutoDL 工作流 ID 在两种格式下都可用，`model` 直接填工作流 ID。
- 渠道别名 `wan2.2-animate-move` 仍可作为 **OpenAI 格式**的别名，通过渠道模型映射指向 `wan2.2animate-v4-motion_retargeting`。
- 计费规则：15 个 H3 工作流按请求时长（缺省 5 秒）、`indextts2-v1` 按次、动作迁移按**实测成片秒数**（声明可选，仅作预扣）。
- 动作迁移的结算取值顺序是 **成片新探测 → 轮询记录 → 提交阶段测得的输入时长 → 上游 usage 块**，取到的值即为最终计费秒数（1.0.12 起不再以声明为上限）。

**离线验证：**`node tests.mjs` **1,097 项检查**、872 个宿主 fixture，覆盖 17 个工作流的 OpenAI 与 MiniMax 双格式映射、MiniMax V2 全生命周期（解码 → 提交 → 持久化 → 轮询 → 结算 → 失败退款）、动作迁移的测量与结算分支，以及被删除能力与已移除模型名的拒绝路径；`tests-client.py` 38 项通过。

**生产变更：**插件更新为 1.0.5；同时从 `api.yiyinfaith.com` 的 vhost 中删除了插件专用的 4 条 rewrite 与内部 `/plugin-bridge/` location（改动前已备份，`nginx -t` 通过）。删除后 `/api/status`、`/api/pricing` 等通用接口不受影响，旧的插件路径按预期返回 404。

## 1.0.5 生产部署与双格式实时验证（2026-10-11）

**部署**

| 项目 | 值 |
|---|---|
| 生产激活插件 | `autodl` **1.0.5**，`active=true`，`runtime_status=registered`，`plugin_errors={}` |
| 插件源码哈希 | `ddea9b64083b0a995fe4673915e5e405be78bbfa377abebe68afbc8c27b51ebf`（与 GitHub `main` 一致） |
| 13 个模型价格表达式 | 部署前后逐条比对一致 |
| 行数核对 | channels 106 / tasks 3375 / models 181 不变；abilities 414 → **411** |

`abilities` 少 3 行是**预期结果**：被删除的 `MiniMax-H3` / `MiniMax-H3-Max` 别名不再由插件声明，宿主随之清理了对应行。核对结果：`abilities` 中这两个模型名当前为 **0 行**，没有渠道再声明它们，17 个工作流 + 动作迁移别名的 **26 行**全部保留。没有手工删除任何生产数据。

**Nginx 转发已删除**

从 `api.yiyinfaith.com` 的 vhost 中删除了插件专用的 4 条 `rewrite` 与内部 `location ^~ /plugin-bridge/` 块（改动前已备份到 `/root/yiyin/new-api/backups/autodl-v102-deploy/nginx-origin-before-105-*.conf`，`nginx -t` 通过后热重载）。删除后：

| 请求 | 结果 |
|---|---|
| `POST /api/v1/comfyui/comfyui_workflow/{id}` | 404 |
| `POST /api/v1/comfyui/comfyui_workflow/result/{id}` | 404 |
| `POST /api/v1/services/aigc/image2video/video-synthesis` | 404 |
| `POST /api/v1/tasks/{id}` | 404 |
| `POST /v1/videos`（宿主提供） | 401（鉴权正常） |
| `POST /v2/video_generation`（插件注册） | 401（鉴权正常） |
| `GET /api/status` | 200 |

**实时付费验证：两种格式各一笔**

| 项目 | OpenAI 格式 | MiniMax V2 格式 |
|---|---|---|
| model | `wan2.2-animate-move`（渠道映射到动作迁移） | `minimax_h3_lightx2v_no_pic`（直接填工作流 ID） |
| 入口 | `POST /v1/videos` → 200 | `POST /v2/video_generation` → 200 |
| 任务 | `task_MP9quPfGm6DMI9wL7OaSKnU5uj86tMR0` | `task_5wEKPAZyTWXhws0D7RUbk7AcHzukL13H` |
| 声明 / 预扣 | 3 秒 / ¥0.12 | 1 秒 / ¥0.03 |
| 终态 | `completed`，`SUCCESS` | `succeeded`，`SUCCESS` |
| plugin state | `measuredSeconds = 0.9667`，`inputSeconds = 1` | `facts.seconds = 1`，`resolution = 480p` |
| **实扣** | **¥0.04** | **¥0.03** |
| 产物 | `/content` 200、738,724 字节、含 `ftyp` | 查询响应含公开 `content.url` |
| 结果主机 | `cg-comfyui-prod.tos-cn-beijing.volces.com` | 同 |

OpenAI 那笔再次证明按实测结算：声明 3 秒预扣 ¥0.12，实测成片 0.9667 秒，最终实扣 ¥0.04。两笔测试用的临时 New API Key 与管理 token 均已删除（数据库核对 0 行）。

## 1.0.6 官方格式容错提升（2026-10-11）

在不放弃真实校验的前提下，让官方 OpenAI / MiniMax 客户端不再因为一个无害字段被整体拒绝。核对基准：**OpenAI 官方 OpenAPI 规范**（`openai/openai-openapi`，`CreateVideoJsonBody`）与 **MiniMax V2 Create 的 OpenAPI 3.1 schema**。

**先修正一个此前的误判：**`images` **不是** OpenAI 官方字段。OpenAI `/videos` 的 JSON body 只有 `model`、`prompt`、`input_reference`、`seconds`、`size` 五个字段，`input_reference` 是唯一的参考图字段且只支持单张（`ImageRefParam-2`：`image_url` 或 `file_id` 二选一）。`images` 是 **New API 自有的 Sora 兼容扩展**（`relay_info.go` 的 `TaskSubmitReq.Images []string`）。

**1.0.6 变更**

| 变更 | 行为 |
|---|---|
| `input_reference` 仍是推荐字段 | 官方形态 `{"image_url":"…"}`；对象数组是 AutoDL 多图/首尾帧所需的扩展 |
| `images` 恢复为等价兼容别名 | 与 `input_reference` 映射到**同一批** `ref_image_*` 槽位，**绝不静默丢弃**；两者同时出现报错 |
| 裸 URL 字符串 / 字符串数组 | `input_reference` 与 `images` 都接受，兼容 New API 客户端的写法 |
| `duration` 全工作流开放 | 成为 `seconds` 的等价别名（此前仅 `minimax_h3_lightx2v_no_pic`），保留冲突检测 |
| 官方非媒体字段容忍 | OpenAI `metadata`、`mode`、`user`、`n`、`response_format` 接受并忽略 |
| MiniMax `callback_url` / `extra` | 接受并忽略（上游无对应能力，宿主自己轮询） |
| 未知字段策略 | 媒体型字段名（`ref_image_0`、`file`…）或任何未知**对象**字段仍明确报错 |

**为什么不能对未知字段一律"接受即丢弃"：**未知对象字段可能藏着图片。若静默丢弃，用户以为传了图，插件却发出**纯文生视频**请求——上游会正常出片、正常扣费，产出的视频却不是用户要的，要等成片才发现，钱已经花了。因此媒体型/对象型未知字段一律报错。

**修复的两个真实缺陷（由新增测试发现）**

1. `taskAction` 只读 `input.input_reference`，导致仅传 `images` 的请求被误判为 `text_to_video` 而非 `image_to_video`；现改为经过同一别名解析。
2. 表单/multipart 路径未对 `images` 做 JSON 解码，会把 `["https://…"]` 整串当作 URL 交给校验；现已与 `input_reference` 统一处理。

**顺带堵住一个回归：**放宽未知字段容忍后，`__proto__` 在表单路径会被放进上游 body（测试 `audit OpenAI rejects own prototype field in form/multipart` 捕获）。现已显式拒绝 `__proto__` / `constructor` / `prototype`。

**离线验证：**`node tests.mjs` **1,242 项检查**（较 1.0.5 的 1,097 增加 145 项），952 个宿主 fixture；`tests-client.py` **24 项**；`py_compile` 通过。新增用例覆盖：`images` 字符串/对象两种形态映射到相同槽位、`images` 与 `input_reference` 冲突拒绝、`images` 的多图数量下限与 `input_reference` 一致、`images` 的 action 分类（含参考视频优先于参考图）、表单路径 `images` 解码、官方字段容忍、媒体型/对象型未知字段拒绝、`__proto__` 拒绝。

**文档中记录的可运行示例：**`examples.json` 新增 `_formats.compatibility` 四组示例（`images` 别名、`duration` 别名、OpenAI 可忽略字段、MiniMax 可忽略字段），已逐条对插件实测通过。
