# PROJECT_STATUS.md — 项目状态

## 当前阶段：习惯分钟输入稳定性修复 (2026-07-04)

## 验证状态：2026-07-04（最新）

| 检查项 | 结果 |
|--------|------|
| npm install | ✅ 通过 |
| ESLint | ✅ 0 errors, 94 warnings |
| TypeScript (tsc --noEmit) | ✅ 通过 |
| Vitest (210 tests) | ✅ 全部通过 |
| Next.js build | ✅ 通过 (14 routes) |

## 🔧 本次修复 (2026-07-04 第五版)：习惯分钟输入稳定性

### 问题根因
1. **保存按钮条件渲染**：`{inputVal !== undefined && (<Button>保存</Button>)}` 在 flex row 中动态插入元素，挤开时间数字区域
2. **编辑/删除按钮条件渲染**：`{log && (...)}` 同样在 flex row 中动态插入
3. **无保存状态预留空间**：保存中/成功/失败图标出现时改变布局
4. **+5/+10/+15/+30 快捷按钮**：用户不需要大步进按钮
5. **滚轮步进太大**：每次 5 分钟，微调不便

### 修复方案
1. **固定操作区**：保存状态用固定 `w-5` 容器，编辑/删除用固定 `w-12` 容器，始终占位
2. **移除大步进按钮**：删除 +5/+10/+15/+30
3. **滚轮 1 分钟步进**：wheel up +1, wheel down -1，节流 80ms
4. **+/- 微调 1 分钟**：按钮每次 ±1
5. **debounce 400ms 自动保存**：滚轮调整后自动保存
6. **隐藏原生 spinner**：`type="text"` + `inputMode="decimal"` + CSS 隐藏
7. **tabular-nums**：固定数字宽度

### 修改文件
- `src/components/habits/habit-checkin.tsx` — 重构稳定布局
- `src/components/habits/home-habits-summary.tsx` — 重构稳定布局
- `src/app/globals.css` — 隐藏原生 spinner
- `src/__tests__/unit/habit-minute-stability.test.ts` — 新增 23 个测试
- `DECISIONS.md` — 新增决策 58-62
- `docs/features/habit-number-wheel-input/SPEC.md` — 更新

### 测试结果
- Vitest: 210 个测试全部通过（+23 新增）

## 历史更新

### 🔧 习惯打卡交互修复 (2026-07-04 第三版)

### 习惯打卡交互修复
1. **按计量方式拆分 UI**：
   - `boolean`：完成/未完成勾选切换
   - `count`：+/- 1 按钮 + 直接输入次数
   - `minutes`/`duration`：快捷按钮（+5/+10/+15/+30）+ 直接输入分钟
   - `hours`：快捷按钮（+0.5/+1/+2）+ 直接输入小时
   - `numeric`：+/- 步进 + 直接输入数值 + 单位显示
2. **MeasurementType 扩展**：新增 `minutes` 和 `hours`，`duration` 保持为 `minutes` 的别名向后兼容
3. **首页习惯摘要**：根据计量方式显示不同控件，分钟型可快捷输入
4. **习惯记录编辑**：点击编辑按钮弹出 Dialog 修改值
5. **习惯记录删除**：点击删除按钮弹出确认 Dialog
6. **修改/删除后**：所有视图（首页、习惯页、统计）立即更新

### 倒数日编辑增强
- **首页倒数日卡片增加编辑按钮**：编辑标题、日期、颜色、每年重复、显示在首页等
- **首页增加归档按钮**：可快速归档/取消归档
- 编辑使用 Dialog 展示编辑表单
- 原有删除和置顶功能保留

### 快速新增日期选择器
- **增加日历 Popover**：点击日期按钮弹出日期选择器
- **快捷选项**：今天、明天、本周末、下周
- **日历输入**：支持原生 date input 选择任意日期
- **跨月跨年**：支持选择任意日期
- **中文日期显示**：选择后显示「2026年7月4日 周六」格式

### 快速新增 placeholder 策略
- **时段初始显示"选择时段"**：不再默认显示"上午"
- **难度初始显示"选择难度"**：不再默认显示"一般"
- **保存 fallback**：未选时段根据当前时间推断（6-12→上午, 12-18→下午, 18-6→晚上），未选难度默认 medium
- **向后兼容**：旧代码中的默认值逻辑不变，仅 UI 层面初始化改为空

### 专注时长交互增强
- **鼠标滚轮**：在时长区域 hover 时滚轮 ±5 分钟，范围 1-240
- **滑块**：@base-ui/react Slider，范围 1-240，步进 5，拖动实时更新
- **直接输入**：数字输入框，非法值（<1 或 >240）显示错误并在失焦时规范化
- **保留 +/- 5 按钮**：原有步进按钮保持

### 专注正计时（Stopwatch）
- **模式切换**：倒计时 | 正计时 切换按钮
- **倒计时**：设定目标时长（25/5/15/45 分钟预设 + 自定义），倒计时到 0 完成
- **正计时**：从 00:00 开始累计，手动完成，保存实际时长
- **状态机**：两种模式都支持 开始→暂停→继续→完成/放弃
- **刷新恢复**：基于时间戳（started_at, paused_at），刷新后正确恢复
- **统计**：completed 计入统计，cancelled 不计入
- **数据迁移**：008_focus_timer_mode.sql 添加 timer_mode 字段，默认 'countdown'

### 修改文件
- `src/types/index.ts` — MeasurementType 扩展，FocusSession 添加 timer_mode
- `src/lib/display-labels.ts` — MEASUREMENT_TYPE_LABELS 映射
- `src/components/habits/habit-checkin.tsx` — 按计量方式拆分打卡 UI + 编辑/删除
- `src/components/habits/home-habits-summary.tsx` — 首页不同类型不同控件 + 编辑/删除
- `src/app/habits/page.tsx` — 新建习惯增加 minutes/hours 选项
- `src/components/countdowns/home-countdowns.tsx` — 增加编辑/归档按钮和编辑 Dialog
- `src/components/schedule/quick-add-task.tsx` — 日历日期选择器 + placeholder 策略
- `src/components/ui/slider.tsx` — 新增 Slider 组件
- `src/components/focus/focus-timer.tsx` — 滚轮/滑块/输入 + 正计时模式
- `src/hooks/use-focus.ts` — 支持 stopwatch 状态机
- `supabase/migrations/008_focus_timer_mode.sql` — 新增 migration

### 新增测试
- `src/__tests__/unit/measurement-labels.test.ts` — 6 个测试（计量方式 + 时段 + 难度）
- `src/__tests__/unit/focus-timer-mode.test.ts` — 12 个测试（timer_mode + 统计 + 时间计算）

### 新增 Migration
- `008_focus_timer_mode.sql`：focus_sessions 表添加 timer_mode 字段
- **尚未应用到生产 Supabase**

## 历史更新

### 选择器显示修复
1. **标签 UUID → 标签名称**：所有 Select 的 SelectValue 现在通过 children/render 显示中文标签名，不再显示原始 value（UUID/enum）
2. **统一显示映射**：创建 `src/lib/display-labels.ts` 作为单一真相来源，constants.ts 重新导出
3. **SelectValue 根因**：@base-ui/react 的 SelectValue 不同于 Radix——placeholder 仅在空值时显示，选中后需显式提供 children 才能显示文本
4. **快速新增中文化**：四个控件依次显示：日期、时段（上午/下午/晚上）、标签（未分类/标签名）、难度（简单/一般/困难/极难）
5. **任务详情中文化**：状态（待办/进行中/已完成/已取消）、时段、难度、标签全部显示中文
6. **状态文案调整**：`todo` 从「未开始」改为「待办」
7. **task-edit-dialog**：优先级→难度、标签显示中文、状态显示中文
8. **习惯页**：计量方式选择器显示中文
9. **重复规则**：频率选择器显示中文

### 专注选择器重构
- **分离专注分类与关联日程**：两个独立 Select 控件
  - 专注分类：基于标签选择（学习/科研/工作等），用于专注统计归类
  - 关联日程：可选绑定具体任务
- 不再显示 `none`，改为「选择专注分类」和「不关联日程」
- 专注统计支持按标签分类

### 任务详情悬窗
- **TaskDetailPanel 重构**：从固定右侧面板改为居中浮层
  - 桌面端：Dialog（sm:max-w-lg, max-h-[88vh]）
  - 手机端：Drawer（max-h-[92vh]）
- 背景遮罩，点击遮罩/ESC 关闭
- 日历和日程页同时受益
- 不再贴屏幕右侧

### 修改文件
- `src/lib/display-labels.ts` — 新增统一显示映射
- `src/lib/constants.ts` — 重新导出，消除重复
- `src/components/schedule/task-detail-panel.tsx` — 重构为浮层
- `src/components/schedule/quick-add-task.tsx` — 中文化
- `src/components/focus/focus-timer.tsx` — 分离分类/任务
- `src/components/plans/task-edit-dialog.tsx` — 中文化
- `src/components/plans/recurrence-editor.tsx` — 中文化
- `src/components/calendar/day-view.tsx` — 中文化
- `src/app/calendar/page.tsx` — 浮层适配
- `src/app/schedule/page.tsx` — 浮层适配
- `src/app/habits/page.tsx` — 中文化

## 🆕 历史更新 (2026-07-04 第一版)

### 日历高密度布局优化
- 周视图每单元格限制显示 3 条任务，超出显示"还有 N 项"
- 添加 TaskListSheet 组件用于查看溢出任务
- 统一上午/下午/晚上行高，严格对齐 7 个日期列
- 小屏横向滚动，最小列宽 80px
- 时段标签 sticky 定位

### 日历任务详情交互
- 周视图/月视图点击任务卡片打开 TaskDetailPanel
- 完成按钮、拖拽手柄与详情打开正确分离
- 桌面端右侧面板，手机端全屏详情

### 全局中文化
- 统一显示映射：CALENDAR_VIEW_LABELS, WEEK_START_LABELS, DIFFICULTY_LABELS, URGENCY_LABELS, WEEKDAY_NAMES, FOCUS_MODE_LABELS
- 修复设置页、快速新增、专注计时器的中文显示
- 周视图日期头使用中文（周日-周六）

### 难度与自动紧迫度
- 新增 difficulty 字段（easy/medium/hard/very_hard），替换 priority 用户选择
- 新增 due_at 字段用于截止时间
- 紧迫度基于 due_at 自动计算：已逾期/紧急/较紧急/近期/时间充足
- Supabase migration 007：添加 difficulty + due_at 列及索引
- 旧 priority 字段保留为 legacy 兼容

### 专注升级为一级功能
- 左侧导航新增"专注"入口
- 新建 /focus 页面：计时器 + 今日/本周/月度统计 + 7天趋势图 + 历史记录
- 手机端导航新增专注入口

### 每日总结入口恢复
- 左侧导航新增"每日总结"
- /reviews/today 直接打开今日评价表单
- 页面提供"查看历史记录"入口

### 设置页重构
- 桌面端：二级导航侧栏 + 内容区布局，max-w-4xl
- 分区管理：外观、日历、专注、提醒、标签、数据、账户
- 宽屏卡片使用两列网格
- 手机端：横向滚动分区 tabs

### 新增文件
- src/app/focus/page.tsx — 专注完整页面
- src/app/reviews/today/page.tsx — 每日总结直达页
- src/components/calendar/task-list-sheet.tsx — 溢出任务列表
- src/lib/utils/urgency.ts — 紧迫度计算纯函数
- supabase/migrations/007_difficulty_due_at.sql

### 新增 Migration
- `007_difficulty_due_at.sql`：tasks 表添加 difficulty、due_at 字段
- **尚未应用到生产 Supabase**

## 历史更新 (2026-07-03)

### Bug 修复

1. **完成度可设为 0**：`ScoreSelect` 组件添加 `includeZero` 属性，完成度下拉包含 0%。修复了 `value?.toString() ?? ''` 改为 `value != null ? value.toString() : ''` 使 0 不在渲染时被当作空值。
2. **标签选择器显示修复**：全部 SelectItem 的 children 正确渲染为标签名称 + 色点，不显示源码或对象。
3. **Falsy-value 审计**：修复 `value.count || ''` 改为 `value.count != null ? value.count : ''`。

### 新功能：倒数日

- **数据表**：`countdowns`（migration 005）
- **Repository**：ICountdownRepository（Supabase + IndexedDB）
- **首页组件**：`HomeCountdowns` — 紧凑卡片展示，支持行内创建、置顶、归档
- **完整页面**：`/countdowns` — 列表/过滤/搜索/编辑/归档
- **日期计算**：支持每年重复、过期天数、今天特殊显示

### 新功能：专注

- **数据表**：`focus_sessions`（migration 006）
- **Repository**：IFocusSessionRepository（Supabase + IndexedDB）
- **状态机 Hook**：`useFocus` — 基于时间戳计时，支持刷新恢复
- **首页组件**：`HomeFocusTimer` — 预设时长、自定义时长、关联日程
- **日程联动**：专注完成后累计到任务 `actual_minutes`

### 习惯增强

- **推荐习惯**：运动、喝水、睡眠、阅读、早起（含模板 ID 幂等创建）
- **首页摘要**：`HomeHabitsSummary` — 布尔勾选 + 数值加减
- **统计准备**：首页显示今日完成率、每个习惯进度

### 首页整合

- **桌面端**：左侧日程主体 + 右侧辅助栏（专注/倒数日/习惯）
- **手机端**：日程下方嵌入三个组件
- **保持日程为主**：辅助区域可折叠，不抢占主体

## 🆕 任务中心改造 (2026-07-03)

### 核心变更

- **新默认首页** `/schedule` — 日程主页（原首页 `/` 从 `/calendar` 改为 `/schedule`）
- **导航重构**：日程 → 日历 → 习惯 → 复盘 → 统计 → 设置（桌面）/ 日程 → 日历 → 习惯 → 复盘 → 设置（手机 5 项）
- **日历降为辅助视图**：日历保留所有功能，但不再是登录后默认页面

### 日程主页

- **顶部概览**：时段问候、日期、已完成/总数、迷你进度环、延期提醒、最近事项
- **今日焦点**：自动突出紧急和高优先级事项（最多 3 项）
- **时段分区**：上午/下午/晚上三个区域，各有轻微氛围差异
- **延期处理**：独立区域，支持移到今天/明天
- **接下来**：明天、未来 7 天、更晚的分组预览
- **收集箱**：日程页面内嵌收集箱预览

### 快速新增（无弹窗）

- 页面顶部常驻行内输入：`+ 添加一项计划……`
- 点击/聚焦后在原位置展开可选字段（日期、时段、标签、优先级）
- Enter 保存、Esc 取消
- 不再使用大型 Dialog 创建任务

### 任务详情（减少弹窗）

- **桌面端**：点击任务在右侧打开固定详情面板，左侧列表保持可见
- **手机端**：全屏详情视图，左上角有关闭按钮
- 字段直接在面板中编辑：标题、状态、优先级、日期、时段、标签、预计用时、说明
- 自动保存（debounce 600ms），显示保存状态
- 删除保留确认按钮

### 视图切换

日程页面支持四种视图：**今天 | 近期 | 全部 | 按分类**

### 日历集成

- `/calendar` 页面桌面端使用相同的 TaskDetailPanel 侧边栏
- 手机端保留 TaskEditDialog 向后兼容

## 历史更新 (2026-07-03)

### 功能一：每日评价历史记录

- **新路由** `/reviews` — 复盘记录页面
- **月历模式**：按整月展示评价状态，点击日期查看/补写评价
- **时间线模式**：按日期倒序浏览历史评价，支持筛选（月份、评分、心情、仅有总结）
- **评价详情**：侧边抽屉展示完整评价，支持编辑、删除（需确认）、前后导航
- **本月摘要**：已评价天数、平均评分/完成度/心情、连续评价天数
- **导航入口**：桌面侧边栏"复盘记录"、今日页面"查看历史评价"、统计页面"查看全部评价"
- **复用 DailyReviewForm**：编辑历史评价不复制表单逻辑
- **空状态**：无评价时显示引导

### 功能二：按分类呈现日程

- **模式切换** "按时间 | 按分类"：在日历页面顶部切换
- **分类视图**：按标签分组，包含"未分类"区域
- **时间分桶**：每个分类内按 已延期/今天/未来7天/更晚/未安排/已完成 分组
- **分类头部**：标签名、颜色点、事项数量、完成率进度条、新建按钮、折叠
- **控制选项**：隐藏空分类、隐藏已完成事项
- **事项卡片**：标签色条、优先级图标+文字、状态标记、日期/时段、子任务进度
- **复用 TaskEditDialog**：编辑不创建第二套组件
- **新建预选标签**：在分类中点击新建自动预选该标签
- **跨分类移动**：每个事项卡片提供"移动到"菜单，支持选择目标分类或未分类

### 功能三：视觉与交互优化

- **今日欢迎区域**：根据时段显示问候语、日期、事项统计、最重要事项提示
- **今日进度条**：迷你完成率进度条
- **分类完成率进度条**：每个分类头部
- **事项卡片改进**：标签色条、层级优化、状态徽章
- **统一交互**：移动菜单、加载/空/错误状态、减少动态效果支持

## 历史验证状态：2026-07-02

| 检查项 | 结果 |
|--------|------|
| npm install | ✅ 通过 |
| ESLint | ✅ 0 errors, 34 warnings |
| TypeScript (tsc --noEmit) | ✅ 通过 |
| Vitest (118 tests) | ✅ 全部通过 |
| Next.js build | ✅ 通过 (8 routes) |

## 🔧 本次修复 (2026-07-02)

### 修复 1：新建日程按钮无响应

**根因**：`calendar-header.tsx` 中的「新建」按钮缺少 `onClick` 处理函数，且日历页面未集成 `TaskEditDialog` 组件。

**修复**：
- 为 `CalendarHeader` 添加 `onNewTask` prop
- 在日历页面添加 `TaskEditDialog` 状态管理和渲染
- 连接「新建」按钮的 `onClick` 到对话框打开
- 连接键盘快捷键 `N` 到对话框打开
- `TaskEditDialog` 默认日期使用当前日历选中日期

### 修复 2：标签删除功能完善

**修改文件**：`src/components/common/tag-manager.tsx`

**变更**：
- 移除 `is_default` 对删除按钮的限制，所有标签均可删除
- 删除前检查标签使用情况（统计关联事项数量）
- 未使用标签：显示简单确认对话框
- 已使用标签：提供三选一处理方案：
  1. **迁移**：将关联事项移到另一个标签，然后删除
  2. **清除关联**：保留事项但清除其标签引用，然后删除
  3. **取消**：放弃删除
- IndexedDB 和 Supabase 两种模式均保证操作一致性
- 清除关联模式先更新所有引用任务再删除标签

### 修复 3：默认标签重复问题

**根因分析**（多重原因）：

1. **Supabase 触发器**（`handle_new_user`）在注册时创建默认标签
2. **应用层** `setupNewUser()` 再次创建默认标签（虽有检查但非幂等）
3. **前端 Hook** `useInitializeDefaultTags()` 每次页面加载检查 `existing.length === 0`，React Strict Mode 导致 effect 执行两次
4. `tags` 表缺少 `(user_id, name)` 唯一约束
5. IndexedDB 无「标签已初始化」持久化标记
6. 多个并发请求可能同时通过「标签不存在」检查

**修复方案**：

1. **Supabase 层**（migration 004）：
   - 清理已存在的重复标签（保留最早创建的，迁移关联任务）
   - 规范化标签名称（去除首尾空格）
   - 添加唯一索引 `idx_tags_user_name_unique ON tags(user_id, lower(trim(name)))`
   
2. **前端 Hook** `useInitializeDefaultTags()`：
   - 使用 `useRef` 防止同会话内重复执行
   - 改为按名称检查（而非仅检查数量），使用 upsert 语义
   - 通过 `user_preferences.tags_initialized` 持久化标记，标记 set 后不再自动创建
   - 用户删除所有标签后不会自动恢复
   - 创建失败时静默跳过（不崩溃）

3. **IndexedDB 层**：
   - DB 版本升至 v2
   - 通过 `user_preferences.tags_initialized` 标记防止重复初始化
   - 用户删除标签后刷新不会恢复

### 新增 Migration

`supabase/migrations/004_tag_deduplication.sql`：
- 清理步骤：查找重复标签 → 保留最早 → 迁移关联任务 → 删除重复
- 唯一约束：`CREATE UNIQUE INDEX idx_tags_user_name_unique ON tags(user_id, lower(trim(name)))`
- 验证步骤：确认无重复残留

### 新增测试

- `src/__tests__/unit/tag-management.test.ts`（10 个测试）：
  - 新用户获得 8 个默认标签
  - 初始化执行两次不产生重复
  - 不同用户标签隔离
  - Ref guard 防止并发初始化
  - 删除所有标签后不会自动恢复
  - 删除未使用标签
  - 删除标签并迁移关联事项
  - 删除标签并清除事项关联
  - 允许删除默认标签

- E2E 测试增强（`e2e/tasks.spec.ts`）：
  - 点击「新建」按钮打开对话框
  - 创建事项流程
  - 取消创建
  - 键盘快捷键 N
  - 标签管理页面渲染
  - 创建和删除标签
  - 验证无重复默认标签

### 尚未应用到生产数据库

- Migration `004_tag_deduplication.sql` **尚未在 Supabase 生产项目执行**
- 需要在 Supabase SQL Editor 中手动运行或通过 Supabase CLI 应用
- 执行前建议备份数据

## ✅ 已完成功能（历史记录）

（完整列表见原 PROJECT_STATUS.md，此处不重复）

## 测试状态

| 类型 | 状态 |
|------|------|
| 单元测试 (date) | 6 passed ✅ |
| 单元测试 (recurrence) | 7 passed ✅ |
| Repository 测试 | 35 passed ✅ |
| 排序算法测试 | 16 passed ✅ |
| 统计测试 | 16 passed ✅ |
| 通知测试 | 18 passed ✅ |
| 标签管理测试 | 10 passed ✅ |
| E2E 测试 | 14 scenarios ✅ |

总计：**118 个单元测试全部通过**，**14 个 E2E 场景**

## 已知问题

1. 收集箱页面查询 `getByDate('inbox')` — IndexedDB 中 'inbox' 不是有效日期
2. 周视图中任务芯片不响应点击（无编辑/完成交互）
3. 统计页面缺少图表，仅展示基础数字
4. React Compiler 警告：RHF watch() 在 ScoreSelect 组件中使用
5. **Supabase 生产数据库 migration 004 尚未应用**（标签去重和唯一约束）
6. **Supabase 生产数据库 migration 007 尚未应用**（difficulty + due_at 字段）
7. **Supabase 生产数据库 migration 008 尚未应用**（focus_sessions.timer_mode 字段）
