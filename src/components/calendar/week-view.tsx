'use client'

import { useMemo, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { getWeekRange, format, parseISO, isToday } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import { PERIOD_LABELS, WEEKDAY_NAMES } from '@/lib/constants'
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
import { Circle, CheckCircle2, Clock, AlertCircle, GripVertical, ChevronRight } from 'lucide-react'

const MAX_VISIBLE_TASKS = 3

interface WeekViewProps {
  currentDate: string
  onTaskClick?: (task: Task) => void
  onOverflowClick?: (date: string, period: Period, tasks: Task[]) => void
}

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

export function WeekView({ currentDate, onTaskClick, onOverflowClick }: WeekViewProps) {
  const { user } = useAuth()
  const { tasks } = useRepos()
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null)
  const { handleMove, handleReorder } = useTaskDnd()

  const weekData = useMemo(() => getWeekRange(currentDate), [currentDate])

  const { data: weekTasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id, 'week', weekData.start, weekData.end],
    queryFn: () => tasks.getByDateRange(user!.id, weekData),
    enabled: !!user,
  })

  const tasksByDatePeriod = useMemo(() => {
    const map: Record<string, Record<Period, Task[]>> = {}
    for (const day of weekData.days) {
      map[day] = { morning: [], afternoon: [], evening: [] }
    }
    for (const task of weekTasks) {
      if (!task.task_date) continue
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

      const targetDate = (over.data.current as { taskDate?: string })?.taskDate
      const targetPeriod = (over.data.current as { period?: Period })?.period
      const overTask = (over.data.current as { task?: Task })?.task

      if (targetDate && targetPeriod) {
        if (targetDate === activeTask.task_date && targetPeriod === activeTask.period && overTask) {
          const periodTasks = tasksByDatePeriod[targetDate]?.[targetPeriod] || []
          const fromIndex = periodTasks.findIndex((t) => t.id === activeTask.id)
          const toIndex = periodTasks.findIndex((t) => t.id === overTask.id)
          if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
            await handleReorder(periodTasks, fromIndex, toIndex)
            return
          }
        }

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
      <div className="flex flex-col h-full overflow-hidden">
        {/* Day headers */}
        <div className="sticky top-0 z-20 bg-background border-b shrink-0">
          <div className="flex">
            <div className="w-16 shrink-0" />
            {weekData.days.map((day) => {
              const d = parseISO(day)
              const today = isToday(d)
              return (
                <div
                  key={day}
                  className={cn(
                    'flex-1 text-center py-2 border-l min-w-[80px]',
                    today && 'bg-primary/5'
                  )}
                >
                  <div className="text-xs text-muted-foreground">
                    {WEEKDAY_NAMES[d.getDay()]}
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
          <div className="min-w-[640px]">
            {PERIODS.map((period) => (
              <div key={period} className="border-b">
                <div className="flex">
                  {/* Period label */}
                  <div className="w-16 shrink-0 bg-muted/30 border-r flex flex-col items-center justify-center py-2 sticky left-0 z-10">
                    <span className="text-xs font-medium text-muted-foreground">
                      {PERIOD_LABELS[period]}
                    </span>
                  </div>

                  {/* Day columns */}
                  {weekData.days.map((day) => {
                    const dayTasks = tasksByDatePeriod[day]?.[period] || []
                    const today = isToday(parseISO(day))
                    const visibleTasks = dayTasks.slice(0, MAX_VISIBLE_TASKS)
                    const overflowCount = dayTasks.length - MAX_VISIBLE_TASKS

                    return (
                      <DroppableCell
                        key={`${day}-${period}`}
                        id={`cell-${day}-${period}`}
                        taskDate={day}
                        period={period}
                        className={cn(
                          'flex-1 border-l p-1 min-w-[80px]',
                          today && 'bg-primary/[0.02]'
                        )}
                      >
                        <div className="space-y-1 min-h-[72px]">
                          {visibleTasks.map((task) => (
                            <DraggableTaskChip
                              key={task.id}
                              task={task}
                              taskDate={day}
                              period={period}
                              onClick={onTaskClick}
                            />
                          ))}
                          {overflowCount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onOverflowClick?.(day, period, dayTasks)
                              }}
                              className="w-full text-[10px] text-muted-foreground hover:text-foreground px-1 py-0.5 rounded hover:bg-accent transition-colors flex items-center gap-0.5"
                            >
                              <ChevronRight className="h-2.5 w-2.5" />
                              还有 {overflowCount} 项
                            </button>
                          )}
                        </div>
                      </DroppableCell>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
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
  onClick,
}: {
  task: Task
  taskDate: string
  period: Period
  onClick?: (task: Task) => void
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

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger onClick if not dragging
    if (!transform && onClick) {
      e.stopPropagation()
      onClick(task)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={mergedStyle}
      onClick={handleClick}
      className={cn(
        'group rounded-md px-2 py-1 text-xs cursor-pointer',
        'border border-transparent hover:border-border hover:shadow-sm',
        'transition-all min-w-0',
        isDragging && 'opacity-50 shadow-lg',
        task.status === 'done'
          ? 'bg-muted/30 text-muted-foreground line-through'
          : 'bg-card border-border/50'
      )}
      title={task.title}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {/* Drag handle — separate from click */}
        <button
          className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
          tabIndex={-1}
          onPointerDown={(e) => e.stopPropagation()}
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
        <span className="truncate flex-1 min-w-0">{task.title}</span>

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
