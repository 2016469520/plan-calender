# CLAUDE.md — 我的计划日历 开发规则

## 项目概述

一个个人计划管理系统，支持月/周/日三视图，上午/下午/晚上三时段，具备完整的事项管理、习惯打卡、每日评价和统计分析功能。

技术栈：Next.js 16 (App Router) + TypeScript strict + Tailwind CSS v4 + shadcn/ui v4 (@base-ui/react) + Supabase + IndexedDB (idb) + TanStack Query v5 + React Hook Form + Zod v4 + date-fns v4 + Vitest

## 长期开发规则

1. 不要重新初始化项目。
2. 不要重复实现已有功能。
3. 不要大规模重写已经稳定的模块，除非存在明确架构问题。
4. 修改前先读取相关文件和调用关系。
5. 以实际代码为准，不要仅根据旧总结判断完成情况。
6. 不要使用硬编码假数据伪装真实功能。
7. 不要让 UI 直接耦合 Supabase 或 IndexedDB。
8. 保持 Repository 模式。
9. 保持 TypeScript strict。
10. 避免 `any`、`@ts-ignore` 和不安全类型断言。
11. 不要通过关闭 ESLint 规则来掩盖问题。
12. 不要删除失败测试来让测试通过。
13. 不要跳过 RLS。
14. 不要把密钥写入源码。
15. 不要提交 `.env.local`。
16. 所有用户数据必须按 `user_id` 隔离。
17. 日期字段和时间戳字段要严格区分。
18. 防止时区转换导致计划日期偏移。
19. 核心业务逻辑必须与页面组件分离。
20. 所有新增功能必须处理加载、空数据、错误和失败恢复。
21. 手机端不是桌面页面简单缩小，必须检查触摸交互和布局。
22. 重要操作需要清晰反馈。
23. 删除功能优先采用软删除和撤销。
24. 不要使用原生 `alert` 作为主要交互。
25. 每完成一个阶段，更新 `PROJECT_STATUS.md`。
26. 重大架构决策写入 `DECISIONS.md`。
27. 每个阶段完成后运行相关测试。
28. 如果已有 Git 仓库，可以按阶段创建清晰的本地提交，但不要擅自推送远程仓库。
29. 除非需要账号、密钥、不可逆删除或存在重大产品方向冲突，否则不要停下来询问。
30. 遇到小型技术选择时自行选用合理方案并记录原因。
31. 不要只完成界面而遗漏数据持久化。
32. 不要在核心功能尚未完成时花费大量时间做动画和装饰。

## 上下文管理规则

1. 将长期规则保存在 `CLAUDE.md`。
2. 将完整阶段计划保存在 `PROJECT_PLAN.md`。
3. 将当前进度保存在 `PROJECT_STATUS.md`。
4. 将技术决策保存在 `DECISIONS.md`。
5. 每完成一个功能立即更新状态，不要等到最后统一更新。
6. `PROJECT_STATUS.md` 至少记录：已完成功能、正在开发的功能、未完成功能、最近运行的测试、测试结果、当前错误、已知问题、下一步具体任务。
7. 在进入大型新阶段前，先更新上述文件。
8. 如果上下文即将压缩，先保存：当前正在修改的文件、当前问题原因、尚未完成的代码、下一步命令、测试结果。
9. 上下文压缩后，重新读取：`CLAUDE.md`、`PROJECT_PLAN.md`、`PROJECT_STATUS.md`、`DECISIONS.md`、`git status`、`git diff`。
10. 不要因为上下文压缩重新开始项目。
11. 如果自动压缩后信息冲突，以实际代码、Git diff、数据库迁移和测试结果为准。
12. 当上下文使用率较高时，优先完成当前最小闭环，再开始新功能。
13. 不要在上下文即将满时同时修改多个无关模块。

## 已知兼容性风险

1. Zod v4 与 React Hook Form 类型推导存在兼容差异。
2. `estimated_minutes` 字段可能使用 string schema 规避表单类型问题。
3. date-fns v4 的 locale 导入方式与旧版本不同。
4. shadcn/ui v4 基于 `@base-ui/react`，部分 API 与旧版 Radix 实现不同。
5. 可能不存在 `asChild`。
6. 某些 `onValueChange` 参数可能包含 `null`。
7. Tooltip 参数使用 `delay` 而不是 `delayDuration`。
8. React Hook Form 的 `watch()` 可能触发 React Compiler 警告。
9. 当前演示模式数据存储在 IndexedDB，清除浏览器数据会丢失。
10. 当前 Supabase Repository 可能尚未完成。

## 关键文件位置

| 文件 | 路径 |
|------|------|
| 类型定义 | src/types/index.ts |
| 数据层接口 | src/lib/repositories/interfaces.ts |
| IndexedDB 实现 | src/lib/repositories/indexeddb-impl.ts |
| IndexedDB Schema | src/lib/db/indexeddb.ts |
| Supabase 客户端 | src/lib/supabase/client.ts |
| Supabase 服务端 | src/lib/supabase/server.ts |
| 日期工具 | src/lib/utils/date.ts |
| 重复规则 | src/lib/utils/recurrence.ts |
| 常量 | src/lib/constants.ts |
| DB Migration | supabase/migrations/001_initial_schema.sql |
| RLS 策略 | supabase/migrations/002_rls_policies.sql |
| Auth Provider | src/providers/auth-provider.tsx |
| Repo Provider | src/providers/repo-provider.tsx |
| 环境变量 | .env.example |
