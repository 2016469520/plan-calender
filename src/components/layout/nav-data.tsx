import {
  Calendar,
  Sun,
  CheckSquare,
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
  { href: '/calendar', label: '日历', icon: Calendar },
  { href: '/today', label: '今日', icon: Sun },
  { href: '/habits', label: '打卡', icon: CheckSquare },
  { href: '/insights', label: '统计', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

export const secondaryNavItems: NavItem[] = [
  { href: '/inbox', label: '收集箱', icon: Inbox },
]
