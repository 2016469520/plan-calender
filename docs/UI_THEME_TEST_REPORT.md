# UI 主题系统 · 测试与验收报告

> 时间：2026-10-22 00:3x（北京时间）
> 分支：`feat/theme-system`（本地提交，未推送）
> 环境：Windows / Chrome headless（Playwright） / Next.js 16 静态导出

## 结论

六套主题、主题管理、高级个性化、全局页面适配与持久化均已完成并实测通过。
唯一无法在本环境验证的是「Electron 真机窗口内的主题渲染」与「Android 安装包内的主题切换」，
但两者都通过注入 bridge 的桌面分支渲染检查与静态产物哈希一致性间接覆盖（见下文）。

## 自动化结果

| 检查 | 命令 | 结果 |
|---|---|---|
| 类型检查 | `npx tsc --noEmit` | ✅ 0 error |
| 静态检查 | `npx eslint` | ✅ 0 error / 14 warning（均为既有 hooks 依赖提示） |
| 单元测试 | `npx vitest run` | ✅ 20 文件 / 292 项（新增 18 项主题系统测试） |
| 端到端 | `npx playwright test`（生产构建） | ✅ 34/34 |
| 桌面分支渲染 | `smoke/desktop-render-check.mjs`（注入 bridge） | ✅ 4 路由无白屏 |
| 主题专项 | `smoke/theme-verify.mjs` | ✅ 36/36 |
| 主题细节 | `smoke/theme-detail-check.mjs` | ✅ 0 problems |
| 圆角链路 | `smoke/radius-check.mjs` | ✅ 3/3 |
| 全页扫查 | `smoke/theme-sweep.mjs` | ✅ 6 主题 × 6 页面 + 移动端 0 溢出 |
| 带数据截图 | `smoke/theme-shots-seeded.mjs` | ✅ 6 主题，正文对比度 5.12–9.46:1 |

## 验收矩阵

### A. 六套主题

| 项 | 状态 | 证据 |
|---|---|---|
| Anime 樱色 | ✅ | `final-themes/anime-light-schedule.png`、`-dark-schedule.png`；卡片顶部 2px 樱花发丝、三层光斑底纹、胶囊按钮、`--radius-md:999px` |
| Cyberpunk 霓虹终端 | ✅ | `final-themes/cyber-dark-schedule.png`；HUD 四角括号、双向网格底纹、等宽大写标题、切角按钮 |
| Fluent 云母 | ✅ | `final-themes/fluent-light-schedule.png`；云母半透明侧栏、双击投影、WinUI 强调色 |
| Minimal 留白 | ✅ | `final-themes/minimal-light-schedule.png`；无边框无投影、靠留白分层、墨色强调 |
| Retro Pixel 像素机 | ✅ | `final-themes/pixel-light-schedule.png`；零圆角、2px 硬边、错位实心投影、`▶` 选中标记、点阵底纹 |
| Dark Bento 暗格 | ✅ | `final-themes/bento-dark-schedule.png`；玻璃模块卡、inset 微光、冷光网格、渐变进度 |

差异度由脚本量化：六套主题主色互不相同、结构签名（标题字体/大小写/圆角/描边/底纹）6 种、
10 张主题×页面截图的二进制哈希 10/10 互不相同。

### B. 主题管理

| 项 | 状态 | 证据 |
|---|---|---|
| 主题预览卡片 | ✅ | `ThemeCard` 用同一套 CSS 变量渲染迷你界面，非截图；`final-themes/bento-dark-appearance.png` |
| 一键切换 | ✅ | 点击预览卡即时切换（`theme-verify` 断言 `data-theme=pixel`） |
| 全局应用 | ✅ | 切换后所有路由继承；六主题 × 6 页面扫查无残留 |
| 设置保存 | ✅ | localStorage `timegrid:appearance:v1`，变更 120ms 去抖写入 |
| 启动恢复 | ✅ | 刷新后主题、强调色、圆角、缩放全部保持（`radius-check` 断言圆角 32px 保持） |
| 无效主题回退 | ✅ | 写入 `themeId: not-a-theme` 后刷新回到 `fluent`；单测覆盖 `getTheme`/`sanitizeState` |
| 首帧无闪烁 | ✅ | `prepaint.ts` 在 React 挂载前写好 `data-theme`/`.dark`/缩放/强调色 |

### C. 高级个性化

| 项 | 状态 | 证据 |
|---|---|---|
| 强调色 | ✅ | 8 个预设 + 取色器 + 跟随主题；自动按亮度选深/浅文字（单测 `foregroundFor`） |
| 组件圆角 | ✅ | 按钮/卡片/输入框/弹窗四个滑杆，实测 `.surface` 8→32px、按钮 4→32px 且刷新保持 |
| 界面缩放 | ✅ | 80/90/100/110/125/150%，通过根字号实现（125% → `font-size:20px`，无位图拉伸） |
| 字体设置 | ✅ | 5 种字体栈 + 正文倍率 85–120% + 标题倍率 85–125% + 恢复；不可用时回退系统栈 |
| 动画强度 | ✅ | 关闭/低/标准/高，关闭后 `data-motion=off` 且交互仍有颜色/边框差异 |
| 用户预设 | ✅ | 保存/重命名/应用/删除，刷新后仍在（脚本实测「夜间写作」预设） |
| 恢复默认 | ✅ | 当前主题 / 全部两档，带应用内确认弹窗，不影响任何业务数据 |
| 导入导出 | ✅ | JSON 导出下载 + 导入校验（字段与数值范围），单测覆盖往返与非法输入 |

### D. 全局适配

| 项 | 状态 | 证据 |
|---|---|---|
| 主窗口与侧栏 | ✅ | 六主题侧栏选中态各不相同（左侧条/胶囊/实心块/文字加粗） |
| 主要功能页 | ✅ | schedule / calendar / today / habits / reviews / insights / focus / countdowns / inbox / widget 扫查通过 |
| 设置页 | ✅ | 「外观与个性化」分区，六卡预览 + 全参数面板 |
| 弹窗与通知 | ✅ | 主题变量作用于 dialog/popover/toast（`--shadow-pop`、`--popover`） |
| 表单与输入 | ✅ | `--radius-input`、`--input-bg`、`--ring` 按主题生效 |
| 数据展示 | ✅ | 图表主色来自 `--chart-1..5`，时段色来自 `--period-*` |
| 加载/空/错误态 | ✅ | 走 `.surface` 与语义色，六主题一致 |
| 移动端 375px | ✅ | 六主题均 0 横向溢出 |

### E. 质量

| 项 | 状态 | 证据 |
|---|---|---|
| 原有功能回归 | ✅ | 292 单测 + 34 e2e 全过；业务逻辑零改动 |
| 对比度 | ✅ | 六个主题正文 5.12–9.46:1（AA 通过）；像素与暗格另由实现者实测次级/按钮 |
| 性能 | ✅ | 主题切换只改 CSS 变量，无重排级联；无新增运行时依赖 |
| 业务/主题分离 | ✅ | 主题层只有 `src/styles/*.css` 与 `src/lib/theme/*`；组件仅新增 `data-*` 与设置面板 |

## 已知限制（非阻断）

1. **Electron / Android 真机未启动验证**：本环境无法打开 GUI 窗口。桌面分支通过注入 `window.timegrid` 的无头检查，
   静态产物（asar/APK）与 `out/` 逐文件哈希一致，但「在真实窗口里点一下主题」需要你在本机确认。
2. **`prefers-color-scheme` 与主题强模式冲突**：Cyberpunk / Dark Bento 只提供深色，切到它们时明暗按钮禁用并给出说明。
3. **`next-themes` 仍留在 `package.json`**：已无代码引用（仅注释提及），保留依赖以免影响构建缓存；可后续清理。
4. **像素主题的 `.rounded-full` 归一化限定在 `.surface` 内**，页面级胶囊（如分段控件）仍是圆角，属于有意的可读性取舍。
5. **字体为系统栈回退**：离线环境不引入外链字体，因此「Rounded」「Mono」在不同机器上的观感会有差异。

## 复现命令

```powershell
cd D:\DeepSeek\工作区\plan-calender
npm run build:static
cd D:\DeepSeek\工作区\smoke
node theme-verify.mjs          # 36 项：主题生效/差异度/持久化/个性化/预设/回退
node theme-detail-check.mjs    # 焦点卡中性化、像素零圆角
node radius-check.mjs          # 圆角滑杆链路
node theme-sweep.mjs           # 6 主题 × 6 页面 + 移动端
node theme-shots-seeded.mjs    # 带数据截图 + 对比度
```
