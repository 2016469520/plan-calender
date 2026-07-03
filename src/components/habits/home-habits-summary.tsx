'use client'

import { useState, useCallback, useRef } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { NumberWheel } from '@/components/ui/number-wheel'
import { Card, CardContent } from '@/components/ui/card'
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
import { CheckSquare, ChevronRight, Check, Pencil, Trash2, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const MINUTE_SHORTCUTS = [5, 10, 15, 30]
const HOUR_SHORTCUTS = [0.5, 1, 2]

export function HomeHabitsSummary() {
  const { user } = useAuth()
  const { habits: habitRepo, habitLogs: logRepo } = useRepos()
  const queryClient = useQueryClient()
  const [collapsed, setCollapsed] = useState(false)
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const [editLog, setEditLog] = useState<HabitLog | null>(null)
  const [deleteLog, setDeleteLog] = useState<HabitLog | null>(null)
  const [editValue, setEditValue] = useState('')
  // Per-habit save state
  const [saveStates, setSaveStates] = useState<Record<string, 'idle' | 'saving' | 'saved' | 'error'>>({})
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

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

  const invalidateLogs = () => {
    queryClient.invalidateQueries({ queryKey: ['habitLogs', today] })
    queryClient.invalidateQueries({ queryKey: ['habits'] })
  }

  // ---- Boolean toggle ----
  const handleToggle = useCallback(
    async (habit: Habit) => {
      if (!user || togglingIds.has(habit.id)) return
      setTogglingIds((prev) => new Set(prev).add(habit.id))
      try {
        const existing = getLog(habit.id)
        if (existing?.is_completed) {
          await logRepo.update(user.id, existing.id, { is_completed: false, value: 0 })
        } else if (existing) {
          await logRepo.update(user.id, existing.id, { is_completed: true, value: habit.target_value })
        } else {
          await logRepo.create(user.id, {
            habit_id: habit.id,
            log_date: today,
            value: habit.target_value,
            is_completed: true,
          })
        }
        invalidateLogs()
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
    [user, logRepo, togglingIds, today, getLog]
  )

  // ---- Debounced save for wheel adjustments ----
  const handleWheelSave = useCallback(
    async (habit: Habit, value: number) => {
      if (!user) return
      const sane = Math.max(0, value)

      // Clear existing timer
      if (timersRef.current[habit.id]) clearTimeout(timersRef.current[habit.id])

      setSaveStates((prev) => ({ ...prev, [habit.id]: 'idle' }))

      timersRef.current[habit.id] = setTimeout(async () => {
        setSaveStates((prev) => ({ ...prev, [habit.id]: 'saving' }))
        try {
          const existing = getLog(habit.id)
          const isCompleted = sane >= habit.target_value
          if (existing) {
            await logRepo.update(user.id, existing.id, { value: sane, is_completed: isCompleted })
          } else {
            await logRepo.create(user.id, {
              habit_id: habit.id,
              log_date: today,
              value: sane,
              is_completed: isCompleted,
            })
          }
          invalidateLogs()
          setSaveStates((prev) => ({ ...prev, [habit.id]: 'saved' }))
          setTimeout(() => setSaveStates((prev) => ({ ...prev, [habit.id]: 'idle' })), 1500)
        } catch {
          setSaveStates((prev) => ({ ...prev, [habit.id]: 'error' }))
        }
      }, 400)
    },
    [user, logRepo, today, getLog]
  )

  // ---- Quick add (immediate, not debounced) ----
  const handleQuickAdd = useCallback(
    async (habit: Habit, delta: number) => {
      if (!user) return
      const existing = getLog(habit.id)
      const currentValue = existing?.value ?? 0
      const newValue = Math.max(0, currentValue + delta)
      try {
        const isCompleted = newValue >= habit.target_value
        if (existing) {
          await logRepo.update(user.id, existing.id, { value: newValue, is_completed: isCompleted })
        } else {
          await logRepo.create(user.id, {
            habit_id: habit.id,
            log_date: today,
            value: newValue,
            is_completed: isCompleted,
          })
        }
        invalidateLogs()
      } catch {
        toast.error('记录失败')
      }
    },
    [user, logRepo, today, getLog]
  )

  // ---- Edit/Delete log ----
  const handleEditLog = (log: HabitLog) => {
    setEditLog(log)
    setEditValue(String(log.value))
  }

  const saveEditLog = useCallback(async () => {
    if (!user || !editLog) return
    const val = parseFloat(editValue)
    if (isNaN(val) || val < 0) { toast.error('请输入有效数值'); return }
    try {
      const habit = habits.find((h) => h.id === editLog.habit_id)
      const isCompleted = habit ? val >= habit.target_value : editLog.is_completed
      await logRepo.update(user.id, editLog.id, { value: val, is_completed: isCompleted })
      setEditLog(null)
      invalidateLogs()
      toast.success('已更新')
    } catch { toast.error('更新失败') }
  }, [user, logRepo, editLog, editValue, habits])

  const confirmDeleteLog = useCallback(async () => {
    if (!user || !deleteLog) return
    try {
      await logRepo.delete(user.id, deleteLog.id)
      setDeleteLog(null)
      invalidateLogs()
      toast.success('已删除')
    } catch { toast.error('删除失败') }
  }, [user, logRepo, deleteLog])

  if (activeHabits.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">今日习惯</span>
            <Link href="/habits">
              <Button variant="ghost" size="sm" className="h-6 text-xs">添加</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground text-center py-2">暂无习惯，去添加吧</p>
        </CardContent>
      </Card>
    )
  }

  const completedCount = activeHabits.filter((h) => {
    const log = getLog(h.id)
    return log?.is_completed
  }).length

  return (
    <>
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
                <Button variant="ghost" size="sm" className="h-6 text-xs">全部</Button>
              </Link>
              <ChevronRight className={cn('h-3 w-3 text-muted-foreground transition-transform', !collapsed && 'rotate-90')} />
            </div>
          </div>

          {!collapsed && (
            <div className="space-y-1">
              {activeHabits.map((habit) => {
                const log = getLog(habit.id)
                const isDone = log?.is_completed
                const currentValue = log?.value ?? 0
                const type = (habit.measurement_type as MeasurementType)
                const effectiveType = type === 'duration' ? 'minutes' : type

                return (
                  <div
                    key={habit.id}
                    className={cn(
                      'flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors',
                      isDone && 'opacity-60'
                    )}
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: habit.color || '#3b82f6' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{habit.name}</div>
                      {effectiveType !== 'boolean' && (
                        <div className="text-[10px] text-muted-foreground">
                          {log?.value ?? 0}/{habit.target_value}{habit.unit || (effectiveType === 'minutes' ? '分钟' : effectiveType === 'hours' ? '小时' : '')}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {effectiveType === 'boolean' ? (
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
                        <>
                          {/* Quick add buttons */}
                          {effectiveType === 'minutes' && (
                            <div className="flex items-center gap-0.5">
                              {MINUTE_SHORTCUTS.slice(0, 3).map((m) => (
                                <Button
                                  key={m}
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-[10px] px-1.5"
                                  onClick={() => handleQuickAdd(habit, m)}
                                >
                                  +{m}
                                </Button>
                              ))}
                            </div>
                          )}
                          {effectiveType === 'hours' && (
                            <div className="flex items-center gap-0.5">
                              {HOUR_SHORTCUTS.map((h) => (
                                <Button
                                  key={h}
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-[10px] px-1.5"
                                  onClick={() => handleQuickAdd(habit, h)}
                                >
                                  +{Number.isInteger(h) ? h : h.toFixed(1)}
                                </Button>
                              ))}
                            </div>
                          )}

                          {/* NumberWheel with debounced auto-save */}
                          <NumberWheel
                            value={currentValue}
                            onChange={(val) => handleWheelSave(habit, val)}
                            min={0}
                            step={getHomeStep(effectiveType, habit)}
                            unit={getHomeUnit(effectiveType, habit)}
                            compactButtons={effectiveType === 'count'}
                            showAdjacent={false}
                            size="sm"
                          />

                          {/* Save state */}
                          <SaveDot state={saveStates[habit.id] || 'idle'} />
                        </>
                      )}

                      {/* Fixed operation area */}
                      <div className="flex items-center w-9 shrink-0 justify-end">
                        {log && (
                          <>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditLog(log)}>
                              <Pencil className="h-3 w-3 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDeleteLog(log)}>
                              <Trash2 className="h-3 w-3 text-destructive/60" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit log dialog */}
      <Dialog open={!!editLog} onOpenChange={() => setEditLog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>修改打卡记录</DialogTitle>
            <DialogDescription>修改 {editLog?.log_date} 的记录值</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <NumberWheel
              value={parseFloat(editValue) || 0}
              onChange={(v) => setEditValue(String(v))}
              min={0}
              step={0.5}
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

// ---- Helpers ----

function SaveDot({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (state === 'idle') return null
  return (
    <span className="shrink-0 w-3 flex items-center justify-center">
      {state === 'saving' && <Loader2 className="h-2.5 w-2.5 animate-spin text-muted-foreground" />}
      {state === 'saved' && <Check className="h-3 w-3 text-emerald-500" />}
      {state === 'error' && <X className="h-3 w-3 text-destructive" />}
    </span>
  )
}

function getHomeStep(effectiveType: MeasurementType, habit: Habit): number {
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

function getHomeUnit(effectiveType: MeasurementType, habit: Habit): string | undefined {
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
