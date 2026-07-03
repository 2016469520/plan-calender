'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { todayStr } from '@/lib/utils/date'
import type { Habit, HabitLog, MeasurementType } from '@/types'
import { CheckCircle2, Circle, Flame, Target, Pencil, Trash2, Plus, Minus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface HabitCheckinProps {
  compact?: boolean
}

// Quick minute shortcuts for duration/minutes type habits
const MINUTE_SHORTCUTS = [5, 10, 15, 30, 45, 60]

export function HabitCheckin({ compact = false }: HabitCheckinProps) {
  const { user } = useAuth()
  const { habits, habitLogs } = useRepos()
  const queryClient = useQueryClient()
  const today = todayStr()

  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [editLog, setEditLog] = useState<HabitLog | null>(null)
  const [deleteLog, setDeleteLog] = useState<HabitLog | null>(null)
  const [editValue, setEditValue] = useState('')
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())

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

  const invalidateLogs = () => {
    queryClient.invalidateQueries({ queryKey: ['habitLogs'] })
    queryClient.invalidateQueries({ queryKey: ['habits'] })
  }

  const getLogForHabit = (habitId: string) =>
    todayLogs.find((l) => l.habit_id === habitId)

  const getInputKey = (habit: Habit) => `${habit.id}-${today}`

  // ---- Boolean toggle ----
  const toggleBoolean = useCallback(
    async (habit: Habit) => {
      if (!user || savingIds.has(habit.id)) return
      setSavingIds((prev) => new Set(prev).add(habit.id))
      try {
        const existing = getLogForHabit(habit.id)
        if (existing?.is_completed) {
          await habitLogs.update(user.id, existing.id, { is_completed: false, value: 0 })
        } else if (existing) {
          await habitLogs.update(user.id, existing.id, {
            is_completed: true,
            value: habit.target_value,
          })
        } else {
          await habitLogs.create(user.id, {
            habit_id: habit.id,
            log_date: today,
            value: habit.target_value,
            is_completed: true,
          })
        }
        invalidateLogs()
        toast.success(existing?.is_completed ? '已取消打卡' : '打卡成功')
      } catch {
        toast.error('操作失败')
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev)
          next.delete(habit.id)
          return next
        })
      }
    },
    [user, habitLogs, today, savingIds, getLogForHabit]
  )

  // ---- Adjust count/numeric by delta ----
  const adjustValue = useCallback(
    async (habit: Habit, delta: number) => {
      if (!user) return
      try {
        const existing = getLogForHabit(habit.id)
        if (existing) {
          const newValue = Math.max(0, existing.value + delta)
          const isCompleted = newValue >= habit.target_value
          await habitLogs.update(user.id, existing.id, { value: newValue, is_completed: isCompleted })
        } else {
          const value = Math.max(0, delta > 0 ? delta : 0)
          await habitLogs.create(user.id, {
            habit_id: habit.id,
            log_date: today,
            value,
            is_completed: value >= habit.target_value,
          })
        }
        invalidateLogs()
      } catch {
        toast.error('记录失败')
      }
    },
    [user, habitLogs, today, getLogForHabit]
  )

  // ---- Save direct input value ----
  const saveInputValue = useCallback(
    async (habit: Habit) => {
      if (!user) return
      const key = getInputKey(habit)
      const raw = inputValues[key]
      if (raw === undefined || raw === '') return
      const val = parseFloat(raw)
      if (isNaN(val) || val < 0) {
        toast.error('请输入有效数值')
        return
      }
      setSavingIds((prev) => new Set(prev).add(habit.id))
      try {
        const existing = getLogForHabit(habit.id)
        const isCompleted = val >= habit.target_value
        if (existing) {
          await habitLogs.update(user.id, existing.id, { value: val, is_completed: isCompleted })
        } else {
          await habitLogs.create(user.id, {
            habit_id: habit.id,
            log_date: today,
            value: val,
            is_completed: isCompleted,
          })
        }
        // Clear input after save
        setInputValues((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
        invalidateLogs()
        toast.success('已记录')
      } catch {
        toast.error('记录失败')
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev)
          next.delete(habit.id)
          return next
        })
      }
    },
    [user, habitLogs, today, inputValues, getLogForHabit]
  )

  // ---- Edit log ----
  const handleEditLog = (log: HabitLog) => {
    setEditLog(log)
    setEditValue(String(log.value))
  }

  const saveEditLog = useCallback(async () => {
    if (!user || !editLog) return
    const val = parseFloat(editValue)
    if (isNaN(val) || val < 0) {
      toast.error('请输入有效数值')
      return
    }
    try {
      const habit = habitList.find((h) => h.id === editLog.habit_id)
      const isCompleted = habit ? val >= habit.target_value : editLog.is_completed
      await habitLogs.update(user.id, editLog.id, { value: val, is_completed: isCompleted })
      setEditLog(null)
      invalidateLogs()
      toast.success('已更新')
    } catch {
      toast.error('更新失败')
    }
  }, [user, habitLogs, editLog, editValue, habitList])

  const confirmDeleteLog = useCallback(async () => {
    if (!user || !deleteLog) return
    try {
      await habitLogs.delete(user.id, deleteLog.id)
      setDeleteLog(null)
      invalidateLogs()
      toast.success('已删除')
    } catch {
      toast.error('删除失败')
    }
  }, [user, habitLogs, deleteLog])

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

  const renderHabitActions = (habit: Habit) => {
    const log = getLogForHabit(habit.id)
    const isChecked = log?.is_completed ?? false
    const currentValue = log?.value ?? 0
    const key = getInputKey(habit)
    const inputVal = inputValues[key]
    const isSaving = savingIds.has(habit.id)
    const type = habit.measurement_type as MeasurementType

    // Resolve 'duration' as 'minutes' for UI purposes
    const effectiveType = type === 'duration' ? 'minutes' : type

    switch (effectiveType) {
      // ---- Boolean: toggle check ----
      case 'boolean':
        return (
          <Button
            variant={isChecked ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'shrink-0',
              isChecked && 'bg-emerald-500 hover:bg-emerald-600 text-white'
            )}
            onClick={() => toggleBoolean(habit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isChecked ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            <span className="ml-1 hidden sm:inline">
              {isChecked ? '已完成' : '打卡'}
            </span>
          </Button>
        )

      // ---- Count: +/- 1 and direct input ----
      case 'count':
        return (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              onClick={() => adjustValue(habit, -1)}
              disabled={currentValue <= 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm tabular-nums w-8 text-center font-medium">
              {currentValue}
            </span>
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              onClick={() => adjustValue(habit, 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            {log && (
              <div className="flex items-center ml-1">
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => handleEditLog(log)}
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => setDeleteLog(log)}
                >
                  <Trash2 className="h-3 w-3 text-destructive/60" />
                </Button>
              </div>
            )}
          </div>
        )

      // ---- Minutes / Duration: shortcuts + direct input ----
      case 'minutes':
        return (
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex items-center gap-0.5">
              {MINUTE_SHORTCUTS.slice(0, 4).map((m) => (
                <Button
                  key={m}
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px] px-1.5"
                  onClick={() => adjustValue(habit, m)}
                >
                  +{m}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              <Input
                type="number"
                min={0}
                value={inputVal !== undefined ? inputVal : ''}
                onChange={(e) =>
                  setInputValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveInputValue(habit)
                }}
                placeholder={String(currentValue)}
                className="h-7 w-16 text-xs text-center"
              />
              <span className="text-[10px] text-muted-foreground">分钟</span>
              {inputVal !== undefined && inputVal !== '' && (
                <Button
                  size="sm" className="h-7 text-xs" onClick={() => saveInputValue(habit)}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : '保存'}
                </Button>
              )}
            </div>
            {log && (
              <div className="flex items-center ml-1">
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => handleEditLog(log)}
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => setDeleteLog(log)}
                >
                  <Trash2 className="h-3 w-3 text-destructive/60" />
                </Button>
              </div>
            )}
          </div>
        )

      // ---- Hours: direct input ----
      case 'hours':
        return (
          <div className="flex items-center gap-1 shrink-0">
            <Input
              type="number"
              min={0}
              step={0.5}
              value={inputVal !== undefined ? inputVal : ''}
              onChange={(e) =>
                setInputValues((prev) => ({ ...prev, [key]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveInputValue(habit)
              }}
              placeholder={String(currentValue)}
              className="h-7 w-16 text-xs text-center"
            />
            <span className="text-[10px] text-muted-foreground">小时</span>
            <div className="flex gap-0.5">
              {[0.5, 1, 2].map((h) => (
                <Button
                  key={h}
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px] px-1.5"
                  onClick={() => adjustValue(habit, h)}
                >
                  +{h}
                </Button>
              ))}
            </div>
            {inputVal !== undefined && inputVal !== '' && (
              <Button
                size="sm" className="h-7 text-xs" onClick={() => saveInputValue(habit)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : '保存'}
              </Button>
            )}
            {log && (
              <div className="flex items-center ml-1">
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => handleEditLog(log)}
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => setDeleteLog(log)}
                >
                  <Trash2 className="h-3 w-3 text-destructive/60" />
                </Button>
              </div>
            )}
          </div>
        )

      // ---- Numeric: direct input with unit ----
      case 'numeric':
      default:
        return (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              onClick={() => adjustValue(habit, -getNumericStep(habit))}
              disabled={currentValue <= 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min={0}
              value={inputVal !== undefined ? inputVal : ''}
              onChange={(e) =>
                setInputValues((prev) => ({ ...prev, [key]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveInputValue(habit)
              }}
              placeholder={String(currentValue)}
              className="h-7 w-16 text-xs text-center"
            />
            <span className="text-[10px] text-muted-foreground">{habit.unit || ''}</span>
            <Button
              variant="outline" size="icon" className="h-7 w-7"
              onClick={() => adjustValue(habit, getNumericStep(habit))}
            >
              <Plus className="h-3 w-3" />
            </Button>
            {inputVal !== undefined && inputVal !== '' && (
              <Button
                size="sm" className="h-7 text-xs" onClick={() => saveInputValue(habit)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : '保存'}
              </Button>
            )}
            {log && (
              <div className="flex items-center ml-1">
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => handleEditLog(log)}
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => setDeleteLog(log)}
                >
                  <Trash2 className="h-3 w-3 text-destructive/60" />
                </Button>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <>
      <div className={cn('space-y-2', compact && 'space-y-1')}>
        {activeHabits.map((habit) => {
          const log = getLogForHabit(habit.id)
          const isChecked = log?.is_completed ?? false
          const currentValue = log?.value ?? 0
          const type = habit.measurement_type as MeasurementType
          const effectiveType = type === 'duration' ? 'minutes' : type

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
                      {effectiveType === 'boolean'
                        ? '目标: 完成'
                        : `目标: ${habit.target_value}${habit.unit || (effectiveType === 'minutes' ? '分钟' : effectiveType === 'hours' ? '小时' : '次')}`}
                    </span>
                    {effectiveType !== 'boolean' && (
                      <span className={cn(
                        'ml-1',
                        currentValue >= habit.target_value ? 'text-emerald-500 font-medium' : 'text-muted-foreground'
                      )}>
                        (已完成 {currentValue})
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions per measurement type */}
                {renderHabitActions(habit)}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit log dialog */}
      <Dialog open={!!editLog} onOpenChange={() => setEditLog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>修改打卡记录</DialogTitle>
            <DialogDescription>
              修改 {editLog?.log_date} 的记录值
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input
              type="number"
              min={0}
              step={0.5}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="输入数值"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') saveEditLog() }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLog(null)}>取消</Button>
            <Button onClick={saveEditLog}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete log confirmation */}
      <Dialog open={!!deleteLog} onOpenChange={() => setDeleteLog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>删除打卡记录</DialogTitle>
            <DialogDescription>
              确定要删除 {deleteLog?.log_date} 的打卡记录吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteLog(null)}>取消</Button>
            <Button variant="destructive" onClick={confirmDeleteLog}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/** Get a reasonable step value for numeric habits based on target */
function getNumericStep(habit: Habit): number {
  if (habit.unit === '小时' || habit.unit === 'h') return 0.5
  if (habit.target_value <= 10) return 1
  if (habit.target_value <= 100) return 5
  return 10
}
