# UI 主题系统 · 进度与恢复

> 更新时间：2026-10-22 00:xx（北京时间）
> 分支：`feat/theme-system`（未推送远程）

## 当前阶段

Phase 4 进行中：六套主题的 CSS 已进入收尾（4/6 已落地，2 套在并行编写）。
Phase 3（架构）、Phase 5（设置页）、Phase 6（个性化）的代码骨架已完成。

## 已完成

### 架构（Phase 3）
| 文件 | 作用 |
|---|---|
| `src/lib/theme/types.ts` | 主题/个性化/预设的类型契约 |
| `src/lib/theme/themes.ts` | 六套主题元数据（名称、描述、预览色、默认参数）、字体与动效选项、`getTheme` 安全回退 |
| `src/lib/theme/apply.ts` | 个性化 → CSS 变量映射（强调色对比度、圆角阶梯、字体栈、倍率、动效时长），并负责清理旧覆盖 |
| `src/lib/theme/storage.ts` | localStorage 读写、逐项校验、导入导出、版本号 |
| `src/lib/theme/store.ts` | `useSyncExternalStore` 外部 store，避免 effect 内 setState 与水合不一致 |
| `src/lib/theme/prepaint.ts` | 首帧前脚本：在 React 挂载前写好 `data-theme` / `.dark` / 缩放 / 强调色，杜绝主题闪烁 |
| `src/providers/appearance-provider.tsx` | 唯一真源：主题、明暗、个性化、预设、导入导出 |
| `src/providers/theme-provider.tsx` | 兼容外壳，内部改为 `AppearanceProvider` |

### 样式层
| 文件 | 内容 |
|---|---|
| `src/styles/themes.css` | 共享层：类型阶梯倍率、标题族变量、卡片/输入/导航变量、动效强度、装饰底纹、预览卡样式 |
| `src/styles/theme-fluent.css` | Theme 03 云母（Windows 11） |
| `src/styles/theme-minimal.css` | Theme 04 留白（Apple / Linear） |
| `src/styles/theme-pixel.css` | Theme 05 像素机（8-bit） |
| `src/styles/theme-bento.css` | Theme 06 暗格（Dark Bento） |
| `src/styles/theme-anime.css` | Theme 01 樱色（编写中） |
| `src/styles/theme-cyber.css` | Theme 02 霓虹终端（编写中） |

### 设置界面（Phase 5 / 6）
| 文件 | 内容 |
|---|---|
| `src/components/settings/appearance-panel.tsx` | 主题网格、明暗、强调色（预设+自定义取色）、四类圆角滑杆、缩放、字体与字号、动画强度、预设管理、恢复默认、导入导出 |
| `src/components/settings/theme-card.tsx` | 真实变量渲染的迷你预览卡（非截图） |
| `src/app/settings/page.tsx` | 分区更名为「外观与个性化」，接入面板，移除 next-themes |

### 其他改动
- `src/app/layout.tsx`：引入 `themes.css` + 首帧前脚本
- `src/components/ui/sonner.tsx`：改从外观 Provider 取明暗

## 未完成

1. `theme-anime.css` / `theme-cyber.css` 落地并检查（并行任务，等待返回）
2. Phase 7：全局页面主题适配抽查与残留硬编码颜色清理
3. Phase 8：六套主题 × 主要页面的自动化截图与差异验证
4. Phase 9：视觉验收（对比度、错位、拥挤、字体）
5. Phase 10：性能与细节修复
6. `docs/UI_THEME_TEST_REPORT.md` 验收矩阵
7. Git 检查点提交（按阶段）

## 恢复指令

```powershell
cd D:\DeepSeek\工作区\plan-calender
git status --short
git log --oneline -5
npx tsc --noEmit
npx eslint
npx vitest run --reporter=dot
ls src\styles\theme-*.css
```

若主题 CSS 缺失导致构建失败：确认 `src/styles/themes.css` 里的 `@import` 与 `src/styles/theme-*.css` 一一对应。
若设置页报 `useAppearance 必须在 AppearanceProvider 内使用`：确认 `app-providers.tsx` 仍包着 `ThemeProvider`。

## 验收矩阵（草稿）

| 项 | 状态 |
|---|---|
| Anime 主题 | ⏳ |
| Cyberpunk 主题 | ⏳ |
| Fluent 主题 | ✅ |
| Minimal 主题 | ✅ |
| Retro Pixel 主题 | ✅ |
| Dark Bento 主题 | ✅ |
| 预览卡 | ✅ |
| 一键切换 | ✅ 代码就绪，待运行验证 |
| 全局应用 | ⏳ |
| 保存 / 启动恢复 | ✅ 代码就绪，待运行验证 |
| 非法主题回退 | ✅ `getTheme` + `sanitizeState` |
| 强调色 | ✅ |
| 圆角 | ✅ |
| 界面缩放 | ✅ |
| 字体设置 | ✅ |
| 动画强度 | ✅ |
| 用户预设 | ✅ |
| 恢复默认 | ✅ |
| 导入导出 | ✅ |
| 原有功能回归 | ⏳ |
| 主题差异度 | ⏳ |
