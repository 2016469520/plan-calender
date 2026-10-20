'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskListItem } from '@/components/schedule/task-list-item'
import { TaskDetailPanel } from '@/components/schedule/task-detail-panel'
import { Inbox, Loader2, ArrowRight, Calendar, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { todayStr, tomorrowStr } from '@/lib/utils/date'
import { defaultPeriodByTime } from '@/lib/utils/period'
import type { Task } from '@/types'

export default function InboxPage() {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [movingId, setMovingId] = useState<string | null>(null)

  const today = todayStr()

  // 收集箱 = 没有日期的任务（task_date 为空）
  const { data: inboxTasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id, 'inbox'],
    queryFn: () =>
      taskRepo.filter(user!.id, {
        undatedOnly: true,
        maxResults: 200,
      }),
    enabled: !!user,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ['tags', user?.id],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks', user!.id] })
  }, [queryClient, user])

  const handleCapture = useCallback(async () => {
    const title = draft.trim()
    if (!title || !user || saving) return
    setSaving(true)
    try {
      await taskRepo.create(user.id, {
        title,
        task_date: null,
        period: defaultPeriodByTime(),
        priority: 'normal',
        status: 'todo',
        order_index: 0,
      } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
      setDraft('')
      refresh()
      toast.success('已放入收集箱')
    } catch {
      toast.error('添加失败，请重试')
    } finally {
      setSaving(false)
    }
  }, [draft, user, saving, taskRepo, refresh])

  const handleSchedule = useCallback(
    async (task: Task, target: string, label: string) => {
      if (!user || movingId) return
      setMovingId(task.id)
      try {
        await taskRepo.update(user.id, task.id, { task_date: target } as Partial<Task>)
        refresh()
        toast.success(`已安排到${label}`)
      } catch {
        toast.error('操作失败')
      } finally {
        setMovingId(null)
      }
    },
    [user, movingId, taskRepo, refresh]
  )

  const activeTask = inboxTasks.find((t) => t.id === activeTaskId) || null

  if (!user) return null

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">收集箱</h1>
          <p className="text-sm text-muted-foreground mt-1">
            先记下来，再决定什么时候做
          </p>
        </div>
        {inboxTasks.length > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums mt-2">
            {inboxTasks.length} 项待安排
          </span>
        )}
      </div>

      {/* 快速记录（不设日期） */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="inbox-capture"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleCapture()
              }
            }}
            placeholder="随手记一条，稍后再安排……"
            className="pl-9"
          />
        </div>
        <Button
          data-testid="inbox-capture-save"
          onClick={handleCapture}
          disabled={!draft.trim() || saving}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : '记录'}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : inboxTasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <Inbox className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">收集箱是空的</p>
            <p className="text-xs text-muted-foreground text-center">
              在上方输入框记下想法，之后再安排到今天或明天
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1.5">
          {inboxTasks.map((task) => (
            <div key={task.id} className="space-y-1">
              <TaskListItem
                task={task}
                tags={tags}
                isActive={task.id === activeTaskId}
                onClick={() => setActiveTaskId(task.id)}
              />
              <div className="flex gap-1 pl-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                  disabled={movingId === task.id}
                  onClick={() => handleSchedule(task, today, '今天')}
                >
                  <ArrowRight className="h-3 w-3 mr-0.5" />
                  今天
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                  disabled={movingId === task.id}
                  onClick={() => handleSchedule(task, tomorrowStr(today), '明天')}
                >
                  <Calendar className="h-3 w-3 mr-0.5" />
                  明天
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskDetailPanel
        task={activeTask}
        open={!!activeTaskId}
        onClose={() => setActiveTaskId(null)}
      />
    </div>
  )
}
