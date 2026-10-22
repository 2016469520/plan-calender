// ============================================================
// 《一人之下》同人角色立绘 · 重绘版
// 原创同人风演绎，非官方立绘；仅用于本地体验
// ------------------------------------------------------------
// 刻意不做共享骨架：四个角色各自决定头身比、朝向、镜头裁切，
// 脸型/眼型/嘴型/道具各写一套，文件里没有任何 Eyes/Mouth/Body
// 之类的复用组件，也没有共享常量数组。
// 四个角色统一：极深墨青底 #0f1418 + 水墨线条（主轮廓 1.8、内部 0.8）
// + 飞白断笔 + 青绿 #3f7a6a / 朱砂 #b23a2e 小面积点缀。
// 光线统一从左上打，右侧压暗，避免色块平贴。
// 渐变、滤镜、剪裁 id 一律带角色前缀（fbb-/zcl-/wy-/zgq-）。
// ============================================================
import type { CharacterArt } from './types'
export const YIREN_SERIES: Record<string, CharacterArt> = {
  // ---------------------------------------------------------
  // 冯宝宝：3/4 侧身，头到腰，右手垂菜刀，身子偏左，右侧留白给墨点
  // 头身比 1:3.4，方下颌，死鱼眼（眼白大、瞳孔小、下眼睑平）
  // ---------------------------------------------------------
  'feng-baobao': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="fbb-paper" x1="0" y1="0" x2="0.72" y2="1"><stop offset="0%" stopColor="#151e24" /> <stop offset="48%" stopColor="#0f1418" /> <stop offset="100%" stopColor="#090d10" /></linearGradient>
        <linearGradient id="fbb-hair" x1="0.18" y1="0" x2="0.82" y2="1"><stop offset="0%" stopColor="#39414b" /> <stop offset="42%" stopColor="#1b1f26" /> <stop offset="100%" stopColor="#0b0e12" /></linearGradient>
        <linearGradient id="fbb-tee" x1="0.1" y1="0" x2="0.62" y2="1"><stop offset="0%" stopColor="#f7f3e8" /> <stop offset="56%" stopColor="#e2dccc" /> <stop offset="100%" stopColor="#b7b2a2" /></linearGradient>
        <linearGradient id="fbb-steel" x1="0" y1="0" x2="0.9" y2="0.5"><stop offset="0%" stopColor="#8b979c" /> <stop offset="26%" stopColor="#f1f6f7" /> <stop offset="52%" stopColor="#c2cccf" /> <stop offset="78%" stopColor="#e6edef" /> <stop offset="100%" stopColor="#7d898e" /></linearGradient>
        <linearGradient id="fbb-skin" x1="0.2" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#f8dcc4" /> <stop offset="70%" stopColor="#eecdb3" /> <stop offset="100%" stopColor="#d3a98e" /></linearGradient>
        <radialGradient id="fbb-haze" cx="34%" cy="40%" r="58%"><stop offset="0%" stopColor="#3f7a6a" stopOpacity="0.32" /> <stop offset="100%" stopColor="#3f7a6a" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.4)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#fbb-paper)" />
        <ellipse cx="72" cy="118" rx="98" ry="112" fill="url(#fbb-haze)" />
        {/* 背后水墨元素：巷子霓虹剪影，只留灯带与窗格 */}
        <g fill="#141d26"><path d="M130 58h32v120h-32z" /> <path d="M166 78h28v100h-28z" /> <path d="M128 58h36l-8-14h-22z" fill="#0c1319" /></g>
        <g stroke="#2c4a46" strokeWidth="0.8" fill="none" opacity="0.65"><path d="M138 74v88M150 74v88" /> <path d="M134 98h28M134 124h28M134 150h28" /> <path d="M171 96v72M182 96v72M166 116h26M166 146h26" /> <path d="M159 46v-16M155 30h7" /></g>
        <path d="M139 68h12v28h-12z" fill="#0a1116" stroke="#3f7a6a" strokeWidth="0.9" />
        <path d="M142 75l6 5-6 5" stroke="#3f7a6a" strokeWidth="1.3" fill="none" />
        <path d="M178 86h6v22h-6z" fill="#3f7a6a" opacity="0.28" />
        <path d="M163 40v-12" stroke="#b23a2e" strokeWidth="1.5" opacity="0.55" />
        {/* 右侧留白：墨滴、拖尾与飞白 */}
        <g fill="#3f7a6a"><circle cx="170" cy="150" r="5.4" opacity="0.45" /> <circle cx="185" cy="164" r="2.8" opacity="0.35" /> <circle cx="157" cy="172" r="1.8" opacity="0.42" /> <circle cx="177" cy="185" r="1.2" opacity="0.5" /></g>
        <path d="M169 156c2 9 1 16-2 22" stroke="#3f7a6a" strokeWidth="0.9" fill="none" opacity="0.28" />
        <path d="M146 178c8-3 16-1 21 6" stroke="#0a0e11" strokeWidth="4.6" fill="none" strokeLinecap="round" opacity="0.32" />
        <path d="M150 204c5-2 9-1 12 2" stroke="#0a0e11" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.26" />
        {/* 及腰黑长直：外轮廓比身体宽，形成深色边框；发尾折线收口 */}
        <path d="M50 64C40 96 38 142 42 182c3 30 8 54 12 70h80c4-26 8-62 6-98-2-38-12-72-28-90z" fill="url(#fbb-hair)" />
        <g stroke="#3d4550" strokeWidth="0.8" fill="none" opacity="0.5"><path d="M56 104c-4 32-3 66 1 96M68 112c-3 30-2 62 1 88M120 108c3 30 2 62-1 92M132 96c4 32 3 66-1 98" /></g>
        <path d="M44 236l6-4 2 8 6-6 2 10M118 244l6-4 2 8 6-6 2 10" stroke="#4a525c" strokeWidth="0.8" fill="none" opacity="0.5" />
        {/* 白 T 与深青外套：外套前襟压在 T 恤上，T 只留中间一条白 */}
        <path d="M60 136C64 122 74 114 88 111L90 106 100 112 108 109C120 113 127 123 130 138c4 28 6 62 6 98l2 20H50c0-34 4-84 10-120z" fill="url(#fbb-tee)" stroke="#0a0e11" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M112 116c10 10 14 26 16 46 3 30 4 66 4 92h-10c0-34-2-70-10-100z" fill="#b9b3a3" opacity="0.45" />
        <path d="M58 132c-6 34-10 78-11 120l24 2c0-42 2-82 7-114z" fill="#24463e" stroke="#0a0e11" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M128 136c6 36 10 76 12 118l-24 2c-2-42-4-82-8-112z" fill="#1d3b34" stroke="#0a0e11" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M86 108l12 16 12-16-6-4-6 8-6-8z" fill="#2c4f46" stroke="#0a0e11" strokeWidth="1.1" />
        <path d="M52 252l86-2 1 10H52z" fill="#25403a" stroke="#0a0e11" strokeWidth="1.4" />
        <path d="M64 152l-2 30M66 190l-2 26M120 160l2 34M122 200l1 24" stroke="#7e9a92" strokeWidth="0.8" opacity="0.45" />
        <path d="M64 214h40" stroke="#b23a2e" strokeWidth="1.4" opacity="0.4" />
        {/* 近侧手臂：短袖、小臂、手腕，肘部有褶 */}
        <path d="M114 120c14 4 24 16 28 32l-14 6c-4-12-10-20-20-25z" fill="url(#fbb-tee)" stroke="#0a0e11" strokeWidth="1.5" />
        <path d="M126 158c8 12 13 24 15 36l-12 3c-3-14-7-26-13-36z" fill="url(#fbb-skin)" stroke="#b98f76" strokeWidth="1.2" />
        <path d="M128 172c3 8 5 15 6 22M124 162l6 6" stroke="#c99f86" strokeWidth="0.8" fill="none" />
        {/* 颈与锁骨：脖子短一点，压在下巴下面 */}
        <path d="M80 88l-2 20 24 2 1-20z" fill="url(#fbb-skin)" />
        <path d="M80 96c6 4 14 5 22 3" stroke="#c99f86" strokeWidth="0.8" fill="none" opacity="0.8" />
        <path d="M62 136c8-8 16-13 26-16" stroke="#0a0e11" strokeWidth="1.2" fill="none" opacity="0.45" />
        {/* 3/4 侧脸：左缘是鼻梁，右侧露耳，下颌略方 */}
        <path d="M62 68C62 48 72 38 87 38c15 0 24 11 24 29 0 15-6 26-19 30-13 3-24-4-27-15-1-5-3-10-3-14z" fill="url(#fbb-skin)" stroke="#b98f76" strokeWidth="1" />
        <path d="M109 70c3-2 6 0 6 4s-3 7-6 5z" fill="url(#fbb-skin)" stroke="#c79b80" strokeWidth="0.8" />
        <path d="M110 72c2 2 2 5 0 6" stroke="#c79b80" strokeWidth="0.7" fill="none" />
        <path d="M64 70l-4 8 6 1" stroke="#b98f76" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M65 80c2 10 9 16 19 17" stroke="#c79b80" strokeWidth="0.9" fill="none" opacity="0.85" />
        <path d="M89 92c5 2 10 1 14-2" stroke="#c99f86" strokeWidth="0.8" fill="none" opacity="0.6" />
        <ellipse cx="71" cy="80" rx="5.4" ry="2.8" fill="#dc8f8c" opacity="0.22" />
        <ellipse cx="100" cy="79" rx="5.4" ry="2.8" fill="#dc8f8c" opacity="0.22" />
        {/* 齐刘海：中分感 + 断笔，发顶有一道高光 */}
        <path d="M62 64C62 44 73 34 87 34c15 0 25 11 24 29-4-8-9-12-15-14l-4 10-5-11-5 9-5-10-4 8-3-4c-4 3-7 7-8 13z" fill="url(#fbb-hair)" stroke="#0a0e11" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M70 40c6-4 14-5 21-2M78 34l3 8M96 33l-2 9" stroke="#565e69" strokeWidth="0.8" fill="none" opacity="0.65" />
        <path d="M87 42l-2 12M74 46l2 10M101 46l-2 10" stroke="#0a0e11" strokeWidth="0.8" opacity="0.45" />
        {/* 前侧长发：压在肩上，发尾到腰 */}
        <path d="M63 54c-6 22-9 52-8 82 1 22 4 42 7 58l-12 2c-3-20-5-42-4-62 1-24 4-48 9-66z" fill="url(#fbb-hair)" stroke="#0a0e11" strokeWidth="1.1" />
        <path d="M112 52c6 22 9 54 7 84-1 20-4 38-7 52l11 3c4-18 7-40 7-58 0-24-3-48-9-66z" fill="url(#fbb-hair)" stroke="#0a0e11" strokeWidth="1.1" />
        <path d="M57 120l3 14M55 152l2 12M121 118l-3 14M124 148l-2 12" stroke="#4a525c" strokeWidth="0.8" opacity="0.5" />
        <path d="M60 90c-1 20-1 44 1 62M116 88c1 20 1 44-1 62" stroke="#606a75" strokeWidth="0.8" opacity="0.5" />
        {/* 眉：平直压眼，情绪只在眉眼与嘴角 */}
        <path d="M67 58l12-1M93 56l12-1" stroke="#1a1e24" strokeWidth="1.9" strokeLinecap="round" />
        {/* 死鱼眼：眼白大、瞳孔小且偏低、下眼睑一条直线 */}
        {expression === 'sleepy' ? (
          <g stroke="#161a20" strokeWidth="2" strokeLinecap="round" fill="none"><path d="M65 71c5 3 12 2 15-2" /> <path d="M90 69c5 3 12 2 14-2" /> <path d="M66 75l4 3M93 73l4 3" strokeWidth="1" opacity="0.4" /></g>
        ) : expression === 'error' ? (
          <g stroke="#161a20" strokeWidth="1.9" strokeLinecap="round"><path d="M67 66l11 8M78 66l-11 8" /> <path d="M91 64l11 8M102 64l-11 8" /> <path d="M65 60l3 5M71 59l-2 5" strokeWidth="1" opacity="0.6" /></g>
        ) : expression === 'happy' ? (
          <g><path d="M64.6 70C66.6 62.6 74.6 61 80.4 65.6l-.8 8.4c-6 .6-12.6-1.4-15-4z" fill="#f8f4e8" /> <path d="M88.6 68C90.6 60.6 98.6 59 104.4 63.6l-.8 8.4c-6 .6-12.6-1.4-15-4z" fill="#f8f4e8" /> <ellipse cx="73" cy="71.6" rx="2.8" ry="3.2" fill="#1c2028" /> <ellipse cx="96.6" cy="69.6" rx="2.8" ry="3.2" fill="#1c2028" /> <circle cx="72" cy="70" r="1" fill="#fff" opacity="0.9" /> <circle cx="95.6" cy="68" r="1" fill="#fff" opacity="0.9" /> <path d="M64.4 69C66.6 61.8 75 60.2 80.6 65.2M88.4 67C90.6 59.8 99 58.2 104.6 63.2" stroke="#161a20" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
        ) : (
          <g>
            <path d="M64.4 70C66.4 62.6 74.2 61 80 65.6l-.8 8.4c-6 .4-12.6-1.2-14.8-4z" fill="#f8f4e8" />
            <path d="M88.6 68C90.4 60.8 98 59.2 103.8 63.6l-.8 8.4c-6 .4-12.4-1.2-14.4-4z" fill="#f8f4e8" />
            <ellipse cx="73" cy={expression === 'thinking' ? 69 : 71.6} rx="2.4" ry="2.8" fill="#1c2028" />
            <ellipse cx="96.4" cy={expression === 'thinking' ? 67 : 69.6} rx="2.4" ry="2.8" fill="#1c2028" />
            <path d="M64.4 74.6l14.6-.4M88.8 72.8l14.2-.4" stroke="#161a20" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M64.2 69C66.4 61.6 74.4 60 80.2 65M88.4 67C90.4 59.8 98.2 58.4 103.8 63.2" stroke="#161a20" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="72" cy="70.4" r="0.7" fill="#fff" opacity="0.8" />
            <circle cx="95.4" cy="68.4" r="0.7" fill="#fff" opacity="0.8" />
            {expression === 'working' && (
              <g stroke="#161a20" strokeWidth="1" opacity="0.65"><path d="M82 56l9-5M84 62l9-5" /></g>
            )}
          </g>
        )}
        {/* 嘴：永远平的一条线，只在开心时微微上翘 */}
        {expression === 'sleepy' ? (
          <ellipse cx="86" cy="87" rx="2.4" ry="1.6" fill="#a4726f" />
        ) : expression === 'error' ? (
          <path d="M80 88c3.4-2.6 7.6-2.6 10.8 0" stroke="#a4726f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        ) : expression === 'happy' ? (
          <path d="M80 85c3.4 3.6 7.6 3.6 10.8 0" stroke="#a4726f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        ) : (
          <path d={expression === 'thinking' ? 'M82 86h7' : expression === 'working' ? 'M80 86h11' : 'M80.5 85.6h10'} stroke="#a4726f" strokeWidth="1.3" strokeLinecap="round" />
        )}
        {/* 表情小符号：星 / 思点 / 快线 / 朱砂汗滴 / z */}
        {expression === 'happy' && (
          <path d="M150 118l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" fill="#3f7a6a" opacity="0.85" />
        )}
        {expression === 'thinking' && (
          <g fill="#3f7a6a" opacity="0.75"><circle cx="147" cy="132" r="1.6" /> <circle cx="153" cy="124" r="2" /> <circle cx="159" cy="114" r="2.4" /></g>
        )}
        {expression === 'working' && (
          <g stroke="#3f7a6a" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"><path d="M144 140l6-12M152 142l6-12M160 138l4-8" /></g>
        )}
        {expression === 'error' && (
          <path d="M150 128c0 4.4 2.8 6.4 5 6.4s5-2 5-6.4c0-3.2-5-9.4-5-9.4s-5 6.2-5 9.4z" fill="#b23a2e" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#3f7a6a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"><path d="M146 126h5l-5 4h5" /> <path d="M155 114h4l-4 3.4h4" /></g>
        )}
        {/* 右手 + 菜刀：宽刀身、刀脊在右、刃口在下，木柄压着刀背，刀尾出画 */}
        <path d="M112 206H168l5 32c1 12-5 20-15 20h-32c-9 0-15-8-15-18z" fill="url(#fbb-steel)" stroke="#4f5b60" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M112 206H168l5 32" stroke="#5f6b70" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M114 250l54-9" stroke="#f8fcfd" strokeWidth="2.2" opacity="0.95" />
        <path d="M114 244l55-8" stroke="#aeb9bd" strokeWidth="1.4" opacity="0.7" />
        <path d="M124 216l32-4M120 228l24-3" stroke="#ffffff" strokeWidth="1.8" opacity="0.6" />
        <path d="M136 238l22-4" stroke="#ffffff" strokeWidth="1" opacity="0.28" />
        <path d="M146 224l8-2M130 234l10-2M156 232l7-2" stroke="#66737a" strokeWidth="0.8" opacity="0.7" />
        <path d="M136 254l3 5 3-6" stroke="#3f4a4f" strokeWidth="1.1" fill="none" />
        <circle cx="161" cy="216" r="2.4" fill="#0f1418" />
        <path d="M124 168l12-2 4 40-12 2z" fill="#4b3a2c" stroke="#1d150e" strokeWidth="1.5" strokeLinejoin="miter" />
        <circle cx="130" cy="178" r="1.2" fill="#8a6f52" />
        <circle cx="132" cy="190" r="1.2" fill="#8a6f52" />
        <path d="M126 174l11-2M128 184l11-2" stroke="#b23a2e" strokeWidth="1.7" opacity="0.85" />
        <path d="M130 196c-4 2-6 6-6 10" stroke="#b23a2e" strokeWidth="1.2" fill="none" opacity="0.8" />
        <ellipse cx="130" cy="188" rx="8.4" ry="9.6" transform="rotate(-12 130 188)" fill="url(#fbb-skin)" stroke="#b98f76" strokeWidth="1.2" />
        <path d="M123 184c3-2 8-2 11 0M123 190c3-2 8-2 11 0M125 196c3-1 6-1 8 0" stroke="#c79b80" strokeWidth="0.8" fill="none" />
        <path d="M135 180c2 3 3 7 3 11" stroke="#c79b80" strokeWidth="0.9" fill="none" />
      </g>
    </svg>
  ),
  // ---------------------------------------------------------
  // 张楚岚：斜肩回望，外套搭肩、白衬衫敞口、单手插兜，视线出画
  // 少年比例：窄脸方下颌、单边挑眉、单边嘴角、朱砂耳钉
  // ---------------------------------------------------------
  'zhang-chulan': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="zcl-paper" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#141e25" /> <stop offset="50%" stopColor="#0f1418" /> <stop offset="100%" stopColor="#090c0f" /></linearGradient>
        <linearGradient id="zcl-hair" x1="0.15" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#3c4e60" /> <stop offset="55%" stopColor="#1f2b37" /> <stop offset="100%" stopColor="#0f1720" /></linearGradient>
        <linearGradient id="zcl-shirt" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#f6f4eb" /> <stop offset="58%" stopColor="#dfdbce" /> <stop offset="100%" stopColor="#a9a79d" /></linearGradient>
        <linearGradient id="zcl-jacket" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0%" stopColor="#455666" /> <stop offset="52%" stopColor="#2b3844" /> <stop offset="100%" stopColor="#141d24" /></linearGradient>
        <linearGradient id="zcl-skin" x1="0.2" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#f6d8c0" /> <stop offset="70%" stopColor="#eac7ac" /> <stop offset="100%" stopColor="#cfa286" /></linearGradient>
        <radialGradient id="zcl-haze" cx="58%" cy="28%" r="52%"><stop offset="0%" stopColor="#26434f" stopOpacity="0.6" /> <stop offset="100%" stopColor="#1f3a44" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.4)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#zcl-paper)" />
        <ellipse cx="116" cy="78" rx="90" ry="96" fill="url(#zcl-haze)" />
        {/* 背后水墨元素：城市楼群，只有线条与窗格 */}
        <g stroke="#2e444a" strokeWidth="0.8" fill="none" opacity="0.85"><path d="M4 262V150h28v112M32 262V120h20v142M52 262V176h10v86" /> <path d="M172 262V136h24v126M162 262V180h10v82" /> <path d="M10 162h16M10 178h16M10 194h16M38 134h8M38 150h8M38 166h8M38 182h8M178 150h8M178 166h8M178 182h8" /> <path d="M26 120v-12M194 136v-16M62 150v-8M150 196h18M150 206h18" /></g>
        <g fill="#17232a" opacity="0.9"><path d="M0 150h26v10H0zM170 136h28v8h-28z" /></g>
        <path d="M0 250h200M0 258h200" stroke="#26383d" strokeWidth="0.8" opacity="0.65" />
        <g stroke="#8fa3a6" strokeWidth="0.8" fill="none" opacity="0.26"><path d="M120 18l13 5M126 28l10 4M134 14l6 2" /> <path d="M78 250l14-3M102 254l16-4" /></g>
        {/* 斜肩：左肩塌下去、右肩耸起，身体侧向里，头回望出画 */}
        <path d="M62 158C64 142 76 128 92 120L104 112 126 118C146 124 156 138 160 154 166 188 170 226 172 262H40c2-30 8-72 22-104z" fill="url(#zcl-shirt)" stroke="#0b0e11" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M132 122c12 10 18 26 22 44 4 26 8 62 10 96h-14c-2-34-6-70-12-98-2-16-6-30-14-40z" fill="#b0aea3" opacity="0.42" />
        {/* 颈与领口：领片翻在锁骨上，胸口只露一小块 */}
        <path d="M104 80l-2 24 22 2 2-24z" fill="url(#zcl-skin)" />
        <path d="M102 96c7 4 16 5 24 3" stroke="#c99f86" strokeWidth="1" fill="none" opacity="0.85" />
        <path d="M100 108l14-2 12 40-16 14-12-2z" fill="url(#zcl-skin)" />
        <path d="M104 128l4 18" stroke="#cfa286" strokeWidth="0.9" opacity="0.8" />
        <path d="M98 108L88 132 100 140 108 116z" fill="#f8f6ee" stroke="#0b0e11" strokeWidth="1.4" strokeLinejoin="miter" />
        <path d="M122 112l12 22-14 8-8-24z" fill="#efece2" stroke="#0b0e11" strokeWidth="1.4" strokeLinejoin="miter" />
        <path d="M102 148l6 26 10-50" stroke="#bdb7a9" strokeWidth="0.8" fill="none" />
        <path d="M112 146l4 4-4 6-4-6z" fill="#3f7a6a" stroke="#b23a2e" strokeWidth="0.6" />
        <path d="M110 118l2 28" stroke="#b23a2e" strokeWidth="0.9" opacity="0.85" />
        {/* 搭在左肩的外套：后片盖住左肩，翻领立起，空袖垂到腰 */}
        <path d="M96 110C76 118 60 136 52 160 44 188 42 224 42 262H16c2-46 10-84 26-112 14-24 32-40 54-48z" fill="url(#zcl-jacket)" stroke="#0a0e11" strokeWidth="1.6" strokeLinejoin="miter" />
        <path d="M94 112l6 22-16 8-4-16z" fill="#4d6070" stroke="#0a0e11" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M72 128c-8 12-12 26-13 42" stroke="#7b8b96" strokeWidth="0.8" fill="none" opacity="0.55" />
        <path d="M60 158c-8 20-12 44-13 68v36l20-2c-1-26 2-54 10-76z" fill="#26333d" stroke="#0a0e11" strokeWidth="1.3" strokeLinejoin="miter" />
        <path d="M56 184c-3 16-4 32-3 48M66 192c-3 18-4 38-3 54" stroke="#5f707c" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M50 244l8-2M54 252l10-3M42 148l7 5M38 168l6 4" stroke="#8b9aa3" strokeWidth="0.8" opacity="0.4" />
        <path d="M112 158c0 14 1 28 3 42M118 146l2 26" stroke="#cdc8ba" strokeWidth="0.8" fill="none" opacity="0.55" />
        <circle cx="86" cy="186" r="2.2" fill="#1c2933" stroke="#5f707c" strokeWidth="0.7" />
        {/* 右臂垂到腰侧，手插进裤兜：只露手背、拇指与兜口 */}
        <path d="M152 142c12 10 18 26 21 46 3 22 5 44 7 58l-16 3c-2-20-4-44-8-64-2-14-6-26-12-34z" fill="url(#zcl-shirt)" stroke="#0b0e11" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M152 178c4 10 6 22 8 34M150 160c4 8 7 18 9 28" stroke="#b0aea3" strokeWidth="0.8" fill="none" />
        <path d="M150 148c6 12 9 30 11 48" stroke="#8d8a7f" strokeWidth="1" fill="none" opacity="0.55" />
        <path d="M136 228c10-5 22-5 30 2" stroke="#0b0e11" strokeWidth="1.6" fill="none" />
        <path d="M142 230c8-7 18-6 24 2 3 8-4 14-14 14l-12-2z" fill="url(#zcl-skin)" stroke="#b98f76" strokeWidth="1.1" />
        <path d="M148 232l4-3M154 234l4-3M160 237l3-3" stroke="#b98f76" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M138 224c10-3 20-1 26 4" stroke="#d8d4c6" strokeWidth="1.2" fill="none" />
        <path d="M136 242l26-2" stroke="#8d8a7f" strokeWidth="0.8" opacity="0.6" />
        <path d="M42 250c40-4 82-4 124 0l2 14H42z" fill="#2b3742" stroke="#0b0e11" strokeWidth="1.2" />
        {/* 脸：回望的 3/4，鼻在左缘、下颌方、右耳挂朱砂耳钉 */}
        <path d="M90 62C90 44 100 34 114 34c15 0 24 11 24 27 0 10-2 18-7 24-4 5-11 8-18 7-11-2-18-9-21-19-1-5-2-7-2-11z" fill="url(#zcl-skin)" stroke="#b98f76" strokeWidth="1" />
        <path d="M90 66l-6 8 7 2" stroke="#b98f76" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M94 77c1 2 2 3 4 3" stroke="#c79b80" strokeWidth="0.8" fill="none" />
        <path d="M96 82c4 7 11 10 19 8" stroke="#c99f86" strokeWidth="0.9" fill="none" opacity="0.8" />
        <path d="M137 62c6-2 9 4 7 10-2 6-7 5-8 0z" fill="url(#zcl-skin)" stroke="#c79b80" strokeWidth="0.8" />
        <path d="M138 65c2 1 2 4 0 5" stroke="#c79b80" strokeWidth="0.7" fill="none" />
        <circle cx="142" cy="78" r="2.2" fill="#b23a2e" />
        <path d="M142 80v4" stroke="#b23a2e" strokeWidth="0.8" />
        <ellipse cx="102" cy="74" rx="5" ry="2.6" fill="#d98a86" opacity="0.2" />
        <ellipse cx="128" cy="72" rx="5" ry="2.6" fill="#d98a86" opacity="0.2" />
        {/* 短碎发：额前一撮压住右眉，发缕顺着后脑勺走，不竖尖角 */}
        <path d="M88 64c-4-18 6-32 25-32 18 0 27 12 26 30-1 8-3 14-7 18 0-10-5-15-13-17-10-2-19 1-25 6-3 3-5 1-6-5z" fill="url(#zcl-hair)" stroke="#0a0e11" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M104 34c-4 6-6 12-5 18 4-5 7-10 10-15z" fill="url(#zcl-hair)" stroke="#0a0e11" strokeWidth="0.9" strokeLinejoin="miter" />
        <path d="M112 36c-4 8-7 15-6 22 5-5 9-11 11-17z" fill="url(#zcl-hair)" stroke="#0a0e11" strokeWidth="0.9" />
        <path d="M94 60c-3 8-3 16-1 22M135 54c3 4 4 10 3 16" stroke="#0a0e11" strokeWidth="0.9" opacity="0.7" />
        <path d="M134 46c6 2 9 8 8 14" stroke="#5f707c" strokeWidth="0.8" fill="none" opacity="0.7" />
        {/* 眉眼：单边挑眉 + 视线偏出画外，上眼睑压得低 */}
        <path d="M92 52l13 .6" stroke="#1a1e24" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M115 44c6-2 12-3 16-2" stroke="#1a1e24" strokeWidth="1.8" strokeLinecap="round" />
        {expression === 'sleepy' ? (
          <g stroke="#161a20" strokeWidth="1.9" strokeLinecap="round" fill="none"><path d="M94 64h12" /> <path d="M117 61h12" /> <path d="M97 68l3 2M120 65l3 2" opacity="0.4" /></g>
        ) : expression === 'error' ? (
          <g><path d="M93 65c3-6 10-7 13-1l-1 6c-5 2-10 0-12-5z" fill="#f8f4e8" /> <path d="M116 62c3-6 10-7 13-1l-1 6c-5 2-10 0-12-5z" fill="#f8f4e8" /> <ellipse cx="97" cy="65" rx="2.6" ry="3.2" fill="#1c2028" /> <ellipse cx="120" cy="62" rx="2.6" ry="3.2" fill="#1c2028" /> <path d="M91 49l13-5M113 42l13-5" stroke="#1a1e24" strokeWidth="1.8" strokeLinecap="round" /></g>
        ) : expression === 'happy' ? (
          <g><path d="M94 65c3-6 10-7 13-1" stroke="#161a20" strokeWidth="2" fill="none" strokeLinecap="round" /> <path d="M116 62c3-6 10-7 13-1" stroke="#161a20" strokeWidth="2" fill="none" strokeLinecap="round" /> <path d="M91 55l13-1M114 49l13-2" stroke="#1a1e24" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" /></g>
        ) : (
          <g>
            <path d="M93 65c2-6 10-7 13-1l-.6 5.6c-5 2-10 .4-12.4-4.6z" fill="#f8f4e8" />
            <path d="M116 62c2-6 10-7 13-1l-.6 5.6c-5 2-10 .4-12.4-4.6z" fill="#f8f4e8" />
            <ellipse cx={expression === 'thinking' ? 96 : 96.4} cy={expression === 'thinking' ? 63 : 65.4} rx="2.9" ry="3.3" fill="#1c2028" />
            <ellipse cx={expression === 'thinking' ? 119 : 119.4} cy={expression === 'thinking' ? 60 : 62.4} rx="2.9" ry="3.3" fill="#1c2028" />
            <circle cx="95" cy="64.4" r="0.8" fill="#fff" opacity="0.85" />
            <circle cx="118" cy="61.4" r="0.8" fill="#fff" opacity="0.85" />
            <path d="M92.6 64c2.6-5.4 10-7 14.2-1.6M115.6 61c2.6-5.4 10-7 14.2-1.6" stroke="#161a20" strokeWidth="2.1" fill="none" strokeLinecap="round" />
            <path d="M93 69.6l13.2-1M116 66.6l13-1" stroke="#161a20" strokeWidth="0.8" opacity="0.5" />
            <path d="M108 56l3-1M132 52l3-1" stroke="#161a20" strokeWidth="1" opacity="0.5" />
            {expression === 'working' && (
              <g stroke="#161a20" strokeWidth="1" opacity="0.65"><path d="M92 73l10-2M114 70l10-2" /></g>
            )}
          </g>
        )}
        {/* 痞笑：只有一侧嘴角挑起来，带一颗小牙尖 */}
        {expression === 'happy' ? (
          <g><path d="M106 82c7 3 15 0 21-6" stroke="#9a5b62" strokeWidth="1.5" fill="none" strokeLinecap="round" /> <path d="M109 82c5 2 11 0 15-4" stroke="#f8f4e8" strokeWidth="1.5" fill="none" strokeLinecap="round" /></g>
        ) : expression === 'thinking' ? (
          <path d="M110 83c5 2 9-1 11 2" stroke="#9a5b62" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        ) : expression === 'working' ? (
          <path d="M108 83l15-3" stroke="#9a5b62" strokeWidth="1.4" strokeLinecap="round" />
        ) : expression === 'error' ? (
          <path d="M109 81c3-2 9-2 12 0-2 5-9 6-12 0z" fill="#8d4a51" />
        ) : expression === 'sleepy' ? (
          <path d="M109 84c5 2 10 0 13-2" stroke="#9a5b62" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        ) : (
          <g><path d="M108 83c6-1 11-3 15-7" stroke="#9a5b62" strokeWidth="1.5" fill="none" strokeLinecap="round" /> <path d="M122.6 76.6l2.8 1.2" stroke="#9a5b62" strokeWidth="1" strokeLinecap="round" /> <path d="M123 73c2 3 1 6-1 8" stroke="#9a5b62" strokeWidth="0.8" fill="none" opacity="0.6" /> <path d="M110 83.6h3" stroke="#f8f4e8" strokeWidth="1.6" /></g>
        )}
        {/* 表情小符号 */}
        {expression === 'happy' && (
          <g stroke="#3f7a6a" strokeWidth="1.4" strokeLinecap="round" opacity="0.8"><path d="M158 96l3-8M164 100l4-9" /></g>
        )}
        {expression === 'thinking' && (
          <g fill="#3f7a6a" opacity="0.75"><circle cx="150" cy="100" r="1.6" /> <circle cx="156" cy="92" r="2" /> <circle cx="163" cy="82" r="2.4" /></g>
        )}
        {expression === 'working' && (
          <g stroke="#3f7a6a" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"><path d="M50 96l6-12M58 98l6-12M66 94l4-8" /></g>
        )}
        {expression === 'error' && (
          <path d="M150 90c0 4.4 2.8 6.4 5 6.4s5-2 5-6.4c0-3.2-5-9.4-5-9.4s-5 6.2-5 9.4z" fill="#b23a2e" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#3f7a6a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"><path d="M150 76h5l-5 4h5" /> <path d="M159 64h4l-4 3.4h4" /></g>
        )}
      </g>
    </svg>
  ),
  // ---------------------------------------------------------
  // 王也：侧身掐诀（指节明确），道袍袖口被风掀起，脚边一缕雾
  // 纯侧脸：额头—鼻—唇—下巴一条折线，只露近侧一只垂眼
  // ---------------------------------------------------------
  'wang-ye': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="wy-paper" x1="0.1" y1="0" x2="0.75" y2="1"><stop offset="0%" stopColor="#131c20" /> <stop offset="55%" stopColor="#0f1418" /> <stop offset="100%" stopColor="#0a0e11" /></linearGradient>
        <linearGradient id="wy-hair" x1="0.2" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#414751" /> <stop offset="55%" stopColor="#252a32" /> <stop offset="100%" stopColor="#12161b" /></linearGradient>
        <linearGradient id="wy-robe" x1="0.1" y1="0" x2="0.7" y2="1"><stop offset="0%" stopColor="#f4ecdb" /> <stop offset="55%" stopColor="#e2d6bf" /> <stop offset="100%" stopColor="#b8ac93" /></linearGradient>
        <linearGradient id="wy-skin" x1="0.2" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#f6d9c2" /> <stop offset="70%" stopColor="#e9c9b0" /> <stop offset="100%" stopColor="#cda68c" /></linearGradient>
        <radialGradient id="wy-haze" cx="60%" cy="30%" r="56%"><stop offset="0%" stopColor="#3f7a6a" stopOpacity="0.28" /> <stop offset="100%" stopColor="#3f7a6a" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.4)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#wy-paper)" />
        <ellipse cx="120" cy="78" rx="86" ry="90" fill="url(#wy-haze)" />
        <circle cx="150" cy="52" r="25" fill="#efe8d8" opacity="0.07" />
        {/* 背后水墨元素：远山三层 + 淡雾横带 */}
        <path d="M-6 168L40 112l30 34 22-24 38 36 30-24 46 36v80H-6z" fill="#16262a" opacity="0.55" />
        <path d="M-6 202l40-42 28 24 26-30 32 36 30-24 56 40v58H-6z" fill="#1d3438" opacity="0.7" />
        <path d="M-6 236l46-28 34 18 30-14 34 22 42-16 20 12v34H-6z" fill="#24434a" opacity="0.5" />
        <g stroke="#9db6b0" strokeWidth="0.8" fill="none" opacity="0.2"><path d="M0 190c28-8 52 4 80-4 28-8 52 4 82-4 20-5 32-2 40 2" /> <path d="M4 210c30-6 52 4 80-4 28-8 54 4 84-4" /> <path d="M0 234c30-6 58 4 90-4 32-8 60 4 92-4" /></g>
        <path d="M150 26a26 26 0 0 1 22 34" stroke="#e8e2d6" strokeWidth="0.8" fill="none" opacity="0.18" />
        {/* 背后的长发先铺，随后被道袍压住 */}
        <path d="M118 46c14 22 22 56 24 92 2 26 0 50-6 68l-20-4c7-26 9-56 5-84-4-26-10-50-18-66z" fill="url(#wy-hair)" stroke="#0a0e11" strokeWidth="1.1" />
        <path d="M126 60c8 26 11 58 10 90M120 76c6 24 8 48 7 72" stroke="#4f565f" strokeWidth="0.8" fill="none" opacity="0.55" />
        {/* 道袍：交领 + 宽袖，右半身压暗，衣摆用折线收 */}
        <path d="M82 112c10-8 24-10 36-4 12 6 18 18 20 34 6 30 12 68 16 106l2 14H66c2-36 6-100 16-150z" fill="url(#wy-robe)" stroke="#0a0e11" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M124 112c10 10 14 26 16 44 4 30 8 62 12 90l2 16h-18c-2-34-6-68-10-98-2-20-6-38-16-52z" fill="#bdb098" opacity="0.5" />
        <path d="M100 106l-12 24 18-10z" fill="#faf4e6" stroke="#0a0e11" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M120 108l12 20-18-8z" fill="#e7dcc4" stroke="#0a0e11" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M96 150c8 5 18 5 26 0" stroke="#c4b79c" strokeWidth="0.8" fill="none" opacity="0.75" />
        <path d="M80 176c6 20 9 44 10 66M140 170c4 24 8 50 10 72" stroke="#c4b79c" strokeWidth="0.8" fill="none" opacity="0.65" />
        <path d="M74 216l82-8 2 14-82 8z" fill="#34564c" opacity="0.9" stroke="#0a0e11" strokeWidth="1.2" />
        <circle cx="94" cy="220" r="5.4" fill="#3f7a6a" stroke="#0a0e11" strokeWidth="1" />
        <path d="M92 225c-3 10-4 20-2 30M98 225c3 10 5 20 4 30" stroke="#3f7a6a" strokeWidth="1.2" fill="none" />
        <path d="M84 242l6-2M132 236l8-2" stroke="#b23a2e" strokeWidth="1.2" opacity="0.7" />
        {/* 抬起的前臂 + 宽袖下垂，袖口翻着 */}
        <path d="M88 128c-8 0-16 2-22 6l2 12c8-4 16-6 24-6z" fill="url(#wy-robe)" stroke="#0a0e11" strokeWidth="1.4" />
        <path d="M84 146c-10 2-22 6-30 14-2 10 6 16 18 12 10-4 18-14 20-22z" fill="url(#wy-robe)" stroke="#0a0e11" strokeWidth="1.6" strokeLinejoin="miter" />
        <path d="M62 154c6-4 12-8 18-10M58 162c6-2 12-6 18-10M56 170c5-2 10-5 14-8" stroke="#c4b79c" strokeWidth="0.8" fill="none" />
        <path d="M52 172l8-4M56 178l8-4M50 166l6-3" stroke="#0a0e11" strokeWidth="0.8" opacity="0.35" />
        {/* 掐诀的手：食指中指竖起、指节有小鼓包、拇指扣住无名指 */}
        <path d="M53 133c-1-5 2-9 6-9 5 0 8 4 8 9 0 6-3 11-7 11-3 0-6-5-7-11z" fill="url(#wy-skin)" stroke="#b98f76" strokeWidth="1.1" />
        <path d="M56 132l-2-12c0-2 4-3 5-1l3 13z" fill="url(#wy-skin)" stroke="#b98f76" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M62 131l1-13c0-2 4-2 5 0l-1 14z" fill="url(#wy-skin)" stroke="#b98f76" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M57 122c0 2 1 3 2 3M64 120c0 2 1 3 2 3" stroke="#c79b80" strokeWidth="0.9" fill="none" />
        <circle cx="57.6" cy="125" r="1.3" fill="#ddb096" />
        <circle cx="64.6" cy="123" r="1.3" fill="#ddb096" />
        <path d="M56 118h2M63 116h2" stroke="#f4dcc8" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <path d="M54 137c3 5 8 7 12 5" stroke="#c79b80" strokeWidth="1" fill="none" />
        <path d="M65 135c3-1 6 0 7 2-1 3-4 4-7 3z" fill="#e8c3a8" stroke="#b98f76" strokeWidth="0.9" />
        <path d="M66 137c2 0 4 1 5 2" stroke="#c79b80" strokeWidth="0.7" fill="none" />
        {/* 被风掀起的右袖：肩上起袖，袖口是空的，下面有一片被吹得翻过来 */}
        <path d="M118 124c20-8 44-10 62-6l2 12c-8 6-18 10-28 12 2-8-6-14-20-16z" fill="url(#wy-robe)" stroke="#0a0e11" strokeWidth="1.6" strokeLinejoin="miter" />
        <path d="M120 152c14 4 30 2 44-6-6 12-20 20-34 20z" fill="#efe6d2" stroke="#0a0e11" strokeWidth="1.3" strokeLinejoin="miter" />
        <path d="M132 138c16 0 32-6 44-14M138 148c12 0 24-4 34-10" stroke="#c4b79c" strokeWidth="0.8" fill="none" opacity="0.75" />
        <path d="M169 120c6 1 10 3 12 8" stroke="#a8987c" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M186 118l8-4M190 128l6-1" stroke="#0a0e11" strokeWidth="0.9" opacity="0.4" />
        {/* 侧脸：额头—鼻尖—唇—下巴折线，鼻梁明显外挑，右侧是发与耳 */}
        <path d="M101 40C93 43 88 49 86 58 84 62 81 65 79 68 77 70 79 72 83 73 83 78 82 81 83 85 84 88 85 90 88 93 92 97 98 98 104 96 110 93 113 85 113 76 113 58 108 44 101 40Z" fill="url(#wy-skin)" stroke="#b98f76" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M80 70c2 1 4 1 5 0" stroke="#b98f76" strokeWidth="1" fill="none" />
        <path d="M83 81l4-.4M84 86l3.5-.4" stroke="#b98f76" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M88 90c2 1 4 1 5 0" stroke="#c79b80" strokeWidth="0.9" fill="none" />
        <path d="M86 78c4 6 10 9 16 8-4 5-12 3-16-8z" fill="#b08066" opacity="0.2" />
        <path d="M90 87c3 2 7 2 9 0" stroke="#c79b80" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M104 68c4-1 7 2 7 6s-3 7-6 6c-2-1-2-4-1-12z" fill="url(#wy-skin)" stroke="#c79b80" strokeWidth="0.8" />
        <path d="M106 71c2 2 2 5 0 7" stroke="#c79b80" strokeWidth="0.7" fill="none" />
        <ellipse cx="94" cy="79" rx="5" ry="2.4" fill="#d98a86" opacity="0.16" />
        {/* 半束长发 + 发髻 + 朱砂玉簪：发际线压到眉上，鬓角只留一小缕 */}
        <path d="M86 58C86 42 96 34 108 37c10 3 13 15 12 29-6-10-16-14-24-12-6 1-9 2-10 4z" fill="url(#wy-hair)" stroke="#0a0e11" strokeWidth="1.1" />
        <ellipse cx="121" cy="32" rx="10" ry="9" fill="url(#wy-hair)" stroke="#0a0e11" strokeWidth="1.1" />
        <path d="M111 36l22-10" stroke="#8d7a5c" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="134" cy="25" r="2.6" fill="#b23a2e" />
        <path d="M114 44c10 16 15 40 17 66" stroke="#4f565f" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M85 57c-3 10-3 22-2 32l-6 2c-3-12-3-26 1-34z" fill="url(#wy-hair)" stroke="#0a0e11" strokeWidth="1" />
        <path d="M104 44l-4 12M112 42l-4 12M90 52l-3 10" stroke="#4f565f" strokeWidth="0.7" opacity="0.5" />
        {/* 垂眼：上眼睑压低盖住上半虹膜，眉也低 */}
        <path d="M84 59c5-3 12-3 16 0" stroke="#3a332a" strokeWidth="1.7" strokeLinecap="round" opacity="0.85" />
        {expression === 'sleepy' ? (
          <g stroke="#161a20" strokeWidth="1.9" strokeLinecap="round" fill="none"><path d="M88 66c5 2 11 1 14-3" /> <path d="M99 70l3 2" opacity="0.4" /></g>
        ) : expression === 'error' ? (
          <g><path d="M87 67c3-6 10-8 15-3 2 2 2 5 0 7-4 3-12 1-15-4z" fill="#f8f4e8" /> <ellipse cx="95" cy="67" rx="2.8" ry="3.4" fill="#1c2028" /> <path d="M86 68c4-7 12-9 17-3" stroke="#161a20" strokeWidth="2" fill="none" strokeLinecap="round" /> <path d="M82 59l10-5" stroke="#3a332a" strokeWidth="1.6" strokeLinecap="round" /></g>
        ) : expression === 'happy' ? (
          <g><path d="M88 68c3-5 10-6 14-1" stroke="#161a20" strokeWidth="2" fill="none" strokeLinecap="round" /> <path d="M89 72c4 2 9 1 12-2" stroke="#161a20" strokeWidth="0.8" fill="none" opacity="0.55" /> <path d="M84 58c5-3 11-3 15-1" stroke="#3a332a" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" /></g>
        ) : (
          <g>
            <path d="M87 66c3-6 10-7 15-3 2 2 2 5 0 7-4 3-12 1-15-4z" fill="#f8f4e8" />
            <ellipse cx={expression === 'thinking' ? 96 : 95} cy={expression === 'thinking' ? 65 : 67.4} rx="2.6" ry="3" fill="#1c2028" />
            <circle cx="94" cy="66" r="0.8" fill="#fff" opacity="0.85" />
            <path d="M86.6 66.6c4-6 11.4-7.6 16-3" stroke="#161a20" strokeWidth="2.1" fill="none" strokeLinecap="round" />
            <path d="M87 67.8l14.4-1.6" stroke="#161a20" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
            <path d="M85 70l3-1" stroke="#161a20" strokeWidth="1.4" strokeLinecap="round" />
            {expression === 'working' && (
              <path d="M101 75c3 1 6 1 8-1" stroke="#161a20" strokeWidth="0.8" fill="none" opacity="0.55" />
            )}
          </g>
        )}
        {/* 嘴：侧脸一条短线，情绪只改嘴角 */}
        {expression === 'happy' ? (
          <path d="M82 84c2 2 5 2 6 0" stroke="#9a5b62" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        ) : expression === 'error' ? (
          <ellipse cx="86" cy="85" rx="2.4" ry="3" fill="#8d4a51" />
        ) : expression === 'sleepy' ? (
          <path d="M83 86c2 1.4 5 1 6-1" stroke="#9a5b62" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        ) : (
          <path d={expression === 'thinking' ? 'M83 85c2-.6 4-.6 5-2' : expression === 'working' ? 'M82 85l6-1' : 'M82 85c2 .6 4 .4 6 0'} stroke="#9a5b62" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        )}
        {/* 脚边一缕雾：三笔淡线 + 一个小卷 */}
        <path d="M44 244c14-6 26 2 40-2 14-4 22-8 34-2" stroke="#cfd8d0" strokeWidth="0.9" fill="none" opacity="0.32" />
        <path d="M36 252c16-6 30 2 46-2 16-4 26-8 40-2" stroke="#cfd8d0" strokeWidth="0.8" fill="none" opacity="0.22" />
        <path d="M60 246c-4-6 2-10 6-6 3 3 0 6-3 5" stroke="#cfd8d0" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M150 238c10-4 20 0 26 6" stroke="#cfd8d0" strokeWidth="0.8" fill="none" opacity="0.2" />
        {/* 表情小符号：压在山上，用青绿/朱砂 */}
        {expression === 'happy' && (
          <path d="M164 108l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" fill="#3f7a6a" opacity="0.85" />
        )}
        {expression === 'thinking' && (
          <g fill="#3f7a6a" opacity="0.75"><circle cx="150" cy="112" r="1.6" /> <circle cx="157" cy="104" r="2" /> <circle cx="164" cy="94" r="2.4" /></g>
        )}
        {expression === 'working' && (
          <g stroke="#3f7a6a" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"><path d="M158 118l5-12M166 120l5-12M174 116l3-8" /></g>
        )}
        {expression === 'error' && (
          <path d="M158 96c0 4.4 2.8 6.4 5 6.4s5-2 5-6.4c0-3.2-5-9.4-5-9.4s-5 6.2-5 9.4z" fill="#b23a2e" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#3f7a6a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"><path d="M154 70h5l-5 4h5" /> <path d="M163 58h4l-4 3.4h4" /></g>
        )}
      </g>
    </svg>
  ),
  // ---------------------------------------------------------
  // 诸葛青：举扇半遮面，扇骨全画出来，只露一双狐眼，肩头飘带
  // 扇沿压在嘴与下巴上；狐眼外眼角拉出上挑眼尾，脸只留眼睛以上
  // ---------------------------------------------------------
  'zhuge-qing': ({ expression, className, reacting }) => (
    <svg viewBox="0 0 200 260" className={className} data-reacting={reacting ? 'true' : 'false'} aria-hidden="true">
      <defs>
        <linearGradient id="zgq-paper" x1="0.16" y1="0" x2="0.8" y2="1"><stop offset="0%" stopColor="#16202a" /> <stop offset="50%" stopColor="#0f1418" /> <stop offset="100%" stopColor="#090d10" /></linearGradient>
        <linearGradient id="zgq-hair" x1="0.2" y1="0" x2="0.85" y2="1"><stop offset="0%" stopColor="#eceef8" /> <stop offset="46%" stopColor="#c3c7dc" /> <stop offset="100%" stopColor="#878bab" /></linearGradient>
        <linearGradient id="zgq-robe" x1="0.1" y1="0" x2="0.6" y2="1"><stop offset="0%" stopColor="#f2f0f6" /> <stop offset="60%" stopColor="#dedcea" /> <stop offset="100%" stopColor="#b4b2c9" /></linearGradient>
        <linearGradient id="zgq-fan" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stopColor="#f8f1e1" /> <stop offset="62%" stopColor="#e8e0ce" /> <stop offset="100%" stopColor="#c9c2b1" /></linearGradient>
        <linearGradient id="zgq-skin" x1="0.2" y1="0" x2="0.9" y2="1"><stop offset="0%" stopColor="#fceade" /> <stop offset="70%" stopColor="#f2d9c8" /> <stop offset="100%" stopColor="#d6b09a" /></linearGradient>
        <radialGradient id="zgq-haze" cx="48%" cy="34%" r="56%"><stop offset="0%" stopColor="#7c6bb0" stopOpacity="0.2" /> <stop offset="100%" stopColor="#3f7a6a" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={reacting ? 'translate(0 -2.4)' : undefined}>
        <rect x="0" y="-4" width="200" height="268" fill="url(#zgq-paper)" />
        <ellipse cx="96" cy="106" rx="94" ry="106" fill="url(#zgq-haze)" />
        {/* 背后水墨元素：扇骨几何，放射线 + 同心弧 */}
        <g stroke="#3a5a54" strokeWidth="0.8" fill="none" opacity="0.55"><path d="M-6 250L44 150 96 96 150 118 206 190" /> <path d="M-6 210L60 122 120 84 206 140" /> <path d="M-6 268L86 168 150 150 206 236" /> <path d="M34 262L74 176 130 140 196 262" /></g>
        <g stroke="#2c4a46" strokeWidth="0.8" fill="none" opacity="0.3"><circle cx="98" cy="208" r="150" /> <circle cx="98" cy="208" r="128" /> <circle cx="98" cy="208" r="104" /></g>
        <g fill="#3f7a6a" opacity="0.5"><circle cx="42" cy="66" r="2" /> <circle cx="170" cy="62" r="1.4" /> <circle cx="158" cy="208" r="1.8" /> <circle cx="28" cy="186" r="1.2" /></g>
        {/* 肩与月白长袍（大半被扇子挡住），右肩压暗 */}
        <path d="M52 166c4-22 18-36 34-40l12-4 14 4c16 6 28 20 32 40 6 28 10 60 12 96H42c2-36 4-66 10-96z" fill="url(#zgq-robe)" stroke="#0a0e11" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M128 126c14 8 20 24 24 42 4 24 8 50 10 72H148c-2-30-4-58-10-80-2-14-6-24-14-32z" fill="#b7b5cb" opacity="0.45" />
        <path d="M86 126l12 24 16-26-6-4-10 13-6-13z" fill="#f8f7fb" stroke="#0a0e11" strokeWidth="1.1" strokeLinejoin="miter" />
        <path d="M80 150c6 16 8 34 8 52M126 148c-4 18-6 38-6 58" stroke="#b9b7cd" strokeWidth="0.8" fill="none" />
        {/* 银白长发：后面两缕从扇沿外垂到腰，发梢收成尖 */}
        <path d="M62 100c-6 34-8 78-6 116l6 8 4-8c-2-36 0-76 6-104z" fill="url(#zgq-hair)" stroke="#0a0e11" strokeWidth="1" opacity="0.95" />
        <path d="M134 98c6 34 8 78 6 116l-8 8-2-10c2-36 0-76-6-104z" fill="url(#zgq-hair)" stroke="#0a0e11" strokeWidth="1" opacity="0.95" />
        {/* 脸：只露眼睛以上，下巴与嘴藏在扇后 */}
        <path d="M74 90c0-20 11-32 26-32 16 0 26 12 26 32 0 16-10 26-26 28-15 2-26-10-26-28z" fill="url(#zgq-skin)" stroke="#c9a58f" strokeWidth="1" />
        <path d="M77 92c1 2 3 3 5 3M123 92c-1 2-3 3-5 3" stroke="#c79b80" strokeWidth="0.8" fill="none" />
        <path d="M94 96c3 1 6 0 8-2" stroke="#c79b80" strokeWidth="0.8" fill="none" opacity="0.7" />
        <ellipse cx="85" cy="93" rx="5.4" ry="2.6" fill="#d98a86" opacity="0.22" />
        <ellipse cx="113" cy="92" rx="5.4" ry="2.6" fill="#d98a86" opacity="0.22" />
        {/* 发际暗影：让刘海和额头分层，不至于糊成头盔 */}
        <path d="M64 82c18-10 44-10 62-2-4-7-15-11-31-11s-26 5-31 13z" fill="#b98d78" opacity="0.22" />
        {/* 中分刘海：中间露额头，额前压三缕尖发，两侧鬓发折线收尾 */}
        <path d="M62 86c-2-26 14-40 36-40 22 0 36 16 34 40-6-12-14-18-22-17l-5 15-6-16-6 14-6-15-6 12c-8-1-14 4-19 7z" fill="url(#zgq-hair)" stroke="#0a0e11" strokeWidth="1.2" strokeLinejoin="miter" />
        <g fill="url(#zgq-hair)" stroke="#0a0e11" strokeWidth="1" strokeLinejoin="miter"><path d="M69 68c-2 6-2 12 0 16 4-4 6-10 6-16z" /> <path d="M117 66c2 6 4 11 8 15 1-6 0-12-2-16z" /></g>
        <path d="M70 72c14-10 34-10 46 0-6-8-14-12-23-12s-17 4-23 12z" fill="#7f83a3" opacity="0.3" />
        <path d="M76 55c6-5 14-8 22-8M97 45l-2 10M109 47l-2 10M84 51l2 10" stroke="#9498b2" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M121 49l9-7 4 5-9 7z" fill="#3f7a6a" />
        <path d="M117 54l-12-7" stroke="#c9c7dc" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 84c-4 34-5 76 0 110l12-2c-5-32-3-74 2-104z" fill="url(#zgq-hair)" stroke="#0a0e11" strokeWidth="1.1" />
        <path d="M136 84c5 34 6 76 1 110l-12-2c5-32 3-74-2-104z" fill="url(#zgq-hair)" stroke="#0a0e11" strokeWidth="1.1" />
        {/* 眉与狐眼：外眼角拉出上挑眼尾，和另外三人完全不同 */}
        {expression === 'sleepy' ? (
          <g stroke="#1b1f2a" strokeWidth="1.9" strokeLinecap="round" fill="none"><path d="M78 86c5 3 12 1 15-3" /> <path d="M107 84c5 3 12 1 14-3" /> <path d="M76 72l11-3M106 69l12-3" strokeWidth="1" opacity="0.6" /></g>
        ) : expression === 'error' ? (
          <g><path d="M77 84c4-6 11-8 16-3l-1 7c-6 2-12 1-15-4z" fill="#fdf6ee" /> <path d="M108 82c4-6 11-8 15-3l-1 7c-5 2-11 1-14-4z" fill="#fdf6ee" /> <ellipse cx="85" cy="84" rx="2.8" ry="3.2" fill="#2a2440" /> <ellipse cx="115" cy="82" rx="2.8" ry="3.2" fill="#2a2440" /> <path d="M75 68l12-5M105 65l13-5" stroke="#1b1f2a" strokeWidth="1.8" strokeLinecap="round" /></g>
        ) : expression === 'happy' ? (
          <g><path d="M78 86c4-7 12-8 16-1" stroke="#1b1f2a" strokeWidth="2" fill="none" strokeLinecap="round" /> <path d="M107 84c4-7 12-8 15-1" stroke="#1b1f2a" strokeWidth="2" fill="none" strokeLinecap="round" /> <path d="M75 74c5-4 11-4 15-1M104 71c5-4 11-4 15-1" stroke="#1b1f2a" strokeWidth="1.2" fill="none" opacity="0.7" /></g>
        ) : (
          <g>
            <path d="M77 84c4-7 13-7 17 0l-.6 6c-6 2-13 1-16.4-6z" fill="#fdf6ee" />
            <path d="M107 82c4-7 12-7 16 0l-.6 6c-6 2-12 1-15.4-6z" fill="#fdf6ee" />
            <ellipse cx={expression === 'thinking' ? 87 : 85.4} cy={expression === 'thinking' ? 81 : 83} rx="3" ry="3.2" fill="#2a2440" />
            <ellipse cx={expression === 'thinking' ? 116 : 114.6} cy={expression === 'thinking' ? 79 : 81} rx="3" ry="3.2" fill="#2a2440" />
            <circle cx="84.4" cy="82" r="1" fill="#fff" opacity="0.9" />
            <circle cx="113.6" cy="80" r="1" fill="#fff" opacity="0.9" />
            <path d="M80 80c-4-3-9-7-12-13M119 78c4-3 9-7 12-13" stroke="#1b1f2a" strokeWidth="1.9" fill="none" strokeLinecap="round" />
            <path d="M76 70c5-5 14-5 19 1M104 67c5-5 14-5 19 1" stroke="#1b1f2a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            {expression === 'working' && (
              <g stroke="#1b1f2a" strokeWidth="0.9" opacity="0.65"><path d="M81 89l13-1M111 87l13-1" /></g>
            )}
          </g>
        )}
        {/* 折扇：六片扇面 + 七根扇骨 + 扇钉，整体微微倾斜像被举着 */}
        <g transform="rotate(-5 98 208)">
          <path d="M98 208L8.5 147.6A108 108 0 0 1 36 119.5z" fill="url(#zgq-fan)" />
          <path d="M98 208L36 119.5A108 108 0 0 1 64.6 105.3z" fill="#e9e4ee" />
          <path d="M98 208L64.6 105.3A108 108 0 0 1 98 100z" fill="url(#zgq-fan)" />
          <path d="M98 208L98 100A108 108 0 0 1 131.4 105.3z" fill="#e9e4ee" />
          <path d="M98 208L131.4 105.3A108 108 0 0 1 160 119.5z" fill="url(#zgq-fan)" />
          <path d="M98 208L160 119.5A108 108 0 0 1 187.5 147.6z" fill="#e9e4ee" />
          <g stroke="#6b6353" strokeWidth="0.8" fill="none"><path d="M98 208L8.5 147.6M98 208L36 119.5M98 208L64.6 105.3M98 208L98 100M98 208L131.4 105.3M98 208L160 119.5M98 208L187.5 147.6" /></g>
          <path d="M8.5 147.6A108 108 0 0 1 187.5 147.6" stroke="#0a0e11" strokeWidth="1.8" fill="none" />
          <path d="M8.5 147.6A108 108 0 0 1 187.5 147.6" stroke="#3f7a6a" strokeWidth="0.8" fill="none" opacity="0.85" />
          <path d="M52 120c12-10 26-12 38-4" stroke="#2b2f38" strokeWidth="1.7" fill="none" opacity="0.45" />
          <path d="M118 112c10-2 20 1 28 7" stroke="#2b2f38" strokeWidth="1.1" fill="none" opacity="0.35" />
          <path d="M112 128l7 2-1 9-7-2z" fill="#b23a2e" opacity="0.8" />
        </g>
        <path d="M62 100c14 4 30 4 44 0" stroke="#8a6f62" strokeWidth="3" fill="none" opacity="0.16" />
        {/* 扇柄上的手：手指压在扇骨上，指节清楚 */}
        <circle cx="98" cy="208" r="4" fill="#2b2f38" stroke="#c9c2b2" strokeWidth="1" />
        <path d="M86 204c0-6 6-10 11-7 5 3 7 9 3 14-4 5-13 3-14-3z" fill="url(#zgq-skin)" stroke="#c79b80" strokeWidth="1.1" />
        <path d="M90 199l1 11M96 197l0 12M101 199l-1 10" stroke="#c79b80" strokeWidth="0.8" />
        <path d="M88 210c4 3 9 3 13 0" stroke="#c79b80" strokeWidth="0.7" fill="none" />
        <path d="M84 202c2-3 5-5 7-4" stroke="#c79b80" strokeWidth="0.9" fill="none" />
        {/* 肩头飘带：窄幅、拧着，末端朱砂收边 */}
        <path d="M148 150c18-8 38-18 50-38-1 18-14 36-34 48z" fill="#dcd9e8" stroke="#0a0e11" strokeWidth="1.2" strokeLinejoin="miter" />
        <path d="M151 156c17-1 34-7 45-18-8 12-22 20-38 24z" fill="#bdb9d2" opacity="0.9" />
        <path d="M198 112l-8 10 8 2z" fill="#b23a2e" opacity="0.85" />
        <path d="M154 150c14-4 28-12 38-24M156 156c12-1 24-5 34-12" stroke="#8f8ba8" strokeWidth="0.8" fill="none" opacity="0.8" />
        <path d="M150 162l10-2M152 168l8-2" stroke="#0a0e11" strokeWidth="0.8" opacity="0.3" />
        {/* 表情小符号：只在眉眼外补一点，不重画脸 */}
        {expression === 'happy' && (
          <path d="M152 84l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" fill="#3f7a6a" opacity="0.85" />
        )}
        {expression === 'thinking' && (
          <g fill="#3f7a6a" opacity="0.75"><circle cx="140" cy="70" r="1.6" /> <circle cx="147" cy="62" r="2" /> <circle cx="155" cy="52" r="2.4" /></g>
        )}
        {expression === 'working' && (
          <g stroke="#3f7a6a" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"><path d="M146 94l5-11M154 96l5-11M162 92l3-7" /></g>
        )}
        {expression === 'error' && (
          <path d="M150 76c0 4.4 2.8 6.4 5 6.4s5-2 5-6.4c0-3.2-5-9.4-5-9.4s-5 6.2-5 9.4z" fill="#b23a2e" opacity="0.85" />
        )}
        {expression === 'sleepy' && (
          <g stroke="#3f7a6a" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"><path d="M148 56h5l-5 4h5" /> <path d="M157 44h4l-4 3.4h4" /></g>
        )}
      </g>
    </svg>
  ),
}