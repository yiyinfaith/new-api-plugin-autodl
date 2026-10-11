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
const MOTION_WORKFLOW = "wan2.2animate-v4-motion_retargeting";
// Channel-mapped external model name for motion transfer over OpenAI /v1/videos.
const MOTION_ALIAS = "wan2.2-animate-move";

// Motion transfer has no upstream duration control, so a caller's declaration is
// only the pre-charge reservation and settlement replaces it with the measured
// length of the delivered clip. This is the reservation used when a caller
// declares nothing, so an omitted declaration can never settle at zero seconds.
const MOTION_DEFAULT_SECONDS = 5;

// `publicModel` lets the channel-mapped motion alias reuse the motion workflow's
// capability profile while still being advertised and priced under its own name.
// It is validated as a string because Array.map would otherwise pass an index.
function usageProfile(model, publicModel) {
  const config = WORKFLOWS[model];
  const schema = Object.assign({}, REQUEST_SCHEMA);
  const facts = { requests: 1 };
  if (config.secondsField || model === MOTION_WORKFLOW) {
    schema.seconds = { type: "number", unit: "second", description: { en: "Video generation unit price", zh: "视频生成单价" } };
    facts.seconds = config.secondsField ? config.rules[config.secondsField].default : MOTION_DEFAULT_SECONDS;
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

export const meta = {
  apiVersion: 1,
  key: "autodl",
  name: "AutoDL",
  version: "1.0.12",
  author: { name: "Yiyin" },
  description: { en: "All 17 AutoDL.Art ComfyUI video and audio workflows with unified request parameters", zh: "统一参数接入 AutoDL.Art 全部 17 个 ComfyUI 视频与音频工作流" },
  icon: "text:AD",
  website: "https://autodl.art/large-model/comfyui",
  baseUrl: "https://autodl.art",
  auth: "api_key",
  // Result URLs are signed Volcengine objects. Polling uses credentialless
  // byte-range reads against this exact media host for motion duration checks.
  allowedHosts: ["cg-comfyui-prod.tos-cn-beijing.volces.com"],
  models: Object.keys(WORKFLOWS).concat([MOTION_ALIAS]),
  fetchMode: "per_task",
  // The channel-mapped OpenAI motion alias stays selectable; its OpenAI decoder
  // is unchanged.
  protocols: [{ name: "openai_video", models: VIDEO_MODELS.concat([MOTION_ALIAS]) }],
  // Only the MiniMax V2 routes are registered. Neither OpenAI (/v1/videos) nor
  // MiniMax (/v2/...) intersects a host-reserved namespace, so this plugin needs
  // no origin-proxy rewrite and runs from a single file install.
  routes: [
    { method: "POST", path: "/v2/video_generation", type: "submit", decode: "miniCreate", render: "miniCreated" },
    { method: "GET", path: "/v2/query/video_generation/:task_id", type: "query", render: "miniTask" },
  ],
  usageSchema: REQUEST_SCHEMA,
  // The channel-mapped motion alias is a public model, so it needs its own
  // profile: motion transfer bills per second of the delivered clip, exactly
  // like the workflow it resolves to. Without this the host priced the alias
  // from usageSchema alone (requests only) and its per-second expression had no
  // seconds value to read, so per-second billing silently degraded to per-request.
  usageProfiles: Object.keys(WORKFLOWS).map(usageProfile).concat([usageProfile(MOTION_WORKFLOW, MOTION_ALIAS)]),
};

function has(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }
// Smallest billable declaration. The host rounds measured seconds to whole
// seconds, but a declared value is used verbatim for the pre-charge and, when
// the output cannot be measured, for the final settlement. Without a floor a
// caller could declare 0.0001s and pay essentially nothing for a real render.
const MIN_BILLABLE_SECONDS = 1;
function billedSeconds(value, field) {
  const seconds = typeof value === "number" ? value : (typeof value === "string" && /^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(value) ? Number(value) : NaN);
  if (!Number.isFinite(seconds) || seconds < MIN_BILLABLE_SECONDS || seconds > 3600) throw new Error("AutoDL: " + field + " must be a number between " + MIN_BILLABLE_SECONDS + " and 3600 seconds");
  return seconds;
}
// The reservation for a motion-transfer request. The declaration is optional:
// upstream has no duration parameter, so it never reaches the vendor, and
// settlement bills the measured clip instead. Falling back to the default keeps
// the reservation non-zero so a caller who declares nothing still pays for a
// render whose output cannot be measured.
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
    // Bare URL strings are the New API Sora spelling of `images`; accept them so a
    // compatibility client cannot lose its picture to a type mismatch.
    if (typeof item === "string") return inputMedia(item, "image");
    if (!object(item)) throw new Error("AutoDL: input_reference must be an image_url object or an array of image_url objects; URL strings are not supported");
    if (has(item, "file_id")) throw new Error("AutoDL: this adapter only supports image_url with public HTTP(S) URLs or standard image Data URLs; file_id is not supported");
    if (!has(item, "image_url") || Object.keys(item).length !== 1) throw new Error("AutoDL: input_reference entries must contain only image_url");
    return inputMedia(item.image_url, "image");
  });
}

// OpenAI's Videos Create has no `images` field; it is the New API Sora
// compatibility spelling ([]string of URLs). Map it onto the same reference
// slots as input_reference instead of dropping it, because it carries real
// pictures that would otherwise silently become a text-only generation.
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

// Fields the OpenAI surface documents for itself plus the parameters this
// adapter adds for AutoDL capabilities OpenAI has no equivalent for.
const OPENAI_FIELDS = ["model", "prompt", "seconds", "duration", "size", "input_reference", "images", "resolution", "orientation", "audios", "videos", "seed", "emotion"];
// Accepted only so an official OpenAI client is not rejected; AutoDL has no
// counterpart for either, and neither carries media, so they are ignored.
const OPENAI_IGNORED = ["metadata", "mode", "callback_url", "extra", "user", "n", "response_format", "fps", "width", "height"];

function normalizeInput(config, input) {
  if (!object(input)) throw new Error("AutoDL: request body must be an object");
  for (const key of Object.keys(input)) {
    if (OPENAI_FIELDS.includes(key) || OPENAI_IGNORED.includes(key)) continue;
    // A prototype key is never a legitimate parameter and must not be tolerated
    // into the upstream body, even though unknown scalars now are.
    if (key === "__proto__" || key === "constructor" || key === "prototype") throw new Error("AutoDL: unsupported request field " + key);
    // A media-shaped field this adapter cannot place is refused rather than
    // dropped, so a caller never pays for a generation that lost its input.
    if (/^(image|images|input_ref|audio|video|ref_|file)/i.test(key) || object(input[key])) throw new Error("AutoDL: unsupported request field " + key + "; use input_reference, audios and videos for media");
  }
  const body = {}, facts = { requests: 1 };
  if (config.promptField) {
    const rule = config.rules[config.promptField];
    if (typeof input.prompt !== "string" || !input.prompt.trim() || input.prompt.length < (rule.min_length || 1) || input.prompt.length > rule.max_length) throw new Error("AutoDL: prompt must contain 1 to " + rule.max_length + " characters for this workflow");
    body[config.promptField] = input.prompt;
  } else if (input.prompt !== undefined) throw new Error("AutoDL: this workflow does not accept a text prompt");
  if (config.secondsField) {
    const rule = config.rules[config.secondsField];
    // `duration` is the New API spelling of `seconds`; both name the same
    // upstream control, so accept either and still reject a real conflict.
    let seconds = input.seconds === undefined ? (input.duration === undefined ? rule.default : input.duration) : input.seconds;
    seconds = numberValue(seconds, rule, "seconds");
    if (input.seconds !== undefined && input.duration !== undefined && numberValue(input.duration, rule, "seconds") !== seconds) throw new Error("AutoDL: seconds and duration conflict");
    body[config.secondsField] = seconds; facts.seconds = seconds;
  } else if (config.workflowId === MOTION_WORKFLOW) {
    // Optional: motion transfer has no upstream seconds control, so this only
    // seeds the reservation and settlement bills the measured clip instead.
    facts.seconds = motionDeclaredSeconds(input);
  } else if (input.seconds !== undefined || input.duration !== undefined) throw new Error("AutoDL: this workflow has no seconds control; duration follows the reference media or generated speech");
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

// OpenAI and MiniMax generate a validated upstream body. Native requests keep
// their JSON body separate from the read-only task/billing analysis below.
function normalizeMiniMaxBody(config, input) {
  if (!object(input)) throw new Error("AutoDL: MiniMax body must be a JSON object");
  const body = {}, facts = { requests: 1 };
  for (const key of Object.keys(input)) {
    if (!has(config.rules, key)) throw new Error("AutoDL: unsupported raw field " + key + " for this workflow");
    const rule = config.rules[key], value = input[key];
    if (["image", "audio", "video"].includes(rule.type)) body[key] = inputMedia(value, rule.type);
    else if (["integer", "number"].includes(rule.type)) body[key] = numberValue(value, rule, key);
    else if (rule.type === "boolean") {
      if (typeof value !== "boolean") throw new Error("AutoDL: " + key + " must be boolean");
      body[key] = value;
    } else if (rule.type === "enum") {
      // The official indexTTS2 example uses numeric 0 for this string enum.
      const exampleZero = key === "emo_surprised" && value === 0 && rule.options.includes("0");
      if (!rule.options.includes(value) && !exampleZero) throw new Error("AutoDL: unsupported " + key + " for this workflow");
      body[key] = value;
    } else if (["prompt", "string"].includes(rule.type)) {
      if (typeof value !== "string" || !value.trim() || value.length < (rule.min_length || 1) || (rule.max_length !== undefined && value.length > rule.max_length)) throw new Error("AutoDL: invalid " + key + " length or type for this workflow");
      body[key] = value;
    } else throw new Error("AutoDL: unsupported official rule type " + rule.type);
  }
  for (const key of Object.keys(config.rules)) {
    const rule = config.rules[key];
    if (has(body, key)) continue;
    if ([config.secondsField, "resolution", "emo_control_method"].includes(key) && rule.default !== undefined) body[key] = rule.default;
    else if (rule.required) throw new Error("AutoDL: raw field " + key + " is required for this workflow");
  }
  if (body.emo_control_method === "使用情感参考音频" && !body.emo_ref_audio) throw new Error("AutoDL: emo_ref_audio is required for reference emotion mode");
  if (config.secondsField) facts.seconds = body[config.secondsField];
  if (config.resolutions.length) {
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

// MiniMax treats every valid i2va ratio as adaptive. Plugin API v1 has no
// remote-media probe, so keep the official workflow's default direction instead
// of pretending that URL text or a caller-specified ratio is a measured size.
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
  if (!object(source) || typeof source.model !== "string" || !has(WORKFLOWS, source.model)) throw new Error("AutoDL: invalid internal MiniMax model");
  return source;
}

function requestWorkflow(ctx) {
  const model = text(ctx.upstreamModel || ctx.model), input = ctx.requestBody;
  if (object(input) && has(input, "__autodl_minimax")) {
    const source = savedMiniMax(input), config = workflow(source.model);
    if (model !== config.workflowId) throw new Error("AutoDL: internal MiniMax workflow identity conflicts");
    return config;
  }
  return workflow(model);
}

function normalizeMiniMax(config, input) {
  const scenario = miniScenario(input);
  if (scenario.reference_video && !config.videos.length) throw new Error("AutoDL: 当前 AutoDL 适配器没有对应的 reference_video workflow");
  const reserved = ["model", "content", "resolution", "duration", "audio_duration", "ratio", "seed"];
  // Documented by MiniMax but with no AutoDL counterpart. They are control
  // metadata only (no media), so accepting and ignoring them keeps an official
  // client working instead of failing its request outright.
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
      if (config.workflowId === MOTION_WORKFLOW && key === "duration") { motionSeconds = billedSeconds(input[key], "duration"); continue; }
      throw new Error("AutoDL: this workflow does not support " + key);
    }
    body[key] = input[key];
  }
  if (config.resolutions.length) {
    if (typeof input.resolution !== "string") throw new Error("AutoDL: MiniMax resolution is required for this workflow");
    let quality = has(MINIMAX_RESOLUTIONS, input.resolution) ? MINIMAX_RESOLUTIONS[input.resolution] : undefined;
    const rawChoice = config.resolutions.find(function (entry) { return entry.upstream === input.resolution; });
    if (quality === undefined) {
      // Non-MiniMax tiers retain their AutoDL spelling, including exact enum labels.
      quality = rawChoice ? rawChoice.resolution : input.resolution;
      if (Object.values(MINIMAX_RESOLUTIONS).includes(quality)) throw new Error("AutoDL: use MiniMax resolution spelling 480P, 768P or 2K");
    }
    const orientation = miniOrientation(config, input, scenario, quality);
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
  if (config.workflowId === MOTION_WORKFLOW) {
    // `duration` is optional here: it never reaches upstream, and settlement
    // bills the measured clip. Omitting it leaves the default reservation.
    normalized.facts.seconds = motionSeconds === undefined ? MOTION_DEFAULT_SECONDS : motionSeconds;
  }
  return normalized;
}

function normalizeRequest(config, input) {
  if (object(input) && has(input, "__autodl_fields")) {
    if (Object.keys(input).some(function (key) { return !["model", "__autodl_fields", "__autodl_minimax", "requests", "seconds", "resolution", "orientation"].includes(key); }) || !Array.isArray(input.__autodl_fields)) throw new Error("AutoDL: invalid internal normalized request");
    let expected, expectedFacts;
    if (has(input, "__autodl_minimax")) {
      if (typeof input.__autodl_minimax !== "string") throw new Error("AutoDL: invalid internal MiniMax source");
      const source = savedMiniMax(input);
      if (source.model !== config.workflowId) throw new Error("AutoDL: internal MiniMax workflow identity conflicts");
      const normalizedSource = normalizeMiniMax(config, source);
      expected = normalizedSource.body;
      expectedFacts = normalizedSource.facts;
    }
    const body = {};
    for (const pair of input.__autodl_fields) {
      if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== "string" || !has(config.rules, pair[0]) || has(body, pair[0])) throw new Error("AutoDL: invalid or duplicate internal AutoDL field");
      body[pair[0]] = pair[1];
    }
    const result = normalizeMiniMaxBody(config, body);
    if (expectedFacts && expectedFacts.seconds !== undefined) result.facts.seconds = expectedFacts.seconds;
    if (config.workflowId === MOTION_WORKFLOW && result.facts.seconds === undefined) throw new Error("AutoDL: motion transfer billing seconds are missing");
    if (expected) {
      if (Object.keys(result.body).length !== Object.keys(expected).length || Object.keys(expected).some(function (key) { return !has(result.body, key) || result.body[key] !== expected[key]; })) throw new Error("AutoDL: internal MiniMax fields conflict with the official request");
    }
    for (const key of ["requests", "seconds", "resolution", "orientation"]) if (has(input, key) && input[key] !== result.facts[key]) throw new Error("AutoDL: internal usage facts conflict");
    if (config.workflowId === MOTION_WORKFLOW && !has(input, "seconds")) throw new Error("AutoDL: internal motion billing seconds are missing");
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
  for (const secret of [ctx.apiKey, ctx.authHeader]) {
    if (typeof secret !== "string" || !secret) continue;
    // Only redact a credential long enough that its occurrence is unambiguous. A
    // short key (a misconfigured channel) would otherwise match ordinary words
    // and shred the diagnostic an operator needs, e.g. "error" inside
    // "upstream error: ...". Real AutoDL tokens are far longer than this.
    if (secret.length < MIN_REDACTABLE_SECRET) continue;
    message = message.split(secret).join("[redacted]");
    // An upstream may echo the credential split across escapes, quotes or line
    // breaks, which defeats a contiguous match, and the split can fall at any
    // offset. Redact every window of the secret so no partial echo survives.
    // Short windows for short secrets keep the guarantee that no window equals
    // the whole secret, which would degenerate into a whole-key replace.
    const size = Math.max(1, Math.min(8, secret.length - 1));
    const escape = function (part) { return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    const windows = {};
    for (let start = 0; start + size <= secret.length; start++) windows[secret.slice(start, start + size)] = true;
    for (const fragment of Object.keys(windows)) {
      if (fragment === secret) continue;
      message = message.replace(new RegExp(escape(fragment), "g"), "[redacted]");
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
      // A file can carry several 'vide' tracks, but only the one with a sample
      // table carries the delivered picture; sprites, posters and timed
      // metadata have none. Prefer that track and keep the longest only among
      // equals, because ranking by length alone lets an auxiliary track over-bill
      // past the real clip (and past the caller's declared ceiling).
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


function parseVideoDuration(bytes) {
  if (!bytes || bytes.length === 0) return null;
  const mp4 = mp4Duration(bytes);
  if (Number.isFinite(mp4) && mp4 > 0) return mp4;
  const webm = webmDuration(bytes);
  return Number.isFinite(webm) && webm > 0 ? webm : null;
}

function mediaRange(url, start, end) {
  const response = utils.fetch({ url: url, method: "GET", headers: { Range: "bytes=" + start + "-" + end }, responseType: "bytes" });
  if (!response || (response.status !== 200 && response.status !== 206)) throw new Error("media range request failed");
  const bytes = bytesView(response.body);
  if (!bytes || bytes.length > MEDIA_PROBE_BYTES) throw new Error("media range is too large");
  const contentRange = response.headers && response.headers["Content-Range"];
  const rangeMatch = typeof contentRange === "string" && contentRange.match(/\/(\d+)$/);
  const contentLength = response.headers && Number(response.headers["Content-Length"]);
  // Content-Length only describes the whole resource on a 200. On a 206 it is
  // the size of this partial body, which equals the probe length and would make
  // the "is there more to read?" test below silently false, skipping the tail
  // read for files whose moov sits at the end.
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
      const response = utils.fetch({ url: url, method: "HEAD", responseType: "bytes" });
      const value = response && response.headers && Number(response.headers["Content-Length"]);
      total = Number.isSafeInteger(value) ? value : undefined;
    }
    if (Number.isSafeInteger(total) && total > MEDIA_PROBE_BYTES) {
      const start = total - MEDIA_PROBE_BYTES;
      const tail = mediaRange(url, start, total - 1);
      seconds = parseVideoDuration(tail.bytes);
    }
    return motionSecondsInRange(seconds);
  } catch (_) {
    return null;
  }
}

// Input media measurement for the motion-transfer workflow. The reference video
// decides the billed length, so the plugin reads its track duration itself with a
// bounded Range request (public URL) or an inline decode (data URL). The result is
// cached per URL for the life of the plugin runtime, so the submission hook does
// the work once, while the vendor renders, and every later poll reuses it.
const MEASURED_INPUTS = {};
const MEASURED_INPUT_LIMIT = 64;
const DATA_VIDEO_HEADERS = ["data:video/mp4;base64", "data:video/webm;base64"];

// Decode inline base64 into bytes, capped to at most `limit` decoded bytes taken
// from the front, or from the end when `fromTail` is true. The cap bounds the
// decoded work, not the caller's payload, so a large inline reference is still
// measured instead of silently skipped. Base64 groups are four characters to
// three bytes, so the window is always aligned to a group boundary.
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
    // A local file arrives inline; nothing to fetch. Read the head first, then
    // the tail, mirroring the network path so an MP4 whose moov atom sits at the
    // end is still measured instead of falling back to an unverified declaration.
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
  if (config.workflowId !== MOTION_WORKFLOW) return state;
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

// CANCELLED/CANCELED map to FAILURE so a cancelled upstream task terminates on
// the next poll and refunds, instead of polling until the 30-minute deadline as
// an unknown status. extractUsageOnComplete and miniTask already treat them as
// terminal, so omitting them here was the odd one out.
// Terminal-failure detection shared by polling and settlement. Both halves of
// this file must agree: parseTaskResult maps upstream tokens to the internal
// enum, native.miniTask re-renders that enum to lowercase for the host, and the
// settlement hook is handed whichever spelling the host persisted. Enumerating
// only one vocabulary left failures billed.
const FAILURE_STATUSES = ["FAILURE", "FAILED", "CANCELLED", "CANCELED", "ERROR", "TIMEOUT", "EXPIRED"];
function failureStatus(value) {
  const status = text(value).toUpperCase();
  return FAILURE_STATUSES.includes(status);
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
  // decodeCompatible stores the already-normalized MiniMax body as
  // __autodl_fields key/value pairs, so the upstream slot names (ref_image_0,
  // ref_video) are the reliable signal here; input_reference/images are absent
  // by then. Reading only the OpenAI spellings mislabeled every reference
  // MiniMax request as text_to_video.
  if (object(input) && Array.isArray(input.__autodl_fields)) {
    const slots = new Set(input.__autodl_fields.map(function (entry) { return entry[0]; }));
    if (config.type === "audio") return "text_to_audio";
    if (config.videos.some(function (key) { return slots.has(key); })) return "video_to_video";
    return config.input_reference.some(function (key) { return slots.has(key); }) ? "image_to_video" : "text_to_video";
  }
  // Read references through the same alias resolution the mapping uses, so an
  // `images` request is classified as image_to_video rather than text_to_video.
  return config.type === "audio" ? "text_to_audio" : (input.videos || []).length ? "video_to_video" : referenceURLs(referenceInput(input)).length ? "image_to_video" : "text_to_video";
}

export function buildSubmitRequest(ctx) {
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
  if (response.statusCode < 200 || response.statusCode >= 300) throw new Error(httpError(response.statusCode));
  const body = envelope(response.body);
  const id = taskId(body.data.task_id);
  const request = normalized(ctx);
  const config = requestWorkflow(ctx);
  // The vendor is already rendering, so the input measurement runs now and every
  // later poll reuses it; the submission reservation itself stays as declared.
  const state = withMeasuredInput({ facts: request.facts, type: config.type, submittedAt: utils.unixNow(), timeoutSeconds: config.timeoutSeconds, workflowId: config.workflowId }, config, request.body);
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
  const status = mappedStatus(data.status);
  if (status === "FAILURE") return { status: status, reason: safeReason(ctx, data.message || (object(data.error) ? data.error.message : data.error)) };
  if (status === "SUCCESS") {
    try {
      const config = workflow(ctx.upstreamModel || ctx.model);
      const outputs = results(body, config.type).filter(function (item) { return item.type === config.type; });
      if (!outputs.length) throw new Error("AutoDL: SUCCESS response contains no expected media output");
      const parsed = { status: "SUCCESS", progress: "100%", url: outputs[0].url };
      // Stock rc.43 exposes byte-range fetches only from polling hooks. Keep
      // the declared reservation for submission, then opportunistically save
      // a bounded video-track measurement for motion-transfer settlement.
      if (config.workflowId === MOTION_WORKFLOW) {
        const seconds = measuredOutputDuration(outputs[0].url);
        if (seconds !== null) parsed.state = Object.assign({}, ctx.state || {}, { measuredSeconds: seconds });
      }
      return parsed;
    } catch (error) { return { status: "FAILURE", reason: error.message }; }
  }
  const state = ctx.state;
  // Strict typeof, matching the rule this file states for the plugin runtime: if
  // this test silently failed, a stuck task would poll forever instead of
  // hitting the deadline.
  if (state && typeof state.submittedAt === "number" && typeof state.timeoutSeconds === "number" && utils.unixNow() - state.submittedAt >= state.timeoutSeconds) {
    return { status: "FAILURE", reason: "AutoDL: generation exceeded the 30-minute plugin deadline; the upstream task may still be running" };
  }
  if (status === "UNKNOWN") return { status: "UNKNOWN", reason: "AutoDL: unknown upstream task status" };
  // AutoDL has no documented numeric progress; do not invent percentages.
  return { status: status };
}

// Stock rc.43 runs this hook with the state persisted by the previous poll and
// adopts the state written by the terminal poll only afterwards, so the duration
// read while polling is not part of the hook context. The completion result does
// carry the media URL and every hook call gets its own byte-range budget, so
// settlement repeats the bounded probe. The reference video was already measured
// at submission, and motion transfer renders one output second per input second,
// so the measured input length is the strongest available signal.
function completionStatus(result) {
  if (object(result)) return text(result.status);
  if (typeof result === "string") return text(result);
  return "";
}

// The plugin runtime only reports usable numbers to strict typeof comparisons,
// so bound candidates without Number.isFinite.
function motionSecondsInRange(value) {
  return typeof value === "number" && value > 1e-9 && value <= 3600 ? value : null;
}

// MiniMax's official query response carries an authoritative usage block:
//   "usage": {"total_seconds": 5, "input_seconds": 0, "output_seconds": 5, ...}
// AutoDL exposes nothing equivalent and its top-level `duration` is render wall
// time, NOT video length, so only the official usage block is read and only as
// a last resort. AutoDL therefore never reaches this, and reading `duration`
// unconditionally would bill a 3-minute render as 196 seconds.
function upstreamDeclaredSeconds(body) {
  if (!object(body)) return null;
  const usage = object(body.usage) ? body.usage : null;
  if (!usage) return null;
  for (const candidate of [usage.total_seconds, usage.output_seconds]) {
    const seconds = motionSecondsInRange(candidate);
    if (seconds !== null) return seconds;
  }
  // The block's own seconds are required. A bare `duration` beside a usage object
  // that lacks them is still un-corroborated render wall time, and trusting it
  // would charge a 3-minute render as 196 seconds. Nothing is lost by refusing:
  // MiniMax always reports total_seconds/output_seconds alongside its duration.
  return null;
}

export function extractUsage(ctx) {
  return normalized(ctx).facts;
}

// `body` is the raw upstream polling payload the host forwards to this hook.
export function extractUsageOnComplete(task, result, body) {
  const state = task && task.state;
  if (!object(state) || !object(state.facts)) throw new Error("AutoDL: saved generation usage is missing");
  const status = completionStatus(result);
  // data.duration is processing wall time, NOT generated video seconds.
  const facts = Object.assign({}, state.facts);
  if (status === "SUCCESS" && state.workflowId === MOTION_WORKFLOW) {
    const url = object(result) ? text(result.url) : "";
    // Reuse the full probe: the head Range read alone cannot see an MP4 whose
    // moov atom sits after the first megabyte, which is common for anything but
    // short clips. Calling mediaRange directly here would silently settle such a
    // file at the declared value instead of the measured one.
    const seconds = url ? measuredOutputDuration(url) : null;
    // Priority: freshest real measurement, then the value measured while
    // polling, then the reference clip the caller submitted, and only last the
    // upstream's own usage block. A measurement always wins because it
    // describes the file that was actually delivered.
    const settled = motionSecondsInRange(seconds)
      || motionSecondsInRange(state.measuredSeconds)
      || motionSecondsInRange(state.inputSeconds)
      || upstreamDeclaredSeconds(body);
    // The delivered file is authoritative. The caller's declaration is only the
    // pre-charge reservation and deliberately does NOT cap the bill: motion
    // transfer has no upstream duration parameter, so the declaration never
    // reaches the vendor, and capping at it let a caller declare one second,
    // submit a ten-second reference clip and pay a tenth of the price. A
    // declaration still acts as the reservation, so nothing here bills zero:
    // when no candidate measured anything, the reservation stands.
    if (settled !== null) facts.seconds = settled;
    else if (motionSecondsInRange(facts.seconds) === null) facts.seconds = MOTION_DEFAULT_SECONDS;
  }
  // Compare the status by meaning, not by exact spelling. native.miniTask
  // renders this plugin's own FAILURE/CANCELLED as the lowercase strings
  // "failed"/"cancelled", so matching only the internal enum left a failed task
  // on the MiniMax surface charged in full.
  if (failureStatus(status)) {
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
  const config = workflow(ctx.upstreamModel || (model === MOTION_ALIAS ? MOTION_WORKFLOW : model));
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
  // The channel decides the workflow; the caller names the AutoDL workflow id.
  const config = workflow(ctx.upstreamModel || model);
  // Key/value pairs keep the host's recursive usage preflight from reading a
  // generated resolution enum label as a billing enum value. Facts stay explicit.
  const normalizedBody = normalizeMiniMax(config, request);
  const canonical = Object.assign({ model: model, __autodl_fields: Object.entries(normalizedBody.body) }, normalizedBody.facts);
  // The saved source carries the resolved workflow id so every later poll can
  // revalidate the canonical request without re-running channel mapping.
  canonical.__autodl_minimax = JSON.stringify(Object.assign({}, request, { model: config.workflowId }));
  return { kind: "submit", model: model, action: taskAction(config, canonical), requestBody: canonical };
}

export const native = {
  miniCreate: function (ctx) {
    if (!(ctx.body && ctx.body.kind === "json" && object(ctx.body.value) && has(ctx.body.value, "content"))) throw new Error("AutoDL: MiniMax V2 requires a JSON object with model and content");
    return decodeCompatible(ctx);
  },
  miniCreated: function (_ctx, task) { return { task_id: task.task_id }; },
  miniTask: function (_ctx, task) {
    // CANCELLED/CANCELED are both terminal upstream tokens; omitting CANCELED
    // made it render as "running" so the host kept polling a dead task.
    const statuses = { NOT_START: "queued", SUBMITTED: "queued", QUEUED: "queued", IN_PROGRESS: "running", UNKNOWN: "running", SUCCESS: "succeeded", FAILURE: "failed", FAILED: "failed", CANCELLED: "cancelled", CANCELED: "cancelled", ERROR: "failed", TIMEOUT: "failed" };
    const key = text(task.status).toUpperCase();
    const result = { id: task.task_id, status: statuses[key] || "running", task_type: "generation", modality: "video" };
    if (Number.isFinite(task.created_at)) result.created_at = task.created_at;
    if (Number.isFinite(task.updated_at)) result.updated_at = task.updated_at;
    if (task.status === "SUCCESS") {
      const outputs = artifacts(task);
      const output = outputs.find(function (item) { return item.type === "video"; }) || outputs.find(function (item) { return item.type === "audio"; });
      if (output) {
        result.content = { url: output.url };
        result.modality = output.type;
      }
    }
    if (task.status === "FAILURE") result.error = { code: "video_generation_failed", message: task.fail_reason || "AutoDL: video generation failed" };
    // rc.41 TaskView excludes request/model/usage/private state. AutoDL's
    // data.duration measures processing time, not video duration. Omit fields
    // we cannot confirm instead of inventing official metadata or token usage.
    return { task: result };
  },
};

export const protocols = {
  openai_video: {
    decodeRequest: function (ctx) { return decodeCompatible(ctx, ctx.model); },
    render: function (_ctx, task) {
      // The host supplies standard public ID/model/status/progress/timestamps.
      const result = {};
      if (task.status === "SUCCESS") {
        // The render view carries no `action`, so it cannot know the modality.
        // Prefer a video artifact, but fall back to whatever the task actually
        // produced: filtering to video alone and then dereferencing [0] threw on
        // every audio-only task and wiped the results list.
        const items = artifacts(task);
        const videos = items.filter(function (item) { return item.type === "video"; });
        const outputs = videos.length ? videos : items;
        if (outputs.length) {
          result.url = outputs[0].url;
          result.results = outputs.map(function (item) { return { url: item.url, type: item.type }; });
        } else {
          result.error = { code: "video_generation_failed", message: "AutoDL: task produced no media output" };
        }
      }
      if (task.status === "FAILURE") result.error = { code: "video_generation_failed", message: task.fail_reason || "AutoDL: video generation failed" };
      return result;
    },
  },
};
