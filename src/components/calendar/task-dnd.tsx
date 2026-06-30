'use client'

import { useState, useCallback, type ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { GripVertical, MoveHorizontal } from 'lucide-react'
import type { Task, Period } from '@/types'

// ---------- Sortable Task Item ----------

interface SortableTaskItemProps {
  task: Task
  children: (props: {
    dragHandle: ReactNode
    isDragging: boolean
  }) => ReactNode
}

export function SortableTaskItem({ task, children }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  const dragHandle = (
    <button
      className="flex items-center justify-center w-5 h-full cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0"
      {...attributes}
      {...listeners}
      tabIndex={-1}
      aria-label={`拖拽排序: ${task.title}`}
    >
      <GripVertical className="h-3.5 w-3.5" />
    </button>
  )

  return (
    <div ref={setNodeRef} style={style}>
      {children({ dragHandle, isDragging })}
    </div>
  )
}

// ---------- Period Drop Zone ----------

interface PeriodDropZoneProps {
  period: Period
  taskIds: string[]
  children: ReactNode
  isOver?: boolean
  className?: string
}

export function PeriodDropZone({
  period,
  taskIds,
  children,
  isOver,
  className,
}: PeriodDropZoneProps) {
  return (
    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
      <div
        data-droppable-period={period}
        className={cn(
          'transition-colors rounded-lg',
          isOver && 'bg-primary/5 ring-1 ring-primary/20'
        )}
      >
        <div className={cn('space-y-1.5', className)}>
          {children}
        </div>
      </div>
    </SortableContext>
  )
}

// ---------- DnD Context Wrapper ----------

interface TaskDragContextProps {
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
  onDragStart?: (event: DragStartEvent) => void
  onDragOver?: (event: DragOverEvent) => void
}

export function TaskDragContext({
  children,
  onDragEnd,
  onDragStart,
  onDragOver,
}: TaskDragContextProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  )
}

// ---------- Drag Overlay Content ----------

export function TaskDragOverlay({ task }: { task: Task }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg border shadow-lg bg-card',
        task.status === 'done' ? 'opacity-70' : ''
      )}
    >
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      <span className={cn(
        'text-sm font-medium truncate',
        task.status === 'done' && 'line-through text-muted-foreground'
      )}>
        {task.title}
      </span>
    </div>
  )
}
