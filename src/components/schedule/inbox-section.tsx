'use client'

import { useState } from 'react'
import type { Task, Tag } from '@/types'
import { TaskListItem } from './task-list-item'
import { Inbox, ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface InboxSectionProps {
  tasks: Task[]
  tags: Tag[]
  activeTaskId?: string | null
  onTaskClick: (task: Task) => void
}

export function InboxSection({ tasks, tags, activeTaskId, onTaskClick }: InboxSectionProps) {
  const [collapsed, setCollapsed] = useState(true)

  if (tasks.length === 0) return null

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
          <Inbox className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">收集箱</span>
          <span className="text-xs text-muted-foreground">({tasks.length})</span>
        </div>
        <Link
          href="/inbox"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          全部
        </Link>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-1">
          {tasks.slice(0, 5).map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              tags={tags}
              isActive={task.id === activeTaskId}
              onClick={() => onTaskClick(task)}
            />
          ))}
          {tasks.length > 5 && (
            <Link
              href="/inbox"
              className="block text-center text-xs text-muted-foreground hover:text-foreground py-1"
            >
              查看全部 {tasks.length} 项
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
