import {
  Calendar,
  ListTodo,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Settings,
  Inbox,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const mainNavItems: NavItem[] = [
  { href: '/schedule', label: '日程', icon: ListTodo },
  { href: '/calendar', label: '日历', icon: Calendar },
  { href: '/habits', label: '习惯', icon: CheckSquare },
  { href: '/reviews', label: '复盘', icon: ClipboardList },
  { href: '/insights', label: '统计', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

// Mobile bottom nav: top 5 main items (exclude 统计 to keep 5 items)
export const mobileNavItems: NavItem[] = [
  { href: '/schedule', label: '日程', icon: ListTodo },
  { href: '/calendar', label: '日历', icon: Calendar },
  { href: '/habits', label: '习惯', icon: CheckSquare },
  { href: '/reviews', label: '复盘', icon: ClipboardList },
  { href: '/settings', label: '设置', icon: Settings },
]

export const secondaryNavItems: NavItem[] = [
  { href: '/inbox', label: '收集箱', icon: Inbox },
]
