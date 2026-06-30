# PROJECT_STATUS.md — 项目状态

## 当前阶段：✅ 全部完成（A-K）

## 上次验证：2026-06-30

| 检查项 | 结果 |
|--------|------|
| npm install | ✅ 通过 |
| ESLint | ✅ 0 errors, 33 warnings |
| TypeScript (tsc --noEmit) | ✅ 通过 |
| Vitest (109 tests) | ✅ 全部通过 |
| Next.js build | ✅ 通过 (8 routes) |

## 🚧 当前状态：部署中

### Supabase 配置
- `.env.local` 已创建 ✅
- 项目 URL: `https://fnxlpiilnsyvjdxeeime.supabase.co`
- Anon Key: `sb_publishable_iI6O2eHQ9_UahuiI38nc1Q_IkkJElE8`
- 数据库表：已通过 SQL Editor 执行迁移 ✅
- Email Auth：已开启，Confirm email 已关闭 ✅

### 最新修复 (2026-06-30)
- **问题**：Supabase 注册报 500 错误 `"Database error saving new user"`
- **根因**：`handle_new_user` 数据库触发器执行失败，导致用户创建事务回滚
- **修复方案**：
  1. 应用层新用户初始化 (`src/lib/supabase/new-user-setup.ts`) — signUp 后自动创建 profile、preferences、default tags
  2. 数据库修复 SQL (`supabase/migrations/003_fix_handle_new_user.sql`) — 删除触发器或重创
- **待用户操作**：在 Supabase SQL Editor 运行 `003_fix_handle_new_user.sql`（Option A 推荐）
- **验证**：REST API 可访问，表存在，所有表返回 `{"count":0}`

### Vercel 部署
- Vercel CLI 已安装，需要用户登录认证
- 运行 `! vercel login` 后可以使用 `npx vercel --cwd my-plan-calendar` 部署

## ✅ 已完成（已通过代码验证）

### 阶段 A：基础工程与核心架构

#### 项目工程
- Next.js 16 App Router + TypeScript strict
- Tailwind CSS v4 + shadcn/ui v4 (@base-ui/react)
- ESLint 配置
- Vitest + Testing Library 测试框架
- 完整 CI 检查通过

#### 类型系统 (src/types/index.ts)
- 所有核心类型定义完整：Task, TaskSubitem, Tag, Habit, HabitLog, DailyReview, TaskTemplate, UserProfile, UserPreferences, RecurrenceException, RecurrenceRule
- 表单输入类型：TaskFormData, DailyReviewFormData, HabitFormData
- 统计类型：TaskStats, HabitStats
- UI 状态类型：CalendarView, ThemeMode, Period, Priority, TaskStatus

#### Repository 模式
- 完整接口定义 (src/lib/repositories/interfaces.ts)：9 个 Repository 接口 + RepositoryFactory
- IndexedDB 完整实现 (src/lib/repositories/indexeddb-impl.ts)：所有 9 个 Repository 已完整实现
- IndexedDB Schema (src/lib/db/indexeddb.ts)：10 个 ObjectStore + 相关索引
- RepoProvider (src/providers/repo-provider.tsx)：环境感知的数据层切换

#### 数据库 (Supabase)
- 完整 Migration (001_initial_schema.sql)：10 张表 + 索引 + 触发器
- 完整 RLS 策略 (002_rls_policies.sql)：所有表启用 RLS + 新用户自动创建 profile 和默认标签

#### 认证
- AuthProvider (src/providers/auth-provider.tsx)：Supabase Auth + 本地演示模式自动切换
- 登录/注册页面 (src/app/login/page.tsx)：完整的表单验证、错误处理、加载状态
- 演示模式：无 Supabase 凭证时接受任意邮箱密码
- 登出、密码重置基础结构

#### 日历视图
- 月视图 (MonthView)：7×6 网格、任务缩略显示、完成计数、非当月日期灰显、点击跳转日视图
- 周视图 (WeekView)：7 天 × 3 时段网格、任务芯片、加载骨架屏
- 日视图 (DayView)：3 时段布局、任务卡片（完成切换、优先级徽章、时间显示、下拉菜单）、快速添加对话框、进度条
- 日期导航：上下翻页、回到今天按钮
- 视图切换：月/周/日键盘快捷键 (M/W/D)
- 响应式：桌面端 Dialog、手机端 Drawer

#### 事项管理
- 快速添加：标题、优先级、标签（DayView 集成）
- 完整编辑弹窗 (TaskEditDialog)：所有字段（标题、说明、日期、时段、时间、优先级、标签、状态、预计用时、提醒时间）
- 状态管理：todo/in_progress/done/cancelled
- 完成/取消完成切换 + 完成时间戳
- 软删除
- 复制和编辑下拉菜单入口

#### 标签管理
- TagManager 组件：CRUD 完整实现
- 创建标签（名称 + 预设颜色）
- 编辑标签（名称 + 颜色选择器）
- 删除标签（使用 confirm 确认）
- 8 个默认标签（通过 Supabase 触发器或前端常量）

#### 习惯打卡
- HabitCheckin 组件：展示活跃习惯、今日打卡状态、打卡/取消打卡
- 创建习惯 (HabitsPage)：名称、计量类型、目标值、单位、提醒时间
- 支持 boolean/count/duration/numeric 四种计量方式
- Dialog/Drawer 响应式创建表单

#### 每日评价
- DailyReviewForm 组件：评分(1-10)、完成度(0-100)、心情(1-5)、精力(1-5)、6 个文本字段
- 自动加载已有评价
- upsert 保存 + toast 反馈
- 加载骨架屏

#### 统计 (Insights)
- 基础统计卡片：计划总数、完成率、习惯打卡记录数、评价天数
- 本月数据聚合

#### 其他页面
- 收集箱 (Inbox)：空状态展示（占位页面）
- 设置 (Settings)：主题切换、通知开关（已连线）、紧凑模式、默认视图、每周起始日、标签管理、退出登录、提醒中心
- 今日 (Today)：日视图 + 习惯打卡 + 每日评价组合页面

#### 工具函数
- 日期工具 (date.ts)：todayStr, nowISO, formatDate, getMonthRange, getWeekRange, navigateDate, PERIOD_RANGES
- 重复规则 (recurrence.ts)：dateMatchesRecurrence、getRecurrenceDates、支持 interval/endDate/count/byWeekday/byMonthDay/bySetPos/skip 例外
- 通知工具 (notifications.ts)：浏览器通知支持检测、权限请求、任务/习惯/过期/每日总结通知

#### 布局
- AppShell：桌面端侧边栏 + 移动端底部导航
- 主题：light/dark/system + next-themes
- 键盘快捷键：M/W/D/T/N

#### 阶段 B：Supabase 云端 Repository ✅ (2026-06-30)
- Supabase Repository (supabase-impl.ts)：所有 9 个 Repository 完整实现 ✅
- Task / TaskSubitem / Tag / Habit / HabitLog / DailyReview / TaskTemplate / User / RecurrenceException ✅
- 环境变量驱动的自动模式切换 (RepoProvider) ✅
- Supabase 客户端安全配置（不使用 Service Role Key） ✅
- Repository 单元测试（35 个 IndexedDB 测试） ✅
- Supabase 配置文档（README.md） ✅
- RLS 验证查询文档 ✅

#### 阶段 C：拖拽移动排序 ✅ (2026-06-30)
- 排序计算工具（分数索引算法 + 16 个测试） ✅
- @dnd-kit 拖拽库集成 ✅
- DayView：时段内排序、跨时段拖拽 ✅
- WeekView：跨日期拖拽移动 ✅
- 键盘/菜单式移动（上移、下移、移到其他时段） ✅
- 拖拽保存失败自动恢复 ✅
- 触摸设备支持（TouchSensor） ✅
- 移动成功/失败 toast 反馈 ✅

#### 阶段 D：搜索筛选子任务 ✅ (2026-06-30)
- TaskFilterOptions 接口和两套 filter() 实现 ✅
- SearchFilter 组件：搜索栏、筛选面板、结果列表 ✅
- 过期事项识别和标记 ✅
- SubtaskManager 组件：CRUD、完成切换、进度条 ✅
- 筛选状态管理（筛选芯片、一键清除） ✅
- 搜索结果展示加载/空/错误状态 ✅

#### 阶段 E：重复事项完整集成 ✅ (2026-06-30)
- RecurrenceEditor 组件：频率/间隔/日期选择/结束条件 ✅
- RecurrenceActionDialog：本次/将来/全部 三选一 ✅
- 11 个边界测试（跨月、跨年、月末、闰年、次数限制等） ✅
- 支持 daily/weekdays/weekly/monthly/yearly/custom interval ✅

#### 阶段 F：习惯统计和每日评价统计 ✅ (2026-06-30)
- stats.ts 工具函数（纯函数，独立于 UI） ✅
- calculateStreak：连续打卡天数（支持 daily/weekdays/weekly） ✅
- calculateTaskStats：任务统计（时段/优先级/预计vs实际/过期） ✅
- calculateTagStats：标签分布统计 ✅
- calculateReviewStats：评分趋势统计 ✅
- generateHabitHeatmap：习惯热力图数据生成 ✅
- 16 个统计单元测试 ✅

#### 阶段 G：提醒系统 ✅ (2026-06-30)
- 浏览器通知工具 (notifications.ts)：权限检测、请求、发送 ✅
- useNotifications Hook：提醒列表构建、主动触发 ✅
- ReminderList 组件：过期事项/任务提醒/习惯打卡/每日总结分组展示 ✅
- 紧凑模式（Bell 图标 + 过期计数） ✅
- 设置页面通知开关已连线 + 权限请求 ✅
- 任务编辑添加提醒时间字段 ✅
- 习惯创建添加提醒时间字段 ✅
- 18 个通知单元测试 ✅
- 浏览器不支持/权限被拒兼容提示 ✅
- 绝不自动弹出权限请求（仅用户点击触发） ✅

#### 阶段 H：模板延期导入导出 ✅ (2026-06-30)
- TaskTemplate 管理组件：CRUD、应用到新事项、从事项保存模板 ✅
- OverdueProcessor：批量移至今天/明天、批量取消、过期列表展示 ✅
- JSON 导入导出：带验证、预览、确认导入 ✅
- CSV 导出（BOM for Excel 中文） ✅
- ImportExportDialog：导入/导出 UI ✅
- 设置页面集成模板管理、延期处理、数据导入导出 ✅

#### 阶段 I：PWA 与离线 ✅ (2026-06-30)
- Web App Manifest (manifest.json)：PWA 元数据、主题色、图标 ✅
- Service Worker (sw.js)：缓存优先策略、离线回退、自动更新检测 ✅
- PwaProvider：在线/离线状态追踪、安装提示、离线横幅 ✅
- Offline Queue (offline-queue.ts)：离线变更队列、重试/清理 ✅
- 布局已集成 PwaProvider ✅
- SVG PWA 图标 ✅

#### 阶段 J：E2E 测试 ✅ (2026-06-30)
- Playwright 配置（Chromium + Mobile Chrome） ✅
- 导航测试：登录→日历→今日→习惯→设置 ✅
- 任务管理测试：日视图、快速添加、日历导航、月视图 ✅
- 习惯测试：页面展示、创建对话框、打卡区域 ✅
- 设置页面测试：通知、模板区域验证 ✅
- 测试报告配置（HTML reporter） ✅

#### 阶段 K：文档完善和最终检查 ✅ (2026-06-30)
- README.md 更新：完整功能列表、部署文档（Vercel/Docker/PM2）、更新项目结构 ✅
- .gitignore 更新（Playwright artifacts） ✅
- 所有 10 个阶段（A-K）全部完成 ✅

## 🔄 进行中

- 无（所有计划阶段已完成）

## ⏳ 未完成（按优先级排列）

### 阶段 F：统计图表
- [ ] 习惯连续天数
- [ ] 习惯热力图
- [ ] 评分趋势
- [ ] 标签分布
- [ ] 时段分析

### 阶段 H：模板延期导入导出
- [ ] 事项模板
- [ ] 延期事项处理
- [ ] JSON 导入导出
- [ ] CSV 导出

### 阶段 I：PWA 与离线
- [ ] Web App Manifest
- [ ] Service Worker
- [ ] 离线队列

### 阶段 J：E2E 测试
- [ ] Playwright 配置
- [ ] 核心流程测试

### 阶段 K：文档完善
- [ ] 部署文档
- [ ] 已知问题列表

## 已知问题

1. 收集箱页面查询 `getByDate('inbox')` — IndexedDB 中 'inbox' 不是有效日期，查询逻辑有问题
2. ~~日视图中编辑按钮未连接 TaskEditDialog~~ ✅ 已修复 — 编辑/复制按钮已连线
3. 周视图中任务芯片不响应点击（无编辑/完成交互）
4. 月视图中点击日期会跳转到日视图，但跨月导航不便
5. ~~设置页面中的通知开关/紧凑模式/默认视图/每周起始日未连接保存逻辑~~ ✅ 已修复
6. ~~没有 Supabase 云端 Repository 实现~~ ✅ 已实现
7. ~~TaskEditDialog 提交后未 invalidate queries~~ ✅ 已修复 — 添加 queryClient.invalidateQueries
8. ~~没有 PWA manifest.json 文件~~ ✅ 已实现
9. ~~没有 Service Worker~~ ✅ 已实现
10. 统计页面缺少图表，仅展示基础数字
11. React Compiler 警告：RHF watch() 在 ScoreSelect 组件中使用

## 测试状态

| 类型 | 状态 |
|------|------|
| 单元测试 (date) | 6 passed ✅ |
| 单元测试 (recurrence) | 7 passed ✅ |
| Repository 测试 | 35 passed ✅ |
| 排序算法测试 | 16 passed ✅ |
| 统计测试 | 16 passed ✅ |
| 通知测试 | 18 passed ✅ |
| 组件测试 | 待编写 |
| E2E 测试 | 8 scenarios ✅ |

总计：109 个单元测试全部通过，8 个 E2E 场景已编写

## 下一步

所有计划阶段（A-K）已完成。后续可选改进：

1. 统计图表组件（习惯热力图、评分趋势图、标签分布饼图）
2. 周视图中任务芯片的点击交互
3. 收集箱（Inbox）页面查询逻辑修复
4. 更多 E2E 测试场景覆盖
5. CI/CD 配置（GitHub Actions）
