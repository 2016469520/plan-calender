'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { getMonthRange, format, parseISO, isToday, isSameMonth } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import type { CalendarView, Task } from '@/types'
import { ChevronRight } from 'lucide-react'

interface MonthViewProps {
  currentDate: string
  onDateClick: (date: string) => void
  onViewChange: (view: CalendarView) => void
}

function getCalendarDays(year: number, month: number, weekStartsOn: 0 | 1 | 6 = 0) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const start = new Date(firstDay)
  const dayOfWeek = start.getDay()
  const diff = (dayOfWeek - weekStartsOn + 7) % 7
  start.setDate(start.getDate() - diff)

  const end = new Date(lastDay)
  const endDiff = (7 - end.getDay() + weekStartsOn - 1) % 7
  end.setDate(end.getDate() + endDiff)

  const days: Date[] = []
  const current = new Date(start)
  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

export function MonthView({ currentDate, onDateClick, onViewChange }: MonthViewProps) {
  const { user } = useAuth()
  const { tasks } = useRepos()

  const range = useMemo(() => {
    const d = parseISO(currentDate)
    return getMonthRange(d)
  }, [currentDate])

  const { data: monthTasks = [], isLoading } = useQuery({
    queryKey: ['tasks', 'month', range.start, range.end],
    queryFn: () => tasks.getByDateRange(user!.id, range),
    enabled: !!user,
  })

  const dateObj = parseISO(currentDate)
  const days = useMemo(
    () => getCalendarDays(dateObj.getFullYear(), dateObj.getMonth()),
    [dateObj]
  )

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const task of monthTasks) {
      if (!map[task.task_date]) map[task.task_date] = []
      map[task.task_date].push(task)
    }
    return map
  }, [monthTasks])

  if (isLoading) {
    return (
      <div className="grid grid-cols-7 auto-rows-fr gap-px bg-border">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="bg-background p-1 min-h-[80px] animate-pulse">
            <div className="h-4 w-4 bg-muted rounded mb-1" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 auto-rows-fr flex-1">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDate[dateStr] || []
          const doneCount = dayTasks.filter((t) => t.status === 'done').length
          const isCurrentMonth = isSameMonth(day, dateObj)
          const today = isToday(day)

          return (
            <button
              key={dateStr}
              onClick={() => {
                onDateClick(dateStr)
                onViewChange('day')
              }}
              className={cn(
                'relative flex flex-col border-b border-r p-1 text-left min-h-[80px]',
                'hover:bg-accent/50 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary',
                !isCurrentMonth && 'opacity-40',
                today && 'bg-primary/5'
              )}
            >
              {/* Date number */}
              <span
                className={cn(
                  'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-0.5',
                  today && 'bg-primary text-primary-foreground'
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Task indicators */}
              <div className="flex-1 space-y-0.5 overflow-hidden">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'text-[10px] leading-tight truncate px-1 py-0.5 rounded',
                      task.status === 'done' ? 'line-through text-muted-foreground/50' : '',
                      task.priority === 'urgent' && !(task.status === 'done')
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : 'bg-muted/50'
                    )}
                    style={{
                      borderLeft: task.tag?.color ? `3px solid ${task.tag.color}` : undefined,
                    }}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-muted-foreground px-1 flex items-center gap-0.5">
                    <ChevronRight className="h-2.5 w-2.5" />
                    还有 {dayTasks.length - 3} 项
                  </div>
                )}
              </div>

              {/* Bottom stats */}
              {dayTasks.length > 0 && (
                <div className="flex items-center gap-1 mt-auto pt-0.5">
                  <span className={cn(
                    'text-[9px]',
                    doneCount === dayTasks.length && dayTasks.length > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                  )}>
                    {doneCount}/{dayTasks.length}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
