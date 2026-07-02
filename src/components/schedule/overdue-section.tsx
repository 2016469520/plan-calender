'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQueryClient } from '@tanstack/react-query'
import type { Task, Tag } from '@/types'
import { todayStr } from '@/lib/utils/date'
import { TaskListItem } from './task-list-item'
import { AlertCircle, ChevronDown, ChevronRight, ArrowRight, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface OverdueSectionProps {
  tasks: Task[]
  tags: Tag[]
  activeTaskId?: string | null
  onTaskClick: (task: Task) => void
}

export function OverdueSection({ tasks, tags, activeTaskId, onTaskClick }: OverdueSectionProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const { tasks: taskRepo } = useRepos()
  const queryClient = useQueryClient()
  const today = todayStr()

  const handleMoveToToday = async (task: Task) => {
    if (!user) return
    try {
      await taskRepo.update(user.id, task.id, { task_date: today } as Partial<Task>)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('已移至今天')
    } catch {
      toast.error('操作失败')
    }
  }

  const handleMoveToTomorrow = async (task: Task) => {
    if (!user) return
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().slice(0, 10)
    try {
      await taskRepo.update(user.id, task.id, { task_date: tomorrowStr } as Partial<Task>)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('已移至明天')
    } catch {
      toast.error('操作失败')
    }
  }

  if (tasks.length === 0) return null

  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-950/10">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 p-3 text-left"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">待处理延期</span>
        <span className="text-xs text-muted-foreground">({tasks.length})</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-1.5">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-1">
              <TaskListItem
                task={task}
                tags={tags}
                isActive={task.id === activeTaskId}
                onClick={() => onTaskClick(task)}
              />
              <div className="flex gap-1 pl-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => handleMoveToToday(task)}
                >
                  <ArrowRight className="h-3 w-3 mr-0.5" />
                  今天
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => handleMoveToTomorrow(task)}
                >
                  <Calendar className="h-3 w-3 mr-0.5" />
                  明天
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
