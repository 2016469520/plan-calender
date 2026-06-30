'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { DesktopSidebar } from './desktop-sidebar'
import { MobileNav } from './mobile-nav'
import { useAuth } from '@/providers/auth-provider'
import { useInitializeDefaultTags } from '@/hooks/use-default-tags'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  useInitializeDefaultTags()

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.replace('/login')
    }
  }, [isLoading, user, pathname, router])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
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
