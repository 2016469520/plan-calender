'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DesktopSidebar } from './desktop-sidebar'
import { MobileNav } from './mobile-nav'
import { useAuth } from '@/providers/auth-provider'
import { useInitializeDefaultTags } from '@/hooks/use-default-tags'
import { useCrossWindowSync } from '@/hooks/use-cross-window-sync'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isWidget = pathname?.startsWith('/widget') ?? false

  useInitializeDefaultTags()
  // 主窗口与桌面浮窗同时打开时保持数据一致
  useCrossWindowSync()

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (isWidget) return
    if (!isLoading && !user && pathname !== '/login') {
      router.replace('/login')
    }
  }, [isLoading, user, pathname, router, isWidget])

  // 浮窗是独立的无边框小窗，不套用侧边栏 / 底部导航
  if (isWidget) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-body text-muted-foreground">加载中…</p>
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  )
}
