'use client'

import { useMemo, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { format, parseISO, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { PERIOD_LABELS } from '@/lib/constants'
import { nowISO } from '@/lib/utils/date'
import { useTaskDnd } from '@/hooks/use-task-dnd'
import {
  SortableTaskItem,
  PeriodDropZone,
  TaskDragContext,
  TaskDragOverlay,
} from '@/components/calendar/task-dnd'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { DragOverlay } from '@dnd-kit/core'
import type { Task, Period, TaskStatus, Priority } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Circle,
  CheckCircle2,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  MoveHorizontal,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMediaQuery } from '@/hooks/use-media-query'
import { TaskEditDialog } from '@/components/plans/task-edit-dialog'

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

const PERIOD_ICONS: Record<Period, typeof Sun> = {
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
}

function dayNav(date: string, dir: -1 | 1): string {
  const d = parseISO(date)
  d.setDate(d.getDate() + dir)
  return format(d, 'yyyy-MM-dd')
}

interface DayViewProps {
  currentDate: string
  onDateChange: (date: string) => void
}

export function DayView({ currentDate, onDateChange }: DayViewProps) {
  const { user } = useAuth()
  const { tasks, tags } = useRepos()
  const queryClient = useQueryClient()
  const [newTaskPeriod, setNewTaskPeriod] = useState<Period | null>(null)
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null)
  const [dragOverPeriod, setDragOverPeriod] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { handleReorder, handleMove, isMoving } = useTaskDnd()

  const { data: dayTasks = [] } = useQuery({
    queryKey: ['tasks', 'day', currentDate],
    queryFn: () => tasks.getByDate(user!.id, currentDate),
    enabled: !!user,
  })

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tags.getAll(user!.id),
    enabled: !!user,
  })

  const tasksByPeriod = useMemo(() => {
    const map: Record<Period, Task[]> = { morning: [], afternoon: [], evening: [] }
    for (const task of dayTasks) {
      map[task.period].push(task)
    }
    for (const period of PERIODS) {
      map[period].sort((a, b) => a.order_index - b.order_index)
    }
    return map
  }, [dayTasks])

  const doneCount = dayTasks.filter((t) => t.status === 'done').length
  const totalCount = dayTasks.filter((t) => t.status !== 'cancelled').length
  const completionPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  const updateTaskMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Task> }) =>
      tasks.update(user!.id, data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => tasks.softDelete(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const createTaskMutation = useMutation({
    mutationFn: (data: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      tasks.create(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setNewTaskPeriod(null)
    },
  })

  const toggleTask = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
    updateTaskMutation.mutate({
      id: task.id,
      updates: {
        status: newStatus,
        completed_at: newStatus === 'done' ? nowISO() : undefined,
      },
    })
  }

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = (event.active.data.current as { task?: Task })?.task
    if (task) setActiveDragTask(task)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveDragTask(null)
      setDragOverPeriod(null)

      if (!over) return

      const activeTask = (active.data.current as { task?: Task })?.task
      if (!activeTask) return

      // Determine target period
      const targetPeriod = (over.data.current as { period?: Period })?.period
      const overTask = (over.data.current as { task?: Task })?.task

      if (targetPeriod && targetPeriod !== activeTask.period) {
        // Cross-period move
        const targetTasks = tasksByPeriod[targetPeriod]
        const newOrder = targetTasks.length > 0
          ? targetTasks[targetTasks.length - 1].order_index + 1000
          : 0

        await handleMove(activeTask.id, {
          period: targetPeriod,
          order_index: newOrder,
        })
        return
      }

      if (overTask && overTask.id !== activeTask.id && overTask.period === activeTask.period) {
        // Reorder within same period
        const periodTasks = tasksByPeriod[activeTask.period]
        const fromIndex = periodTasks.findIndex((t) => t.id === activeTask.id)
        const toIndex = periodTasks.findIndex((t) => t.id === overTask.id)

        if (fromIndex >= 0 && toIndex >= 0) {
          await handleReorder(periodTasks, fromIndex, toIndex)
        }
      }
    },
    [tasksByPeriod, handleReorder, handleMove]
  )

  // Keyboard/menu move handlers
  const handleMoveUp = useCallback(
    async (task: Task) => {
      const periodTasks = tasksByPeriod[task.period]
      const idx = periodTasks.findIndex((t) => t.id === task.id)
      if (idx > 0) {
        await handleReorder(periodTasks, idx, idx - 1)
      }
    },
    [tasksByPeriod, handleReorder]
  )

  const handleMoveDown = useCallback(
    async (task: Task) => {
      const periodTasks = tasksByPeriod[task.period]
      const idx = periodTasks.findIndex((t) => t.id === task.id)
      if (idx < periodTasks.length - 1) {
        await handleReorder(periodTasks, idx, idx + 1)
      }
    },
    [tasksByPeriod, handleReorder]
  )

  const handleMoveToPeriod = useCallback(
    async (task: Task, targetPeriod: Period) => {
      const targetTasks = tasksByPeriod[targetPeriod]
      const newOrder = targetTasks.length > 0
        ? targetTasks[targetTasks.length - 1].order_index + 1000
        : 0
      await handleMove(task.id, { period: targetPeriod, order_index: newOrder })
    },
    [tasksByPeriod, handleMove]
  )

  const handleCopyTask = useCallback(
    async (task: Task) => {
      if (!user) return
      try {
        await tasks.create(user.id, {
          title: `${task.title} (副本)`,
          description: task.description,
          task_date: task.task_date,
          period: task.period,
          start_time: task.start_time,
          end_time: task.end_time,
          tag_id: task.tag_id,
          priority: task.priority,
          status: 'todo',
          estimated_minutes: task.estimated_minutes,
          reminder_at: task.reminder_at,
          recurrence_rule: task.recurrence_rule,
          order_index: task.order_index + 1,
        } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      } catch {
        // silently fail, toast handled by mutation
      }
    },
    [user, tasks, queryClient]
  )

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Day header */}
      <div className="sticky top-0 z-20 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDateChange(dayNav(currentDate, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className={cn('text-lg font-bold', isToday(parseISO(currentDate)) && 'text-primary')}>
                {format(parseISO(currentDate), 'M月d日 EEEE', { locale: zhCN })}
              </h2>
              <p className="text-xs text-muted-foreground">
                {doneCount}/{totalCount} 已完成
                {isMoving && ' — 移动中...'}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDateChange(dayNav(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{completionPct}%</span>
          </div>
        </div>
      </div>

      {/* Three periods with DnD */}
      <TaskDragContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 p-4 space-y-4">
          {PERIODS.map((period) => {
            const periodTasks = tasksByPeriod[period]
            const taskIds = periodTasks.map((t) => t.id)
            const PeriodIcon = PERIOD_ICONS[period]

            return (
              <section key={period} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <PeriodIcon className="h-3.5 w-3.5" />
                    {PERIOD_LABELS[period]}
                    <span className="ml-1 text-xs font-normal">
                      {periodTasks.filter((t) => t.status === 'done').length}/
                      {periodTasks.filter((t) => t.status !== 'cancelled').length}
                    </span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setNewTaskPeriod(period)}
                  >
                    <Plus className="h-3 w-3 mr-1" />添加
                  </Button>
                </div>

                <PeriodDropZone
                  period={period}
                  taskIds={taskIds}
                  isOver={dragOverPeriod === period}
                >
                  {periodTasks.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg"
                      data-droppable-period={period}
                    >
                      暂无事项，拖拽或点击添加
                    </div>
                  ) : (
                    periodTasks.map((task) => (
                      <SortableTaskItem key={task.id} task={task}>
                        {({ dragHandle, isDragging }) => (
                          <div data-droppable-period={task.period}>
                            <TaskCard
                              task={task}
                              onToggle={() => toggleTask(task)}
                              onDelete={() => deleteTaskMutation.mutate(task.id)}
                              onMoveUp={() => handleMoveUp(task)}
                              onMoveDown={() => handleMoveDown(task)}
                              onMoveToPeriod={(p) => handleMoveToPeriod(task, p)}
                              onEdit={() => { setEditingTask(task); setEditDialogOpen(true) }}
                              onCopy={() => handleCopyTask(task)}
                              dragHandle={dragHandle}
                              isDragging={isDragging}
                            />
                          </div>
                        )}
                      </SortableTaskItem>
                    ))
                  )}
                </PeriodDropZone>
              </section>
            )
          })}
        </div>

        {/* Drag overlay */}
        <DragOverlayWrapper>
          {activeDragTask ? (
            <TaskDragOverlay task={activeDragTask} />
          ) : null}
        </DragOverlayWrapper>
      </TaskDragContext>

      {/* Quick add dialog */}
      {newTaskPeriod && (
        <QuickAddDialog
          open={!!newTaskPeriod}
          onOpenChange={(open) => !open && setNewTaskPeriod(null)}
          period={newTaskPeriod}
          tagList={tagList}
          onSubmit={(data) =>
            createTaskMutation.mutate({
              title: data.title,
              task_date: currentDate,
              period: newTaskPeriod,
              priority: (data.priority as Priority) || 'normal',
              status: 'todo',
              order_index: tasksByPeriod[newTaskPeriod].length,
              tag_id: data.tag_id || undefined,
            })
          }
          isDesktop={isDesktop}
        />
      )}

      {/* Edit dialog */}
      <TaskEditDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setEditingTask(null)
        }}
        defaultDate={currentDate}
      />
    </div>
  )
}

// ---------- Task Card with Drag Handle ----------

function TaskCard({
  task,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  onMoveToPeriod,
  onEdit,
  onCopy,
  dragHandle,
  isDragging,
}: {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onMoveToPeriod: (period: Period) => void
  onEdit: () => void
  onCopy: () => void
  dragHandle?: React.ReactNode
  isDragging?: boolean
}) {
  return (
    <div
      className={cn(
        'group flex items-start gap-1.5 px-2 py-2.5 rounded-lg border transition-all',
        isDragging && 'shadow-lg ring-2 ring-primary',
        task.status === 'done'
          ? 'bg-muted/20 border-transparent'
          : 'bg-card border-border/50 hover:border-border hover:shadow-sm'
      )}
    >
      {/* Drag handle */}
      {dragHandle}

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="mt-0.5 shrink-0"
        title={task.status === 'done' ? '标记未完成' : '标记完成'}
      >
        {task.status === 'done' ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {task.tag && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: task.tag.color }}
            />
          )}
          <span
            className={cn(
              'text-sm font-medium truncate',
              task.status === 'done' && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </span>
          {task.priority === 'urgent' && task.status !== 'done' && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1">紧急</Badge>
          )}
          {task.priority === 'high' && task.status !== 'done' && (
            <Badge variant="outline" className="text-[10px] h-4 px-1 text-orange-600 border-orange-300">高</Badge>
          )}
        </div>

        {(task.start_time || task.description) && (
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            {task.start_time && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {task.start_time}
                {task.end_time && ` - ${task.end_time}`}
              </span>
            )}
            {task.description && (
              <span className="truncate">{task.description}</span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center size-7 rounded-lg hover:bg-muted transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={onEdit}>
              <Edit2 className="h-3.5 w-3.5 mr-2" />编辑
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onCopy}>
              <Edit2 className="h-3.5 w-3.5 mr-2" />复制
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onMoveUp}>
              <ArrowUp className="h-3.5 w-3.5 mr-2" />上移
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onMoveDown}>
              <ArrowDown className="h-3.5 w-3.5 mr-2" />下移
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onMoveToPeriod('morning')}>
              <MoveHorizontal className="h-3.5 w-3.5 mr-2" />移到上午
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onMoveToPeriod('afternoon')}>
              <MoveHorizontal className="h-3.5 w-3.5 mr-2" />移到下午
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onMoveToPeriod('evening')}>
              <MoveHorizontal className="h-3.5 w-3.5 mr-2" />移到晚上
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onSelect={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ---------- Drag Overlay Wrapper ----------

function DragOverlayWrapper({ children }: { children: React.ReactNode }) {
  return <DragOverlay dropAnimation={null}>{children}</DragOverlay>
}

// ---------- Quick Add Dialog ----------

function QuickAddDialog({
  open,
  onOpenChange,
  period,
  tagList,
  onSubmit,
  isDesktop,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: Period
  tagList: { id: string; name: string; color: string }[]
  onSubmit: (data: { title: string; priority?: string; tag_id?: string }) => void
  isDesktop: boolean
}) {
  const form = useForm({
    defaultValues: { title: '', priority: 'normal', tag_id: 'none' },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = form.getValues()
    if (!data.title.trim()) return
    onSubmit({
      title: data.title,
      priority: data.priority,
      tag_id: data.tag_id === 'none' ? undefined : data.tag_id,
    })
    form.reset()
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="qt-title">事项标题</Label>
        <Input
          id="qt-title"
          placeholder="快速添加事项..."
          autoFocus
          {...form.register('title')}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="qt-priority">优先级</Label>
          <Select
            defaultValue="normal"
            onValueChange={(v: string | null) => v && form.setValue('priority', v)}
          >
            <SelectTrigger id="qt-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="normal">普通</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="urgent">紧急</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="qt-tag">标签</Label>
          <Select
            defaultValue="none"
            onValueChange={(v: string | null) => v && form.setValue('tag_id', v)}
          >
            <SelectTrigger id="qt-tag">
              <SelectValue placeholder="无" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无标签</SelectItem>
              {tagList.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full">
        添加 {PERIOD_LABELS[period]} 事项
      </Button>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>快速添加 — {PERIOD_LABELS[period]}</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>快速添加 — {PERIOD_LABELS[period]}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">{content}</div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  )
}
