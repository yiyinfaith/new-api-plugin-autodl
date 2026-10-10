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


## 1.0.1 官方 rc.43 计费回归（2026-10-10）

使用未修改的官方 New API rc.43 镜像；只更新插件及 Nginx 官方路径转发。2,647 项 JavaScript 检查、2,320 项官方镜像 fixtures、38 项客户端检查通过。27 个隔离 HTTP 任务使用 mock 上游（没有 AutoDL 费用），覆盖四种入口、Data URL、H3 缺省 5 秒/显式 1 秒、Wan 声明 3.25 秒、rewriteModel 和 7 个失败任务退款；用户余额与 token 额度净扣款均等于成功任务总额。

本版本按请求字段/AutoDL 默认时长计费，Wan 无固定默认，要求调用端声明参考视频秒数；不再测量成片，也不依赖自定义宿主能力。失败归零指 New API 账务，不能代表 AutoDL 上游退款。

通过生产域名完成 3 笔真实生成，均用 `minimax_h3_lightx2v_no_pic`、480p、1 秒。New API 实扣合计 **¥0.09**（每笔 ¥0.03）；本轮不重复付费生成 Wan，DashScope 使用上述完整隔离测试及公网鉴权/参数校验。

| 入口 | task_id | 终态 | 秒数 | New API 实扣 |
|---|---|---|---:|---:|
| native | `task_fqYpBecFeLEeii1zFHU3R8OF9jp6pg1G` | SUCCESS | 1 | ¥0.03 |
| openai | `task_jkBXkSEL4nX2ZajYNQm7XAE0S68bocQH` | completed | 1 | ¥0.03 |
| minimax | `task_mpkPOhFLpY6rcypMPoqDYqchW4vDrIMP` | succeeded | 1 | ¥0.03 |

旧任务 `task_qC9dwZMsJi5elwpSHfAKvOy4LzUGhWPz` 在插件恢复注册后自动完成：15 秒、¥0.60。生产 13 个既有模型的按秒 usage schema 恢复，价格表达式及渠道配置保持不变。
