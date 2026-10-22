// ============================================================
// 00 后童年国产动画同人角色：虹猫 / 蓝兔 / 开心超人 / 喜羊羊 /
// 灰太狼 / 橙留香 / 菠萝吹雪 / 火麟飞 / 雷伊 / 洛洛 /
// 南宫问天 / 麦当
// ------------------------------------------------------------
// 原创同人风推演，非官方立绘；仅用于本地体验与风格测试。
// 统一 Q 版半身与眼型，靠发型轮廓、头饰、主色和一件道具区分。
// 渐变 id 均带角色前缀，同页渲染多个角色也不会冲突。
// ============================================================

import type { CharacterArt } from './types'

type FaceProps = { expression: string }

/** 眼睛：与另一张角色表同一套眼型，猫科角色加竖瞳 */
function Eyes({ expression, iris = '#2b2f3a', slit = false }: FaceProps & { iris?: string; slit?: boolean }) {
  switch (expression) {
    case 'happy':
      return (
        <g stroke={iris} strokeWidth="1.6" strokeLinecap="round" fill="none">
          <path d="M42.6 52c2.6-3.4 7-3.4 9.6 0" />
          <path d="M67.8 52c2.6-3.4 7-3.4 9.6 0" />
        </g>
      )
    case 'thinking':
      return (
        <g>
          <ellipse cx="47" cy="48.6" rx="5" ry="5.8" fill={iris} />
          <circle cx="45.6" cy="46.6" r="1.6" fill="#fff" opacity="0.95" />
          <path d="M67.6 51.4c1.8-3 6.2-3.2 8.6-.6" stroke={iris} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>
      )
    case 'working':
      return (
        <g>
          <ellipse cx="47" cy="50.4" rx="4.6" ry="3.6" fill={iris} />
          <ellipse cx="70" cy="50.4" rx="4.6" ry="3.6" fill={iris} />
          <circle cx="45.8" cy="49.2" r="1.2" fill="#fff" />
          <circle cx="68.8" cy="49.2" r="1.2" fill="#fff" />
          <path d="M41.4 43.6l9 2M75.6 43.6l-9 2" stroke={iris} strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
        </g>
      )
    case 'error':
      return (
        <g stroke={iris} strokeWidth="1.9" strokeLinecap="round">
          <path d="M43.5 47.5l7 7M50.5 47.5l-7 7" />
          <path d="M66 47.5l7 7M73 47.5l-7 7" />
        </g>
      )
    case 'sleepy':
      return (
        <g stroke={iris} strokeWidth="1.8" strokeLinecap="round" fill="none">
          <path d="M43 51.5c3-2.2 7-2.2 9.6 0" />
          <path d="M67.4 51.5c2.6-2.2 6.6-2.2 9.6 0" />
        </g>
      )
    default:
      return (
        <g>
          <ellipse cx="47" cy="50" rx="5" ry="5.8" fill={iris} />
          <ellipse cx="70" cy="50" rx="5" ry="5.8" fill={iris} />
          {slit && <path d="M47 45.6v8.8M70 45.6v8.8" stroke="#1f2430" strokeWidth="1.3" strokeLinecap="round" />}
          <circle cx="45.6" cy="47.6" r="1.7" fill="#fff" opacity="0.95" />
          <circle cx="48.3" cy="52" r="0.9" fill="#fff" opacity="0.5" />
          <circle cx="68.6" cy="47.6" r="1.7" fill="#fff" opacity="0.95" />
          <circle cx="71.3" cy="52" r="0.9" fill="#fff" opacity="0.5" />
        </g>
      )
  }
}

/** 嘴：开心张口笑、思考一条线、出错下撇 */
function Mouth({ expression, tone = '#96575f' }: FaceProps & { tone?: string }) {
  switch (expression) {
    case 'happy':
      return <path d="M54.5 59.4c2.6 3.2 9.4 3.2 12 0" stroke={tone} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    case 'error':
      return <path d="M55 61.4c2.2-2.4 7.4-2.4 9.6 0" stroke={tone} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    case 'thinking':
      return <path d="M56.5 61h7" stroke={tone} strokeWidth="1.4" strokeLinecap="round" />
    case 'working':
      return <path d="M55.5 60.5h9" stroke={tone} strokeWidth="1.6" strokeLinecap="round" />
    case 'sleepy':
      return <ellipse cx="60" cy="60.8" rx="2.6" ry="1.8" fill={tone} />
    default:
      return <path d="M55.6 59.8c1.8 2.2 7 2.2 8.8 0" stroke={tone} strokeWidth="1.6" strokeLinecap="round" fill="none" />
  }
}

/** 情绪符号：星芒 / 问号点 / 速度线 / 汗滴 / z */
function MoodMark({ expression, color }: FaceProps & { color: string }) {
  if (expression === 'error') {
    return (
      <path d="M90 28c0 3.4 2.5 5.4 4.4 5.4s4.4-1.6 4.4-5.4c0-2.3-4.4-7.2-4.4-7.2S90 25.7 90 28z" fill={color} opacity="0.9" />
    )
  }
  if (expression === 'sleepy') {
    return (
      <g stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85">
        <path d="M85 34h5l-5 4h5" />
        <path d="M93 25h4l-4 3.4h4" />
      </g>
    )
  }
  if (expression === 'thinking') {
    return (
      <g fill={color} opacity="0.85">
        <circle cx="89" cy="34" r="1.6" />
        <circle cx="94" cy="27" r="2" />
        <circle cx="99" cy="19" r="2.5" />
      </g>
    )
  }
  if (expression === 'working') {
    return (
      <g stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.85">
        <path d="M85 33l5-11M91 35l5-11M97 31l3-7" />
      </g>
    )
  }
  if (expression === 'happy') {
    return (
      <path d="M94 12l1.6 5.4 5.4 1.6-5.4 1.6L94 26l-1.6-5.4-5.4-1.6 5.4-1.6z" fill={color} opacity="0.95" />
    )
  }
  return null
}

export const CLASSIC_CHARACTERS: Record<string, CharacterArt> = {
  hongmao: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="hm-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="hm-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6f2ee" />
        </linearGradient>
        <radialGradient id="hm-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#hm-wash)" />

        {/* 背后的剑 */}
        <path d="M14 136L36 100" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        <path d="M30 105l10-6" stroke="#f97316" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M36 100l5-10" stroke="#0f766e" strokeWidth="3.4" strokeLinecap="round" />

        {/* 猫耳 */}
        <path d="M37 32L28 11l21 8z" fill="url(#hm-hair)" stroke="#c2410c" strokeWidth="0.8" />
        <path d="M83 32l9-21-21 8z" fill="url(#hm-hair)" stroke="#c2410c" strokeWidth="0.8" />
        <path d="M39 28l-5-11 10 6z" fill="#fff7ed" />
        <path d="M81 28l5-11-10 6z" fill="#fff7ed" />

        {/* 后发 */}
        <path d="M29 58c-2-21 12-34 31-34s33 13 31 34c-1 10-4 18-8 23-6-8-14-12-23-12s-17 4-23 12c-4-5-7-13-8-23z" fill="url(#hm-hair)" />

        {/* 白衣 + 青绿领口 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#hm-cloth)" stroke="#cbd5d1" strokeWidth="0.8" />
        <path d="M47 103l13 15 13-15" stroke="#14b8a6" strokeWidth="2.4" fill="none" />
        <path d="M34 128c0 4 1 8 3 12M86 128c0 4-1 8-3 12" stroke="#14b8a6" strokeWidth="1.2" fill="none" opacity="0.7" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />

        {/* 橙白碎发 + 青绿额带 */}
        <path d="M32 49c0-17 12-28 28-28s28 11 28 28c-6-6-12-9-18-10-2 6-5 9-9 11-1-6-3-10-5-13-3 8-9 13-16 14-3-3-5-6-6-10-4 3-7 6-9 8z" fill="url(#hm-hair)" />
        <path d="M50 38c2-7 6-11 10-13 3 6 2 11-2 15z" fill="#fff7ed" opacity="0.9" />
        <path d="M31 40c17-6 41-6 58 0" stroke="#14b8a6" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M86 38c5 1 8 4 9 7-4 0-7-1-10-3z" fill="#14b8a6" />

        <Eyes expression={expression} iris="#b45309" slit />
        <Mouth expression={expression} tone="#a34a4a" />
        <MoodMark expression={expression} color="#14b8a6" />
      </g>
    </svg>
  ),

  lantu: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="lt-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="lt-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>
        <radialGradient id="lt-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#lt-wash)" />

        {/* 冰蓝长耳 */}
        <path d="M38 42C30 30 29 8 35 4c6-4 12 8 12 26 0 6-2 10-4 12z" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="0.8" />
        <path d="M82 42c8-12 9-34 3-38-6-4-12 8-12 26 0 6 2 10 4 12z" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="0.8" />
        <path d="M39 33c-5-10-5-20-2-22 4-2 7 8 7 19z" fill="#fbcfe8" />
        <path d="M81 33c5-10 5-20 2-22-4-2-7 8-7 19z" fill="#fbcfe8" />

        {/* 蓝色长发 */}
        <path d="M27 92c-4-28 5-47 24-52 20-5 39 9 42 33 2 20 0 41-4 58-8-6-13-16-14-29-8 5-19 7-29 3-2 13-7 24-14 30-3-13-5-28-5-43z" fill="url(#lt-hair)" />

        {/* 月白侠衣 + 淡紫滚边 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#lt-robe)" stroke="#c7d2fe" strokeWidth="0.8" />
        <path d="M47 103l13 16 13-16" stroke="#a78bfa" strokeWidth="2.4" fill="none" />
        <rect x="36" y="127" width="48" height="5" rx="2" fill="#a78bfa" opacity="0.55" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffe3d3" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#f0a0b8" opacity="0.4" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#f0a0b8" opacity="0.4" />

        {/* 刘海 + 鬓发 */}
        <path d="M33 48c0-16 12-27 27-27s27 11 27 27c-8-7-17-10-27-10s-19 3-27 10z" fill="url(#lt-hair)" />
        <path d="M32 48c-4 14-4 29 0 40 4-2 7-6 8-12-2-9-3-18-1-26z" fill="url(#lt-hair)" />
        <path d="M88 48c4 14 4 29 0 40-4-2-7-6-8-12 2-9 3-18 1-26z" fill="url(#lt-hair)" />

        {/* 雪花发饰 */}
        <path d="M76 29v11M71.5 31.5l9 5M80.5 31.5l-9 5" stroke="#e0e7ff" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="76" cy="34.5" r="1.8" fill="#ffffff" stroke="#a5b4fc" strokeWidth="0.6" />

        <Eyes expression={expression} iris="#3b6ea5" />
        <Mouth expression={expression} tone="#9a5b6c" />
        <MoodMark expression={expression} color="#818cf8" />
      </g>
    </svg>
  ),

  'kaixin-chaoren': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="kx-helmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="kx-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <radialGradient id="kx-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#kx-wash)" />

        {/* 红色方形头盔 */}
        <rect x="28" y="20" width="64" height="67" rx="16" fill="url(#kx-helmet)" stroke="#991b1b" strokeWidth="0.8" />
        <rect x="34" y="26" width="52" height="55" rx="13" fill="#fca5a5" opacity="0.32" />
        <path d="M60 20v-5" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="12" r="3" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
        <circle cx="29" cy="61" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
        <circle cx="91" cy="61" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />

        {/* 圆头机械身 + 黄星胸标 */}
        <path d="M31 140c0-18 10-28 23-32h12c13 4 23 14 23 32z" fill="url(#kx-body)" stroke="#991b1b" strokeWidth="0.8" />
        <path d="M33 106c8-5 18-7 27-7s19 2 27 7" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <circle cx="41" cy="119" r="7" fill="#f87171" stroke="#991b1b" strokeWidth="0.6" />
        <circle cx="79" cy="119" r="7" fill="#f87171" stroke="#991b1b" strokeWidth="0.6" />
        <path d="M60 112l2.2 5.4 5.8.4-4.4 3.7 1.4 5.6-5-3.1-5 3.1 1.4-5.6-4.4-3.7 5.8-.4z" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffd7c2" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />

        {/* 头盔内衬的黄色颊线 */}
        <path d="M35 34c-2 12-2 24 0 35" stroke="#fde68a" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M85 34c2 12 2 24 0 35" stroke="#fde68a" strokeWidth="1.2" fill="none" opacity="0.8" />

        <Eyes expression={expression} iris="#3b2f2a" />
        <Mouth expression={expression} tone="#a34a4a" />
        <MoodMark expression={expression} color="#fbbf24" />
      </g>
    </svg>
  ),

  xiyangyang: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="xyy-wool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef2f6" />
        </linearGradient>
        <linearGradient id="xyy-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
        <radialGradient id="xyy-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#xyy-wash)" />

        {/* 一圈羊毛 */}
        <g fill="url(#xyy-wool)" stroke="#dbe3ec" strokeWidth="0.8">
          <circle cx="34" cy="34" r="11" />
          <circle cx="45" cy="24" r="12" />
          <circle cx="60" cy="21" r="13" />
          <circle cx="75" cy="24" r="12" />
          <circle cx="86" cy="34" r="11" />
          <circle cx="31" cy="47" r="9" />
          <circle cx="89" cy="47" r="9" />
        </g>

        {/* 耳朵 */}
        <ellipse cx="30" cy="59" rx="9" ry="5" fill="#fff3e4" stroke="#e2d8c9" strokeWidth="0.8" transform="rotate(-18 30 59)" />
        <ellipse cx="90" cy="59" rx="9" ry="5" fill="#fff3e4" stroke="#e2d8c9" strokeWidth="0.8" transform="rotate(18 90 59)" />

        {/* 蓝白衣 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#xyy-cloth)" stroke="#bfcfe4" strokeWidth="0.8" />
        <path d="M39 128c4 5 9 8 14 9M81 128c-4 5-9 8-14 9" stroke="#93c5fd" strokeWidth="0.8" fill="none" opacity="0.7" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f7e6d6" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#fff3e4" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#f0a0a0" opacity="0.38" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#f0a0a0" opacity="0.38" />

        {/* 羊毛刘海 */}
        <g fill="url(#xyy-wool)" stroke="#e6ebf2" strokeWidth="0.6">
          <circle cx="40" cy="38" r="7" />
          <circle cx="50" cy="31" r="7" />
          <circle cx="60" cy="29" r="7" />
          <circle cx="70" cy="31" r="7" />
          <circle cx="80" cy="38" r="7" />
        </g>

        {/* 小角：压在羊毛之上，避免被刘海吃掉 */}
        <path d="M33 26c-7-1-10-8-6-12 4-4 9-1 9 5 0 3-1 5-3 5z" fill="#fde68a" stroke="#d4a72c" strokeWidth="0.6" />
        <path d="M87 26c7-1 10-8 6-12-4-4-9-1-9 5 0 3 1 5 3 5z" fill="#fde68a" stroke="#d4a72c" strokeWidth="0.6" />

        {/* 蓝围巾 + 铃铛 */}
        <path d="M44 100c5 7 11 10 16 10s11-3 16-10l-5-3-11 5-11-5z" fill="#3b82f6" />
        <path d="M45 106c-2 8-1 14 3 18l6-4c-2-5-3-9-2-13z" fill="#60a5fa" />
        <circle cx="60" cy="108" r="4" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
        <path d="M58 108h4" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" />

        <Eyes expression={expression} iris="#2563eb" />
        <Mouth expression={expression} tone="#9a5b5b" />
        <MoodMark expression={expression} color="#3b82f6" />
      </g>
    </svg>
  ),

  huitailang: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="htl-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b6bac1" />
          <stop offset="100%" stopColor="#8f949c" />
        </linearGradient>
        <linearGradient id="htl-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="htl-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#htl-wash)" />

        {/* 灰狼耳 */}
        <path d="M37 30L27 6l22 10z" fill="url(#htl-fur)" stroke="#6b7280" strokeWidth="0.8" />
        <path d="M83 30l10-24-22 10z" fill="url(#htl-fur)" stroke="#6b7280" strokeWidth="0.8" />
        <path d="M38 26l-5-13 11 6z" fill="#4b5563" />
        <path d="M82 26l5-13-11 6z" fill="#4b5563" />

        {/* 灰毛后发 */}
        <path d="M30 56c-2-20 12-33 30-33s32 13 30 33c-2 12-6 20-10 25-6-8-12-12-20-12s-14 4-20 12c-4-5-8-13-10-25z" fill="url(#htl-fur)" />

        {/* 橙色夹克 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
        <path d="M45 102l15 14 15-14" stroke="#fde68a" strokeWidth="2" fill="none" />
        <path d="M40 124l8 6M80 124l-8 6" stroke="#b45309" strokeWidth="0.6" opacity="0.7" />
        <path d="M74 128h9v7h-9z" fill="#d97706" stroke="#fde68a" strokeWidth="0.6" strokeDasharray="2 2" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#e8ded6" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ece7e1" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.32" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.32" />

        {/* 橙色补丁帽 */}
        <path d="M31 43c0-17 13-28 29-28s29 11 29 28c-9-4-19-6-29-6s-20 2-29 6z" fill="url(#htl-hat)" stroke="#b45309" strokeWidth="0.8" />
        <rect x="29" y="38" width="62" height="6" rx="3" fill="#d97706" stroke="#b45309" strokeWidth="0.6" />
        <rect x="66" y="20" width="13" height="11" rx="1" fill="#b45309" transform="rotate(-8 72 26)" stroke="#fde68a" strokeWidth="0.6" strokeDasharray="2 2" />

        <path d="M41 46h10M69 46h10" stroke="#4b5563" strokeWidth="1.2" strokeLinecap="round" />
        <Eyes expression={expression} iris="#eab308" slit />
        <path d="M56.5 55.6h7l-3.5 4.2z" fill="#4b5563" />
        <Mouth expression={expression} tone="#8f5b52" />
        <path d="M57.5 60.8l1.6 2.6 1.4-2.6z" fill="#ffffff" stroke="#8f5b52" strokeWidth="0.4" />
        <path d="M53.5 62.6c-4 2.4-7.4 2.4-10.5 1.2M66.5 62.6c4 2.4 7.4 2.4 10.5 1.2" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <MoodMark expression={expression} color="#f59e0b" />
      </g>
    </svg>
  ),

  'cheng-liuxiang': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="clx-orange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <linearGradient id="clx-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <radialGradient id="clx-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#clx-wash)" />

        {/* 橙子头壳 + 绿叶 */}
        <circle cx="60" cy="50" r="35" fill="url(#clx-orange)" stroke="#ea580c" strokeWidth="0.8" />
        <path d="M25 50c2 8 5 14 9 19M95 50c-2 8-5 14-9 19M30 33c4-4 9-7 14-9M90 33c-4-4-9-7-14-9" stroke="#fed7aa" strokeWidth="1.4" fill="none" opacity="0.8" />
        <path d="M60 18C62 9 69 5 77 7c-2 8-8 12-17 11z" fill="url(#clx-leaf)" stroke="#15803d" strokeWidth="0.6" />
        <path d="M62 17c5-3 9-5 13-6" stroke="#166534" strokeWidth="0.6" fill="none" />
        <circle cx="60" cy="18" r="3" fill="#65a30d" />

        {/* 绿袍 + 腰带 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="#dcfce7" stroke="#86efac" strokeWidth="0.8" />
        <path d="M48 103l12 17 12-17" stroke="#16a34a" strokeWidth="2.4" fill="none" />
        <rect x="37" y="126" width="46" height="6" rx="2" fill="#16a34a" opacity="0.6" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.42" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.42" />

        {/* 橙皮额沿与橙络 */}
        <path d="M33 46c0-15 12-26 27-26s27 11 27 26c-9-1-18-2-27-2s-18 1-27 2z" fill="url(#clx-orange)" stroke="#ea580c" strokeWidth="0.6" />
        <path d="M45 29v16M60 24v21M75 29v16" stroke="#fed7aa" strokeWidth="0.6" opacity="0.7" />
        <path d="M49 23c-3 6-7 10-12 12 6 0 11-3 14-8z" fill="#ffedd5" opacity="0.7" />

        <Eyes expression={expression} iris="#7c4a2d" />
        <Mouth expression={expression} tone="#a34a4a" />
        <MoodMark expression={expression} color="#22c55e" />
      </g>
    </svg>
  ),

  'boluo-chuixue': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="blcx-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
        <linearGradient id="blcx-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bef264" />
          <stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
        <radialGradient id="blcx-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#blcx-wash)" />

        {/* 菠萝叶冠 */}
        <g fill="url(#blcx-hair)" stroke="#ca8a04" strokeWidth="0.8">
          <path d="M38 32L26 12l20 6z" />
          <path d="M48 28L42 6l16 12z" />
          <path d="M60 26L62 3l10 17z" />
          <path d="M72 29L84 9l2 17z" />
          <path d="M82 34l16-8-6 15z" />
        </g>
        <path d="M36 26l8 5M45 22l7 7M59 20l4 8M73 22l-3 8" stroke="#a16207" strokeWidth="0.6" />

        {/* 后发 */}
        <path d="M29 58c-2-20 12-33 31-33s33 13 31 33c-2 11-5 19-9 24-6-8-13-12-22-12s-16 4-22 12c-4-5-7-13-9-24z" fill="url(#blcx-hair)" />

        {/* 绿衣 + 剑 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#blcx-cloth)" stroke="#4d7c0f" strokeWidth="0.8" />
        <path d="M47 103l13 16 13-16" stroke="#ecfccb" strokeWidth="2.2" fill="none" />
        <rect x="36" y="126" width="48" height="5" rx="2" fill="#3f6212" opacity="0.55" />
        <g transform="rotate(18 98 120)">
          <rect x="96" y="106" width="5" height="26" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.6" />
          <rect x="90" y="102" width="17" height="4" rx="2" fill="#65a30d" />
          <rect x="97" y="96" width="3" height="10" fill="#3f6212" />
        </g>

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffe0c7" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />

        {/* 菠萝刘海 + 绿发带 */}
        <path d="M32 47c0-16 12-27 28-27s28 11 28 27c-8-7-17-10-28-10s-20 3-28 10z" fill="url(#blcx-hair)" />
        <path d="M31 40c17-5 41-5 58 0" stroke="#65a30d" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M86 39c5 1 8 3 10 6-4 0-7-1-10-3z" fill="#65a30d" />

        <Eyes expression={expression} iris="#4d7c0f" />
        <Mouth expression={expression} tone="#9a5b4a" />
        <MoodMark expression={expression} color="#84cc16" />
      </g>
    </svg>
  ),

  huolinfei: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="hlf-helmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="hlf-armor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="hlf-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <radialGradient id="hlf-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#hlf-wash)" />

        {/* 红色机甲头盔 */}
        <path d="M27 54c-2-21 13-35 33-35s35 14 33 35c-2 9-6 15-11 18-6-5-13-8-22-8s-16 3-22 8c-5-3-9-9-11-18z" fill="url(#hlf-helmet)" stroke="#7f1d1d" strokeWidth="0.8" />
        <path d="M32 39c15-6 41-6 56 0" stroke="#f97316" strokeWidth="3" fill="none" />
        <path d="M35 44c14-4 36-4 50 0" stroke="#fbbf24" strokeWidth="1.2" fill="none" opacity="0.9" />
        <path d="M28 56c2 6 5 10 8 12M92 56c-2 6-5 10-8 12" stroke="#7f1d1d" strokeWidth="0.6" fill="none" />
        {/* 火焰头冠 */}
        <path d="M50 27c-6-9-2-18 3-23 3 8 8 8 9 16 2-5 5-9 8-11 1 9-2 17-7 21z" fill="url(#hlf-flame)" stroke="#c2410c" strokeWidth="0.6" />

        {/* 机甲肩甲与胸甲 */}
        <path d="M27 140c0-20 8-31 20-35l7-3 6 3c12 4 20 15 20 35z" fill="url(#hlf-armor)" stroke="#7f1d1d" strokeWidth="0.8" />
        <path d="M27 140c0-14 4-23 11-28l7 10-9 18z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.6" />
        <path d="M93 140c0-14-4-23-11-28l-7 10 9 18z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.6" />
        <path d="M45 111c5 5 10 7 15 7s10-2 15-7" stroke="#fbbf24" strokeWidth="1.4" fill="none" />
        <path d="M52 118c-3 6-3 11 0 15 3-4 3-9 0-15zM68 118c3 6 3 11 0 15-3-4-3-9 0-15z" fill="#fb923c" opacity="0.9" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffd7c2" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.38" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.38" />

        <Eyes expression={expression} iris="#b45309" />
        <Mouth expression={expression} tone="#a34a4a" />
        <MoodMark expression={expression} color="#fb923c" />
      </g>
    </svg>
  ),

  leiyi: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="ly-helmet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="ly-armor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="ly-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
        <radialGradient id="ly-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#ly-wash)" />

        {/* 尖角蓝紫头盔 */}
        <path d="M30 52L34 26l26-8 26 8 4 26-8 18-22 6-22-6z" fill="url(#ly-helmet)" stroke="#312e81" strokeWidth="0.8" />
        <path d="M34 26l26-8 26 8" stroke="#a5b4fc" strokeWidth="1.2" fill="none" />
        <path d="M30 52l9 4M90 52l-9 4" stroke="#eab308" strokeWidth="1.4" strokeLinecap="round" />
        {/* 金色闪电头冠 */}
        <path d="M60 3l-7 12h6l-4 9 11-13h-6l5-8z" fill="url(#ly-gold)" stroke="#a16207" strokeWidth="0.6" />

        {/* 蓝紫机甲 */}
        <path d="M27 140c0-20 8-31 20-35l7-3 6 3c12 4 20 15 20 35z" fill="url(#ly-armor)" stroke="#312e81" strokeWidth="0.8" />
        <path d="M28 140c0-15 4-24 12-29l8 11-8 18z" fill="#4f46e5" stroke="#312e81" strokeWidth="0.6" />
        <path d="M92 140c0-15-4-24-12-29l-8 11 8 18z" fill="#4f46e5" stroke="#312e81" strokeWidth="0.6" />
        <path d="M47 106l13 12 13-12" stroke="#fbbf24" strokeWidth="1.6" fill="none" />
        <path d="M60 116l-4 8h4l-2 7 7-10h-4l3-5z" fill="#facc15" stroke="#a16207" strokeWidth="0.6" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#e8c9bd" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#f2d9d0" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.36" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.36" />

        <path d="M36 48c0-9 10-16 24-16s24 7 24 16" stroke="#a5b4fc" strokeWidth="1" fill="none" opacity="0.7" />
        <path d="M42 42.5h11M67 42.5h11" stroke="#312e81" strokeWidth="1.1" strokeLinecap="round" opacity="0.65" />
        <Eyes expression={expression} iris="#4338ca" />
        <Mouth expression={expression} tone="#8f5b6c" />
        <MoodMark expression={expression} color="#eab308" />
      </g>
    </svg>
  ),

  luoluo: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="ll-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="ll-jacket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <radialGradient id="ll-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#ll-wash)" />

        {/* 短后发 */}
        <path d="M30 58c-2-21 12-34 30-34s32 13 30 34c-2 10-5 18-9 23-6-7-13-11-21-11s-15 4-21 11c-4-5-7-13-9-23z" fill="url(#ll-hair)" />

        {/* 红白夹克 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#ll-jacket)" stroke="#991b1b" strokeWidth="0.8" />
        <path d="M43 102l17 20 17-20-5-3-12 10-12-10z" fill="#ffffff" stroke="#fca5a5" strokeWidth="0.6" />
        <path d="M60 110v30" stroke="#f8fafc" strokeWidth="1.4" />
        <rect x="73" y="118" width="10" height="7" rx="1" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.6" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />

        {/* 刘海 */}
        <path d="M33 48c0-17 12-28 27-28s27 11 27 28c-6-5-12-8-18-9-2 6-5 9-9 10-1-5-3-9-5-12-3 8-8 13-15 14-2-2-4-5-5-8-2 2-3 3-5 5z" fill="url(#ll-hair)" />

        {/* 护目镜推到额头 */}
        <path d="M35 33c16-5 34-5 50 0" stroke="#475569" strokeWidth="3" fill="none" />
        <circle cx="48" cy="32" r="8" fill="#bfdbfe" stroke="#64748b" strokeWidth="1.4" />
        <circle cx="72" cy="32" r="8" fill="#bfdbfe" stroke="#64748b" strokeWidth="1.4" />
        <circle cx="48" cy="32" r="4" fill="#93c5fd" opacity="0.8" />
        <circle cx="72" cy="32" r="4" fill="#93c5fd" opacity="0.8" />
        <path d="M45 29l4-3M69 29l4-3" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M56 32h8" stroke="#64748b" strokeWidth="2" />

        <Eyes expression={expression} iris="#78350f" />
        <Mouth expression={expression} tone="#a34a4a" />
        <MoodMark expression={expression} color="#3b82f6" />
      </g>
    </svg>
  ),

  'nangong-wentian': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="ngwt-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="ngwt-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5e8" />
          <stop offset="100%" stopColor="#ece2ca" />
        </linearGradient>
        <radialGradient id="ngwt-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#ngwt-wash)" />

        {/* 背后长枪 */}
        <path d="M12 140L100 12" stroke="#a16207" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 12l10-8-2 13-8 3z" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
        <path d="M98 18c-5 2-8 5-9 9 4-1 7-3 10-6z" fill="#ef4444" />

        {/* 后发 + 束发 */}
        <path d="M29 70c-2-26 11-42 31-42s33 16 31 42c-1 14-4 24-8 30-7-8-14-12-23-12s-16 4-23 12c-4-6-7-16-8-30z" fill="url(#ngwt-hair)" />
        <circle cx="78" cy="17" r="9" fill="url(#ngwt-hair)" stroke="#0f172a" strokeWidth="0.8" />
        <path d="M71 19c5-5 10-7 16-6" stroke="#0ea5e9" strokeWidth="2" fill="none" />
        <path d="M84 24c5 2 7 5 7 8-4 0-6-2-9-4z" fill="#0ea5e9" />

        {/* 米白侠衣 + 青色滚边 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#ngwt-robe)" stroke="#d8cbb0" strokeWidth="0.8" />
        <path d="M48 103l12 18 12-18-5-3-7 6-7-6z" fill="#fffaf0" stroke="#d8cbb0" strokeWidth="0.6" />
        <path d="M60 103v24" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.5" />
        <rect x="37" y="127" width="46" height="6" rx="2" fill="#0ea5e9" opacity="0.55" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffe0cd" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />

        {/* 束发刘海 */}
        <path d="M33 47c0-16 12-27 27-27s27 11 27 27c-7-7-16-10-27-10s-20 3-27 10z" fill="url(#ngwt-hair)" />
        <path d="M86 43c3 12 2 26-2 36-3-2-5-6-5-11 2-8 3-16 2-23z" fill="url(#ngwt-hair)" />
        <path d="M47 26c2 5 2 10 1 15M72 26c-1 5 0 10 2 14" stroke="#475569" strokeWidth="0.6" fill="none" opacity="0.7" />
        <path d="M88 24l4 5" stroke="#bae6fd" strokeWidth="2.2" strokeLinecap="round" />

        <Eyes expression={expression} iris="#155e75" />
        <Mouth expression={expression} tone="#8f5b52" />
        <MoodMark expression={expression} color="#0ea5e9" />
      </g>
    </svg>
  ),

  maidang: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="md-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="md-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <radialGradient id="md-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#md-wash)" />

        {/* 后发 */}
        <path d="M30 58c-2-21 12-34 30-34s32 13 30 34c-2 10-5 18-9 23-6-7-13-11-21-11s-15 4-21 11c-4-5-7-13-9-23z" fill="url(#md-hair)" />

        {/* 橙色外套 + 红内衬 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#md-coat)" stroke="#c2410c" strokeWidth="0.8" />
        <path d="M46 102l14 18 14-18-5-3-9 8-9-8z" fill="#fff7ed" stroke="#fdba74" strokeWidth="0.6" />
        <path d="M38 140c0-14 3-23 10-28l6 10-7 18z" fill="#ef4444" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.42" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.42" />

        {/* 刘海 + 红头巾 */}
        <path d="M33 47c0-16 12-27 27-27s27 11 27 27c-7-7-16-10-27-10s-20 3-27 10z" fill="url(#md-hair)" />
        <path d="M31 39c17-6 41-6 58 0" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
        <path d="M86 37c7-2 11 0 14 3-4 3-8 4-12 3z" fill="#ef4444" />
        <path d="M98 39c3 6 1 10-3 12 0-4 0-8 1-11zM98 39c6 4 7 9 5 13-2-4-4-7-6-9z" fill="#dc2626" />

        {/* 手里的星星 */}
        <ellipse cx="86" cy="121" rx="4.3" ry="3.5" fill="#ffdcc8" stroke="#e8b99f" strokeWidth="0.6" />
        <path d="M86 108l2.2 5.4 5.8.4-4.4 3.7 1.4 5.6-5-3.1-5 3.1 1.4-5.6-4.4-3.7 5.8-.4z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.7" />

        <Eyes expression={expression} iris="#b45309" />
        <Mouth expression={expression} tone="#a34a4a" />
        <MoodMark expression={expression} color="#ef4444" />
      </g>
    </svg>
  ),
}
