// ============================================================
// 樱色主题原创角色：小葵（Aoi）
// ------------------------------------------------------------
// 本项目原创角色，非任何既有作品角色。设计的是一位住在"时间轴"上的
// 看板娘：粉色内扣短发 + 星星发夹 + 淡紫水手领，整体圆润、低饱和。
//
// 六种表情共用同一套头身，只替换眼部 / 嘴部 / 情绪符号，保证设定统一。
// 纯 SVG，无外部资源，随包离线可用。
// ============================================================

import type { CharacterArt } from './types'

interface FaceProps {
  expression: string
}

/** 眼睛：不同表情只换眼形与高光 */
function Eyes({ expression }: FaceProps) {
  switch (expression) {
    case 'happy':
      // 弯成 ^ ^
      return (
        <g stroke="#5b3a4e" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M43 52c2.4-3.2 6.6-3.2 9 0" />
          <path d="M68 52c2.4-3.2 6.6-3.2 9 0" />
        </g>
      )
    case 'thinking':
      // 视线偏上 + 一只眼半闭
      return (
        <g>
          <ellipse cx="47" cy="49" rx="4.6" ry="5.2" fill="#4b2e40" />
          <circle cx="48.6" cy="47" r="1.5" fill="#fff" />
          <path
            d="M65 51.5c1.8-3 6.4-3.4 8.4-.8"
            stroke="#5b3a4e"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )
    case 'working':
      // 专注：眼形收紧 + 眉压低
      return (
        <g>
          <ellipse cx="47" cy="50" rx="4.2" ry="4.6" fill="#4b2e40" />
          <ellipse cx="70" cy="50" rx="4.2" ry="4.6" fill="#4b2e40" />
          <circle cx="48.4" cy="48.4" r="1.3" fill="#fff" />
          <circle cx="71.4" cy="48.4" r="1.3" fill="#fff" />
          <path
            d="M41 43.6l9 2.2M76 43.6l-9 2.2"
            stroke="#5b3a4e"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      )
    case 'error':
      // X 眼 + 汗滴交给上层符号
      return (
        <g stroke="#8b3a52" strokeWidth="2.4" strokeLinecap="round">
          <path d="M43.5 47.5l7 7M50.5 47.5l-7 7" />
          <path d="M66 47.5l7 7M73 47.5l-7 7" />
        </g>
      )
    case 'sleepy':
      // 半闭眼
      return (
        <g stroke="#5b3a4e" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M43 51.5c3-2.2 7-2.2 9.6 0" />
          <path d="M67.4 51.5c2.6-2.2 6.6-2.2 9.6 0" />
        </g>
      )
    default:
      // idle：大眼 + 双高光
      return (
        <g>
          <ellipse cx="47" cy="50" rx="5" ry="5.8" fill="#4b2e40" />
          <ellipse cx="70" cy="50" rx="5" ry="5.8" fill="#4b2e40" />
          <circle cx="45.6" cy="47.8" r="1.8" fill="#fff" />
          <circle cx="48" cy="52" r="1" fill="#ffd9e6" />
          <circle cx="68.6" cy="47.8" r="1.8" fill="#fff" />
          <circle cx="71" cy="52" r="1" fill="#ffd9e6" />
        </g>
      )
  }
}

/** 嘴：情绪主要通过嘴角方向表达 */
function Mouth({ expression }: FaceProps) {
  switch (expression) {
    case 'happy':
      return <path d="M54 59.5c2.6 3.4 9.4 3.4 12 0" stroke="#a34a63" strokeWidth="2" strokeLinecap="round" fill="none" />
    case 'error':
      return (
        <path
          d="M55 61.5c2.2-2.4 7.4-2.4 9.6 0"
          stroke="#a34a63"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )
    case 'thinking':
      return <path d="M56.5 61h7" stroke="#a34a63" strokeWidth="2" strokeLinecap="round" />
    case 'working':
      return <path d="M55.5 60.5h9" stroke="#a34a63" strokeWidth="2.4" strokeLinecap="round" />
    case 'sleepy':
      return <ellipse cx="60" cy="60.8" rx="2.6" ry="2" fill="#a34a63" />
    default:
      return <path d="M55.6 59.8c1.8 2.2 7 2.2 8.8 0" stroke="#a34a63" strokeWidth="2" strokeLinecap="round" fill="none" />
  }
}

/** 情绪符号（汗滴 / 音符 / 星星 / 进度条） */
function MoodMark({ expression }: FaceProps) {
  if (expression === 'error') {
    return (
      <path
        d="M84 36c0 3.6 2.6 5.6 4.6 5.6S93 39.6 93 36c0-2.4-4.5-7.4-4.5-7.4S84 33.6 84 36z"
        fill="#7dd3fc"
        opacity="0.9"
      />
    )
  }
  if (expression === 'sleepy') {
    // 用三条短折线画 z，避免依赖字体渲染
    return (
      <g stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
        <path d="M85 30h5l-5 4h5" fill="none" />
        <path d="M93 22h4l-4 3h4" fill="none" opacity="0.8" />
      </g>
    )
  }
  if (expression === 'thinking') {
    return (
      <g>
        <circle cx="88" cy="30" r="1.6" fill="#c4a3e0" />
        <circle cx="93" cy="24" r="2.2" fill="#d8bff0" />
        <circle cx="99" cy="17" r="2.8" fill="#eadcff" />
      </g>
    )
  }
  if (expression === 'working') {
    return (
      <g fill="#8b5cf6" opacity="0.75">
        <rect x="84" y="30" width="3" height="8" rx="1" />
        <rect x="89" y="26" width="3" height="12" rx="1" />
        <rect x="94" y="33" width="3" height="5" rx="1" />
      </g>
    )
  }
  if (expression === 'happy') {
    return (
      <path
        d="M90 22l1.8 4.2 4.4.5-3.3 3 .9 4.3-3.8-2.3-3.8 2.3.9-4.3-3.3-3 4.4-.5z"
        fill="#fbcfe8"
        stroke="#f472b6"
        strokeWidth="0.8"
      />
    )
  }
  return null
}

export const ANIME_CHARACTERS: Record<string, CharacterArt> = {
  'anime-aoi': ({ expression, className, reacting }) => (
    <svg
      viewBox="0 0 120 140"
      className={className}
      data-reacting={reacting ? 'true' : 'false'}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="aoi-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd0e4" />
          <stop offset="100%" stopColor="#f3a9c9" />
        </linearGradient>
        <linearGradient id="aoi-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efe7ff" />
          <stop offset="100%" stopColor="#d9c9f5" />
        </linearGradient>
        <radialGradient id="aoi-glow" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#ffe3f0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffe3f0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 身后柔光 */}
      <ellipse cx="60" cy="60" rx="52" ry="56" fill="url(#aoi-glow)" />

      {/* 后发 */}
      <path
        d="M26 62c-3-24 12-38 34-38s37 14 34 38c-2 16-4 26-8 34-6-8-8-18-9-28-6 6-20 8-34 3-3 10-6 18-11 25-4-9-5-19-6-34z"
        fill="url(#aoi-hair)"
      />

      {/* 身体：肩线 + 手臂 + 水手领 */}
      <path
        d="M32 140c0-21 10-31 21-35l7-3 7 3c11 4 21 14 21 35z"
        fill="url(#aoi-cloth)"
        stroke="#cbb6ef"
        strokeWidth="0.7"
      />
      {/* 左右手臂 */}
      <path d="M32 140c-1-16 3-25 11-31l6 8c-6 6-8 13-8 23z" fill="#e6dafb" />
      <path d="M88 140c1-16-3-25-11-31l-6 8c6 6 8 13 8 23z" fill="#e6dafb" />
      {/* 水手领 */}
      <path d="M48 104l12 16 12-16-6-4H54z" fill="#ffffff" opacity="0.96" />
      <path d="M48 104l12 16-3 3-11-15z" fill="#e9e2ff" opacity="0.9" />
      <path d="M72 104l-12 16 3 3 11-15z" fill="#e9e2ff" opacity="0.9" />
      {/* 领结 */}
      <path d="M60 121l-7 8 7 12 7-12z" fill="#f472b6" opacity="0.92" />
      <circle cx="60" cy="124" r="2.4" fill="#fb7185" />

      {/* 脖子 */}
      <path d="M53 87h14v13l-7 6-7-6z" fill="#f7c9a9" />

      {/* 脸 */}
      <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
      {/* 腮红 */}
      <ellipse cx="40" cy="59" rx="5.4" ry="3" fill="#ffb4c8" opacity="0.55" />
      <ellipse cx="80" cy="59" rx="5.4" ry="3" fill="#ffb4c8" opacity="0.55" />

      {/* 刘海 */}
      <path
        d="M33 47c1-16 12-26 27-26s26 10 27 26c-4-7-8-10-11-11-2 7-5 10-9 12-1-6-2-9-4-12-3 8-8 12-14 13-3-3-5-6-6-9-4 3-8 4-10 7z"
        fill="url(#aoi-hair)"
      />
      {/* 侧发 */}
      <path d="M31 45c-3 12-3 22 0 30 3-2 5-6 6-11z" fill="url(#aoi-hair)" />
      <path d="M89 45c3 12 3 22 0 30-3-2-5-6-6-11z" fill="url(#aoi-hair)" />

      {/* 星星发夹 */}
      <path
        d="M78 30l1.6 3.8 4 .4-3 2.7.8 3.9-3.4-2.1-3.4 2.1.8-3.9-3-2.7 4-.4z"
        fill="#fff1f7"
        stroke="#f472b6"
        strokeWidth="0.7"
      />

      {/* 五官 */}
      <Eyes expression={expression} />
      <Mouth expression={expression} />
      <MoodMark expression={expression} />
    </svg>
  ),
}
