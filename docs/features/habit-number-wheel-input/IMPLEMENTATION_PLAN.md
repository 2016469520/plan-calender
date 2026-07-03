# IMPLEMENTATION_PLAN: 习惯打卡数值输入交互优化

## 日期
2026-07-04

## Phase 0: 接管和复现 ✅
- [x] 读取项目关键文件
- [x] 基线检查通过：ESLint 0e/89w, tsc 0e, vitest 187/187, build 14 routes
- [ ] 浏览器实际复现问题
- [ ] 截图保存

## Phase 1: 创建 NumberWheel 通用组件

### 组件设计
新建 `src/components/ui/number-wheel.tsx`

```tsx
interface NumberWheelProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled?: boolean
  className?: string
}
```

### 核心功能
1. **数字滚轮显示**：当前值 + 上下/左右相邻值
2. **当前值高亮**：最深色、最大字体
3. **相邻值淡化**：渐变色、小字体
4. **鼠标滚轮**：`onWheel` 事件，step 增减
5. **点击相邻值**：直接切换
6. **键盘支持**：ArrowUp/Down/Left/Right
7. **直接输入**：点击当前值切换为可编辑模式（type="text"，无 spinner）
8. **动画**：transition 150ms，尊重 prefers-reduced-motion

### 隐藏原生 spinner
使用 CSS：`[appearance:textfield]` 和 `&::-webkit-outer-spin-button, &::-webkit-inner-spin-button { appearance: none; margin: 0; }`

## Phase 2: 接入习惯卡片

### habit-checkin.tsx 修改
1. 替换 `<Input type="number">` 为 `<NumberWheel>`
2. 快捷按钮保留但增大尺寸
3. 操作区改为固定宽度（方案 B）

### home-habits-summary.tsx 修改
1. 替换 `<Input type="number">` 为 `<NumberWheel>`
2. 快捷按钮保留但增大
3. 操作区固定

## Phase 3: 保存交互重构

### 方案 B：固定操作区
- 每个卡片的操作区域预留固定宽度（w-20 或 w-24）
- 默认状态：编辑 + 删除图标
- 编辑状态：保存 + 取消按钮
- 自动保存：用户通过 NumberWheel 调整值时使用 debounce 300ms 自动保存
- 手动输入：点击当前值进入输入模式，Enter/失焦保存

### 自动保存状态显示
- 保存中：小型 spinner
- 已保存：短暂绿色勾（1.5s 后消失）
- 保存失败：红色叉 + 重试

## Phase 4: 习惯记录编辑删除回归
- 保留已有 Dialog 编辑功能
- 保留已有删除确认功能
- 确保统计刷新正确

## Phase 5: 视觉和移动端优化
- 桌面端：横向布局，控件间距合理
- 手机端：触控区域 ≥ 44px
- 深色模式：当前值突出、相邻值可读
- 减少动画：prefers-reduced-motion 支持

## Phase 6: 文档、回归和发布
- 全量测试
- build 验证
- 更新 README, PROJECT_STATUS, DECISIONS
- Git commit + push
- Vercel 验证

## 关键文件
- `src/components/ui/number-wheel.tsx` — 新建
- `src/components/habits/habit-checkin.tsx` — 修改
- `src/components/habits/home-habits-summary.tsx` — 修改
- `src/app/globals.css` — 隐藏 spinner 样式
- `docs/features/habit-number-wheel-input/*.md` — Harness 文档
