'use client'

import { useMemo, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { getWeekRange, format, parseISO, isToday } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import { PERIOD_LABELS } from '@/lib/constants'
import { useTaskDnd } from '@/hooks/use-task-dnd'
import {
  TaskDragContext,
  TaskDragOverlay,
} from '@/components/calendar/task-dnd'
import {
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import type { Task, Period } from '@/types'
import { Circle, CheckCircle2, Clock, AlertCircle, Plus, GripVertical } from 'lucide-react'

interface WeekViewProps {
  currentDate: string
}

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

export function WeekView({ currentDate }: WeekViewProps) {
  const { user } = useAuth()
  const { tasks } = useRepos()
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null)
  const { handleMove, handleReorder, isMoving } = useTaskDnd()

  const weekData = useMemo(() => getWeekRange(currentDate), [currentDate])

  const { data: weekTasks = [], isLoading } = useQuery({
    queryKey: ['tasks', 'week', weekData.start, weekData.end],
    queryFn: () => tasks.getByDateRange(user!.id, weekData),
    enabled: !!user,
  })

  const tasksByDatePeriod = useMemo(() => {
    const map: Record<string, Record<Period, Task[]>> = {}
    for (const day of weekData.days) {
      map[day] = { morning: [], afternoon: [], evening: [] }
    }
    for (const task of weekTasks) {
      if (map[task.task_date]) {
        map[task.task_date][task.period].push(task)
      }
    }
    for (const day of weekData.days) {
      for (const period of PERIODS) {
        map[day][period].sort((a, b) => a.order_index - b.order_index)
      }
    }
    return map
  }, [weekTasks, weekData.days])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = (event.active.data.current as { task?: Task })?.task
    if (task) setActiveDragTask(task)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveDragTask(null)

      if (!over) return

      const activeTask = (active.data.current as { task?: Task })?.task
      if (!activeTask) return

      // Get target date and period from the drop target
      const targetDate = (over.data.current as { taskDate?: string })?.taskDate
      const targetPeriod = (over.data.current as { period?: Period })?.period
      const overTask = (over.data.current as { task?: Task })?.task

      if (targetDate && targetPeriod) {
        // If dropping on same date and period, check for reorder
        if (targetDate === activeTask.task_date && targetPeriod === activeTask.period && overTask) {
          const periodTasks = tasksByDatePeriod[targetDate]?.[targetPeriod] || []
          const fromIndex = periodTasks.findIndex((t) => t.id === activeTask.id)
          const toIndex = periodTasks.findIndex((t) => t.id === overTask.id)
          if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
            await handleReorder(periodTasks, fromIndex, toIndex)
            return
          }
        }

        // Cross date/period move
        if (targetDate !== activeTask.task_date || targetPeriod !== activeTask.period) {
          const targetTasks = tasksByDatePeriod[targetDate]?.[targetPeriod] || []
          const newOrder = targetTasks.length > 0
            ? targetTasks[targetTasks.length - 1].order_index + 1000
            : 0
          await handleMove(activeTask.id, {
            task_date: targetDate,
            period: targetPeriod,
            order_index: newOrder,
          })
        }
      }
    },
    [tasksByDatePeriod, handleReorder, handleMove]
  )

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <TaskDragContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full overflow-auto">
        {/* Day headers */}
        <div className="sticky top-0 z-20 bg-background border-b">
          <div className="flex">
            <div className="w-16 shrink-0" />
            {weekData.days.map((day) => {
              const d = parseISO(day)
              const today = isToday(d)
              return (
                <div
                  key={day}
                  className={cn(
                    'flex-1 text-center py-2 border-l',
                    today && 'bg-primary/5'
                  )}
                >
                  <div className="text-xs text-muted-foreground">
                    {format(d, 'EEE')}
                  </div>
                  <div
                    className={cn(
                      'text-lg font-semibold',
                      today && 'text-primary'
                    )}
                  >
                    {format(d, 'd')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Three periods × seven days grid */}
        <div className="flex-1 overflow-auto">
          {PERIODS.map((period) => (
            <div key={period} className="border-b">
              <div className="flex min-h-[120px]">
                {/* Period label */}
                <div className="w-16 shrink-0 bg-muted/30 border-r flex flex-col items-center justify-center py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {PERIOD_LABELS[period]}
                  </span>
                </div>

                {/* Day columns */}
                {weekData.days.map((day) => {
                  const dayTasks = tasksByDatePeriod[day]?.[period] || []
                  const today = isToday(parseISO(day))

                  return (
                    <DroppableCell
                      key={`${day}-${period}`}
                      id={`cell-${day}-${period}`}
                      taskDate={day}
                      period={period}
                      className={cn(
                        'flex-1 border-l p-1 space-y-1 min-h-[80px]',
                        today && 'bg-primary/[0.02]'
                      )}
                    >
                      {dayTasks.map((task) => (
                        <DraggableTaskChip
                          key={task.id}
                          task={task}
                          taskDate={day}
                          period={period}
                        />
                      ))}
                    </DroppableCell>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeDragTask ? (
          <TaskDragOverlay task={activeDragTask} />
        ) : null}
      </DragOverlay>
    </TaskDragContext>
  )
}

// ---------- Droppable Cell ----------

function DroppableCell({
  id,
  taskDate,
  period,
  children,
  className,
}: {
  id: string
  taskDate: string
  period: Period
  children: React.ReactNode
  className?: string
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { taskDate, period },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        'transition-colors',
        isOver && 'bg-primary/10 ring-1 ring-primary/30'
      )}
    >
      {children}
    </div>
  )
}

// ---------- Draggable Task Chip ----------

function DraggableTaskChip({
  task,
  taskDate,
  period,
}: {
  task: Task
  taskDate: string
  period: Period
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task, taskDate, period },
    })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined

  const mergedStyle = {
    ...style,
    borderLeftColor: task.tag?.color || 'transparent',
    borderLeftWidth: task.tag?.color ? '3px' : '1px',
  }

  return (
    <div
      ref={setNodeRef}
      style={mergedStyle}
      className={cn(
        'group rounded-md px-2 py-1 text-xs',
        'border border-transparent hover:border-border hover:shadow-sm',
        'transition-all',
        isDragging && 'opacity-50 shadow-lg',
        task.status === 'done'
          ? 'bg-muted/30 text-muted-foreground line-through'
          : 'bg-card border-border/50'
      )}
      title={task.title}
    >
      <div className="flex items-center gap-1.5">
        {/* Drag handle */}
        <button
          className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
          tabIndex={-1}
        >
          <GripVertical className="h-3 w-3" />
        </button>

        {/* Status icon */}
        {task.status === 'done' ? (
          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
        ) : task.priority === 'urgent' ? (
          <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
        ) : (
          <Circle className="h-3 w-3 text-muted-foreground shrink-0" />
        )}

        {/* Title */}
        <span className="truncate flex-1">{task.title}</span>

        {/* Time indicator */}
        {task.start_time && (
          <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            {task.start_time}
          </span>
        )}
      </div>
    </div>
  )
}
