'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useToday } from '@/hooks/use-today'
import { useCrossWindowSync } from '@/hooks/use-cross-window-sync'
import { format, parseISO, formatWeekday } from '@/lib/utils/date'
import { defaultPeriodByTime } from '@/lib/utils/period'
import { getDesktopBridge } from '@/lib/desktop-bridge'
import { notifyDataChanged } from '@/lib/widget-sync'
import { PERIOD_LABELS } from '@/lib/constants'
import { HomeFocusTimer } from '@/components/focus/focus-timer'
import { WidgetTaskForm, type WidgetTaskDraft } from '@/components/widget/widget-task-form'
import { cn } from '@/lib/utils'
import {
  Check,
  ListTodo,
  Loader2,
  Maximize2,
  Pin,
  PinOff,
  Plus,
  Sparkles,
  X,
} from 'lucide-react'
import type { Period, Task } from '@/types'

const PERIOD_ORDER: Period[] = ['morning', 'afternoon', 'evening']

function MiniProgress({ rate, size = 26 }: { rate: number; size?: number }) {
  const stroke = 3
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <defs>
        <linearGradient id="mini-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-violet-200 dark:text-violet-500/30" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#mini-ring)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - Math.min(1, Math.max(0, rate)))}
        className="transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  )
}

export default function WidgetPage() {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const queryClient = useQueryClient()
  const today = useToday()
  const bridge = getDesktopBridge()

  const [tab, setTab] = useState<'list' | 'focus'>('list')
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [pinned, setPinned] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [form, setForm] = useState<{ mode: 'create' | 'edit'; task?: Task } | null>(null)
  const [savingForm, setSavingForm] = useState(false)

  useCrossWindowSync()

  useEffect(() => {
    document.documentElement.classList.add('widget-window')
    return () => document.documentElement.classList.remove('widget-window')
  }, [])

  useEffect(() => {
    if (!bridge) return
    bridge.isPinned().then(setPinned).catch(() => {})
  }, [bridge])

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id, 'widget', today],
    queryFn: () => taskRepo.getByDate(user!.id, today),
    enabled: !!user,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ['tags', user?.id],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  const activeTasks = useMemo(() => tasks.filter((t) => t.status !== 'cancelled'), [tasks])
  const doneCount = activeTasks.filter((t) => t.status === 'done').length
  const totalCount = activeTasks.length
  const rate = totalCount > 0 ? doneCount / totalCount : 0

  const grouped = useMemo(
    () =>
      PERIOD_ORDER.map((period) => ({
        period,
        tasks: activeTasks
          .filter((t) => t.period === period)
          .sort(
            (a, b) =>
              Number(a.status === 'done') - Number(b.status === 'done') || a.order_index - b.order_index
          ),
      })).filter((group) => group.tasks.length > 0),
    [activeTasks]
  )

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    notifyDataChanged('tasks')
  }, [queryClient, user?.id])

  const handleToggle = useCallback(
    async (task: Task) => {
      if (!user || busyId) return
      setBusyId(task.id)
      try {
        const nextDone = task.status !== 'done'
        await taskRepo.update(user.id, task.id, {
          status: nextDone ? 'done' : 'todo',
          completed_at: nextDone ? new Date().toISOString() : undefined,
        } as Partial<Task>)
        refresh()
      } catch {
        /* 等下一次刷新纠正 */
      } finally {
        setBusyId(null)
      }
    },
    [user, busyId, taskRepo, refresh]
  )

  /** 快速添加：只填标题，时段按当前时间推断 */
  const handleQuickAdd = useCallback(async () => {
    const title = draft.trim()
    if (!title || !user || saving) return
    setSaving(true)
    try {
      await taskRepo.create(user.id, {
        title,
        task_date: today,
        period: defaultPeriodByTime(),
        priority: 'normal',
        status: 'todo',
        order_index: 0,
      } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
      setDraft('')
      refresh()
    } catch {
      /* 保留输入内容 */
    } finally {
      setSaving(false)
    }
  }, [draft, user, saving, taskRepo, today, refresh])

  const handleSaveForm = useCallback(
    async (values: WidgetTaskDraft) => {
      if (!user || savingForm) return
      setSavingForm(true)
      try {
        const payload = {
          title: values.title,
          period: values.period,
          tag_id: values.tag_id || undefined,
          start_time: values.start_time || undefined,
          end_time: values.end_time || undefined,
        }
        if (form?.mode === 'edit' && form.task) {
          await taskRepo.update(user.id, form.task.id, payload as Partial<Task>)
        } else {
          await taskRepo.create(user.id, {
            ...payload,
            task_date: today,
            priority: 'normal',
            status: 'todo',
            order_index: 0,
          } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        }
        refresh()
        setForm(null)
      } catch {
        /* 失败时保留表单内容 */
      } finally {
        setSavingForm(false)
      }
    },
    [user, savingForm, form, taskRepo, today, refresh]
  )

  const handleDeleteForm = useCallback(async () => {
    if (!user || !form?.task) return
    await taskRepo.softDelete(user.id, form.task.id).catch(() => null)
    refresh()
    setForm(null)
  }, [user, form, taskRepo, refresh])

  const tagColor = useCallback((tagId?: string) => tags.find((t) => t.id === tagId)?.color, [tags])
  const tagName = useCallback((tagId?: string) => tags.find((t) => t.id === tagId)?.name, [tags])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        加载中…
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-card">
      <div className="acg-surface flex h-full w-full flex-col overflow-hidden bg-card ring-1 ring-inset ring-violet-300/50 dark:ring-violet-500/30">
          {/* 标题栏（可拖拽） */}
          <header className="app-drag flex items-center gap-2 border-b border-violet-200/40 bg-background/40 px-3 py-2 select-none dark:border-violet-500/20">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-70 acg-breathe" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" />
            </span>
            <span className="text-xs font-semibold tracking-wide">时格</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {format(parseISO(today), 'M月d日')} {formatWeekday(today)}
            </span>
            <div className="app-no-drag ml-auto flex items-center gap-0.5">
              <button
                type="button"
                title={pinned ? '取消置顶' : '置顶'}
                aria-label={pinned ? '取消置顶' : '置顶'}
                onClick={async () => {
                  if (!bridge) return
                  setPinned(await bridge.togglePin())
                }}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                  pinned && 'text-violet-500'
                )}
              >
                {pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                title="打开主窗口"
                aria-label="打开主窗口"
                onClick={() => bridge?.openMain()}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="关闭浮窗"
                aria-label="关闭浮窗"
                onClick={() => bridge?.hideWidget()}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          {/* 标签页 */}
          <div className="flex gap-1 px-2 pt-2">
            {(
              [
                { key: 'list', label: '清单', icon: ListTodo },
                { key: 'focus', label: '专注', icon: Sparkles },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                data-testid={`widget-tab-${item.key}`}
                onClick={() => setTab(item.key)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1 rounded-full py-1 text-[11px] transition-all',
                  tab === item.key
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 font-medium text-white shadow-sm'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-3 w-3" />
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'focus' ? (
            <div className="flex-1 overflow-y-auto px-2 py-2">
              <HomeFocusTimer variant="widget" />
            </div>
          ) : (
            <>
              {/* 今日进度 */}
              <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5">
                <MiniProgress rate={rate} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground">
                    今日完成{' '}
                    <span className="font-semibold text-foreground tabular-nums">{doneCount}</span>
                    <span className="tabular-nums"> / {totalCount}</span>
                  </p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 transition-all"
                      style={{ width: `${Math.round(rate * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {Math.round(rate * 100)}%
                </span>
              </div>

              {/* 快速添加 + 详细新建 */}
              <div className="flex items-center gap-1 px-3 pb-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleQuickAdd()
                  }}
                  className="flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-violet-200/70 bg-background/60 px-1 py-1 transition-shadow focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-300/50 dark:border-violet-500/25"
                >
                  <button
                    type="submit"
                    data-testid="widget-quick-add"
                    aria-label="添加事项"
                    disabled={!draft.trim() || saving}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-violet-500 transition-colors hover:bg-violet-100 disabled:opacity-40 dark:hover:bg-violet-950/50"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  </button>
                  <input
                    data-testid="widget-add-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="加一件今天的事，回车即可"
                    className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
                  />
                </form>
                <button
                  type="button"
                  data-testid="widget-add-detail"
                  onClick={() => setForm({ mode: 'create' })}
                  title="新建事项（可选时段、标签、时间）"
                  aria-label="新建事项"
                  className="flex h-7 shrink-0 items-center gap-0.5 rounded-lg border border-violet-200/70 px-1.5 text-[11px] text-violet-600 transition-colors hover:bg-violet-50 dark:border-violet-500/25 dark:text-violet-300 dark:hover:bg-violet-950/40"
                >
                  <Plus className="h-3 w-3" />
                  新建
                </button>
              </div>

              {/* 今日清单 */}
              <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-2">
                {isLoading ? (
                  <div className="space-y-1.5 p-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-6 animate-pulse rounded bg-muted" />
                    ))}
                  </div>
                ) : grouped.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 px-4 text-center">
                    <Sparkles className="h-7 w-7 text-violet-300 acg-float dark:text-violet-500/60" />
                    <p className="text-xs text-muted-foreground">今天还是空白页</p>
                    <p className="text-[11px] text-muted-foreground/70">写下一件小事，就从它开始</p>
                  </div>
                ) : (
                  grouped.map((group) => (
                    <div key={group.period} className="space-y-0.5">
                      <div className="flex items-center gap-1 px-1">
                        <span className="h-1 w-1 rounded-full bg-violet-400/70" />
                        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
                          {PERIOD_LABELS[group.period]}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                          {group.tasks.length}
                        </span>
                      </div>
                      {group.tasks.map((task) => {
                        const isDone = task.status === 'done'
                        const color = tagColor(task.tag_id)
                        return (
                          <div
                            key={task.id}
                            className={cn(
                              'group flex items-start gap-1.5 rounded-lg px-1.5 py-1.5 transition-colors',
                              isDone ? 'opacity-60' : 'hover:bg-violet-50/70 dark:hover:bg-violet-950/30'
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => handleToggle(task)}
                              disabled={busyId === task.id}
                              aria-label={isDone ? '标记为未完成' : '标记为完成'}
                              className={cn(
                                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all',
                                isDone
                                  ? 'border-transparent bg-gradient-to-br from-violet-500 to-cyan-500 text-white'
                                  : 'border-muted-foreground/40 hover:border-violet-400'
                              )}
                            >
                              {isDone && <Check className="h-2.5 w-2.5" />}
                            </button>
                            {/* 点标题进编辑 */}
                            <button
                              type="button"
                              data-testid="widget-task-row"
                              onClick={() => setForm({ mode: 'edit', task })}
                              title="点击编辑"
                              className="min-w-0 flex-1 text-left"
                            >
                              <span
                                className={cn(
                                  'block truncate text-xs leading-5',
                                  isDone && 'text-muted-foreground line-through'
                                )}
                              >
                                {task.title}
                              </span>
                              {(tagName(task.tag_id) || task.start_time) && (
                                <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                  {color && (
                                    <span
                                      className="h-1.5 w-1.5 rounded-full"
                                      style={{ backgroundColor: color }}
                                    />
                                  )}
                                  {tagName(task.tag_id)}
                                  {task.start_time && <span className="tabular-nums">{task.start_time}</span>}
                                </span>
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* 底部 */}
          <footer className="flex items-center justify-between border-t border-violet-200/40 bg-background/40 px-3 py-1.5 dark:border-violet-500/20">
            <span className="text-[10px] text-muted-foreground">
              {totalCount === 0
                ? '空的一天'
                : doneCount === totalCount
                  ? '今天全部完成 🎉'
                  : `还有 ${totalCount - doneCount} 项`}
            </span>
            <button
              type="button"
              onClick={() => bridge?.openMain()}
              className="text-[11px] text-violet-600 hover:underline dark:text-violet-300"
            >
              打开主窗口
            </button>
          </footer>

          {/* 新建 / 编辑面板 */}
          {form && (
            <WidgetTaskForm
              mode={form.mode}
              tags={tags}
              saving={savingForm}
              isDone={form.task?.status === 'done'}
              initial={
                form.task
                  ? {
                      title: form.task.title,
                      period: form.task.period,
                      tag_id: form.task.tag_id ?? '',
                      start_time: form.task.start_time ?? '',
                      end_time: form.task.end_time ?? '',
                    }
                  : undefined
              }
              onCancel={() => setForm(null)}
              onSave={handleSaveForm}
              onDelete={form.mode === 'edit' ? handleDeleteForm : undefined}
              onToggleDone={
                form.mode === 'edit' && form.task
                  ? () => {
                      const task = form.task
                      if (!task) return
                      handleToggle(task)
                      setForm(null)
                    }
                  : undefined
              }
            />
          )}
      </div>
    </div>
  )
}
