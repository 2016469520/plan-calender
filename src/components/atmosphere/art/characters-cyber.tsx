// ============================================================
// 霓虹终端 Cyberpunk · 全息 AI「NOVA」
//
// 半身像由线框与光块构成：多边形头罩 + 横向扫描线胸腔 + 悬浮碎块。
// 纯程序化 SVG：不引用外部资源，不使用位图、文本节点、外嵌 HTML，
// 也不使用 hooks / 随机数 / 滤镜。五种状态只改面部、胸腔数据条与色调，
// 其余骨架保持一致，所以切换状态时角色不会"变形"。
// ============================================================

import type { CharacterArt, CharacterArtProps } from './types'

type NovaState = 'idle' | 'happy' | 'thinking' | 'working' | 'error'

// 胸腔数据条：六根，基线 188，柱宽 4
const BAR_X: readonly number[] = [63, 69.5, 76, 82.5, 89, 95.5]
const BAR_HEIGHTS: Record<NovaState, readonly number[]> = {
  idle: [9, 15, 11, 19, 13, 8],
  happy: [14, 21, 17, 25, 19, 12],
  thinking: [7, 12, 16, 10, 14, 6],
  working: [24, 8, 27, 13, 23, 6],
  error: [6, 10, 7, 12, 8, 4],
}
const BAR_ALPHA: Record<NovaState, number> = {
  idle: 0.6,
  happy: 0.9,
  thinking: 0.48,
  working: 0.9,
  error: 0.45,
}

// 扫描带扫到的高度：错开一点，让五个状态连"光带"也不一样
const SWEEP_Y: Record<NovaState, number> = {
  idle: 150,
  happy: 143,
  thinking: 132,
  working: 168,
  error: 176,
}

// 胸腔左右两块"读数"：用矩形小条模拟 HUD 文本，不写真正的字
interface HudBlock {
  x: number
  y: number
  w: number
  opacity: number
}

const HUD_BLOCKS: readonly HudBlock[] = [
  { x: 46, y: 146, w: 8, opacity: 0.32 },
  { x: 56, y: 146, w: 3, opacity: 0.18 },
  { x: 46, y: 151, w: 5, opacity: 0.24 },
  { x: 53, y: 151, w: 6, opacity: 0.32 },
  { x: 46, y: 156, w: 9, opacity: 0.26 },
  { x: 104, y: 146, w: 7, opacity: 0.3 },
  { x: 113, y: 146, w: 3, opacity: 0.18 },
  { x: 104, y: 151, w: 9, opacity: 0.34 },
  { x: 104, y: 156, w: 4, opacity: 0.2 },
  { x: 110, y: 156, w: 6, opacity: 0.28 },
]

// 躯干轮廓：肩线从 122 落到 172，底部在 200 处切平
const TORSO_PATH =
  'M 22 200 V 168 L 38 132 L 62 120 H 98 L 122 132 L 138 168 V 200 Z'

// 胸腔扫描线：等距 5px，一条 path 承载全部
const SCAN_LINES = (() => {
  const parts: string[] = []
  for (let y = 120; y <= 200; y += 5) parts.push(`M16 ${y}H144`)
  return parts.join(' ')
})()

export const CYBER_CHARACTERS: Record<string, CharacterArt> = {
  'cyber-nova': ({ expression, className, reacting }: CharacterArtProps) => {
    const state: NovaState = expression === 'sleepy' ? 'idle' : expression
    const isError = state === 'error'

    // 平时只有青色；品红只服务于 error
    const accent = isError ? '#f472b6' : '#22d3ee'
    const accentAlt = isError ? '#fb7185' : '#67e8f9'
    // 两套 id 前缀：不同状态同屏时不抢同一份渐变
    const p = isError ? 'nv-r-' : 'nv-c-'

    const midTone = isError ? '#241021' : '#0e1a2e'
    const deep = isError ? '#170a13' : '#0b1220'

    return (
      <svg viewBox="0 0 160 200" className={className} aria-hidden="true">
        <defs>
          <radialGradient id={`${p}halo`} gradientUnits="userSpaceOnUse" cx="80" cy="64" r="72">
            <stop offset="0" stopColor={accent} stopOpacity="0.12" />
            <stop offset="0.55" stopColor={accent} stopOpacity="0.035" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${p}body`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0" stopColor={midTone} stopOpacity="0.9" />
            <stop offset="0.55" stopColor={deep} stopOpacity="0.86" />
            <stop offset="1" stopColor={deep} stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id={`${p}scan`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.26" />
            <stop offset="0.6" stopColor={accent} stopOpacity="0.12" />
            <stop offset="1" stopColor={accent} stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={`${p}sweep`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0" />
            <stop offset="0.5" stopColor={accentAlt} stopOpacity="0.16" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${p}chest`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.055" />
            <stop offset="1" stopColor={accent} stopOpacity="0.012" />
          </linearGradient>
          <clipPath id={`${p}torso-clip`}>
            <path d={TORSO_PATH} />
          </clipPath>
        </defs>

        <g transform={reacting ? 'translate(0 -2)' : undefined}>
          {/* 头部后方的一层全息底光 */}
          <circle cx="80" cy="64" r="72" fill={`url(#${p}halo)`} />

          {/* 颈部 */}
          <rect
            x="72"
            y="99"
            width="16"
            height="27"
            rx="2"
            fill={deep}
            fillOpacity="0.9"
            stroke={accent}
            strokeOpacity="0.28"
            strokeWidth="1"
          />

          {/* 肩与胸：轮廓 + 横向扫描线 */}
          <path
            d={TORSO_PATH}
            fill={`url(#${p}body)`}
            stroke={accent}
            strokeOpacity="0.42"
            strokeWidth="1"
          />
          <g clipPath={`url(#${p}torso-clip)`}>
            <path d={SCAN_LINES} fill="none" stroke={`url(#${p}scan)`} strokeWidth="0.7" />
          </g>

          {/* 胸甲：切角面板 */}
          <path
            d="M 46 140 H 114 L 120 154 V 194 H 40 V 154 Z"
            fill={`url(#${p}chest)`}
            stroke={accent}
            strokeOpacity="0.18"
            strokeWidth="0.8"
          />

          {/* 胸腔核心 */}
          <circle cx="80" cy="132" r="6" fill="none" stroke={accent} strokeOpacity="0.22" strokeDasharray="1.5 3" />
          <circle cx="80" cy="132" r="2.4" fill={accent} opacity="0.55" />

          {/* 左右读数条 */}
          <g fill={accent}>
            {HUD_BLOCKS.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height="1.6" opacity={b.opacity} />
            ))}
          </g>
          <rect x="44" y="160" width="72" height="1" fill={accent} opacity="0.16" />

          {/* 数据柱：高度与亮度随状态变化 */}
          <g fill={accent} opacity={BAR_ALPHA[state]}>
            {BAR_HEIGHTS[state].map((h, i) => (
              <rect key={i} x={BAR_X[i]} y={188 - h} width="4" height={h} />
            ))}
          </g>
          <rect x="61" y="188.6" width="42" height="1" fill={accent} opacity="0.26" />

          {/* 扫描光带：压在柱状条上，像一层正在扫过的投影 */}
          <g clipPath={`url(#${p}torso-clip)`}>
            <rect x="16" y={SWEEP_Y[state]} width="128" height="9" fill={`url(#${p}sweep)`} />
          </g>

          {/* 头罩：切角多边形 + 内层面板 */}
          <path
            d="M 56 28 H 104 L 116 44 V 80 L 102 104 H 58 L 44 80 V 44 Z"
            fill={`url(#${p}body)`}
            stroke={accent}
            strokeOpacity="0.52"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M 61 37 H 99 L 108 49 V 77 L 97 95 H 63 L 52 77 V 49 Z"
            fill={accent}
            fillOpacity="0.045"
            stroke={accent}
            strokeOpacity="0.24"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <path d="M 80 31 V 102" stroke={accent} strokeOpacity="0.1" strokeWidth="0.8" />
          <rect x="68" y="43" width="24" height="1.4" fill={accent} opacity="0.32" />
          <rect x="46.6" y="60" width="1.6" height="12" rx="0.8" fill={accent} opacity="0.32" />
          <rect x="112" y="60" width="1.6" height="12" rx="0.8" fill={accent} opacity="0.32" />
          <rect x="70" y="93" width="20" height="1" fill={accent} opacity="0.22" />

          {/* 面部：五种状态的主差异 */}
          {state === 'happy' ? (
            <>
              <path
                d="M 59 70 Q 67.5 60.5 76 70"
                fill="none"
                stroke={accent}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M 84 70 Q 92.5 60.5 101 70"
                fill="none"
                stroke={accent}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <rect x="119" y="86" width="5" height="1.6" fill={accent} opacity="0.7" />
              <rect x="120.7" y="84.3" width="1.6" height="5" fill={accent} opacity="0.7" />
            </>
          ) : state === 'error' ? (
            <>
              <path d="M 58 73 L 66 62" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 69 71 L 73 65" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <path d="M 87 62 L 95 73" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M 90 65 L 94 71" stroke={accent} strokeWidth="2" strokeLinecap="round" />
            </>
          ) : state === 'thinking' ? (
            <>
              <path
                d="M 64 68 H 74"
                stroke={accent}
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M 86 68 H 96"
                stroke={accent}
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.7"
              />
              {/* 头侧的虚线刻度环：表示正在检索 */}
              <circle
                cx="130"
                cy="50"
                r="13"
                fill="none"
                stroke={accent}
                strokeOpacity="0.4"
                strokeWidth="1"
                strokeDasharray="2.5 4.5"
              />
              <path
                d="M 130 37 A 13 13 0 0 1 143 50"
                fill="none"
                stroke={accentAlt}
                strokeOpacity="0.8"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="130" cy="37" r="1.8" fill={accent} opacity="0.9" />
              <rect x="120" y="72" width="4" height="4" fill={accent} opacity="0.45" />
              <rect x="126" y="68" width="2.5" height="2.5" fill={accent} opacity="0.3" />
              <rect x="132" y="75" width="3" height="3" fill={accent} opacity="0.35" />
            </>
          ) : state === 'working' ? (
            <>
              <path
                d="M 60 68 H 100"
                stroke={accent}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <rect x="56.6" y="64.4" width="1.4" height="7.2" fill={accent} opacity="0.55" />
              <rect x="102" y="64.4" width="1.4" height="7.2" fill={accent} opacity="0.55" />
              {/* 视线聚焦的两枚小括角 */}
              <path
                d="M 54 57 H 61 M 54 57 V 64"
                fill="none"
                stroke={accent}
                strokeOpacity="0.55"
                strokeWidth="1.2"
              />
              <path
                d="M 106 57 H 99 M 106 57 V 64"
                fill="none"
                stroke={accent}
                strokeOpacity="0.55"
                strokeWidth="1.2"
              />
              <rect x="56" y="168" width="2" height="2" fill={accent} opacity="0.8" />
              <rect x="104" y="164" width="2" height="2" fill={accent} opacity="0.8" />
            </>
          ) : (
            <>
              <path
                d="M 59 68 H 76"
                stroke={accent}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M 84 68 H 101"
                stroke={accent}
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </>
          )}

          {/* 悬浮碎块：让轮廓"碎"一点，像投影没对齐 */}
          <g
            fill="none"
            stroke={accent}
            strokeOpacity="0.32"
            transform="rotate(18 30.5 54.5)"
          >
            <rect x="26" y="50" width="9" height="9" />
            <rect x="29" y="53" width="3" height="3" fill={accent} stroke="none" opacity="0.5" />
          </g>
          <path
            d="M 128 82 L 139 89 L 128 96 Z"
            fill="none"
            stroke={accent}
            strokeOpacity="0.3"
          />
          <rect x="18" y="108" width="8" height="2" fill={accent} opacity="0.34" />
          <rect x="132" y="128" width="10" height="1.6" fill={accent} opacity="0.24" />
          <rect x="114" y="174" width="4" height="4" fill="none" stroke={accent} strokeOpacity="0.3" />
          <circle cx="40" cy="90" r="1.6" fill={accent} opacity="0.45" />
          <rect x="118" y="100" width="3" height="3" fill={accent} opacity="0.38" />

          {/* error 专属：误码切片与头顶警示块 */}
          {isError ? (
            <>
              <rect x="36" y="158" width="30" height="1.4" fill={accent} opacity="0.42" />
              <rect x="96" y="164" width="28" height="1.2" fill={accent} opacity="0.3" />
              <rect x="24" y="144" width="12" height="1" fill={accent} opacity="0.28" />
              <path
                d="M 80 6 L 94 27 H 66 Z"
                fill={accent}
                fillOpacity="0.14"
                stroke={accent}
                strokeOpacity="0.8"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <rect x="79" y="12" width="2" height="8" rx="1" fill={accent} />
              <rect x="79" y="22" width="2" height="2" rx="1" fill={accent} />
            </>
          ) : null}

          <rect x="52" y="196" width="56" height="1" fill={accent} opacity="0.14" />
        </g>
      </svg>
    )
  },
}
