# 输入媒体真实测试记录

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

结论：**在未修改的官方 rc.43 上，动作迁移按秒计费的输入是调用方声明的秒数；成片真实时长可以在插件内测出并记录，但不会改变最终结算额度。** 要让实测值参与结算，需要宿主提供更完整的完成钩子上下文或官方 `measureUsage` 能力，本插件不修改 New API 源码，因此不做该改动。

插件侧据此保留可用的部分并明确回退顺序：结算钩子先用 `result.url`（或持久化状态中的结果 URL）做一次受限探测，失败则用轮询记录的 `measuredSeconds`，再失败则沿用声明值。请求声明仍是预扣上限，失败任务按 0 秒退款。

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
声明值仍然决定提交时的预扣上限；失败任务按 0 秒退款。

| 输入形式 | 测量方式 | 网络读取 |
|---|---|---|
| 公网 HTTP(S) MP4/WebM | `bytes=0-1048575` Range 读取 + JS 解析 | 1 次 |
| `data:video/...;base64` | 内联 Base64 解码 + JS 解析 | 0 次 |
| 无法读取或无法解析 | 不测量，回退到声明秒数 | 0 次 |

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
