# 我的计划日历

个人计划管理系统 — 月/周/日视图，上午/下午/晚上三时段规划，支持习惯打卡、每日评价和统计分析。

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v4 |
| 组件库 | shadcn/ui v4 (@base-ui/react) |
| 日历 | 自定义 React 日历视图 |
| 数据 | TanStack Query v5 |
| 表单 | React Hook Form + Zod |
| 后端 | Supabase (Auth, PostgreSQL, Realtime, RLS) |
| 本地模式 | IndexedDB (idb) |
| 测试 | Vitest + Testing Library + Playwright |
| 图标 | Lucide React |

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装

```bash
cd my-plan-calendar
npm install
```

### 本地开发（演示模式）

无需配置即可运行。数据保存在浏览器 IndexedDB 中，登录页接受任意邮箱密码。

```bash
npm run dev
```

打开 http://localhost:3000，在登录页输入任意邮箱和密码即可进入应用。

> ⚠️ 演示模式不支持跨设备同步。配置 Supabase 后自动切换为云端模式。

### 配置 Supabase（云端模式）

配置 Supabase 后，应用将自动从 IndexedDB 演示模式切换为云端同步模式。

#### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 并注册/登录
2. 点击 "New project" 创建新项目
3. 填写项目名称（如 `my-plan-calendar`）
4. 设置数据库密码（妥善保存）
5. 选择离你最近的区域
6. 等待项目初始化完成（约 2 分钟）

#### 2. 执行数据库迁移

在 Supabase Dashboard 中：

1. 进入左侧菜单 **SQL Editor**
2. 点击 **New query**
3. 复制 `supabase/migrations/001_initial_schema.sql` 的全部内容，粘贴并执行
4. 再新建一个查询，复制 `supabase/migrations/002_rls_policies.sql` 的全部内容，粘贴并执行
5. 检查左侧 **Table Editor**，确认所有 10 张表已创建

#### 3. 配置环境变量

1. 在 Supabase Dashboard → **Settings** → **API** 中获取：
   - **Project URL**（`https://<project-id>.supabase.co`）
   - **anon public key**（以 `eyJ...` 开头）

2. 在项目根目录复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```

3. 编辑 `.env.local`，填入实际值：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   > ⚠️ **不要填入 `service_role` key**。Service Role Key 仅用于服务端操作，放入客户端会绕过 RLS 策略。

4. 重启开发服务器：`npm run dev`

#### 4. 开启邮箱登录

1. 在 Supabase Dashboard → **Authentication** → **Providers**
2. 确认 **Email** provider 已启用
3. 可选：关闭 "Confirm email" 以简化开发流程（生产环境建议开启）
4. 可选：配置 SMTP 以发送真实的密码重置邮件

#### 5. 验证 RLS 策略

1. 在 Supabase Dashboard → **SQL Editor** 运行以下验证查询：

```sql
-- 检查 RLS 是否全部启用
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

所有表应显示 `rowsecurity = true`。

2. 验证新用户触发器：

```sql
-- 注册新用户后，检查默认标签是否自动创建
SELECT * FROM tags WHERE user_id = '<your-user-id>';
```

#### 6. 切换演示模式和云端模式

模式切换是全自动的，无需手动操作：

| 条件 | 模式 | 数据存储 |
|------|------|---------|
| 未配置 `NEXT_PUBLIC_SUPABASE_URL` 或值为占位符 | 演示模式 | 浏览器 IndexedDB |
| 配置了有效的 Supabase URL 和 Anon Key | 云端模式 | Supabase PostgreSQL |

> 在演示模式下，登录页接受任意邮箱和密码。在云端模式下，使用真实的 Supabase Auth 邮箱登录。

### 运行测试

```bash
# 单元测试（109 个）
npx vitest run

# 监视模式
npx vitest

# E2E 测试
npx playwright test

# 查看 E2E 测试报告
npx playwright show-report
```

### 构建部署

```bash
npm run build
npm start
```

#### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`）
4. 部署即可，零额外配置

#### 自建部署

```bash
# 安装依赖
npm ci

# 构建
npm run build

# 启动（端口 3000）
npm start

# 使用 PM2 守护进程
pm2 start npm --name "plan-calendar" -- start
```

#### Docker 部署（可选）

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── calendar/           # 日历主页
│   ├── today/              # 今日计划
│   ├── habits/             # 习惯打卡
│   ├── insights/           # 统计复盘
│   ├── settings/           # 设置（含标签管理、模板、导入导出）
│   ├── inbox/              # 收集箱
│   └── login/              # 登录/注册
├── components/
│   ├── calendar/           # 月视图、周视图、日视图 + DnD
│   ├── layout/             # 桌面侧边栏、移动底部导航
│   ├── plans/              # 事项编辑、模板、延期处理、导入导出
│   ├── reviews/            # 每日评价表单
│   ├── habits/             # 习惯打卡组件
│   ├── reminders/          # 提醒列表组件
│   ├── search/             # 搜索筛选组件
│   ├── pwa/                # PWA Provider
│   ├── common/             # 标签管理等通用组件
│   └── ui/                 # shadcn/ui 组件
├── hooks/                  # 自定义 React Hooks
│   ├── use-task-dnd.ts     # 拖拽 Hook
│   ├── use-notifications.ts # 通知 Hook
│   └── ...
├── lib/
│   ├── constants.ts        # 应用常量
│   ├── utils/
│   │   ├── date.ts         # 日期计算工具
│   │   ├── recurrence.ts   # 重复规则引擎
│   │   ├── stats.ts        # 统计计算
│   │   ├── sort-order.ts   # 排序算法
│   │   ├── notifications.ts # 浏览器通知
│   │   ├── import-export.ts # JSON/CSV 导入导出
│   │   └── offline-queue.ts # 离线变更队列
│   ├── repositories/       # 数据访问层
│   │   ├── interfaces.ts   # Repository 接口定义
│   │   ├── indexeddb-impl.ts # IndexedDB 实现
│   │   └── supabase-impl.ts # Supabase 实现
│   ├── supabase/           # Supabase 客户端
│   └── db/                 # IndexedDB Schema
├── providers/              # React Context Providers
├── types/                  # TypeScript 类型定义
└── __tests__/              # 单元测试（109 tests）
e2e/                        # Playwright E2E 测试
public/
├── manifest.json           # PWA Manifest
├── sw.js                   # Service Worker
└── icon-192.svg            # PWA Icon
supabase/
└── migrations/             # 数据库迁移 SQL
```

## 功能概览

### 已实现

- ✅ 登录/注册（Supabase Auth + 本地演示模式）
- ✅ 月视图（传统月历网格）
- ✅ 周视图（上午/下午/晚上三时段布局）
- ✅ 日视图（三时段 + 快速添加 + 任务卡片）
- ✅ 视图切换和日期导航
- ✅ 键盘快捷键（M/W/D/T/N）
- ✅ 事项 CRUD（快速添加、编辑弹窗、完成切换、软删除、复制）
- ✅ 拖拽排序（时段内排序、跨时段/跨日期移动）
- ✅ 搜索和筛选（搜索栏、多条件筛选、筛选芯片）
- ✅ 子任务管理（添加、完成切换、进度条）
- ✅ 重复事项（RecurrenceEditor、三作用域编辑/删除）
- ✅ 标签 CRUD 管理
- ✅ 习惯创建和打卡（4 种计量方式、提醒时间）
- ✅ 习惯统计（连续打卡、热力图、完成率）
- ✅ 每日评价表单（评分、心情、精力、成果等）
- ✅ 事项统计（时段/优先级/预计vs实际/过期/标签分布）
- ✅ 提醒系统（浏览器通知、应用内提醒列表、过期事项处理）
- ✅ 事项模板（创建、应用、管理）
- ✅ 导入导出（JSON 导入/导出、CSV 导出）
- ✅ 设置页面（主题、通知、紧凑模式、默认视图、每周起始日）
- ✅ PWA（Manifest、Service Worker、离线横幅）
- ✅ 收集箱页面
- ✅ 浅色/深色/系统主题
- ✅ 响应式布局（手机端底部导航 + 桌面端侧边栏）
- ✅ Supabase 云端 Repository（9 个 Repository 完整实现）
- ✅ 完整的数据库 Schema 和 RLS 策略
- ✅ Repository 模式数据访问层
- ✅ 单元测试（109 个）+ E2E 测试（Playwright）

## 数据库表

| 表名 | 说明 |
|------|------|
| profiles | 用户资料 |
| tags | 标签 |
| tasks | 计划事项（支持重复规则、软删除） |
| task_subitems | 子任务 |
| recurrence_exceptions | 重复事项例外 |
| habits | 习惯定义 |
| habit_logs | 习惯打卡记录 |
| daily_reviews | 每日评价 |
| task_templates | 事项模板 |
| user_preferences | 用户偏好设置 |

所有用户数据表均启用 RLS，新用户注册时自动创建默认标签。

## 环境变量

见 `.env.example`：

| 变量 | 说明 | 必需 |
|------|------|------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase 项目 URL | 云端模式必需 |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase Anon Key | 云端模式必需 |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Service Role Key | 服务端操作 |

## 文档

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) — 项目计划
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — 项目状态
- [DECISIONS.md](./DECISIONS.md) — 技术决策记录
- [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) — 未来路线图
