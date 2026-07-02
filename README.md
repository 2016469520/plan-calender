# 我的计划日历

个人计划管理系统 — 支持月/周/日三种视图，按上午/下午/晚上三个时段规划日程，具备习惯打卡、每日评价和统计分析功能。

**适用场景**：日常计划安排、学习任务管理、习惯养成追踪、每日复盘总结。

**主要特点**：界面响应式（手机 + 桌面）、支持云端同步、可安装为 PWA、数据可导入导出。

## 🚀 立即使用

**[👉 打开我的计划日历](https://my-plan-calendar.vercel.app)**

> 无需下载代码，无需安装 Node.js，无需配置 Supabase。打开网页即可使用。

---

## 📖 普通用户：直接使用网页

### 你不需要

- 下载源代码
- 安装 Node.js 或任何开发工具
- 配置数据库或环境变量
- 了解任何编程知识

### 使用步骤

1. 用浏览器打开 **[my-plan-calendar.vercel.app](https://my-plan-calendar.vercel.app)**
2. 注册账号（Supabase 云端模式）或直接输入任意邮箱密码（本地演示模式）
3. 点击右上角 **「新建」** 按钮
4. 填写事项标题，选择日期、时段和标签
5. 在日历中查看、编辑和管理你的计划
6. 使用习惯打卡、每日评价和统计功能

### 云端模式 vs 演示模式

| | 云端模式 | 本地演示模式 |
|---|---|---|
| 登录方式 | 真实邮箱注册/登录 | 输入任意邮箱密码 |
| 数据存储 | Supabase（云端 PostgreSQL） | 浏览器 IndexedDB |
| 跨设备同步 | ✅ 同一账户多设备访问 | ❌ 仅限当前浏览器 |
| 数据持久性 | 云端永久保存 | 清除浏览器数据会丢失 |
| 联网要求 | 需要网络 | 离线可用 |

> **注意**：演示模式的数据只保存在当前浏览器的本地存储中，不会同步到其他设备。如果清除浏览器数据或使用隐私模式，数据可能丢失。

### 📱 安装到手机（PWA）

#### Android / Chrome

1. 用 Chrome 打开 [my-plan-calendar.vercel.app](https://my-plan-calendar.vercel.app)
2. 点击浏览器菜单（⋮）
3. 选择 **「安装应用」** 或 **「添加到主屏幕」**

#### iPhone / Safari

1. 用 Safari 打开上述网址
2. 点击底部 **分享按钮**
3. 选择 **「添加到主屏幕」**

安装后，可从桌面图标直接进入应用，享受接近原生 App 的体验。

> **说明**：PWA 安装后可在离线状态下查看已加载的数据，但云端同步和部分功能仍需要网络连接。浏览器通知能力受系统和浏览器设置限制。

### 主要功能

- **三种日历视图**：月视图、周视图（上午/下午/晚上）、日视图
- **事项管理**：创建、编辑、删除、完成切换、优先级、预计用时
- **标签系统**：为事项分类，支持自定义颜色
- **拖拽排序**：在时段内调整顺序，跨时段/跨日期移动事项
- **重复日程**：每天、工作日、每周、每月、自定义间隔
- **子任务**：将大事项拆分为多个子步骤
- **搜索筛选**：按关键词、标签、状态、优先级、日期范围搜索
- **习惯打卡**：布尔/计数/时长/数值四种模式，连续天数统计
- **每日评价**：评分、心情、精力、总结、明日规划
- **提醒通知**：浏览器通知提醒即将开始的事项
- **事项模板**：保存常用事项为模板，一键创建
- **延期处理**：批量将过期事项移至今天或明天
- **数据导入导出**：支持 JSON 导入导出、CSV 导出
- **PWA 支持**：可安装到桌面/主屏幕，离线查看
- **响应式设计**：桌面侧边栏 + 手机底部导航
- **深色模式**：浅色/深色/跟随系统

### 网络访问说明

应用托管在 Vercel，数据服务使用 Supabase。在某些网络环境下可能无法稳定访问。如遇到加载失败或登录异常，请检查当前网络环境。

---

## 🛠 开发者：本地运行与继续开发

### 环境要求

| 工具 | 版本要求 |
|------|----------|
| Node.js | 18+ (推荐 20+) |
| npm | 9+ |
| Git | 任意版本 |
| Supabase CLI | 可选（用于数据库 migration） |

### 克隆仓库

```bash
git clone https://github.com/2016469520/plan-calender.git
cd plan-calender
npm install
```

### 本地演示模式（无需 Supabase）

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，在登录页输入任意邮箱和密码即可进入。

> 演示模式下所有数据存储在浏览器 IndexedDB 中，数据不会持久化到服务器。

### 配置 Supabase（云端模式）

1. 在 [supabase.com](https://supabase.com) 创建项目
2. 在 Supabase SQL Editor 中按顺序执行以下 migration 文件：
   - `supabase/migrations/001_initial_schema.sql` — 建表
   - `supabase/migrations/002_rls_policies.sql` — RLS 策略 + 新用户触发器
   - `supabase/migrations/003_fix_handle_new_user.sql` — 修复注册 500 错误
   - `supabase/migrations/004_tag_deduplication.sql` — 标签去重和唯一约束
3. 在 Supabase Authentication 中启用 Email 登录（建议关闭邮箱确认）
4. 创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. 重启 `npm run dev`

> **注意**：不要将 `.env.local` 中的密钥提交到 Git 仓库。

### 常用命令

```bash
npm run dev           # 启动开发服务器
npm run build         # 生产构建
npm run start         # 启动生产服务器
npm run lint          # ESLint 检查
npx tsc --noEmit      # TypeScript 类型检查
npx vitest run        # 运行单元测试（118 个）
npx vitest            # 监视模式
npx playwright test   # E2E 测试
```

### 部署

本项目通过 **Vercel + GitHub** 自动部署：推送到 `main` 分支后自动触发 Vercel 构建和部署。

手动部署：

```bash
npm run build
npx vercel --prod
```

部署时需要确保：

1. Vercel 项目中配置了以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Supabase 数据库已执行所有 migration
3. **推送代码不会自动修改 Supabase 数据库**，migration 需要单独执行

### 项目结构

```
plan-calender/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── calendar/           # 日历主页
│   │   ├── today/              # 今日视图
│   │   ├── habits/             # 习惯管理
│   │   ├── insights/           # 统计分析
│   │   ├── settings/           # 设置页面
│   │   ├── inbox/              # 收集箱
│   │   └── login/              # 登录注册
│   ├── components/
│   │   ├── calendar/           # 月/周/日视图组件
│   │   ├── layout/             # 布局（侧边栏、导航）
│   │   ├── plans/              # 事项编辑、模板、导入导出
│   │   ├── habits/             # 习惯打卡
│   │   ├── reviews/            # 每日评价
│   │   ├── reminders/          # 提醒通知
│   │   ├── search/             # 搜索筛选
│   │   ├── common/             # 标签管理等通用组件
│   │   ├── pwa/                # PWA 相关
│   │   └── ui/                 # shadcn/ui 基础组件
│   ├── hooks/                  # 自定义 React Hooks
│   ├── lib/
│   │   ├── repositories/       # 数据访问层（接口 + IndexedDB + Supabase 实现）
│   │   ├── supabase/           # Supabase 客户端
│   │   ├── utils/              # 工具函数
│   │   ├── db/                 # IndexedDB Schema
│   │   └── constants.ts        # 常量配置
│   ├── providers/              # React Context Providers
│   └── types/                  # TypeScript 类型定义
├── supabase/migrations/        # 数据库迁移文件
├── public/                     # 静态资源 + PWA manifest
└── e2e/                        # Playwright E2E 测试
```

### 已知限制

- 收集箱（Inbox）页面查询逻辑存在已知问题
- 周视图中任务芯片暂不支持点击交互
- 统计页面缺少图表组件，目前仅展示基础数字

## 📚 开发文档

- [项目计划](./PROJECT_PLAN.md)
- [项目状态](./PROJECT_STATUS.md)
- [技术决策](./DECISIONS.md)
- [未来路线图](./FUTURE_ROADMAP.md)

## ⚖️ License

当前仓库尚未添加开源许可证。
