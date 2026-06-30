'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { mainNavItems, secondaryNavItems, type NavItem } from './nav-data'
import { APP_NAME } from '@/lib/constants'
import { CalendarDays } from 'lucide-react'

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.label}</span>
    </Link>
  )
}

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r bg-card/50 h-full shrink-0">
      {/* App branding */}
      <div className="p-4 border-b">
        <Link href="/calendar" className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">{APP_NAME}</span>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      {/* Secondary navigation */}
      <div className="p-3 border-t space-y-1">
        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname.startsWith(item.href)}
          />
        ))}
      </div>
    </aside>
  )
}
