// ============================================================
// 《虹猫蓝兔七侠传》同人角色立绘 · 重绘版
// 原创同人风演绎，非官方立绘；仅用于本地体验
// ------------------------------------------------------------
// 武侠古风：暖青绿到米色的渐变底 + 远山竹林三层景深。
// 两位角色各自构图、各自脸型与眼型（虹猫猫科竖瞳、蓝兔圆眼），
// 兵器的刀身、护手、缠柄都单独画出来；文件内没有任何共用组件
// 或共用常量数组。渐变、滤镜、剪裁 id 均带前缀（hm-/lt-）。
// ============================================================
import type { CharacterArt } from './types'
export const WUXIA_SERIES: Record<string, CharacterArt> = {
  // ---------------------------------------------------------
  // 虹猫：长剑斜指右上方，额带飘起，眼神锐利，猫科竖瞳
  // 大头身比、宽颊、竖耳；剑从胸前起手，剑尖直接出画
  // ---------------------------------------------------------
  hongmao: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="hm-paper" x1="0" y1="0" x2="0.26" y2="1"><stop offset="0%" stopColor="#a3c2b1" /> <stop offset="44%" stopColor="#cbd5bf" /> <stop offset="100%" stopColor="#f3e8d3" /></linearGradient>
        <linearGradient id="hm-fur" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#f0955a" /> <stop offset="48%" stopColor="#d1652f" /> <stop offset="100%" stopColor="#8e3a1c" /></linearGradient>
        <linearGradient id="hm-robe" x1="0.1" y1="0" x2="0.7" y2="1"><stop offset="0%" stopColor="#f8eed8" /> <stop offset="55%" stopColor="#e9d9b8" /> <stop offset="100%" stopColor="#bfa982" /></linearGradient>
        <linearGradient id="hm-blade" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0%" stopColor="#7f8f98" /> <stop offset="30%" stopColor="#f4f8f9" /> <stop offset="55%" stopColor="#c4d0d5" /> <stop offset="80%" stopColor="#eef4f5" /> <stop offset="100%" stopColor="#78868d" /></linearGradient>
        <radialGradient id="hm-glow" cx="32%" cy="24%" r="64%"><stop offset="0%" stopColor="#fdf3d8" stopOpacity="0.6" /> <stop offset="100%" stopColor="#fdf3d8" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.6)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#hm-paper)" />
        <ellipse cx="70" cy="66" rx="106" ry="96" fill="url(#hm-glow)" />
        {/* 远景：三层山峦，越近越实 */}
        <path d="M-6 170l38-44 26 30 22-22 34 32 30-22 62 40v76H-6z" fill="#4b7368" opacity="0.2" />
        <path d="M-6 200l40-26 30 18 26-16 36 24 34-14 46 22v52H-6z" fill="#3a6156" opacity="0.3" />
        <path d="M-6 232l44-18 34 14 30-10 38 18 36-10 30 12v22H-6z" fill="#2f5a50" opacity="0.32" />
        {/* 竹林：近竹两株 + 竹节 + 竹叶 */}
        <g stroke="#35605a" strokeWidth="2.2" fill="none" opacity="0.32"><path d="M20 0v260M36 0v260M190 0v260" /></g>
        <g stroke="#2c514b" strokeWidth="0.9" fill="none" opacity="0.4"><path d="M15 34h10M15 76h10M15 118h10M15 160h10M15 202h10M15 244h10" /> <path d="M31 54h10M31 96h10M31 138h10M31 180h10M31 222h10" /> <path d="M185 48h10M185 104h10M185 160h10M185 216h10" /></g>
        <g fill="#37665c" opacity="0.26"><path d="M20 62c-16-4-26-16-30-30 14 6 26 16 34 28zM20 104c14-6 24-18 28-32-12 6-24 16-32 28z" /> <path d="M36 136c-14-6-22-18-24-30 12 6 20 16 26 28zM190 122c14-4 22-14 26-26-12 4-22 14-28 24z" /> <path d="M190 184c-14-4-22-14-26-26 12 4 22 14 28 24zM36 214c14-6 22-14 26-26-12 4-20 14-26 24z" /></g>
        {/* 衣袂动势线 + 飞白 */}
        <g stroke="#7a9a8c" strokeWidth="0.8" fill="none" opacity="0.45"><path d="M48 158c-10 8-18 18-24 30M44 178c-9 6-15 14-19 24" /> <path d="M156 212l16-4M150 224l18-4M132 250l16-3" /></g>
        {/* 半身武袍：交领、腰带、右臂抬起，左袖甩出去 */}
        <path d="M60 130C72 120 94 118 110 126c12 6 18 18 20 32 6 30 10 62 12 102H50c2-40 4-86 10-130z" fill="url(#hm-robe)" stroke="#3a3327" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M114 122c10 10 14 24 16 42 4 28 8 60 10 96h-16c-2-30-6-62-10-90-2-18-6-32-14-44z" fill="#c9b492" opacity="0.55" />
        <path d="M80 120L68 146 90 138z" fill="#2f6b5f" stroke="#3a3327" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M104 124L118 146 96 138z" fill="#f4f8ee" stroke="#3a3327" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M86 138l6 46M106 138l-4 46" stroke="#2f6b5f" strokeWidth="1.6" opacity="0.65" />
        <path d="M84 150c6 4 14 4 20 0M78 176c8 6 18 6 26 0" stroke="#c2ac88" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M50 208l100-8 2 16-100 8z" fill="#7a4a32" stroke="#3a3327" strokeWidth="1.4" />
        <circle cx="98" cy="212" r="5.6" fill="#2f6b5f" stroke="#3a3327" strokeWidth="1" />
        <path d="M96 217c-3 10-4 18-2 26M102 217c3 10 5 18 4 26" stroke="#7a4a32" strokeWidth="1.4" fill="none" />
        <path d="M48 254l12-2M120 250l12-3" stroke="#3a3327" strokeWidth="1" opacity="0.45" />
        {/* 左袖：从肩甩向左下，袖口翻起，末端出画 */}
        <path d="M64 132c-12 8-22 22-28 38-2 10 6 16 16 12 10-4 18-16 24-28z" fill="url(#hm-robe)" stroke="#3a3327" strokeWidth="1.6" strokeLinejoin="miter" />
        <path d="M40 164c6 2 14 0 20-4M34 174c6 3 14 1 20-3" stroke="#c2ac88" strokeWidth="0.8" fill="none" />
        <path d="M34 180l8-4M38 186l8-4" stroke="#3a3327" strokeWidth="0.9" opacity="0.4" />
        <ellipse cx="31" cy="172" rx="7" ry="10" transform="rotate(-24 31 172)" fill="#a98f6a" opacity="0.6" />
        {/* 右臂：肩—肘—腕，袖口束紧，手在剑柄上 */}
        <path d="M110 130c12 10 16 26 14 42l-12 4c2-16-2-30-10-40z" fill="#f7ecd6" stroke="#3a3327" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M108 158c2 8 3 14 2 20M104 150c2 6 3 12 3 18" stroke="#c2ac88" strokeWidth="0.8" fill="none" />
        <path d="M104 186c5-2 10-2 14 2l-2 7c-4-3-8-3-12-2z" fill="#2f6b5f" opacity="0.85" />
        {/* 长剑：宽刀身 + 铜护手 + 缠柄 + 朱砂剑穗，剑尖出画 */}
        <path d="M97 194L105 200 210 34 198 26z" fill="url(#hm-blade)" stroke="#5a6a70" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M101 197L204 30" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
        <path d="M103 199L206 32" stroke="#6b7a80" strokeWidth="0.9" opacity="0.65" />
        <path d="M146 128l16-22M162 138l14-20" stroke="#ffffff" strokeWidth="0.9" opacity="0.4" />
        <path d="M92 190L108 204 103 210 87 196z" fill="#c9a45c" stroke="#6f5525" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M90 195l9 7M86 186l9 7" stroke="#8a6b32" strokeWidth="1" opacity="0.8" />
        <path d="M97 194L105 200 88 226 80 220z" fill="#3a2a22" stroke="#1d150e" strokeWidth="1.3" strokeLinejoin="miter" />
        <path d="M95 198l-13 22M99 202l-13 22M102 206l-11 18" stroke="#8a6f52" strokeWidth="0.9" />
        <circle cx="82" cy="224" r="4" fill="#c9a45c" stroke="#6f5525" strokeWidth="1.1" />
        <path d="M80 228c-4 8-3 16 0 22M84 228c3 8 3 14 1 20" stroke="#b23a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M75 250l9 2M84 248l6 3" stroke="#b23a2e" strokeWidth="1" opacity="0.8" />
        <path d="M89 202c2-5 8-7 12-4 4 3 4 9 0 12-5 3-11 1-12-8z" fill="url(#hm-fur)" stroke="#5a2a14" strokeWidth="1.2" />
        <path d="M92 200l3 4M96 197l3 5M100 195l3 5" stroke="#5a2a14" strokeWidth="0.9" />
        <path d="M90 209c3-1 6-1 8 1" stroke="#f7c9a4" strokeWidth="0.9" fill="none" />
        <path d="M93 206l2-1M97 204l2-1" stroke="#f7c9a4" strokeWidth="1" strokeLinecap="round" />
        {/* 猫耳：一只压风、一只竖起；内耳是暖粉 */}
        <path d="M54 70L44 34l26 22z" fill="url(#hm-fur)" stroke="#5a2a14" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M54 64l-6-18 14 14z" fill="#efb0a6" />
        <path d="M98 56l16-28 2 36z" fill="url(#hm-fur)" stroke="#5a2a14" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M102 58l11-18 0 22z" fill="#efb0a6" />
        {/* 猫脸：宽颊、颊毛、口鼻、胡点 */}
        <path d="M54 90c-1-18 12-31 30-31 19 0 30 13 29 32-1 17-13 27-30 28-17 1-29-12-29-29z" fill="url(#hm-fur)" stroke="#5a2a14" strokeWidth="1.8" />
        <path d="M70 104c2-5 9-7 15-5 5 1 8 4 8 8 0 4-6 7-14 7-8 0-11-5-9-10z" fill="#f9ebd4" stroke="#5a2a14" strokeWidth="1.2" />
        <path d="M84 104h4l1 3-5 1z" fill="#8d5347" />
        <path d="M87 110c-2 3-5 3-7 1M87 110c1 3 4 4 6 2" stroke="#5a2a14" strokeWidth="1" fill="none" strokeLinecap="round" />
        <g fill="#5a2a14" opacity="0.65"><circle cx="71" cy="108" r="0.9" /> <circle cx="67" cy="113" r="0.9" /> <circle cx="73" cy="115" r="0.9" /> <circle cx="101" cy="106" r="0.9" /> <circle cx="105" cy="111" r="0.9" /> <circle cx="99" cy="113" r="0.9" /></g>
        <path d="M60 110l-13-3M60 115l-12 3M108 108l13-4M108 113l12 4" stroke="#5a2a14" strokeWidth="0.7" opacity="0.55" />
        <path d="M74 60l-5-10 11 7" fill="url(#hm-fur)" stroke="#5a2a14" strokeWidth="1" strokeLinejoin="miter" />
        {/* 额带：压在额前（画在脸之后才看得见），结在左、尾带朝左飞 */}
        <path d="M51 70c12-6 30-8 46-5 10 2 17 4 22 8l-2 10c-7-4-17-7-29-7-13 0-25 2-33 7z" fill="#b23a2e" stroke="#5a2a14" strokeWidth="1.4" strokeLinejoin="miter" />
        <path d="M53 78c10-4 26-6 40-4 8 1 15 3 20 5" stroke="#f7ecd6" strokeWidth="1.4" fill="none" opacity="0.9" />
        <path d="M52 71c-13-2-26-10-33-19 13 1 25 8 36 16z" fill="#b23a2e" stroke="#5a2a14" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M50 79c-14 2-27 1-37-4 13-2 25-3 35-1z" fill="#d4644f" stroke="#5a2a14" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M36 58c4 3 8 6 11 9M40 74c4 1 8 0 11-1" stroke="#f7ecd6" strokeWidth="0.8" opacity="0.55" />
        {/* 猫科竖瞳：锐利眼型 + 斜眉，和蓝兔的圆眼完全两套 */}
        {expression === 'sleepy' ? (
          <g stroke="#3a2012" strokeWidth="2.1" strokeLinecap="round" fill="none"><path d="M62 90c4 3 11 1 14-3" /> <path d="M90 87c4 3 11 1 13-3" /> <path d="M58 81c5-3 10-3 14-1M92 78c5-3 10-3 14-1" strokeWidth="1.2" opacity="0.65" /></g>
        ) : expression === 'error' ? (
          <g><path d="M64 92c2-7 10-9 15-4 3 2 3 6 1 8-5 3-13 2-16-4z" fill="#f9ebd4" stroke="#3a2012" strokeWidth="1.2" /> <path d="M91 89c2-7 10-9 15-4 3 2 3 6 1 8-5 3-13 2-16-4z" fill="#f9ebd4" stroke="#3a2012" strokeWidth="1.2" /> <ellipse cx="70" cy="93" rx="4.6" ry="5.2" fill="#e8b74a" /> <ellipse cx="97" cy="90" rx="4.6" ry="5.2" fill="#e8b74a" /> <path d="M70 88c-1.4 3.2-1.4 6.6 0 9.8 1.4-3.2 1.4-6.6 0-9.8z" fill="#2a2014" /> <path d="M97 85c-1.4 3.2-1.4 6.6 0 9.8 1.4-3.2 1.4-6.6 0-9.8z" fill="#2a2014" /> <path d="M58 80c6-5 15-6 20-2M106 76c-6-4-14-4-19 0" stroke="#3a2012" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
        ) : expression === 'happy' ? (
          <g stroke="#3a2012" strokeWidth="2.4" strokeLinecap="round" fill="none"><path d="M62 94c4-8 13-9 17-1" /> <path d="M90 91c4-8 12-9 16-1" /> <path d="M58 82c5-4 12-4 16-1M91 79c5-4 12-4 16-1" strokeWidth="1.2" opacity="0.7" /></g>
        ) : (
          <g>
            <path d="M62 92c2-7 10-9 15-4 3 2 3 6 1 8-5 3-13 2-16-4z" fill="#e8b74a" stroke="#3a2012" strokeWidth="1.3" />
            <path d="M90 89c2-7 10-9 15-4 3 2 3 6 1 8-5 3-13 2-16-4z" fill="#e8b74a" stroke="#3a2012" strokeWidth="1.3" />
            <path d="M70 85.4c-1.8 3.6-1.8 7.4 0 11 1.8-3.6 1.8-7.4 0-11z" fill="#2a2014" />
            <path d="M97 82.4c-1.8 3.6-1.8 7.4 0 11 1.8-3.6 1.8-7.4 0-11z" fill="#2a2014" />
            <circle cx="67.6" cy="89" r="1.2" fill="#fff" opacity="0.85" />
            <circle cx="94.6" cy="86" r="1.2" fill="#fff" opacity="0.85" />
            <path d="M59 82c5-6 14-8 20-4M105 78c-5-5-14-6-19-2" stroke="#3a2012" strokeWidth="2.1" fill="none" strokeLinecap="round" />
            <path d="M60 80c5-4 12-5 16-3M104 76c-5-3-12-3-16-1" stroke="#8f3a1e" strokeWidth="0.8" fill="none" opacity="0.65" />
            {expression === 'thinking' && (
              <g fill="#3f7a6a" opacity="0.8"><circle cx="128" cy="70" r="1.6" /> <circle cx="135" cy="62" r="2" /> <circle cx="143" cy="52" r="2.4" /></g>
            )}
            {expression === 'working' && (
              <g stroke="#3f7a6a" strokeWidth="1.2" strokeLinecap="round" opacity="0.75"><path d="M130 88l6-12M138 90l6-12M146 86l4-8" /></g>
            )}
          </g>
        )}
        {/* 嘴：锐气，嘴角往下压 */}
        {expression === 'happy' ? (
          <path d="M79 110c4 4 9 4 13 0" stroke="#5a2a14" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        ) : expression === 'error' ? (
          <ellipse cx="86" cy="112" rx="3.4" ry="3.8" fill="#7d3a2a" />
        ) : (
          <path d={expression === 'sleepy' ? 'M80 112c4 2 9 1 12-1' : expression === 'thinking' ? 'M81 111c3 1 6 0 8-1' : 'M80 111l6 2 6-2'} stroke="#5a2a14" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        )}
        {expression === 'happy' && (
          <path d="M134 68l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" fill="#3f7a6a" opacity="0.85" />
        )}
        {expression === 'error' && (
          <path d="M130 82c0 4.4 2.8 6.4 5 6.4s5-2 5-6.4c0-3.2-5-9.4-5-9.4s-5 6.2-5 9.4z" fill="#b23a2e" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#3f7a6a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"><path d="M132 70h5l-5 4h5" /> <path d="M141 58h4l-4 3.4h4" /></g>
        )}
      </g>
    </svg>
  ),
  // ---------------------------------------------------------
  // 蓝兔：剑横在身前，长耳向后倾斜，雪花发饰反光，圆眼
  // 耳朵是两条长锥形被风压向右后方；剑用小臂托住，双手握柄
  // ---------------------------------------------------------
  lantu: ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="lt-paper" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stopColor="#95b8a8" /> <stop offset="46%" stopColor="#c8d6c4" /> <stop offset="100%" stopColor="#f5ecd9" /></linearGradient>
        <linearGradient id="lt-fur" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#ffffff" /> <stop offset="55%" stopColor="#e8f1f8" /> <stop offset="100%" stopColor="#b6cddf" /></linearGradient>
        <linearGradient id="lt-robe" x1="0.1" y1="0" x2="0.6" y2="1"><stop offset="0%" stopColor="#f9fcfe" /> <stop offset="58%" stopColor="#e2f0f8" /> <stop offset="100%" stopColor="#a9c7db" /></linearGradient>
        <linearGradient id="lt-blade" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0%" stopColor="#86aec6" /> <stop offset="34%" stopColor="#f7fcff" /> <stop offset="62%" stopColor="#cbe3f0" /> <stop offset="88%" stopColor="#ffffff" /> <stop offset="100%" stopColor="#7ea1b7" /></linearGradient>
        <linearGradient id="lt-snow" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stopColor="#ffffff" /> <stop offset="100%" stopColor="#bcd9e8" /></linearGradient>
        <radialGradient id="lt-glow" cx="66%" cy="24%" r="60%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" /> <stop offset="100%" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.6)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#lt-paper)" />
        <ellipse cx="134" cy="54" rx="86" ry="78" fill="url(#lt-glow)" />
        {/* 远景：山与两层竹林，靠透明度做景深 */}
        <path d="M-6 166l44-40 30 26 24-18 36 30 34-20 44 28v80H-6z" fill="#4b7368" opacity="0.18" />
        <path d="M-6 204l42-22 32 16 26-14 38 22 32-12 44 18v46H-6z" fill="#3a6156" opacity="0.28" />
        <g stroke="#35605a" strokeWidth="1.8" fill="none" opacity="0.28"><path d="M8 0v260M22 0v260M182 0v260M196 0v260" /></g>
        <g stroke="#2c514b" strokeWidth="0.8" fill="none" opacity="0.3"><path d="M4 44h9M4 96h9M4 148h9M4 200h9M176 60h9M176 124h9M176 188h9M192 84h9M192 156h9" /></g>
        <g fill="#37665c" opacity="0.2"><path d="M22 64c-13-6-19-16-21-27 11 6 19 14 25 25zM22 112c12-6 18-14 22-24-10 4-18 12-24 22z" /> <path d="M182 140c12-4 18-12 22-22-10 4-18 12-24 20zM182 198c-12-4-18-12-22-22 10 4 18 12 24 20z" /></g>
        {/* 雪点与冰晶 */}
        <g fill="#ffffff" opacity="0.6"><circle cx="40" cy="70" r="1.8" /> <circle cx="152" cy="150" r="1.5" /> <circle cx="58" cy="178" r="1.3" /> <circle cx="172" cy="90" r="1.7" /> <circle cx="32" cy="128" r="1.2" /> <circle cx="164" cy="196" r="1.4" /></g>
        <g stroke="#ffffff" strokeWidth="0.8" opacity="0.5"><path d="M142 60v9M138 64h9M166 118v7M163 121h7M50 156v7M47 159h7M120 44v7M117 47h7" /></g>
        {/* 长耳：两条长锥被风压向右后方，耳尖出画 */}
        <path d="M84 82C102 66 140 34 168 12c6 10-4 30-22 48-18 18-40 30-60 32z" fill="url(#lt-fur)" stroke="#5f7d90" strokeWidth="1.7" strokeLinejoin="miter" />
        <path d="M94 80c16-10 42-30 60-46 0 12-10 26-24 38-14 12-26 18-36 20z" fill="#f6c5cd" opacity="0.9" />
        <path d="M106 76c18-12 54-26 82-38 4 12-8 26-24 36-16 10-38 16-56 18z" fill="url(#lt-fur)" stroke="#5f7d90" strokeWidth="1.7" strokeLinejoin="miter" />
        <path d="M116 76c16-8 42-18 62-26-2 10-12 20-26 28-14 8-26 11-36 12z" fill="#f6c5cd" opacity="0.9" />
        <path d="M100 70c14-12 34-26 50-36M126 70c12-8 28-16 44-22" stroke="#ffffff" strokeWidth="0.9" fill="none" opacity="0.85" />
        {/* 雪花发饰：六根霜枝 + 反光，压在左耳根 */}
        <circle cx="72" cy="80" r="7" fill="#3f7a6a" opacity="0.26" />
        <g stroke="url(#lt-snow)" strokeWidth="1.6" fill="none"><path d="M61 80h22M72 69v22M64 72l16 16M80 72l-16 16" /> <path d="M72 72l-3-3M72 72l3-3M72 88l-3 3M72 88l3 3M63 78l-4-1M81 78l4-1M63 82l-4 1M81 82l4 1" /></g>
        <circle cx="72" cy="80" r="2.2" fill="#ffffff" />
        <path d="M87 66l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#ffffff" opacity="0.95" />
        {/* 肩与冰蓝长袍：护肩披风 + 交领 + 束腰 */}
        <path d="M64 132c12-10 30-14 46-10 14 4 24 14 28 28 6 24 10 58 12 90l2 20H54c2-38 4-86 10-128z" fill="url(#lt-robe)" stroke="#5b7182" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M126 128c14 8 20 24 23 42 3 22 6 48 8 72h-14c-2-28-4-56-9-78-2-14-6-26-14-36z" fill="#b9d2e2" opacity="0.5" />
        <path d="M60 132c10-10 26-16 40-16 8 0 14 2 20 5l-6 14c-14-6-30-4-42 4z" fill="#dcecf6" stroke="#5b7182" strokeWidth="1.3" strokeLinejoin="miter" />
        <path d="M92 124l-10 24 22-10z" fill="#7fa9c9" stroke="#5b7182" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M112 124l12 24-22-10z" fill="#f9fcfe" stroke="#5b7182" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M88 144l4 44M112 144l-2 44" stroke="#9dbfd8" strokeWidth="0.8" fill="none" opacity="0.65" />
        <path d="M62 216c18-2 36-2 54 0" stroke="#7fa9c9" strokeWidth="1.4" fill="none" opacity="0.55" />
        <path d="M64 238l14-2M132 236l14-2" stroke="#5b7182" strokeWidth="0.8" opacity="0.4" />
        {/* 腰间飘带：朝左下甩出去 */}
        <path d="M60 200c-16-4-32-12-46-24 12 20 28 32 46 36z" fill="#d6e8f2" stroke="#5b7182" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M58 208c-16 0-30-4-42-14 12 14 28 20 42 22z" fill="#9dbfd8" opacity="0.85" />
        <path d="M42 192c8 5 15 8 23 10" stroke="#5b7182" strokeWidth="0.8" fill="none" opacity="0.45" />
        {/* 冰魄剑横在身前：厚剑身 + 雪花护手 + 缠柄，剑尖与柄尾都出画 */}
        <path d="M72 172l130-10 12 10-12 10-130 2z" fill="url(#lt-blade)" stroke="#47657a" strokeWidth="1.7" strokeLinejoin="miter" />
        <path d="M74 174l134-9" stroke="#ffffff" strokeWidth="1.5" opacity="0.85" />
        <path d="M74 181l134-2" stroke="#6f95ad" strokeWidth="0.8" opacity="0.65" />
        <path d="M74 185l118-1" stroke="#47657a" strokeWidth="1.2" opacity="0.75" />
        <path d="M118 170l14-3M142 168l12-3M166 166l10-3" stroke="#ffffff" strokeWidth="0.9" opacity="0.5" />
        <path d="M192 162l10 10-10 10-6-10z" fill="#ffffff" opacity="0.9" />
        <path d="M66 158l10 2-2 26-10-2z" fill="#9dbfd8" stroke="#47657a" strokeWidth="1.4" strokeLinejoin="miter" />
        <path d="M66 158c-4 3-6 7-4 11M76 184c4-3 6-7 4-11" stroke="#9dbfd8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M69 166l4 1-1 6-4-1z" fill="#f7fcff" opacity="0.9" />
        <path d="M60 172l-2 10M66 171l-2 10" stroke="#7fa9c9" strokeWidth="1.2" />
        <path d="M18 174l44-2v14l-44 2z" fill="#3f5f7c" stroke="#243a4c" strokeWidth="1.5" />
        <path d="M25 174l-2 13M35 173l-2 13M45 173l-2 13M55 172l-2 13" stroke="#9cc2d8" strokeWidth="1.2" />
        <circle cx="15" cy="182" r="4.6" fill="#9dbfd8" stroke="#47657a" strokeWidth="1.1" />
        <path d="M11 187c-2 10 2 16 0 24M17 187c2 8 0 14 2 20" stroke="#7fa9c9" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M7 212l8 2M17 210l6 3" stroke="#9dbfd8" strokeWidth="1" opacity="0.8" />
        {/* 两只手握住剑柄：指节压出白边，手腕从袖口出来 */}
        <path d="M30 180c6-5 14-5 17 1 2 5-2 10-9 10-5 0-10-5-8-11z" fill="url(#lt-fur)" stroke="#5f7d90" strokeWidth="1.2" />
        <path d="M34 178v11M40 177v11M46 178v10" stroke="#8fa9ba" strokeWidth="0.8" />
        <path d="M48 179c6-5 14-5 17 1 2 5-2 10-9 10-5 0-10-5-8-11z" fill="url(#lt-fur)" stroke="#5f7d90" strokeWidth="1.2" />
        <path d="M52 177v11M58 176v11M64 177v10" stroke="#8fa9ba" strokeWidth="0.8" />
        <path d="M24 180c-4-2-8-2-11 0l2 8c3-2 6-2 9-2z" fill="#dcecf6" stroke="#5b7182" strokeWidth="1" />
        <path d="M70 178c4-2 8-2 11 0l-2 8c-3-2-6-2-9-2z" fill="#dcecf6" stroke="#5b7182" strokeWidth="1" />
        {/* 兔脸：圆脸、圆眼、短口鼻、颊毛 */}
        <path d="M74 100c-1-16 11-27 26-27 16 0 26 11 26 28 0 15-11 24-26 25-15 1-25-10-26-26z" fill="url(#lt-fur)" stroke="#5f7d90" strokeWidth="1.8" />
        <path d="M72 104l-10-4 8-4z" fill="url(#lt-fur)" stroke="#5f7d90" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M89 113c4-3 13-3 17 0 2 2 2 5-1 6-4 2-11 2-15 0-3-1-3-4-1-6z" fill="#ffffff" opacity="0.8" />
        <path d="M98 112h5l-2.5 3z" fill="#d99aa4" />
        <path d="M96 117c1.6 2 4.6 2 6.2 0M99 117v2.4" stroke="#5f7d90" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M83 94l-4-3M83 98l-5-1M123 92l4-3M123 96l5-1" stroke="#8fa9ba" strokeWidth="0.8" opacity="0.65" />
        {/* 圆眼：大虹膜 + 双高光，和虹猫的竖瞳形成对照 */}
        {expression === 'sleepy' ? (
          <g stroke="#2c3a4a" strokeWidth="2" strokeLinecap="round" fill="none"><path d="M80 102c4 3 12 2 15-2M105 100c4 3 12 2 15-2" /> <path d="M79 106l-4 2M104 104l-4 2" strokeWidth="1.2" opacity="0.65" /></g>
        ) : expression === 'error' ? (
          <g><ellipse cx="88" cy="102" rx="7" ry="7.4" fill="#ffffff" stroke="#2c3a4a" strokeWidth="1.3" /> <ellipse cx="113" cy="100" rx="7" ry="7.4" fill="#ffffff" stroke="#2c3a4a" strokeWidth="1.3" /> <circle cx="88" cy="102" r="3.2" fill="#16243a" /> <circle cx="113" cy="100" r="3.2" fill="#16243a" /> <path d="M79 90c4-4 11-4 15-1M104 88c4-4 11-4 15-1" stroke="#2c3a4a" strokeWidth="1.7" fill="none" strokeLinecap="round" /></g>
        ) : expression === 'happy' ? (
          <g stroke="#2c3a4a" strokeWidth="2.2" strokeLinecap="round" fill="none"><path d="M80 104c4-8 13-8 17 0" /> <path d="M105 102c4-8 13-8 16 0" /> <path d="M79 92c4-3 11-3 15 0M104 90c4-3 11-3 15 0" strokeWidth="1.2" opacity="0.7" /></g>
        ) : (
          <g>
            <ellipse cx="88" cy="103" rx="6.8" ry="7" fill="#fbfdff" stroke="#2c3a4a" strokeWidth="1.5" />
            <ellipse cx="113" cy="101" rx="6.8" ry="7" fill="#fbfdff" stroke="#2c3a4a" strokeWidth="1.5" />
            <circle cx={expression === 'thinking' ? 89 : 88} cy={expression === 'thinking' ? 101 : 103} r="4.9" fill="#3b5f8f" />
            <circle cx={expression === 'thinking' ? 114 : 113} cy={expression === 'thinking' ? 99 : 101} r="4.9" fill="#3b5f8f" />
            <circle cx={expression === 'thinking' ? 89 : 88} cy={expression === 'thinking' ? 101 : 103} r="2.3" fill="#16243a" />
            <circle cx={expression === 'thinking' ? 114 : 113} cy={expression === 'thinking' ? 99 : 101} r="2.3" fill="#16243a" />
            <circle cx="85.4" cy="99.4" r="2" fill="#ffffff" />
            <circle cx="110.4" cy="97.4" r="2" fill="#ffffff" />
            <circle cx="90" cy="106" r="0.9" fill="#ffffff" opacity="0.75" />
            <circle cx="115" cy="104" r="0.9" fill="#ffffff" opacity="0.75" />
            <path d="M79 97c4-4 11-4 15-1M104 95c4-4 11-4 15-1" stroke="#2c3a4a" strokeWidth="1.9" fill="none" strokeLinecap="round" />
            <path d="M80 93c4-3 10-3 13 0M104 91c4-3 10-3 13 0" stroke="#8fa9ba" strokeWidth="1.1" fill="none" strokeLinecap="round" />
            {expression === 'working' && (
              <g stroke="#2c3a4a" strokeWidth="0.9" opacity="0.65"><path d="M81 110l14-1M106 108l14-1" /></g>
            )}
          </g>
        )}
        {/* 嘴 */}
        {expression === 'happy' ? (
          <path d="M94 120c2 3 7 3 9 0" stroke="#9a5b62" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        ) : expression === 'error' ? (
          <ellipse cx="99" cy="121" rx="2.5" ry="2.9" fill="#9a5b62" />
        ) : (
          <path d={expression === 'sleepy' ? 'M95 121c2 1.4 5 1 6-1' : 'M95 120c2 1.2 4 1.2 6 0'} stroke="#9a5b62" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        )}
        {/* 表情小符号：冰晶 / 雪点 / 汗滴 / z */}
        {expression === 'happy' && (
          <path d="M148 90l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" fill="#3f7a6a" opacity="0.8" />
        )}
        {expression === 'thinking' && (
          <g fill="#3f7a6a" opacity="0.75"><circle cx="140" cy="74" r="1.6" /> <circle cx="147" cy="66" r="2" /> <circle cx="155" cy="56" r="2.4" /></g>
        )}
        {expression === 'working' && (
          <g stroke="#3f7a6a" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"><path d="M142 94l5-11M150 96l5-11M158 92l3-7" /></g>
        )}
        {expression === 'error' && (
          <path d="M146 76c0 4.4 2.8 6.4 5 6.4s5-2 5-6.4c0-3.2-5-9.4-5-9.4s-5 6.2-5 9.4z" fill="#b23a2e" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#3f7a6a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"><path d="M146 58h5l-5 4h5" /> <path d="M155 46h4l-4 3.4h4" /></g>
        )}
      </g>
    </svg>
  ),
}