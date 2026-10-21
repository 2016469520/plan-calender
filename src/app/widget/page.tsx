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
import { cn } from '@/lib/utils'
import { Check, Loader2, Maximize2, Pin, PinOff, Plus, X } from 'lucide-react'
import type { Period, Task } from '@/types'

const PERIOD_ORDER: Period[] = ['morning', 'afternoon', 'evening']

/**
 * 桌面浮窗：常驻桌面的一小块今日清单。
 * 复用主应用的数据层，与主窗口通过 BroadcastChannel 保持同步。
 */
export default function WidgetPage() {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const queryClient = useQueryClient()
  const today = useToday()
  const bridge = getDesktopBridge()

  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [pinned, setPinned] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  useCrossWindowSync()

  // 无边框窗口需要页面级标记，换成透明背景 + 自身圆角
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
  const rate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  const grouped = useMemo(() => {
    return PERIOD_ORDER.map((period) => ({
      period,
      tasks: activeTasks
        .filter((t) => t.period === period)
        .sort((a, b) => Number(a.status === 'done') - Number(b.status === 'done') || a.order_index - b.order_index),
    })).filter((group) => group.tasks.length > 0)
  }, [activeTasks])

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
        /* 忽略单次失败，下一次刷新会纠正 */
      } finally {
        setBusyId(null)
      }
    },
    [user, busyId, taskRepo, refresh]
  )

  const handleAdd = useCallback(async () => {
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
      /* 失败时保留输入内容 */
    } finally {
      setSaving(false)
    }
  }, [draft, user, saving, taskRepo, today, refresh])

  const tagColor = useCallback(
    (tagId?: string) => tags.find((t) => t.id === tagId)?.color,
    [tags]
  )

  if (!user) {
    return <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">加载中…</div>
  }

  return (
    <div className="h-screen w-screen p-1.5">
      <div className="h-full w-full flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        {/* 标题栏：可拖动 */}
        <header className="app-drag flex items-center gap-2 px-3 py-2 border-b bg-muted/40 select-none">
          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          <span className="text-xs font-semibold tracking-wide">时格</span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {format(parseISO(today), 'M月d日')} {formatWeekday(today)}
          </span>
          <div className="ml-auto flex items-center gap-0.5 app-no-drag">
            <button
              type="button"
              title={pinned ? '取消置顶' : '置顶'}
              aria-label={pinned ? '取消置顶' : '置顶'}
              onClick={async () => {
                if (!bridge) return
                const next = await bridge.togglePin()
                setPinned(next)
              }}
              className={cn(
                'h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors',
                pinned && 'text-primary'
              )}
            >
              {pinned ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              title="打开主窗口"
              aria-label="打开主窗口"
              onClick={() => bridge?.openMain()}
              className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="关闭浮窗"
              aria-label="关闭浮窗"
              onClick={() => bridge?.hideWidget()}
              className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* 今日进度 */}
        <div className="px-3 pt-2 pb-1.5 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-muted-foreground">
              今日完成 <span className="text-foreground font-semibold tabular-nums">{doneCount}</span>
              <span className="tabular-nums"> / {totalCount}</span>
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">{rate}%</span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>

        {/* 快速添加 */}
        <div className="px-3 pb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAdd()
            }}
            className="flex items-center gap-1 rounded-md border border-input px-2 py-1 focus-within:ring-1 focus-within:ring-ring"
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              data-testid="widget-add-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="加一件今天的事…"
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/70 min-w-0"
            />
            {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          </form>
        </div>

        {/* 今日清单 */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          {isLoading ? (
            <div className="space-y-1.5 p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-1 text-center px-4">
              <p className="text-xs text-muted-foreground">今天还没有安排</p>
              <p className="text-[11px] text-muted-foreground/70">在上面输入一件小事，就开始了</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.period} className="space-y-0.5">
                <div className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/80">
                  {PERIOD_LABELS[group.period]}
                </div>
                {group.tasks.map((task) => {
                  const isDone = task.status === 'done'
                  const color = tagColor(task.tag_id)
                  return (
                    <div
                      key={task.id}
                      className="group flex items-start gap-1.5 rounded-md px-1.5 py-1 hover:bg-accent/60 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggle(task)}
                        disabled={busyId === task.id}
                        aria-label={isDone ? '标记为未完成' : '标记为完成'}
                        className={cn(
                          'mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border flex items-center justify-center transition-colors',
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-muted-foreground/40 hover:border-emerald-400'
                        )}
                      >
                        {isDone && <Check className="h-2.5 w-2.5" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            'text-xs leading-5 truncate',
                            isDone && 'line-through text-muted-foreground'
                          )}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      </div>
                      {color && (
                        <span
                          className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      {task.start_time && (
                        <span className="mt-0.5 text-[10px] tabular-nums text-muted-foreground shrink-0">
                          {task.start_time}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* 底部 */}
        <footer className="px-3 py-1.5 border-t bg-muted/30 flex items-center justify-between">
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
            className="text-[11px] text-primary hover:underline"
          >
            打开主窗口
          </button>
        </footer>
      </div>
    </div>
  )
}
