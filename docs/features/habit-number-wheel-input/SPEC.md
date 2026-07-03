# SPEC: 习惯分钟输入交互稳定性修复

## 日期
2026-07-04

## 当前问题（已复现）

1. **保存按钮布局跳动**：`<Input type="number">` 输入值后，`保存` 按钮条件渲染出现在 flex 行中间，挤开数字区域
2. **代码中的根因**（habit-checkin.tsx L347-353, home-habits-summary.tsx L284-287）：
   ```tsx
   {inputVal !== undefined && inputVal !== '' && (
     <Button size="sm" onClick={save}>保存</Button>
   )}
   ```
   这个条件渲染在 flex row 内插入新元素，导致所有后续元素向右移动
3. **编辑/删除按钮条件渲染**（L355-370）：`{log && (...)}` 同样在 flex row 内动态插入
4. **+5/+10/+15/+30 快捷按钮**：`MINUTE_SHORTCUTS.slice(0, 4)` 渲染在小尺寸按钮中，占用空间且用户不需要
5. **滚轮每次 5 分钟**：`adjustValue(habit, m)` 使用快捷按钮的值（5/10/15/30），步进太大
6. **原生 number spinner**：`type="number"` 显示浏览器上下箭头

## 修复方案

### 1. 固定操作区（防止布局跳动）
- 保存状态指示器使用固定宽度容器（w-5），始终渲染
- 编辑/删除按钮在固定宽度容器（w-14）中，无记录时为空
- 不使用条件渲染插入/移除元素

### 2. 移除大步进快捷按钮
- 删除 +5/+10/+15/+30 按钮
- minutes 型只保留 -1 / 当前值 / +1 / 单位

### 3. 滚轮步进改为 1
- wheel up → +1 分钟
- wheel down → -1 分钟
- 节流 80ms 防止 trackpad 高频事件

### 4. 加减按钮微调 1 分钟
- 按钮每次 +1 或 -1

### 5. 直接输入保留
- type="text" + inputMode="numeric"（隐藏原生 spinner）
- tabular-nums 固定数字宽度

### 6. 自动保存 debounce 400ms
- 滚轮调整后 debounce 自动保存
- +/- 按钮点击立即保存
- 状态显示在固定位置

## 验收标准
- [ ] 不再显示 +5/+10/+15/+30
- [ ] 滚轮每次调整 1 分钟
- [ ] +/- 每次调整 1 分钟
- [ ] 保存状态不挤压时间调节区域
- [ ] 时间区域在 idle/editing/saving/saved/error 五种状态下位置不变
- [ ] 无原生 spinner
- [ ] 手机端无横向溢出
- [ ] 深色模式正常
- [ ] eslint 0e, tsc 0e, vitest 全通过, build 通过
