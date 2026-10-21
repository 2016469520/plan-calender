/**
 * 桌面端（Electron）能力桥。
 *
 * 打包版由 preload 注入 window.timegrid；网页/安卓端该对象不存在，
 * 所有调用都退化为安全空操作，调用方不需要分支判断。
 */

export interface DesktopBridge {
  isDesktop: boolean
  /** 隐藏浮窗（只留主窗口） */
  hideWidget: () => Promise<void>
  /** 显示/隐藏浮窗 */
  toggleWidget: () => Promise<boolean>
  /** 打开并聚焦主窗口 */
  openMain: () => Promise<void>
  /** 切换浮窗置顶 */
  togglePin: () => Promise<boolean>
  /** 查询浮窗是否置顶 */
  isPinned: () => Promise<boolean>
  /** 退出整个应用 */
  quit: () => Promise<void>
}

interface BridgeWindow {
  timegrid?: Omit<DesktopBridge, 'isDesktop'>
}

export function getDesktopBridge(): DesktopBridge | null {
  if (typeof window === 'undefined') return null
  const bridge = (window as unknown as BridgeWindow).timegrid
  if (!bridge) return null

  return {
    isDesktop: true,
    hideWidget: () => bridge.hideWidget(),
    toggleWidget: () => bridge.toggleWidget(),
    openMain: () => bridge.openMain(),
    togglePin: () => bridge.togglePin(),
    isPinned: () => bridge.isPinned(),
    quit: () => bridge.quit(),
  }
}

export function isDesktopApp(): boolean {
  return getDesktopBridge() !== null
}
