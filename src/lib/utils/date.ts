import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameDay,
  isSameMonth,
  isToday,
  isWeekend,
  eachDayOfInterval,
  getISOWeek,
  differenceInDays,
} from 'date-fns'

// ---------- Date helpers ----------

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function formatDate(date: string | Date, fmt = 'yyyy-MM-dd'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatDisplayDate(date: string): string {
  const d = parseISO(date)
  return format(d, 'yyyy年M月d日')
}

export function formatWeekday(date: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = parseISO(date)
  return weekdays[parseInt(format(d, 'i')) % 7]
}

export function parseDateStr(dateStr: string): Date {
  return parseISO(dateStr)
}

// ---------- Calendar range calculations ----------

export function getMonthRange(date: Date | string, weekStartsOn: 0 | 1 | 6 = 0): { start: string; end: string } {
  const d = typeof date === 'string' ? parseISO(date) : date
  const monthStart = startOfMonth(d)
  const monthEnd = endOfMonth(d)
  // Expand to full weeks for display
  const displayStart = startOfWeek(monthStart, { weekStartsOn })
  const displayEnd = endOfWeek(monthEnd, { weekStartsOn })
  return {
    start: format(displayStart, 'yyyy-MM-dd'),
    end: format(displayEnd, 'yyyy-MM-dd'),
  }
}

export function getWeekRange(date: Date | string, weekStartsOn: 0 | 1 | 6 = 0): { start: string; end: string; days: string[] } {
  const d = typeof date === 'string' ? parseISO(date) : date
  const weekStart = startOfWeek(d, { weekStartsOn })
  const weekEnd = endOfWeek(d, { weekStartsOn })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((d) =>
    format(d, 'yyyy-MM-dd')
  )
  return {
    start: format(weekStart, 'yyyy-MM-dd'),
    end: format(weekEnd, 'yyyy-MM-dd'),
    days,
  }
}

// ---------- Navigation ----------

export function navigateDate(date: string, view: 'month' | 'week' | 'day', direction: -1 | 1): string {
  const d = parseISO(date)
  switch (view) {
    case 'month':
      return format(direction > 0 ? addMonths(d, 1) : subMonths(d, 1), 'yyyy-MM-dd')
    case 'week':
      return format(direction > 0 ? addWeeks(d, 1) : subWeeks(d, 1), 'yyyy-MM-dd')
    case 'day':
      return format(direction > 0 ? addDays(d, 1) : subDays(d, 1), 'yyyy-MM-dd')
  }
}

// ---------- Period time ranges (for display) ----------

export const PERIOD_RANGES = {
  morning: { start: '06:00', end: '12:00', label: '上午' },
  afternoon: { start: '12:00', end: '18:00', label: '下午' },
  evening: { start: '18:00', end: '23:59', label: '晚上' },
} as const

// Re-export commonly used functions
export {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  isSameDay,
  isSameMonth,
  isToday,
  isWeekend,
  eachDayOfInterval,
  getISOWeek,
  differenceInDays,
}
