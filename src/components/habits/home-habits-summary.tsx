'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { todayStr } from '@/lib/utils/date'
import type { Habit, HabitLog } from '@/types'
import { CheckSquare, ChevronRight, Plus, Minus, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function HomeHabitsSummary() {
  const { user } = useAuth()
  const { habits: habitRepo, habitLogs: logRepo } = useRepos()
  const queryClient = useQueryClient()
  const [collapsed, setCollapsed] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())

  const today = todayStr()

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => habitRepo.getAll(user!.id),
    enabled: !!user,
  })

  const { data: todayLogs = [] } = useQuery({
    queryKey: ['habitLogs', today],
    queryFn: () => logRepo.getByDate(user!.id, today),
    enabled: !!user,
  })

  const activeHabits = habits.filter((h) => !h.archived_at)

  const getLog = (habitId: string): HabitLog | undefined =>
    todayLogs.find((l) => l.habit_id === habitId)

  const handleToggle = useCallback(
    async (habit: Habit) => {
      if (!user || togglingIds.has(habit.id)) return
      setTogglingIds((prev) => new Set(prev).add(habit.id))

      try {
        const existing = getLog(habit.id)
        if (habit.measurement_type === 'boolean') {
          if (existing?.is_completed) {
            await logRepo.update(user.id, existing.id, { is_completed: false, value: 0 })
          } else {
            await logRepo.create(user.id, {
              habit_id: habit.id,
              log_date: today,
              value: habit.target_value,
              is_completed: true,
            })
          }
        }
        queryClient.invalidateQueries({ queryKey: ['habitLogs', today] })
        queryClient.invalidateQueries({ queryKey: ['habits'] })
      } catch {
        toast.error('打卡失败')
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev)
          next.delete(habit.id)
          return next
        })
      }
    },
    [user, logRepo, togglingIds, today, getLog, queryClient]
  )

  const handleAdjustValue = useCallback(
    async (habit: Habit, delta: number) => {
      if (!user) return
      try {
        const existing = getLog(habit.id)
        if (existing) {
          const newValue = Math.max(0, existing.value + delta)
          const isCompleted = newValue >= habit.target_value
          await logRepo.update(user.id, existing.id, { value: newValue, is_completed: isCompleted })
        } else {
          const value = Math.max(0, delta > 0 ? delta : 0)
          await logRepo.create(user.id, {
            habit_id: habit.id,
            log_date: today,
            value,
            is_completed: value >= habit.target_value,
          })
        }
        queryClient.invalidateQueries({ queryKey: ['habitLogs', today] })
      } catch {
        toast.error('记录失败')
      }
    },
    [user, logRepo, today, getLog, queryClient]
  )

  if (activeHabits.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">今日习惯</span>
            <Link href="/habits">
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                添加
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground text-center py-2">
            暂无习惯，去添加吧
          </p>
        </CardContent>
      </Card>
    )
  }

  const completedCount = activeHabits.filter((h) => {
    const log = getLog(h.id)
    return log?.is_completed
  }).length

  return (
    <Card className="shadow-none">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <CheckSquare className="h-3 w-3" />
            今日习惯
            {completedCount > 0 && (
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1 rounded">
                {completedCount}/{activeHabits.length}
              </span>
            )}
          </button>
          <div className="flex items-center gap-1">
            <Link href="/habits">
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                全部
              </Button>
            </Link>
            <ChevronRight className={cn('h-3 w-3 text-muted-foreground transition-transform', !collapsed && 'rotate-90')} />
          </div>
        </div>

        {!collapsed && (
          <div className="space-y-1">
            {activeHabits.map((habit) => {
              const log = getLog(habit.id)
              const isDone = log?.is_completed

              return (
                <div
                  key={habit.id}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors',
                    isDone && 'opacity-60'
                  )}
                >
                  {/* Color dot */}
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color || '#3b82f6' }}
                  />

                  {/* Name & progress */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{habit.name}</div>
                    {habit.measurement_type !== 'boolean' && (
                      <div className="text-[10px] text-muted-foreground">
                        {log?.value ?? 0}/{habit.target_value}{habit.unit || ''}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {habit.measurement_type === 'boolean' ? (
                    <button
                      onClick={() => handleToggle(habit)}
                      disabled={togglingIds.has(habit.id)}
                      className={cn(
                        'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-muted-foreground/30 hover:border-emerald-400'
                      )}
                    >
                      {togglingIds.has(habit.id) ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isDone ? (
                        <Check className="h-3 w-3" />
                      ) : null}
                    </button>
                  ) : (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleAdjustValue(habit, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs tabular-nums w-6 text-center">
                        {log?.value ?? 0}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleAdjustValue(habit, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
