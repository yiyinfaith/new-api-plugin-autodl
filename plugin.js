// New API Task Plugin API v1; synchronous and self-contained.
// WORKFLOWS is generated from all 17 official AutoDL definitions (2026-10-07).
// No channel credentials, imports, network APIs, filesystem or Node dependencies.

const WORKFLOWS = {
  "minimax_h3_z0903": {
    "workflowId": "minimax_h3_z0903",
    "name": "H3六图三音频生视频（高质量音画融合）",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5"
    ],
    "audios": [
      "ref_audio_0",
      "ref_audio_1",
      "ref_audio_2"
    ],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖(480*864)",
        "size": "480x864"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横(864*480)",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖(768*1376)",
        "size": "768x1376"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横(1376*768)",
        "size": "1376x768"
      },
      {
        "resolution": "1088p",
        "orientation": "portrait",
        "upstream": "1088p竖(1088*1920)",
        "size": "1088x1920"
      },
      {
        "resolution": "1088p",
        "orientation": "landscape",
        "upstream": "1088p横(1920*1088)",
        "size": "1920x1088"
      },
      {
        "resolution": "1440p",
        "orientation": "portrait",
        "upstream": "1440p竖(1440*2560)",
        "size": "1440x2560"
      },
      {
        "resolution": "1440p",
        "orientation": "landscape",
        "upstream": "1440p横(2560*1440)",
        "size": "2560x1440"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "string",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "ref_audio_0": {
        "type": "audio",
        "required": true,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_audio_1": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_audio_2": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖(768*1376)",
        "options": [
          "480p竖(480*864)",
          "480p横(864*480)",
          "768p竖(768*1376)",
          "768p横(1376*768)",
          "1088p竖(1088*1920)",
          "1088p横(1920*1088)",
          "1440p竖(1440*2560)",
          "1440p横(2560*1440)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 757947932117433,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_z0902": {
    "workflowId": "minimax_h3_z0902",
    "name": "H3六图生视频（多图一致性创作）",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5"
    ],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖(480*864)",
        "size": "480x864"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横(864*480)",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖(768*1376)",
        "size": "768x1376"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横(1376*768)",
        "size": "1376x768"
      },
      {
        "resolution": "1088p",
        "orientation": "portrait",
        "upstream": "1088p竖(1088*1920)",
        "size": "1088x1920"
      },
      {
        "resolution": "1088p",
        "orientation": "landscape",
        "upstream": "1088p横(1920*1088)",
        "size": "1920x1088"
      },
      {
        "resolution": "1440p",
        "orientation": "portrait",
        "upstream": "1440p竖(1440*2560)",
        "size": "1440x2560"
      },
      {
        "resolution": "1440p",
        "orientation": "landscape",
        "upstream": "1440p横(2560*1440)",
        "size": "2560x1440"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "string",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖(768*1376)",
        "options": [
          "480p竖(480*864)",
          "480p横(864*480)",
          "768p竖(768*1376)",
          "768p横(1376*768)",
          "1088p竖(1088*1920)",
          "1088p横(1920*1088)",
          "1440p竖(1440*2560)",
          "1440p横(2560*1440)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 629515677062289,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_z0901": {
    "workflowId": "minimax_h3_z0901",
    "name": "H3文生视频（高质量创意直出）",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖(480*864)",
        "size": "480x864"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横(864*480)",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖(768*1344)",
        "size": "768x1344"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横(1344*768)",
        "size": "1344x768"
      },
      {
        "resolution": "1088p",
        "orientation": "portrait",
        "upstream": "1088p竖(1088*1920)",
        "size": "1088x1920"
      },
      {
        "resolution": "1088p",
        "orientation": "landscape",
        "upstream": "1088p横(1920*1088)",
        "size": "1920x1088"
      },
      {
        "resolution": "1440p",
        "orientation": "portrait",
        "upstream": "1440p竖(1440*2560)",
        "size": "1440x2560"
      },
      {
        "resolution": "1440p",
        "orientation": "landscape",
        "upstream": "1440p横(2560*1440)",
        "size": "2560x1440"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "string",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖(768*1344)",
        "options": [
          "480p竖(480*864)",
          "480p横(864*480)",
          "768p竖(768*1344)",
          "768p横(1344*768)",
          "1088p竖(1088*1920)",
          "1088p横(1920*1088)",
          "1440p竖(1440*2560)",
          "1440p横(2560*1440)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 865339729647738,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_zm_u24": {
    "workflowId": "minimax_h3_zm_u24",
    "name": "H3多图多音频生视频(升级画质)",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5",
      "ref_image_6",
      "ref_image_7",
      "ref_image_8"
    ],
    "audios": [
      "ref_audio_0",
      "ref_audio_1",
      "ref_audio_2"
    ],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横"
      },
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖"
      },
      {
        "resolution": "480p",
        "orientation": "square",
        "upstream": "480p(1:1)"
      },
      {
        "resolution": "768p",
        "orientation": "square",
        "upstream": "768p(1:1)"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "ref_audio_0": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_audio_1": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_audio_2": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_6": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_7": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_8": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p横",
          "480p竖",
          "768p横",
          "768p竖",
          "480p(1:1)",
          "768p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 683072603085674,
        "min": 0,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_zm_u08": {
    "workflowId": "minimax_h3_zm_u08",
    "name": "H3多图多音频生视频(高速版)",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5",
      "ref_image_6",
      "ref_image_7",
      "ref_image_8"
    ],
    "audios": [
      "ref_audio_0",
      "ref_audio_1",
      "ref_audio_2"
    ],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横"
      },
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖"
      },
      {
        "resolution": "480p",
        "orientation": "square",
        "upstream": "480p(1:1)"
      },
      {
        "resolution": "768p",
        "orientation": "square",
        "upstream": "768p(1:1)"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "ref_audio_0": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_audio_1": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_audio_2": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/flac"
        ]
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_6": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_7": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_8": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p横",
          "480p竖",
          "768p横",
          "768p竖",
          "480p(1:1)",
          "768p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 806661161901022,
        "min": 0,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_b99_002": {
    "workflowId": "minimax_h3_b99_002",
    "name": "H3首尾帧生成视频",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "first_frame",
      "last_frame"
    ],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "736p",
        "orientation": "portrait",
        "upstream": "736p竖"
      },
      {
        "resolution": "736p",
        "orientation": "landscape",
        "upstream": "736p横"
      },
      {
        "resolution": "736p",
        "orientation": "square",
        "upstream": "736p(1:1)"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "first_frame": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "last_frame": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "prompt": {
        "type": "string",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "736p竖",
        "options": [
          "736p竖",
          "736p横",
          "736p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 865339729647738,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_b99_001": {
    "workflowId": "minimax_h3_b99_001",
    "name": "H3文生视频",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "736p",
        "orientation": "portrait",
        "upstream": "736p竖"
      },
      {
        "resolution": "736p",
        "orientation": "landscape",
        "upstream": "736p横"
      },
      {
        "resolution": "736p",
        "orientation": "square",
        "upstream": "736p(1:1)"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "string",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "736p竖",
        "options": [
          "736p竖",
          "736p横",
          "736p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 865339729647738,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_b99_003_12s": {
    "workflowId": "minimax_h3_b99_003_12s",
    "name": "H3多图生视频12秒",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5",
      "ref_image_6",
      "ref_image_7",
      "ref_image_8"
    ],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "736p",
        "orientation": "portrait",
        "upstream": "736p竖"
      },
      {
        "resolution": "736p",
        "orientation": "landscape",
        "upstream": "736p横"
      },
      {
        "resolution": "736p",
        "orientation": "square",
        "upstream": "736p(1:1)"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 12
      },
      "prompt": {
        "type": "string",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_6": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_7": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_8": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "736p竖",
        "options": [
          "736p竖",
          "736p横",
          "736p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 865339729647738,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "wan2.2animate-v4-motion_retargeting": {
    "workflowId": "wan2.2animate-v4-motion_retargeting",
    "name": "动作迁移",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": null,
    "secondsField": null,
    "input_reference": [
      "ref_image"
    ],
    "audios": [],
    "videos": [
      "ref_video"
    ],
    "resolutions": [
      {
        "resolution": "832p",
        "orientation": "portrait",
        "upstream": "464*832px(竖版)"
      },
      {
        "resolution": "464p",
        "orientation": "landscape",
        "upstream": "832*464px(横版)"
      }
    ],
    "rules": {
      "ref_image": {
        "type": "image",
        "required": true,
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_video": {
        "type": "video",
        "required": true,
        "accept_types": [
          "video/mp4",
          "video/webm"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "464*832px(竖版)",
        "options": [
          "464*832px(竖版)",
          "832*464px(横版)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 485581468409274,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_image_audio_to_video_v2_15s": {
    "workflowId": "minimax_h3_image_audio_to_video_v2_15s",
    "name": "H3多图多音频生视频15秒",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5",
      "ref_image_6",
      "ref_image_7",
      "ref_image_8"
    ],
    "audios": [
      "ref_audio_0",
      "ref_audio_1",
      "ref_audio_2"
    ],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖",
        "size": "480x864"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖",
        "size": "768x1344"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横",
        "size": "1344x768"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "ref_audio_0": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/mp4",
          "audio/flac"
        ]
      },
      "ref_audio_1": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/mp4",
          "audio/flac"
        ]
      },
      "ref_audio_2": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/mp4",
          "audio/flac"
        ]
      },
      "ref_image_0": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_6": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_7": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_8": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p竖",
          "768p竖",
          "480p横",
          "768p横"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 731242627237534,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_lightx2v_v5_15s": {
    "workflowId": "minimax_h3_lightx2v_v5_15s",
    "name": "H3多图生视频15秒",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5",
      "ref_image_6",
      "ref_image_7",
      "ref_image_8"
    ],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖",
        "size": "480x864"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖",
        "size": "768x1344"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横",
        "size": "1344x768"
      },
      {
        "resolution": "480p",
        "orientation": "square",
        "upstream": "480p(1:1)",
        "size": "480x480"
      },
      {
        "resolution": "768p",
        "orientation": "square",
        "upstream": "768p(1:1)",
        "size": "768x768"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 500000
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_6": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_7": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_8": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p竖",
          "768p竖",
          "480p横",
          "768p横",
          "480p(1:1)",
          "768p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 212238359716024,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_image_audio_to_video_v2": {
    "workflowId": "minimax_h3_image_audio_to_video_v2",
    "name": "H3多图多音频生视频",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5",
      "ref_image_6",
      "ref_image_7",
      "ref_image_8"
    ],
    "audios": [
      "ref_audio_0",
      "ref_audio_1",
      "ref_audio_2"
    ],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖",
        "size": "480x864"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖",
        "size": "768x1344"
      },
      {
        "resolution": "1080p",
        "orientation": "portrait",
        "upstream": "1080p竖",
        "size": "1080x1920"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横",
        "size": "1344x768"
      },
      {
        "resolution": "1080p",
        "orientation": "landscape",
        "upstream": "1080p横",
        "size": "1920x1080"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 10
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 10000
      },
      "ref_audio_0": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/mp4",
          "audio/flac"
        ]
      },
      "ref_audio_1": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/mp4",
          "audio/flac"
        ]
      },
      "ref_audio_2": {
        "type": "audio",
        "required": false,
        "default": "default_local_path:/blank.wav;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.wav",
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/mp4",
          "audio/flac"
        ]
      },
      "ref_image_0": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_6": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_7": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_8": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p竖",
          "768p竖",
          "1080p竖",
          "480p横",
          "768p横",
          "1080p横"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 731242627237534,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_image_audio_to_video": {
    "workflowId": "minimax_h3_image_audio_to_video",
    "name": "H3图生视频-音频同步(自动对口型)",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": null,
    "secondsField": "audio_duration",
    "input_reference": [
      "ref_image_0"
    ],
    "audios": [
      "ref_audio_0"
    ],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖",
        "size": "480x864"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖",
        "size": "768x1344"
      },
      {
        "resolution": "1080p",
        "orientation": "portrait",
        "upstream": "1080p竖",
        "size": "1080x1920"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横",
        "size": "1344x768"
      },
      {
        "resolution": "1080p",
        "orientation": "landscape",
        "upstream": "1080p横",
        "size": "1920x1080"
      }
    ],
    "rules": {
      "audio_duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "ref_audio_0": {
        "type": "audio",
        "required": true,
        "accept_types": [
          "audio/mpeg",
          "audio/wav",
          "audio/mp4",
          "audio/flac"
        ]
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p竖",
          "768p竖",
          "1080p竖",
          "480p横",
          "768p横",
          "1080p横"
        ]
      }
    }
  },
  "minimax_h3_lightx2v_v5": {
    "workflowId": "minimax_h3_lightx2v_v5",
    "name": "H3多图参考生视频",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "ref_image_0",
      "ref_image_1",
      "ref_image_2",
      "ref_image_3",
      "ref_image_4",
      "ref_image_5",
      "ref_image_6",
      "ref_image_7",
      "ref_image_8"
    ],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖",
        "size": "480x864"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖",
        "size": "768x1344"
      },
      {
        "resolution": "1080p",
        "orientation": "portrait",
        "upstream": "1080p竖",
        "size": "1080x1920"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横",
        "size": "1344x768"
      },
      {
        "resolution": "1080p",
        "orientation": "landscape",
        "upstream": "1080p横",
        "size": "1920x1080"
      },
      {
        "resolution": "480p",
        "orientation": "square",
        "upstream": "480p(1:1)",
        "size": "480x480"
      },
      {
        "resolution": "768p",
        "orientation": "square",
        "upstream": "768p(1:1)",
        "size": "768x768"
      },
      {
        "resolution": "1080p",
        "orientation": "square",
        "upstream": "1080p(1:1)",
        "size": "1080x1080"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 10
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 500000
      },
      "ref_image_0": {
        "type": "image",
        "required": true,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_1": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_2": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_3": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_4": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_5": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_6": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_7": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "ref_image_8": {
        "type": "image",
        "required": false,
        "default": "default_local_path:/blank.png;https://codewithgpu.ks3-cn-beijing.ksyuncs.com/comfyui_api/blank/blank.png",
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p竖",
          "768p竖",
          "1080p竖",
          "480p横",
          "768p横",
          "1080p横",
          "480p(1:1)",
          "768p(1:1)",
          "1080p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 212238359716024,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "minimax_h3_lightx2v_no_pic": {
    "workflowId": "minimax_h3_lightx2v_no_pic",
    "name": "H3文生视频",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖",
        "size": "480x864"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖",
        "size": "768x1344"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横",
        "size": "1344x768"
      },
      {
        "resolution": "480p",
        "orientation": "square",
        "upstream": "480p(1:1)",
        "size": "480x480"
      },
      {
        "resolution": "768p",
        "orientation": "square",
        "upstream": "768p(1:1)",
        "size": "768x768"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 200000
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p竖",
          "768p竖",
          "480p横",
          "768p横",
          "480p(1:1)",
          "768p(1:1)"
        ]
      }
    }
  },
  "minimax_h3_lightx2v": {
    "workflowId": "minimax_h3_lightx2v",
    "name": "H3首尾帧生成视频",
    "type": "video",
    "timeoutSeconds": 1800,
    "promptField": "prompt",
    "secondsField": "duration",
    "input_reference": [
      "first_frame",
      "last_frame"
    ],
    "audios": [],
    "videos": [],
    "resolutions": [
      {
        "resolution": "480p",
        "orientation": "portrait",
        "upstream": "480p竖",
        "size": "480x864"
      },
      {
        "resolution": "768p",
        "orientation": "portrait",
        "upstream": "768p竖",
        "size": "768x1344"
      },
      {
        "resolution": "480p",
        "orientation": "landscape",
        "upstream": "480p横",
        "size": "864x480"
      },
      {
        "resolution": "768p",
        "orientation": "landscape",
        "upstream": "768p横",
        "size": "1344x768"
      },
      {
        "resolution": "480p",
        "orientation": "square",
        "upstream": "480p(1:1)",
        "size": "480x480"
      },
      {
        "resolution": "768p",
        "orientation": "square",
        "upstream": "768p(1:1)",
        "size": "768x768"
      }
    ],
    "rules": {
      "duration": {
        "type": "integer",
        "required": false,
        "default": 5,
        "min": 1,
        "max": 15
      },
      "first_frame": {
        "type": "image",
        "required": true,
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "last_frame": {
        "type": "image",
        "required": true,
        "accept_types": [
          "image/jpeg",
          "image/png",
          "image/webp"
        ]
      },
      "prompt": {
        "type": "prompt",
        "required": true,
        "min_length": 1,
        "max_length": 2000000
      },
      "resolution": {
        "type": "enum",
        "required": false,
        "default": "768p竖",
        "options": [
          "480p竖",
          "768p竖",
          "480p横",
          "768p横",
          "480p(1:1)",
          "768p(1:1)"
        ]
      },
      "seed": {
        "type": "integer",
        "required": false,
        "default": 479044338007328,
        "min": 1,
        "max": 999999999999999
      }
    }
  },
  "indextts2-v1": {
    "workflowId": "indextts2-v1",
    "name": "indextts2",
    "type": "audio",
    "timeoutSeconds": 1800,
    "promptField": "prompt_text",
    "secondsField": null,
    "input_reference": [],
    "audios": [
      "prompt_simple",
      "emo_ref_audio"
    ],
    "videos": [],
    "resolutions": [],
    "rules": {
      "emo_afraid": {
        "type": "number",
        "required": false,
        "default": 0,
        "min": 0,
        "max": 1.4
      },
      "emo_angry": {
        "type": "number",
        "required": false,
        "default": 0,
        "min": 0,
        "max": 1.4
      },
      "emo_calm": {
        "type": "number",
        "required": false,
        "default": 0,
        "min": 0,
        "max": 1.4
      },
      "emo_control_method": {
        "type": "enum",
        "required": true,
        "default": "与音色参考音频相同",
        "options": [
          "与音色参考音频相同",
          "使用情感参考音频",
          "使用情感向量控制"
        ]
      },
      "emo_disgusted": {
        "type": "number",
        "required": false,
        "default": 0,
        "min": 0,
        "max": 1.4
      },
      "emo_happy": {
        "type": "number",
        "required": false,
        "default": 0,
        "min": 0,
        "max": 1.4
      },
      "emo_melancholic": {
        "type": "number",
        "required": false,
        "default": 0,
        "min": 0,
        "max": 1.4
      },
      "emo_random": {
        "type": "boolean",
        "required": false,
        "default": false
      },
      "emo_ref_audio": {
        "type": "audio",
        "required": false,
        "accept_types": [
          "audio/mpeg",
          "audio/wav"
        ]
      },
      "emo_sad": {
        "type": "number",
        "required": false,
        "default": 0,
        "min": 0,
        "max": 1.4
      },
      "emo_surprised": {
        "type": "enum",
        "required": false,
        "default": "0",
        "options": [
          "0"
        ]
      },
      "prompt_simple": {
        "type": "audio",
        "required": true,
        "accept_types": [
          "audio/mpeg",
          "audio/wav"
        ]
      },
      "prompt_text": {
        "type": "string",
        "required": true,
        "min_length": 1,
        "max_length": 2048
      }
    }
  }
};


const VIDEO_MODELS = Object.keys(WORKFLOWS).filter(function (model) { return WORKFLOWS[model].type === "video"; });
const REQUEST_SCHEMA = { requests: { type: "number", unit: "count", unitLabel: { en: "request", zh: "次" }, description: { en: "Generation request unit price", zh: "生成请求单价" } } };

function usageProfile(model) {
  const config = WORKFLOWS[model];
  const schema = Object.assign({}, REQUEST_SCHEMA);
  const facts = { requests: 1 };
  if (config.secondsField) {
    schema.seconds = { type: "number", unit: "second", description: { en: "Video generation unit price", zh: "视频生成单价" } };
    facts.seconds = config.rules[config.secondsField].default;
  }
  if (config.resolutions.length) {
    schema.resolution = { enum: Array.from(new Set(config.resolutions.map(function (entry) { return entry.resolution; }))), description: { en: "Output resolution", zh: "输出分辨率" } };
    schema.orientation = { enum: Array.from(new Set(config.resolutions.map(function (entry) { return entry.orientation; }))), description: { en: "Output orientation", zh: "输出方向" } };
    const choice = config.resolutions.find(function (entry) { return entry.upstream === config.rules.resolution.default; });
    facts.resolution = choice.resolution;
    facts.orientation = choice.orientation;
  }
  return { models: [model], schema: schema, examples: [{ label: config.name, facts: facts }] };
}

export const meta = {
  apiVersion: 1,
  key: "autodl",
  name: "AutoDL",
  version: "1.0.0",
  author: { name: "Yiyin" },
  description: { en: "All 17 AutoDL.Art ComfyUI video and audio workflows with unified request parameters", zh: "统一参数接入 AutoDL.Art 全部 17 个 ComfyUI 视频与音频工作流" },
  icon: "text:AD",
  website: "https://autodl.art/large-model/comfyui",
  baseUrl: "https://autodl.art",
  auth: "api_key",
  models: Object.keys(WORKFLOWS),
  fetchMode: "per_task",
  protocols: [{ name: "openai_video", models: VIDEO_MODELS }],
  routes: [
    { method: "POST", path: "/autodl/v1/tasks", type: "submit", decode: "create", render: "task" },
    { method: "GET", path: "/autodl/v1/tasks/:task_id", type: "query", render: "task" },
  ],
  usageSchema: REQUEST_SCHEMA,
  usageProfiles: Object.keys(WORKFLOWS).map(usageProfile),
};

function has(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }
function object(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function text(value) { return typeof value === "string" ? value.trim() : ""; }
function workflow(model) {
  if (!has(WORKFLOWS, model)) throw new Error("AutoDL: unsupported model; select one of the 17 declared models");
  return WORKFLOWS[model];
}

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
  if (config.workflowId === "minimax_h3_lightx2v_no_pic" && quality !== undefined) {
    const legacy = config.resolutions.find(function (entry) { return entry.upstream === quality; });
    if (legacy) {
      if (orientation !== undefined && orientation !== legacy.orientation) throw new Error("AutoDL: resolution and orientation conflict");
      quality = legacy.resolution;
      orientation = legacy.orientation;
    }
  }
  if (input.size !== undefined) {
    const exact = config.resolutions.find(function (entry) { return entry.size && entry.size === input.size; });
    if (!exact) throw new Error("AutoDL: unsupported size for this workflow; use its declared resolution and orientation");
    if ((quality !== undefined && quality !== exact.resolution) || (orientation !== undefined && orientation !== exact.orientation)) throw new Error("AutoDL: size, resolution and orientation conflict");
    quality = exact.resolution; orientation = exact.orientation;
  }
  quality = quality === undefined ? defaults.resolution : quality;
  orientation = orientation === undefined ? defaults.orientation : orientation;
  const selected = config.resolutions.find(function (entry) { return entry.resolution === quality && entry.orientation === orientation; });
  if (!selected) throw new Error("AutoDL: unsupported resolution/orientation combination for this workflow; check workflows.json");
  return selected;
}

function referenceURLs(value) {
  if (value === undefined) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.map(function (item) {
    if (typeof item !== "string") throw new Error("AutoDL: input_reference must be a URL string or an array of URL strings");
    if (!/^https?:\/\//i.test(item)) throw new Error("AutoDL: input_reference must contain public HTTP(S) image URLs; data URLs and local files are not supported");
    return mediaURL(item);
  });
}

function mapMedia(config, input, body, kind) {
  const values = kind === "input_reference" ? referenceURLs(input[kind]) : (input[kind] === undefined ? [] : input[kind]);
  if (!Array.isArray(values)) throw new Error("AutoDL: " + kind + " must be an array of public HTTP(S) URLs");
  const fields = config[kind];
  if (kind === "input_reference") {
    if (fields.length === 0 && has(input, kind)) throw new Error("AutoDL: this workflow does not accept input_reference");
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
    body[key] = mediaURL(value);
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
    const rule = config.rules["emo_" + key];
    if (rule.type === "boolean") {
      if (typeof emotion[key] !== "boolean") throw new Error("AutoDL: emotion.random must be boolean");
      body["emo_" + key] = emotion[key];
    } else if (rule.type === "enum") {
      const value = String(emotion[key]);
      if (!rule.options.includes(value)) throw new Error("AutoDL: emotion.surprised supports only 0 in the current official workflow");
      body["emo_" + key] = value;
    } else body["emo_" + key] = numberValue(emotion[key], rule, "emotion." + key);
  }
}

function normalizeInput(config, input) {
  if (!object(input)) throw new Error("AutoDL: request body must be an object");
  if (has(input, "images")) throw new Error("AutoDL: images is no longer supported; use input_reference as a URL string or URL string array");
  const allowed = ["model", "prompt", "seconds", "resolution", "orientation", "size", "input_reference", "audios", "videos", "seed", "emotion"];
  if (config.workflowId === "minimax_h3_lightx2v_no_pic") allowed.push("duration");
  for (const key of Object.keys(input)) if (!allowed.includes(key)) throw new Error("AutoDL: unsupported request field; use unified parameters only");
  const body = {}, facts = { requests: 1 };
  if (config.promptField) {
    const rule = config.rules[config.promptField];
    if (typeof input.prompt !== "string" || !input.prompt.trim() || input.prompt.length < (rule.min_length || 1) || input.prompt.length > rule.max_length) throw new Error("AutoDL: prompt must contain 1 to " + rule.max_length + " characters for this workflow");
    body[config.promptField] = input.prompt;
  } else if (input.prompt !== undefined) throw new Error("AutoDL: this workflow does not accept a text prompt");
  if (config.secondsField) {
    const rule = config.rules[config.secondsField];
    let seconds = input.seconds === undefined ? (input.duration === undefined ? rule.default : input.duration) : input.seconds;
    seconds = numberValue(seconds, rule, "seconds");
    if (input.duration !== undefined && numberValue(input.duration, rule, "seconds") !== seconds) throw new Error("AutoDL: seconds and duration conflict");
    body[config.secondsField] = seconds; facts.seconds = seconds;
  } else if (input.seconds !== undefined) throw new Error("AutoDL: this workflow has no seconds control; duration follows the reference media or generated speech");
  const selected = mapResolution(config, input);
  if (selected) { body.resolution = selected.upstream; facts.resolution = selected.resolution; facts.orientation = selected.orientation; }
  for (const kind of ["input_reference", "audios", "videos"]) mapMedia(config, input, body, kind);
  if (input.seed !== undefined) {
    if (!config.rules.seed) throw new Error("AutoDL: this workflow has no seed control");
    body.seed = numberValue(input.seed, config.rules.seed, "seed");
  }
  mapEmotion(config, input, body);
  return { body: body, facts: facts, type: config.type };
}

function normalized(ctx) { return normalizeInput(workflow(ctx.upstreamModel || ctx.model), ctx.requestBody); }

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

function safeReason(ctx, value) {
  let message = text(value) || "AutoDL: workflow generation failed";
  for (const secret of [ctx.apiKey, ctx.authHeader]) {
    if (typeof secret === "string" && secret) message = message.split(secret).join("[redacted]");
  }
  message = message.replace(/(?:Bearer\s+|\bsk-)[A-Za-z0-9_.\-]+/gi, "[redacted]");
  return message.replace(/[\x00-\x1f]/g, " ").slice(0, 300);
}

function mediaURL(value) {
  if (typeof value !== "string" || value !== value.trim() || /[\s\\\x00-\x1f]/.test(value) || !/^https?:\/\/[^/?#@]+(?:[/?#]|$)/i.test(value)) {
    throw new Error("AutoDL: results contains an invalid media URL");
  }
  return value;
}

function results(body, fallbackType) {
  const payload = envelope(body).data;
  if (!Array.isArray(payload.results) || payload.results.length === 0) throw new Error("AutoDL: SUCCESS response has empty or invalid results");
  return payload.results.map(function (item) {
    if (typeof item === "string") return { url: mediaURL(item), type: fallbackType };
    if (!object(item)) throw new Error("AutoDL: results entry must be a URL string or an object with url");
    const type = item.type === undefined ? fallbackType : item.type;
    if (!["video", "image", "audio", "file"].includes(type)) throw new Error("AutoDL: results contains an unsupported media type");
    const entry = { url: mediaURL(item.url), type: type };
    if (item.file_type === "mp4") entry.mimeType = "video/mp4";
    else if (item.file_type === "webm") entry.mimeType = "video/webm";
    else if (item.file_type === "wav") entry.mimeType = "audio/wav";
    else if (item.file_type === "mp3") entry.mimeType = "audio/mpeg";
    else if (item.file_type === "flac") entry.mimeType = "audio/flac";
    return entry;
  });
}

const STATUSES = { QUEUED: "QUEUED", RUNNING: "IN_PROGRESS", SUCCESS: "SUCCESS", FAILED: "FAILURE", completed: "SUCCESS" };

function taskAction(config, input) {
  return config.type === "audio" ? "text_to_audio" : (input.videos || []).length ? "video_to_video" : referenceURLs(input.input_reference).length ? "image_to_video" : "text_to_video";
}

export function buildSubmitRequest(ctx) {
  if ((ctx.files || []).length) throw new Error("AutoDL: binary uploads are not supported by this adapter; upload images to public storage and use input_reference URLs");
  const config = workflow(ctx.upstreamModel || ctx.model);
  return {
    url: endpoint(ctx, "/api/v1/comfyui/comfyui_workflow/" + encodeURIComponent(config.workflowId)),
    method: "POST",
    action: taskAction(config, ctx.requestBody),
    headers: credentials(ctx),
    body: normalized(ctx).body,
  };
}

export function parseSubmitResponse(ctx, response) {
  if (response.statusCode < 200 || response.statusCode >= 300) throw new Error(httpError(response.statusCode));
  const body = envelope(response.body);
  const id = taskId(body.data.task_id);
  const request = normalized(ctx);
  const config = workflow(ctx.upstreamModel || ctx.model);
  const state = { facts: request.facts, type: config.type, submittedAt: utils.unixNow(), timeoutSeconds: config.timeoutSeconds, workflowId: config.workflowId };
  const parsed = parseTaskResult(Object.assign({}, ctx, { taskId: id, state: state }), body, { status: response.statusCode, headers: {} });
  const output = { taskId: id, taskData: body, state: state };
  if (parsed.status === "SUCCESS" || parsed.status === "FAILURE") output.immediate = parsed;
  return output;
}

export function buildQueryRequest(ctx) {
  return {
    url: endpoint(ctx, "/api/v1/comfyui/comfyui_workflow/result/" + encodeURIComponent(taskId(ctx.taskId))),
    method: "GET",
    headers: credentials(ctx),
  };
}

export function parseTaskResult(ctx, body, response) {
  const code = response && response.status;
  if (code && (code < 200 || code >= 300)) {
    if ([400, 404, 410, 422].includes(code)) return { status: "FAILURE", reason: httpError(code) };
    throw new Error(httpError(code)); // Host increments poll failures for transient errors.
  }
  const data = envelope(body).data;
  if (data.task_id !== undefined && taskId(data.task_id) !== ctx.taskId) throw new Error("AutoDL: query response task_id does not match");
  const status = has(STATUSES, data.status) ? STATUSES[data.status] : "UNKNOWN";
  if (status === "FAILURE") return { status: status, reason: safeReason(ctx, data.message || (object(data.error) ? data.error.message : data.error)) };
  if (status === "SUCCESS") {
    try {
      const config = workflow(ctx.upstreamModel || ctx.model);
      const outputs = results(body, config.type).filter(function (item) { return item.type === config.type; });
      if (!outputs.length) throw new Error("AutoDL: SUCCESS response contains no expected media output");
      return { status: "SUCCESS", progress: "100%", url: outputs[0].url };
    } catch (error) { return { status: "FAILURE", reason: error.message }; }
  }
  const state = ctx.state;
  if (state && Number.isFinite(state.submittedAt) && Number.isFinite(state.timeoutSeconds) && utils.unixNow() - state.submittedAt >= state.timeoutSeconds) {
    return { status: "FAILURE", reason: "AutoDL: generation exceeded the 30-minute plugin deadline; the upstream task may still be running" };
  }
  if (status === "UNKNOWN") return { status: "UNKNOWN", reason: "AutoDL: unknown upstream task status" };
  // AutoDL has no documented numeric progress; do not invent percentages.
  return { status: status };
}

export function extractUsage(ctx) {
  return normalized(ctx).facts;
}

export function extractUsageOnComplete(task, result) {
  const state = task.state;
  if (!state || !object(state.facts)) throw new Error("AutoDL: saved generation usage is missing");
  // data.duration is processing wall time, NOT generated video seconds.
  const facts = Object.assign({}, state.facts);
  if (result.status === "FAILURE") {
    facts.requests = 0;
    if (facts.seconds !== undefined) facts.seconds = 0;
  }
  return facts;
}

function artifacts(task) {
  if (task.status !== "SUCCESS") return [];
  const items = results(task.data, task.action === "text_to_audio" ? "audio" : "video");
  const counts = {};
  return items.map(function (item) {
    counts[item.type] = (counts[item.type] || 0) + 1;
    const key = item.type + (counts[item.type] === 1 ? "" : "-" + counts[item.type]);
    return { key: key, type: item.type, mimeType: item.mimeType, url: item.url };
  });
}

export function listArtifacts(task) {
  return artifacts(task).map(function (item) {
    const result = { key: item.key, type: item.type };
    if (item.mimeType) result.mimeType = item.mimeType;
    return result;
  });
}

export function buildContentRequest(ctx) {
  const item = artifacts({ status: "SUCCESS", data: ctx.data, action: ctx.action }).find(function (entry) { return entry.key === ctx.artifactKey; });
  if (!item) throw new Error("AutoDL: artifact not found");
  const method = ctx.clientRequest.method;
  if (method !== "GET" && method !== "HEAD") throw new Error("AutoDL: content only supports GET and HEAD");
  // Host validates public destinations/redirects and forwards safe Range headers.
  // Never send the AutoDL token to the dynamic result/CDN host.
  // AutoDL's TOS URLs are signed for GET. The host closes the upstream body
  // after copying headers when the client requested HEAD.
  return { url: item.url, method: "GET", credentialless: true };
}

function decode(ctx, pinnedModel) {
  const body = ctx.body;
  let request;
  if (body && body.kind === "json" && object(body.value)) request = Object.assign({}, body.value);
  else if (body && (body.kind === "multipart" || body.kind === "form")) {
    if ((body.files || []).length) throw new Error("AutoDL: binary uploads are not supported by this adapter; upload images to public storage and use input_reference URLs");
    request = {};
    for (const key of Object.keys(body.fields || {})) {
      const values = body.fields[key];
      if (key === "input_reference") {
        if (!Array.isArray(values) || values.length === 0) throw new Error("AutoDL: input_reference form field must have at least one value");
        request[key] = values.length === 1 ? values[0] : values.slice();
        if (values.length === 1 && typeof values[0] === "string" && values[0].trim().startsWith("[")) {
          try { request[key] = JSON.parse(values[0]); }
          catch (_) { throw new Error("AutoDL: input_reference array in forms must be valid JSON"); }
        }
        continue;
      }
      if (!Array.isArray(values) || values.length !== 1) throw new Error("AutoDL: each form field must be provided exactly once");
      request[key] = values[0];
      if (["audios", "videos", "emotion"].includes(key)) {
        try { request[key] = JSON.parse(values[0]); } catch (_) { throw new Error("AutoDL: media arrays and emotion in forms must be JSON encoded"); }
      }
    }
  } else throw new Error("AutoDL: JSON object or form body required");
  const model = pinnedModel || text(request.model);
  if (!model) throw new Error("AutoDL: model is required");
  request.model = model;
  const config = workflow(ctx.upstreamModel || model);
  normalizeInput(config, request);
  const action = taskAction(config, request);
  return { kind: "submit", model: model, action: action, requestBody: request };
}

function renderTask(_ctx, task) {
  const result = { task_id: task.task_id, status: task.status, progress: task.progress || "", fail_reason: task.fail_reason || "", results: [] };
  if (task.status === "SUCCESS") result.results = artifacts(task).map(function (item) { return { url: item.url, type: item.type }; });
  return result;
}

export const native = {
  create: function (ctx) { return decode(ctx); },
  task: renderTask,
};

export const protocols = {
  openai_video: {
    decodeRequest: function (ctx) { return decode(ctx, ctx.model); },
    render: function (_ctx, task) {
      // The host supplies standard public ID/model/status/progress/timestamps.
      const result = {};
      if (task.status === "SUCCESS") {
        const outputs = artifacts(task).filter(function (item) { return item.type === "video"; });
        result.url = outputs[0].url;
        result.results = outputs.map(function (item) { return { url: item.url, type: item.type }; });
      }
      if (task.status === "FAILURE") result.error = { code: "video_generation_failed", message: task.fail_reason || "AutoDL: video generation failed" };
      return result;
    },
  },
};
