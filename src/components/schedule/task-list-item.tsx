'use client'

import { cn } from '@/lib/utils'
import { PERIOD_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import type { Task, Tag } from '@/types'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQueryClient } from '@tanstack/react-query'
import {
  Clock,
  AlertCircle,
  Repeat,
  Bell,
  ListChecks,
  MoreHorizontal,
  Check,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'

interface TaskListItemProps {
  task: Task
  tags: Tag[]
  isActive?: boolean
  isFocus?: boolean
  onClick: () => void
}

export function TaskListItem({ task, tags, isActive, isFocus, onClick }: TaskListItemProps) {
  const { user } = useAuth()
  const { tasks: taskRepo } = useRepos()
  const queryClient = useQueryClient()
  const [toggling, setToggling] = useState(false)

  const isDone = task.status === 'done'
  const tag = tags.find((t) => t.id === task.tag_id)
  const doneSubitems = task.subitems?.filter((s) => s.is_completed).length ?? 0
  const totalSubitems = task.subitems?.length ?? 0

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user || toggling) return
    setToggling(true)
    try {
      const newStatus = isDone ? 'todo' : 'done'
      await taskRepo.update(user.id, task.id, {
        status: newStatus,
        completed_at: newStatus === 'done' ? new Date().toISOString() : undefined,
      } as Partial<Task>)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (newStatus === 'done') {
        toast.success('已完成', { duration: 1500 })
      }
    } catch {
      toast.error('操作失败')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border border-transparent bg-card cursor-pointer transition-all',
        'hover:border-border hover:shadow-sm',
        isActive && 'border-primary/30 bg-primary/5 ring-1 ring-primary/20',
        isFocus && 'ring-1 ring-amber-400/30 bg-amber-50/30 dark:bg-amber-950/10',
        isDone && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        className={cn(
          'mt-0.5 h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
          isDone
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-muted-foreground/30 hover:border-emerald-400 group-hover:border-emerald-400'
        )}
      >
        {toggling ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isDone ? (
          <Check className="h-3 w-3" />
        ) : null}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Title */}
        <div className={cn('text-sm font-medium', isDone && 'line-through text-muted-foreground')}>
          {task.title}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
          {/* Tag */}
          {tag && (
            <span className="inline-flex items-center gap-1">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </span>
          )}

          {/* Time */}
          {task.start_time && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {task.start_time}
              {task.end_time && ` - ${task.end_time}`}
            </span>
          )}

          {/* Estimated time */}
          {task.estimated_minutes != null && !task.start_time && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {task.estimated_minutes}分钟
            </span>
          )}

          {/* Priority (only high/urgent shown in list) */}
          {(task.priority === 'high' || task.priority === 'urgent') && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium',
                task.priority === 'urgent' ? 'text-red-500' : 'text-orange-500'
              )}
            >
              <AlertCircle className="h-3 w-3" />
              {PRIORITY_LABELS[task.priority]}
            </span>
          )}
        </div>

        {/* Indicators row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.recurrence_rule && <Repeat className="h-3 w-3" />}
          {task.reminder_at && <Bell className="h-3 w-3" />}
          {totalSubitems > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <ListChecks className="h-3 w-3" />
              {doneSubitems}/{totalSubitems}
            </span>
          )}
        </div>
      </div>

      {/* Right: period badge */}
      <div className="shrink-0 text-right">
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {PERIOD_LABELS[task.period]}
        </span>
      </div>
    </div>
  )
}
