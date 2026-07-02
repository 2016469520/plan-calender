'use client'

import { useMemo } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { DayView } from '@/components/calendar/day-view'
import { DailyReviewForm } from '@/components/reviews/daily-review-form'
import { HabitCheckin } from '@/components/habits/habit-checkin'
import { todayStr, format, formatWeekday } from '@/lib/utils/date'
import { useState } from 'react'
import Link from 'next/link'
import { History, Sun, Moon, Sunrise } from 'lucide-react'

function getGreeting(): { text: string; icon: typeof Sun; period: 'morning' | 'afternoon' | 'evening' } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: '早上好', icon: Sunrise, period: 'morning' }
  if (hour < 18) return { text: '下午好', icon: Sun, period: 'afternoon' }
  return { text: '晚上好', icon: Moon, period: 'evening' }
}

export default function TodayPage() {
  const { user } = useAuth()
  const { tasks: taskRepo } = useRepos()
  const [currentDate] = useState(todayStr())

  const { data: todayTasks = [] } = useQuery({
    queryKey: ['tasks', 'today', currentDate],
    queryFn: () => taskRepo.getByDate(user!.id, currentDate),
    enabled: !!user,
  })

  const greeting = useMemo(() => getGreeting(), [])

  const taskStats = useMemo(() => {
    const total = todayTasks.length
    const done = todayTasks.filter((t) => t.status === 'done').length
    const active = todayTasks.filter((t) => t.status !== 'cancelled').length
    const rate = active > 0 ? Math.round((done / active) * 100) : 0
    return { total: active, done, rate }
  }, [todayTasks])

  // Find the highest priority active task
  const topTask = useMemo(() => {
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
    return todayTasks
      .filter((t) => t.status !== 'done' && t.status !== 'cancelled')
      .sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0))[0]
  }, [todayTasks])

  if (!user) return null

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Welcome section */}
      <div className="px-4 pt-4 pb-3 border-b bg-gradient-to-b from-muted/30 to-transparent">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <greeting.icon className="h-5 w-5 text-primary/70" />
            <h2 className="text-lg font-semibold">{greeting.text}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), 'yyyy年M月d日')} {formatWeekday(currentDate)}
          </p>

          {/* Task summary */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">今日事项</span>
              <span className="font-semibold tabular-nums">{taskStats.total}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">已完成</span>
              <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {taskStats.done}
              </span>
            </div>
            {/* Mini progress bar */}
            {taskStats.total > 0 && (
              <div className="flex items-center gap-1.5 flex-1 max-w-24">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${taskStats.rate}%` }}
                  />
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {taskStats.rate}%
                </span>
              </div>
            )}
          </div>

          {/* Most important task hint */}
          {topTask && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-amber-400" />
              今天最重要：{topTask.title}
            </p>
          )}
        </div>
      </div>

      <DayView currentDate={currentDate} onDateChange={() => {}} />

      <div className="p-4 space-y-6 border-t">
        <div className="max-w-2xl mx-auto space-y-6">
          <HabitCheckin compact />
          <DailyReviewForm date={currentDate} />
          <div className="flex justify-end">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
            >
              <History className="h-3.5 w-3.5" />
              查看历史评价
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
