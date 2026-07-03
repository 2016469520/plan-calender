'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NumberWheel } from '@/components/ui/number-wheel'
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
import { CheckCircle2, Circle, Flame, Target, Pencil, Trash2, Plus, Loader2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface HabitCheckinProps {
  compact?: boolean
}

// Quick shortcuts for different measurement types
const MINUTE_SHORTCUTS = [5, 10, 15, 30]
const HOUR_SHORTCUTS = [0.5, 1, 2]
const COUNT_SHORTCUTS = [1]

/**
 * Hook: debounced auto-save for NumberWheel adjustments.
 * Fires `onSave(value)` after `delay` ms of inactivity.
 */
function useDebouncedSave(
  onSave: (value: number) => Promise<void>,
  delay = 400
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<number | null>(null)
  const savingRef = useRef(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const debouncedSave = useCallback(
    (value: number) => {
      pendingRef.current = value
      if (timerRef.current) clearTimeout(timerRef.current)
      setSaveState('idle')
      timerRef.current = setTimeout(async () => {
        if (pendingRef.current == null || savingRef.current) return
        savingRef.current = true
        setSaveState('saving')
        try {
          await onSave(pendingRef.current)
          setSaveState('saved')
          // Reset to idle after 1.5s
          setTimeout(() => setSaveState('idle'), 1500)
        } catch {
          setSaveState('error')
        } finally {
          savingRef.current = false
        }
      }, delay)
    },
    [onSave, delay]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { debouncedSave, saveState }
}

export function HabitCheckin({ compact = false }: HabitCheckinProps) {
  const { user } = useAuth()
  const { habits, habitLogs } = useRepos()
  const queryClient = useQueryClient()
  const today = todayStr()

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

  // ---- Save value (used by NumberWheel auto-save) ----
  const saveValueForHabit = useCallback(
    async (habit: Habit, val: number) => {
      if (!user) return
      const sane = Math.max(0, val)
      try {
        const existing = getLogForHabit(habit.id)
        const isCompleted = sane >= habit.target_value
        if (existing) {
          await habitLogs.update(user.id, existing.id, { value: sane, is_completed: isCompleted })
        } else {
          await habitLogs.create(user.id, {
            habit_id: habit.id,
            log_date: today,
            value: sane,
            is_completed: isCompleted,
          })
        }
        invalidateLogs()
      } catch {
        toast.error('保存失败')
        throw new Error('Save failed')
      }
    },
    [user, habitLogs, today, getLogForHabit]
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
            <HabitCard
              key={habit.id}
              habit={habit}
              log={log}
              isChecked={isChecked}
              currentValue={currentValue}
              effectiveType={effectiveType}
              compact={compact}
              savingIds={savingIds}
              onToggleBoolean={toggleBoolean}
              onSaveValue={(val) => saveValueForHabit(habit, val)}
              onEditLog={handleEditLog}
              onDeleteLog={setDeleteLog}
            />
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
            <NumberWheel
              value={parseFloat(editValue) || 0}
              onChange={(v) => setEditValue(String(v))}
              min={0}
              step={0.5}
              unit={
                editLog
                  ? habitList.find((h) => h.id === editLog.habit_id)?.unit || ''
                  : ''
              }
              showAdjacent={false}
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

// ---- Per-habit card with auto-save NumberWheel ----

interface HabitCardProps {
  habit: Habit
  log: HabitLog | undefined
  isChecked: boolean
  currentValue: number
  effectiveType: MeasurementType
  compact: boolean
  savingIds: Set<string>
  onToggleBoolean: (habit: Habit) => void
  onSaveValue: (value: number) => Promise<void>
  onEditLog: (log: HabitLog) => void
  onDeleteLog: (log: HabitLog) => void
}

function HabitCard({
  habit,
  log,
  isChecked,
  currentValue,
  effectiveType,
  compact,
  savingIds,
  onToggleBoolean,
  onSaveValue,
  onEditLog,
  onDeleteLog,
}: HabitCardProps) {
  const isSaving = savingIds.has(habit.id)
  const { debouncedSave, saveState } = useDebouncedSave(onSaveValue, 400)

  const handleWheelChange = useCallback(
    (val: number) => {
      debouncedSave(val)
    },
    [debouncedSave]
  )

  const handleQuickAdd = useCallback(
    async (delta: number) => {
      const newValue = currentValue + delta
      try {
        await onSaveValue(Math.max(0, newValue))
        toast.success(`已记录 ${newValue}`)
      } catch {
        // Error already toasted in parent
      }
    },
    [currentValue, onSaveValue]
  )

  return (
    <Card
      className={cn(
        'transition-all',
        isChecked && 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10'
      )}
    >
      <CardContent className={cn('flex items-center gap-2', compact ? 'py-2' : 'py-3')}>
        {/* Icon */}
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: (habit.color || '#3b82f6') + '15',
            color: habit.color || '#3b82f6',
          }}
        >
          <Flame className="h-4 w-4" />
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
        <div className="flex items-center gap-2 shrink-0">
          {effectiveType === 'boolean' ? (
            <Button
              variant={isChecked ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'shrink-0',
                isChecked && 'bg-emerald-500 hover:bg-emerald-600 text-white'
              )}
              onClick={() => onToggleBoolean(habit)}
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
          ) : (
            <>
              {/* Quick add buttons */}
              <QuickAddButtons
                effectiveType={effectiveType}
                habit={habit}
                onQuickAdd={handleQuickAdd}
              />

              {/* NumberWheel with auto-save */}
              <NumberWheel
                value={currentValue}
                onChange={handleWheelChange}
                min={0}
                step={getStep(effectiveType, habit)}
                unit={getUnit(effectiveType, habit)}
                compactButtons={effectiveType === 'count'}
                showAdjacent={effectiveType !== 'count'}
                size="sm"
              />

              {/* Save state indicator */}
              <SaveStateIndicator state={saveState} />
            </>
          )}

          {/* Fixed-width operation area — always present, no layout shift */}
          <div className="flex items-center w-10 shrink-0 justify-end">
            {log && (
              <>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => onEditLog(log)}
                  aria-label="编辑打卡记录"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => onDeleteLog(log)}
                  aria-label="删除打卡记录"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ---- Quick add buttons ----

function QuickAddButtons({
  effectiveType,
  habit,
  onQuickAdd,
}: {
  effectiveType: MeasurementType
  habit: Habit
  onQuickAdd: (delta: number) => void
}) {
  let shortcuts: number[] = []

  switch (effectiveType) {
    case 'minutes':
      shortcuts = MINUTE_SHORTCUTS
      break
    case 'hours':
      shortcuts = HOUR_SHORTCUTS
      break
    case 'count':
      shortcuts = COUNT_SHORTCUTS
      break
    default:
      shortcuts = []
  }

  if (shortcuts.length === 0) return null

  return (
    <div className="flex items-center gap-1">
      {shortcuts.map((delta) => (
        <Button
          key={delta}
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs font-medium"
          onClick={() => onQuickAdd(delta)}
        >
          +{Number.isInteger(delta) ? delta : delta.toFixed(1)}
        </Button>
      ))}
    </div>
  )
}

// ---- Save state indicator ----

function SaveStateIndicator({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (state === 'idle') return null
  return (
    <span className="shrink-0 w-5 flex items-center justify-center">
      {state === 'saving' && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {state === 'saved' && (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      )}
      {state === 'error' && (
        <X className="h-3.5 w-3.5 text-destructive" />
      )}
    </span>
  )
}

// ---- Helpers ----

function getStep(effectiveType: MeasurementType, habit: Habit): number {
  switch (effectiveType) {
    case 'minutes':
      return 5
    case 'hours':
      return 0.5
    case 'count':
      return 1
    case 'numeric':
      if (habit.unit === '小时' || habit.unit === 'h') return 0.5
      if (habit.target_value <= 10) return 1
      if (habit.target_value <= 100) return 5
      return 10
    default:
      return 1
  }
}

function getUnit(effectiveType: MeasurementType, habit: Habit): string | undefined {
  switch (effectiveType) {
    case 'minutes':
      return '分钟'
    case 'hours':
      return '小时'
    case 'count':
      return '次'
    case 'numeric':
      return habit.unit || undefined
    default:
      return undefined
  }
}
