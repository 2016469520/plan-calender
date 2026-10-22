// ============================================================
// 《一人之下》同人角色：冯宝宝 / 张楚岚 / 王也 / 诸葛青
// ------------------------------------------------------------
// 原创同人风推演，非官方立绘；仅用于本地体验与风格测试。
// 现代国漫底色：都市异人 + 水墨。四个角色共用 Q 版半身骨架、
// 眼型与情绪符号，只靠发型轮廓、主色和标志性道具区分。
// 渐变 id 均带角色前缀，同页渲染多个角色也不会冲突。
// ============================================================

import type { CharacterArt } from './types'

type FaceProps = { expression: string }
type EyeVariant = 'plain' | 'dead' | 'fox'

/** 眼睛：所有角色共用一套眼型，只换瞳色与变体 */
function Eyes({
  expression,
  iris = '#22242c',
  variant = 'plain',
}: FaceProps & { iris?: string; variant?: EyeVariant }) {
  const dead = variant === 'dead'
  const fox = variant === 'fox'
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
      return dead ? (
        <g>
          <ellipse cx="47" cy="51" rx="5.6" ry="6.2" fill="#f8f5f1" stroke="#c9c3bc" strokeWidth="0.6" />
          <ellipse cx="70" cy="51" rx="5.6" ry="6.2" fill="#f8f5f1" stroke="#c9c3bc" strokeWidth="0.6" />
          <ellipse cx="47.6" cy="51.4" rx="2.4" ry="2.8" fill={iris} />
          <ellipse cx="69.8" cy="51.4" rx="2.4" ry="2.8" fill={iris} />
          <circle cx="46.9" cy="50.2" r="0.8" fill="#fff" opacity="0.9" />
          <circle cx="69.1" cy="50.2" r="0.8" fill="#fff" opacity="0.9" />
        </g>
      ) : (
        <g>
          <ellipse cx="47" cy="50" rx="5" ry="5.8" fill={iris} />
          <ellipse cx="70" cy="50" rx="5" ry="5.8" fill={iris} />
          <circle cx="45.6" cy="47.6" r="1.7" fill="#fff" opacity="0.95" />
          <circle cx="48.3" cy="52" r="0.9" fill="#fff" opacity="0.5" />
          <circle cx="68.6" cy="47.6" r="1.7" fill="#fff" opacity="0.95" />
          <circle cx="71.3" cy="52" r="0.9" fill="#fff" opacity="0.5" />
          {fox && (
            <path d="M41.4 47.4c3.2-3 7.8-3.2 10.8-.6M64.4 47.4c3.2-3 7.8-3.2 10.8-.6" stroke={iris} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          )}
        </g>
      )
  }
}

/** 嘴：情绪只改嘴角方向，不重画整张脸 */
function Mouth({ expression, tone = '#96575f', deadpan = false }: FaceProps & { tone?: string; deadpan?: boolean }) {
  if (deadpan) {
    switch (expression) {
      case 'happy':
        return <path d="M55.4 60.2c2.6 1.4 6.6 1.4 9.2 0" stroke={tone} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      case 'error':
        return <path d="M55.6 60.8c2.4-1.2 6.4-1.2 8.8 0" stroke={tone} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      case 'sleepy':
        return <ellipse cx="60" cy="60.8" rx="2.2" ry="1.5" fill={tone} />
      case 'thinking':
        return <path d="M56.8 60.8h6.4" stroke={tone} strokeWidth="1.2" strokeLinecap="round" />
      case 'working':
        return <path d="M55.2 60.6h9.6" stroke={tone} strokeWidth="1.4" strokeLinecap="round" />
      default:
        return <path d="M56 60.6h8" stroke={tone} strokeWidth="1.2" strokeLinecap="round" />
    }
  }
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

/** 情绪符号：星芒 / 墨点 / 斩击线 / 汗滴 / z */
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

export const YIREN_CHARACTERS: Record<string, CharacterArt> = {
  'feng-baobao': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="fbb-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3d47" />
          <stop offset="100%" stopColor="#191b21" />
        </linearGradient>
        <linearGradient id="fbb-tee" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7f7f4" />
          <stop offset="100%" stopColor="#d9dbd8" />
        </linearGradient>
        <radialGradient id="fbb-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#3f7a6a" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#3f7a6a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#fbb-wash)" />

        {/* 及腰黑长直 */}
        <path d="M24 134c-4-30-2-60 3-80 4-14 17-23 33-23s29 9 33 23c5 20 7 50 3 80-8 6-21 8-36 8s-28-2-36-8z" fill="url(#fbb-hair)" />
        <path d="M39 30c-3 12-4 26-3 42M81 30c3 12 4 26 3 42" stroke="#4a4e5a" strokeWidth="0.8" fill="none" opacity="0.65" />

        {/* 宽松白 T */}
        <path d="M29 140c0-21 10-32 22-36l9-3 9 3c12 4 22 15 22 36z" fill="url(#fbb-tee)" stroke="#b8bcba" strokeWidth="0.8" />
        <path d="M29 140c-1-15 2-24 10-30l6 8c-5 6-7 13-7 22z" fill="#e8e9e6" stroke="#c6c9c6" strokeWidth="0.6" />
        <path d="M91 140c1-15-2-24-10-30l-6 8c5 6 7 13 7 22z" fill="#e8e9e6" stroke="#c6c9c6" strokeWidth="0.6" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e9a3a3" opacity="0.3" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e9a3a3" opacity="0.3" />

        {/* 齐刘海 + 长侧发 */}
        <path d="M33 46c0-16 12-26 27-26s27 10 27 26c-18 4-36 4-54 0z" fill="url(#fbb-hair)" />
        <path d="M45 27v17M52 26v17M68 26v17M75 27v17" stroke="#14161c" strokeWidth="0.6" opacity="0.55" />
        <path d="M32 45c-3 15-3 32 0 46 4-2 6-6 7-12-2-13-2-25 0-34z" fill="url(#fbb-hair)" />
        <path d="M88 45c3 15 3 32 0 46-4-2-6-6-7-12 2-13 2-25 0-34z" fill="url(#fbb-hair)" />
        <path d="M42 41h10M68 41h10" stroke="#2b2d35" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <path d="M52 101c3 4 5 6 8 6s5-2 8-6" stroke="#c3c7c5" strokeWidth="0.8" fill="none" />

        {/* 右手拎着的菜刀 */}
        <g>
          <rect x="92" y="96" width="4.4" height="16" rx="2" fill="#6b5b4b" />
          <path d="M89 111h10l4 19H86z" fill="#cfd6da" stroke="#8a9298" strokeWidth="0.8" />
          <path d="M88 126h12" stroke="#eef2f4" strokeWidth="1" />
          <circle cx="94" cy="115" r="1.5" fill="#8a9298" />
          <rect x="91.8" y="100" width="4.8" height="2.2" fill="#3f7a6a" />
          <rect x="91.8" y="104" width="4.8" height="2.2" fill="#3f7a6a" />
        </g>
        <ellipse cx="94" cy="110" rx="4.2" ry="3.4" fill="#ffdcc8" stroke="#e8b99f" strokeWidth="0.6" />

        <Eyes expression={expression} variant="dead" />
        <Mouth expression={expression} deadpan />
        <MoodMark expression={expression} color="#3f7a6a" />
      </g>
    </svg>
  ),

  'zhang-chulan': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="zcl-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#33414f" />
          <stop offset="100%" stopColor="#1b232d" />
        </linearGradient>
        <linearGradient id="zcl-jacket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c3a4a" />
          <stop offset="100%" stopColor="#1b2531" />
        </linearGradient>
        <radialGradient id="zcl-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#1f2937" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#1f2937" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#zcl-wash)" />

        {/* 短碎发后轮廓 */}
        <path d="M30 56c-2-20 12-32 30-32s32 12 30 32c-1 12-4 21-8 27-5-10-12-15-22-15s-17 5-22 15c-4-6-7-15-8-27z" fill="url(#zcl-hair)" />

        {/* 白衬衫 + 敞开深色外套 */}
        <path d="M29 140c0-21 10-32 22-36l9-3 9 3c12 4 22 15 22 36z" fill="#f7f8f7" stroke="#c9cdca" strokeWidth="0.8" />
        <path d="M29 140c0-20 7-30 18-35l6 16-9 19z" fill="url(#zcl-jacket)" stroke="#141c25" strokeWidth="0.6" />
        <path d="M91 140c0-20-7-30-18-35l-6 16 9 19z" fill="url(#zcl-jacket)" stroke="#141c25" strokeWidth="0.6" />
        <path d="M47 104l13 18 13-18-5-3-8 6-8-6z" fill="#ffffff" stroke="#c9cdca" strokeWidth="0.6" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.4" />

        {/* 短碎刘海，额前留一撮 */}
        <path d="M33 48c0-16 11-27 27-27s27 11 27 27c-4-5-8-8-11-9-2 6-5 9-9 11-1-6-2-10-4-13-3 8-8 13-15 14-3-3-5-6-6-10-4 3-7 6-9 7z" fill="url(#zcl-hair)" />
        <path d="M47 23c-1-6 2-11 5-14 1 6 0 11-3 15z" fill="url(#zcl-hair)" />
        <path d="M68 21c2-6 5-9 9-10-1 6-3 10-6 13z" fill="url(#zcl-hair)" />
        <path d="M31 46c-2 6-2 12 0 17 3-2 5-5 6-9z" fill="url(#zcl-hair)" />
        <path d="M89 46c2 6 2 12 0 17-3-2-5-5-6-9z" fill="url(#zcl-hair)" />
        <path d="M55 25c-3 5-6 9-10 11 5-1 9-4 12-8z" fill="#46586a" opacity="0.8" />

        {/* 金色小饰物 */}
        <circle cx="87" cy="57" r="1.6" fill="#d4af37" stroke="#9a7a22" strokeWidth="0.6" />
        <path d="M56 104l4 12 4-12" stroke="#d4af37" strokeWidth="0.8" fill="none" />
        <circle cx="60" cy="118" r="2.2" fill="#d4af37" stroke="#9a7a22" strokeWidth="0.6" />

        <Eyes expression={expression} iris="#2b3442" />
        <Mouth expression={expression} tone="#9a5b62" />
        <MoodMark expression={expression} color="#d4af37" />
      </g>
    </svg>
  ),

  'wang-ye': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="wy-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b6471" />
          <stop offset="100%" stopColor="#3f4652" />
        </linearGradient>
        <linearGradient id="wy-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7f1e3" />
          <stop offset="100%" stopColor="#e6dcc6" />
        </linearGradient>
        <radialGradient id="wy-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#b08d57" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b08d57" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#wy-wash)" />

        {/* 半束长发 */}
        <path d="M27 62c-3-23 9-37 33-37s36 14 33 37c-1 18-4 30-9 38-6-7-10-16-12-26-6 5-17 6-24 2-3 10-7 19-13 25-4-10-6-22-8-39z" fill="url(#wy-hair)" />

        {/* 道袍：交领 + 宽袖 */}
        <path d="M30 140c0-21 9-32 22-36l8-3 8 3c13 4 22 15 22 36z" fill="url(#wy-robe)" stroke="#cfc3a9" strokeWidth="0.8" />
        <path d="M50 102l10 17 5-5-8-14z" fill="#fffaf0" stroke="#d8cdb4" strokeWidth="0.6" />
        <path d="M70 102l-10 17-5-5 8-14z" fill="#f0e7d4" stroke="#d8cdb4" strokeWidth="0.6" />
        <path d="M31 140c0-17 4-27 12-32M89 140c0-17-4-27-12-32" stroke="#d8cdb4" strokeWidth="0.6" fill="none" />
        <rect x="36" y="126" width="48" height="6" rx="2" fill="#b08d57" opacity="0.6" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.36" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.36" />

        {/* 长刘海斜分，右鬓垂下 */}
        <path d="M33 47c1-16 12-27 28-27s27 11 27 27c-6-5-12-7-18-6-8 1-13 8-19 12-7 5-13 5-18 1z" fill="url(#wy-hair)" />
        <path d="M85 44c3 8 4 17 2 25-2 4-5 4-7 1-2-3-1-7 1-11z" fill="url(#wy-hair)" />
        <path d="M46 28c2 5 3 10 2 15M70 27c-1 6-3 11-6 15" stroke="#7b8492" strokeWidth="0.6" fill="none" opacity="0.7" />

        {/* 铜钱：外圆内方 */}
        <ellipse cx="79" cy="120" rx="4.4" ry="3.6" fill="#ffdcc8" stroke="#e8b99f" strokeWidth="0.6" />
        <circle cx="80" cy="114" r="6" fill="#b08d57" stroke="#84663a" strokeWidth="0.8" />
        <rect x="77.6" y="111.6" width="4.8" height="4.8" fill="#f7f1e3" stroke="#84663a" strokeWidth="0.6" />
        <path d="M72 121c4-2 8-2 12 0" stroke="#cfc3a9" strokeWidth="0.6" fill="none" />

        <Eyes expression={expression} iris="#3c4652" />
        {/* 遮眼的一绺长发，压在眼睛之上 */}
        <path d="M35 42c-1 9 0 18 4 25 3 4 7 4 9 1 2-3 0-7-2-11-3-5-7-10-8-15z" fill="url(#wy-hair)" />
        <path d="M38 46c2 7 4 12 6 16" stroke="#7b8492" strokeWidth="0.6" fill="none" opacity="0.7" />
        <Mouth expression={expression} tone="#8f5b52" />
        <MoodMark expression={expression} color="#b08d57" />
      </g>
    </svg>
  ),

  'zhuge-qing': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 120 140" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="zgq-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f3fb" />
          <stop offset="100%" stopColor="#cfd1ea" />
        </linearGradient>
        <linearGradient id="zgq-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f4fb" />
          <stop offset="100%" stopColor="#e2e3f3" />
        </linearGradient>
        <linearGradient id="zgq-fan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7e9f5" />
          <stop offset="100%" stopColor="#c9c3e6" />
        </linearGradient>
        <radialGradient id="zgq-wash" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#7c6bb0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7c6bb0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2)' : undefined}>
        <ellipse cx="60" cy="58" rx="54" ry="58" fill="url(#zgq-wash)" />

        {/* 浅色长发 + 右侧高马尾 */}
        <path d="M28 84c-4-27 6-46 25-50 21-4 39 12 41 35 2 20-1 43-5 61-8-7-12-18-13-31-7 5-17 7-27 4-3 13-8 23-15 29-3-16-5-32-6-48z" fill="url(#zgq-hair)" />
        <path d="M78 31c13-8 25-2 29 9 4 14 1 31-7 43-3-15-8-29-17-39l-5-13z" fill="url(#zgq-hair)" />
        <path d="M82 31l-5 4 3 6 6-4z" fill="#7c6bb0" />
        <path d="M85 36l10-7" stroke="#b8bdd6" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M88 38c8 3 12 8 13 14M92 47c5 4 8 9 8 15" stroke="#aeb3cf" strokeWidth="0.6" fill="none" opacity="0.8" />

        {/* 月白长袍 + 紫腰带 */}
        <path d="M29 140c0-21 10-32 22-36l9-3 9 3c12 4 22 15 22 36z" fill="url(#zgq-robe)" stroke="#c9cbe0" strokeWidth="0.8" />
        <path d="M49 103l11 17 11-17-5-3-6 6-6-6z" fill="#ffffff" stroke="#c9cbe0" strokeWidth="0.6" />
        <rect x="36" y="126" width="48" height="6" rx="2" fill="#7c6bb0" opacity="0.7" />

        <path d="M53 87h14v13l-7 6-7-6z" fill="#f2c6b0" />
        <ellipse cx="60" cy="52" rx="26" ry="27" fill="#ffdcc8" />
        <ellipse cx="40" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.38" />
        <ellipse cx="80" cy="59" rx="5.2" ry="2.8" fill="#e79a9a" opacity="0.38" />

        {/* 中分刘海 + 两缕长发 */}
        <path d="M33 47c0-16 12-27 27-27s27 11 27 27c-8-7-17-10-27-10s-19 3-27 10z" fill="url(#zgq-hair)" />
        <path d="M32 46c-3 17-2 33 3 44 4-2 6-7 7-13-3-10-4-21-2-31z" fill="url(#zgq-hair)" />
        <path d="M88 46c3 17 2 33-3 44-4-2-6-7-7-13 3-10 4-21 2-31z" fill="url(#zgq-hair)" />
        <path d="M51 24c-3 6-7 10-12 12 6 0 11-3 14-8z" fill="#ffffff" opacity="0.7" />

        {/* 折扇 */}
        <path d="M73 128l5-24a26 26 0 0 1 23 18z" fill="url(#zgq-fan)" stroke="#7c6bb0" strokeWidth="0.8" />
        <path d="M75 127l7-21M78 128l13-17M80 128l19-11" stroke="#9b8fc4" strokeWidth="0.6" fill="none" />
        <ellipse cx="74" cy="128" rx="4" ry="3.4" fill="#ffdcc8" stroke="#e8b99f" strokeWidth="0.6" />

        <Eyes expression={expression} variant="fox" iris="#5b4a86" />
        <Mouth expression={expression} tone="#8f5b6c" />
        <MoodMark expression={expression} color="#7c6bb0" />
      </g>
    </svg>
  ),
}
