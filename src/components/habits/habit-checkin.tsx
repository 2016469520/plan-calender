'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { todayStr } from '@/lib/utils/date'
import type { Habit, HabitLog } from '@/types'
import { CheckCircle2, Circle, Flame, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface HabitCheckinProps {
  compact?: boolean
}

export function HabitCheckin({ compact = false }: HabitCheckinProps) {
  const { user } = useAuth()
  const { habits, habitLogs } = useRepos()
  const queryClient = useQueryClient()
  const today = todayStr()

  const { data: habitList = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: () => habits.getAll(user!.id),
    enabled: !!user,
  })

  const { data: todayLogs = [] } = useQuery({
    queryKey: ['habitLogs', today],
    queryFn: () => habitLogs.getByDate(user!.id, today),
    enabled: !!user,
  })

  const checkInMutation = useMutation({
    mutationFn: async ({ habit, log }: { habit: Habit; log?: HabitLog }) => {
      if (log) {
        return habitLogs.update(user!.id, log.id, {
          value: habit.target_value,
          is_completed: !log.is_completed,
        })
      }
      return habitLogs.create(user!.id, {
        habit_id: habit.id,
        log_date: today,
        value: habit.target_value,
        is_completed: true,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitLogs'] })
      toast.success('打卡成功')
    },
    onError: () => {
      toast.error('打卡失败')
    },
  })

  const getLogForHabit = (habitId: string) =>
    todayLogs.find((l) => l.habit_id === habitId)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  const activeHabits = habitList.filter((h) => !h.archived_at)

  if (activeHabits.length === 0 && !compact) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          还没有习惯，去创建第一个吧
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-2', compact && 'space-y-1')}>
      {activeHabits.map((habit) => {
        const log = getLogForHabit(habit.id)
        const isChecked = log?.is_completed ?? false

        return (
          <Card
            key={habit.id}
            className={cn(
              'transition-all',
              isChecked && 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10'
            )}
          >
            <CardContent className={cn('flex items-center gap-3', compact ? 'py-2.5' : 'py-3.5')}>
              {/* Icon */}
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: (habit.color || '#3b82f6') + '15',
                  color: habit.color || '#3b82f6',
                }}
              >
                <Flame className="h-4.5 w-4.5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{habit.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>
                    目标: {habit.target_value}
                    {habit.unit || '次'}
                  </span>
                </div>
              </div>

              {/* Check-in button */}
              <Button
                variant={isChecked ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'shrink-0',
                  isChecked && 'bg-emerald-500 hover:bg-emerald-600 text-white'
                )}
                onClick={() => checkInMutation.mutate({ habit, log })}
                disabled={checkInMutation.isPending}
              >
                {isChecked ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span className="ml-1 hidden sm:inline">
                  {isChecked ? '已完成' : '打卡'}
                </span>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
