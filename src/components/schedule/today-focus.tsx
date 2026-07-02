'use client'

import type { Task, Tag } from '@/types'
import { TaskListItem } from './task-list-item'
import { Star } from 'lucide-react'

interface TodayFocusProps {
  tasks: Task[]
  tags: Tag[]
  activeTaskId?: string | null
  onTaskClick: (task: Task) => void
}

/**
 * Today Focus: shows up to 3 urgent or high-priority tasks
 * derived from task priority (urgent > high).
 */
export function TodayFocus({ tasks, tags, activeTaskId, onTaskClick }: TodayFocusProps) {
  // Derive focus tasks from priority
  const focusTasks = tasks
    .filter((t) => t.status !== 'done' && t.status !== 'cancelled')
    .sort((a, b) => {
      const p = { urgent: 4, high: 3, normal: 2, low: 1 }
      return (p[b.priority] || 0) - (p[a.priority] || 0)
    })
    .slice(0, 3)
    .filter((t) => t.priority === 'urgent' || t.priority === 'high')

  if (focusTasks.length === 0) return null

  const focusIds = new Set(focusTasks.map((t) => t.id))

  return (
    <div className="rounded-lg border-2 border-amber-200/60 dark:border-amber-800/30 bg-gradient-to-r from-amber-50/40 to-transparent dark:from-amber-950/10 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Star className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
          今日焦点
        </span>
      </div>
      <div className="space-y-1">
        {focusTasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            tags={tags}
            isActive={task.id === activeTaskId}
            isFocus
            onClick={() => onTaskClick(task)}
          />
        ))}
      </div>
    </div>
  )
}
