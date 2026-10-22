// ============================================================
// 机甲 / 科幻 / 热血系列
// 原创同人风演绎，非官方立绘；仅用于本地体验
//
// 美术语言：深空底色（近黑蓝 → 暗红或暗紫）+ 几何能量环 / 格栅 / 星点；
// 人物由硬边多边形面片搭成，高光边代替圆润阴影，只在描边、眼灯、
// 能量核等小面积处使用 feGaussianBlur 外发光。
// 每个角色的头型、肩线、外轮廓与背景几何都单独设计，不共享骨架。
// ============================================================

import type { CharacterArt } from './types'

export const MECHA_SERIES: Record<string, CharacterArt> = {
  huolinfei: ({ expression, className, reacting }) => {
    const eyeLeft = {
      idle: 'M78 78 H94',
      happy: 'M78 84 Q86 73 94 81',
      thinking: 'M80 79 H92',
      working: 'M79 75 L94 82',
      error: 'M78 74 L94 86 M94 74 L78 86',
      sleepy: 'M80 82 H92',
    } as const
    const eyeRight = {
      idle: 'M106 78 H122',
      happy: 'M106 81 Q114 73 122 84',
      thinking: 'M108 79 H120',
      working: 'M106 82 L121 75',
      error: 'M106 74 L122 86 M122 74 L106 86',
      sleepy: 'M108 82 H120',
    } as const
    const glow = expression === 'error' ? '#ff4d4d' : expression === 'sleepy' ? '#e2892f' : '#ffb84d'
    const glowOpacity = expression === 'sleepy' ? 0.4 : expression === 'error' ? 0.9 : 0.85

    return (
      <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
        <defs>
          <linearGradient id="hlf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05060f" /><stop offset="55%" stopColor="#1a0410" /><stop offset="100%" stopColor="#3b0a12" />
          </linearGradient>
          <radialGradient id="hlf-halo" cx="50%" cy="44%" r="52%">
            <stop offset="0%" stopColor="#ff6a2a" stopOpacity="0.4" /><stop offset="100%" stopColor="#ff6a2a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hlf-armor" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#ff6b3d" /><stop offset="48%" stopColor="#d31d2c" /><stop offset="100%" stopColor="#8c1220" />
          </linearGradient>
          <linearGradient id="hlf-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a0f1c" /><stop offset="100%" stopColor="#24060c" />
          </linearGradient>
          <linearGradient id="hlf-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe8a3" /><stop offset="100%" stopColor="#f5a623" />
          </linearGradient>
          <linearGradient id="hlf-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#c2410c" /><stop offset="55%" stopColor="#fb923c" /><stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="hlf-fist" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#ef4a44" /><stop offset="100%" stopColor="#7b0d16" />
          </linearGradient>
          <filter id="hlf-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
        <g transform={reacting ? 'translate(0 -3)' : undefined}>
          {/* 深空 + 六边形能量环 + 底部格栅 */}
          <rect x="-6" y="-6" width="212" height="272" fill="url(#hlf-sky)" /><ellipse cx="100" cy="112" rx="84" ry="82" fill="url(#hlf-halo)" />
          <path d="M100 26 L180 72 V164 L100 210 L20 164 V72 Z" fill="none" stroke="#fb923c" strokeWidth="1.2" opacity="0.28" />
          <path d="M100 44 L164 82 V152 L100 190 L36 152 V82 Z" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.15" />
          <circle cx="100" cy="118" r="92" fill="none" stroke="#ffb347" strokeWidth="1.4" strokeDasharray="30 240" transform="rotate(-38 100 118)" opacity="0.45" />
          <circle cx="100" cy="118" r="84" fill="none" stroke="#ff7a45" strokeWidth="1" strokeDasharray="14 320" transform="rotate(150 100 118)" opacity="0.5" />
          <path d="M100 30 V10 M172 74 L192 62 M28 74 L8 62" stroke="#ffb347" strokeWidth="1.2" opacity="0.26" />
          <path d="M14 208 H186 M14 219 H186 M14 230 H186 M14 241 H186" stroke="#f97316" strokeWidth="1" opacity="0.1" /><path d="M-10 224 L196 32 L204 44 L-2 236 Z" fill="#f97316" opacity="0.12" />
          <circle cx="30" cy="42" r="1.5" fill="#ffd7a8" opacity="0.8" /><circle cx="54" cy="26" r="1" fill="#ffedd5" opacity="0.7" />
          <circle cx="168" cy="40" r="1.7" fill="#ffd7a8" opacity="0.75" /><circle cx="182" cy="96" r="1.1" fill="#ffedd5" opacity="0.6" />
          <circle cx="16" cy="104" r="1.3" fill="#ffd7a8" opacity="0.7" /><circle cx="178" cy="182" r="1" fill="#ffd7a8" opacity="0.5" />
          <circle cx="22" cy="168" r="1.6" fill="#ffedd5" opacity="0.55" /><circle cx="150" cy="16" r="1.2" fill="#ffd7a8" opacity="0.65" />
          <circle cx="64" cy="16" r="1" fill="#ffedd5" opacity="0.5" />

          {/* 远侧手臂 */}
          <path d="M138 172 L158 186 L166 216 L156 252 L136 250 L146 214 L130 188 Z" fill="#8c1220" stroke="#48060f" strokeWidth="1.4" /><path d="M146 214 L166 216 L162 236 L144 232 Z" fill="#6d0a13" stroke="#48060f" strokeWidth="1" />

          {/* 躯干：宽肩重甲 + 斜向能量槽 */}
          <path d="M78 118 L100 128 L122 118 L134 128 L100 142 L66 128 Z" fill="#5a0f1c" stroke="#2a060d" strokeWidth="1.2" />
          <path d="M62 124 H138 L146 168 L134 214 H66 L54 168 Z" fill="url(#hlf-armor)" stroke="#48060f" strokeWidth="1.5" />
          <path d="M62 124 L78 138 L70 206 L66 214 L54 168 Z" fill="#ff9d6b" opacity="0.2" /><path d="M138 124 L120 142 L128 208 L134 214 L146 168 Z" fill="#6d0a13" opacity="0.55" />
          <path d="M78 118 L100 132 L122 118" stroke="#f5a623" strokeWidth="2" opacity="0.9" /><path d="M62 196 L138 148 L144 158 L68 206 Z" fill="#2a060d" stroke="#48060f" strokeWidth="1" />
          <path d="M66 199 L142 151" stroke="#fb923c" strokeWidth="6" filter="url(#hlf-glow)" opacity="0.8" /><path d="M66 199 L142 151" stroke="#ffd28a" strokeWidth="2.2" opacity="0.95" />
          <path d="M78 192 L80 199 M92 184 L94 191 M106 176 L108 183 M120 168 L122 175" stroke="#ffb347" strokeWidth="1.5" opacity="0.8" /><circle cx="64" cy="199" r="3" fill="#ffe0a3" />
          <path d="M84 208 H116 L112 218 H88 Z" fill="#3a0a12" stroke="#48060f" strokeWidth="1" /><path d="M92 211 V215 M100 211 V215 M108 211 V215" stroke="#ff8f5e" strokeWidth="1.2" opacity="0.6" />
          <path d="M74 218 H126 L132 244 H68 Z" fill="url(#hlf-dark)" stroke="#2a060d" strokeWidth="1.2" /><path d="M78 226 H122 M76 234 H124" stroke="#8c1220" strokeWidth="1" opacity="0.7" />
          <path d="M64 244 H136 L138 252 H62 Z" fill="#f5a623" opacity="0.85" /><path d="M92 244 L100 240 L108 244 L100 251 Z" fill="#7b0d16" />
          <path d="M56 252 L72 248 L68 260 H48 Z" fill="#8c1220" stroke="#48060f" strokeWidth="1" /><path d="M144 252 L128 248 L132 260 H152 Z" fill="#8c1220" stroke="#48060f" strokeWidth="1" />

          {/* 左肩重甲（三层片 + 铆钉） */}
          <path d="M24 150 L30 126 L58 116 L74 128 L70 158 L52 178 L28 172 Z" fill="url(#hlf-armor)" stroke="#48060f" strokeWidth="1.5" />
          <path d="M32 130 L58 120 L72 128 L64 142 L38 146 Z" fill="#ff9d6b" opacity="0.4" /><path d="M30 126 L58 116 L74 128" stroke="#ffd7a8" strokeWidth="1.2" opacity="0.75" />
          <path d="M38 150 L68 144 L62 172 L44 176 Z" fill="#a30f1c" stroke="#48060f" strokeWidth="1" /><circle cx="46" cy="136" r="2.2" fill="#ffe8a3" />
          <circle cx="60" cy="158" r="1.8" fill="#ffe8a3" opacity="0.8" /><path d="M140 116 L166 126 L176 150 L172 172 L148 178 L132 158 L136 128 Z" fill="url(#hlf-armor)" stroke="#48060f" strokeWidth="1.5" />
          <path d="M142 120 L166 130 L170 144 L148 140 Z" fill="#ff9d6b" opacity="0.35" /><path d="M140 116 L166 126 L176 150" stroke="#ffd7a8" strokeWidth="1.2" opacity="0.65" />

          {/* 颈部 + 头部 */}
          <path d="M87 104 H113 V128 H87 Z" fill="#4a0d18" stroke="#2a060d" strokeWidth="1.2" />
          <path d="M57 66 L63 42 L86 30 H114 L137 42 L143 66 L138 92 L124 110 L100 118 L76 110 L62 92 Z" fill="url(#hlf-armor)" stroke="#48060f" strokeWidth="1.6" />
          <path d="M63 42 L86 30 L100 48 L74 58 Z" fill="#ff9d6b" opacity="0.32" /><path d="M137 42 L114 30 L100 48 L126 60 L138 74 Z" fill="#4a0712" opacity="0.45" />
          <path d="M63 54 L100 44 L137 54 V62 L100 52 L63 62 Z" fill="url(#hlf-gold)" stroke="#a35a06" strokeWidth="0.9" />
          <path d="M73 70 L100 63 L127 70 L124 90 L100 96 L76 90 Z" fill="#17040a" stroke="#ff7a45" strokeWidth="1" /><path d="M76 73 L100 67 L124 73 L122 87 L100 92 L78 87 Z" fill="#2a0710" />
          <g filter="url(#hlf-glow)" stroke={glow} strokeWidth="5.5" strokeLinecap="round" fill="none" opacity={glowOpacity}>
            <path d={eyeLeft[expression]} /><path d={eyeRight[expression]} />
          </g>
          <g stroke="#ffe9b0" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d={eyeLeft[expression]} /><path d={eyeRight[expression]} />
          </g>
          <path d="M62 92 L76 110 L74 88 Z" fill="#8c1220" stroke="#48060f" strokeWidth="1" /><path d="M138 92 L124 110 L126 88 Z" fill="#8c1220" stroke="#48060f" strokeWidth="1" />
          <path d="M57 66 L39 76 L56 88 Z" fill="url(#hlf-gold)" stroke="#a35a06" strokeWidth="0.9" /><path d="M143 66 L161 76 L144 88 Z" fill="url(#hlf-gold)" stroke="#a35a06" strokeWidth="0.9" />
          <path d="M78 98 L122 98 L116 112 L84 112 Z" fill="url(#hlf-dark)" stroke="#2a060d" strokeWidth="1.2" /><path d="M88 101 V108 M100 101 V108 M112 101 V108" stroke="#ff8f5e" strokeWidth="1.4" opacity="0.55" />
          <path d="M84 112 L116 112 L110 122 L90 122 Z" fill="#6d0a13" stroke="#2a060d" strokeWidth="1" /><circle cx="68" cy="84" r="1.8" fill="#ffe8a3" opacity="0.8" />
          <circle cx="132" cy="84" r="1.8" fill="#ffe8a3" opacity="0.8" />

          {/* 三簇火焰头冠 */}
          <ellipse cx="100" cy="30" rx="26" ry="9" fill="#fb923c" opacity="0.28" filter="url(#hlf-glow)" /><path d="M80 40 L68 28 L74 20 L72 8 L82 18 L86 30 L84 40 Z" fill="url(#hlf-flame)" stroke="#9a3412" strokeWidth="0.9" />
          <path d="M90 38 L86 22 L96 6 L100 18 L106 0 L108 20 L112 34 L108 40 Z" fill="url(#hlf-flame)" stroke="#9a3412" strokeWidth="0.9" />
          <path d="M120 40 L132 28 L126 20 L128 8 L118 18 L114 30 L116 40 Z" fill="url(#hlf-flame)" stroke="#9a3412" strokeWidth="0.9" />
          <path d="M96 34 L94 22 L100 12 L104 24 L104 34 Z" fill="#fff3c4" opacity="0.75" /><path d="M74 26 L78 18 M126 26 L122 18" stroke="#ffe8a3" strokeWidth="1" opacity="0.6" />

          {/* 举在胸前的右拳 */}
          <path d="M64 196 L86 188 L80 228 L58 246 L42 230 Z" fill="#8c1220" stroke="#2a060d" strokeWidth="1.6" />
          <path d="M46 226 L60 240 L54 252 L40 240 Z" fill="url(#hlf-gold)" stroke="#a35a06" strokeWidth="0.9" /><path d="M66 200 L84 194" stroke="#ff8f5e" strokeWidth="1.2" opacity="0.4" />
          <path d="M46 168 L51 152 L68 143 L85 152 L89 169 L82 186 L63 192 L48 183 Z" fill="url(#hlf-fist)" stroke="#1a0408" strokeWidth="2" />
          <path d="M53 155 L68 148 L83 157 L66 165 Z" fill="#ff8a6b" opacity="0.55" /><path d="M58 160 V178 M67 162 V182 M76 164 V184" stroke="#3a0610" strokeWidth="1.3" opacity="0.85" />
          <path d="M45 171 L53 164 L57 183 L49 189 Z" fill="#7b0d16" stroke="#1a0408" strokeWidth="1.2" />
          <path d="M62 185 L85 177 L88 187 L65 195 Z" fill="url(#hlf-gold)" stroke="#a35a06" strokeWidth="0.9" /><path d="M52 158 L68 150" stroke="#ffd7a8" strokeWidth="1.4" opacity="0.7" />
          <path d="M70 169 L85 163" stroke="#ff8a6b" strokeWidth="1" opacity="0.5" /><path d="M50 186 L86 177" stroke="#1a0408" strokeWidth="1.4" opacity="0.6" />

          {/* 表情小符号 */}
          {expression === 'happy' ? (
            <g fill="#ffe9a3">
              <path d="M152 58 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" /><path d="M136 44 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" opacity="0.7" />
            </g>
          ) : null}
          {expression === 'thinking' ? (
            <g fill="#ffd7a8" opacity="0.85">
              <circle cx="148" cy="58" r="2.6" /><circle cx="156" cy="50" r="1.8" />
              <circle cx="162" cy="60" r="1.3" />
            </g>
          ) : null}
          {expression === 'working' ? (
            <path d="M18 118 L34 110 M14 130 L30 124 M12 142 L26 138" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          ) : null}
          {expression === 'error' ? (
            <path d="M132 100 L138 92 L136 104 L144 100 L140 110" stroke="#ff4d4d" strokeWidth="2" fill="none" filter="url(#hlf-glow)" />
          ) : null}
          {expression === 'sleepy' ? (
            <g fill="none" stroke="#ffd7a8" opacity="0.7">
              <circle cx="150" cy="58" r="4.2" /><circle cx="160" cy="46" r="2.6" />
              <path d="M146 72 H156" strokeWidth="1.6" />
            </g>
          ) : null}
        </g>
      </svg>
    )
  },

  leiyi: ({ expression, className, reacting }) => {
    const eyeBand = {
      idle: 'M82 76 H118',
      happy: 'M82 81 Q100 66 118 79',
      thinking: 'M88 77 H113',
      working: 'M82 71 L118 80',
      error: 'M82 72 L118 84 M118 72 L82 84',
      sleepy: 'M86 81 H114',
    } as const
    const glow = expression === 'error' ? '#fb7185' : expression === 'sleepy' ? '#818cf8' : '#a5b4fc'
    const glowOpacity = expression === 'sleepy' ? 0.4 : expression === 'error' ? 0.9 : 0.8

    return (
      <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
        <defs>
          <linearGradient id="ly-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04050f" /><stop offset="58%" stopColor="#120a30" /><stop offset="100%" stopColor="#250a3d" />
          </linearGradient>
          <linearGradient id="ly-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" /><stop offset="45%" stopColor="#818cf8" stopOpacity="0.35" /><stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ly-armor" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#6d6bf5" /><stop offset="55%" stopColor="#4338ca" /><stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="ly-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" /><stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <radialGradient id="ly-halo" cx="50%" cy="42%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" /><stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
          <filter id="ly-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <g transform={reacting ? 'translate(0 -3)' : undefined}>
          {/* 深紫深空 + 竖向能量柱 + 椭圆轨道环 */}
          <rect x="-6" y="-6" width="212" height="272" fill="url(#ly-sky)" /><path d="M82 0 H118 V260 H82 Z" fill="url(#ly-beam)" />
          <ellipse cx="100" cy="124" rx="76" ry="100" fill="url(#ly-halo)" /><ellipse cx="100" cy="124" rx="78" ry="102" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.2" strokeDasharray="40 26" />
          <ellipse cx="100" cy="124" rx="60" ry="80" fill="none" stroke="#a5b4fc" strokeWidth="1" opacity="0.24" />
          <ellipse cx="100" cy="124" rx="40" ry="56" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.18" strokeDasharray="8 14" /><path d="M18 70 C60 38 140 38 182 70" fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.35" />
          <path d="M14 192 C60 220 140 220 186 192" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.28" /><path d="M12 96 H22 M10 108 H22 M12 120 H22" stroke="#a5b4fc" strokeWidth="1" opacity="0.3" />
          <path d="M178 96 H188 M178 108 H190 M178 120 H188" stroke="#a5b4fc" strokeWidth="1" opacity="0.22" /><circle cx="26" cy="34" r="1.4" fill="#e0e7ff" opacity="0.8" />
          <circle cx="48" cy="20" r="1" fill="#c7d2fe" opacity="0.6" /><circle cx="70" cy="12" r="1.2" fill="#e0e7ff" opacity="0.65" />
          <circle cx="150" cy="18" r="1.5" fill="#e0e7ff" opacity="0.8" /><circle cx="176" cy="42" r="1.1" fill="#c7d2fe" opacity="0.6" />
          <circle cx="16" cy="150" r="1.2" fill="#e0e7ff" opacity="0.5" /><circle cx="188" cy="168" r="1.4" fill="#c7d2fe" opacity="0.55" />
          <path d="M36 62 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#fde047" opacity="0.6" /><path d="M164 208 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#fde047" opacity="0.45" />

          {/* 细长躯干：窄腰 + 上扬肩甲 */}
          <path d="M82 118 L100 128 L118 118 L128 130 L100 143 L72 130 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="1.2" /><path d="M76 134 H124 L127 174 L119 206 H81 L73 174 Z" fill="url(#ly-armor)" stroke="#1e1b4b" strokeWidth="1.5" />
          <path d="M76 134 L88 146 L82 202 L81 206 L73 174 Z" fill="#a5b4fc" opacity="0.22" /><path d="M124 134 L114 148 L118 202 L119 206 L127 174 Z" fill="#1e1b4b" opacity="0.55" />
          <path d="M82 138 L100 152 L118 138" fill="none" stroke="#eab308" strokeWidth="1.5" opacity="0.9" /><path d="M84 206 H116 L120 234 L100 246 L80 234 Z" fill="#3730a3" stroke="#1e1b4b" strokeWidth="1.4" />
          <path d="M80 234 L62 240 L70 260 H79 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="1.2" /><path d="M120 234 L138 240 L130 260 H121 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="1.2" />
          <path d="M100 150 L109 165 L100 180 L91 165 Z" fill="#c7d2fe" /><path d="M100 150 L109 165 L100 180 L91 165 Z" fill="#818cf8" filter="url(#ly-glow)" opacity="0.8" />
          <path d="M100 157 L104 165 L100 173 L96 165 Z" fill="#eef2ff" /><path d="M92 188 H108 M94 195 H106" stroke="#a5b4fc" strokeWidth="1" opacity="0.4" />

          {/* 左肩：尖刺 + 金色闪电纹 */}
          <path d="M76 128 L56 116 L44 132 L50 152 L68 158 L80 142 Z" fill="url(#ly-armor)" stroke="#1e1b4b" strokeWidth="1.4" />
          <path d="M56 116 L44 98 L60 120 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="1.2" /><path d="M56 116 L44 132 L52 138 L60 122 Z" fill="#a5b4fc" opacity="0.35" />
          <path d="M66 120 L52 142 H61 L55 154 L72 130 H63 Z" fill="#facc15" stroke="#a16207" strokeWidth="0.7" strokeLinejoin="round" /><circle cx="70" cy="148" r="1.8" fill="#fde047" />
          <path d="M124 128 L144 116 L156 132 L150 152 L132 158 L120 142 Z" fill="url(#ly-armor)" stroke="#1e1b4b" strokeWidth="1.4" />
          <path d="M144 116 L156 98 L140 120 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="1.2" /><path d="M144 116 L156 132 L148 138 L140 122 Z" fill="#a5b4fc" opacity="0.3" />
          <path d="M134 120 L148 142 H139 L145 154 L128 130 H137 Z" fill="#facc15" stroke="#a16207" strokeWidth="0.7" strokeLinejoin="round" />

          {/* 手臂：细长流线 */}
          <path d="M72 144 L58 170 L60 204 L68 232 L80 228 L74 200 L80 170 Z" fill="#3730a3" stroke="#1e1b4b" strokeWidth="1.3" />
          <path d="M58 190 L48 198 L58 214 L66 226 L72 217 L62 202 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="1.2" /><path d="M52 202 L64 214" stroke="#facc15" strokeWidth="1.8" opacity="0.8" />
          <path d="M128 144 L142 170 L140 204 L132 232 L120 228 L126 200 L120 170 Z" fill="#3730a3" stroke="#1e1b4b" strokeWidth="1.3" />
          <path d="M142 190 L152 198 L142 214 L134 226 L128 217 L138 202 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="1.2" /><path d="M148 202 L136 214" stroke="#facc15" strokeWidth="1.8" opacity="0.8" />

          {/* 颈部 + 尖角头盔 */}
          <path d="M90 104 H110 V128 H90 Z" fill="#1e1b4b" stroke="#0f0d2e" strokeWidth="1.2" /><path d="M66 78 L70 44 L92 28 H108 L130 44 L134 78 L128 100 L100 118 L72 100 Z" fill="url(#ly-armor)" stroke="#1e1b4b" strokeWidth="1.6" />
          <path d="M70 44 L92 28 L100 44 L78 54 Z" fill="#c7d2fe" opacity="0.3" /><path d="M130 44 L108 28 L100 44 L122 56 L132 72 Z" fill="#1e1b4b" opacity="0.5" />
          <path d="M100 28 V118" stroke="#6366f1" strokeWidth="1" opacity="0.35" /><path d="M70 46 L100 36 L130 46 L130 56 L100 46 L70 56 Z" fill="#818cf8" opacity="0.45" />
          <path d="M92 32 L100 2 L108 32 Z" fill="url(#ly-gold)" stroke="#a16207" strokeWidth="0.9" /><path d="M96 29 L100 12 L104 29 Z" fill="#fff7d6" opacity="0.85" />
          <ellipse cx="100" cy="32" rx="14" ry="5" fill="#facc15" opacity="0.35" filter="url(#ly-glow)" /><path d="M70 50 L44 34 L64 62 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="1.2" />
          <path d="M130 50 L156 34 L136 62 Z" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="1.2" /><path d="M47 37 L62 54" stroke="#c7d2fe" strokeWidth="1" opacity="0.6" />
          <path d="M153 37 L138 54" stroke="#c7d2fe" strokeWidth="1" opacity="0.6" /><path d="M97 44 L104 40 L100 50 L107 48 L96 62 L100 52 L94 54 Z" fill="#fde047" stroke="#a16207" strokeWidth="0.7" />
          <path d="M72 68 L128 64 L127 82 L100 90 L73 84 Z" fill="#0b0a23" stroke="#a5b4fc" strokeWidth="0.9" />
          <g filter="url(#ly-glow)" stroke={glow} strokeWidth="5" strokeLinecap="round" fill="none" opacity={glowOpacity}>
            <path d={eyeBand[expression]} />
          </g>
          <path d={eyeBand[expression]} stroke="#e0e7ff" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M80 92 L120 90 L114 106 L100 114 L86 106 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="1" /><path d="M92 100 H108 M96 105 H104" stroke="#a5b4fc" strokeWidth="1.2" opacity="0.5" />
          <path d="M70 78 L64 82 L70 86 Z" fill="#facc15" opacity="0.9" /><path d="M130 80 L136 84 L130 88 Z" fill="#facc15" opacity="0.9" />

          {/* 周身电弧 */}
          <g fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinejoin="round" filter="url(#ly-glow)" opacity="0.75">
            <path d="M22 54 L42 64 L34 82 L56 90" /><path d="M156 112 L142 128 L158 140 L146 158 L164 166" />
            <path d="M28 198 L46 208 L38 224 L58 234" />
          </g>
          <g fill="none" stroke="#e0e7ff" strokeWidth="1" strokeLinejoin="round" opacity="0.9">
            <path d="M22 54 L42 64 L34 82 L56 90" /><path d="M156 112 L142 128 L158 140 L146 158 L164 166" />
            <path d="M28 198 L46 208 L38 224 L58 234" />
          </g>
          <circle cx="42" cy="64" r="1.8" fill="#e0e7ff" /><circle cx="158" cy="140" r="1.6" fill="#e0e7ff" />
          <circle cx="38" cy="224" r="1.6" fill="#e0e7ff" />

          {/* 表情小符号 */}
          {expression === 'happy' ? (
            <g fill="#fde047">
              <path d="M150 46 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" /><path d="M44 96 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" opacity="0.7" />
            </g>
          ) : null}
          {expression === 'thinking' ? (
            <g fill="#c7d2fe" opacity="0.85">
              <circle cx="150" cy="60" r="2.4" /><circle cx="158" cy="52" r="1.7" />
              <circle cx="164" cy="62" r="1.2" />
            </g>
          ) : null}
          {expression === 'working' ? (
            <path d="M16 170 L30 164 M12 182 L28 176 M14 194 L26 190" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          ) : null}
          {expression === 'error' ? (
            <path d="M136 96 L142 88 L140 100 L148 96 L144 106" stroke="#fb7185" strokeWidth="2" fill="none" filter="url(#ly-glow)" />
          ) : null}
          {expression === 'sleepy' ? (
            <g fill="none" stroke="#c7d2fe" opacity="0.7">
              <circle cx="152" cy="54" r="4" /><circle cx="162" cy="42" r="2.5" />
              <path d="M148 68 H158" strokeWidth="1.6" />
            </g>
          ) : null}
        </g>
      </svg>
    )
  },

  'kaixin-chaoren': ({ expression, className, reacting }) => {
    const eyeLeft = {
      idle: 'M83 81 H95',
      happy: 'M83 85 Q89 74 95 83',
      thinking: 'M84 81 H94',
      working: 'M83 76 L95 84',
      error: 'M83 74 L95 87 M95 74 L83 87',
      sleepy: 'M84 84 H94',
    } as const
    const eyeRight = {
      idle: 'M105 81 H117',
      happy: 'M105 83 Q111 74 117 85',
      thinking: 'M108 81 H116',
      working: 'M105 84 L117 76',
      error: 'M105 74 L117 87 M117 74 L105 87',
      sleepy: 'M106 84 H116',
    } as const
    const mouth = {
      idle: 'M90 114 H110',
      happy: 'M90 112 Q100 121 110 112',
      thinking: 'M92 115 H108',
      working: 'M90 116 H110',
      error: 'M90 112 L94 118 L98 112 L102 118 L106 112 L110 118',
      sleepy: 'M93 116 H107',
    } as const
    const glow = expression === 'error' ? '#ff5252' : expression === 'sleepy' ? '#f59e0b' : '#fde047'

    return (
      <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
        <defs>
          <linearGradient id="kx-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04050e" /><stop offset="55%" stopColor="#1b0712" /><stop offset="100%" stopColor="#3b0b10" />
          </linearGradient>
          <radialGradient id="kx-halo" cx="50%" cy="42%" r="52%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="kx-helm" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#f87171" /><stop offset="55%" stopColor="#dc2626" /><stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="kx-body" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#ef4444" /><stop offset="60%" stopColor="#c81e1e" /><stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="kx-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4c0519" /><stop offset="100%" stopColor="#1a0508" />
          </linearGradient>
          <linearGradient id="kx-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" /><stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="kx-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
        </defs>
        <g transform={reacting ? 'translate(0 -3)' : undefined}>
          {/* 深空 + 十二边形能量环 + 放射骨架 */}
          <rect x="-6" y="-6" width="212" height="272" fill="url(#kx-sky)" /><ellipse cx="100" cy="110" rx="84" ry="80" fill="url(#kx-halo)" />
          <path d="M100 32 L144 44 L176 76 L188 120 L176 164 L144 196 L100 208 L56 196 L24 164 L12 120 L24 76 L56 44 Z" fill="none" stroke="#f59e0b" strokeWidth="1.3" opacity="0.3" />
          <circle cx="100" cy="120" r="68" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.2" strokeDasharray="5 11" transform="rotate(15 100 120)" />
          <path d="M100 130 L100 34 M100 130 L176 76 M100 130 L176 180 M100 130 L100 208 M100 130 L24 180 M100 130 L24 76" stroke="#fbbf24" strokeWidth="1" opacity="0.09" />
          <path d="M8 20 H40 L8 52 Z M192 20 H160 L192 52 Z" fill="#f59e0b" opacity="0.12" /><path d="M30 224 V260 M60 224 V260 M90 224 V260 M120 224 V260 M150 224 V260 M180 224 V260" stroke="#fbbf24" strokeWidth="1" opacity="0.07" />
          <circle cx="24" cy="36" r="1.4" fill="#fde68a" opacity="0.8" /><circle cx="46" cy="18" r="1" fill="#fef3c7" opacity="0.6" />
          <circle cx="172" cy="30" r="1.6" fill="#fde68a" opacity="0.75" /><circle cx="184" cy="146" r="1.1" fill="#fef3c7" opacity="0.55" />
          <circle cx="14" cy="132" r="1.3" fill="#fde68a" opacity="0.6" /><circle cx="166" cy="204" r="1.2" fill="#fde68a" opacity="0.5" />
          <circle cx="34" cy="188" r="1.5" fill="#fef3c7" opacity="0.5" /><circle cx="120" cy="14" r="1.1" fill="#fde68a" opacity="0.55" />

          {/* 方形红头盔 + 天线 */}
          <path d="M88 126 H112 V140 H88 Z" fill="#450a0a" stroke="#2a0505" strokeWidth="1.2" /><path d="M100 44 V24" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="18" r="10" fill="#fde047" opacity="0.35" filter="url(#kx-glow)" /><circle cx="100" cy="18" r="6.5" fill="url(#kx-gold)" stroke="#b45309" strokeWidth="1.2" />
          <circle cx="98" cy="16" r="2" fill="#fff7d6" />

          {/* 躯体：硬边拼出的圆头圆脑 */}
          <path d="M72 138 H128 L144 182 L134 214 H66 L56 182 Z" fill="url(#kx-body)" stroke="#450a0a" strokeWidth="2" />
          <path d="M72 138 L100 154 L100 210 L66 214 L56 182 Z" fill="#ffffff" opacity="0.13" /><path d="M128 138 L114 156 L122 208 L134 214 L144 182 Z" fill="#450a0a" opacity="0.4" />
          <path d="M72 138 L100 150 L128 138" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
          <path d="M92 155 L104.7 167.5 L118.1 168.1 L107.6 176.5 L111.2 189.4 L100 182 L88.8 189.4 L92.4 176.5 L81.9 168.1 L95.3 167.5 Z" fill="#fde047" opacity="0.7" filter="url(#kx-glow)" />
          <path d="M100 155 L104.7 167.5 L118.1 168.1 L107.6 176.5 L111.2 189.4 L100 182 L88.8 189.4 L92.4 176.5 L81.9 168.1 L95.3 167.5 Z" fill="url(#kx-gold)" stroke="#b45309" strokeWidth="1.8" />
          <circle cx="100" cy="174" r="3.6" fill="#fff7d6" opacity="0.9" /><path d="M60 214 H140 L142 226 H58 Z" fill="url(#kx-gold)" stroke="#b45309" strokeWidth="1.2" />
          <path d="M92 214 H108 V226 H92 Z" fill="#7f1d1d" /><path d="M64 226 H136 L140 248 H60 Z" fill="#b91c1c" stroke="#450a0a" strokeWidth="1.6" />
          <path d="M84 230 H116 M80 238 H120" stroke="#7f1d1d" strokeWidth="1.4" opacity="0.7" /><path d="M60 248 H140 V260 H60 Z" fill="#7f1d1d" />

          {/* 肩块 + 手臂 */}
          <path d="M64 138 L36 146 L30 178 L52 192 L70 172 Z" fill="url(#kx-body)" stroke="#450a0a" strokeWidth="1.6" /><path d="M40 150 L32 176 L46 184 L56 156 Z" fill="#fca5a5" opacity="0.3" />
          <circle cx="44" cy="164" r="4" fill="#fde047" stroke="#b45309" strokeWidth="1" /><path d="M136 138 L164 146 L170 178 L148 192 L130 172 Z" fill="url(#kx-body)" stroke="#450a0a" strokeWidth="1.6" />
          <path d="M160 150 L168 176 L154 184 L144 156 Z" fill="#fca5a5" opacity="0.25" /><circle cx="156" cy="164" r="4" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          <path d="M56 172 L44 192 L46 220 L58 246 L70 242 L60 214 L68 186 Z" fill="#dc2626" stroke="#450a0a" strokeWidth="1.4" /><path d="M44 204 L58 210 L58 226 L46 220 Z" fill="url(#kx-gold)" stroke="#b45309" strokeWidth="1" />
          <path d="M42 244 L56 242 L54 256 L40 254 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" /><path d="M144 172 L156 192 L154 220 L142 246 L130 242 L140 214 L132 186 Z" fill="#dc2626" stroke="#450a0a" strokeWidth="1.4" />
          <path d="M156 204 L142 210 L142 226 L154 220 Z" fill="url(#kx-gold)" stroke="#b45309" strokeWidth="1" /><path d="M158 244 L144 242 L146 256 L160 254 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />

          {/* 头盔主体 */}
          <path d="M64 44 H136 L148 58 V110 L134 126 H66 L52 110 V58 Z" fill="url(#kx-helm)" stroke="#7f1d1d" strokeWidth="2" /><path d="M64 44 H136 L148 58 H52 Z" fill="#fca5a5" opacity="0.35" />
          <path d="M52 58 H148" stroke="#fde68a" strokeWidth="1.2" opacity="0.5" /><path d="M52 66 H42 V98 H52 Z" fill="url(#kx-gold)" stroke="#b45309" strokeWidth="1.2" />
          <path d="M148 66 H158 V98 H148 Z" fill="url(#kx-gold)" stroke="#b45309" strokeWidth="1.2" /><circle cx="46" cy="82" r="5.5" fill="#fde047" stroke="#b45309" strokeWidth="1" />
          <circle cx="154" cy="82" r="5.5" fill="#fde047" stroke="#b45309" strokeWidth="1" /><circle cx="46" cy="82" r="2" fill="#7f1d1d" />
          <circle cx="154" cy="82" r="2" fill="#7f1d1d" /><path d="M74 62 H126 L132 68 V100 L126 106 H74 L68 100 V68 Z" fill="#180508" stroke="#fbbf24" strokeWidth="2" />
          <path d="M77 66 H123 L127 70 V97 L123 101 H77 L73 97 V70 Z" fill="url(#kx-glass)" /><path d="M80 72 H96 V91 H80 Z M104 72 H120 V91 H104 Z" fill="#2a0a0c" stroke="#fca5a5" strokeWidth="0.9" />
          <g filter="url(#kx-glow)" stroke={glow} strokeWidth="6" strokeLinecap="square" fill="none" opacity="0.85">
            <path d={eyeLeft[expression]} /><path d={eyeRight[expression]} />
          </g>
          <g stroke="#fff7d6" strokeWidth="3.4" strokeLinecap="square" fill="none">
            <path d={eyeLeft[expression]} /><path d={eyeRight[expression]} />
          </g>
          <path d="M86 110 H114 L110 120 H90 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" /><path d={mouth[expression]} stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M74 126 H126 L120 138 H80 Z" fill="#991b1b" stroke="#450a0a" strokeWidth="1.2" /><path d="M82 68 L88 76 M118 68 L112 76" stroke="#ffffff" strokeWidth="1.6" opacity="0.35" />

          {/* 表情小符号 */}
          {expression === 'happy' ? (
            <g fill="#fde68a">
              <path d="M158 48 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" /><path d="M34 54 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" opacity="0.7" />
            </g>
          ) : null}
          {expression === 'thinking' ? (
            <g fill="#fde68a" opacity="0.85">
              <circle cx="158" cy="58" r="2.4" /><circle cx="166" cy="50" r="1.7" />
              <circle cx="172" cy="60" r="1.2" />
            </g>
          ) : null}
          {expression === 'working' ? (
            <path d="M150 126 L164 120 M146 138 L160 132 M144 150 L156 146" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          ) : null}
          {expression === 'error' ? (
            <path d="M150 100 L156 92 L154 104 L162 100 L158 110" stroke="#ff5252" strokeWidth="2" fill="none" filter="url(#kx-glow)" />
          ) : null}
          {expression === 'sleepy' ? (
            <g fill="none" stroke="#fde68a" opacity="0.7">
              <circle cx="160" cy="52" r="4" /><circle cx="170" cy="40" r="2.5" />
              <path d="M156 66 H166" strokeWidth="1.6" />
            </g>
          ) : null}
        </g>
      </svg>
    )
  },

  'xiaoxin-chaoren': ({ expression, className, reacting }) => {
    const eye = {
      idle: 'M76 80 H94',
      happy: 'M76 85 Q85 73 94 81',
      thinking: 'M79 80 H91',
      working: 'M76 75 L94 83',
      error: 'M76 73 L94 87 M94 73 L76 87',
      sleepy: 'M79 84 H92',
    } as const
    const eyeColor =
      expression === 'error' ? '#fb7185' : expression === 'happy' ? '#a5f3fc' : expression === 'sleepy' ? '#155e75' : '#22d3ee'
    const eyeOpacity = expression === 'sleepy' ? 0.45 : expression === 'thinking' ? 0.7 : 1

    return (
      <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
        <defs>
          <linearGradient id="xkx-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02030a" /><stop offset="55%" stopColor="#050a1c" /><stop offset="100%" stopColor="#0b1430" />
          </linearGradient>
          <linearGradient id="xkx-helm" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#2a446f" /><stop offset="60%" stopColor="#172641" /><stop offset="100%" stopColor="#0d1526" />
          </linearGradient>
          <linearGradient id="xkx-armor" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#203454" /><stop offset="65%" stopColor="#12203a" /><stop offset="100%" stopColor="#0a1220" />
          </linearGradient>
          <linearGradient id="xkx-cape" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#27416c" /><stop offset="55%" stopColor="#142442" /><stop offset="100%" stopColor="#080e1c" />
          </linearGradient>
          <radialGradient id="xkx-halo" cx="50%" cy="44%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="xkx-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" /><stop offset="50%" stopColor="#22d3ee" stopOpacity="0.18" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="xkx-shadow" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="55%" stopColor="#000000" stopOpacity="0.75" /><stop offset="100%" stopColor="#000000" stopOpacity="0.92" />
          </linearGradient>
          <filter id="xkx-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>
        </defs>
        <g transform={reacting ? 'translate(0 -3)' : undefined}>
          {/* 近黑深空 + 单侧冷光柱 + 碎面 */}
          <rect x="-6" y="-6" width="212" height="272" fill="url(#xkx-sky)" /><path d="M138 0 H166 V260 H138 Z" fill="url(#xkx-beam)" />
          <ellipse cx="80" cy="92" rx="66" ry="70" fill="url(#xkx-halo)" /><path d="M0 0 H108 L54 260 H0 Z" fill="#000000" opacity="0.1" />
          <path d="M16 40 L46 28 L30 68 Z" fill="#1e293b" opacity="0.55" stroke="#22d3ee" strokeWidth="0.6" /><path d="M164 210 L190 196 L178 240 Z" fill="#1e293b" opacity="0.45" stroke="#22d3ee" strokeWidth="0.6" />
          <path d="M10 222 L38 212 L24 246 Z" fill="#111c33" opacity="0.6" stroke="#22d3ee" strokeWidth="0.5" /><circle cx="100" cy="124" r="86" fill="none" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="3 14" opacity="0.6" />
          <path d="M0 176 L200 120" stroke="#22d3ee" strokeWidth="1" opacity="0.12" /><circle cx="120" cy="18" r="1.3" fill="#a5f3fc" opacity="0.8" />
          <circle cx="76" cy="26" r="1" fill="#e0f2fe" opacity="0.6" /><circle cx="176" cy="56" r="1.4" fill="#a5f3fc" opacity="0.65" />
          <circle cx="22" cy="120" r="1.1" fill="#e0f2fe" opacity="0.5" /><circle cx="180" cy="176" r="1.2" fill="#a5f3fc" opacity="0.5" />
          <circle cx="50" cy="176" r="1" fill="#e0f2fe" opacity="0.4" />

          {/* 披风折角（出框裁切） */}
          <path d="M62 140 L16 126 L0 190 L22 250 L62 208 L72 158 Z" fill="url(#xkx-cape)" stroke="#060a16" strokeWidth="1.6" />
          <path d="M62 140 L26 130 L16 164 L46 176 Z" fill="#2b4673" opacity="0.95" /><path d="M26 150 L18 200 M44 172 L38 226" stroke="#060a16" strokeWidth="1.2" opacity="0.9" />
          <path d="M16 126 L0 190 L22 250" stroke="#22d3ee" strokeWidth="1.4" opacity="0.55" fill="none" /><path d="M63 142 L70 148 L63 154 L56 148 Z" fill="#22d3ee" opacity="0.8" />

          {/* 暗甲躯干 */}
          <path d="M78 126 L100 136 L122 126 L132 138 L100 150 L68 138 Z" fill="#0b1224" stroke="#111a33" strokeWidth="1.2" />
          <path d="M138 142 L160 150 L166 184 L148 196 L134 168 Z" fill="#14233d" stroke="#1e3a5f" strokeWidth="1.4" /><path d="M160 150 L166 184 L154 190 L148 158 Z" fill="#2b4066" opacity="0.85" />
          <path d="M138 142 L160 150 L166 184" stroke="#22d3ee" strokeWidth="1" opacity="0.5" fill="none" /><path d="M58 146 L74 138 L82 160 L66 172 Z" fill="#0a1020" stroke="#111a33" strokeWidth="1.2" />
          <path d="M70 136 H130 L138 178 L130 214 H70 L62 178 Z" fill="url(#xkx-armor)" stroke="#060a16" strokeWidth="1.6" /><path d="M70 136 L86 148 L80 210 L70 214 L62 178 Z" fill="#2c456e" opacity="0.4" />
          <path d="M70 136 L86 148 L80 210 L70 214 L62 178 Z" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.25" /><path d="M88 150 L96 154 L92 206 L86 208 Z" fill="#3a5a8c" opacity="0.35" />
          <path d="M86 148 L86 210" stroke="#22d3ee" strokeWidth="0.8" opacity="0.18" /><path d="M70 170 H130" stroke="#22d3ee" strokeWidth="1" opacity="0.22" />
          <path d="M74 214 H126 L130 236 H70 Z" fill="#111d33" stroke="#060a16" strokeWidth="1.2" /><path d="M70 236 H130 L134 252 H66 Z" fill="#14223d" stroke="#060a16" strokeWidth="1.2" />
          <path d="M66 214 H134 V224 H66 Z" fill="#04060f" /><path d="M66 224 H134" stroke="#22d3ee" strokeWidth="0.8" opacity="0.25" />
          <path d="M148 196 L164 204 L160 234 L144 246 L138 218 Z" fill="#111d33" stroke="#111a33" strokeWidth="1.4" />
          <path d="M150 214 L162 220 L158 236 L146 230 Z" fill="#111a33" stroke="#1e3a5f" strokeWidth="1" /><path d="M150 214 L162 220" stroke="#22d3ee" strokeWidth="0.9" opacity="0.3" />

          {/* 头盔：一半受光，一半沉入阴影 */}
          <path d="M90 118 H110 V138 H90 Z" fill="#0a1120" stroke="#060a16" strokeWidth="1.2" />
          <path d="M58 72 L64 44 L88 30 L118 32 L142 50 L142 86 L128 112 L100 122 L74 112 L60 94 Z" fill="url(#xkx-helm)" stroke="#060a16" strokeWidth="1.6" />
          <path d="M100 32 L118 32 L142 50 L142 86 L128 112 L100 122 Z" fill="#0a1120" /><path d="M78 30 L142 50 L142 112 L100 122 Z" fill="url(#xkx-shadow)" />
          <path d="M64 44 L88 30 L98 44 L76 58 Z" fill="#2b4472" opacity="0.55" /><path d="M58 72 L64 44 L88 30" stroke="#22d3ee" strokeWidth="1.2" opacity="0.6" fill="none" />
          <path d="M100 32 L118 32 L142 50 L142 86" stroke="#22d3ee" strokeWidth="1.2" opacity="0.45" fill="none" /><path d="M64 44 L88 30 L84 44 L70 52 Z" fill="#1e293b" stroke="#22d3ee" strokeWidth="0.7" opacity="0.9" />
          <path d="M142 50 L142 86 L128 112 L100 122" stroke="#22d3ee" strokeWidth="1.1" opacity="0.3" fill="none" />
          <path d="M104 30 L112 10 L126 30 Z" fill="#0b1224" stroke="#22d3ee" strokeWidth="0.7" /><path d="M108 28 L113 16 L120 28 Z" fill="#16233f" opacity="0.8" />
          <path d="M68 70 L128 66 L126 88 L100 94 L72 88 Z" fill="#02040c" stroke="#1e3a5f" strokeWidth="1" />
          <g filter="url(#xkx-glow)" stroke={eyeColor} strokeWidth="5.5" strokeLinecap="round" fill="none" opacity={eyeOpacity}>
            <path d={eye[expression]} />
          </g>
          <path d={eye[expression]} stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round" fill="none" opacity={eyeOpacity} /><path d="M108 76 H122" stroke="#0a1020" strokeWidth="2" />
          <path d="M60 94 L74 112 L80 96 L72 78 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="0.6" />
          <path d="M78 108 L122 104 L116 120 L100 126 L84 120 Z" fill="#050810" stroke="#0b1224" strokeWidth="1.2" /><path d="M100 32 V122" stroke="#22d3ee" strokeWidth="0.8" opacity="0.15" />
          <path d="M90 118 V136" stroke="#22d3ee" strokeWidth="0.7" opacity="0.25" />

          {/* 表情小符号 */}
          {expression === 'happy' ? (
            <g fill="#a5f3fc">
              <path d="M146 56 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" /><path d="M36 72 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" opacity="0.6" />
            </g>
          ) : null}
          {expression === 'thinking' ? (
            <g fill="#67e8f9" opacity="0.7">
              <circle cx="146" cy="66" r="2.2" /><circle cx="154" cy="58" r="1.5" />
              <circle cx="160" cy="68" r="1.1" />
            </g>
          ) : null}
          {expression === 'working' ? (
            <path d="M150 120 L164 114 M146 132 L160 126 M144 144 L156 140" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          ) : null}
          {expression === 'error' ? (
            <path d="M142 96 L148 88 L146 100 L154 96 L150 106" stroke="#fb7185" strokeWidth="2" fill="none" filter="url(#xkx-glow)" />
          ) : null}
          {expression === 'sleepy' ? (
            <g fill="none" stroke="#67e8f9" opacity="0.55">
              <circle cx="148" cy="58" r="4" /><circle cx="158" cy="46" r="2.4" />
              <path d="M144 72 H154" strokeWidth="1.5" />
            </g>
          ) : null}
        </g>
      </svg>
    )
  },

  luoluo: ({ expression, className, reacting }) => {
    const mouth = {
      idle: 'M92 112 Q100 116 108 111',
      happy: 'M91 110 Q100 121 109 110',
      thinking: 'M93 113 Q99 115 105 112',
      working: 'M92 113 H108',
      error: 'M91 114 Q95 110 99 114 Q103 118 108 113',
      sleepy: 'M95 113 Q100 116 105 113',
    } as const

    return (
      <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
        <defs>
          <linearGradient id="ll-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050914" /><stop offset="58%" stopColor="#1a0a16" /><stop offset="100%" stopColor="#3a1218" />
          </linearGradient>
          <radialGradient id="ll-halo" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.28" /><stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ll-skin" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#ffd9b8" /><stop offset="100%" stopColor="#e8ac86" />
          </linearGradient>
          <linearGradient id="ll-hair" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#6b4426" /><stop offset="70%" stopColor="#402614" /><stop offset="100%" stopColor="#24140a" />
          </linearGradient>
          <linearGradient id="ll-jacket" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#f87171" /><stop offset="55%" stopColor="#dc2626" /><stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="ll-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" /><stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <filter id="ll-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <g transform={reacting ? 'translate(0 -3)' : undefined}>
          {/* 驾驶舱视角：深空 + HUD 环 + 地平线 */}
          <rect x="-6" y="-6" width="212" height="272" fill="url(#ll-sky)" /><ellipse cx="100" cy="104" rx="86" ry="80" fill="url(#ll-halo)" />
          <circle cx="100" cy="124" r="92" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 10" opacity="0.22" /><circle cx="100" cy="124" r="76" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.14" />
          <path d="M100 20 V32 M100 216 V228 M16 124 H28 M172 124 H184" stroke="#38bdf8" strokeWidth="1.2" opacity="0.25" />
          <path d="M22 60 L42 46 M158 46 L178 60" stroke="#f97316" strokeWidth="1" opacity="0.3" /><path d="M0 210 H200" stroke="#f97316" strokeWidth="1.6" opacity="0.3" />
          <path d="M0 214 H200" stroke="#fdba74" strokeWidth="3" opacity="0.12" filter="url(#ll-glow)" /><path d="M18 166 L54 150 M150 34 L184 18" stroke="#fda4af" strokeWidth="1" opacity="0.2" />
          <circle cx="26" cy="34" r="1.4" fill="#fed7aa" opacity="0.8" /><circle cx="52" cy="16" r="1" fill="#ffedd5" opacity="0.6" />
          <circle cx="174" cy="32" r="1.5" fill="#fed7aa" opacity="0.7" /><circle cx="186" cy="96" r="1.1" fill="#ffedd5" opacity="0.55" />
          <circle cx="14" cy="94" r="1.2" fill="#fed7aa" opacity="0.55" /><circle cx="180" cy="182" r="1.3" fill="#fed7aa" opacity="0.45" />
          <circle cx="30" cy="196" r="1" fill="#ffedd5" opacity="0.4" /><path d="M160 14 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#fde68a" opacity="0.5" />

          {/* 向后飘的围巾（出框） */}
          <path d="M72 132 C50 128 30 144 2 136 L0 150 C30 162 54 148 74 144 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
          <path d="M56 146 C38 154 20 170 -6 164 L-8 178 C20 186 48 172 66 158 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" /><path d="M60 136 C42 136 26 146 8 146" stroke="#fca5a5" strokeWidth="1.4" opacity="0.6" fill="none" />
          <path d="M46 154 C32 160 18 168 2 170" stroke="#fca5a5" strokeWidth="1.2" opacity="0.5" fill="none" /><path d="M66 133 C50 131 34 140 14 138" stroke="#fecaca" strokeWidth="1.2" opacity="0.5" fill="none" />

          {/* 红白夹克 */}
          <path d="M60 146 L100 136 L140 146 L150 198 L144 260 H56 L50 198 Z" fill="url(#ll-jacket)" stroke="#7f1d1d" strokeWidth="2" />
          <path d="M84 142 H116 L118 260 H82 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" /><path d="M60 146 L76 168 L70 220 L56 200 Z" fill="#991b1b" opacity="0.5" />
          <path d="M140 146 L124 168 L130 220 L144 200 Z" fill="#991b1b" opacity="0.5" /><path d="M100 160 V260" stroke="#94a3b8" strokeWidth="1.4" />
          <path d="M98 176 H102 V186 H98 Z" fill="#cbd5e1" /><path d="M76 138 L100 160 L124 138 L134 150 L100 178 L66 150 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.6" />
          <path d="M76 138 L100 160 L124 138" stroke="#f8fafc" strokeWidth="2" fill="none" /><path d="M60 146 L40 160 L42 188 L64 192 L72 166 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.6" />
          <path d="M140 146 L160 160 L158 188 L136 192 L128 166 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.6" /><path d="M42 188 L38 220 L48 246 L60 242 L54 216 L62 196 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.4" />
          <path d="M158 188 L162 220 L152 246 L140 242 L146 216 L138 196 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.4" /><path d="M42 238 L56 244 L52 256 L38 250 Z" fill="#1f2937" stroke="#111827" strokeWidth="1.2" />
          <path d="M158 238 L144 244 L148 256 L162 250 Z" fill="#1f2937" stroke="#111827" strokeWidth="1.2" /><path d="M58 224 H142 V236 H58 Z" fill="#7f1d1d" />
          <path d="M94 224 H106 V236 H94 Z" fill="#f5a623" stroke="#b45309" strokeWidth="1" /><path d="M116 174 L132 174 L132 186 L124 194 L116 186 Z" fill="#f5a623" stroke="#b45309" strokeWidth="1.2" />
          <path d="M124 178 l1.8 4.2 4.2 1.8 -4.2 1.8 -1.8 4.2 -1.8 -4.2 -4.2 -1.8 4.2 -1.8z" fill="#7c2d12" /><path d="M108 180 L116 184 M140 180 L132 184" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M70 246 Q100 254 130 246" stroke="#7f1d1d" strokeWidth="1.4" fill="none" opacity="0.6" />

          {/* 头部 */}
          <path d="M92 116 H108 V140 H92 Z" fill="#e8b48f" stroke="#b97a5c" strokeWidth="1.2" /><path d="M68 82 C64 80 64 92 68 94 Z" fill="#ffd9b8" stroke="#b97a5c" strokeWidth="1.1" />
          <path d="M132 82 C136 80 136 92 132 94 Z" fill="#ffd9b8" stroke="#b97a5c" strokeWidth="1.1" />
          <path d="M70 78 L72 58 L84 48 L116 48 L128 58 L130 78 L126 102 L112 120 L88 120 L74 102 Z" fill="url(#ll-skin)" stroke="#b97a5c" strokeWidth="1.4" />
          <path d="M88 120 L112 120 L106 126 L94 126 Z" fill="#d99b76" opacity="0.6" /><path d="M128 58 L130 78 L126 102" stroke="#ffd7a8" strokeWidth="1.6" opacity="0.5" fill="none" />
          <path d="M66 64 C64 42 80 28 100 28 C120 28 136 42 134 64 L132 74 L124 66 L120 80 L110 64 L100 78 L90 64 L80 80 L76 66 L68 74 Z" fill="url(#ll-hair)" stroke="#24140a" strokeWidth="1.6" />
          <path d="M78 34 L72 16 L86 28 Z" fill="url(#ll-hair)" stroke="#24140a" strokeWidth="1.2" /><path d="M96 28 L100 8 L108 28 Z" fill="url(#ll-hair)" stroke="#24140a" strokeWidth="1.2" />
          <path d="M118 32 L128 16 L124 36 Z" fill="url(#ll-hair)" stroke="#24140a" strokeWidth="1.2" /><path d="M80 40 L76 28 M100 36 L100 20 M120 38 L124 28" stroke="#8a5a34" strokeWidth="1" opacity="0.55" />
          <path d="M66 62 C82 54 118 54 134 62" stroke="#334155" strokeWidth="4.5" fill="none" /><circle cx="84" cy="60" r="11" fill="url(#ll-glass)" stroke="#475569" strokeWidth="2.6" />
          <circle cx="116" cy="60" r="11" fill="url(#ll-glass)" stroke="#475569" strokeWidth="2.6" /><path d="M78 55 C81 51 87 51 90 55" stroke="#ffffff" strokeWidth="2" opacity="0.85" fill="none" />
          <path d="M110 55 C113 51 119 51 122 55" stroke="#ffffff" strokeWidth="2" opacity="0.75" fill="none" /><path d="M95 60 H105" stroke="#475569" strokeWidth="3" />
          <path d="M73 61 L66 62 M127 61 L134 62" stroke="#334155" strokeWidth="3" />
          {expression === 'working' || expression === 'error' ? (
            <g stroke="#3f2a1a" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <path d="M80 84 L96 80" /><path d="M104 80 L120 84" />
            </g>
          ) : (
            <g stroke="#3f2a1a" strokeWidth="2.2" strokeLinecap="round" fill="none">
              <path d="M80 83 Q88 79 96 83" /><path d="M104 83 Q112 79 120 83" />
            </g>
          )}
          {expression === 'happy' ? (
            <g stroke="#3f2a1a" strokeWidth="2.6" strokeLinecap="round" fill="none">
              <path d="M82 94 Q88 86 95 93" /><path d="M105 93 Q112 86 119 94" />
            </g>
          ) : expression === 'sleepy' ? (
            <g stroke="#3f2a1a" strokeWidth="2.6" strokeLinecap="round" fill="none">
              <path d="M82 92 Q88 99 95 93" /><path d="M105 93 Q112 99 119 92" />
            </g>
          ) : (
            <g>
              <path d="M81 92 Q88 83 96 92 Q88 100 81 92 Z" fill="#fff8f0" stroke="#3f2a1a" strokeWidth="1.4" />
              <path d="M104 92 Q112 83 119 92 Q112 100 104 92 Z" fill="#fff8f0" stroke="#3f2a1a" strokeWidth="1.4" /><circle cx={expression === 'thinking' ? 91 : 88} cy="92" r="4" fill="#7c4a2d" />
              <circle cx={expression === 'thinking' ? 114 : 112} cy="92" r="4" fill="#7c4a2d" /><circle cx={expression === 'thinking' ? 91 : 88} cy="92" r="2" fill="#1c1208" />
              <circle cx={expression === 'thinking' ? 114 : 112} cy="92" r="2" fill="#1c1208" /><circle cx="89" cy="90" r="1.2" fill="#ffffff" />
              <circle cx="113" cy="90" r="1.2" fill="#ffffff" />
            </g>
          )}
          <path d="M100 98 L98 106 L102 106" stroke="#b97a5c" strokeWidth="1.6" fill="none" strokeLinejoin="round" /><path d={mouth[expression]} stroke="#8a4b3a" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M86 108 Q88 105 90 108" stroke="#e79a9a" strokeWidth="1.6" fill="none" opacity="0.7" /><path d="M114 108 Q116 105 118 108" stroke="#e79a9a" strokeWidth="1.6" fill="none" opacity="0.7" />

          {/* 表情小符号 */}
          {expression === 'happy' ? (
            <g fill="#fde68a">
              <path d="M156 44 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" /><path d="M40 52 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" opacity="0.7" />
            </g>
          ) : null}
          {expression === 'thinking' ? (
            <g fill="#fed7aa" opacity="0.85">
              <circle cx="150" cy="52" r="2.4" /><circle cx="158" cy="44" r="1.7" />
              <circle cx="164" cy="54" r="1.2" />
            </g>
          ) : null}
          {expression === 'working' ? (
            <path d="M154 106 L168 100 M150 118 L164 112 M148 130 L160 126" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
          ) : null}
          {expression === 'error' ? (
            <g>
              <path d="M146 94 L152 86 L150 98 L158 94 L154 104" stroke="#f87171" strokeWidth="2" fill="none" filter="url(#ll-glow)" />
              <path d="M138 78 C134 86 140 92 144 88 C147 85 143 80 140 84" stroke="#93c5fd" strokeWidth="1.6" fill="none" opacity="0.85" />
            </g>
          ) : null}
          {expression === 'sleepy' ? (
            <g fill="none" stroke="#fed7aa" opacity="0.7">
              <circle cx="152" cy="50" r="4" /><circle cx="162" cy="38" r="2.5" />
              <path d="M148 64 H158" strokeWidth="1.6" />
            </g>
          ) : null}
        </g>
      </svg>
    )
  },
}
