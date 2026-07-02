'use client'

import { useState, useEffect, useCallback, useRef, startTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { PERIOD_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/constants'
import { todayStr, formatDisplayDate } from '@/lib/utils/date'
import type { Task, Period, Priority, TaskStatus } from '@/types'
import {
  X,
  Trash2,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface TaskDetailPanelProps {
  task: Task | null
  open: boolean
  onClose: () => void
}

export function TaskDetailPanel({ task, open, onClose }: TaskDetailPanelProps) {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState<string | null>(null) // field name being saved
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagRepo.getAll(user?.id || ''),
    enabled: !!user,
  })

  // Local state for the task being edited
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [period, setPeriod] = useState<Period>('morning')
  const [tagId, setTagId] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [estimatedMinutes, setEstimatedMinutes] = useState('')

  // Sync local state when task changes (batched to avoid cascading renders)
  useEffect(() => {
    if (task) {
      startTransition(() => {
        setTitle(task.title)
        setDescription(task.description || '')
        setTaskDate(task.task_date)
        setPeriod(task.period)
        setTagId(task.tag_id || 'none')
        setPriority(task.priority)
        setStatus(task.status)
        setEstimatedMinutes(task.estimated_minutes?.toString() || '')
      })
    }
  }, [task])

  const saveField = useCallback(
    async (field: string, value: unknown) => {
      if (!user || !task) return
      setSaving(field)
      try {
        const update: Partial<Task> = { [field]: value }
        if (field === 'status' && value === 'done') {
          update.completed_at = new Date().toISOString()
        }
        await taskRepo.update(user.id, task.id, update)
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      } catch {
        toast.error('保存失败')
      } finally {
        setSaving(null)
      }
    },
    [user, task, taskRepo, queryClient]
  )

  const debouncedSave = useCallback(
    (field: string, value: unknown) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => saveField(field, value), 600)
    },
    [saveField]
  )

  const handleDelete = async () => {
    if (!user || !task) return
    try {
      await taskRepo.softDelete(user.id, task.id)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('已删除')
      onClose()
    } catch {
      toast.error('删除失败')
    }
  }

  if (!task || !open) return null

  const tag = tagList.find((t) => t.id === task.tag_id)

  return (
    <div className="w-80 xl:w-96 border-l bg-card h-full overflow-hidden flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <span className="text-sm font-medium">任务详情</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title - inline edit */}
        <div>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              debouncedSave('title', e.target.value)
            }}
            className="text-base font-medium border-none px-0 h-auto focus-visible:ring-0"
            placeholder="任务标题"
          />
          {saving === 'title' && (
            <span className="text-[10px] text-muted-foreground">保存中...</span>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">状态</span>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as TaskStatus)
              saveField('status', v)
            }}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">优先级</span>
          <Select
            value={priority}
            onValueChange={(v) => {
              setPriority(v as Priority)
              saveField('priority', v)
            }}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            type="date"
            value={taskDate}
            onChange={(e) => {
              setTaskDate(e.target.value)
              saveField('task_date', e.target.value)
            }}
            className="h-8 text-xs flex-1"
          />
        </div>

        {/* Period */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select
            value={period}
            onValueChange={(v) => {
              setPeriod(v as Period)
              saveField('period', v)
            }}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PERIOD_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tag */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select
            value={tagId}
            onValueChange={(v) => {
              const val = v || 'none'
              setTagId(val)
              saveField('tag_id', val === 'none' ? null : val)
            }}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="无标签" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无标签</SelectItem>
              {tagList.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full inline-block"
                      style={{ backgroundColor: t.color }}
                    />
                    {t.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estimated time */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            type="number"
            value={estimatedMinutes}
            onChange={(e) => {
              setEstimatedMinutes(e.target.value)
              debouncedSave('estimated_minutes', e.target.value ? Number(e.target.value) : null)
            }}
            placeholder="预计用时（分钟）"
            className="h-8 text-xs flex-1"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">说明</span>
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              debouncedSave('description', e.target.value)
            }}
            placeholder="添加说明..."
            rows={3}
            className="text-xs resize-none"
          />
        </div>

        {/* Meta info */}
        <div className="text-[10px] text-muted-foreground space-y-1 pt-2 border-t">
          <div>创建：{task.created_at ? new Date(task.created_at).toLocaleString('zh-CN') : '—'}</div>
          <div>更新：{task.updated_at ? new Date(task.updated_at).toLocaleString('zh-CN') : '—'}</div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          删除
        </Button>
      </div>
    </div>
  )
}
