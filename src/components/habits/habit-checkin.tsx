'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import { CheckCircle2, Circle, Flame, Target, Pencil, Trash2, Plus, Minus, Loader2, Check, X } from 'lucide-react'
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

  const [editLog, setEditLog] = useState<HabitLog | null>(null)
  const [deleteLog, setDeleteLog] = useState<HabitLog | null>(null)
  const [editValue, setEditValue] = useState('')
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
  // Per-habit save state: idle | saving | saved | error
  const [saveStates, setSaveStates] = useState<Record<string, 'idle' | 'saving' | 'saved' | 'error'>>({})
  // Per-habit input values (for direct text entry)
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  // Debounce timers
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  // Wheel throttle
  const wheelThrottle = useRef<Record<string, number>>({})

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

  // ---- Core save function ----
  const saveValue = useCallback(
    async (habitId: string, value: number, targetValue: number) => {
      if (!user) return
      const sane = Math.max(0, value)
      const existing = getLogForHabit(habitId)
      const isCompleted = sane >= targetValue
      try {
        if (existing) {
          await habitLogs.update(user.id, existing.id, { value: sane, is_completed: isCompleted })
        } else {
          await habitLogs.create(user.id, {
            habit_id: habitId,
            log_date: today,
            value: sane,
            is_completed: isCompleted,
          })
        }
        invalidateLogs()
        return true
      } catch {
        throw new Error('Save failed')
      }
    },
    [user, habitLogs, today, getLogForHabit]
  )

  // ---- Debounced auto-save ----
  const debouncedSave = useCallback(
    (habitId: string, value: number, targetValue: number) => {
      // Clear existing timer
      if (debounceTimers.current[habitId]) {
        clearTimeout(debounceTimers.current[habitId])
      }
      // Set saving state
      setSaveStates((prev) => ({ ...prev, [habitId]: 'saving' }))
      // Debounce
      debounceTimers.current[habitId] = setTimeout(async () => {
        try {
          await saveValue(habitId, value, targetValue)
          setSaveStates((prev) => ({ ...prev, [habitId]: 'saved' }))
          // Clear saved state after 1.5s
          setTimeout(() => {
            setSaveStates((prev) => {
              const next = { ...prev }
              if (next[habitId] === 'saved') next[habitId] = 'idle'
              return next
            })
          }, 1500)
        } catch {
          setSaveStates((prev) => ({ ...prev, [habitId]: 'error' }))
        }
      }, 400)
    },
    [saveValue]
  )

  // ---- Immediate adjust (for +/- button clicks) ----
  const adjustValue = useCallback(
    async (habit: Habit, delta: number) => {
      if (!user) return
      const existing = getLogForHabit(habit.id)
      const newValue = Math.max(0, (existing?.value ?? 0) + delta)
      setSaveStates((prev) => ({ ...prev, [habit.id]: 'saving' }))
      try {
        await saveValue(habit.id, newValue, habit.target_value)
        setSaveStates((prev) => ({ ...prev, [habit.id]: 'saved' }))
        setTimeout(() => {
          setSaveStates((prev) => {
            const next = { ...prev }
            if (next[habit.id] === 'saved') next[habit.id] = 'idle'
            return next
          })
        }, 1500)
      } catch {
        setSaveStates((prev) => ({ ...prev, [habit.id]: 'error' }))
        toast.error('记录失败')
      }
    },
    [user, saveValue, getLogForHabit]
  )

  // ---- Wheel handler (1 minute per notch) ----
  const createWheelHandler = useCallback(
    (habit: Habit) => (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      const last = wheelThrottle.current[habit.id] || 0
      // Throttle to ~80ms between adjustments to handle trackpad bursts
      if (now - last < 80) return
      wheelThrottle.current[habit.id] = now

      const existing = getLogForHabit(habit.id)
      const currentValue = existing?.value ?? 0
      const delta = e.deltaY < 0 ? 1 : e.deltaY > 0 ? -1 : 0
      if (delta === 0) return
      const newValue = Math.max(0, currentValue + delta)
      debouncedSave(habit.id, newValue, habit.target_value)
    },
    [debouncedSave, getLogForHabit]
  )

  // ---- Direct input save ----
  const handleInputSave = useCallback(
    async (habit: Habit) => {
      if (!user) return
      const key = `${habit.id}-${today}`
      const raw = inputValues[key]
      if (raw === undefined || raw === '') return
      const val = parseFloat(raw)
      if (isNaN(val) || val < 0) {
        toast.error('请输入有效数值')
        return
      }
      setSaveStates((prev) => ({ ...prev, [habit.id]: 'saving' }))
      try {
        await saveValue(habit.id, val, habit.target_value)
        setSaveStates((prev) => ({ ...prev, [habit.id]: 'saved' }))
        setInputValues((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
        setTimeout(() => {
          setSaveStates((prev) => {
            const next = { ...prev }
            if (next[habit.id] === 'saved') next[habit.id] = 'idle'
            return next
          })
        }, 1500)
      } catch {
        setSaveStates((prev) => ({ ...prev, [habit.id]: 'error' }))
        toast.error('保存失败')
      }
    },
    [user, saveValue, inputValues, today]
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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [])

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
          const habitKey = `${habit.id}-${today}`
          const inputVal = inputValues[habitKey]
          const saveState = saveStates[habit.id] || 'idle'
          const isSaving = savingIds.has(habit.id)

          return (
            <Card
              key={habit.id}
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

                {/* Actions */}
                {effectiveType === 'boolean' ? (
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
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    {/* === Stable time/value control row === */}
                    <MinuteControl
                      habit={habit}
                      inputVal={inputVal}
                      currentValue={currentValue}
                      effectiveType={effectiveType}
                      onInputChange={(v) => setInputValues((prev) => ({ ...prev, [habitKey]: v }))}
                      onInputSave={() => handleInputSave(habit)}
                      onAdjust={(delta) => adjustValue(habit, delta)}
                      onWheel={createWheelHandler(habit)}
                      onDebouncedChange={(v) => debouncedSave(habit.id, v, habit.target_value)}
                    />

                    {/* === Fixed save-state slot (always present) === */}
                    <SaveStateSlot state={saveState} />

                    {/* === Fixed operation area (always reserved) === */}
                    <div className="flex items-center w-12 shrink-0 justify-end">
                      {log && (
                        <>
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => handleEditLog(log)}
                            aria-label="编辑打卡记录"
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => setDeleteLog(log)}
                            aria-label="删除打卡记录"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
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
              type="text"
              inputMode="decimal"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="输入数值"
              autoFocus
              className="w-full"
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

// ============================================================
// Sub-components
// ============================================================

/** Fixed-width save state indicator — never changes layout */
function SaveStateSlot({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' }) {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 shrink-0">
      {state === 'saving' && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      {state === 'saved' && <Check className="h-4 w-4 text-emerald-500" />}
      {state === 'error' && <X className="h-4 w-4 text-destructive" />}
    </span>
  )
}

/** Stable minute/value control with wheel support */
function MinuteControl({
  habit,
  inputVal,
  currentValue,
  effectiveType,
  onInputChange,
  onInputSave,
  onAdjust,
  onWheel,
  onDebouncedChange,
}: {
  habit: Habit
  inputVal: string | undefined
  currentValue: number
  effectiveType: string
  onInputChange: (v: string) => void
  onInputSave: () => void
  onAdjust: (delta: number) => void
  onWheel: (e: WheelEvent) => void
  onDebouncedChange: (v: number) => void
}) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')

  // Attach wheel listener
  useEffect(() => {
    const el = wheelRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const step = getStepForType(effectiveType, habit)
  const unit = getUnitForType(effectiveType, habit)

  const commitEdit = () => {
    const val = parseFloat(editText)
    if (!isNaN(val) && val >= 0) {
      onDebouncedChange(val)
    }
    setIsEditing(false)
    setEditText('')
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditText('')
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      {/* - button */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onAdjust(-step)}
        disabled={currentValue <= 0}
        aria-label={`减少 ${step}`}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

      {/* Value display / input (wheel-aware) */}
      <div ref={wheelRef} className="relative shrink-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            className="h-8 w-14 rounded-lg border-2 border-ring bg-background text-center text-sm font-medium tabular-nums outline-none"
            aria-label="输入数值"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditing(true)
              setEditText(inputVal !== undefined ? inputVal : String(currentValue))
            }}
            className="h-8 w-14 rounded-lg border border-input bg-background text-center text-sm font-medium tabular-nums hover:bg-muted/50 transition-colors cursor-text"
            aria-label={`当前值 ${inputVal !== undefined ? inputVal : currentValue}，点击编辑`}
          >
            {inputVal !== undefined ? inputVal : currentValue}
          </button>
        )}
      </div>

      {/* + button */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onAdjust(step)}
        aria-label={`增加 ${step}`}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>

      {/* Unit label */}
      {unit && (
        <span className="text-xs text-muted-foreground shrink-0 select-none">
          {unit}
        </span>
      )}
    </div>
  )
}

// ---- Helpers ----

function getStepForType(effectiveType: string, habit: Habit): number {
  switch (effectiveType) {
    case 'minutes':
      return 1
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

function getUnitForType(effectiveType: string, habit: Habit): string | undefined {
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
