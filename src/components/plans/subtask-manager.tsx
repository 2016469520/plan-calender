'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Plus, Trash2, GripVertical, CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'
import type { TaskSubitem } from '@/types'

interface SubtaskManagerProps {
  taskId: string
}

export function SubtaskManager({ taskId }: SubtaskManagerProps) {
  const { user } = useAuth()
  const { taskSubitems } = useRepos()
  const queryClient = useQueryClient()
  const [newTitle, setNewTitle] = useState('')

  const { data: subitems = [], isLoading } = useQuery({
    queryKey: ['taskSubitems', taskId],
    queryFn: () => taskSubitems.getByTaskId(user!.id, taskId),
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      taskSubitems.create(user!.id, {
        task_id: taskId,
        title,
        is_completed: false,
        sort_order: subitems.length,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskSubitems', taskId] })
      setNewTitle('')
    },
    onError: () => toast.error('创建子任务失败'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskSubitem> }) =>
      taskSubitems.update(user!.id, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskSubitems', taskId] })
    },
    onError: () => toast.error('更新失败'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskSubitems.delete(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskSubitems', taskId] })
    },
    onError: () => toast.error('删除失败'),
  })

  const handleAdd = () => {
    if (!newTitle.trim()) return
    createMutation.mutate(newTitle.trim())
  }

  const handleToggle = async (sub: TaskSubitem) => {
    await updateMutation.mutateAsync({
      id: sub.id,
      data: { is_completed: !sub.is_completed },
    })
  }

  const handleEditTitle = async (sub: TaskSubitem, title: string) => {
    if (!title.trim()) return
    await updateMutation.mutateAsync({ id: sub.id, data: { title } })
  }

  const completedCount = subitems.filter((s) => s.is_completed).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          子任务
          {subitems.length > 0 && (
            <span className="ml-1.5 text-xs text-muted-foreground font-normal">
              {completedCount}/{subitems.length}
            </span>
          )}
        </label>
      </div>

      {/* Add new subtask */}
      <div className="flex gap-2">
        <Input
          placeholder="添加子任务..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          className="h-8 text-sm"
        />
        <Button
          size="sm"
          className="h-8 shrink-0"
          onClick={handleAdd}
          disabled={createMutation.isPending || !newTitle.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Subtask list */}
      {isLoading ? (
        <div className="space-y-1.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : subitems.length === 0 ? (
        <p className="text-xs text-muted-foreground py-1">
          暂无子任务，将大任务拆分为小步骤
        </p>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {subitems.map((sub) => (
            <div
              key={sub.id}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md group hover:bg-accent/50 transition-colors',
                sub.is_completed && 'opacity-60'
              )}
            >
              {/* Drag handle (future) */}
              <GripVertical className="h-3 w-3 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100" />

              {/* Toggle */}
              <button
                onClick={() => handleToggle(sub)}
                className="shrink-0"
                title={sub.is_completed ? '标记未完成' : '标记完成'}
              >
                {sub.is_completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Title (editable on double-click) */}
              <span
                className={cn(
                  'text-sm flex-1 truncate',
                  sub.is_completed && 'line-through text-muted-foreground'
                )}
                onDoubleClick={() => {
                  const newTitle = prompt('编辑子任务', sub.title)
                  if (newTitle && newTitle !== sub.title) {
                    handleEditTitle(sub, newTitle)
                  }
                }}
                title="双击编辑"
              >
                {sub.title}
              </span>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => deleteMutation.mutate(sub.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {subitems.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${Math.round((completedCount / subitems.length) * 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round((completedCount / subitems.length) * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
