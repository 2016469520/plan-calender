# 时格 · UI/UX 重设计进度

> 用于中断恢复：只记录"已完成 / 进行中 / 待办 / 验证结果"，不重复记录计划本身（计划见 `UI_REDESIGN_PLAN.md`）。

## 时间安排

| 阶段 | 时间（Asia/Shanghai） | 状态 |
|---|---|---|
| A · 轻量准备 | 2026-10-21 17:23 | ✅ 完成 |
| B · 全面执行 | 2026-10-21 18:00 起 | ⏳ 待执行（已登记定时触发） |

## 阶段 A 产出（2026-10-21）

- [x] 确认技术栈与样式入口：Next 16.2.9 / React 19.2.4 / Tailwind v4 / `@base-ui/react`；唯一全局样式 `src/app/globals.css`
- [x] 盘点页面（12 个路由）与组件（15 组 ≈ 80 文件，`ui/` 31 个基础件）
- [x] 初判 8 项设计问题（层级靠边框、时段无语义色、圆角间距不统一、装饰渐变扩散、动效无规范、空/加载态不一、导航弱指示、浮窗与主界面语言割裂）
- [x] 三方向对比（Quiet Paper / Bento Timeline / Neon Grid），定为 **Bento Timeline 为主 + Quiet Paper 排版克制 + Neon 仅暗色点缀**
- [x] 设计系统要点草案（色彩/字号/间距/圆角/层级/组件/动效/可达性）
- [x] 6 个实施批次 + 验证方案 + 风险应对
- [x] 参考资源可达性确认：[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 可用（`npx ui-ux-pro-max-cli init`，需 Python 3，本项目已有内置 Python）；其 `search.py --design-system` 可在阶段 B 用于生成 habit tracker / planner 类目的配色与字体建议

## 阶段 B 待办（按批次）

- [ ] 批次 1 · 地基：`globals.css` tokens 重写 + `ui/` 基础件统一
- [ ] 批次 2 · 导航骨架：sidebar / mobile-nav / schedule-header / app-shell
- [ ] 批次 3 · 核心页：schedule / calendar / today
- [ ] 批次 4 · 记录类：habits / reviews / insights / focus
- [ ] 批次 5 · 辅助页：countdowns / inbox / settings / login / widget
- [ ] 批次 6 · 打磨：空/加载/错误统一、断点与缩放、暗色对比度、reduced-motion
- [ ] 产出 `docs/UI_DESIGN_SYSTEM.md`（落地后的真实规范，含 token 表与组件用法）
- [ ] 重新打包 exe / apk，校验哈希，升版本、推送、发 Release

## 验证记录

| 时间 | 项 | 结果 |
|---|---|---|
| 2026-10-21 17:25 | 阶段 A 范围自查（未修改任何 UI 代码） | ✅ 仅新增 2 份 docs |
| 2026-10-21 基线 | `tsc --noEmit` / `eslint` / `vitest` / `build:static` / `desktop-render-check` | ✅ 沿用 0.3.2 的绿线（261 tests，0 lint error） |

## 备注

- 阶段 A 严格未触碰 `src/**`、`electron/**` 与任何样式文件，避免高峰时段的大改动。
- 浮窗（`/widget`）宽度以 340px 为设计基准，阶段 B 先改浮窗再改主界面，防止窄宽溢出反复返工。
