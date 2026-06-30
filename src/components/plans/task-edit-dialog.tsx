'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { PERIOD_LABELS } from '@/lib/constants'
import type { Task, Period } from '@/types'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMediaQuery } from '@/hooks/use-media-query'
import { toast } from 'sonner'
import { Bell } from 'lucide-react'

const taskFormSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  task_date: z.string().min(1),
  period: z.enum(['morning', 'afternoon', 'evening']),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  tag_id: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  status: z.enum(['todo', 'in_progress', 'done', 'cancelled']),
  estimated_minutes: z.string().optional(),
  reminder_at: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskEditDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: string
  defaultPeriod?: Period
}

export function TaskEditDialog({
  task,
  open,
  onOpenChange,
  defaultDate,
  defaultPeriod,
}: TaskEditDialogProps) {
  const { user } = useAuth()
  const { tasks, tags } = useRepos()
  const queryClient = useQueryClient()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tags.getAll(user!.id),
    enabled: !!user,
  })

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      task_date: defaultDate || new Date().toISOString().slice(0, 10),
      period: defaultPeriod || 'morning',
      priority: 'normal',
      status: 'todo',
      tag_id: 'none',
      reminder_at: '',
    },
  })

  // When editing existing task, populate form
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        task_date: task.task_date,
        period: task.period,
        start_time: task.start_time || '',
        end_time: task.end_time || '',
        tag_id: task.tag_id || 'none',
        priority: task.priority,
        status: task.status,
        estimated_minutes: task.estimated_minutes?.toString(),
        reminder_at: task.reminder_at || '',
      })
    } else {
      form.reset({
        title: '',
        description: '',
        task_date: defaultDate || new Date().toISOString().slice(0, 10),
        period: defaultPeriod || 'morning',
        priority: 'normal',
        status: 'todo',
        tag_id: 'none',
        reminder_at: '',
      })
    }
  }, [task, defaultDate, defaultPeriod, form])

  const handleSubmit = async (data: TaskFormValues) => {
    if (!user) return

    const taskData = {
      title: data.title,
      description: data.description || undefined,
      task_date: data.task_date,
      period: data.period,
      start_time: data.start_time || undefined,
      end_time: data.end_time || undefined,
      tag_id: data.tag_id === 'none' ? undefined : data.tag_id,
      priority: data.priority,
      status: data.status,
      estimated_minutes: data.estimated_minutes ? parseInt(data.estimated_minutes, 10) : undefined,
      reminder_at: data.reminder_at || undefined,
      order_index: task?.order_index ?? 0,
    }

    try {
      if (task) {
        await tasks.update(user.id, task.id, taskData)
        toast.success('事项已更新')
      } else {
        await tasks.create(user.id, taskData as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        toast.success('事项已创建')
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] })

      onOpenChange(false)
    } catch {
      toast.error('保存失败，请重试')
    }
  }

  const isEditing = !!task

  const formContent = (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">标题 *</Label>
        <Input id="title" {...form.register('title')} placeholder="事项标题" autoFocus />
        {form.formState.errors.title && (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">详细说明</Label>
        <Textarea id="desc" {...form.register('description')} placeholder="可选：详细描述" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>日期</Label>
          <Input type="date" {...form.register('task_date')} />
        </div>
        <div className="space-y-2">
          <Label>时段</Label>
          <Controller
            name="period"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">{PERIOD_LABELS.morning}</SelectItem>
                  <SelectItem value="afternoon">{PERIOD_LABELS.afternoon}</SelectItem>
                  <SelectItem value="evening">{PERIOD_LABELS.evening}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>开始时间</Label>
          <Input type="time" {...form.register('start_time')} />
        </div>
        <div className="space-y-2">
          <Label>结束时间</Label>
          <Input type="time" {...form.register('end_time')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>优先级</Label>
          <Controller
            name="priority"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="normal">普通</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="urgent">紧急</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>标签</Label>
          <Controller
            name="tag_id"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="无" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无标签</SelectItem>
                  {tagList.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          提醒时间
        </Label>
        <Input type="datetime-local" {...form.register('reminder_at')} />
        <p className="text-xs text-muted-foreground">设置提醒时间，届时会通过浏览器通知提醒你</p>
      </div>

      {isEditing && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>状态</Label>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">未开始</SelectItem>
                    <SelectItem value="in_progress">进行中</SelectItem>
                    <SelectItem value="done">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>预计用时 (分钟)</Label>
            <Input type="text" inputMode="numeric" {...form.register('estimated_minutes')} placeholder="30" />
          </div>
        </div>
      )}

      <DialogFooter className="gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          取消
        </Button>
        <Button type="submit">
          {isEditing ? '保存修改' : '创建事项'}
        </Button>
      </DialogFooter>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? '编辑事项' : '新建事项'}</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>{isEditing ? '编辑事项' : '新建事项'}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">{formContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
