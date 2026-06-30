# 我的计划日历

个人计划管理系统 — 月/周/日视图，上午/下午/晚上三时段规划，支持习惯打卡、每日评价和统计分析。

## 🌐 访问地址

| 用途 | 地址 |
|------|------|
| **生产环境** | **[https://my-plan-calendar.vercel.app](https://my-plan-calendar.vercel.app)** |
| GitHub 仓库 | [https://github.com/2016469520/plan-calender](https://github.com/2016469520/plan-calender) |
| Vercel 控制台 | [vercel.com/sunyinghui/my-plan-calendar](https://vercel.com/sunyinghui/my-plan-calendar) |

> ⚠️ **国内用户**：Vercel 和 Supabase 域名在国内被墙，需要开启 VPN 后访问。

## 📱 安装到手机（PWA）

1. 开 VPN，用手机浏览器打开 https://my-plan-calendar.vercel.app
2. Chrome：菜单 → **添加到主屏幕**
3. Safari：分享按钮 → **添加到主屏幕**
4. 或者进入应用后点击 **设置 → 安装应用 → 添加到主屏幕**

安装后就像原生 App，独立窗口运行，离线也能查看已加载的数据。

## 🔐 登录

- **已配置 Supabase**：用真实邮箱注册/登录，数据云端同步
- **演示模式**（未配置 Supabase 时）：输入任意邮箱密码即可，数据存浏览器

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v4 |
| 组件库 | shadcn/ui v4 (@base-ui/react) |
| 数据层 | TanStack Query v5 + Repository 模式 |
| 表单 | React Hook Form + Zod |
| 云端后端 | Supabase (Auth, PostgreSQL, RLS) |
| 本地存储 | IndexedDB (idb) |
| 拖拽 | @dnd-kit |
| 测试 | Vitest (109 tests) + Playwright (E2E) |
| 图标 | Lucide React |

## 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 本地运行

```bash
cd my-plan-calendar
npm install
npm run dev
```

打开 http://localhost:3000 ，输入任意邮箱密码即可进入（演示模式）。

### 配置 Supabase（可选）

配置后数据自动转为云端同步：

1. 在 [supabase.com](https://supabase.com) 创建项目
2. 在 SQL Editor 中依次执行：
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_fix_handle_new_user.sql`（Option A）
3. 创建 `.env.local`：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. 重启 `npm run dev`

## 部署

当前通过 Vercel + GitHub 自动部署：推送代码到 `main` 分支自动触发。

```bash
# 手动部署
npm run build
npx vercel --prod
```

环境变量已在 Vercel 配置：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 测试

```bash
npx vitest run          # 109 个单元测试
npx vitest              # 监视模式
npx playwright test     # E2E 测试
```

## 功能

- 月视图 / 周视图（上午/下午/晚上）/ 日视图
- 事项 CRUD、拖拽排序、跨时段/日期移动
- 重复事项（每天/工作日/每周/每月/自定义）
- 子任务管理
- 搜索和筛选
- 习惯创建和打卡（布尔/计数/时长/数值）
- 每日评价（评分/心情/精力/总结）
- 提醒通知
- 事项模板、批量延期处理
- JSON/CSV 导入导出
- 标签管理
- 浅色/深色/系统主题
- PWA（可安装到桌面/主屏幕，离线可用）
- 响应式（桌面侧边栏 + 手机底部导航）
- 键盘快捷键（M/W/D/T/N）

## 项目结构

```
my-plan-calendar/
├── src/
│   ├── app/                 # 页面路由
│   │   ├── calendar/        # 日历
│   │   ├── today/           # 今日
│   │   ├── habits/          # 习惯
│   │   ├── insights/        # 统计
│   │   ├── settings/        # 设置
│   │   ├── inbox/           # 收集箱
│   │   └── login/           # 登录
│   ├── components/
│   │   ├── calendar/        # 月/周/日视图
│   │   ├── layout/          # 布局
│   │   ├── plans/           # 事项编辑/模板/导入导出
│   │   ├── habits/          # 习惯打卡
│   │   ├── reviews/         # 每日评价
│   │   ├── reminders/       # 提醒
│   │   ├── search/          # 搜索筛选
│   │   ├── pwa/             # PWA
│   │   └── ui/              # shadcn 组件
│   ├── lib/
│   │   ├── repositories/    # 数据访问层
│   │   ├── supabase/        # Supabase 客户端
│   │   ├── utils/           # 工具函数
│   │   └── db/              # IndexedDB
│   ├── providers/           # React Context
│   ├── hooks/               # 自定义 Hooks
│   └── types/               # 类型定义
├── supabase/migrations/     # 数据库迁移
├── public/                  # 静态资源 + PWA
└── e2e/                     # E2E 测试
```

## 文档

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) — 项目计划
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) — 当前状态
- [DECISIONS.md](./DECISIONS.md) — 技术决策
- [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) — 未来路线图
