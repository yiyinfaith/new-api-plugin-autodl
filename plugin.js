// New API Task Plugin API v1; synchronous and self-contained.
// WORKFLOWS is generated from all 27 official AutoDL definitions (2026-11-05).
// No channel credentials, imports, network APIs, filesystem or Node dependencies.

const WORKFLOWS = {
  "minimax_h3_zm_titim": {
    "workflowId": "minimax_h3_zm_titim", "name": "H3全自动多角色动迁替换", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": [], "videos": ["ref_video"],
    "resolutions": [
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 5, "max": 25, "default": 10},
      "prompt": {"type": "prompt", "required": false, "min_length": 1, "max_length": 2048},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "ref_video": {"type": "video", "required": true},
      "resolution": {"type": "enum", "required": false, "options": ["768p竖", "768p横"], "default": "768p竖"},
      "video_subject_to_replace": {"type": "string", "required": false, "min_length": 1, "max_length": 100},
    },
  },
  "minimax_h3_zm_titi": {
    "workflowId": "minimax_h3_zm_titi", "name": "H3全自动角色动迁替换", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image"], "audios": [], "videos": ["ref_video"],
    "resolutions": [
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 5, "max": 25, "default": 10},
      "prompt": {"type": "prompt", "required": false, "min_length": 1, "max_length": 2048},
      "ref_image": {"type": "image", "required": true},
      "ref_video": {"type": "video", "required": true},
      "resolution": {"type": "enum", "required": false, "options": ["768p竖", "768p横"], "default": "768p竖"},
    },
  },
  "minimax_h3_zm_u22": {
    "workflowId": "minimax_h3_zm_u22", "name": "H3多图多音频生视频(短剧带货版)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横"},
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p横", "480p竖", "768p横", "768p竖"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 0, "max": 999999999999999},
    },
  },
  "minimax_h3_zm_u24": {
    "workflowId": "minimax_h3_zm_u24", "name": "H3多图多音频生视频(升级画质)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横"},
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖"},
      {"resolution": "480p", "orientation": "square", "upstream": "480p(1:1)"},
      {"resolution": "768p", "orientation": "square", "upstream": "768p(1:1)"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p横", "480p竖", "768p横", "768p竖", "480p(1:1)", "768p(1:1)"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 0, "max": 999999999999999},
    },
  },
  "minimax_h3_lightx2v_v5_15s": {
    "workflowId": "minimax_h3_lightx2v_v5_15s", "name": "H3多图生视频15秒", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖", "size": "768x1344"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横", "size": "1344x768"},
      {"resolution": "480p", "orientation": "square", "upstream": "480p(1:1)", "size": "480x480"},
      {"resolution": "768p", "orientation": "square", "upstream": "768p(1:1)", "size": "768x768"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖", "768p竖", "480p横", "768p横", "480p(1:1)", "768p(1:1)"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_image_audio_to_video_v2_15s": {
    "workflowId": "minimax_h3_image_audio_to_video_v2_15s", "name": "H3多图多音频生视频15秒", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖", "size": "768x1344"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横", "size": "1344x768"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": false},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖", "768p竖", "480p横", "768p横"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "indextts2-v1": {
    "workflowId": "indextts2-v1", "name": "indextts2", "type": "audio", "timeoutSeconds": 1800, "promptField": "prompt_text", "secondsField": null,
    "input_reference": [], "audios": ["prompt_simple", "emo_ref_audio"], "videos": [],
    "resolutions": [],
    "rules": {
      "emo_afraid": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "emo_angry": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "emo_calm": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "emo_control_method": {"type": "enum", "required": true, "options": ["与音色参考音频相同", "使用情感参考音频", "使用情感向量控制"], "default": "与音色参考音频相同"},
      "emo_disgusted": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "emo_happy": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "emo_melancholic": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "emo_random": {"type": "boolean", "required": false},
      "emo_ref_audio": {"type": "audio", "required": false},
      "emo_sad": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "emo_surprised": {"type": "number", "required": false, "min": 0, "max": 1.4},
      "prompt_simple": {"type": "audio", "required": true},
      "prompt_text": {"type": "string", "required": true, "min_length": 1, "max_length": 2048},
    },
  },
  "minimax_h3_zm_nono": {
    "workflowId": "minimax_h3_zm_nono", "name": "H3多图多音频生视频(影视画质)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横"},
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖"},
      {"resolution": "960p", "orientation": "landscape", "upstream": "960p横"},
      {"resolution": "960p", "orientation": "portrait", "upstream": "960p竖"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p横", "480p竖", "768p横", "768p竖", "960p横", "960p竖"], "default": "768p竖"},
    },
  },
  "minimax_h3_lightx2v_v5": {
    "workflowId": "minimax_h3_lightx2v_v5", "name": "H3多图参考生视频", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖", "size": "768x1344"},
      {"resolution": "1080p", "orientation": "portrait", "upstream": "1080p竖", "size": "1080x1920"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横", "size": "1344x768"},
      {"resolution": "1080p", "orientation": "landscape", "upstream": "1080p横", "size": "1920x1080"},
      {"resolution": "480p", "orientation": "square", "upstream": "480p(1:1)", "size": "480x480"},
      {"resolution": "768p", "orientation": "square", "upstream": "768p(1:1)", "size": "768x768"},
      {"resolution": "1080p", "orientation": "square", "upstream": "1080p(1:1)", "size": "1080x1080"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 10, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖", "768p竖", "1080p竖", "480p横", "768p横", "1080p横", "480p(1:1)", "768p(1:1)", "1080p(1:1)"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_lightx2v_no_pic": {
    "workflowId": "minimax_h3_lightx2v_no_pic", "name": "H3文生视频", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": [], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖", "size": "768x1344"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横", "size": "1344x768"},
      {"resolution": "480p", "orientation": "square", "upstream": "480p(1:1)", "size": "480x480"},
      {"resolution": "768p", "orientation": "square", "upstream": "768p(1:1)", "size": "768x768"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖", "768p竖", "480p横", "768p横", "480p(1:1)", "768p(1:1)"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_zm_u30": {
    "workflowId": "minimax_h3_zm_u30", "name": "H3多图多音频生视频(超清画质)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横"},
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖"},
      {"resolution": "960p", "orientation": "landscape", "upstream": "960p横"},
      {"resolution": "960p", "orientation": "portrait", "upstream": "960p竖"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p横", "480p竖", "768p横", "768p竖", "960p横", "960p竖"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 0, "max": 999999999999999},
    },
  },
  "minimax_h3_803": {
    "workflowId": "minimax_h3_803", "name": "H3九图三音15s(画质增强版)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1376)", "size": "768x1376"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1376*768)", "size": "1376x768"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "mode": {"type": "enum", "required": false, "options": ["高速模式", "高质模式"], "default": "高质模式"},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": false},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "768p竖(768*1376)", "1088p竖(1088*1920)", "1440p竖(1440*2560)", "480p横(864*480)", "768p横(1376*768)", "1088p横(1920*1088)", "1440p横(2560*1440)"], "default": "768p竖(768*1376)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_lightx2v": {
    "workflowId": "minimax_h3_lightx2v", "name": "H3首尾帧生成视频", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["first_frame", "last_frame"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖", "size": "768x1344"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横", "size": "1344x768"},
      {"resolution": "480p", "orientation": "square", "upstream": "480p(1:1)", "size": "480x480"},
      {"resolution": "768p", "orientation": "square", "upstream": "768p(1:1)", "size": "768x768"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "first_frame": {"type": "image", "required": true},
      "last_frame": {"type": "image", "required": true},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖", "768p竖", "480p横", "768p横", "480p(1:1)", "768p(1:1)"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_zm_u08": {
    "workflowId": "minimax_h3_zm_u08", "name": "H3多图多音频生视频(高速版)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横"},
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖"},
      {"resolution": "480p", "orientation": "square", "upstream": "480p(1:1)"},
      {"resolution": "768p", "orientation": "square", "upstream": "768p(1:1)"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p横", "480p竖", "768p横", "768p竖", "480p(1:1)", "768p(1:1)"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 0, "max": 999999999999999},
    },
  },
  "minimax_h3_image_audio_to_video_v2": {
    "workflowId": "minimax_h3_image_audio_to_video_v2", "name": "H3多图多音频生视频", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖", "size": "768x1344"},
      {"resolution": "1080p", "orientation": "portrait", "upstream": "1080p竖", "size": "1080x1920"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横", "size": "1344x768"},
      {"resolution": "1080p", "orientation": "landscape", "upstream": "1080p横", "size": "1920x1080"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 10, "default": 5},
      "prompt": {"type": "prompt", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": false},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖", "768p竖", "1080p竖", "480p横", "768p横", "1080p横"], "default": "768p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_z0902": {
    "workflowId": "minimax_h3_z0902", "name": "H3六图生视频（多图一致性创作）", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1376)", "size": "768x1376"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1376*768)", "size": "1376x768"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "480p横(864*480)", "768p竖(768*1376)", "768p横(1376*768)", "1088p竖(1088*1920)", "1088p横(1920*1088)", "1440p竖(1440*2560)", "1440p横(2560*1440)"], "default": "768p竖(768*1376)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_801": {
    "workflowId": "minimax_h3_801", "name": "H3九图15s(无字幕版)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1376)", "size": "768x1376"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1376*768)", "size": "1376x768"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "mode": {"type": "enum", "required": false, "options": ["高速模式", "高质模式"], "default": "高质模式"},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "768p竖(768*1376)", "1088p竖(1088*1920)", "1440p竖(1440*2560)", "480p横(864*480)", "768p横(1376*768)", "1088p横(1920*1088)", "1440p横(2560*1440)"], "default": "768p竖(768*1376)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_802": {
    "workflowId": "minimax_h3_802", "name": "H3九图15s(画质增强版)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1376)", "size": "768x1376"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1376*768)", "size": "1376x768"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "mode": {"type": "enum", "required": false, "options": ["高速模式", "高质模式"], "default": "高质模式"},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_image_0": {"type": "image", "required": false},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "768p竖(768*1376)", "1088p竖(1088*1920)", "1440p竖(1440*2560)", "480p横(864*480)", "768p横(1376*768)", "1088p横(1920*1088)", "1440p横(2560*1440)"], "default": "768p竖(768*1376)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_805": {
    "workflowId": "minimax_h3_805", "name": "H3九图三音15s(多模式版)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1376)", "size": "768x1376"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1376*768)", "size": "1376x768"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": false},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": false},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "480p横(864*480)", "768p竖(768*1376)", "768p横(1376*768)", "1088p竖(1088*1920)", "1088p横(1920*1088)", "1440p竖(1440*2560)", "1440p横(2560*1440)"], "default": "768p竖(768*1376)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
      "style_preset": {"type": "enum", "required": false, "options": ["文戏模式-真人-文戏", "文戏模式-真人-文戏+真实质感", "武打模式-真人-武戏", "武打模式-真人-武戏+真实质感", "漫剧模式-漫剧-文戏", "漫剧模式-漫剧-武戏"], "default": "武打模式-真人-武戏+真实质感"},
    },
  },
  "minimax_h3_804": {
    "workflowId": "minimax_h3_804", "name": "H3九图15s(多模式版)", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1376)", "size": "768x1376"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1376*768)", "size": "1376x768"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_image_0": {"type": "image", "required": false},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "480p横(864*480)", "768p竖(768*1376)", "768p横(1376*768)", "1088p竖(1088*1920)", "1088p横(1920*1088)", "1440p竖(1440*2560)", "1440p横(2560*1440)"], "default": "768p竖(768*1376)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 100000000000000000},
      "style_preset": {"type": "enum", "required": false, "options": ["文戏模式-真人-文戏", "文戏模式-真人-文戏+真实质感", "武打模式-真人-武戏", "武打模式-真人-武戏+真实质感", "漫剧模式-漫剧-文戏", "漫剧模式-漫剧-武戏"], "default": "武打模式-真人-武戏+真实质感"},
    },
  },
  "minimax_h3_image_audio_to_video": {
    "workflowId": "minimax_h3_image_audio_to_video", "name": "H3图生视频-音频同步(自动对口型)", "type": "video", "timeoutSeconds": 1800, "promptField": null, "secondsField": "audio_duration",
    "input_reference": ["ref_image_0"], "audios": ["ref_audio_0"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖", "size": "480x864"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖", "size": "768x1344"},
      {"resolution": "1080p", "orientation": "portrait", "upstream": "1080p竖", "size": "1080x1920"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横", "size": "864x480"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横", "size": "1344x768"},
      {"resolution": "1080p", "orientation": "landscape", "upstream": "1080p横", "size": "1920x1080"},
    ],
    "rules": {
      "audio_duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "ref_audio_0": {"type": "audio", "required": true},
      "ref_image_0": {"type": "image", "required": true},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖", "768p竖", "1080p竖", "480p横", "768p横", "1080p横"], "default": "768p竖"},
    },
  },
  "minimax_h3_b99_002": {
    "workflowId": "minimax_h3_b99_002", "name": "H3首尾帧生成视频", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["first_frame", "last_frame"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "736p", "orientation": "portrait", "upstream": "736p竖"},
      {"resolution": "736p", "orientation": "landscape", "upstream": "736p横"},
      {"resolution": "736p", "orientation": "square", "upstream": "736p(1:1)"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "first_frame": {"type": "image", "required": true},
      "last_frame": {"type": "image", "required": true},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "resolution": {"type": "enum", "required": false, "options": ["736p竖", "736p横", "736p(1:1)"], "default": "736p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "wan2.2animate-v4-motion_retargeting": {
    "workflowId": "wan2.2animate-v4-motion_retargeting", "name": "动作迁移", "type": "video", "timeoutSeconds": 1800, "promptField": null, "secondsField": null,
    "input_reference": ["ref_image"], "audios": [], "videos": ["ref_video"],
    "resolutions": [
      {"resolution": "464p", "orientation": "portrait", "upstream": "464*832px(竖版)"},
      {"resolution": "464p", "orientation": "landscape", "upstream": "832*464px(横版)"},
    ],
    "rules": {
      "ref_image": {"type": "image", "required": true},
      "ref_video": {"type": "video", "required": true},
      "resolution": {"type": "enum", "required": false, "options": ["464*832px(竖版)", "832*464px(横版)"], "default": "464*832px(竖版)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_z0901": {
    "workflowId": "minimax_h3_z0901", "name": "H3文生视频（高质量创意直出）", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": [], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1344)", "size": "768x1344"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1344*768)", "size": "1344x768"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "480p横(864*480)", "768p竖(768*1344)", "768p横(1344*768)", "1088p竖(1088*1920)", "1088p横(1920*1088)", "1440p竖(1440*2560)", "1440p横(2560*1440)"], "default": "768p竖(768*1344)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_z0903": {
    "workflowId": "minimax_h3_z0903", "name": "H3六图三音频生视频（高质量音画融合）", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5"], "audios": ["ref_audio_0", "ref_audio_1", "ref_audio_2"], "videos": [],
    "resolutions": [
      {"resolution": "480p", "orientation": "portrait", "upstream": "480p竖(480*864)", "size": "480x864"},
      {"resolution": "480p", "orientation": "landscape", "upstream": "480p横(864*480)", "size": "864x480"},
      {"resolution": "768p", "orientation": "portrait", "upstream": "768p竖(768*1376)", "size": "768x1376"},
      {"resolution": "768p", "orientation": "landscape", "upstream": "768p横(1376*768)", "size": "1376x768"},
      {"resolution": "1088p", "orientation": "portrait", "upstream": "1088p竖(1088*1920)", "size": "1088x1920"},
      {"resolution": "1088p", "orientation": "landscape", "upstream": "1088p横(1920*1088)", "size": "1920x1088"},
      {"resolution": "1440p", "orientation": "portrait", "upstream": "1440p竖(1440*2560)", "size": "1440x2560"},
      {"resolution": "1440p", "orientation": "landscape", "upstream": "1440p横(2560*1440)", "size": "2560x1440"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_audio_0": {"type": "audio", "required": true},
      "ref_audio_1": {"type": "audio", "required": false},
      "ref_audio_2": {"type": "audio", "required": false},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["480p竖(480*864)", "480p横(864*480)", "768p竖(768*1376)", "768p横(1376*768)", "1088p竖(1088*1920)", "1088p横(1920*1088)", "1440p竖(1440*2560)", "1440p横(2560*1440)"], "default": "768p竖(768*1376)"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_b99_003_12s": {
    "workflowId": "minimax_h3_b99_003_12s", "name": "H3多图生视频12秒", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": ["ref_image_0", "ref_image_1", "ref_image_2", "ref_image_3", "ref_image_4", "ref_image_5", "ref_image_6", "ref_image_7", "ref_image_8"], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "736p", "orientation": "portrait", "upstream": "736p竖"},
      {"resolution": "736p", "orientation": "landscape", "upstream": "736p横"},
      {"resolution": "736p", "orientation": "square", "upstream": "736p(1:1)"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "ref_image_0": {"type": "image", "required": true},
      "ref_image_1": {"type": "image", "required": false},
      "ref_image_2": {"type": "image", "required": false},
      "ref_image_3": {"type": "image", "required": false},
      "ref_image_4": {"type": "image", "required": false},
      "ref_image_5": {"type": "image", "required": false},
      "ref_image_6": {"type": "image", "required": false},
      "ref_image_7": {"type": "image", "required": false},
      "ref_image_8": {"type": "image", "required": false},
      "resolution": {"type": "enum", "required": false, "options": ["736p竖", "736p横", "736p(1:1)"], "default": "736p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  },
  "minimax_h3_b99_001": {
    "workflowId": "minimax_h3_b99_001", "name": "H3文生视频", "type": "video", "timeoutSeconds": 1800, "promptField": "prompt", "secondsField": "duration",
    "input_reference": [], "audios": [], "videos": [],
    "resolutions": [
      {"resolution": "736p", "orientation": "portrait", "upstream": "736p竖"},
      {"resolution": "736p", "orientation": "landscape", "upstream": "736p横"},
      {"resolution": "736p", "orientation": "square", "upstream": "736p(1:1)"},
    ],
    "rules": {
      "duration": {"type": "integer", "required": false, "min": 1, "max": 15, "default": 5},
      "prompt": {"type": "string", "required": true, "min_length": 1, "max_length": 20000},
      "resolution": {"type": "enum", "required": false, "options": ["736p竖", "736p横", "736p(1:1)"], "default": "736p竖"},
      "seed": {"type": "integer", "required": false, "min": 1, "max": 999999999999999},
    },
  }
};


const VIDEO_MODELS = Object.keys(WORKFLOWS).filter(function (model) { return WORKFLOWS[model].type === "video"; });
const REQUEST_SCHEMA = { requests: { type: "number", unit: "count", unitLabel: { en: "request", zh: "次" }, description: { en: "Generation request unit price", zh: "生成请求单价" } } };
const WORKFLOW_COUNT = Object.keys(WORKFLOWS).length;
const UNSUPPORTED_MODEL = "AutoDL: unsupported model; select one of the " + WORKFLOW_COUNT + " declared models";
const MOTION_WORKFLOW = "wan2.2animate-v4-motion_retargeting";
// Channel-mapped external model name for motion transfer over OpenAI /v1/videos.
const MOTION_ALIAS = "wan2.2-animate-move";
const TTS_WORKFLOW = "indextts2-v1";
// The upstream project's own model id for the TTS workflow, added for the same reason as the motion
// alias: callers know the vendor's name, not AutoDL's wrapped workflow id.
const TTS_ALIAS = "IndexTTS-2";
// Public model names that resolve to a declared workflow instead of to themselves. Keeping this a
// table means the two aliases cannot drift apart in how they are advertised, validated, priced or
// resolved.
const PUBLIC_ALIASES = {};
PUBLIC_ALIASES[MOTION_ALIAS] = MOTION_WORKFLOW;
PUBLIC_ALIASES[TTS_ALIAS] = TTS_WORKFLOW;

// Motion transfer has no upstream duration control, so a caller's declaration is only the
// pre-charge reservation and settlement replaces it with the measured length of the delivered clip.
const MOTION_DEFAULT_SECONDS = 5;

// TTS is billed per delivered audio second with a vendor minimum charge equal to ten seconds of
// audio, so the pre-charge holds exactly that floor: a shorter reservation would let a successful
// short clip be charged the difference after the fact, and a longer one would lock up balance for
// no reason.
const TTS_DEFAULT_SECONDS = 10;

// `publicModel` lets the channel-mapped motion alias reuse the motion workflow's capability profile
// while still being advertised and priced under its own name.
function usageProfile(model, publicModel) {
  const config = WORKFLOWS[model];
  const schema = Object.assign({}, REQUEST_SCHEMA);
  const facts = { requests: 1 };
  // TTS is billed per second of delivered audio (AutoDL's own price_type for the workflow is
  // `audio_sec_cost`).
  const measured = config.secondsField || model === MOTION_WORKFLOW || config.type === "audio";
  if (measured) {
    const audio = config.type === "audio";
    const label = audio
      ? { en: "Audio generation unit price", zh: "音频生成单价" }
      : { en: "Video generation unit price", zh: "视频生成单价" };
    schema.seconds = { type: "number", unit: "second", description: label };
    facts.seconds = config.secondsField
      ? config.rules[config.secondsField].default
      : (audio ? TTS_DEFAULT_SECONDS : MOTION_DEFAULT_SECONDS);
  }
  if (config.resolutions.length) {
    schema.resolution = { enum: Array.from(new Set(config.resolutions.map(function (entry) { return entry.resolution; }))), description: { en: "Output resolution", zh: "输出分辨率" } };
    schema.orientation = { enum: Array.from(new Set(config.resolutions.map(function (entry) { return entry.orientation; }))), description: { en: "Output orientation", zh: "输出方向" } };
    const choice = config.resolutions.find(function (entry) { return entry.upstream === config.rules.resolution.default; });
    facts.resolution = choice.resolution;
    facts.orientation = choice.orientation;
  }
  return { models: [typeof publicModel === "string" ? publicModel : model], schema: schema, examples: [{ label: config.name, facts: facts }] };
}

// Map a public alias onto the workflow it runs as, leaving every other name untouched. This is what
// makes an alias inherit the workflow's capability table, media slots and validation rather than
// falling through to the permissive profile used for names we hold no table for.
function workflowForName(model) {
  return typeof model === "string" && has(PUBLIC_ALIASES, model) ? PUBLIC_ALIASES[model] : model;
}

// Removed on purpose and never coming back: the official model names this adapter used to
// auto-route.
const RETIRED_MODELS = ["minimax-h3", "minimax-h3-max"];

export const meta = {
  apiVersion: 1,
  key: "autodl",
  name: "AutoDL",
  version: "1.1.3",
  author: { name: "Yiyin" },
  description: { en: "All " + WORKFLOW_COUNT + " AutoDL.Art ComfyUI video and audio workflows with unified request parameters", zh: "统一参数接入 AutoDL.Art 全部 " + WORKFLOW_COUNT + " 个 ComfyUI 视频与音频工作流" },
  icon: "text:AD",
  website: "https://autodl.art/large-model/comfyui",
  baseUrl: "https://autodl.art",
  auth: "api_key",
  // Result URLs are signed Volcengine objects. Polling uses credentialless
  // byte-range reads against this exact media host for motion duration checks.
  allowedHosts: ["cg-comfyui-prod.tos-cn-beijing.volces.com"],
  models: Object.keys(WORKFLOWS).concat([MOTION_ALIAS, TTS_ALIAS]),
  fetchMode: "per_task",
  // The channel-mapped OpenAI motion alias stays selectable; its OpenAI decoder is unchanged. The
  // TTS alias is deliberately absent: this plugin exposes TTS only through the MiniMax V2 surface,
  // and adding it here would advertise a model on /v1/videos that the audio path cannot serve.
  protocols: [{ name: "openai_video", models: VIDEO_MODELS.concat([MOTION_ALIAS]) }],
  // Only the MiniMax V2 routes are registered. Neither OpenAI (/v1/videos) nor MiniMax (/v2/...)
  // intersects a host-reserved namespace, so this plugin needs no origin-proxy rewrite and runs
  // from a single file install.
  routes: [
    { method: "POST", path: "/v2/video_generation", type: "submit", decode: "miniCreate", render: "miniCreated" },
    { method: "GET", path: "/v2/query/video_generation/:task_id", type: "query", render: "miniTask" },
  ],
  usageSchema: REQUEST_SCHEMA,
  // Both public aliases advertise their own usage profile so each can be priced separately, and
  // each inherits the shape of the workflow it resolves to.
  usageProfiles: Object.keys(WORKFLOWS).map(usageProfile)
    .concat([usageProfile(MOTION_WORKFLOW, MOTION_ALIAS), usageProfile(TTS_WORKFLOW, TTS_ALIAS)]),
};

function has(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }
// Smallest billable declaration. The host rounds measured seconds to whole seconds, but a declared
// value is used verbatim for the pre-charge and, when the output cannot be measured, for the final
// settlement.
const MIN_BILLABLE_SECONDS = 1;
function billedSeconds(value, field) {
  const seconds = typeof value === "number" ? value : (typeof value === "string" && /^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(value) ? Number(value) : NaN);
  if (!Number.isFinite(seconds) || seconds < MIN_BILLABLE_SECONDS || seconds > 3600) throw new Error("AutoDL: " + field + " must be a number between " + MIN_BILLABLE_SECONDS + " and 3600 seconds");
  return seconds;
}
// The reservation for a motion-transfer request. The declaration is optional: upstream has no
// duration parameter, so it never reaches the vendor, and settlement bills the measured clip
// instead.
function motionDeclaredSeconds(input) {
  const declared = input.seconds === undefined ? input.duration : input.seconds;
  if (input.seconds !== undefined && input.duration !== undefined
    && billedSeconds(input.duration, "duration") !== billedSeconds(input.seconds, "seconds")) {
    throw new Error("AutoDL: seconds and duration conflict");
  }
  return declared === undefined ? MOTION_DEFAULT_SECONDS : billedSeconds(declared, "seconds");
}
function object(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function copyRequest(value) {
  const copy = {};
  // Preserve own JSON keys for validation, including __proto__; assignment
  // would invoke its legacy setter and silently discard the caller's field.
  for (const key of Object.keys(value)) Object.defineProperty(copy, key, { value: value[key], enumerable: true, configurable: true, writable: true });
  return copy;
}
function text(value) { return typeof value === "string" ? value.trim() : ""; }
function workflow(model) {
  if (!has(WORKFLOWS, model)) throw new Error(UNSUPPORTED_MODEL);
  return WORKFLOWS[model];
}
// Deployment reality the protocol tables cannot express: an operator may map any self-chosen model
// name onto an AutoDL workflow inside their own channel, so the workflow id can be one we hold no
// capability table for.
function unmappedWorkflow(workflowId) {
  const id = text(workflowId);
  if (!id) throw new Error("AutoDL: model is required");
  if (RETIRED_MODELS.includes(id.toLowerCase())) throw new Error(UNSUPPORTED_MODEL);
  // Generic slots so reference media still reaches upstream; the real workflow
  // binds whatever names it expects, and an unmatched extra slot is ignored there.
  const images = [], audios = [], videos = [];
  for (let index = 0; index < 16; index++) images.push("ref_image" + (index ? "_" + index : ""));
  for (let index = 0; index < 8; index++) audios.push("ref_audio" + (index ? "_" + index : ""));
  for (let index = 0; index < 4; index++) videos.push("ref_video" + (index ? "_" + index : ""));
  const rules = {};
  for (const field of images) rules[field] = { type: "image", required: false };
  for (const field of audios) rules[field] = { type: "audio", required: false };
  for (const field of videos) rules[field] = { type: "video", required: false };
  // MiniMax first/last-frame roles get their own slots so a frame request is not
  // refused before the channel mapping (known only at submission) picks the table.
  rules.first_frame = { type: "image", required: false };
  rules.last_frame = { type: "image", required: false };
  // A generic text slot so a mapped workflow can still receive its prompt. The declared workflows
  // keep their own exact prompt field and character limits; without a capability table the only
  // honest bound is "non-empty string".
  rules.prompt = { type: "string", min_length: 1, max_length: 4096 };
  // Likewise a generic duration slot: a mapped workflow that accepts a length gets it, and the wide
  // 1..3600 bound (the same sanity bound motion settlement uses) stands in for the per-workflow
  // range we cannot know.
  rules.duration = { type: "integer", required: false, default: 5, min: 1, max: 3600 };
  rules.audio_duration = { type: "integer", required: false, default: 5, min: 1, max: 3600 };
  rules.resolution = { type: "string", required: false, default: "adaptive" };
  rules.ratio = { type: "string", required: false };
  rules.seed = { type: "integer", required: false };
  return {
    workflowId: id,
    name: "Mapped AutoDL workflow",
    // Modality is NOT inferred from the name. A private id is just a label the operator chose;
    // matching /tts|indextts/ against it made a video workflow called "tts-enhance-video" classify
    // as audio (tagged text_to_audio and billed as audio), and -- because this fallback never
    // builds the emo_* rules -- it made mapEmotion dereference a rule that does not exist and crash
    // with a raw TypeError at the real upstream call.
    type: "video",
    timeoutSeconds: 1800,
    // No seconds control is declared, so an unmapped workflow never advertises
    // billing seconds; pricing stays the operator's decision.
    promptField: "prompt",
    secondsField: "duration",
    input_reference: images,
    audios: audios,
    videos: videos,
    // A pass-through entry whose `upstream` equals any input label, so a mapped workflow's own
    // resolution spelling reaches it unchanged.
    resolutions: [{ resolution: "adaptive", orientation: "adaptive", upstream: "adaptive", passthrough: true }],
    rules: rules,
    unmapped: true,
  };
}
// Resolve the workflow a request runs as, and the upstream id it is sent to. Validation and the
// upstream id are decided separately, and that separation is the whole point: * If the caller named
// a declared workflow, THAT workflow's capability table validates the request, whatever the channel
// mapped it to.
function resolveWorkflow(mappedModel, requestedModel) {
  // Callers pass the RAW names. Resolving the alias inside (rather than at every call site) is what
  // lets the retirement check below see the caller's actual model: a caller that named a removed
  // official model arrived here as `undefined` once the alias table had been consulted, so the
  // retired name was never examined and a channel mapping could run it.
  const requestedRaw = text(requestedModel);
  const mappedRaw = text(mappedModel);
  // A retired official name is refused whether it arrives as the caller's model or as the
  // operator's mapped id.
  for (const candidate of [requestedRaw, mappedRaw]) {
    if (candidate && RETIRED_MODELS.includes(candidate.toLowerCase())) {
      throw new Error(UNSUPPORTED_MODEL);
    }
  }
  // BOTH names are resolved through the alias table. Applying it only to the caller's name meant an
  // operator who mapped onto a public alias (say `IndexTTS-2`) got the permissive profile with the
  // TTS audio requirement skipped, and the alias itself was sent upstream as the workflow id, which
  // AutoDL does not know.
  const requested = text(workflowForName(requestedRaw) || requestedRaw);
  const mapped = text(workflowForName(mappedRaw) || mappedRaw);
  // Validation follows a declared table whenever one of the two names has one. The caller's own
  // name is preferred because it is what the request was written against; the operator's mapped id
  // is next, since mapping onto a declared workflow means that workflow's rules are the ones the
  // generation must satisfy.
  const declared = [requested, mapped].reduce(function (found, candidate) {
    return found || (candidate && has(WORKFLOWS, candidate) ? WORKFLOWS[candidate] : null);
  }, null);
  const upstream = text(mapped || requested);
  if (declared) {
    // The id actually called is the mapped one when the host resolved a mapping, even onto a
    // workflow we do not declare; otherwise the declared name itself.
    return upstream === declared.workflowId
      ? declared
      : Object.assign({}, declared, { workflowId: upstream, tableId: declared.workflowId });
  }
  return unmappedWorkflow(upstream);
}

// The declared workflow whose capability table and billing rules govern this config. It differs
// from `workflowId` only when a channel mapped a declared model onto another upstream id; behaviour
// (motion measurement, TTS floor, legacy spellings) must follow the table, never the upstream
// label.
function tableId(config) { return config.tableId || config.workflowId; }

function numberValue(value, rule, name) {
  if (typeof value !== "number" && (typeof value !== "string" || !/^-?\d+(?:\.\d+)?$/.test(value))) throw new Error("AutoDL: " + name + " must be numeric");
  const number = Number(value);
  if (!Number.isFinite(number) || (rule.type === "integer" && !Number.isSafeInteger(number)) || (rule.min !== undefined && number < rule.min) || (rule.max !== undefined && number > rule.max)) {
    throw new Error("AutoDL: " + name + " must be " + (rule.type === "integer" ? "an integer" : "a number") + " between " + rule.min + " and " + rule.max);
  }
  return number;
}

function mapResolution(config, input) {
  if (!config.resolutions.length) {
    if (input.resolution !== undefined || input.orientation !== undefined || input.size !== undefined) throw new Error("AutoDL: this workflow has no resolution or orientation control");
    return null;
  }
  const defaults = config.resolutions.find(function (entry) { return entry.upstream === config.rules.resolution.default; });
  let quality = input.resolution;
  let orientation = input.orientation;
  // Retain the first release's H3 resolution spelling only for that original model.
  if (tableId(config) === "minimax_h3_lightx2v_no_pic" && quality !== undefined) {
    const legacy = config.resolutions.find(function (entry) { return entry.upstream === quality; });
    if (legacy) {
      if (orientation !== undefined && orientation !== legacy.orientation) throw new Error("AutoDL: resolution and orientation conflict");
      quality = legacy.resolution;
      orientation = legacy.orientation;
    }
  }
  // Motion transfer used to publish 832p (portrait) / 464p (landscape); both are
  // 464p now. Old spellings keep their old meaning.
  if (tableId(config) === MOTION_WORKFLOW && (quality === "832p" || (quality === "464p" && orientation === undefined))) {
    const legacy = quality === "832p" ? "portrait" : "landscape";
    if (orientation !== undefined && orientation !== legacy) throw new Error("AutoDL: resolution and orientation conflict");
    quality = "464p"; orientation = legacy;
  }
  if (input.size !== undefined) {
    const exact = config.resolutions.find(function (entry) { return entry.size && entry.size === input.size; });
    if (!exact) throw new Error("AutoDL: unsupported size for this workflow; use its declared resolution and orientation");
    if ((quality !== undefined && quality !== exact.resolution) || (orientation !== undefined && orientation !== exact.orientation)) throw new Error("AutoDL: size, resolution and orientation conflict");
    quality = exact.resolution; orientation = exact.orientation;
  }
  quality = quality === undefined ? defaults.resolution : quality;
  orientation = orientation === undefined ? defaults.orientation : orientation;
  // An unmapped workflow has no label table, so the caller's own resolution and orientation
  // spellings pass through verbatim; the workflow upstream validates them.
  if (defaults.passthrough) return { resolution: quality, orientation: orientation, upstream: quality };
  const selected = config.resolutions.find(function (entry) { return entry.resolution === quality && entry.orientation === orientation; });
  if (!selected) throw new Error("AutoDL: unsupported resolution/orientation combination for this workflow; check workflows.json");
  return selected;
}

function referenceURLs(value) {
  if (value === undefined) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map(function (item) {
    // Bare URL strings are the New API Sora spelling of `images`; accept them so a
    // compatibility client cannot lose its picture to a type mismatch.
    if (typeof item === "string") return inputMedia(item, "image");
    if (!object(item)) throw new Error("AutoDL: input_reference must be an image_url object or an array of image_url objects; URL strings are not supported");
    if (has(item, "file_id")) throw new Error("AutoDL: this adapter only supports image_url with public HTTP(S) URLs or standard image Data URLs; file_id is not supported");
    if (!has(item, "image_url") || Object.keys(item).length !== 1) throw new Error("AutoDL: input_reference entries must contain only image_url");
    return inputMedia(item.image_url, "image");
  });
}

// OpenAI's Videos Create has no `images` field; it is the New API Sora compatibility spelling
// ([]string of URLs).
function referenceInput(input) {
  const hasNew = has(input, "input_reference"), hasLegacy = has(input, "images");
  if (hasNew && hasLegacy) throw new Error("AutoDL: use either input_reference or images, not both");
  if (hasLegacy) {
    const legacy = input.images;
    if (legacy === undefined || legacy === null) return undefined;
    if (typeof legacy === "string" || object(legacy)) return legacy;
    if (Array.isArray(legacy) && legacy.every(function (item) { return typeof item === "string" || object(item); })) return legacy;
    throw new Error("AutoDL: images must be a public HTTP(S) URL, a Data URL, an image_url object or an array of them");
  }
  return input.input_reference;
}

function mapMedia(config, input, body, kind) {
  const source = kind === "input_reference" ? referenceInput(input) : input[kind];
  const values = kind === "input_reference" ? referenceURLs(source) : (source === undefined ? [] : source);
  if (!Array.isArray(values)) throw new Error("AutoDL: " + kind + " must be an array of public HTTP(S) URLs or standard Data URLs");
  const fields = config[kind];
  if (kind === "input_reference") {
    if (fields.length === 0 && source !== undefined) throw new Error("AutoDL: this workflow does not accept input_reference");
    const minimum = fields.reduce(function (count, field, index) { return config.rules[field].required ? index + 1 : count; }, 0);
    if (values.length < minimum) throw new Error("AutoDL: input_reference requires at least " + minimum + " image(s) for this workflow");
  }
  if (values.length > fields.length) throw new Error("AutoDL: too many " + kind + " for this workflow (maximum " + fields.length + ")");
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i], rule = config.rules[key], value = values[i];
    if (value === undefined || value === null) {
      if (rule.required) throw new Error("AutoDL: " + kind + "[" + i + "] is required for this workflow");
      continue;
    }
    body[key] = inputMedia(value, { input_reference: "image", audios: "audio", videos: "video" }[kind]);
  }
}

function mapEmotion(config, input, body) {
  if (config.type !== "audio") {
    if (input.emotion !== undefined) throw new Error("AutoDL: emotion controls are supported only by indexTTS2");
    return;
  }
  const emotion = input.emotion === undefined ? {} : input.emotion;
  if (!object(emotion)) throw new Error("AutoDL: emotion must be an object");
  const modes = { voice: "与音色参考音频相同", reference: "使用情感参考音频", vector: "使用情感向量控制" };
  const allowed = ["mode", "random", "afraid", "angry", "calm", "disgusted", "happy", "melancholic", "sad", "surprised"];
  for (const key of Object.keys(emotion)) if (!allowed.includes(key)) throw new Error("AutoDL: unsupported emotion field");
  const mode = emotion.mode === undefined ? "voice" : emotion.mode;
  if (!has(modes, mode)) throw new Error("AutoDL: emotion.mode must be voice, reference or vector");
  body.emo_control_method = modes[mode];
  if (mode === "reference" && !body.emo_ref_audio) throw new Error("AutoDL: audios[1] is required for reference emotion mode");
  for (const key of allowed) {
    if (key === "mode" || emotion[key] === undefined) continue;
    // A missing rule means this config declares an emotion mode it never gave bounds for. Refusing
    // is the correct answer; dereferencing it crashed with a raw TypeError, which reaches the
    // operator as an unintelligible failure instead of a diagnosis.
    const rule = config.rules["emo_" + key];
    if (!rule) throw new Error("AutoDL: emotion." + key + " is not supported by this workflow");
    body["emo_" + key] = controlValue(rule, emotion[key], "emotion." + key);
  }
}

// Validate one scalar against its official rule. Shared by the workflow-specific controls on both
// surfaces and by the raw MiniMax fields, so a value is judged the same way whichever request
// format carried it.
function controlValue(rule, value, name) {
  if (["integer", "number"].includes(rule.type)) return numberValue(value, rule, name);
  if (rule.type === "boolean") {
    if (typeof value !== "boolean") throw new Error("AutoDL: " + name + " must be boolean");
    return value;
  }
  if (rule.type === "enum") {
    if (!rule.options.includes(value)) throw new Error("AutoDL: unsupported " + name + " for this workflow; use one of: " + rule.options.join(", "));
    return value;
  }
  if (["prompt", "string"].includes(rule.type)) {
    if (typeof value !== "string" || !value.trim() || value.length < (rule.min_length || 1) || (rule.max_length !== undefined && value.length > rule.max_length)) throw new Error("AutoDL: invalid " + name + " length or type for this workflow");
    return value;
  }
  throw new Error("AutoDL: unsupported official rule type " + rule.type);
}

// Scalar controls a workflow declares beyond the unified fields, such as the H3 nine-image `mode` /
// `style_preset` and the character-replacement `video_subject_to_replace`.
function workflowControls(config) {
  if (config.unmapped) return [];
  const media = config.input_reference.concat(config.audios, config.videos);
  return Object.keys(config.rules).filter(function (key) {
    const type = config.rules[key].type;
    return key !== config.promptField && key !== config.secondsField && key !== "resolution" && key !== "seed"
      && !media.includes(key) && !/^emo_/.test(key) && !["image", "audio", "video"].includes(type);
  });
}

// Fields the OpenAI surface documents for itself plus the parameters this
// adapter adds for AutoDL capabilities OpenAI has no equivalent for.
const OPENAI_FIELDS = ["model", "prompt", "seconds", "duration", "size", "input_reference", "images", "resolution", "orientation", "audios", "videos", "seed", "emotion"];
// Accepted only so an official OpenAI client is not rejected; AutoDL has no counterpart for either,
// and neither carries media, so they are ignored.
const OPENAI_IGNORED = ["metadata", "mode", "callback_url", "extra", "user", "n", "response_format", "fps", "width", "height"];

function normalizeInput(config, input) {
  if (!object(input)) throw new Error("AutoDL: request body must be an object");
  const controls = workflowControls(config);
  for (const key of Object.keys(input)) {
    if (OPENAI_FIELDS.includes(key) || OPENAI_IGNORED.includes(key) || controls.includes(key)) continue;
    // A prototype key is never a legitimate parameter and must not be tolerated
    // into the upstream body, even though unknown scalars now are.
    if (key === "__proto__" || key === "constructor" || key === "prototype") throw new Error("AutoDL: unsupported request field " + key);
    // A media-shaped field this adapter cannot place is refused rather than
    // dropped, so a caller never pays for a generation that lost its input.
    if (/^(image|images|input_ref|audio|video|ref_|file)/i.test(key) || object(input[key]) || Array.isArray(input[key])) throw new Error("AutoDL: unsupported request field " + key + "; use input_reference, audios and videos for media");
    // Any other unknown field is refused too, as on the MiniMax surface: a
    // misspelt control would otherwise be dropped and the render still billed.
    throw new Error("AutoDL: unsupported request field " + key + " for this workflow");
  }
  const body = {}, facts = { requests: 1 };
  if (config.promptField) {
    const rule = config.rules[config.promptField];
    // Only an explicitly optional prompt may be omitted (the character-replacement
    // workflows); a rule that does not say so keeps requiring one.
    if (input.prompt !== undefined || rule.required !== false) {
      if (typeof input.prompt !== "string" || !input.prompt.trim() || input.prompt.length < (rule.min_length || 1) || input.prompt.length > rule.max_length) throw new Error("AutoDL: prompt must contain 1 to " + rule.max_length + " characters for this workflow");
      body[config.promptField] = input.prompt;
    }
  } else if (input.prompt !== undefined) throw new Error("AutoDL: this workflow does not accept a text prompt");
  if (config.secondsField) {
    const rule = config.rules[config.secondsField];
    // `duration` is the New API spelling of `seconds`; both name the same
    // upstream control, so accept either and still reject a real conflict.
    let seconds = input.seconds === undefined ? (input.duration === undefined ? rule.default : input.duration) : input.seconds;
    seconds = numberValue(seconds, rule, "seconds");
    if (input.seconds !== undefined && input.duration !== undefined && numberValue(input.duration, rule, "seconds") !== seconds) throw new Error("AutoDL: seconds and duration conflict");
    body[config.secondsField] = seconds; facts.seconds = seconds;
  } else if (tableId(config) === MOTION_WORKFLOW) {
    // Optional: motion transfer has no upstream seconds control, so this only
    // seeds the reservation and settlement bills the measured clip instead.
    facts.seconds = motionDeclaredSeconds(input);
  } else if (config.type === "audio") {
    // TTS has no duration control either, but unlike motion transfer there is no caller declaration
    // to read: the length is decided by the delivered audio, so the reservation is fixed and
    // settlement replaces it with the measurement.
    if (input.seconds !== undefined || input.duration !== undefined) throw new Error("AutoDL: this workflow has no seconds control; duration follows the reference media or generated speech");
    facts.seconds = TTS_DEFAULT_SECONDS;
  } else if (input.seconds !== undefined || input.duration !== undefined) throw new Error("AutoDL: this workflow has no seconds control; duration follows the reference media or generated speech");
  const selected = mapResolution(config, input);
  if (selected) { body.resolution = selected.upstream; facts.resolution = selected.resolution; facts.orientation = selected.orientation; }
  for (const kind of ["input_reference", "audios", "videos"]) mapMedia(config, input, body, kind);
  if (input.seed !== undefined) {
    if (!config.rules.seed) throw new Error("AutoDL: this workflow has no seed control");
    body.seed = numberValue(input.seed, config.rules.seed, "seed");
  }
  for (const key of controls) if (input[key] !== undefined) body[key] = controlValue(config.rules[key], input[key], key);
  mapEmotion(config, input, body);
  return { body: body, facts: facts, type: config.type };
}

// OpenAI and MiniMax generate a validated upstream body. Native requests keep
// their JSON body separate from the read-only task/billing analysis below.
function normalizeMiniMaxBody(config, input) {
  if (!object(input)) throw new Error("AutoDL: MiniMax body must be a JSON object");
  const body = {}, facts = { requests: 1 };
  for (const key of Object.keys(input)) {
    if (!has(config.rules, key)) throw new Error("AutoDL: unsupported raw field " + key + " for this workflow");
    const rule = config.rules[key], value = input[key];
    body[key] = ["image", "audio", "video"].includes(rule.type) ? inputMedia(value, rule.type) : controlValue(rule, value, key);
  }
  for (const key of Object.keys(config.rules)) {
    const rule = config.rules[key];
    if (has(body, key)) continue;
    if ([config.secondsField, "resolution", "emo_control_method"].includes(key) && rule.default !== undefined) body[key] = rule.default;
    else if (rule.required) throw new Error("AutoDL: raw field " + key + " is required for this workflow");
  }
  if (body.emo_control_method === "使用情感参考音频" && !body.emo_ref_audio) throw new Error("AutoDL: emo_ref_audio is required for reference emotion mode");
  if (config.secondsField) facts.seconds = body[config.secondsField];
  // A pass-through table has no tiers to bill by, so it reports none.
  if (config.resolutions.length && !config.resolutions[0].passthrough) {
    const selected = config.resolutions.find(function (entry) { return entry.upstream === body.resolution; });
    if (!selected) throw new Error("AutoDL: unsupported native resolution for this workflow");
    facts.resolution = selected.resolution; facts.orientation = selected.orientation;
  }
  return { body: body, facts: facts, type: config.type };
}

// Summarize a MiniMax content array so each workflow can validate the media
// shape it supports before any field is mapped.
function miniScenario(input) {
  if (!object(input) || !Array.isArray(input.content)) throw new Error("AutoDL: MiniMax content must be an array");
  const summary = { text: [], first_frame: 0, last_frame: 0, reference_image: 0, reference_audio: 0, reference_video: 0 };
  for (const item of input.content) {
    if (!object(item)) throw new Error("AutoDL: MiniMax content entries must be objects");
    if (item.type === "text") { summary.text.push(item.text); continue; }
    const role = item.role === undefined && item.type === "image_url" ? "first_frame" : item.role;
    const valid = item.type === "image_url" ? ["first_frame", "last_frame", "reference_image"] : item.type === "audio_url" ? ["reference_audio"] : item.type === "video_url" ? ["reference_video"] : [];
    if (!valid.includes(role)) throw new Error("AutoDL: invalid MiniMax media type or role");
    summary[role]++;
  }
  summary.frames = summary.first_frame + summary.last_frame;
  summary.references = summary.reference_image + summary.reference_audio + summary.reference_video;
  if (summary.frames && summary.references) throw new Error("AutoDL: first/last frames and reference media cannot be mixed in MiniMax content");
  return summary;
}

const MINIMAX_RESOLUTIONS = { "480P": "480p", "768P": "768p", "2K": "1440p" };
const MINIMAX_RATIOS = { "21:9": "landscape", "16:9": "landscape", "4:3": "landscape", "1:1": "square", "3:4": "portrait", "9:16": "portrait" };

// MiniMax treats every valid i2va ratio as adaptive. Plugin API v1 has no remote-media probe, so
// keep the official workflow's default direction instead of pretending that URL text or a
// caller-specified ratio is a measured size.
function miniOrientation(config, input, scenario, quality) {
  const ratio = input.ratio;
  if (ratio !== undefined && ratio !== "adaptive" && !(typeof ratio === "string" && has(MINIMAX_RATIOS, ratio))) throw new Error("AutoDL: MiniMax ratio must be adaptive, 21:9, 16:9, 4:3, 1:1, 3:4 or 9:16");
  if (!scenario.frames && !scenario.references && (ratio === undefined || ratio === "adaptive")) throw new Error("AutoDL: MiniMax text-to-video ratio is required and cannot be adaptive");
  const defaults = config.resolutions.find(function (entry) { return entry.upstream === config.rules.resolution.default; });
  const adaptive = scenario.frames || ratio === undefined || ratio === "adaptive";
  let orientation = adaptive ? defaults.orientation : MINIMAX_RATIOS[ratio];
  if (orientation === "square" && !config.resolutions.some(function (entry) { return entry.resolution === quality && entry.orientation === orientation; })) orientation = defaults.orientation;
  return orientation;
}

function savedMiniMax(input) {
  let source;
  try { source = JSON.parse(input.__autodl_minimax); } catch (_) { throw new Error("AutoDL: invalid internal MiniMax source"); }
  // The saved model is the name the decoder resolved: a declared workflow, or a
  // channel alias whose mapping only becomes known at submission.
  if (!object(source) || !text(source.model)) throw new Error("AutoDL: invalid internal MiniMax model");
  return source;
}

function requestWorkflow(ctx) {
  const input = ctx.requestBody;
  // A MiniMax native decoder runs before channel selection and never sees the channel mapping, so
  // its saved model is resolved again here against ctx.upstreamModel, exactly as the OpenAI decoder
  // resolves it.
  if (object(input) && has(input, "__autodl_minimax")) return resolveWorkflow(text(ctx.upstreamModel), savedMiniMax(input).model);
  // Past this point the request already carries a resolved workflow id. Validation still follows
  // the model the caller named, so a declared model keeps its own capability table even when a
  // channel mapped it to a private id; a public alias resolves to the workflow it names; only a
  // name with no table at all -- a self-chosen one -- falls back to the permissive profile.
  return resolveWorkflow(text(ctx.upstreamModel), text(ctx.model));
}

function normalizeMiniMax(config, input) {
  const scenario = miniScenario(input);
  if (scenario.reference_video && !config.videos.length) throw new Error("AutoDL: 当前 AutoDL 适配器没有对应的 reference_video workflow");
  const reserved = ["model", "content", "resolution", "duration", "audio_duration", "ratio", "seed"];
  // Documented by MiniMax but with no AutoDL counterpart. They are control metadata only (no
  // media), so accepting and ignoring them keeps an official client working instead of failing its
  // request outright.
  const ignored = ["callback_url", "extra"];
  const mediaFields = config.input_reference.concat(config.audios, config.videos);
  const body = {};
  for (const key of Object.keys(input)) {
    if (reserved.includes(key) || ignored.includes(key)) continue;
    // Preserve AutoDL-specific controls, but never mix competing media/prompt inputs.
    if (!has(config.rules, key) || key === config.promptField || mediaFields.includes(key)) {
      // Refuse anything shaped like media instead of dropping the caller's picture.
      throw new Error("AutoDL: unsupported or mixed MiniMax field " + key);
    }
    body[key] = input[key];
  }
  let motionSeconds;
  for (const key of ["duration", "audio_duration", "seed"]) if (has(input, key)) {
    if (!has(config.rules, key)) {
      if (tableId(config) === MOTION_WORKFLOW && key === "duration") { motionSeconds = billedSeconds(input[key], "duration"); continue; }
      throw new Error("AutoDL: this workflow does not support " + key);
    }
    body[key] = input[key];
  }
  if (config.resolutions.length && config.resolutions[0].passthrough) {
    // No label table: keep the caller's spelling. When a channel maps this name
    // onto a declared workflow, submission re-derives the body from that table.
    if (typeof input.resolution !== "string" || !input.resolution.trim()) throw new Error("AutoDL: MiniMax resolution is required for this workflow");
    if (input.ratio !== undefined && input.ratio !== "adaptive" && !(typeof input.ratio === "string" && has(MINIMAX_RATIOS, input.ratio))) throw new Error("AutoDL: MiniMax ratio must be adaptive, 21:9, 16:9, 4:3, 1:1, 3:4 or 9:16");
    body.resolution = input.resolution;
  } else if (config.resolutions.length) {
    if (typeof input.resolution !== "string") throw new Error("AutoDL: MiniMax resolution is required for this workflow");
    let quality = has(MINIMAX_RESOLUTIONS, input.resolution) ? MINIMAX_RESOLUTIONS[input.resolution] : undefined;
    const rawChoice = config.resolutions.find(function (entry) { return entry.upstream === input.resolution; });
    if (quality === undefined) {
      // Non-MiniMax tiers retain their AutoDL spelling, including exact enum labels.
      quality = rawChoice ? rawChoice.resolution : input.resolution;
      if (Object.values(MINIMAX_RESOLUTIONS).includes(quality)) throw new Error("AutoDL: use MiniMax resolution spelling 480P, 768P or 2K");
    }
    // Legacy motion spelling: 832p was the portrait 464p tier.
    const legacyPortrait = tableId(config) === MOTION_WORKFLOW && quality === "832p";
    if (legacyPortrait) quality = "464p";
    const orientation = miniOrientation(config, input, scenario, quality);
    if (legacyPortrait && orientation !== "portrait") throw new Error("AutoDL: MiniMax ratio conflicts with the AutoDL resolution label");
    if (rawChoice && !scenario.frames && input.ratio !== undefined && input.ratio !== "adaptive" && rawChoice.orientation !== orientation) throw new Error("AutoDL: MiniMax ratio conflicts with the AutoDL resolution label");
    const selected = config.resolutions.find(function (entry) { return entry.resolution === quality && entry.orientation === orientation; });
    if (!selected) throw new Error("AutoDL: unsupported MiniMax resolution/ratio combination for this workflow");
    body.resolution = selected.upstream;
  } else if (has(input, "resolution") || has(input, "ratio")) throw new Error("AutoDL: this workflow has no resolution or ratio control");

  const references = { image_url: [], audio_url: [], video_url: [] }, frames = {};
  let textCount = 0;
  for (const item of input.content) {
    if (!object(item)) throw new Error("AutoDL: MiniMax content entries must be objects");
    if (item.type === "text") {
      if (Object.keys(item).some(function (key) { return !["type", "text"].includes(key); })) throw new Error("AutoDL: unsupported text content field");
      if (++textCount > 1) throw new Error("AutoDL: MiniMax content accepts only one text item");
      if (!config.promptField) throw new Error("AutoDL: this workflow does not accept text content");
      body[config.promptField] = item.text;
      continue;
    }
    if (!has(references, item.type)) throw new Error("AutoDL: MiniMax content type must be text, image_url, audio_url or video_url");
    if (Object.keys(item).some(function (key) { return !["type", item.type, "role"].includes(key); })) throw new Error("AutoDL: unsupported media content field");
    const resource = item[item.type];
    if (!object(resource) || Object.keys(resource).length !== 1 || !has(resource, "url")) throw new Error("AutoDL: MiniMax media must contain only a public HTTP(S) url or standard Data URL in url");
    const url = inputMedia(resource.url, item.type.split("_")[0]);
    const role = item.role === undefined && item.type === "image_url" ? "first_frame" : item.role;
    if (item.type === "image_url" && ["first_frame", "last_frame"].includes(role)) {
      if (has(frames, role)) throw new Error("AutoDL: duplicate " + role + " in MiniMax content");
      const field = has(config.rules, role) ? role : role === "first_frame" && config.input_reference.length === 1 ? config.input_reference[0] : null;
      if (!field) throw new Error("AutoDL: this workflow does not support " + role);
      frames[role] = field; body[field] = url;
    } else {
      const expected = { image_url: "reference_image", audio_url: "reference_audio", video_url: "reference_video" }[item.type];
      if (role !== expected) throw new Error("AutoDL: invalid MiniMax media role for " + item.type);
      references[item.type].push(url);
    }
  }
  if (Object.keys(frames).length && Object.values(references).some(function (values) { return values.length; })) throw new Error("AutoDL: first/last frames and reference media cannot be mixed in MiniMax content");
  for (const kind of ["image_url", "audio_url", "video_url"]) {
    const fields = kind === "image_url" ? config.input_reference : kind === "audio_url" ? config.audios : config.videos;
    if (kind === "image_url" && references[kind].length && fields.includes("first_frame")) throw new Error("AutoDL: first/last-frame workflows require first_frame and last_frame roles");
    if (references[kind].length > fields.length) throw new Error("AutoDL: too many " + kind + " references for this workflow");
    references[kind].forEach(function (url, index) { body[fields[index]] = url; });
  }
  const normalized = normalizeMiniMaxBody(config, body);
  if (tableId(config) === MOTION_WORKFLOW) {
    // `duration` is optional here: it never reaches upstream, and settlement
    // bills the measured clip. Omitting it leaves the default reservation.
    normalized.facts.seconds = motionSeconds === undefined ? MOTION_DEFAULT_SECONDS : motionSeconds;
  }
  if (tableId(config) === TTS_WORKFLOW) {
    // There is no duration parameter to read at all: the caller cannot influence the length, and
    // the delivered file is the only source.
    normalized.facts.seconds = TTS_DEFAULT_SECONDS;
  }
  return normalized;
}

// Two configs describe the same capability table (and so produce the same body).
function sameTable(a, b) { return !!a.unmapped === !!b.unmapped && tableId(a) === tableId(b); }

function normalizeRequest(config, input) {
  if (object(input) && has(input, "__autodl_fields")) {
    if (Object.keys(input).some(function (key) { return !["model", "__autodl_fields", "__autodl_minimax", "requests", "seconds", "resolution", "orientation"].includes(key); }) || !Array.isArray(input.__autodl_fields)) throw new Error("AutoDL: invalid internal normalized request");
    // The integrity checks below compare the saved fields with the table the decoder used. `config`
    // can differ from it: a native MiniMax decoder never sees the channel mapping, which only
    // reaches the driver hooks.
    let decodedConfig = config, expected, expectedFacts, source;
    if (has(input, "__autodl_minimax")) {
      if (typeof input.__autodl_minimax !== "string") throw new Error("AutoDL: invalid internal MiniMax source");
      source = savedMiniMax(input);
      decodedConfig = resolveWorkflow("", source.model);
      const normalizedSource = normalizeMiniMax(decodedConfig, source);
      expected = normalizedSource.body;
      expectedFacts = normalizedSource.facts;
    }
    const body = {};
    for (const pair of input.__autodl_fields) {
      if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== "string" || !has(decodedConfig.rules, pair[0]) || has(body, pair[0])) throw new Error("AutoDL: invalid or duplicate internal AutoDL field");
      body[pair[0]] = pair[1];
    }
    const result = normalizeMiniMaxBody(decodedConfig, body);
    if (expectedFacts && expectedFacts.seconds !== undefined) result.facts.seconds = expectedFacts.seconds;
    const motion = tableId(decodedConfig) === MOTION_WORKFLOW && !decodedConfig.unmapped;
    if (motion && result.facts.seconds === undefined) throw new Error("AutoDL: motion transfer billing seconds are missing");
    if (expected) {
      if (Object.keys(result.body).length !== Object.keys(expected).length || Object.keys(expected).some(function (key) { return !has(result.body, key) || result.body[key] !== expected[key]; })) throw new Error("AutoDL: internal MiniMax fields conflict with the official request");
    }
    for (const key of ["requests", "seconds", "resolution", "orientation"]) if (has(input, key) && input[key] !== result.facts[key]) throw new Error("AutoDL: internal usage facts conflict");
    if (motion && !has(input, "seconds")) throw new Error("AutoDL: internal motion billing seconds are missing");
    // Once the mapping names a different table, that table validates and shapes
    // the request, exactly as on the OpenAI surface.
    if (source && !sameTable(decodedConfig, config)) return normalizeMiniMax(config, source);
    return result;
  }
  if (object(input) && has(input, "content")) return normalizeMiniMax(config, input);
  return normalizeInput(config, input);
}

function normalized(ctx) { return normalizeRequest(requestWorkflow(ctx), ctx.requestBody); }

function credentials(ctx) {
  // authHeader may be host-generated Bearer; use the original channel key instead.
  const token = text(ctx.apiKey);
  if (!token || token === "__CONFIGURE_AUTODL_COMFYUI_TOKEN__") throw new Error("AutoDL: configure the channel with a ComfyUI-group token");
  if (/^Bearer\s/i.test(token) || /[\r\n]/.test(token)) throw new Error("AutoDL: channel key must contain the raw AutoDL token without Bearer");
  return { Authorization: token, "Content-Type": "application/json" };
}

function endpoint(ctx, path) {
  const base = text(ctx.baseUrl).replace(/\/+$/, "");
  if (!base) throw new Error("AutoDL: channel Base URL is required");
  return base + path;
}

function httpError(status) {
  if (status === 401 || status === 403) return "AutoDL: authentication failed; check the ComfyUI-group token";
  if (status === 400 || status === 422) return "AutoDL: upstream rejected the workflow parameters";
  if (status === 404 || status === 410) return "AutoDL: workflow or task does not exist";
  if (status === 429) return "AutoDL: upstream rate limit exceeded";
  if (status >= 500) return "AutoDL: upstream service error (HTTP " + status + ")";
  return "AutoDL: upstream HTTP error " + status;
}

function envelope(value) {
  if (typeof value === "string") {
    try { value = JSON.parse(value); } catch (_) { throw new Error("AutoDL: upstream returned invalid JSON"); }
  }
  if (!object(value)) throw new Error("AutoDL: upstream returned an invalid JSON object");
  if (value.code !== "Success") throw new Error("AutoDL: upstream returned an unsuccessful API response; check token, parameters, balance and task ID");
  if (!object(value.data)) throw new Error("AutoDL: upstream response has no valid data object");
  return value;
}

function taskId(value) {
  const id = text(value);
  if (!id || id.length > 256 || /[\s\x00-\x1f]/.test(id) || id === "." || id === "..") throw new Error("AutoDL: upstream response has no valid task_id");
  return id;
}

// Shortest credential worth redacting from a diagnostic. Below this the value is
// a misconfiguration and redacting it would corrupt unrelated text.
const MIN_REDACTABLE_SECRET = 8;

function safeReason(ctx, value) {
  let message = text(value) || "AutoDL: workflow generation failed";
  for (const candidate of [ctx.apiKey, ctx.authHeader]) {
    if (typeof candidate !== "string" || !candidate) continue;
    // The auth header carries a scheme prefix that is NOT part of the credential. Window the
    // credential itself: windowing the whole header produced fragments containing "Bearer " plus a
    // character or two of the key, which matched ordinary diagnostic text and redacted it -- a
    // 7-character key was redacted through its 14-character header despite the documented minimum
    // below, eating the space around it.
    const secret = candidate.replace(/^\s*Bearer\s+/i, "");
    // Only redact a credential long enough that its occurrence is unambiguous. A short key (a
    // misconfigured channel) would otherwise match ordinary words and shred the diagnostic an
    // operator needs, e.g.
    if (secret.length < MIN_REDACTABLE_SECRET) continue;
    const escape = function (part) { return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    // Redact the WHOLE credential first, as sent (header form) and bare, and CASE-INSENSITIVELY.
    message = message.replace(new RegExp(escape(candidate), "gi"), "[redacted]");
    message = message.replace(new RegExp(escape(secret), "gi"), "[redacted]");
    // An upstream may echo the credential split across escapes, quotes or line breaks, which
    // defeats a contiguous match, and the split can fall at any offset.
    const size = Math.max(1, Math.min(8, secret.length - 1));
    const windows = {};
    for (let start = 0; start + size <= secret.length; start++) windows[secret.slice(start, start + size)] = true;
    for (const fragment of Object.keys(windows)) {
      if (fragment === secret) continue;
      // Case-insensitive too: a case-altered echo defeats an exact-case window match.
      message = message.replace(new RegExp(escape(fragment), "gi"), "[redacted]");
    }
  }
  message = message.replace(/(?:Bearer\s+|\bsk-)[A-Za-z0-9_.\-]+/gi, "[redacted]");
  return message.replace(/[\x00-\x1f]/g, " ").slice(0, 300);
}

function inputMedia(value, kind) {
  if (typeof value === "string" && /^https?:\/\//i.test(value)) return outputMediaURL(value);
  const match = typeof value === "string" && value.match(/^data:(image|audio|video)\/[a-z0-9][a-z0-9.+-]*;base64,([A-Za-z0-9+/]+={0,2})$/i);
  if (!match || match[1].toLowerCase() !== kind || match[2].length % 4 !== 0) throw new Error("AutoDL: input media must be a public HTTP(S) URL or standard Base64 Data URL with the matching image/audio/video MIME type (invalid media URL)");
  const payload = match[2], alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const padding = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0;
  if (padding && (alphabet.indexOf(payload[payload.length - padding - 1]) & (padding === 2 ? 15 : 3)) !== 0) throw new Error("AutoDL: invalid media URL; Data URL contains noncanonical Base64 padding bits");
  return value;
}

function outputMediaURL(value) {
  if (typeof value !== "string" || value !== value.trim() || /[\s\\\x00-\x1f]/.test(value) || !/^https?:\/\/[^/?#@]+(?:[/?#]|$)/i.test(value)) {
    throw new Error("AutoDL: results contains an invalid media URL");
  }
  return value;
}

function resultMediaType(url, fileType, fallbackType) {
  const types = { mp4: "video", webm: "video", mov: "video", m4v: "video", mkv: "video", avi: "video", wav: "audio", mp3: "audio", flac: "audio", m4a: "audio", aac: "audio", ogg: "audio", opus: "audio", png: "image", jpg: "image", jpeg: "image", webp: "image", gif: "image" };
  const extension = typeof fileType === "string" ? fileType.toLowerCase().replace(/^\./, "") : "";
  if (has(types, extension)) return types[extension];
  const match = url.split(/[?#]/)[0].toLowerCase().match(/\.([a-z0-9]+)$/);
  return match && has(types, match[1]) ? types[match[1]] : fallbackType;
}

const MEDIA_PROBE_BYTES = 1024 * 1024;
const MEDIA_PROBE_END = MEDIA_PROBE_BYTES - 1;

function bytesView(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (value && value.buffer instanceof ArrayBuffer) return new Uint8Array(value.buffer, value.byteOffset || 0, value.byteLength);
  return null;
}

function ascii4(bytes, offset) {
  return String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
}

function u32(bytes, offset) {
  return bytes[offset] * 0x1000000 + bytes[offset + 1] * 0x10000 + bytes[offset + 2] * 0x100 + bytes[offset + 3];
}

function u64(bytes, offset) {
  const high = u32(bytes, offset), low = u32(bytes, offset + 4);
  const value = high * 0x100000000 + low;
  return Number.isSafeInteger(value) ? value : NaN;
}

function mp4Boxes(bytes, start, end, visit) {
  let offset = start;
  while (offset + 8 <= end) {
    let size = u32(bytes, offset), header = 8;
    const type = ascii4(bytes, offset + 4);
    if (size === 1) { if (offset + 16 > end) return; size = u64(bytes, offset + 8); header = 16; }
    else if (size === 0) size = end - offset;
    if (!Number.isSafeInteger(size) || size < header || offset + size > end) return;
    visit(type, offset + header, offset + size, offset, size);
    offset += size;
  }
}

function mp4Duration(bytes) {
  let videoDuration = null;
  let videoSampled = false;
  let movieDuration = null;
  function inspectMovie(start, end) {
    mp4Boxes(bytes, start, end, function (type, data, boxEnd) {
      if (type === "mvhd" && data + 20 <= boxEnd) {
        const version = bytes[data];
        const timescaleOffset = version === 1 ? data + 20 : data + 12;
        const durationOffset = version === 1 ? data + 24 : data + 16;
        const timescale = u32(bytes, timescaleOffset);
        const duration = version === 1 ? u64(bytes, durationOffset) : u32(bytes, durationOffset);
        if (timescale > 0 && Number.isFinite(duration)) {
          const value = duration / timescale;
          if (movieDuration === null || value > movieDuration) movieDuration = value;
        }
      }
      if (type !== "trak") return;
      let handler = "", timescale = 0, duration = NaN, hasSamples = false;
      mp4Boxes(bytes, data, boxEnd, function (trakType, trakData, trakEnd) {
        if (trakType !== "mdia") return;
        mp4Boxes(bytes, trakData, trakEnd, function (mediaType, mediaData, mediaEnd) {
          if (mediaType === "hdlr" && mediaData + 12 <= mediaEnd) handler = ascii4(bytes, mediaData + 8);
          if (mediaType === "mdhd" && mediaData + 20 <= mediaEnd) {
            const version = bytes[mediaData];
            const scaleOffset = version === 1 ? mediaData + 20 : mediaData + 12;
            const durationOffset = version === 1 ? mediaData + 24 : mediaData + 16;
            timescale = u32(bytes, scaleOffset);
            duration = version === 1 ? u64(bytes, durationOffset) : u32(bytes, durationOffset);
          }
          // minf/stbl is where a track's samples live; a track without it
          // carries no coded picture.
          if (mediaType === "minf") {
            hasSamples = true;
          }
        });
      });
      // A file can carry several 'vide' tracks, but only the one with a sample table carries the
      // delivered picture; sprites, posters and timed metadata have none.
      if (handler === "vide" && timescale > 0 && Number.isFinite(duration)) {
        const value = duration / timescale;
        if (hasSamples && !videoSampled) { videoDuration = value; videoSampled = true; }
        else if (hasSamples === videoSampled && (videoDuration === null || value > videoDuration)) videoDuration = value;
      }
    });
  }
  mp4Boxes(bytes, 0, bytes.length, function (type, data, end) { if (type === "moov") inspectMovie(data, end); });
  // A tail range can begin in the middle of an earlier box. Find a complete
  // moov header inside that range as a second bounded pass.
  if (videoDuration === null && movieDuration === null) for (let offset = 1; offset + 8 <= bytes.length; offset++) {
    if (ascii4(bytes, offset + 4) !== "moov") continue;
    const size = u32(bytes, offset);
    if (size >= 8 && offset + size <= bytes.length) inspectMovie(offset + 8, offset + size);
  }
  return videoDuration === null ? movieDuration : videoDuration;
}

function ebmlVint(bytes, offset, mask) {
  if (offset >= bytes.length) return null;
  let first = bytes[offset], length = 1;
  while (length <= 8 && (first & (0x80 >> (length - 1))) === 0) length++;
  if (length > 8 || offset + length > bytes.length) return null;
  let value = mask ? first & (0xff >> length) : first;
  for (let i = 1; i < length; i++) value = value * 0x100 + bytes[offset + i];
  return { length: length, value: value };
}

function webmDuration(bytes) {
  let timecodeScale = 1000000, duration = null;
  function walk(start, end, parent) {
    let offset = start;
    while (offset < end) {
      const id = ebmlVint(bytes, offset, false); if (!id) return;
      const size = ebmlVint(bytes, offset + id.length, true); if (!size) return;
      const data = offset + id.length + size.length;
      const childEnd = size.value === (2 ** (7 * size.length) - 1) ? end : data + size.value;
      if (childEnd > end) return;
      if (id.value === 0x2ad7b1) {
        let value = 0; for (let i = data; i < childEnd; i++) value = value * 0x100 + bytes[i];
        if (value > 0) timecodeScale = value;
      } else if (id.value === 0x4489 && childEnd > data) {
        const view = new DataView(bytes.buffer, bytes.byteOffset + data, childEnd - data);
        if (view.byteLength === 4) duration = view.getFloat32(0, false);
        else if (view.byteLength === 8) duration = view.getFloat64(0, false);
      }
      const container = id.value === 0x18538067 || id.value === 0x1549a966 || id.value === 0x1654ae6b || id.value === 0xae;
      if (container) walk(data, childEnd, id.value);
      offset = childEnd;
    }
  }
  walk(0, bytes.length, 0);
  return duration === null || !Number.isFinite(duration) ? null : duration * timecodeScale / 1000000000;
}


// TTS bills per second of delivered audio (AutoDL's own price_type for the workflow is
// `audio_sec_cost`), but the upstream returns no duration field and the workflow exposes no
// duration parameter.
function u16le(bytes, offset) {
  return bytes[offset] + bytes[offset + 1] * 0x100;
}

function u32le(bytes, offset) {
  return bytes[offset] + bytes[offset + 1] * 0x100 + bytes[offset + 2] * 0x10000 + bytes[offset + 3] * 0x1000000;
}

// ---------------------------------------------------------------------------
// Synchronous fetch budget
// ---------------------------------------------------------------------------
// The host grants at most four synchronous fetches per hook call (15 s each, 30 s total,
// 1 MiB per body). A hook can measure twice -- a submit whose response is already a
// terminal success measures the reference clip AND the delivered one -- so without a
// shared count the fifth request would fail inside a measuring helper and silently drop the
// measurement to null, i.e. to the vendor minimum. Counting against a budget reset at each
// hook entry keeps every path inside the limit and degrades to a lower bound instead.
const FETCH_BUDGET = 4;
let fetchesUsed = 0;
function resetFetchBudget() { fetchesUsed = 0; }
function fetchesLeft() { return FETCH_BUDGET - fetchesUsed; }

// The single point through which every host fetch passes, so this count mirrors the host's own.
function budgetedFetch(options) {
  if (fetchesLeft() <= 0) throw new Error("media fetch budget exhausted");
  fetchesUsed++;
  return utils.fetch(options);
}

function isRiff(bytes) {
  return !!bytes && bytes.length >= 12 && ascii4(bytes, 0) === "RIFF" && ascii4(bytes, 8) === "WAVE";
}

// Walk a WAV's RIFF chunk chain, summing every `data` chunk. `first` is the file's first window;
// `fetchWindow(start, end)` may return further windows, or null when the budget is exhausted.
function wavWalk(first, totalBytes, fetchWindow) {
  if (!first || first.length < 12) return null;
  if (ascii4(first, 0) !== "RIFF" || ascii4(first, 8) !== "WAVE") return null;
  // The clamp uses the real resource size, never the window: clamping to the window truncated every
  // file larger than it (a 3600s WAV billed 65.53325s) and, because that result is non-null, the
  // caller's tail read never ran to correct it.
  let total = typeof totalBytes === "number" && isFinite(totalBytes) && totalBytes > 0 ? totalBytes : null;
  let window = first;
  let windowStart = 0;
  let offset = 12;
  let byteRate = 0;
  // RIFF permits more than one `data` chunk (concatenating writers emit them) and a `data` chunk
  // may appear before `fmt `.
  let audioBytes = 0;
  let openData = 0;
  let sawData = false;
  let complete = false;
  for (let guard = 0; guard < 200000; guard++) {
    if (offset < windowStart || offset + 8 > windowStart + window.length) {
      if (!fetchWindow) break;
      const next = fetchWindow(offset, offset + MEDIA_PROBE_BYTES - 1);
      if (!next || !next.bytes || next.bytes.length < 8) break;
      window = next.bytes;
      windowStart = offset;
      if (Number.isSafeInteger(next.total)) total = next.total;
    }
    const at = offset - windowStart;
    if (at < 0 || at + 8 > window.length) break;
    const id = ascii4(window, at);
    const size = u32le(window, at + 4);
    const data = offset + 8;
    if (id === "fmt " && at + 24 <= window.length) {
      // byteRate at body+8 is authoritative; derive it only when a streamed writer left it
      // zero, so a real value is never overridden by an estimate.
      byteRate = u32le(window, at + 16);
      if (byteRate <= 0) {
        const channels = u16le(window, at + 10);
        const rate = u32le(window, at + 12);
        const bits = u16le(window, at + 22);
        if (channels > 0 && rate > 0 && bits > 0) byteRate = rate * channels * (bits / 8);
      }
    } else if (id === "data") {
      sawData = true;
      const windowBytes = Math.max(windowStart + window.length - data, 0);
      // A streamed WAV uses 0xffffffff (or 0) for an unknown size, meaning "to the end of the
      // file"; otherwise the header states it.
      const remaining = total !== null ? Math.max(total - data, 0) : windowBytes;
      const declared = size === 0xffffffff || size === 0
        ? remaining
        : (total !== null ? Math.min(size, remaining) : size);
      if (declared > 0) {
        if (byteRate > 0) audioBytes += declared;
        else openData += declared;
      }
    }
    if (size <= 0 || size === 0xffffffff) { complete = true; break; }
    // Chunks are word-aligned: an odd size is followed by one pad byte.
    const nextOffset = data + size + (size % 2);
    if (total !== null && nextOffset >= total) { complete = true; break; }
    offset = nextOffset;
  }
  if (byteRate > 0 && openData > 0) audioBytes += openData;
  return { audioBytes: audioBytes, byteRate: byteRate, sawData: sawData, complete: complete };
}

function wavDuration(bytes, totalBytes) {
  const walked = wavWalk(bytes, totalBytes, null);
  // Any `data` chunk with a usable rate is a measurement; a file whose chunks were all
  // empty is not.
  if (!walked || !walked.sawData || !(walked.byteRate > 0) || !(walked.audioBytes > 0)) return null;
  return walked.audioBytes / walked.byteRate;
}

// MP3 gives no single reliable length field. The Xing/Info frame count is the only dependable
// source, so prefer it and otherwise report nothing: guessing from the bitrate would let a padded
// file bill more seconds than it plays.
function mp3Duration(bytes) {
  if (!bytes || bytes.length < 4) return null;
  let offset = 0;
  // Skip the ID3v2 tag. `ascii4` always returns FOUR characters, so comparing it to the
  // three-character "ID3" was never true: the branch was dead, `offset` stayed 0, and the entire
  // tag payload -- a cover image, typically -- was scanned for a frame sync.
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33 && bytes.length >= 10) {
    // A synchsafe integer has its high bit clear in every byte. If one is set the tag is malformed,
    // the size cannot be trusted, and scanning from inside it could read a crafted sync+Xing as
    // audio and bill a bogus duration (observed: 2612s from a tag payload).
    if ((bytes[6] | bytes[7] | bytes[8] | bytes[9]) & 0x80) return null;
    const size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
    offset = 10 + size;
  }
  // Locate a frame carrying Xing/Info. The scan must NOT stop at the first byte pair that merely
  // looks like a sync: an encoder may put the header on a later frame, and 0xFF 0xE0 pairs occur
  // inside ordinary payloads, so stopping there found no Xing/Info, returned null and made the
  // whole file unmeasurable -- a 78s MP3 settled at the 10s floor.
  const limit = bytes.length - 4;
  while (offset < limit) {
    // A RIFF header means this is not an MP3 at all; stop rather than scan a megabyte
    // to find nothing.
    if (bytes[offset] === 0x52 && ascii4(bytes, offset) === "RIFF") return null;
    if (bytes[offset] !== 0xff || (bytes[offset + 1] & 0xe0) !== 0xe0) { offset++; continue; }
    const versionBits = (bytes[offset + 1] >> 3) & 0x03;   // 3 = MPEG1
    const channelMode = (bytes[offset + 3] >> 6) & 0x03;   // 3 = mono
    const sampleRates = versionBits === 3 ? [44100, 48000, 32000] : versionBits === 2 ? [22050, 24000, 16000] : versionBits === 0 ? [11025, 12000, 8000] : null;
    const sampleRate = sampleRates ? sampleRates[(bytes[offset + 2] >> 2) & 0x03] : undefined;
    if (sampleRate) {
      const sideInfo = versionBits === 3 ? (channelMode === 3 ? 17 : 32) : (channelMode === 3 ? 9 : 17);
      // The protection bit (LSB of the second header byte) is 0 when the frame carries a 2-byte
      // CRC, which sits between the header and the side information.
      const crc = (bytes[offset + 1] & 0x01) === 0 ? 2 : 0;
      const xing = offset + 4 + crc + sideInfo;
      if (xing + 12 <= bytes.length) {
        const tag = ascii4(bytes, xing);
        if (tag === "Xing" || tag === "Info") {
          const flags = u32(bytes, xing + 4);
          // No frame count means no dependable length; try the next candidate rather
          // than giving up, since a later frame may carry one.
          if (flags & 0x01) {
            const frames = u32(bytes, xing + 8);
            if (frames > 0) {
              const samplesPerFrame = versionBits === 3 ? 1152 : 576;
              return frames * samplesPerFrame / sampleRate;
            }
          }
        }
      }
    }
    offset++;
  }
  return null;
}

// Dispatch on the container rather than the URL extension, because signed CDN links routinely carry
// no usable suffix and a wrong guess would misbill.
function parseAudioDuration(bytes, totalBytes) {
  if (!bytes || bytes.length === 0) return null;
  const wav = wavDuration(bytes, totalBytes);
  if (Number.isFinite(wav) && wav > 0) return wav;
  const mp3 = mp3Duration(bytes);
  return Number.isFinite(mp3) && mp3 > 0 ? mp3 : null;
}

function parseVideoDuration(bytes) {
  if (!bytes || bytes.length === 0) return null;
  const mp4 = mp4Duration(bytes);
  if (Number.isFinite(mp4) && mp4 > 0) return mp4;
  const webm = webmDuration(bytes);
  return Number.isFinite(webm) && webm > 0 ? webm : null;
}

function mediaRange(url, start, end) {
  // Callers wrap their measurements in try/catch, so exhausting the budget degrades to a
  // null measurement (a lower bound) instead of a failed hook.
  const response = budgetedFetch({ url: url, method: "GET", headers: { Range: "bytes=" + start + "-" + end }, responseType: "bytes" });
  if (!response || (response.status !== 200 && response.status !== 206)) throw new Error("media range request failed");
  const bytes = bytesView(response.body);
  if (!bytes || bytes.length > MEDIA_PROBE_BYTES) throw new Error("media range is too large");
  const contentRange = response.headers && response.headers["Content-Range"];
  const rangeMatch = typeof contentRange === "string" && contentRange.match(/\/(\d+)$/);
  const contentLength = response.headers && Number(response.headers["Content-Length"]);
  // Content-Length only describes the whole resource on a 200. On a 206 it is the size of this
  // partial body, which equals the probe length and would make the "is there more to read?" test
  // below silently false, skipping the tail read for files whose moov sits at the end.
  const total = rangeMatch
    ? Number(rangeMatch[1])
    : (response.status === 200 && Number.isSafeInteger(contentLength) ? contentLength : undefined);
  return { bytes: bytes, total: total };
}

function measuredOutputDuration(url) {
  if (typeof utils === "undefined" || typeof utils.fetch !== "function") return null;
  try {
    const head = mediaRange(url, 0, MEDIA_PROBE_END);
    let seconds = parseVideoDuration(head.bytes);
    if (seconds !== null) return seconds;
    let total = head.total;
    if (!Number.isSafeInteger(total)) {
      const response = budgetedFetch({ url: url, method: "HEAD", responseType: "bytes" });
      const value = response && response.headers && Number(response.headers["Content-Length"]);
      total = Number.isSafeInteger(value) ? value : undefined;
    }
    if (Number.isSafeInteger(total) && total > MEDIA_PROBE_BYTES) {
      const start = total - MEDIA_PROBE_BYTES;
      const tail = mediaRange(url, start, total - 1);
      seconds = parseVideoDuration(tail.bytes);
    }
    return measuredSecondsInRange(seconds);
  } catch (_) {
    return null;
  }
}

// Delivered-audio measurement for the TTS workflow. WAV states its length up front, so the head
// probe is usually enough; MP3 keeps its Xing/Info frame count in the first frame too.
function measuredAudioDuration(url) {
  if (typeof utils === "undefined" || typeof utils.fetch !== "function") return null;
  if (typeof url !== "string" || !url) return null;
  try {
    const head = mediaRange(url, 0, MEDIA_PROBE_END);
    // Establish the true size BEFORE parsing. The WAV parser needs it to clamp a declared chunk
    // size against the FILE rather than against the probe window, and doing this first means the
    // clamp is correct even when the server sent no Content-Range and the size has to come from a
    // HEAD.
    let total = head.total;
    if (!Number.isSafeInteger(total)) {
      const response = budgetedFetch({ url: url, method: "HEAD", responseType: "bytes" });
      const value = response && response.headers && Number(response.headers["Content-Length"]);
      total = Number.isSafeInteger(value) ? value : undefined;
    }
    // A RIFF file is walked chunk by chunk rather than parsed from this one window: a spliced WAV
    // puts later chunk headers beyond the window, which is exactly what under-billed it.
    if (isRiff(head.bytes)) {
      const walked = wavWalk(head.bytes, total, function (start, end) {
        if (fetchesLeft() <= 0) return null;
        try { return mediaRange(url, start, end); } catch (_) { return null; }
      });
      if (!walked || !walked.sawData || !(walked.byteRate > 0) || !(walked.audioBytes > 0)) return null;
      return measuredSecondsInRange(walked.audioBytes / walked.byteRate);
    }
    let seconds = parseAudioDuration(head.bytes, total);
    if (seconds !== null) return measuredSecondsInRange(seconds);
    if (Number.isSafeInteger(total) && total > MEDIA_PROBE_BYTES && fetchesLeft() > 0) {
      const tail = mediaRange(url, total - MEDIA_PROBE_BYTES, total - 1);
      seconds = parseAudioDuration(tail.bytes, total);
    }
    return measuredSecondsInRange(seconds);
  } catch (_) {
    return null;
  }
}

// Input media measurement for the motion-transfer workflow. The reference video decides the billed
// length, so the plugin reads its track duration itself with a bounded Range request (public URL)
// or an inline decode (data URL).
const MEASURED_INPUTS = {};
const MEASURED_INPUT_LIMIT = 64;
const DATA_VIDEO_HEADERS = ["data:video/mp4;base64", "data:video/webm;base64"];

// Decode inline base64 into bytes, capped to at most `limit` decoded bytes taken from the front, or
// from the end when `fromTail` is true.
function base64Bytes(payload, limit, fromTail) {
  const table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const clean = payload.replace(/=+$/, "");
  const groups = limit === undefined ? Math.ceil(clean.length / 4) : Math.min(Math.ceil(clean.length / 4), Math.ceil(limit / 3));
  const start = fromTail ? (Math.ceil(clean.length / 4) - groups) * 4 : 0;
  const bytes = new Uint8Array(groups * 3);
  let bits = 0, count = 0, index = 0;
  for (let i = start; i < start + groups * 4 && i < clean.length; i++) {
    const value = table.indexOf(clean[i]);
    if (value < 0) return null;
    // Keep the accumulator below 2^31 so it stays an exact integer.
    bits = (bits << 6 | value) & 0xffffff;
    count += 6;
    if (count >= 8) {
      count -= 8;
      bytes[index++] = (bits >> count) & 0xff;
    }
  }
  return index ? bytes.subarray(0, index) : null;
}

function measuredInputDuration(url) {
  if (typeof url !== "string" || !url) return null;
  if (has(MEASURED_INPUTS, url)) return MEASURED_INPUTS[url];
  let seconds = null;
  const lower = url.toLowerCase();
  const header = DATA_VIDEO_HEADERS.find(function (candidate) { return lower.startsWith(candidate + ","); });
  if (header) {
    // A local file arrives inline; nothing to fetch. Read the head first, then the tail, mirroring
    // the network path so an MP4 whose moov atom sits at the end is still measured instead of
    // falling back to an unverified declaration.
    const payload = url.slice(header.length + 1);
    try {
      seconds = parseVideoDuration(base64Bytes(payload, MEDIA_PROBE_BYTES, false));
      if (seconds === null) seconds = parseVideoDuration(base64Bytes(payload, MEDIA_PROBE_BYTES, true));
    } catch (_) { seconds = null; }
  } else if (/^https?:\/\//i.test(url) && typeof utils !== "undefined" && typeof utils.fetch === "function") {
    seconds = measuredOutputDuration(url);
  }
  if (!(typeof seconds === "number" && seconds > 1e-9 && seconds <= 3600)) seconds = null;
  if (Object.keys(MEASURED_INPUTS).length >= MEASURED_INPUT_LIMIT) for (const key of Object.keys(MEASURED_INPUTS)) delete MEASURED_INPUTS[key];
  MEASURED_INPUTS[url] = seconds;
  return seconds;
}

function inputVideoURL(config, body) {
  const fields = config.videos || [];
  for (const field of fields) {
    const value = body && body[field];
    if (typeof value === "string" && value) return value;
  }
  return "";
}

// Record the measured input length on the task state so the value survives
// polling without re-reading the media. Only the motion workflow depends on it.
function withMeasuredInput(state, config, body) {
  if (tableId(config) !== MOTION_WORKFLOW) return state;
  const url = inputVideoURL(config, body);
  if (!url) return state;
  const state2 = Object.assign({}, state, { inputVideoUrl: url });
  const seconds = measuredInputDuration(url);
  if (seconds !== null) state2.inputSeconds = seconds;
  return state2;
}

function results(body, fallbackType) {
  const payload = envelope(body).data;
  if (!Array.isArray(payload.results) || payload.results.length === 0) throw new Error("AutoDL: SUCCESS response has empty or invalid results");
  return payload.results.map(function (item) {
    if (typeof item === "string") return { url: outputMediaURL(item), type: resultMediaType(item, null, fallbackType) };
    if (!object(item)) throw new Error("AutoDL: results entry must be a URL string or an object with url");
    const url = outputMediaURL(item.url);
    const type = item.type === undefined ? resultMediaType(url, item.file_type, fallbackType) : item.type;
    if (!["video", "image", "audio", "file"].includes(type)) throw new Error("AutoDL: results contains an unsupported media type");
    const entry = { url: url, type: type };
    if (item.file_type === "mp4") entry.mimeType = "video/mp4";
    else if (item.file_type === "webm") entry.mimeType = "video/webm";
    else if (item.file_type === "wav") entry.mimeType = "audio/wav";
    else if (item.file_type === "mp3") entry.mimeType = "audio/mpeg";
    else if (item.file_type === "flac") entry.mimeType = "audio/flac";
    return entry;
  });
}

// CANCELLED/CANCELED map to FAILURE so a cancelled upstream task terminates on the next poll and
// refunds, instead of polling until the 30-minute deadline as an unknown status.
const FAILURE_STATUSES = ["FAILURE", "FAILED", "CANCELLED", "CANCELED", "ERROR", "TIMEOUT", "EXPIRED"];
function failureStatus(value) {
  const status = text(value).toUpperCase();
  return FAILURE_STATUSES.includes(status);
}

// Terminal-SUCCESS detection, case-insensitive and tolerant of the spellings a renderer may hand
// back.
const SUCCESS_STATUSES = ["SUCCESS", "SUCCEEDED", "COMPLETED"];
function successStatus(value) {
  const status = text(value).toUpperCase();
  return SUCCESS_STATUSES.includes(status);
}

const STATUSES = { QUEUED: "QUEUED", RUNNING: "IN_PROGRESS", SUCCESS: "SUCCESS", FAILED: "FAILURE", CANCELLED: "FAILURE", CANCELED: "FAILURE", completed: "SUCCESS" };
// Case-insensitive so 'Canceled', 'cancelled' and 'Failed' are terminal too;
// an exact-match lookup sent them to UNKNOWN and polled to the deadline.
function mappedStatus(value) {
  const token = text(value).toLowerCase();
  for (const key of Object.keys(STATUSES)) if (key.toLowerCase() === token) return STATUSES[key];
  return "UNKNOWN";
}

function taskAction(config, input) {
  if (object(input) && has(input, "content")) {
    const body = normalizeRequest(config, input).body;
    return config.type === "audio" ? "text_to_audio" : config.videos.some(function (key) { return has(body, key); }) ? "video_to_video" : config.input_reference.some(function (key) { return has(body, key); }) ? "image_to_video" : "text_to_video";
  }
  // decodeCompatible stores the already-normalized MiniMax body as __autodl_fields key/value pairs,
  // so the upstream slot names (ref_image_0, ref_video) are the reliable signal here;
  // input_reference/images are absent by then.
  if (object(input) && Array.isArray(input.__autodl_fields)) {
    // Read the body as it will be sent: a MiniMax alias was decoded with generic
    // slot names, and the mapped table only names its own slots at submission.
    const slots = new Set(Object.keys(normalizeRequest(config, input).body));
    if (config.type === "audio") return "text_to_audio";
    if (config.videos.some(function (key) { return slots.has(key); })) return "video_to_video";
    return config.input_reference.some(function (key) { return slots.has(key); }) ? "image_to_video" : "text_to_video";
  }
  // Read references through the same alias resolution the mapping uses, so an
  // `images` request is classified as image_to_video rather than text_to_video.
  return config.type === "audio" ? "text_to_audio" : (input.videos || []).length ? "video_to_video" : referenceURLs(referenceInput(input)).length ? "image_to_video" : "text_to_video";
}

export function buildSubmitRequest(ctx) {
  // The host's fetch budget is per hook call.
  resetFetchBudget();
  if ((ctx.files || []).length) throw new Error("AutoDL: binary uploads are not supported by this adapter; encode a standard image Data URL or use public URLs in input_reference");
  const config = requestWorkflow(ctx);
  const parsed = normalized(ctx);
  const request = {
    url: endpoint(ctx, "/api/v1/comfyui/comfyui_workflow/" + encodeURIComponent(config.workflowId)),
    method: "POST",
    action: taskAction(config, ctx.requestBody),
    headers: credentials(ctx),
    body: parsed.body,
  };
  // The MiniMax surface keeps the caller's external model name and pins the
  // resolved workflow for polling. OpenAI already carries the workflow id.
  if (object(ctx.requestBody) && has(ctx.requestBody, "__autodl_minimax")) request.rewriteModel = config.workflowId;
  return request;
}

export function parseSubmitResponse(ctx, response) {
  // The host's fetch budget is per hook call.
  resetFetchBudget();
  if (response.statusCode < 200 || response.statusCode >= 300) throw new Error(httpError(response.statusCode));
  const body = envelope(response.body);
  const id = taskId(body.data.task_id);
  const request = normalized(ctx);
  const config = requestWorkflow(ctx);
  // The vendor is already rendering, so the input measurement runs now and every
  // later poll reuses it; the submission reservation itself stays as declared.
  const state = withMeasuredInput({ facts: request.facts, type: config.type, submittedAt: utils.unixNow(), timeoutSeconds: config.timeoutSeconds, workflowId: config.workflowId, kind: config.unmapped ? "" : tableId(config) }, config, request.body);
  const parsed = parseTaskResultInner(Object.assign({}, ctx, { taskId: id, state: state }), body, { status: response.statusCode, headers: {} });
  const output = { taskId: id, taskData: body, state: state };
  if (parsed.status === "SUCCESS" || parsed.status === "FAILURE") output.immediate = parsed;
  return output;
}

export function buildQueryRequest(ctx) {
  // The host's fetch budget is per hook call.
  resetFetchBudget();
  return {
    url: endpoint(ctx, "/api/v1/comfyui/comfyui_workflow/result/" + encodeURIComponent(taskId(ctx.taskId))),
    method: "GET",
    headers: credentials(ctx),
  };
}

function parseTaskResultInner(ctx, body, response) {
  const code = response && response.status;
  if (code && (code < 200 || code >= 300)) {
    if ([400, 404, 410, 422].includes(code)) return { status: "FAILURE", reason: httpError(code) };
    throw new Error(httpError(code)); // Host increments poll failures for transient errors.
  }
  const data = envelope(body).data;
  if (data.task_id !== undefined && taskId(data.task_id) !== ctx.taskId) throw new Error("AutoDL: query response task_id does not match");
  const status = mappedStatus(data.status);
  if (status === "FAILURE") return { status: status, reason: safeReason(ctx, data.message || (object(data.error) ? data.error.message : data.error)) };
  if (status === "SUCCESS") {
    try {
      // Resolve public aliases here as well as on submission: a caller may name IndexTTS-2 or the
      // motion alias directly, and looking the name up raw made polling fail for exactly the
      // requests this plugin accepts standalone.
      const named = workflowForName(ctx.upstreamModel) || workflowForName(ctx.model);
      // A plain membership test, not workflow(): that helper throws for an unknown name, and
      // throwing here turned every poll of an unmapped private name -- the very case 1.0.13 set out
      // to support -- into a failed task.
      const config = has(WORKFLOWS, named) ? WORKFLOWS[named] : null;
      const saved = object(ctx.state) ? ctx.state : {};
      const type = config ? config.type : text(saved.type);
      if (!type) throw new Error("AutoDL: cannot determine the media type of this task");
      // Resolve a saved id through the alias table too: an unmapped private name can have been
      // saved with a public alias as its workflowId, and leaving it raw here would skip the
      // measurement branch below (recording no measuredSeconds) even though settlement would later
      // resolve it and expect one.
      const savedKind = text(saved.kind) || workflowForName(text(saved.workflowId)) || text(saved.workflowId);
      const kind = text(saved.kind) || (config && has(WORKFLOWS, config.workflowId) ? config.workflowId : savedKind);
      const outputs = results(body, type).filter(function (item) { return item.type === type; });
      if (!outputs.length) throw new Error("AutoDL: SUCCESS response contains no expected media output");
      const parsed = { status: "SUCCESS", progress: "100%", url: outputs[0].url };
      // Stock rc.43 exposes byte-range fetches only from polling hooks. Keep the declared
      // reservation for submission, then opportunistically save a bounded measurement for
      // settlement: the video track for motion transfer, the audio stream for TTS.
      if (kind === MOTION_WORKFLOW) {
        const seconds = measuredOutputDuration(outputs[0].url);
        if (seconds !== null) parsed.state = Object.assign({}, saved, { measuredSeconds: seconds });
      } else if (kind === TTS_WORKFLOW) {
        // The audio track is the only source of the billable length, so measure it here as well as
        // at settlement: this call happens while the task is still being polled, and a later hook
        // call gets a fresh fetch budget.
        const seconds = measuredAudioDuration(outputs[0].url);
        // Record the floored length, so the value saved while polling and the value billed at
        // settlement are the same number and neither undercuts the vendor minimum (see the
        // settlement note below for why the floor lives in code).
        if (seconds !== null) parsed.state = Object.assign({}, saved, { measuredSeconds: Math.max(seconds, TTS_DEFAULT_SECONDS) });
      }
      return parsed;
    } catch (error) { return { status: "FAILURE", reason: error.message }; }
  }
  const state = ctx.state;
  // Strict typeof, matching the rule this file states for the plugin runtime: if this test silently
  // failed, a stuck task would poll forever instead of hitting the deadline.
  if (state && typeof state.submittedAt === "number" && typeof state.timeoutSeconds === "number" && utils.unixNow() - state.submittedAt >= state.timeoutSeconds) {
    return { status: "FAILURE", reason: "AutoDL: generation exceeded the 30-minute plugin deadline; the upstream task may still be running" };
  }
  if (status === "UNKNOWN") return { status: "UNKNOWN", reason: "AutoDL: unknown upstream task status" };
  // AutoDL has no documented numeric progress; do not invent percentages.
  return { status: status };
}

// Stock rc.43 runs this hook with the state persisted by the previous poll and adopts the state
// written by the terminal poll only afterwards, so the duration read while polling is not part of
// the hook context.
function completionStatus(result) {
  if (object(result)) return text(result.status);
  if (typeof result === "string") return text(result);
  return "";
}

// The longest clip the vendor's own pricing can plausibly describe (one hour). Used to CLAMP a
// measurement that exceeds it rather than discard it: a real 3601-second deliverable is a real
// cost, and rejecting the measurement refunded the whole task down to the vendor minimum.
const MAX_BILLABLE_SECONDS = 3600;

// The plugin runtime only reports usable numbers to strict typeof comparisons, so bound candidates
// without Number.isFinite.
function motionSecondsInRange(value) {
  return typeof value === "number" && value > 1e-9 && value <= MAX_BILLABLE_SECONDS ? value : null;
}

// A measurement is evidence about a real file, so an implausibly large one is clamped to the
// ceiling instead of being thrown away.
function measuredSecondsInRange(value) {
  if (typeof value !== "number" || !(value > 1e-9)) return null;
  return Math.min(value, MAX_BILLABLE_SECONDS);
}

// MiniMax's official query response carries an authoritative usage block: "usage":
// {"total_seconds": 5, "input_seconds": 0, "output_seconds": 5, ...} AutoDL exposes nothing
// equivalent and its top-level `duration` is render wall time, NOT video length, so only the
// official usage block is read and only as a last resort.
function upstreamDeclaredSeconds(body) {
  if (!object(body)) return null;
  const usage = object(body.usage) ? body.usage : null;
  if (!usage) return null;
  for (const candidate of [usage.total_seconds, usage.output_seconds]) {
    const seconds = motionSecondsInRange(candidate);
    if (seconds !== null) return seconds;
  }
  // The block's own seconds are required. A bare `duration` beside a usage object that lacks them
  // is still un-corroborated render wall time, and trusting it would charge a 3-minute render as
  // 196 seconds.
  return null;
}

// The host's fetch budget is per HOOK CALL, so the reset belongs to the exported entry points only.
export function parseTaskResult(ctx, body, response) {
  resetFetchBudget();
  return parseTaskResultInner(ctx, body, response);
}

export function extractUsage(ctx) {
  // The host's fetch budget is per hook call.
  resetFetchBudget();
  return normalized(ctx).facts;
}

// `body` is the raw upstream polling payload the host forwards to this hook.
export function extractUsageOnComplete(task, result, body) {
  // The host's fetch budget is per hook call.
  resetFetchBudget();
  const state = task && task.state;
  if (!object(state) || !object(state.facts)) throw new Error("AutoDL: saved generation usage is missing");
  const status = completionStatus(result);
  // One tolerant predicate for both branches below. Comparing the raw spelling to
  // "SUCCESS" skipped the measurement and the vendor floor for "success"/"succeeded".
  const succeeded = successStatus(status);
  // data.duration is processing wall time, NOT generated video seconds.
  const facts = Object.assign({}, state.facts);
  // Resolve the saved id through the alias table before branching on it. A state written with a
  // public alias -- `IndexTTS-2` rather than `indextts2-v1` -- would otherwise miss both settlement
  // branches, so the clip would never be measured and the TTS minimum would never be applied: the
  // task would settle at whatever reservation the alias happened to carry.
  const kind = text(state.kind) || (has(WORKFLOWS, state.workflowId) ? state.workflowId : (workflowForName(state.workflowId) || state.workflowId));
  if (succeeded && kind === MOTION_WORKFLOW) {
    const url = object(result) ? text(result.url) : "";
    // Reuse the full probe: the head Range read alone cannot see an MP4 whose moov atom sits after
    // the first megabyte, which is common for anything but short clips.
    const seconds = url ? measuredOutputDuration(url) : null;
    // Priority: freshest measurement of the delivered clip, then the one saved while polling, then
    // the upstream usage block. The reference clip's length is never billed.
    const settled = measuredSecondsInRange(seconds)
      || measuredSecondsInRange(state.measuredSeconds)
      || upstreamDeclaredSeconds(body);
    // The delivered file is authoritative. The caller's declaration is only the pre-charge
    // reservation and deliberately does NOT cap the bill: motion transfer has no upstream duration
    // parameter, so the declaration never reaches the vendor, and capping at it let a caller
    // declare one second, submit a ten-second reference clip and pay a tenth of the price.
    if (settled !== null) facts.seconds = settled;
    else if (motionSecondsInRange(facts.seconds) === null) facts.seconds = MOTION_DEFAULT_SECONDS;
  }
  // TTS bills per delivered audio second, and the upstream reports no duration, so the delivered
  // file is the only honest source.
  if (succeeded && kind === TTS_WORKFLOW) {
    const url = object(result) ? text(result.url) : "";
    const settled = measuredSecondsInRange(url ? measuredAudioDuration(url) : null)
      || measuredSecondsInRange(state.measuredSeconds)
      || upstreamDeclaredSeconds(body);
    if (settled !== null) facts.seconds = Math.max(settled, TTS_DEFAULT_SECONDS);
    else {
      // No measurement was available, so the saved reservation stands -- but it must still be
      // raised to the vendor minimum.
      const saved = motionSecondsInRange(facts.seconds);
      facts.seconds = saved === null ? TTS_DEFAULT_SECONDS : Math.max(saved, TTS_DEFAULT_SECONDS);
    }
  }
  // Compare the status by meaning, not by exact spelling. native.miniTask renders this plugin's own
  // FAILURE/CANCELLED as the lowercase strings "failed"/"cancelled", so matching only the internal
  // enum left a failed task on the MiniMax surface charged in full.
  if (failureStatus(status)) {
    facts.requests = 0;
    if (facts.seconds !== undefined) facts.seconds = 0;
  }
  return facts;
}

function artifacts(task) {
  // Compared through the shared tolerant predicate, matching the render hooks and settlement. A
  // lowercase "success" -- or a "succeeded" handed back by a renderer -- would otherwise list no
  // media at all.
  if (!object(task) || !successStatus(task.status)) return [];
  // "No media" is a normal empty list, not an exception: a malformed envelope, an absent or empty
  // results array, or a response that never carried one all mean there is nothing to list, and the
  // render hooks report that as such.
  let payload;
  try { payload = envelope(task.data); } catch (_) { return []; }
  if (!Array.isArray(payload.data.results) || payload.data.results.length === 0) return [];
  const items = results(task.data, task.action === "text_to_audio" ? "audio" : "video");
  const counts = {};
  return items.map(function (item) {
    counts[item.type] = (counts[item.type] || 0) + 1;
    const key = item.type + (counts[item.type] === 1 ? "" : "-" + counts[item.type]);
    return { key: key, type: item.type, mimeType: item.mimeType, url: item.url };
  });
}

export function listArtifacts(task) {
  // The host's fetch budget is per hook call.
  resetFetchBudget();
  // Deliberately NOT wrapped in a catch-all: `artifacts` already returns an empty list for a
  // success with no media, while still refusing an entry with a forbidden URL scheme.
  return artifacts(task).map(function (item) {
    const result = { key: item.key, type: item.type };
    if (item.mimeType) result.mimeType = item.mimeType;
    return result;
  });
}

export function buildContentRequest(ctx) {
  // The host's fetch budget is per hook call.
  resetFetchBudget();
  const item = artifacts({ status: "SUCCESS", data: ctx.data, action: ctx.action }).find(function (entry) { return entry.key === ctx.artifactKey; });
  if (!item) throw new Error("AutoDL: artifact not found");
  // The host always supplies clientRequest; guard it so a missing one yields a diagnosis
  // rather than a raw TypeError out of a render hook.
  const method = object(ctx.clientRequest) ? ctx.clientRequest.method : undefined;
  if (method !== "GET" && method !== "HEAD") throw new Error("AutoDL: content only supports GET and HEAD");
  // Host validates public destinations/redirects and forwards safe Range headers. Never send the
  // AutoDL token to the dynamic result/CDN host.
  return { url: item.url, method: "GET", credentialless: true };
}

function decode(ctx, pinnedModel) {
  const body = ctx.body;
  let request;
  if (body && body.kind === "json" && object(body.value)) request = copyRequest(body.value);
  else if (body && (body.kind === "multipart" || body.kind === "form")) {
    if ((body.files || []).length) throw new Error("AutoDL: binary uploads are not supported by this adapter; encode a standard image Data URL or use public URLs in input_reference");
    request = {};
    for (const key of Object.keys(body.fields || {})) {
      const values = body.fields[key];
      if (key === "input_reference" || key === "images") {
        if (!Array.isArray(values) || values.length === 0) throw new Error("AutoDL: " + key + " form field must have at least one value");
        const parse = function (value) { return JSON.parse(value); };
        try {
          // A single JSON array or a repeated field both describe the reference
          // list; a JSON string is one reference, and a bare URL is not JSON.
          request[key] = values.length === 1 ? parse(values[0]) : values.map(parse);
        } catch (_) {
          request[key] = values.length === 1 ? values[0] : values.slice();
        }
        continue;
      }
      if (!Array.isArray(values) || values.length !== 1) throw new Error("AutoDL: each form field must be provided exactly once");
      Object.defineProperty(request, key, { value: values[0], enumerable: true, configurable: true, writable: true });
      if (["audios", "videos", "emotion"].includes(key)) {
        try { request[key] = JSON.parse(values[0]); } catch (_) { throw new Error("AutoDL: media arrays and emotion in forms must be JSON encoded"); }
      }
    }
  } else throw new Error("AutoDL: JSON object or form body required");
  const model = pinnedModel || text(request.model);
  if (!model) throw new Error("AutoDL: model is required");
  request.model = model;
  // The channel-mapped workflow id means the operator already decided which workflow this name runs
  // as, so a self-chosen name is valid here even though it appears in no capability table of ours.
  const config = resolveWorkflow(ctx.upstreamModel, model);
  normalizeInput(config, request);
  const action = taskAction(config, request);
  return { kind: "submit", model: model, action: action, requestBody: request };
}

function decodeCompatible(ctx, pinnedModel) {
  const jsonBody = ctx.body && ctx.body.kind === "json" && object(ctx.body.value);
  // Anything without a MiniMax content array is the plain OpenAI surface.
  if (!(jsonBody && has(ctx.body.value, "content"))) return decode(ctx, pinnedModel);
  const request = copyRequest(ctx.body.value);
  const model = pinnedModel || text(request.model);
  if (!model) throw new Error("AutoDL: model is required");
  request.model = model;
  // The channel decides the workflow; the caller names the AutoDL workflow id, a
  // name the operator mapped to one in their own channel, or a public alias.
  const config = resolveWorkflow(ctx.upstreamModel, model);
  // Key/value pairs keep the host's recursive usage preflight from reading a
  // generated resolution enum label as a billing enum value. Facts stay explicit.
  const normalizedBody = normalizeMiniMax(config, request);
  const canonical = Object.assign({ model: model, __autodl_fields: Object.entries(normalizedBody.body) }, normalizedBody.facts);
  // The saved source lets every later hook revalidate the canonical request. It names the table
  // that validated the request (or the alias itself when no table applies yet), never a mapped
  // upstream id: submission resolves the channel mapping again from ctx.upstreamModel.
  canonical.__autodl_minimax = JSON.stringify(Object.assign({}, request, { model: config.unmapped ? config.workflowId : tableId(config) }));
  return { kind: "submit", model: model, action: taskAction(config, canonical), requestBody: canonical };
}

export const native = {
  miniCreate: function (ctx) {
    if (!(ctx.body && ctx.body.kind === "json" && object(ctx.body.value) && has(ctx.body.value, "content"))) throw new Error("AutoDL: MiniMax V2 requires a JSON object with model and content");
    return decodeCompatible(ctx);
  },
  miniCreated: function (_ctx, task) { return { task_id: object(task) ? text(task.task_id) : "" }; },
  miniTask: function (ctx, task) {
    // A render hook that throws turns a client poll into a generic 500, so a malformed
    // or absent task record becomes a structured result instead.
    if (!object(task)) return { task: { status: "failed", error: { code: "video_generation_failed", message: "AutoDL: task record is missing" } } };
    // CANCELLED/CANCELED are both terminal upstream tokens; omitting CANCELED made it render as
    // "running" so the host kept polling a dead task.
    const statuses = { NOT_START: "queued", SUBMITTED: "queued", QUEUED: "queued", IN_PROGRESS: "running", UNKNOWN: "running", SUCCESS: "succeeded", SUCCEEDED: "succeeded", COMPLETED: "succeeded", FAILURE: "failed", FAILED: "failed", CANCELLED: "cancelled", CANCELED: "cancelled", ERROR: "failed", TIMEOUT: "failed", EXPIRED: "failed" };
    // Branch on the SAME case-insensitive key the table is read with. Testing the raw
    // spelling meant a lowercase "success" rendered as succeeded with no media attached.
    const key = text(task.status).toUpperCase();
    const result = { id: task.task_id, status: statuses[key] || "running", task_type: "generation", modality: "video" };
    if (Number.isFinite(task.created_at)) result.created_at = task.created_at;
    if (Number.isFinite(task.updated_at)) result.updated_at = task.updated_at;
    if (successStatus(key)) {
      // `artifacts` throws on a success with an empty or malformed results list; that must
      // not abort the poll, and there is no media to report either way.
      let outputs = [];
      try { outputs = artifacts(task); } catch (_) { outputs = []; }
      const output = outputs.find(function (item) { return item.type === "video"; }) || outputs.find(function (item) { return item.type === "audio"; });
      if (output) {
        result.content = { url: output.url };
        result.modality = output.type;
      }
    }
    // The upstream fail_reason is free text that can quote the credential it rejected, so it is
    // redacted exactly as the OpenAI surface already redacts it.
    if (failureStatus(key)) result.error = { code: "video_generation_failed", message: safeReason(ctx, task.fail_reason) };
    // rc.41 TaskView excludes request/model/usage/private state. AutoDL's data.duration measures
    // processing time, not video duration.
    return { task: result };
  },
};

export const protocols = {
  openai_video: {
    decodeRequest: function (ctx) { return decodeCompatible(ctx, ctx.model); },
    render: function (ctx, task) {
      // A render hook that throws turns a client poll into a generic 500, so a missing or malformed
      // record becomes a structured result.
      if (!object(task)) return { error: { code: "video_generation_failed", message: "AutoDL: task record is missing" } };
      // The host supplies standard public ID/model/status/progress/timestamps.
      const result = {};
      if (successStatus(task.status)) {
        // The render view carries no `action`, so it cannot know the modality. Prefer a video
        // artifact, but fall back to whatever the task actually produced: filtering to video alone
        // and then dereferencing [0] threw on every audio-only task and wiped the results list.
        let items = [];
        try { items = artifacts(task); } catch (_) { items = []; }
        const videos = items.filter(function (item) { return item.type === "video"; });
        const outputs = videos.length ? videos : items;
        if (outputs.length) {
          result.url = outputs[0].url;
          result.results = outputs.map(function (item) { return { url: item.url, type: item.type }; });
        } else {
          result.error = { code: "video_generation_failed", message: "AutoDL: task produced no media output" };
        }
      }
      if (failureStatus(task.status)) result.error = { code: "video_generation_failed", message: safeReason(ctx, task.fail_reason) };
      return result;
    },
  },
};
