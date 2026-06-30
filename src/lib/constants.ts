import type { Tag, Period } from '@/types'

// ---------- App branding ----------

export const APP_NAME = '我的计划日历'
export const APP_SHORT_NAME = '计划日历'
export const APP_DESCRIPTION = '个人计划管理系统 — 月/周/日视图，上午/下午/晚上三时段规划'

// ---------- Default tags ----------

export const DEFAULT_TAGS: Omit<Tag, 'user_id' | 'created_at' | 'updated_at'>[] = [
  { id: 'tag-learning', name: '学习', color: '#3b82f6', icon: 'BookOpen', is_default: true, is_visible: true, sort_order: 0 },
  { id: 'tag-research', name: '科研', color: '#8b5cf6', icon: 'FlaskConical', is_default: true, is_visible: true, sort_order: 1 },
  { id: 'tag-work', name: '工作', color: '#f59e0b', icon: 'Briefcase', is_default: true, is_visible: true, sort_order: 2 },
  { id: 'tag-exercise', name: '运动', color: '#10b981', icon: 'Dumbbell', is_default: true, is_visible: true, sort_order: 3 },
  { id: 'tag-life', name: '生活', color: '#ec4899', icon: 'Heart', is_default: true, is_visible: true, sort_order: 4 },
  { id: 'tag-rest', name: '休息', color: '#6b7280', icon: 'Moon', is_default: true, is_visible: true, sort_order: 5 },
  { id: 'tag-social', name: '社交', color: '#06b6d4', icon: 'Users', is_default: true, is_visible: true, sort_order: 6 },
  { id: 'tag-other', name: '其他', color: '#94a3b8', icon: 'Ellipsis', is_default: true, is_visible: true, sort_order: 7 },
]

// ---------- Period labels ----------

export const PERIOD_LABELS: Record<Period, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上',
}

export const PERIOD_ORDER: Period[] = ['morning', 'afternoon', 'evening']

// ---------- Priority ----------

export const PRIORITY_LABELS = {
  low: '低',
  normal: '普通',
  high: '高',
  urgent: '紧急',
} as const

export const PRIORITY_COLORS = {
  low: 'text-slate-500',
  normal: 'text-blue-600 dark:text-blue-400',
  high: 'text-orange-600 dark:text-orange-400',
  urgent: 'text-red-600 dark:text-red-400',
} as const

// ---------- Status ----------

export const STATUS_LABELS = {
  todo: '未开始',
  in_progress: '进行中',
  done: '已完成',
  cancelled: '已取消',
} as const

// ---------- Navigation ----------

export const NAV_ITEMS = [
  { href: '/calendar', label: '日历', icon: 'Calendar' },
  { href: '/today', label: '今日', icon: 'Sun' },
  { href: '/habits', label: '打卡', icon: 'CheckSquare' },
  { href: '/insights', label: '统计', icon: 'BarChart3' },
  { href: '/settings', label: '设置', icon: 'Settings' },
] as const

// ---------- Keyboard shortcuts ----------

export const KEYBOARD_SHORTCUTS = {
  newTask: 'n',
  today: 't',
  monthView: 'm',
  weekView: 'w',
  dayView: 'd',
  search: '/',
  close: 'Escape',
} as const

// ---------- IndexedDB ----------

export const DB_NAME = 'my-plan-calendar-db'
export const DB_VERSION = 1

// ---------- Local storage keys ----------

export const STORAGE_KEYS = {
  lastView: 'plan-calendar-last-view',
  lastDate: 'plan-calendar-last-date',
  userPreferences: 'plan-calendar-preferences',
  draftReview: 'plan-calendar-draft-review',
} as const
