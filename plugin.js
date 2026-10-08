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


const MINIMAX_MODELS = ["MiniMax-H3", "MiniMax-H3-Max"];
const VIDEO_MODELS = Object.keys(WORKFLOWS).filter(function (model) { return WORKFLOWS[model].type === "video"; }).concat(MINIMAX_MODELS);
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

function officialUsageProfile(model) {
  const profile = usageProfile(model === "MiniMax-H3" ? "minimax_h3_z0901" : "minimax_h3_zm_u08");
  profile.models = [model];
  profile.schema.resolution.enum = model === "MiniMax-H3" ? ["768p", "1440p"] : ["480p", "768p"];
  profile.schema.orientation.enum = ["landscape", "portrait", "square"];
  profile.examples[0].label = model;
  return profile;
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
  models: Object.keys(WORKFLOWS).concat(MINIMAX_MODELS),
  fetchMode: "per_task",
  protocols: [{ name: "openai_video", models: VIDEO_MODELS }],
  routes: [
    { method: "POST", path: "/v2/video_generation", type: "submit", decode: "miniCreate", render: "miniCreated" },
    { method: "GET", path: "/v2/query/video_generation/:task_id", type: "query", render: "miniTask" },
    { method: "POST", path: "/api/v1/comfyui/comfyui_workflow/:workflow_id", type: "submit", decode: "rawCreate", render: "task" },
    { method: "GET", path: "/api/v1/comfyui/comfyui_workflow/result/:task_id", type: "query", render: "task" },
  ],
  usageSchema: REQUEST_SCHEMA,
  usageProfiles: Object.keys(WORKFLOWS).map(usageProfile).concat(MINIMAX_MODELS.map(officialUsageProfile)),
};

function has(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }
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
    if (!object(item)) throw new Error("AutoDL: input_reference must be an image_url object or an array of image_url objects; URL strings are not supported");
    if (has(item, "file_id")) throw new Error("AutoDL: this adapter only supports image_url with public HTTP(S) URLs; file_id is not supported");
    if (!has(item, "image_url") || Object.keys(item).length !== 1) throw new Error("AutoDL: input_reference entries must contain only image_url");
    if (typeof item.image_url !== "string" || !/^https?:\/\//i.test(item.image_url)) throw new Error("AutoDL: input_reference.image_url must be a public HTTP(S) URL; data URLs and local files are not supported");
    return mediaURL(item.image_url);
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
  if (has(input, "images")) throw new Error("AutoDL: images is no longer supported; use input_reference as an image_url object or object array");
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

// OpenAI and MiniMax generate a validated upstream body. Native requests keep
// their JSON body separate from the read-only task/billing analysis below.
function normalizeRaw(config, input) {
  if (!object(input)) throw new Error("AutoDL: raw body must be a JSON object");
  const body = {}, facts = { requests: 1 };
  for (const key of Object.keys(input)) {
    if (!has(config.rules, key)) throw new Error("AutoDL: unsupported raw field " + key + " for this workflow");
    const rule = config.rules[key], value = input[key];
    if (["image", "audio", "video"].includes(rule.type)) body[key] = mediaURL(value);
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

function analyzeNativeRequest(config, rawBody) {
  if (!object(rawBody)) throw new Error("AutoDL: native body must be a JSON object");
  const facts = { requests: 1 };
  for (const key of ["duration", "audio_duration"]) {
    if (has(rawBody, key) && !has(config.rules, key)) throw new Error("AutoDL: cannot safely bill native " + key + " for this workflow");
  }
  if (config.secondsField) {
    const key = config.secondsField, rule = config.rules[key];
    facts.seconds = numberValue(has(rawBody, key) ? rawBody[key] : rule.default, rule, key);
  }
  if (config.resolutions.length) {
    const value = has(rawBody, "resolution") ? rawBody.resolution : config.rules.resolution.default;
    const selected = config.resolutions.find(function (entry) { return entry.upstream === value; });
    if (!selected) throw new Error("AutoDL: unsupported native resolution for this workflow; cannot safely calculate billing facts");
    facts.resolution = selected.resolution; facts.orientation = selected.orientation;
  } else if (has(rawBody, "resolution")) throw new Error("AutoDL: cannot safely bill native resolution for this workflow");
  const action = config.type === "audio" ? "text_to_audio" : config.videos.some(function (key) { return has(rawBody, key); }) ? "video_to_video" : config.input_reference.some(function (key) { return has(rawBody, key); }) ? "image_to_video" : "text_to_video";
  return { facts: facts, type: config.type, action: action };
}

function savedNative(config, input) {
  if (Object.keys(input).some(function (key) { return !["model", "__autodl_native", "requests", "seconds", "resolution", "orientation"].includes(key); }) || typeof input.__autodl_native !== "string") throw new Error("AutoDL: invalid internal native request");
  if (input.model !== config.workflowId) throw new Error("AutoDL: internal native workflow identity conflicts");
  let rawBody;
  try { rawBody = JSON.parse(input.__autodl_native); } catch (_) { throw new Error("AutoDL: invalid internal native JSON source"); }
  const analysis = analyzeNativeRequest(config, rawBody);
  for (const key of ["requests", "seconds", "resolution", "orientation"]) {
    if (has(input, key) !== has(analysis.facts, key) || input[key] !== analysis.facts[key]) throw new Error("AutoDL: internal native usage facts conflict");
  }
  // Return the parsed original, never a body generated from the billing facts.
  return { body: rawBody, facts: analysis.facts, type: analysis.type, action: analysis.action };
}

const MINIMAX_RESOLUTIONS = { "480P": "480p", "768P": "768p", "2K": "1440p" };
const MINIMAX_RATIOS = { "21:9": "landscape", "16:9": "landscape", "4:3": "landscape", "1:1": "square", "3:4": "portrait", "9:16": "portrait" };

function isMiniMaxModel(model) { return MINIMAX_MODELS.includes(miniMaxModel(model)); }
function miniMaxModel(model) { return model === "MiniMax-H3-MAX" ? "MiniMax-H3-Max" : model; }

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

function officialWorkflow(model, input) {
  const scenario = miniScenario(input), maximum = model !== "MiniMax-H3";
  const resolutions = maximum ? ["480P", "768P"] : ["768P", "2K"];
  if (!resolutions.includes(input.resolution)) throw new Error("AutoDL: " + model + " resolution must be " + resolutions.join(" or "));
  if (!Number.isInteger(input.duration) || input.duration < (maximum ? 5 : 4) || input.duration > 15) throw new Error("AutoDL: " + model + " duration must be an integer from " + (maximum ? 5 : 4) + " to 15 seconds");
  if (scenario.text.length !== 1 || typeof scenario.text[0] !== "string" || !scenario.text[0].trim() || scenario.text[0].length > 7000) throw new Error("AutoDL: " + model + " requires one non-empty text item, at most 7000 characters");
  if (scenario.reference_video) throw new Error("AutoDL: 当前 AutoDL 适配器没有对应的 reference_video workflow");
  if (scenario.reference_audio > 3 || scenario.reference_image > 9) throw new Error("AutoDL: official MiniMax reference limits are 9 images and 3 audio clips");
  let selected;
  if (scenario.frames) {
    if (scenario.first_frame !== 1 || scenario.last_frame !== 1) throw new Error("AutoDL: this adapter requires both first_frame and last_frame; no single-frame AutoDL workflow is configured");
    selected = "minimax_h3_lightx2v";
  } else if (scenario.reference_image) {
    if (maximum) {
      if (!scenario.reference_audio) selected = input.duration <= 10 ? "minimax_h3_lightx2v_v5" : "minimax_h3_lightx2v_v5_15s";
      else if (input.ratio === "1:1") selected = "minimax_h3_zm_u08";
      else selected = input.duration <= 10 ? "minimax_h3_image_audio_to_video_v2" : "minimax_h3_image_audio_to_video_v2_15s";
    } else if (scenario.reference_image >= 7 || input.ratio === "1:1") selected = "minimax_h3_zm_u24";
    else selected = scenario.reference_audio ? "minimax_h3_z0903" : "minimax_h3_z0902";
  } else if (scenario.reference_audio) throw new Error("AutoDL: 当前适配器暂无对应 AutoDL workflow for reference_audio without reference_image");
  else selected = maximum ? "minimax_h3_lightx2v_no_pic" : "minimax_h3_z0901";
  const config = workflow(selected), quality = MINIMAX_RESOLUTIONS[input.resolution];
  if (!config.resolutions.some(function (entry) { return entry.resolution === quality; })) throw new Error("AutoDL: selected workflow " + selected + " cannot provide " + input.resolution + " for " + model + "; resolution will not be downgraded");
  return config;
}

function miniOrientation(config, input, scenario, quality) {
  const ratio = input.ratio;
  if (ratio !== undefined && ratio !== "adaptive" && !(typeof ratio === "string" && has(MINIMAX_RATIOS, ratio))) throw new Error("AutoDL: MiniMax ratio must be adaptive, 21:9, 16:9, 4:3, 1:1, 3:4 or 9:16");
  if (!scenario.frames && !scenario.references && (ratio === undefined || ratio === "adaptive")) throw new Error("AutoDL: MiniMax text-to-video ratio is required and cannot be adaptive");
  const defaults = config.resolutions.find(function (entry) { return entry.upstream === config.rules.resolution.default; });
  // MiniMax treats every valid i2va ratio as adaptive. Plugin API v1 has no
  // remote-media probe; keep the official workflow's default direction instead
  // of pretending that URL text or a caller-specified ratio is a measured size.
  const adaptive = scenario.frames || ratio === undefined || ratio === "adaptive";
  let orientation = adaptive ? defaults.orientation : MINIMAX_RATIOS[ratio];
  if (orientation === "square" && !config.resolutions.some(function (entry) { return entry.resolution === quality && entry.orientation === orientation; })) orientation = defaults.orientation;
  return orientation;
}

function savedMiniMax(input) {
  let source;
  try { source = JSON.parse(input.__autodl_minimax); } catch (_) { throw new Error("AutoDL: invalid internal MiniMax source"); }
  if (!object(source) || !isMiniMaxModel(source.model)) throw new Error("AutoDL: invalid internal MiniMax model");
  return source;
}

function requestWorkflow(ctx) {
  const model = miniMaxModel(ctx.upstreamModel || ctx.model), input = ctx.requestBody;
  if (object(input) && has(input, "__autodl_native")) {
    const config = workflow(model);
    if (input.model !== config.workflowId) throw new Error("AutoDL: internal native workflow identity conflicts");
    return config;
  }
  if (object(input) && has(input, "__autodl_minimax")) {
    const source = savedMiniMax(input), config = officialWorkflow(source.model, source);
    if (isMiniMaxModel(model) ? model !== source.model : model !== config.workflowId) throw new Error("AutoDL: internal MiniMax workflow identity conflicts");
    return config;
  }
  if (isMiniMaxModel(model)) {
    if (!object(input) || !has(input, "content")) throw new Error("AutoDL: official MiniMax model names require the MiniMax content format");
    return officialWorkflow(model, input);
  }
  return workflow(model);
}

function normalizeMiniMax(config, input) {
  const scenario = miniScenario(input);
  if (scenario.reference_video && !config.videos.length) throw new Error("AutoDL: 当前 AutoDL 适配器没有对应的 reference_video workflow");
  const reserved = ["model", "content", "resolution", "duration", "audio_duration", "ratio", "seed"];
  const mediaFields = config.input_reference.concat(config.audios, config.videos);
  const body = {};
  for (const key of Object.keys(input)) {
    if (reserved.includes(key)) continue;
    // Preserve AutoDL-specific controls, but never mix competing media/prompt inputs.
    if (!has(config.rules, key) || key === config.promptField || mediaFields.includes(key)) throw new Error("AutoDL: unsupported or mixed MiniMax field " + key);
    body[key] = input[key];
  }
  for (const key of ["duration", "audio_duration", "seed"]) if (has(input, key)) {
    if (!has(config.rules, key)) throw new Error("AutoDL: this workflow does not support " + key);
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
    if (!object(resource) || Object.keys(resource).length !== 1 || !has(resource, "url")) throw new Error("AutoDL: MiniMax media must contain only a public HTTP(S) url");
    const url = mediaURL(resource.url);
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
  return normalizeRaw(config, body);
}

function normalizeRequest(config, input) {
  if (object(input) && has(input, "__autodl_native")) return savedNative(config, input);
  if (object(input) && has(input, "__autodl_fields")) {
    if (Object.keys(input).some(function (key) { return !["model", "__autodl_fields", "__autodl_minimax", "requests", "seconds", "resolution", "orientation"].includes(key); }) || !Array.isArray(input.__autodl_fields)) throw new Error("AutoDL: invalid internal normalized request");
    let expected;
    if (has(input, "__autodl_minimax")) {
      if (typeof input.__autodl_minimax !== "string") throw new Error("AutoDL: invalid internal MiniMax source");
      const source = savedMiniMax(input), selected = officialWorkflow(source.model, source);
      if (selected.workflowId !== config.workflowId) throw new Error("AutoDL: internal MiniMax workflow identity conflicts");
      expected = normalizeMiniMax(config, source).body;
    }
    const body = {};
    for (const pair of input.__autodl_fields) {
      if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== "string" || !has(config.rules, pair[0]) || has(body, pair[0])) throw new Error("AutoDL: invalid or duplicate internal AutoDL field");
      body[pair[0]] = pair[1];
    }
    const result = normalizeRaw(config, body);
    if (expected) {
      if (Object.keys(result.body).length !== Object.keys(expected).length || Object.keys(expected).some(function (key) { return !has(result.body, key) || result.body[key] !== expected[key]; })) throw new Error("AutoDL: internal MiniMax fields conflict with the official request");
    }
    for (const key of ["requests", "seconds", "resolution", "orientation"]) if (has(input, key) && input[key] !== result.facts[key]) throw new Error("AutoDL: internal usage facts conflict");
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

function resultMediaType(url, fileType, fallbackType) {
  const types = { mp4: "video", webm: "video", mov: "video", m4v: "video", mkv: "video", avi: "video", wav: "audio", mp3: "audio", flac: "audio", m4a: "audio", aac: "audio", ogg: "audio", opus: "audio", png: "image", jpg: "image", jpeg: "image", webp: "image", gif: "image" };
  const extension = typeof fileType === "string" ? fileType.toLowerCase().replace(/^\./, "") : "";
  if (has(types, extension)) return types[extension];
  const match = url.split(/[?#]/)[0].toLowerCase().match(/\.([a-z0-9]+)$/);
  return match && has(types, match[1]) ? types[match[1]] : fallbackType;
}

function results(body, fallbackType) {
  const payload = envelope(body).data;
  if (!Array.isArray(payload.results) || payload.results.length === 0) throw new Error("AutoDL: SUCCESS response has empty or invalid results");
  return payload.results.map(function (item) {
    if (typeof item === "string") return { url: mediaURL(item), type: resultMediaType(item, null, fallbackType) };
    if (!object(item)) throw new Error("AutoDL: results entry must be a URL string or an object with url");
    const url = mediaURL(item.url);
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

const STATUSES = { QUEUED: "QUEUED", RUNNING: "IN_PROGRESS", SUCCESS: "SUCCESS", FAILED: "FAILURE", completed: "SUCCESS" };

function taskAction(config, input) {
  if (object(input) && has(input, "__autodl_native")) return savedNative(config, input).action;
  if (object(input) && (has(input, "content") || has(input, "__autodl_fields"))) {
    const body = normalizeRequest(config, input).body;
    return config.type === "audio" ? "text_to_audio" : config.videos.some(function (key) { return has(body, key); }) ? "video_to_video" : config.input_reference.some(function (key) { return has(body, key); }) ? "image_to_video" : "text_to_video";
  }
  return config.type === "audio" ? "text_to_audio" : (input.videos || []).length ? "video_to_video" : referenceURLs(input.input_reference).length ? "image_to_video" : "text_to_video";
}

function containsFilePlaceholder(value) {
  if (Array.isArray(value)) return value.some(containsFilePlaceholder);
  if (!object(value)) return false;
  return has(value, "__fileRef") || Object.keys(value).some(function (key) { return containsFilePlaceholder(value[key]); });
}

export function buildSubmitRequest(ctx) {
  if ((ctx.files || []).length) throw new Error("AutoDL: binary uploads are not supported by this adapter; upload images to public storage and use input_reference URLs");
  const config = requestWorkflow(ctx);
  const parsed = normalized(ctx);
  const request = {
    url: endpoint(ctx, "/api/v1/comfyui/comfyui_workflow/" + encodeURIComponent(config.workflowId)),
    method: "POST",
    action: taskAction(config, ctx.requestBody),
    headers: credentials(ctx),
    body: parsed.body,
  };
  // rc.41 expands __fileRef objects recursively. Native JSON is opaque user
  // data: send its saved JSON text when needed to bypass that host expansion.
  if (object(ctx.requestBody) && has(ctx.requestBody, "__autodl_native") && containsFilePlaceholder(parsed.body)) request.body = ctx.requestBody.__autodl_native;
  if (isMiniMaxModel(ctx.upstreamModel || ctx.model) || (object(ctx.requestBody) && has(ctx.requestBody, "__autodl_minimax"))) request.rewriteModel = config.workflowId;
  return request;
}

export function parseSubmitResponse(ctx, response) {
  if (response.statusCode < 200 || response.statusCode >= 300) throw new Error(httpError(response.statusCode));
  const body = envelope(response.body);
  const id = taskId(body.data.task_id);
  const request = normalized(ctx);
  const config = requestWorkflow(ctx);
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
  if (body && body.kind === "json" && object(body.value)) request = copyRequest(body.value);
  else if (body && (body.kind === "multipart" || body.kind === "form")) {
    if ((body.files || []).length) throw new Error("AutoDL: binary uploads are not supported by this adapter; upload images to public storage and use input_reference URLs");
    request = {};
    for (const key of Object.keys(body.fields || {})) {
      const values = body.fields[key];
      if (key === "input_reference") {
        if (!Array.isArray(values) || values.length === 0) throw new Error("AutoDL: input_reference form field must have at least one value");
        try { request[key] = values.length === 1 ? JSON.parse(values[0]) : values.map(function (value) { return JSON.parse(value); }); }
        catch (_) { throw new Error("AutoDL: input_reference in forms must be a JSON image_url object or object array"); }
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
  if (isMiniMaxModel(ctx.upstreamModel || model)) throw new Error("AutoDL: official MiniMax model names require the MiniMax content format");
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

function decodeCompatible(ctx, pinnedModel) {
  const jsonBody = ctx.body && ctx.body.kind === "json" && object(ctx.body.value);
  const candidateModel = pinnedModel || (jsonBody ? text(ctx.body.value.model) : "");
  const official = isMiniMaxModel(ctx.upstreamModel || candidateModel);
  if (!(jsonBody && (has(ctx.body.value, "content") || official))) return decode(ctx, pinnedModel);
  const request = copyRequest(ctx.body.value);
  const model = pinnedModel || text(request.model);
  if (!model) throw new Error("AutoDL: model is required");
  request.model = model;
  const machineModel = miniMaxModel(ctx.upstreamModel || model);
  const source = copyRequest(request);
  source.model = machineModel;
  if (official) {
    // Shared-model discovery must keep this provider eligible. Invalid requests
    // are revalidated by the driver before billing/HTTP, so rc.41 can return the
    // actual parameter error instead of disguising it as "no available channel".
    try {
      const config = officialWorkflow(machineModel, source);
      const canonical = canonicalRequest(model, normalizeMiniMax(config, request));
      canonical.__autodl_minimax = JSON.stringify(source);
      return { kind: "submit", model: model, action: taskAction(config, canonical), requestBody: canonical };
    } catch (_) {
      return { kind: "submit", model: model, action: "text_to_video", requestBody: { model: model, __autodl_fields: [], __autodl_minimax: JSON.stringify(source) } };
    }
  }
  const config = isMiniMaxModel(machineModel) ? officialWorkflow(machineModel, source) : workflow(machineModel);
  const canonical = canonicalRequest(model, normalizeMiniMax(config, request));
  if (isMiniMaxModel(machineModel)) canonical.__autodl_minimax = JSON.stringify(source);
  return { kind: "submit", model: model, action: taskAction(config, canonical), requestBody: canonical };
}

function canonicalRequest(model, normalized) {
  // Key/value pairs prevent the host's recursive usage preflight from treating
  // generated resolution enum labels as billing enum values. Facts stay explicit.
  return Object.assign({ model: model, __autodl_fields: Object.entries(normalized.body) }, normalized.facts);
}

function decodeRaw(ctx) {
  if (!(ctx.body && ctx.body.kind === "json" && object(ctx.body.value))) throw new Error("AutoDL: native/raw endpoint requires a JSON object");
  const model = text((ctx.params || {}).workflow_id);
  if (!model) throw new Error("AutoDL: raw endpoint requires a workflow ID in the URL");
  const config = workflow(model);
  const analysis = analyzeNativeRequest(config, ctx.body.value);
  // The host recursively scans usage field names. An opaque JSON string keeps
  // client fields (including nested lookalikes) isolated from trusted facts.
  const request = Object.assign({ model: model, __autodl_native: JSON.stringify(ctx.body.value) }, analysis.facts);
  return { kind: "submit", model: model, action: analysis.action, requestBody: request };
}

export const native = {
  create: function (ctx) { return decodeCompatible(ctx); },
  rawCreate: decodeRaw,
  task: renderTask,
  miniCreate: function (ctx) {
    if (!(ctx.body && ctx.body.kind === "json" && object(ctx.body.value) && has(ctx.body.value, "content"))) throw new Error("AutoDL: MiniMax V2 requires a JSON object with model and content");
    const value = copyRequest(ctx.body.value);
    value.model = miniMaxModel(ctx.body.value.model);
    return decodeCompatible(Object.assign({}, ctx, { body: { kind: "json", value: value } }));
  },
  miniCreated: function (_ctx, task) { return { task_id: task.task_id }; },
  miniTask: function (_ctx, task) {
    const statuses = { NOT_START: "queued", SUBMITTED: "queued", QUEUED: "queued", IN_PROGRESS: "running", UNKNOWN: "running", SUCCESS: "succeeded", FAILURE: "failed", CANCELLED: "cancelled" };
    const result = { id: task.task_id, status: statuses[task.status] || "running", task_type: "generation", modality: "video" };
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
        const outputs = artifacts(task).filter(function (item) { return item.type === "video"; });
        result.url = outputs[0].url;
        result.results = outputs.map(function (item) { return { url: item.url, type: item.type }; });
      }
      if (task.status === "FAILURE") result.error = { code: "video_generation_failed", message: task.fail_reason || "AutoDL: video generation failed" };
      return result;
    },
  },
};
