'use client'

import { useState, useMemo } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { todayStr, formatDate } from '@/lib/utils/date'
import { PERIOD_LABELS, PRIORITY_COLORS } from '@/lib/constants'
import { toast } from 'sonner'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Calendar,
} from 'lucide-react'
import type { Task } from '@/types'

interface OverdueProcessorProps {
  className?: string
}

export function OverdueProcessor({ className }: OverdueProcessorProps) {
  const { user } = useAuth()
  const { tasks } = useRepos()
  const queryClient = useQueryClient()
  const today = todayStr()

  const { data = [], isLoading } = useQuery({
    queryKey: ['tasks', 'overdue'],
    queryFn: async () => {
      // Get all non-done, non-cancelled tasks past today
      const allTasks = await tasks.getByDate(user!.id, today)
      return allTasks.filter(
        (t) => t.task_date < today && t.status !== 'done' && t.status !== 'cancelled'
      )
    },
    enabled: !!user,
  })

  const overdueTasks = useMemo(
    () => data.sort((a, b) => a.task_date.localeCompare(b.task_date)),
    [data]
  )

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      tasks.update(user!.id, id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: () => toast.error('操作失败'),
  })

  const handleRescheduleToday = async (task: Task) => {
    await updateMutation.mutateAsync({
      id: task.id,
      updates: { task_date: today },
    })
    toast.success(`「${task.title}」已移至今天`)
  }

  const handleRescheduleTomorrow = async (task: Task) => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    await updateMutation.mutateAsync({
      id: task.id,
      updates: { task_date: tomorrow },
    })
    toast.success(`「${task.title}」已移至明天`)
  }

  const handleMarkCancelled = async (task: Task) => {
    await updateMutation.mutateAsync({
      id: task.id,
      updates: { status: 'cancelled' },
    })
    toast.success(`「${task.title}」已取消`)
  }

  const handleBulkRescheduleToday = async () => {
    for (const task of overdueTasks) {
      await updateMutation.mutateAsync({
        id: task.id,
        updates: { task_date: today },
      })
    }
    toast.success(`已将 ${overdueTasks.length} 个事项移至今天`)
  }

  const handleBulkCancel = async () => {
    for (const task of overdueTasks) {
      await updateMutation.mutateAsync({
        id: task.id,
        updates: { status: 'cancelled' },
      })
    }
    toast.success(`已取消 ${overdueTasks.length} 个事项`)
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (overdueTasks.length === 0) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-medium">过期事项</h3>
        </div>
        <div className="text-center py-4 border rounded-lg border-dashed">
          <p className="text-sm text-muted-foreground">没有过期事项</p>
          <p className="text-xs text-muted-foreground/60 mt-1">保持得很好！</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-medium">过期事项</h3>
          <Badge variant="destructive" className="text-[10px] h-4">
            {overdueTasks.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleBulkRescheduleToday}
            disabled={updateMutation.isPending}
          >
            全部移至今天
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive"
            onClick={handleBulkCancel}
            disabled={updateMutation.isPending}
          >
            全部取消
          </Button>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-1.5">
        {overdueTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2.5 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
          >
            {/* Task info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium truncate">{task.title}</span>
                <span
                  className={cn(
                    'shrink-0 text-[10px]',
                    PRIORITY_COLORS[task.priority]
                  )}
                >
                  {task.priority === 'urgent' ? '紧急' : task.priority === 'high' ? '高' : ''}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {task.task_date} · {PERIOD_LABELS[task.period]}
                {task.estimated_minutes && ` · ${task.estimated_minutes}分钟`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleRescheduleToday(task)}
                title="移至今天"
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                今天
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleRescheduleTomorrow(task)}
                title="移至明天"
              >
                <Calendar className="h-3 w-3 mr-1" />
                明天
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleMarkCancelled(task)}
                title="取消"
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
