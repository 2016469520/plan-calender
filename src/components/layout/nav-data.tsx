import {
  Calendar,
  ListTodo,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Settings,
  Inbox,
  Timer,
  FileText,
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
  { href: '/focus', label: '专注', icon: Timer },
  { href: '/habits', label: '习惯', icon: CheckSquare },
  { href: '/reviews/today', label: '每日总结', icon: FileText },
  { href: '/reviews', label: '复盘', icon: ClipboardList },
  { href: '/insights', label: '统计', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

// Mobile bottom nav: top 5 main items
export const mobileNavItems: NavItem[] = [
  { href: '/schedule', label: '日程', icon: ListTodo },
  { href: '/calendar', label: '日历', icon: Calendar },
  { href: '/focus', label: '专注', icon: Timer },
  { href: '/habits', label: '习惯', icon: CheckSquare },
  { href: '/settings', label: '设置', icon: Settings },
]

export const secondaryNavItems: NavItem[] = [
  { href: '/inbox', label: '收集箱', icon: Inbox },
]
