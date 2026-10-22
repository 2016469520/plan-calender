// ============================================================
// 光系童年 · 四角色同人立绘
// 原创同人风演绎，非官方立绘；仅用于本地体验
// ------------------------------------------------------------
// 四个角色各画各的：没有共享组件，也没有共享常量数组。
// 喜羊羊与灰太狼同属一部作品，共用同一条「草地—小房子」地平线，
// 用清晨 / 黄昏成对；南宫问天是水墨留白的少年侠客，麦当是深蓝
// 星空下的仰头少年，后两人各自独立。
// 头身比：喜羊羊 40%、灰太狼 40%、南宫问天 26%、麦当 30%。
// 渐变、滤镜与剪裁 id 一律带角色前缀（xyy-/htl-/ngwt-/md-）。
// ============================================================

import type { CharacterArt } from './types'

export const LIGHT_SERIES: Record<string, CharacterArt> = {
  // ---------------------------------------------------------
  // 喜羊羊：清晨草地，3/4 侧身、右手挥起来打招呼，头占 40%
  // 白色卷羊毛是一圈扇贝弧，金色小弯角从羊毛里探出来
  // ---------------------------------------------------------
  xiyangyang: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="xyy-sky" x1="0" y1="0" x2="0.1" y2="1">
          <stop offset="0%" stopColor="#8ed3ff" /><stop offset="52%" stopColor="#c9ecff" /><stop offset="100%" stopColor="#f2fbff" />
        </linearGradient>
        <linearGradient id="xyy-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fd25e" /><stop offset="55%" stopColor="#66b348" /><stop offset="100%" stopColor="#3f8a35" />
        </linearGradient>
        <linearGradient id="xyy-wool" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="55%" stopColor="#f4f0e4" /><stop offset="100%" stopColor="#d5cfbe" />
        </linearGradient>
        <linearGradient id="xyy-horn" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#ffeaa8" /><stop offset="55%" stopColor="#e9b955" /><stop offset="100%" stopColor="#b07c2a" />
        </linearGradient>
        <linearGradient id="xyy-scarf" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#5fb0e8" /><stop offset="100%" stopColor="#2f6fb5" />
        </linearGradient>
        <radialGradient id="xyy-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.95" /><stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.5)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#xyy-sky)" />
        <circle cx="158" cy="44" r="30" fill="url(#xyy-sun)" />
        <circle cx="158" cy="44" r="14" fill="#ffe9a8" />
        <g fill="#ffffff" opacity="0.92">
          <ellipse cx="36" cy="46" rx="17" ry="8" /><ellipse cx="50" cy="40" rx="12" ry="7" /><ellipse cx="23" cy="40" rx="9" ry="5.5" />
          <ellipse cx="112" cy="28" rx="14" ry="6.5" /><ellipse cx="125" cy="23" rx="9" ry="5" />
          <ellipse cx="86" cy="60" rx="10" ry="5" opacity="0.7" /><ellipse cx="96" cy="56" rx="7" ry="4" opacity="0.7" />
        </g>
        <path d="M-4 178c28-24 54-26 80-8 24 17 46 19 68 6 20-12 40-10 62 6v86H-4z" fill="#b9e396" />
        <path d="M-4 206c32-22 60-20 86 0 26 19 52 19 78 0 14-10 28-10 46 0v60H-4z" fill="#8ecf66" />
        <g>
          <path d="M150 160h26v16h-26z" fill="#fdf6e6" stroke="#c19a6b" strokeWidth="1.2" />
          <path d="M145 160l18-12 18 12z" fill="#e2705a" stroke="#b24b3a" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M158 168h7v8h-7z" fill="#b98a5c" />
          <path d="M153 164h4v4h-4z" fill="#8fc4e8" />
          <path d="M166 141h4v9h-4z" fill="#c19a6b" />
        </g>
        <path d="M-4 232c38-16 68 4 104-4 34-8 64-10 104 8v28H-4z" fill="url(#xyy-grass)" />
        <g stroke="#4f9c3a" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M22 246c0-6 2-9 4-11M26 246c1-5 3-7 5-9M32 248c0-5 2-8 4-10" />
          <path d="M164 240c0-6 2-9 4-11M168 240c1-5 3-7 5-9" />
        </g>
        <g>
          <circle cx="40" cy="242" r="3" fill="#fff6c9" stroke="#e0b93f" strokeWidth="1" />
          <circle cx="46" cy="236" r="2.4" fill="#fff6c9" stroke="#e0b93f" strokeWidth="1" />
          <circle cx="18" cy="230" r="2.4" fill="#ffffff" stroke="#e0b93f" strokeWidth="1" />
        </g>

        {/* 角色：先铺尾巴与远侧手臂，再压上圆身体 */}
        <ellipse cx="100" cy="246" rx="46" ry="8" fill="#2f6b2b" opacity="0.22" />
        <circle cx="54" cy="186" r="9" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.6" />
        <circle cx="50" cy="179" r="6" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.4" />
        <path d="M78 146c-12 8-17 22-17 34l14 2c1-12 5-20 11-26z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.8" />
        <circle cx="63" cy="185" r="7" fill="#fbf3e3" stroke="#cfc8b8" strokeWidth="1.6" />
        <path d="M60 183c2 2 2 4 0 5" stroke="#cfc8b8" strokeWidth="1" fill="none" />
        <path d="M100 122c-27 0-46 19-46 43 0 15 9 27 23 32l2 10h42l2-10c14-5 23-17 23-32 0-24-19-43-46-43z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="2" />
        <path d="M78 128c-8 10-12 22-12 34 0 8 3 14 8 19-9-2-16-9-18-19-2-16 6-30 22-34z" fill="#e9e3d4" opacity="0.6" />
        <path d="M79 214c-3 9-4 17-3 23h13c0-8 1-15 3-22z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.6" />
        <path d="M106 215c2 7 3 15 3 22h13c1-6 0-14-3-22z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.6" />
        <path d="M74 236h18l2 8H73z" fill="#2f6fb5" stroke="#24578c" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M108 236h18l2 8h-21z" fill="#2f6fb5" stroke="#24578c" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M64 192c12 7 60 7 72 0l4 18c-5 10-19 14-40 14s-35-4-40-14z" fill="#3d86c6" stroke="#2b6396" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M90 198c4 3 16 3 20 0l-1 12c-5 3-13 3-18 0z" fill="#2f6fb5" opacity="0.8" />
        <circle cx="100" cy="202" r="2.2" fill="#ffe9a8" />
        <path d="M70 116c19 9 43 9 61 0l4 16c-22 10-48 10-69 0z" fill="url(#xyy-scarf)" stroke="#2b6396" strokeWidth="1.8" />
        <path d="M76 130c-7 12-11 25-11 36l13-3c0-10 3-19 9-26z" fill="url(#xyy-scarf)" stroke="#2b6396" strokeWidth="1.6" />
        <path d="M80 140c-3 8-5 16-5 23M86 136c-3 8-5 16-5 24" stroke="#8fc7ee" strokeWidth="1.2" fill="none" opacity="0.7" />
        <circle cx="100" cy="135" r="8.5" fill="url(#xyy-horn)" stroke="#a87b2c" strokeWidth="1.6" />
        <path d="M100 131v7M97 140h6" stroke="#a87b2c" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="100" cy="127" r="2" fill="#c99a3a" />
        <circle cx="97.6" cy="132.4" r="2" fill="#fff6d8" opacity="0.85" />

        {/* 挥手的近侧手臂：袖口蓬松，手掌带三根手指 */}
        <path d="M118 146c14-2 26-12 32-26l14 8c-8 18-22 30-38 34z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M126 150c10-4 19-12 24-22" stroke="#e6e0d2" strokeWidth="1.4" fill="none" />
        <path d="M151 99v-7c0-2 3-2 3 0v7M157 98v-9c0-2 3-2 3 0v9M163 100v-7c0-2 3-2 3 0v8M169 105v-5c0-2 3-2 3 0v6" fill="#fbf3e3" stroke="#cfc8b8" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M147 104c8-4 16 0 17 8 2 8-4 14-12 13-7-1-10-6-9-12z" fill="#fbf3e3" stroke="#cfc8b8" strokeWidth="1.6" />
        <path d="M147 112c-3 0-5 2-5 5M151 116c4 2 8 1 11-1" stroke="#d9c9b0" strokeWidth="1" fill="none" />
        <path d="M172 94c6 3 8 9 6 15M176 108c4 4 4 9 2 13" stroke="#7fb8dd" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.75" />

        {/* 弯角与耳朵先画，羊毛后盖住根部；整颗头放大约 1.12 倍，占画面四成 */}
        <g transform="translate(100 76) scale(1.12) translate(-100 -76)">
        <path d="M87 44C83 30 73 22 63 24c9 5 14 12 16 21z" fill="url(#xyy-horn)" stroke="#a87b2c" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M113 44c4-14 14-22 24-20-9 5-14 12-16 21z" fill="url(#xyy-horn)" stroke="#a87b2c" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M82 35l-8-4M78 30l-7-3M118 35l8-4M122 30l7-3" stroke="#a87b2c" strokeWidth="1" opacity="0.8" />
        <path d="M60 76c-12-5-20 3-18 11 2 8 13 10 24 4z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.6" />
        <path d="M56 79c-6-2-10 1-10 5s5 6 10 3z" fill="#f3c9c2" />
        <path d="M140 74c12-5 20 3 18 11-2 8-13 10-24 4z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="1.6" />
        <path d="M144 77c6-2 10 1 10 5s-5 6-10 3z" fill="#f3c9c2" />
        <path d="M100 32A18 18 0 0 1 124.7 40A18 18 0 0 1 140 61A18 18 0 0 1 140 87A18 18 0 0 1 124.7 108A18 18 0 0 1 100 116A18 18 0 0 1 75.3 108A18 18 0 0 1 60 87A18 18 0 0 1 60 61A18 18 0 0 1 75.3 40A18 18 0 0 1 100 32Z" fill="url(#xyy-wool)" stroke="#cfc8b8" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M72 62c8-8 20-12 30-12 12 0 22 4 28 12-6 6-16 8-28 8-12 0-22-2-30-8z" fill="#efe9da" opacity="0.55" />
        <ellipse cx="100" cy="84" rx="28" ry="25" fill="#fbf3e3" stroke="#d9c9b0" strokeWidth="1.4" />
        <path d="M76 64c2-10 10-16 18-16 5 0 9 2 12 6 3-4 7-6 12-6 8 0 15 6 17 16-10-3-20-4-30-4s-19 1-29 4z" fill="#f8f3e7" stroke="#cfc8b8" strokeWidth="1.2" />
        <path d="M80 65c4-3 9-3 12 0M108 65c3-3 8-3 12 0" stroke="#a08e73" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="81" cy="92" rx="6" ry="3" fill="#f2a7a0" opacity="0.35" />
        <ellipse cx="119" cy="92" rx="6" ry="3" fill="#f2a7a0" opacity="0.35" />
        <ellipse cx="100" cy="98" rx="15" ry="9" fill="#f6ead6" />
        <path d="M94 92h12l-2 4h-8z" fill="#8a6a58" />
        <path d="M100 96v3" stroke="#8a6a58" strokeWidth="1.4" />

        {/* 眉眼：黑色豆眼，表情只改眼形与嘴角 */}
        {expression === 'happy' ? (
          <g stroke="#3b3126" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M80 80c3-6 11-6 14 0" /><path d="M106 80c3-6 11-6 14 0" />
          </g>
        ) : expression === 'sleepy' ? (
          <g stroke="#3b3126" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M80 78c4 4 10 4 14 0" /><path d="M106 78c4 4 10 4 14 0" />
          </g>
        ) : expression === 'error' ? (
          <g>
            <ellipse cx="87" cy="80" rx="8" ry="8.5" fill="#fffdf6" stroke="#3b3126" strokeWidth="1.6" />
            <ellipse cx="113" cy="80" rx="8" ry="8.5" fill="#fffdf6" stroke="#3b3126" strokeWidth="1.6" />
            <circle cx="87" cy="81" r="3.2" fill="#3b3126" /><circle cx="113" cy="81" r="3.2" fill="#3b3126" />
          </g>
        ) : (
          <g>
            <ellipse cx="87" cy={expression === 'thinking' ? 77 : 80} rx="6.2" ry="7.6" fill="#3b3126" />
            <ellipse cx="113" cy={expression === 'thinking' ? 77 : 80} rx="6.2" ry="7.6" fill="#3b3126" />
            <circle cx="85" cy="77.5" r="2" fill="#ffffff" />
            <circle cx="111" cy="77.5" r="2" fill="#ffffff" />
            {expression === 'working' && (
              <path d="M80 74h13M107 74h13" stroke="#3b3126" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </g>
        )}
        <g stroke="#3b3126" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d={expression === 'error' ? 'M79 64l11 4' : expression === 'sleepy' ? 'M80 66c4 2 9 2 12 0' : 'M80 65c4-3 9-3 12 0'} />
          <path d={expression === 'error' ? 'M107 64l11 4' : expression === 'sleepy' ? 'M108 66c4 2 9 2 12 0' : 'M108 65c4-3 9-3 12 0'} />
        </g>

        {/* 嘴 */}
        {expression === 'happy' ? (
          <g>
            <path d="M89 98c2 10 20 10 22 0z" fill="#8d4a44" stroke="#6b3430" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M96 105c3-2 6-2 8 0-1 4-6 5-8 0z" fill="#f28d8d" />
          </g>
        ) : expression === 'error' ? (
          <path d="M92 103c3-3 5 3 8 0s5 3 8 0" stroke="#8a5a50" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        ) : expression === 'sleepy' ? (
          <path d="M95 101h10" stroke="#8a5a50" strokeWidth="1.6" strokeLinecap="round" />
        ) : expression === 'thinking' ? (
          <path d="M96 102c3 2 6 2 8 0" stroke="#8a5a50" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        ) : (
          <path d={expression === 'working' ? 'M92 99c5 5 11 5 16 0-5 2-11 2-16 0z' : 'M92 99c5 6 11 6 16 0'} stroke="#8a5a50" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        )}
        </g>

        {/* 表情小符号 */}
        {expression === 'happy' && (
          <path d="M166 84l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" fill="#ffd75e" stroke="#e0a93a" strokeWidth="1" />
        )}
        {expression === 'thinking' && (
          <g fill="#5f9fd0" opacity="0.85">
            <circle cx="148" cy="96" r="2" /><circle cx="155" cy="88" r="2.6" /><circle cx="163" cy="79" r="3.2" />
          </g>
        )}
        {expression === 'working' && (
          <g stroke="#4f9cd6" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
            <path d="M158 78l7-10M166 84l7-10M174 90l5-8" />
          </g>
        )}
        {expression === 'error' && (
          <path d="M166 58c0 5 3 7 6 7s6-2 6-7c0-4-6-11-6-11s-6 7-6 11z" fill="#6fb9e8" stroke="#4f9cd6" strokeWidth="1" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#5f9fd0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M150 86h6l-6 5h6" /><path d="M162 72h5l-5 4h5" />
          </g>
        )}
      </g>
    </svg>
  ),

  // ---------------------------------------------------------
  // 灰太狼：同一片草地压暗成黄昏，歪头坏笑，双手在胸前搓
  // 头占 40%，长吻朝左、竖瞳黄眼、一颗小尖牙、补丁帽
  // ---------------------------------------------------------
  huitailang: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="htl-sky" x1="0" y1="0" x2="0.14" y2="1">
          <stop offset="0%" stopColor="#6f5a78" /><stop offset="46%" stopColor="#c47a63" /><stop offset="100%" stopColor="#f0b273" />
        </linearGradient>
        <linearGradient id="htl-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6d8347" /><stop offset="55%" stopColor="#4b6034" /><stop offset="100%" stopColor="#31452a" />
        </linearGradient>
        <linearGradient id="htl-fur" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#a3a8b0" /><stop offset="52%" stopColor="#7c828b" /><stop offset="100%" stopColor="#565c66" />
        </linearGradient>
        <linearGradient id="htl-muzzle" x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#d9dce1" /><stop offset="100%" stopColor="#b3b8c0" />
        </linearGradient>
        <linearGradient id="htl-hat" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#f5a052" /><stop offset="55%" stopColor="#df7c30" /><stop offset="100%" stopColor="#b95a1f" />
        </linearGradient>
        <linearGradient id="htl-scarf" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#f0913f" /><stop offset="60%" stopColor="#dd7730" /><stop offset="100%" stopColor="#c96a26" />
        </linearGradient>
        <linearGradient id="htl-vest" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#5e4a3a" /><stop offset="100%" stopColor="#3a2c22" />
        </linearGradient>
        <radialGradient id="htl-haze" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcf94" stopOpacity="0.55" /><stop offset="100%" stopColor="#ffcf94" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.5)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#htl-sky)" />
        <circle cx="150" cy="160" r="64" fill="url(#htl-haze)" />
        <circle cx="150" cy="164" r="26" fill="#ffcf94" opacity="0.75" />
        <g fill="#7c5a70" opacity="0.55">
          <path d="M-4 48c22-8 44-6 66 2 22 8 44 8 66-2 18-8 36-8 60 2v-8c-22-8-42-8-62 0-22 8-44 8-66 0C44 34 22 34-4 42z" />
          <path d="M-4 80c26-6 48-4 70 2 24 8 48 8 70 0 20-6 40-6 64 2v-8c-22-6-42-6-62 0-24 8-48 8-72 0-24-8-46-6-70 0z" />
        </g>
        <g stroke="#43333f" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.75">
          <path d="M32 64c4-4 8-4 12 0M44 64c4-4 8-4 12 0" />
          <path d="M78 46c3-3 6-3 9 0M87 46c3-3 6-3 9 0" />
        </g>
        <path d="M-4 178c28-24 54-26 80-8 24 17 46 19 68 6 20-12 40-10 62 6v86H-4z" fill="#6a7a52" opacity="0.9" />
        <path d="M-4 206c32-22 60-20 86 0 26 19 52 19 78 0 14-10 28-10 46 0v60H-4z" fill="#4e6039" />
        <g>
          <path d="M150 160h26v16h-26z" fill="#4d4038" stroke="#2f2620" strokeWidth="1.2" />
          <path d="M145 160l18-12 18 12z" fill="#5b3a32" stroke="#2f2620" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M158 168h7v8h-7z" fill="#332a24" />
          <path d="M153 164h4v4h-4z" fill="#ffce7a" />
          <path d="M166 141h4v9h-4z" fill="#3a2f29" />
        </g>
        <path d="M-4 232c38-16 68 4 104-4 34-8 64-10 104 8v28H-4z" fill="url(#htl-grass)" />
        <path d="M20 244c0-6 2-10 4-12M24 244c1-5 3-8 5-10" stroke="#2f3f24" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="168" cy="238" rx="10" ry="5" fill="#3a4a2c" opacity="0.9" />

        {/* 角色：前倾的身体、翘起的尾巴 */}
        <ellipse cx="108" cy="246" rx="52" ry="8" fill="#1f2a19" opacity="0.35" />
        <path d="M132 210c20-6 34-20 38-34 2-9-5-15-12-12-9 4-15 14-19 24-3 8-6 15-7 22z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M158 166c8-2 14 3 13 9-6 1-12-1-16-5z" fill="#d4d7dc" opacity="0.85" />
        <g stroke="#3b3f46" strokeWidth="1" fill="none" opacity="0.55">
          <path d="M146 198c12-4 22-12 28-22M142 208c14-4 26-14 32-26" />
        </g>
        <path d="M122 212c10 10 14 22 14 34h-22c0-12-3-20-9-28z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M112 244h26l2 8h-30z" fill="#3b3f46" stroke="#23262b" strokeWidth="1.4" />
        <path d="M84 212c-5 12-6 24-4 36h20c-1-14 2-24 8-32z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M80 246h24l2 8H78z" fill="#3b3f46" stroke="#23262b" strokeWidth="1.4" />
        <path d="M88 248l-4 5M96 248l-4 5M132 248l-4 4" stroke="#8d939c" strokeWidth="1" opacity="0.7" />
        <path d="M80 140c24-8 46-2 54 18 9 24 13 50 15 84l-2 10H80c-4-36-6-74-2-112z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="2" strokeLinejoin="round" />
        <path d="M82 154c16-2 30 4 34 18" stroke="#c3c7cd" strokeWidth="1.2" fill="none" opacity="0.4" />
        <path d="M84 140c-4 20-4 42-2 64l-6 2c-5-24-6-48-2-68z" fill="url(#htl-vest)" stroke="#2a1f18" strokeWidth="1.6" />
        <path d="M112 144c8 7 13 18 15 31l6 2c-2-18-8-31-20-39z" fill="url(#htl-vest)" stroke="#2a1f18" strokeWidth="1.6" />
        <path d="M82 200h60l3 14H80z" fill="#3a2a20" stroke="#241810" strokeWidth="1.6" />
        <path d="M104 200l6 14M110 200l4 14" stroke="#8a6a4a" strokeWidth="1.2" opacity="0.8" />
        <circle cx="102" cy="207" r="3.4" fill="#c9924a" stroke="#7c5527" strokeWidth="1" />

        {/* 脖子从肩里长出来，围巾绕颈一圈，前结 + 右飞的尾 */}
        <path d="M88 100c-6 14-6 28 0 42l22 2c8-12 10-26 8-40z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.6" />
        <path d="M70 120c16 12 46 12 64-2l5 18c-18 12-46 12-66 0z" fill="url(#htl-scarf)" stroke="#8a421a" strokeWidth="1.6" />
        <path d="M124 128c14-6 27-4 38 4-6 7-14 12-24 13l-2-6-6 5c-3-5-5-10-6-16z" fill="url(#htl-scarf)" stroke="#8a421a" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M132 130c9-2 17 0 23 4M134 138c6-1 11 0 16 2" stroke="#ffc084" strokeWidth="1.1" fill="none" opacity="0.7" />
        <path d="M154 144l3 6M159 141l3 6M164 137l2 6" stroke="#c96a26" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M76 132c-6 8-9 18-8 28l10 2c0-8 3-15 8-20z" fill="url(#htl-scarf)" stroke="#8a421a" strokeWidth="1.4" />
        <circle cx="76" cy="133" r="5" fill="#c96a26" stroke="#8a421a" strokeWidth="1.2" />
        <path d="M82 148c-8 6-12 14-10 22l12-2c0-6 3-11 8-15z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.8" />
        <path d="M122 150c9 5 13 13 12 21l-12-2c0-6-3-11-8-15z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.8" />
        <ellipse cx="94" cy="170" rx="13" ry="10" transform="rotate(-22 94 170)" fill="url(#htl-muzzle)" stroke="#2f333a" strokeWidth="1.6" />
        <ellipse cx="108" cy="168" rx="13" ry="10" transform="rotate(18 108 168)" fill="url(#htl-muzzle)" stroke="#2f333a" strokeWidth="1.6" />
        <path d="M99 164c4 2 7 4 9 7" stroke="#3b3f46" strokeWidth="1.4" fill="none" />
        <g stroke="#565c66" strokeWidth="1.1" fill="none" strokeLinecap="round">
          <path d="M85 166c2 2 3 5 3 8M90 163c2 3 3 6 3 9M95 162c2 3 2 6 2 9" />
          <path d="M108 162c-1 3-1 6 0 9M113 163c-1 3 0 6 1 9M118 166c0 3 0 5 1 7" />
        </g>
        <g stroke="#e0a45a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.9">
          <path d="M76 158c-4 5-4 11 0 15" /><path d="M126 156c4 5 4 11 0 15" />
        </g>

        {/* 狼头整组歪 7° 并压低，帽子、耳朵与脸一起偏 */}
        <g transform="translate(0 8) rotate(-7 96 108)">
          <path d="M78 30L60 4l28 16z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M78 28l-10-15 14 9z" fill="#4a3f46" />
          <path d="M114 28L134 4l-1 30z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M118 26l10-13-15 10z" fill="#4a3f46" />
          <path d="M60 52c-2-18 12-32 32-32 20 0 34 14 34 32 0 14-6 24-16 30l-2 12c-2 8-10 12-18 12-12 0-22-6-26-16-2-6-2-12-2-18z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="2" />
          <path d="M62 66l-12-4 8 10-10 2 12 6-8 6 14 2zM132 62l12-6-8 10 10 2-12 6 8 6-14 2z" fill="url(#htl-fur)" stroke="#2f333a" strokeWidth="1.2" />
          <path d="M62 84c-14 2-24 8-26 16 0 6 10 10 22 10 12 0 22-6 28-14-6-8-14-13-24-12z" fill="url(#htl-muzzle)" stroke="#3b3f46" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M40 92c-4 0-7 3-7 6s3 6 7 6 7-3 7-6-3-6-7-6z" fill="#2b2e34" />
          <path d="M38 94c2-1 4-1 5 0" stroke="#6b7078" strokeWidth="1.2" strokeLinecap="round" />
          <g stroke="#565c66" strokeWidth="1.1" strokeLinecap="round" opacity="0.85">
            <path d="M44 100L22 96M44 105L21 105M45 110L24 114" />
          </g>
          <path d="M58 46c14-8 42-8 58 0" stroke="#4a4f58" strokeWidth="1.4" fill="none" opacity="0.6" />
          <path d="M58 46c12-10 62-12 76-2l3 9c-22-6-58-6-80 2z" fill="#e8843a" stroke="#8a421a" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M62 44c2-20 16-32 32-32 17 0 29 10 32 28-18-6-46-4-64 4z" fill="url(#htl-hat)" stroke="#8a421a" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M70 24c6-7 14-10 24-10" stroke="#ffc084" strokeWidth="1.6" fill="none" opacity="0.7" />
          <path d="M64 38c18-8 42-8 60 0" stroke="#8a421a" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.8" />
          <path d="M82 14l15-3 3 13-15 3z" fill="#ffc98a" stroke="#8a421a" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M84 17l4-1M90 16l4-1M94 24l4-1" stroke="#8a421a" strokeWidth="0.9" />
          <circle cx="112" cy="24" r="7" fill="#d9742b" stroke="#8a421a" strokeWidth="1.2" />
          <path d="M108 24h8M112 20v8" stroke="#ffc98a" strokeWidth="1" />
          <circle cx="96" cy="8" r="3" fill="#c96a26" stroke="#8a421a" strokeWidth="1" />
          <g stroke="#2b2e34" strokeWidth="3" strokeLinecap="round">
            <path d={expression === 'error' || expression === 'sleepy' ? 'M67 64l16-2' : 'M67 60l17 5'} />
            <path d={expression === 'error' || expression === 'sleepy' ? 'M100 58l17-2' : 'M101 64l17-6'} />
          </g>
          {expression === 'happy' ? (
            <g stroke="#2b2e34" strokeWidth="2.6" strokeLinecap="round" fill="none">
              <path d="M72 74c4-6 12-6 16 0" /><path d="M102 68c4-6 12-6 16 0" />
            </g>
          ) : expression === 'sleepy' ? (
            <g stroke="#2b2e34" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <path d="M72 72c5 4 11 3 15-1" /><path d="M102 66c5 4 11 3 15-1" />
            </g>
          ) : (
            <g>
              <ellipse cx="80" cy="74" rx="9.5" ry="8.5" fill="#f8d24b" stroke="#4a3418" strokeWidth="1.5" />
              <ellipse cx="110" cy="68" rx="9.5" ry="8.5" fill="#f8d24b" stroke="#4a3418" strokeWidth="1.5" />
              <ellipse cx="80" cy={expression === 'error' ? 74 : 75} rx={expression === 'error' ? 1.4 : 1.8} ry={expression === 'error' ? 2.4 : 6.4} fill="#241f18" />
              <ellipse cx="110" cy={expression === 'error' ? 68 : 69} rx={expression === 'error' ? 1.4 : 1.8} ry={expression === 'error' ? 2.4 : 6.4} fill="#241f18" />
              <circle cx="77" cy="71" r="1.6" fill="#fff" opacity="0.9" />
              <circle cx="107" cy="65" r="1.6" fill="#fff" opacity="0.9" />
              {expression !== 'error' && (
                <g stroke="#4a3418" strokeWidth="1.8" fill="none" strokeLinecap="round">
                  <path d="M70 70c5-3 12-3 17-1M100 64c5-3 12-3 17-1" />
                </g>
              )}
            </g>
          )}
          {expression === 'working' ? (
            <g>
              <path d="M48 110c12 4 26 3 36-3" stroke="#2b2e34" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <path d="M50 112c12 8 28 7 38 0 1 5-4 8-11 9-10 1-21-3-27-9z" fill="#f7f0e4" stroke="#2b2e34" strokeWidth="1.2" />
              <path d="M60 112v8M70 114v8M80 114v7" stroke="#c9c2b4" strokeWidth="1" />
            </g>
          ) : expression === 'happy' ? (
            <g>
              <path d="M48 108c12 12 32 12 44 0-2 12-12 18-23 18s-19-7-21-18z" fill="#5a2b2b" stroke="#2b2e34" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M58 120c6 4 14 4 20 0-3 6-14 7-20 0z" fill="#e8776f" />
              <path d="M72 110l4 9 4-8z" fill="#fffdf6" stroke="#c9c2b4" strokeWidth="0.8" />
            </g>
          ) : expression === 'error' ? (
            <g>
              <path d="M50 110c6-4 11 4 17 0s11 4 17 0" stroke="#2b2e34" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M56 116c8 6 20 6 28-2 0 8-6 12-14 12s-13-4-14-10z" fill="#4a2424" />
            </g>
          ) : expression === 'thinking' ? (
            <path d="M52 112c6 3 14 2 19-3" stroke="#2b2e34" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          ) : expression === 'sleepy' ? (
            <path d="M54 114c7 2 14 1 18-2" stroke="#2b2e34" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          ) : (
            <g>
              <path d="M46 110c14 6 30 6 42-2" stroke="#2b2e34" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M50 112c12 6 26 6 36 0 0 6-6 9-13 9-9 0-19-4-23-9z" fill="#f7f0e4" stroke="#2b2e34" strokeWidth="1.2" />
              <path d="M74 114l4 9 3-9z" fill="#fffdf6" stroke="#c9c2b4" strokeWidth="0.8" />
            </g>
          )}
        </g>

        {/* 表情小符号 */}
        {expression === 'happy' && (
          <g stroke="#ffd27a" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
            <path d="M150 92l3-9M158 98l4-9M166 104l3-8" />
          </g>
        )}
        {expression === 'thinking' && (
          <g fill="#c98a4a" opacity="0.9">
            <circle cx="150" cy="100" r="2" /><circle cx="156" cy="92" r="2.6" /><circle cx="163" cy="83" r="3.2" />
          </g>
        )}
        {expression === 'working' && (
          <g stroke="#d9a05a" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
            <path d="M148 176l8-10M156 182l8-10M164 188l6-8" />
          </g>
        )}
        {expression === 'error' && (
          <path d="M138 52c0 5 3 7 6 7s6-2 6-7c0-4-6-11-6-11s-6 7-6 11z" fill="#8fb8d8" stroke="#6d96b8" strokeWidth="1" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#d9a05a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M152 66h6l-6 5h6" /><path d="M162 52h5l-5 4h5" />
          </g>
        )}
      </g>
    </svg>
  ),

  // ---------------------------------------------------------
  // 南宫问天：半身到腰的侧身少年，长枪斜过背后、红缨在肩后
  // 头占 26%，米白衣 + 青护腕 + 束发髻与飘起的青发带
  // ---------------------------------------------------------
  'nangong-wentian': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="ngwt-paper" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#f4f7f5" /><stop offset="55%" stopColor="#e6eeeb" /><stop offset="100%" stopColor="#cfdedb" />
        </linearGradient>
        <linearGradient id="ngwt-robe" x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#f8f4e8" /><stop offset="55%" stopColor="#ebe4d2" /><stop offset="100%" stopColor="#c8c0a9" />
        </linearGradient>
        <linearGradient id="ngwt-cyan" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#54a39d" /><stop offset="55%" stopColor="#2f7f7b" /><stop offset="100%" stopColor="#1d5a58" />
        </linearGradient>
        <linearGradient id="ngwt-hair" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3e4a4d" /><stop offset="55%" stopColor="#2a3336" /><stop offset="100%" stopColor="#161d20" />
        </linearGradient>
        <linearGradient id="ngwt-skin" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f7ddc6" /><stop offset="70%" stopColor="#e9c5aa" /><stop offset="100%" stopColor="#cfa487" />
        </linearGradient>
        <linearGradient id="ngwt-blade" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#f8fbfb" /><stop offset="45%" stopColor="#cfdcdd" /><stop offset="100%" stopColor="#93a6a6" />
        </linearGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.6)' : undefined}>
        <rect x="0" y="-4" width="200" height="264" fill="url(#ngwt-paper)" />
        <path d="M-6 176L34 120l26 30 24-26 34 34 30-22 54 38v90H-6z" fill="#7d9996" opacity="0.22" />
        <path d="M-6 202l36-38 28 26 26-26 34 32 28-20 58 36v64H-6z" fill="#6e8b88" opacity="0.26" />
        <path d="M-6 230l44-24 32 16 30-12 36 18 34-14 34 18v42H-6z" fill="#5f7c7a" opacity="0.32" />
        <g fill="#ffffff" opacity="0.5">
          <ellipse cx="30" cy="186" rx="44" ry="8" /><ellipse cx="152" cy="210" rx="52" ry="7" /><ellipse cx="96" cy="238" rx="76" ry="8" />
        </g>
        <g stroke="#5f6f6e" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.65">
          <path d="M30 74c4-4 8-4 12 0M42 74c4-4 8-4 12 0" />
          <path d="M54 58c3-3 6-3 9 0M63 58c3-3 6-3 9 0" />
          <path d="M148 96c3-3 6-3 9 0M157 96c3-3 6-3 9 0" />
        </g>
        <g fill="#b23a2e" opacity="0.75">
          <rect x="170" y="226" width="15" height="15" rx="1.5" />
          <path d="M174 230h7M174 234h7M174 237h4" stroke="#f2f6f4" strokeWidth="1.1" />
        </g>

        {/* 长枪：斜挎在身前，枪杆从腰侧穿到画面左下 */}
        <path d="M74 112c-14 6-24 18-28 32-2 8 4 12 12 8 10-6 18-16 22-28z" fill="url(#ngwt-robe)" stroke="#4e5350" strokeWidth="1.4" />
        <path d="M58 142c4-6 8-12 14-16M54 152c4-6 8-10 14-14" stroke="#c9c0ab" strokeWidth="0.8" fill="none" opacity="0.9" />
        <path d="M92 88l-2 20 16 2 2-20z" fill="url(#ngwt-skin)" />
        <path d="M76 106c14-8 34-8 48 2 10 8 15 20 17 36 4 30 6 66 6 114H52c0-48 2-104 8-132 3-10 7-16 16-20z" fill="url(#ngwt-robe)" stroke="#4e5350" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M122 108c12 10 18 26 20 44 4 30 5 64 5 106h-16c0-40-1-78-4-104-2-20-6-36-14-46z" fill="#cfc7b2" opacity="0.5" />
        <path d="M84 106l16 14 18-16 6 8-24 24-26-22z" fill="#f8f5ea" stroke="#4e5350" strokeWidth="1.4" strokeLinejoin="miter" />
        <path d="M84 106l16 14L82 138l-6-2z" fill="#e6e0cf" stroke="#4e5350" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M118 104l6 4-16 20-2-14z" fill="#f8f5ea" stroke="#4e5350" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M90 100c6 6 14 6 20 0l4 6-14 12-14-12z" fill="#f8f5ea" stroke="#4e5350" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M100 120l-16 18" stroke="#2f7f7b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M124 108l-16 20" stroke="#2f7f7b" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M84 112c-6 10-9 22-10 34M118 110c6 10 9 22 10 36" stroke="#c9c0ab" strokeWidth="1" fill="none" opacity="0.85" />
        <path d="M56 186c28 9 62 9 90 0l3 16c-30 10-66 10-96 0z" fill="url(#ngwt-cyan)" stroke="#1d5a58" strokeWidth="1.4" />
        <path d="M72 190c-4 14-4 26-2 38l8-2c-1-12 1-24 4-34z" fill="#2f7f7b" stroke="#1d5a58" strokeWidth="1.2" />
        <path d="M84 192c0 12 1 22 3 30" stroke="#8fc7c2" strokeWidth="1.2" opacity="0.7" />
        <circle cx="80" cy="194" r="6" fill="#2f7f7b" stroke="#1d5a58" strokeWidth="1.2" />
        <path d="M80 200c0 8-2 14-4 20" stroke="#1d5a58" strokeWidth="1" />
        <path d="M68 150c-2 20-2 44-1 66M108 146c-1 24-1 54 1 78M92 158c1 26 1 56 0 84" stroke="#c9c0ab" strokeWidth="0.9" fill="none" opacity="0.8" />
        <path d="M58 176c4 6 10 10 18 12M126 170c-4 8-10 12-18 14" stroke="#c9c0ab" strokeWidth="0.8" fill="none" opacity="0.7" />

        {/* 枪杆压在袍前，手握处有缠布 */}
        <path d="M52 268L168 64" stroke="#6b4a2e" strokeWidth="6" strokeLinecap="round" />
        <path d="M53 265L168 65" stroke="#b08a5a" strokeWidth="1.6" opacity="0.75" />
        <path d="M66 240l10 8M80 216l10 8" stroke="#4a3220" strokeWidth="1.8" opacity="0.65" />
        <path d="M54 266l-5 2" stroke="#c9a45c" strokeWidth="4" strokeLinecap="round" />
        <path d="M106 158l10 4-2 5-10-4z" fill="#2f7f7b" opacity="0.9" />

        {/* 近侧手臂横过胸前，青护腕包住小臂，手扣在枪杆上 */}
        <path d="M120 108c10 4 16 14 17 26l-12 3c-1-8-5-15-11-19z" fill="url(#ngwt-robe)" stroke="#4e5350" strokeWidth="1.4" strokeLinejoin="miter" />
        <path d="M123 134l15 6-12 24-12-7z" fill="url(#ngwt-cyan)" stroke="#1d5a58" strokeWidth="1.3" strokeLinejoin="miter" />
        <path d="M124 142l11 4M121 150l11 4" stroke="#8fc7c2" strokeWidth="1.1" opacity="0.8" />
        <path d="M102 156c7-3 14 1 15 8 1 7-4 11-11 11-6 0-10-4-9-9z" fill="url(#ngwt-skin)" stroke="#b98f76" strokeWidth="1.1" />
        <path d="M103 163c-4 0-7 2-7 5M109 157l2-4M115 158l1-4" stroke="#c79b80" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M104 164c4 1 8 0 10-2M105 169c4 0 7-1 9-3" stroke="#c79b80" strokeWidth="0.8" fill="none" />

        {/* 头发与脸：3/4 侧脸，黑发束髻、青带向左飘 */}
        <path d="M54 30c-10-4-19-4-26 0 7 2 13 6 17 12 2-4 5-8 9-12z" fill="url(#ngwt-cyan)" stroke="#1d5a58" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M52 36c-9 1-16 6-20 13 7-1 13-4 18-8z" fill="url(#ngwt-cyan)" stroke="#1d5a58" strokeWidth="1.1" strokeLinejoin="round" />
        <circle cx="62" cy="30" r="7" fill="url(#ngwt-hair)" stroke="#161d20" strokeWidth="1.3" />
        <path d="M55 28c4-4 9-4 12 0l-1 6c-3-3-6-3-9 0z" fill="#2f7f7b" stroke="#1d5a58" strokeWidth="1" />
        <path d="M58 38c-2 8-4 14-8 20" stroke="#2a3336" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M70 58c-4-28 10-44 30-44 17 0 28 11 30 28-8-8-18-11-31-9-13 2-23 10-27 21 1 3 0 4-2 4z" fill="url(#ngwt-hair)" stroke="#161d20" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M70 56c0-21 13-34 29-34 17 0 28 13 28 33 0 14-7 26-19 30-9 2-18-1-24-8-7-7-11-14-14-21z" fill="url(#ngwt-skin)" stroke="#b98f76" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M124 62c4 0 6 2 6 4s-2 4-5 4" fill="url(#ngwt-skin)" stroke="#b98f76" strokeWidth="1" />
        <path d="M120 68c2 1 3 2 2 4" stroke="#c79b80" strokeWidth="0.9" fill="none" />
        <path d="M74 64c-4-2-7 2-6 7 1 5 4 7 7 5" fill="url(#ngwt-skin)" stroke="#b98f76" strokeWidth="1" />
        <path d="M75 68c3 0 4 3 2 5" stroke="#c79b80" strokeWidth="0.8" fill="none" />
        <path d="M72 50c6-14 20-21 34-18 10 2 17 8 20 15-9-4-17-5-25-2-7 2-13 7-17 13l-5-6-7 4z" fill="url(#ngwt-hair)" stroke="#161d20" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M82 40c-2 8-3 16-1 24M94 34c-3 8-4 16-2 24M106 34c2 8 2 15 0 22" stroke="#4b575a" strokeWidth="0.9" fill="none" opacity="0.75" />
        <path d="M74 60c-3 12-3 24 0 34l7-2c-2-10-2-20 0-28z" fill="url(#ngwt-hair)" stroke="#161d20" strokeWidth="1.1" />
        <path d="M110 39c5 5 8 12 8 20l-7-8z" fill="url(#ngwt-hair)" stroke="#161d20" strokeWidth="1.1" />
        <path d="M76 60c5-4 10-4 14-2" stroke="#8fa3a2" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M82 108c8 4 14 10 18 18" stroke="#c9c0ab" strokeWidth="0.9" fill="none" opacity="0.8" />
        <ellipse cx="96" cy="76" rx="5" ry="2.4" fill="#d98a86" opacity="0.16" />

        {/* 坚定的眼睛：3/4 脸两只眼都露，近侧眼更大 */}
        <path d="M100 48l19 3" stroke="#242e31" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M79 53l14 1" stroke="#242e31" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
        {expression === 'happy' ? (
          <g stroke="#26343a" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M82 62c3-3 7-3 9 0" /><path d="M102 58c4-4 10-4 13 0" />
          </g>
        ) : expression === 'sleepy' ? (
          <g stroke="#26343a" strokeWidth="2" fill="none" strokeLinecap="round">
            <path d="M82 62c3 2 7 2 9-1" /><path d="M102 58c4 3 10 3 13-1" />
          </g>
        ) : expression === 'error' ? (
          <g>
            <ellipse cx="87" cy="62" rx="5.5" ry="5.5" fill="#fffdf6" stroke="#3a3a36" strokeWidth="1.1" />
            <ellipse cx="109" cy="58" rx="6.5" ry="6.5" fill="#fffdf6" stroke="#3a3a36" strokeWidth="1.1" />
            <circle cx="88" cy="61" r="2.2" fill="#26343a" /><circle cx="110" cy="57" r="2.6" fill="#26343a" />
            <path d="M100 46l19-3" stroke="#242e31" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <path d="M80 63c3-5 9-5 12 0-3 4-9 4-12 0z" fill="#fffdf6" stroke="#3a3a36" strokeWidth="1" />
            <path d="M100 58c3-6 12-6 16 0-4 5-12 5-16 0z" fill="#fffdf6" stroke="#3a3a36" strokeWidth="1.1" />
            <circle cx={expression === 'thinking' ? 89 : 88} cy={expression === 'thinking' ? 62 : 63} r="2.4" fill="#26343a" />
            <circle cx={expression === 'thinking' ? 112 : 110} cy={expression === 'thinking' ? 57 : 59} r="3.2" fill="#26343a" />
            <circle cx="109" cy="57" r="1" fill="#fff" opacity="0.9" />
            <circle cx="87" cy="61" r="0.8" fill="#fff" opacity="0.8" />
            <path d="M100 57c5-5 12-5 16 0" stroke="#26343a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M80 62c3-4 9-4 12 0" stroke="#26343a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M101 63c4 1 9 1 13-1" stroke="#c99f86" strokeWidth="0.8" fill="none" opacity="0.6" />
            {expression === 'working' && <path d="M102 64l13-1" stroke="#26343a" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />}
          </g>
        )}
        <path d={expression === 'happy' ? 'M105 78c4 2 7 1 9-2' : expression === 'error' ? 'M105 79c3 3 6 3 8 0' : expression === 'sleepy' ? 'M106 79c3 1 5 0 7-1' : expression === 'thinking' ? 'M106 78c3 1 5 0 6-2' : 'M106 78h7'} stroke="#9a5b62" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M92 86c5 2 10 1 14-2" stroke="#c99f86" strokeWidth="0.9" fill="none" opacity="0.7" />

        {/* 枪头、红缨与护环 */}
        <path d="M186 34L174 68L162 61Z" fill="url(#ngwt-blade)" stroke="#6f8586" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M182 38L166 61" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
        <path d="M162 61l12 7-4 4-4-7z" fill="#3a5254" />
        <path d="M162 61l12 7" stroke="#c9a45c" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M160 66c10 6 18 14 22 24M160 70c12 4 20 12 24 22M158 74c8 8 12 18 12 28" stroke="#b23a2e" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <circle cx="160" cy="68" r="3" fill="#b23a2e" />

        {expression === 'happy' && (
          <path d="M40 88l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#2f7f7b" opacity="0.8" />
        )}
        {expression === 'thinking' && (
          <g fill="#2f7f7b" opacity="0.7">
            <circle cx="152" cy="112" r="1.8" /><circle cx="159" cy="104" r="2.2" /><circle cx="166" cy="95" r="2.6" />
          </g>
        )}
        {expression === 'working' && (
          <g stroke="#2f7f7b" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
            <path d="M150 120l7-10M158 124l7-10M166 128l5-8" />
          </g>
        )}
        {expression === 'error' && (
          <path d="M142 88c0 4 2.6 6 4.8 6s4.8-2 4.8-6c0-3-4.8-8.6-4.8-8.6s-4.8 5.6-4.8 8.6z" fill="#6f9fa0" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#2f7f7b" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.65">
            <path d="M36 108h5l-5 4h5" /><path d="M46 96h4l-4 3.4h4" />
          </g>
        )}
      </g>
    </svg>
  ),

  // ---------------------------------------------------------
  // 麦当：深蓝星空，仰头看星；一只手举星，一只手挡在额前
  // 头占 30%，红头巾结飘起、橙红外套、护目镜挂在脖子上
  // ---------------------------------------------------------
  maidang: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="md-sky" x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#071225" /><stop offset="52%" stopColor="#122c50" /><stop offset="100%" stopColor="#2a4f7c" />
        </linearGradient>
        <radialGradient id="md-halo" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3f6da3" stopOpacity="0.5" /><stop offset="100%" stopColor="#3f6da3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="md-jacket" x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#f4662f" /><stop offset="55%" stopColor="#d8411f" /><stop offset="100%" stopColor="#a82a15" />
        </linearGradient>
        <linearGradient id="md-shirt" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#f7efdf" /><stop offset="65%" stopColor="#e6dcc8" /><stop offset="100%" stopColor="#c9bda6" />
        </linearGradient>
        <linearGradient id="md-skin" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#f8d8b8" /><stop offset="70%" stopColor="#e9b98f" /><stop offset="100%" stopColor="#cf9670" />
        </linearGradient>
        <linearGradient id="md-band" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ef5540" /><stop offset="60%" stopColor="#d8392a" /><stop offset="100%" stopColor="#a92218" />
        </linearGradient>
        <linearGradient id="md-hair" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#4a3826" /><stop offset="55%" stopColor="#30251a" /><stop offset="100%" stopColor="#1c1610" />
        </linearGradient>
        <linearGradient id="md-planet" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#9298cf" /><stop offset="55%" stopColor="#6a6fae" /><stop offset="100%" stopColor="#414779" />
        </linearGradient>
        <radialGradient id="md-starglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe98a" stopOpacity="0.6" /><stop offset="100%" stopColor="#ffe98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.5)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#md-sky)" />
        <ellipse cx="112" cy="82" rx="104" ry="86" fill="url(#md-halo)" />
        <g fill="#ffffff">
          <circle cx="22" cy="52" r="1.2" opacity="0.8" /><circle cx="62" cy="34" r="1.6" opacity="0.9" /><circle cx="88" cy="18" r="1" opacity="0.7" />
          <circle cx="126" cy="34" r="1.2" opacity="0.75" /><circle cx="150" cy="20" r="1.4" opacity="0.8" /><circle cx="178" cy="64" r="1.1" opacity="0.7" />
          <circle cx="16" cy="140" r="1.3" opacity="0.75" /><circle cx="40" cy="118" r="1" opacity="0.6" /><circle cx="70" cy="150" r="1.1" opacity="0.55" />
          <circle cx="182" cy="104" r="1.5" opacity="0.85" /><circle cx="166" cy="154" r="1" opacity="0.6" /><circle cx="12" cy="200" r="1.2" opacity="0.5" />
          <circle cx="188" cy="206" r="1.4" opacity="0.65" /><circle cx="142" cy="180" r="0.9" opacity="0.5" /><circle cx="54" cy="66" r="1" opacity="0.65" />
        </g>
        <g fill="#cfe4ff">
          <path d="M103 24l1.2 3.2 3.2 1.2-3.2 1.2-1.2 3.2-1.2-3.2-3.2-1.2 3.2-1.2z" opacity="0.8" />
          <path d="M176 128l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" opacity="0.7" />
        </g>
        <g>
          <circle cx="36" cy="38" r="15" fill="url(#md-planet)" stroke="#9fa8dd" strokeWidth="1.2" />
          <ellipse cx="36" cy="38" rx="25" ry="6.5" fill="none" stroke="#b9aae2" strokeWidth="2.6" transform="rotate(-18 36 38)" opacity="0.75" />
          <circle cx="31" cy="33" r="3.2" fill="#8287c2" opacity="0.8" />
          <circle cx="42" cy="43" r="2" fill="#8287c2" opacity="0.8" />
          <path d="M24 44c6 4 16 5 24 1" stroke="#aab2e6" strokeWidth="0.9" fill="none" opacity="0.5" />
        </g>
        <g>
          <path d="M12 120l24-18" stroke="#9fd0ff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
          <path d="M16 114l9 7" stroke="#e8f4ff" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="35" cy="103" r="2.2" fill="#ffffff" />
        </g>
        <g>
          <path d="M188 198l-22 16" stroke="#9fd0ff" strokeWidth="2.6" strokeLinecap="round" opacity="0.8" />
          <circle cx="167" cy="214" r="1.9" fill="#ffffff" />
        </g>

        {/* 举星的右臂先铺，被身体压住肩部 */}
        <path d="M116 150C136 146 150 132 156 114L168 118C162 140 146 158 124 166Z" fill="url(#md-jacket)" stroke="#8f2213" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M152 110l16 6-3 9-16-6z" fill="#f7efdf" stroke="#c9bda6" strokeWidth="1.2" />
        <path d="M122 156c10-4 18-10 24-18" stroke="#ff9a63" strokeWidth="1.2" fill="none" opacity="0.55" />
        <path d="M82 148c12-6 30-6 42 2 8 6 13 16 15 30l5 80H70l3-78c2-14 6-24 9-34z" fill="url(#md-shirt)" stroke="#7c6f5c" strokeWidth="1.4" strokeLinejoin="miter" />
        <path d="M84 146c-12 4-20 14-23 30-3 18-5 46-5 84h28l-1-62-4-52z" fill="url(#md-jacket)" stroke="#8f2213" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M120 146c12 4 20 14 23 30 3 18 4 46 4 84h-27l-1-62 3-52z" fill="url(#md-jacket)" stroke="#8f2213" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M74 190c-2 24-2 48-1 70M130 188c2 24 2 50 1 72" stroke="#ff9a63" strokeWidth="1.1" fill="none" opacity="0.5" />
        <path d="M94 142l10 12 12-12-2-6-10 8-8-8z" fill="#a82a15" stroke="#7c1c0f" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M88 146c6 8 16 8 24 0l-4 10c-5 4-11 4-16 0z" fill="#f7efdf" />
        <path d="M64 224h74l2 12H62z" fill="#8f2213" opacity="0.6" />

        {/* 头巾飘带先铺在脑后 */}
        <path d="M66 88c-10-8-20-12-28-10 6 8 10 16 12 26 4-8 10-13 16-16z" fill="url(#md-band)" stroke="#8a1c12" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M64 94c-8 2-14 8-18 16 8-1 14-4 20-9z" fill="url(#md-band)" stroke="#8a1c12" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M42 82c4 3 6 7 7 12M40 104c4-1 7-3 9-5" stroke="#ff8b74" strokeWidth="1.1" fill="none" opacity="0.7" />
        <path d="M66 70c8-8 18-10 27-6l-2 10c-8-3-16-2-23 3z" fill="url(#md-hair)" stroke="#1c1610" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M112 62c5-4 11-4 15 0l-2 12c-4-4-9-5-14-2z" fill="url(#md-hair)" stroke="#1c1610" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M80 68c-3 8-4 15-3 22l6-1c0-7 1-13 3-18zM124 72c3 7 4 14 3 21l-6-1c0-7 0-12-2-17z" fill="url(#md-hair)" stroke="#1c1610" strokeWidth="1.2" strokeLinejoin="round" />
        <ellipse cx="96" cy="104" rx="29" ry="35" fill="url(#md-skin)" stroke="#b98a68" strokeWidth="1.2" />
        <path d="M72 94c4 2 6 6 6 12-4 0-7-4-8-8zM120 90c4 2 6 6 6 11-4 0-7-3-8-7z" fill="#e0b089" opacity="0.5" />
        <path d="M68 92c16-8 40-10 58-4l-1 9c-17-6-39-4-55 4z" fill="url(#md-band)" stroke="#8a1c12" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M74 90c12-4 32-6 46-2" stroke="#ff9a86" strokeWidth="1.2" fill="none" opacity="0.7" />
        <circle cx="66" cy="92" r="6" fill="url(#md-band)" stroke="#8a1c12" strokeWidth="1.2" />
        <path d="M63 92c2-2 5-2 7 0" stroke="#ff8b74" strokeWidth="1" fill="none" opacity="0.8" />
        <path d="M84 66c-2 10-2 18 0 26M110 62c-2 10-2 18 0 25M96 60c-2 10-2 18 0 26" stroke="#4a3826" strokeWidth="1" fill="none" opacity="0.7" />
        <path d="M66 104c-2 14-1 26 3 36l8-2c-4-10-5-22-4-32zM126 100c3 14 2 26-2 36l-8-2c4-10 5-22 3-32z" fill="url(#md-hair)" stroke="#1c1610" strokeWidth="1.1" strokeLinejoin="round" />

        {/* 仰头看星的眉眼，眼珠偏上偏右 */}
        <g stroke="#3a2a1c" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d={expression === 'error' ? 'M76 88l13-3' : expression === 'sleepy' ? 'M78 92l11-1' : 'M78 90l12-4'} />
          <path d={expression === 'error' ? 'M102 84l13-3' : expression === 'sleepy' ? 'M104 88l11-1' : 'M104 86l12-4'} />
        </g>
        {expression === 'happy' ? (
          <g stroke="#3a2a1c" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M79 104c3-6 11-6 14 0" /><path d="M105 99c3-6 11-6 14 0" />
          </g>
        ) : expression === 'sleepy' ? (
          <g stroke="#3a2a1c" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M79 102c4 4 10 4 14 0" /><path d="M105 97c4 4 10 4 14 0" />
          </g>
        ) : expression === 'error' ? (
          <g>
            <ellipse cx="86" cy="104" rx="7.5" ry="8" fill="#fffdf6" stroke="#3a2a1c" strokeWidth="1.4" />
            <ellipse cx="112" cy="98" rx="7.5" ry="8" fill="#fffdf6" stroke="#3a2a1c" strokeWidth="1.4" />
            <circle cx="88" cy="103" r="2.8" fill="#3a2a1c" /><circle cx="114" cy="97" r="2.8" fill="#3a2a1c" />
          </g>
        ) : (
          <g>
            <ellipse cx="86" cy="104" rx="6" ry="7" fill="#3a2a1c" />
            <ellipse cx="112" cy="98" rx="6" ry="7" fill="#3a2a1c" />
            <circle cx="88" cy="101" r="1.8" fill="#ffffff" />
            <circle cx="114" cy="95" r="1.8" fill="#ffffff" />
            <circle cx={expression === 'thinking' ? 85 : 86} cy={expression === 'thinking' ? 101 : 104} r="1.4" fill="#6b4a2e" opacity="0.5" />
          </g>
        )}
        <path d="M104 114c3 1 4 3 2 5" stroke="#c08a62" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M100 128c4 3 8 3 11 0-2 7-9 8-11 0z" fill="#8d4a44" stroke="#6b3430" strokeWidth="1.1" strokeLinejoin="round" />
        {expression === 'happy' && <path d="M103 131c2-1 4-1 5 0-1 3-4 4-5 0z" fill="#f28d8d" />}
        <ellipse cx="76" cy="114" rx="5" ry="2.6" fill="#e08a76" opacity="0.3" />
        <ellipse cx="117" cy="108" rx="5" ry="2.6" fill="#e08a76" opacity="0.3" />

        {/* 护目镜挂在脖子上 */}
        <path d="M80 142c10 10 32 10 42-2" stroke="#4a3a2a" strokeWidth="3" fill="none" />
        <circle cx="88" cy="154" r="9" fill="url(#md-planet)" stroke="#c9d3dc" strokeWidth="2.6" />
        <circle cx="108" cy="154" r="9" fill="url(#md-planet)" stroke="#c9d3dc" strokeWidth="2.6" />
        <path d="M84 150c2-3 5-4 7-3M104 150c2-3 5-4 7-3" stroke="#dff3fa" strokeWidth="1.6" fill="none" opacity="0.8" />
        <path d="M96 154h4" stroke="#8e9aa6" strokeWidth="2.4" />
        <path d="M76 146l-6 4M120 146l6 4" stroke="#8e9aa6" strokeWidth="2" strokeLinecap="round" />

        {/* 挡在额前的手 */}
        <path d="M74 162C57 156 46 145 44 132l14-4c2 10 10 18 22 22z" fill="url(#md-jacket)" stroke="#8f2213" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M48 124l10-26 14 6-10 28z" fill="url(#md-jacket)" stroke="#8f2213" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M58 90l16 8-4 8-16-8z" fill="#f7efdf" stroke="#c9bda6" strokeWidth="1.2" />
        <path d="M64 84c5-4 13-2 15 4 2 6-2 11-8 11-6 0-9-4-9-8z" fill="url(#md-skin)" stroke="#b98a68" strokeWidth="1.2" />
        <path d="M78 82l9-3M80 86l10-2M79 90l9 1M77 94l7 3M65 94c-4 0-6 2-6 5" stroke="#c08a62" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M69 100c2-2 5-2 7 0" stroke="#d9a97e" strokeWidth="1" fill="none" />

        {/* 举起的星与手 */}
        <circle cx="160" cy="78" r="28" fill="url(#md-starglow)" />
        <path d="M160 58l5.2 14.6L180 74l-11.8 9.2 4.2 15.4-12.4-8.2-12.4 8.2 4.2-15.4L140 74l14.8-1.4z" fill="#ffd94a" stroke="#e8a51f" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M160 64l3.2 9L172 74l-7 5.6 2.4 9.4-7.4-4.8-7.4 4.8 2.4-9.4L148 74l8.8-1z" fill="#fff2a4" opacity="0.65" />
        <path d="M152 96c6-3 12 0 13 6 1 6-4 11-10 10-5-1-8-5-7-10z" fill="url(#md-skin)" stroke="#b98a68" strokeWidth="1.2" />
        <path d="M156 94l-1-6M161 94v-7M166 97l3-6" stroke="#b98a68" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M154 108c3 1 7 0 9-2" stroke="#c08a62" strokeWidth="1" fill="none" />

        {expression === 'thinking' && (
          <g fill="#9fd0ff" opacity="0.85">
            <circle cx="146" cy="190" r="1.8" /><circle cx="154" cy="182" r="2.2" /><circle cx="161" cy="173" r="2.6" />
          </g>
        )}
        {expression === 'working' && (
          <g stroke="#ffcf7a" strokeWidth="1.4" strokeLinecap="round" opacity="0.8">
            <path d="M40 176l7-11M47 184l7-11M54 192l5-9" />
          </g>
        )}
        {expression === 'error' && (
          <path d="M70 78c0 4 2.6 6 4.8 6s4.8-2 4.8-6c0-3-4.8-8.6-4.8-8.6s-4.8 5.6-4.8 8.6z" fill="#8fd0f0" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#9fd0ff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.75">
            <path d="M142 218h5l-5 4h5" /><path d="M152 206h4l-4 3.4h4" />
          </g>
        )}
      </g>
    </svg>
  ),
}
