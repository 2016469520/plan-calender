// ============================================================
// 果宝特攻系列 · 漫画赛璐璐
// 原创同人风演绎，非官方立绘；仅用于本地体验
//
// 美术语言：高饱和暖色底 + 放射线 / 速度线，粗描边 + 硬边高光；
// 头身比夸张（头占画面约一半），但头部必须是水果本体轮廓：
// 橙留香是整颗带颗粒果皮的橙子，菠萝吹雪是菱形格 + 尖刺冠的菠萝。
// 两人各自构图：正面迎敌 vs 侧身蓄势，不共享脸型、比例与骨架。
// ============================================================

import type { CharacterArt } from './types'

export const FRUIT_SERIES: Record<string, CharacterArt> = {
  'cheng-liuxiang': ({ expression, className, reacting }) => {
    const mouth = {
      idle: 'M86 118 Q100 130 116 113',
      happy: 'M84 112 Q100 138 118 112 Q100 128 84 112 Z',
      thinking: 'M92 120 Q100 125 108 118',
      working: 'M88 116 H114 V125 H88 Z',
      error: 'M86 120 Q92 113 98 120 Q104 127 110 118',
      sleepy: 'M92 120 Q100 124 108 119',
    } as const
    const gaze = expression === 'thinking' ? 3 : expression === 'working' ? -1 : 0

    return (
      <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
        <defs>
          <linearGradient id="clx-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="52%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <radialGradient id="clx-burst" cx="50%" cy="40%" r="52%">
            <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="clx-orange" cx="36%" cy="30%" r="74%">
            <stop offset="0%" stopColor="#ffd9a8" />
            <stop offset="52%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </radialGradient>
          <linearGradient id="clx-leaf" x1="0" y1="1" x2="0.4" y2="0">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="60%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </linearGradient>
          <linearGradient id="clx-green" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="58%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="clx-sword" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <clipPath id="clx-head">
            <circle cx="100" cy="96" r="58" />
          </clipPath>
        </defs>
        <g transform={reacting ? 'translate(0 -3)' : undefined}>
          {/* 橙色放射背景 */}
          <rect x="-6" y="-6" width="212" height="272" fill="url(#clx-sky)" />
          <circle cx="100" cy="116" r="96" fill="url(#clx-burst)" />
          <circle cx="100" cy="96" r="68" fill="none" stroke="#fde047" strokeWidth="7" opacity="0.5" />
          <path d="M100 150 L100 -80 M100 150 L330 150 M100 150 L100 380 M100 150 L-130 150 M100 150 L270 -20 M100 150 L-70 -20 M100 150 L270 320 M100 150 L-70 320" stroke="#fde047" strokeWidth="9" opacity="0.3" />
          <g fill="#9a3412" opacity="0.16">
            <circle cx="18" cy="26" r="3" />
            <circle cx="32" cy="14" r="2" />
            <circle cx="46" cy="30" r="2.4" />
            <circle cx="176" cy="22" r="2.6" />
            <circle cx="188" cy="38" r="2" />
            <circle cx="14" cy="196" r="2.6" />
            <circle cx="26" cy="214" r="2" />
            <circle cx="184" cy="206" r="2.4" />
            <circle cx="172" cy="228" r="2" />
          </g>
          <g stroke="#7c2d12" strokeWidth="2.4" strokeLinecap="round" opacity="0.35">
            <path d="M16 70 L36 62" />
            <path d="M10 86 L28 80" />
            <path d="M168 118 L190 110" />
            <path d="M162 136 L184 130" />
          </g>

          {/* 绿衣 + 腰带 */}
          <path d="M56 170 L100 156 L144 170 L152 224 L146 260 H54 L48 224 Z" fill="url(#clx-green)" stroke="#14532d" strokeWidth="2.4" />
          <path d="M86 166 L100 182 L114 166 L120 260 H80 Z" fill="#fff7ed" stroke="#d6d3d1" strokeWidth="1.6" />
          <path d="M54 216 H146 L148 232 H52 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <path d="M90 216 H110 L110 232 H90 Z" fill="#7c2d12" />
          <path d="M62 238 L84 234 M64 248 L86 244" stroke="#166534" strokeWidth="1.6" opacity="0.6" />
          <path d="M78 162 L100 180 L122 162 L132 172 L100 196 L68 172 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
          <path d="M78 162 L100 180 L122 162" stroke="#bbf7d0" strokeWidth="2" fill="none" />
          <path d="M54 168 L42 180 L48 200 L64 196 L68 178 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.2" />
          <path d="M146 168 L158 180 L152 200 L136 196 L132 178 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.2" />
          <path d="M62 232 H96 L92 260 H58 Z" fill="#15803d" stroke="#14532d" strokeWidth="2.2" />
          <path d="M104 232 H138 L142 260 H108 Z" fill="#15803d" stroke="#14532d" strokeWidth="2.2" />

          {/* 前伸的左拳 */}
          <path d="M62 170 L44 180 L32 194 L42 210 L60 200 L68 184 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.2" />
          <path d="M36 182 L46 176 L56 182 L54 192 L42 196 Z" fill="#bbf7d0" opacity="0.5" />
          <path d="M24 190 L36 182 L48 188 L46 202 L34 208 L22 200 Z" fill="#fde68a" stroke="#b45309" strokeWidth="2.2" />
          <path d="M30 188 L38 185 M28 193 L36 190 M26 198 L34 195" stroke="#b45309" strokeWidth="1.4" opacity="0.8" />

          {/* 举剑的右臂 + 长剑 */}
          <path d="M136 170 L156 184 L164 202 L152 216 L140 204 L130 186 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.2" />
          <path d="M150 188 L158 194 L156 204 L146 198 Z" fill="#bbf7d0" opacity="0.45" />
          <path d="M156 188 L186 84 L194 90 L160 196 Z" fill="url(#clx-sword)" stroke="#334155" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M170 160 L189 92" stroke="#ffffff" strokeWidth="2.4" opacity="0.8" />
          <path d="M186 84 L194 90 L198 74 Z" fill="#f1f5f9" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
          <path d="M144 206 L158 192 L166 200 L152 214 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
          <path d="M138 216 L148 206 L154 212 L144 222 Z" fill="#7c2d12" stroke="#451a03" strokeWidth="2" />
          <path d="M140 214 L146 208 M143 218 L149 212" stroke="#fcd34d" strokeWidth="1.4" />
          <circle cx="140" cy="224" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.8" />
          <path d="M142 206 L154 200 L162 210 L154 220 L144 218 Z" fill="#fde68a" stroke="#b45309" strokeWidth="2.2" />
          <path d="M146 204 L152 212 M150 201 L156 209 M154 199 L160 207" stroke="#b45309" strokeWidth="1.3" opacity="0.8" />

          {/* 整颗橙子做头部 */}
          <circle cx="100" cy="96" r="58" fill="url(#clx-orange)" stroke="#9a3412" strokeWidth="2.6" />
          <g clipPath="url(#clx-head)">
            <ellipse cx="142" cy="122" rx="48" ry="54" fill="#c2410c" opacity="0.3" />
            <ellipse cx="100" cy="160" rx="74" ry="30" fill="#9a3412" opacity="0.22" />
            <ellipse cx="72" cy="62" rx="32" ry="22" fill="#ffedd5" opacity="0.5" transform="rotate(-28 72 62)" />
            <path d="M42 92 C46 58 70 40 100 38" fill="none" stroke="#fff7ed" strokeWidth="4" opacity="0.45" />
            <g fill="#b45309" opacity="0.42">
              <circle cx="58" cy="66" r="2.2" />
              <circle cx="88" cy="45" r="2.4" />
              <circle cx="126" cy="50" r="1.7" />
              <circle cx="140" cy="68" r="2.1" />
              <circle cx="148" cy="88" r="1.8" />
              <circle cx="146" cy="110" r="2.2" />
              <circle cx="138" cy="130" r="1.6" />
              <circle cx="120" cy="146" r="2" />
              <circle cx="100" cy="152" r="1.7" />
              <circle cx="80" cy="146" r="2.1" />
              <circle cx="62" cy="132" r="1.8" />
              <circle cx="50" cy="92" r="2.1" />
            </g>
            <g fill="#ffedd5" opacity="0.35">
              <circle cx="64" cy="58" r="1.2" />
              <circle cx="82" cy="48" r="1" />
              <circle cx="118" cy="48" r="1.2" />
              <circle cx="94" cy="140" r="1.2" />
            </g>
            <g fill="none" stroke="#b45309" strokeWidth="1.4" opacity="0.4">
              <path d="M76 50 q4 4 9 3" />
              <path d="M118 46 q-4 5 -9 4" />
              <path d="M138 78 q-5 2 -7 7" />
              <path d="M92 142 q5 -2 9 1" />
            </g>
          </g>

          {/* 顶部绿叶 */}
          <path d="M98 40 C90 20 104 6 124 6 C120 26 110 36 98 40 Z" fill="url(#clx-leaf)" stroke="#166534" strokeWidth="2.2" />
          <path d="M100 38 C105 26 112 15 122 9" fill="none" stroke="#166534" strokeWidth="1.6" />
          <path d="M96 40 C84 30 82 14 92 4 C98 18 101 30 96 40 Z" fill="#4ade80" stroke="#166534" strokeWidth="2" />
          <path d="M96 38 C94 28 93 18 94 10" fill="none" stroke="#166534" strokeWidth="1.4" opacity="0.8" />
          <path d="M100 36 C98 42 98 46 100 50" fill="none" stroke="#166534" strokeWidth="2" />

          {/* 五官：橙子皮上的动画脸 */}
          {expression === 'working' || expression === 'error' ? (
            <path d="M58 66 L88 78 M112 78 L142 66" stroke="#7c2d12" strokeWidth="4.4" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M58 74 L88 68 M112 68 L142 74" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" fill="none" />
          )}
          {expression === 'happy' ? (
            <path d="M62 98 Q74 82 88 96 M112 96 Q126 82 138 98" stroke="#7c2d12" strokeWidth="5" strokeLinecap="round" fill="none" />
          ) : expression === 'sleepy' ? (
            <path d="M62 98 Q74 104 88 96 M112 96 Q126 104 138 98" stroke="#7c2d12" strokeWidth="4.6" strokeLinecap="round" fill="none" />
          ) : expression === 'error' ? (
            <path d="M64 84 L86 106 M86 84 L64 106 M114 84 L136 106 M136 84 L114 106" stroke="#7c2d12" strokeWidth="5" strokeLinecap="round" fill="none" />
          ) : (
            <g>
              <path d="M56 97 Q69 78 90 93 Q77 111 56 97 Z" fill="#fff7ed" stroke="#7c2d12" strokeWidth="2.6" />
              <path d="M110 93 Q131 78 144 97 Q123 111 110 93 Z" fill="#fff7ed" stroke="#7c2d12" strokeWidth="2.6" />
              <circle cx={72 + gaze} cy="95" r="10.5" fill="#b45309" />
              <circle cx={128 + gaze} cy="95" r="10.5" fill="#b45309" />
              <circle cx={72 + gaze} cy="95" r="5" fill="#3b1508" />
              <circle cx={128 + gaze} cy="95" r="5" fill="#3b1508" />
              <circle cx={68 + gaze} cy="90" r="3.2" fill="#ffffff" />
              <circle cx={124 + gaze} cy="90" r="3.2" fill="#ffffff" />
            </g>
          )}
          <path d="M96 108 Q100 112 104 108" stroke="#9a3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d={mouth[expression]} stroke="#7c2d12" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill={expression === 'happy' ? '#7c2d12' : 'none'} />
          {expression === 'happy' ? <path d="M92 117 Q100 123 108 117" stroke="#fff7ed" strokeWidth="2.2" fill="none" /> : null}
          {expression === 'working' ? <path d="M93 116 V125 M100 116 V125 M107 116 V125" stroke="#fff7ed" strokeWidth="1.8" /> : null}
          <ellipse cx="64" cy="112" rx="7" ry="4" fill="#c2410c" opacity="0.35" />
          <ellipse cx="136" cy="112" rx="7" ry="4" fill="#c2410c" opacity="0.35" />

          {/* 表情小符号 */}
          {expression === 'happy' ? (
            <g fill="#fef08a" stroke="#b45309" strokeWidth="0.8">
              <path d="M156 52 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
              <path d="M36 44 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
            </g>
          ) : null}
          {expression === 'thinking' ? (
            <g fill="#7c2d12" opacity="0.55">
              <circle cx="152" cy="58" r="2.6" />
              <circle cx="160" cy="50" r="1.8" />
              <circle cx="166" cy="60" r="1.2" />
            </g>
          ) : null}
          {expression === 'working' ? (
            <g stroke="#7c2d12" strokeWidth="2.6" strokeLinecap="round" opacity="0.5">
              <path d="M150 150 L170 142" />
              <path d="M146 162 L166 156" />
              <path d="M32 152 L16 146" />
            </g>
          ) : null}
          {expression === 'error' ? (
            <g fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round">
              <path d="M150 96 L158 88 L156 100 L164 96 L160 106" />
              <path d="M146 150 q5 8 0 14 q-5 6 0 12" stroke="#38bdf8" />
            </g>
          ) : null}
          {expression === 'sleepy' ? (
            <g fill="none" stroke="#7c2d12" strokeWidth="1.8" opacity="0.55">
              <circle cx="152" cy="54" r="4" />
              <circle cx="162" cy="42" r="2.6" />
              <path d="M148 68 H158" />
            </g>
          ) : null}
        </g>
      </svg>
    )
  },

  'boluo-chuixue': ({ expression, className, reacting }) => {
    const mouth = {
      idle: 'M104 128 Q116 134 128 124',
      happy: 'M102 124 Q116 140 130 122 Q116 132 102 124 Z',
      thinking: 'M106 130 Q116 132 126 126',
      working: 'M104 126 H126 V134 H104 Z',
      error: 'M104 130 Q110 124 116 130 Q122 136 128 128',
      sleepy: 'M108 130 Q116 133 124 128',
    } as const
    const gaze = expression === 'thinking' ? 2 : expression === 'working' ? -1 : 0

    return (
      <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
        <defs>
          <linearGradient id="blcx-sky" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#f7fee7" />
            <stop offset="52%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>
          <radialGradient id="blcx-burst" cx="50%" cy="38%" r="54%">
            <stop offset="0%" stopColor="#fefce8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fefce8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blcx-gold" cx="36%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <linearGradient id="blcx-leaf" x1="0" y1="1" x2="0.3" y2="0">
            <stop offset="0%" stopColor="#65a30d" />
            <stop offset="42%" stopColor="#facc15" />
            <stop offset="74%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fef9c3" />
          </linearGradient>
          <linearGradient id="blcx-green" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="blcx-sword" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <clipPath id="blcx-head">
            <path d="M62 60 C62 50 78 44 104 44 C130 44 146 50 146 60 L148 104 C148 134 128 156 104 160 C80 156 60 134 60 104 Z" />
          </clipPath>
        </defs>
        <g transform={reacting ? 'translate(0 -3)' : undefined}>
          {/* 黄绿斜向速度线背景 */}
          <rect x="-6" y="-6" width="212" height="272" fill="url(#blcx-sky)" />
          <circle cx="104" cy="106" r="96" fill="url(#blcx-burst)" />
          <path d="M-30 46 L96 -46 M-10 132 L140 10 M30 232 L196 92 M96 268 L212 172" stroke="#ffffff" strokeWidth="14" strokeLinecap="butt" opacity="0.42" />
          <path d="M-24 88 L108 -10 M-18 196 L160 46 M76 262 L212 150" stroke="#65a30d" strokeWidth="10" strokeLinecap="butt" opacity="0.45" />
          <path d="M-16 112 L118 12 M42 254 L186 136" stroke="#3f6212" strokeWidth="4" strokeLinecap="butt" opacity="0.3" />
          <path d="M20 230 L46 208 M150 246 L176 226 M14 24 L34 8" stroke="#fefce8" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          <g fill="#4d7c0f" opacity="0.16">
            <circle cx="20" cy="42" r="2.6" />
            <circle cx="16" cy="120" r="2.2" />
            <circle cx="30" cy="150" r="1.6" />
            <circle cx="176" cy="60" r="2.4" />
            <circle cx="190" cy="84" r="1.8" />
            <circle cx="18" cy="244" r="2.4" />
            <circle cx="186" cy="224" r="2" />
          </g>
          <g fill="#fef08a" stroke="#a16207" strokeWidth="0.7" opacity="0.85">
            <path d="M40 78 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
            <path d="M168 178 l2 4.5 4.5 2 -4.5 2 -2 4.5 -2 -4.5 -4.5 -2 4.5 -2z" />
          </g>

          {/* 侧身绿衣 + 腰带 */}
          <path d="M62 168 L102 158 L140 170 L146 216 L138 260 H66 L56 216 Z" fill="url(#blcx-green)" stroke="#14532d" strokeWidth="2.6" />
          <path d="M96 166 L104 186 L116 166 L112 260 H88 Z" fill="#f7fee7" stroke="#bef264" strokeWidth="1.6" />
          <path d="M60 178 L138 206 L134 220 L56 192 Z" fill="#bef264" stroke="#4d7c0f" strokeWidth="2.2" />
          <path d="M56 222 H144 L142 236 H58 Z" fill="#365314" stroke="#1a2e05" strokeWidth="2" />
          <path d="M94 222 H110 V236 H94 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.6" />
          <path d="M70 238 L96 236 M72 248 L98 246" stroke="#166534" strokeWidth="1.6" opacity="0.55" />
          <path d="M70 236 H102 L98 260 H62 Z" fill="#15803d" stroke="#14532d" strokeWidth="2.2" />
          <path d="M106 236 H138 L144 260 H106 Z" fill="#15803d" stroke="#14532d" strokeWidth="2.2" />
          <path d="M134 168 L158 180 L160 200 L142 208 L130 188 Z" fill="#4ade80" stroke="#14532d" strokeWidth="2.4" />
          <path d="M146 176 L154 182 L152 192 L143 186 Z" fill="#dcfce7" opacity="0.6" />
          <path d="M62 176 L50 194 L54 214 L66 220 L72 202 L70 186 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2.2" />
          <path d="M62 178 L58 196 L64 206 L70 190 Z" fill="#86efac" opacity="0.4" />

          {/* 横在身前的短剑 */}
          <path d="M76 198 L126 202 L128 210 L78 212 Q72 206 76 198 Z" fill="url(#blcx-sword)" stroke="#475569" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M80 202 L124 205" stroke="#ffffff" strokeWidth="1.8" opacity="0.85" />
          <path d="M124 190 L138 192 L138 220 L124 218 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
          <path d="M136 202 H152 V212 H136 Z" fill="#7c2d12" stroke="#451a03" strokeWidth="2" />
          <path d="M138 204 L138 210 M145 205 L145 210 M151 205 L151 210" stroke="#fcd34d" strokeWidth="1.4" />
          <path d="M135 197 L154 199 L157 217 L137 217 Z" fill="#fde68a" stroke="#b45309" strokeWidth="2.2" />
          <path d="M139 200 L139 213 M146 201 L146 214 M153 202 L153 214" stroke="#b45309" strokeWidth="1.3" opacity="0.8" />
          <path d="M138 172 L158 184 L166 200 L156 214 L140 208 L132 188 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2.4" />
          <path d="M150 184 L158 190 L156 200 L146 194 Z" fill="#bbf7d0" opacity="0.5" />

          {/* 菠萝头：菱形格 + 尖刺冠，略向剑侧倾斜 */}
          <g transform="rotate(4 108 112)">
          <path d="M62 60 C62 50 78 44 104 44 C130 44 146 50 146 60 L148 104 C148 134 128 156 104 160 C80 156 60 134 60 104 Z" fill="url(#blcx-gold)" stroke="#92400e" strokeWidth="2.6" />
          <g clipPath="url(#blcx-head)">
            <g stroke="#b45309" strokeWidth="1.9" opacity="0.55">
              <path d="M40 -4 L170 126 M40 22 L170 152 M40 48 L170 178 M40 74 L170 204 M40 100 L170 230 M40 126 L170 256 M40 152 L170 282" />
              <path d="M40 210 L170 80 M40 236 L170 106 M40 184 L170 54 M40 158 L170 28 M40 132 L170 2 M40 106 L170 -24 M40 80 L170 -50" />
            </g>
            <g fill="#b45309" opacity="0.28">
              <path d="M104 78 l13 13 -13 13 -13 -13z" />
              <path d="M130 116 l11 11 -11 11 -11 -11z" />
              <path d="M80 120 l10 10 -10 10 -10 -10z" />
              <path d="M110 140 l9 9 -9 9 -9 -9z" />
              <path d="M74 90 l9 9 -9 9 -9 -9z" />
            </g>
            <ellipse cx="78" cy="66" rx="26" ry="16" fill="#fef3c7" opacity="0.45" transform="rotate(-24 78 66)" />
            <path d="M148 128 C142 146 126 156 108 160 L150 160 Z" fill="#b45309" opacity="0.28" />
            <g fill="#7c2d12" opacity="0.4">
              <circle cx="84" cy="76" r="1.5" />
              <circle cx="110" cy="72" r="1.5" />
              <circle cx="96" cy="96" r="1.4" />
              <circle cx="126" cy="94" r="1.5" />
              <circle cx="78" cy="112" r="1.4" />
              <circle cx="118" cy="116" r="1.5" />
              <circle cx="98" cy="134" r="1.4" />
              <circle cx="136" cy="132" r="1.4" />
              <circle cx="70" cy="90" r="1.3" />
            </g>
          </g>

          {/* 黄色尖刺冠 */}
          <path d="M64 56 L46 36 L70 46 Z" fill="url(#blcx-leaf)" stroke="#3f6212" strokeWidth="2" strokeLinejoin="round" />
          <path d="M76 50 L66 24 L88 40 Z" fill="url(#blcx-leaf)" stroke="#3f6212" strokeWidth="2" strokeLinejoin="round" />
          <path d="M90 46 L88 20 L100 40 Z" fill="url(#blcx-leaf)" stroke="#3f6212" strokeWidth="2" strokeLinejoin="round" />
          <path d="M104 44 L112 22 L116 42 Z" fill="url(#blcx-leaf)" stroke="#3f6212" strokeWidth="2" strokeLinejoin="round" />
          <path d="M118 46 L134 26 L128 42 Z" fill="url(#blcx-leaf)" stroke="#3f6212" strokeWidth="2" strokeLinejoin="round" />
          <path d="M130 54 L152 34 L138 50 Z" fill="url(#blcx-leaf)" stroke="#3f6212" strokeWidth="2" strokeLinejoin="round" />
          <path d="M52 42 L68 50 M70 32 L82 46 M92 26 L98 44 M110 28 L112 42 M130 32 L126 46 M144 40 L136 50" stroke="#4d7c0f" strokeWidth="1.3" opacity="0.65" />
          {/* 绿发带 + 飘带 */}
          <path d="M62 68 C82 60 128 60 146 68 L147 82 C128 74 82 74 63 82 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2.2" />
          <path d="M64 70 C84 63 126 63 145 71" stroke="#bbf7d0" strokeWidth="1.8" fill="none" opacity="0.6" />
          <path d="M146 70 L160 62 L156 74 L170 72 L156 84 L146 80 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
          <path d="M150 82 C160 92 170 96 182 94 L178 104 C164 106 152 98 146 88 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
          <path d="M154 86 C162 92 170 95 178 96" stroke="#bbf7d0" strokeWidth="1.4" fill="none" opacity="0.6" />

          {/* 侧脸五官 */}
          {expression === 'working' || expression === 'error' ? (
            <g stroke="#7c2d12" strokeWidth="3.2" strokeLinecap="round" fill="none">
              <path d="M76 90 L96 96" />
              <path d="M112 96 L134 88" />
            </g>
          ) : (
            <g stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M76 88 L96 84" />
              <path d="M112 84 L134 88" />
            </g>
          )}
          {expression === 'happy' ? (
            <path d="M78 108 Q88 96 98 106 M114 106 Q124 94 136 106" stroke="#7c2d12" strokeWidth="4.6" strokeLinecap="round" fill="none" />
          ) : expression === 'sleepy' ? (
            <path d="M78 108 Q88 114 98 106 M114 106 Q124 112 136 106" stroke="#7c2d12" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          ) : expression === 'error' ? (
            <path d="M80 96 L98 114 M98 96 L80 114 M116 96 L134 114 M134 96 L116 114" stroke="#7c2d12" strokeWidth="4.6" strokeLinecap="round" fill="none" />
          ) : (
            <g>
              <path d="M78 106 Q86 94 98 104 Q88 114 78 106 Z" fill="#fff7ed" stroke="#7c2d12" strokeWidth="2.2" />
              <path d="M112 104 Q126 92 138 106 Q124 116 112 104 Z" fill="#fff7ed" stroke="#7c2d12" strokeWidth="2.2" />
              <circle cx={90 + gaze} cy="105" r="5.5" fill="#4d7c0f" />
              <circle cx={124 + gaze} cy="103" r="7" fill="#4d7c0f" />
              <circle cx={90 + gaze} cy="105" r="2.6" fill="#1a2e05" />
              <circle cx={124 + gaze} cy="103" r="3.4" fill="#1a2e05" />
              <circle cx={88 + gaze} cy="103" r="1.8" fill="#ffffff" />
              <circle cx={122 + gaze} cy="101" r="2.2" fill="#ffffff" />
            </g>
          )}
          <path d="M108 116 Q112 119 116 116" stroke="#92400e" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d={mouth[expression]} stroke="#7c2d12" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill={expression === 'happy' ? '#7c2d12' : 'none'} />
          {expression === 'happy' ? <path d="M108 126 Q116 131 124 125" stroke="#fff7ed" strokeWidth="2.2" fill="none" /> : null}
          {expression === 'working' ? <path d="M109 126 V134 M116 126 V134 M123 126 V134" stroke="#fff7ed" strokeWidth="1.7" /> : null}
          <path d="M138 112 L144 108" stroke="#92400e" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
          </g>

          {/* 表情小符号 */}
          {expression === 'happy' ? (
            <g fill="#fef08a" stroke="#a16207" strokeWidth="0.8">
              <path d="M160 116 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
              <path d="M32 124 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
            </g>
          ) : null}
          {expression === 'thinking' ? (
            <g fill="#4d7c0f" opacity="0.55">
              <circle cx="160" cy="124" r="2.6" />
              <circle cx="168" cy="116" r="1.8" />
              <circle cx="174" cy="126" r="1.2" />
            </g>
          ) : null}
          {expression === 'working' ? (
            <g stroke="#4d7c0f" strokeWidth="2.4" strokeLinecap="round" opacity="0.55">
              <path d="M28 210 L10 202" />
              <path d="M26 224 L8 218" />
              <path d="M174 158 L192 150" />
            </g>
          ) : null}
          {expression === 'error' ? (
            <g fill="none" strokeLinecap="round">
              <path d="M160 150 L168 142 L166 154 L174 150 L170 160" stroke="#7c2d12" strokeWidth="2" />
              <path d="M40 96 q5 8 0 14 q-5 6 0 12" stroke="#38bdf8" strokeWidth="2" />
            </g>
          ) : null}
          {expression === 'sleepy' ? (
            <g fill="none" stroke="#4d7c0f" strokeWidth="1.8" opacity="0.5">
              <circle cx="160" cy="120" r="4" />
              <circle cx="170" cy="108" r="2.6" />
              <path d="M156 134 H166" />
            </g>
          ) : null}
        </g>
      </svg>
    )
  },
}
