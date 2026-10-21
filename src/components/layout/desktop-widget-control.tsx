'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { getDesktopBridge, type DesktopBridge } from '@/lib/desktop-bridge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MonitorSmartphone, Pin, PinOff, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/** bridge 是外部注入的，用 useSyncExternalStore 读取可以避免 SSR 水合不一致 */
const subscribeNoop = () => () => {}
const getBridgeSnapshot = () => getDesktopBridge()
const getServerSnapshot = () => null

/**
 * 「桌面浮窗」开关。只在 Electron 打包版里出现（网页/安卓没有 desktop bridge）。
 * variant='sidebar' 放在侧边栏底部，variant='card' 放在设置页。
 */
export function DesktopWidgetControl({ variant = 'sidebar' }: { variant?: 'sidebar' | 'card' }) {
  const bridge = useSyncExternalStore<DesktopBridge | null>(
    subscribeNoop,
    getBridgeSnapshot,
    getServerSnapshot
  )
  const [visible, setVisible] = useState(false)
  const [pinned, setPinned] = useState(true)

  useEffect(() => {
    if (!bridge) return
    let cancelled = false
    bridge
      .isWidgetVisible()
      .then((value) => {
        if (!cancelled) setVisible(value)
      })
      .catch(() => {})
    bridge
      .isPinned()
      .then((value) => {
        if (!cancelled) setPinned(value)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [bridge])

  const toggleVisible = useCallback(async () => {
    if (!bridge) return
    const next = await bridge.toggleWidget()
    setVisible(next)
    toast.success(next ? '浮窗已显示' : '浮窗已隐藏', { duration: 1500 })
  }, [bridge])

  const togglePin = useCallback(async () => {
    if (!bridge) return
    setPinned(await bridge.togglePin())
  }, [bridge])

  if (!bridge) return null

  if (variant === 'card') {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4" />
            桌面浮窗
          </CardTitle>
          <CardDescription>
            一个常驻桌面角落的小清单，随时勾选、随手加事项；关闭主窗口后它仍留在桌面上
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant={visible ? 'outline' : 'default'} onClick={toggleVisible}>
            {visible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {visible ? '隐藏浮窗' : '显示浮窗'}
          </Button>
          <Button variant="outline" onClick={togglePin}>
            {pinned ? <PinOff className="h-4 w-4 mr-2" /> : <Pin className="h-4 w-4 mr-2" />}
            {pinned ? '取消置顶' : '置顶浮窗'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <button
      type="button"
      data-testid="sidebar-widget-toggle"
      onClick={toggleVisible}
      title={visible ? '隐藏桌面浮窗' : '显示桌面浮窗'}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        visible
          ? 'text-violet-600 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/30'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      <MonitorSmartphone className="h-5 w-5" />
      <span>桌面浮窗</span>
      <span
        className={cn(
          'ml-auto text-[10px] rounded-full px-1.5 py-0.5',
          visible ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300' : 'bg-muted text-muted-foreground'
        )}
      >
        {visible ? '显示中' : '已隐藏'}
      </span>
    </button>
  )
}
