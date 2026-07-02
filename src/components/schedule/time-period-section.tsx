'use client'

import type { Task, Tag } from '@/types'
import { TaskListItem } from './task-list-item'
import { PERIOD_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Sun, Sunset, Moon } from 'lucide-react'

interface TimePeriodSectionProps {
  period: 'morning' | 'afternoon' | 'evening'
  tasks: Task[]
  tags: Tag[]
  activeTaskId?: string | null
  focusTaskIds?: Set<string>
  onTaskClick: (task: Task) => void
}

const periodConfig = {
  morning: {
    icon: Sun,
    bgClass: 'from-amber-50/30 to-transparent dark:from-amber-950/10',
  },
  afternoon: {
    icon: Sunset,
    bgClass: 'from-orange-50/20 to-transparent dark:from-orange-950/5',
  },
  evening: {
    icon: Moon,
    bgClass: 'from-slate-100/30 to-transparent dark:from-slate-900/10',
  },
}

export function TimePeriodSection({
  period,
  tasks,
  tags,
  activeTaskId,
  focusTaskIds,
  onTaskClick,
}: TimePeriodSectionProps) {
  const config = periodConfig[period]
  const Icon = config.icon

  if (tasks.length === 0) return null

  return (
    <div className={cn('rounded-lg bg-gradient-to-b', config.bgClass, 'p-3')}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {PERIOD_LABELS[period]}
        </span>
        <span className="text-xs text-muted-foreground/60">({tasks.length})</span>
      </div>
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            tags={tags}
            isActive={task.id === activeTaskId}
            isFocus={focusTaskIds?.has(task.id)}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  )
}
