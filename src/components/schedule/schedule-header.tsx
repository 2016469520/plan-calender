'use client'

import { useMemo } from 'react'
import { format, formatWeekday } from '@/lib/utils/date'
import type { Task } from '@/types'
import { Sun, Moon, Sunrise, AlertCircle, Clock } from 'lucide-react'

function getGreeting(): { text: string; icon: typeof Sun } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: '早上好', icon: Sunrise }
  if (hour < 18) return { text: '下午好', icon: Sun }
  return { text: '晚上好', icon: Moon }
}

interface ScheduleHeaderProps {
  today: string
  tasks: Task[]
}

export function ScheduleHeader({ today, tasks }: ScheduleHeaderProps) {
  const greeting = useMemo(() => getGreeting(), [])

  const stats = useMemo(() => {
    const active = tasks.filter((t) => t.status !== 'cancelled')
    const done = active.filter((t) => t.status === 'done').length
    const total = active.length
    const overdue = active.filter(
      (t) => t.task_date < today && t.status !== 'done'
    ).length
    // Next upcoming task (closest time today)
    const upcoming = active
      .filter((t) => t.status !== 'done' && t.task_date === today && t.start_time)
      .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))[0]

    return { done, total, overdue, upcoming, rate: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [tasks, today])

  const remaining = stats.total - stats.done

  return (
    <div className="px-4 pt-4 pb-3 border-b bg-gradient-to-b from-muted/30 to-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <greeting.icon className="h-5 w-5 text-primary/70" />
          <h2 className="text-lg font-semibold">{greeting.text}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), 'yyyy年M月d日')} {formatWeekday(today)}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
          {stats.total > 0 ? (
            <>
              <span className="text-muted-foreground">
                已完成{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {stats.done}
                </span>
                {' / '}
                <span className="font-semibold tabular-nums">{stats.total}</span>
              </span>

              {/* Mini progress ring */}
              <div className="flex items-center gap-2">
                <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    className="stroke-emerald-500"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${stats.rate * 0.88} 88`}
                  />
                </svg>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {stats.rate}%
                </span>
              </div>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">今天还没有计划</span>
          )}

          {stats.overdue > 0 && (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              {stats.overdue} 项延期
            </span>
          )}

          {stats.upcoming && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              最近 {stats.upcoming.start_time} {stats.upcoming.title}
            </span>
          )}
        </div>

        {/* Status line */}
        {stats.total > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {remaining > 0
              ? `还有 ${remaining} 项计划需要处理`
              : '今天的计划全部完成了 🎉'}
          </p>
        )}
      </div>
    </div>
  )
}
