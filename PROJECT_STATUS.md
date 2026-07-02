# PROJECT_STATUS.md — 项目状态

## 当前阶段：功能开发 — 评价历史与分类视图 (2026-07-03)

## 验证状态：2026-07-03

| 检查项 | 结果 |
|--------|------|
| npm install | ✅ 通过 |
| ESLint | ✅ 0 errors, 48 warnings |
| TypeScript (tsc --noEmit) | ✅ 通过 |
| Vitest (153 tests) | ✅ 全部通过 |
| Next.js build | ✅ 通过 (9 routes) |

## 🆕 本次新增功能 (2026-07-03)

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
