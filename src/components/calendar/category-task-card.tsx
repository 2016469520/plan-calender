'use client'

import { cn } from '@/lib/utils'
import { formatDisplayDate, formatWeekday } from '@/lib/utils/date'
import { PERIOD_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import { MoveToCategoryMenu } from './move-to-category-menu'
import type { Task } from '@/types'
import { Clock, AlertCircle, Repeat, Bell, ListChecks } from 'lucide-react'

interface CategoryTaskCardProps {
  task: Task
  onClick: (task: Task) => void
  showMoveMenu?: boolean
}

export function CategoryTaskCard({ task, onClick, showMoveMenu = false }: CategoryTaskCardProps) {
  const isDone = task.status === 'done'
  const isOverdue =
    task.status !== 'done' &&
    task.status !== 'cancelled' &&
    task.task_date < new Date().toISOString().slice(0, 10)

  const doneSubitems = task.subitems?.filter((s) => s.is_completed).length ?? 0
  const totalSubitems = task.subitems?.length ?? 0

  return (
    <button
      onClick={() => onClick(task)}
      className={cn(
        'w-full text-left p-3 rounded-lg border border-border bg-card transition-all',
        'hover:shadow-sm hover:border-border/80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isDone && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Tag color strip */}
        {task.tag?.color && (
          <div
            className="w-1 self-stretch rounded-full shrink-0"
            style={{ backgroundColor: task.tag.color }}
          />
        )}

        <div className="min-w-0 flex-1 space-y-1">
          {/* Title */}
          <div className={cn('text-sm font-medium', isDone && 'line-through')}>
            {task.title}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            {task.task_date && (
              <span>
                {formatDisplayDate(task.task_date)}{' '}
                {formatWeekday(task.task_date)}
              </span>
            )}
            {task.period && (
              <span>{PERIOD_LABELS[task.period]}</span>
            )}
            {task.estimated_minutes != null && (
              <span className="inline-flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {task.estimated_minutes}分钟
              </span>
            )}
          </div>

          {/* Indicators row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority */}
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                task.priority === 'urgent'
                  ? 'text-red-600 dark:text-red-400'
                  : task.priority === 'high'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-muted-foreground'
              )}
            >
              <AlertCircle className="h-3 w-3" />
              {PRIORITY_LABELS[task.priority]}
            </span>

            {/* Overdue indicator */}
            {isOverdue && (
              <span className="text-xs text-red-500 font-medium">已延期</span>
            )}

            {/* Recurrence */}
            {task.recurrence_rule && (
              <Repeat className="h-3 w-3 text-muted-foreground" />
            )}

            {/* Reminder */}
            {task.reminder_at && (
              <Bell className="h-3 w-3 text-muted-foreground" />
            )}

            {/* Subtask progress */}
            {totalSubitems > 0 && (
              <span className="text-xs text-muted-foreground inline-flex items-center gap-0.5">
                <ListChecks className="h-3 w-3" />
                {doneSubitems}/{totalSubitems}
              </span>
            )}
          </div>

          {/* Move to category (mobile-friendly) */}
          {showMoveMenu && !isDone && (
            <div className="mt-1">
              <MoveToCategoryMenu task={task} />
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="shrink-0">
          <span
            className={cn(
              'text-xs px-1.5 py-0.5 rounded font-medium',
              task.status === 'done' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
              task.status === 'in_progress' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
              task.status === 'todo' && 'bg-muted text-muted-foreground'
            )}
          >
            {task.status === 'todo' ? '待办' : task.status === 'in_progress' ? '进行中' : '完成'}
          </span>
        </div>
      </div>
    </button>
  )
}
