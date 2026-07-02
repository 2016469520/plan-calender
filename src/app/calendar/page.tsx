'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { CalendarHeader } from '@/components/calendar/calendar-header'
import { MonthView } from '@/components/calendar/month-view'
import { WeekView } from '@/components/calendar/week-view'
import { DayView } from '@/components/calendar/day-view'
import { CategoryView } from '@/components/calendar/category-view'
import { TaskEditDialog } from '@/components/plans/task-edit-dialog'
import type { CalendarView, Task } from '@/types'
import { todayStr } from '@/lib/utils/date'
import { STORAGE_KEYS } from '@/lib/constants'

type PresentationMode = 'time' | 'category'

function getInitialView(): CalendarView {
  if (typeof window === 'undefined') return 'month'
  const saved = localStorage.getItem(STORAGE_KEYS.lastView)
  if (saved === 'month' || saved === 'week' || saved === 'day') return saved
  return 'month'
}

function getInitialMode(): PresentationMode {
  if (typeof window === 'undefined') return 'time'
  const saved = localStorage.getItem('plan-calendar-presentation-mode')
  if (saved === 'time' || saved === 'category') return saved
  return 'time'
}

function getInitialDate(): string {
  if (typeof window === 'undefined') return todayStr()
  return localStorage.getItem(STORAGE_KEYS.lastDate) || todayStr()
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<CalendarView>(getInitialView)
  const [presentationMode, setPresentationMode] = useState<PresentationMode>(getInitialMode)
  const [currentDate, setCurrentDate] = useState(getInitialDate)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTaskTagId, setNewTaskTagId] = useState<string | undefined>()

  const handleViewChange = useCallback((view: CalendarView) => {
    setCurrentView(view)
    localStorage.setItem(STORAGE_KEYS.lastView, view)
    // Switching a time view also sets mode to 'time'
    setPresentationMode('time')
    localStorage.setItem('plan-calendar-presentation-mode', 'time')
  }, [])

  const handlePresentationModeChange = useCallback((mode: PresentationMode) => {
    setPresentationMode(mode)
    localStorage.setItem('plan-calendar-presentation-mode', mode)
  }, [])

  const handleDateChange = useCallback((date: string) => {
    setCurrentDate(date)
    localStorage.setItem(STORAGE_KEYS.lastDate, date)
  }, [])

  const handleNewTask = useCallback((defaultTagId?: string) => {
    setEditingTask(null)
    setNewTaskTagId(defaultTagId)
    setDialogOpen(true)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setNewTaskTagId(undefined)
    setDialogOpen(true)
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentView={currentView}
        currentDate={currentDate}
        presentationMode={presentationMode}
        onViewChange={handleViewChange}
        onDateChange={handleDateChange}
        onNewTask={() => handleNewTask()}
        onPresentationModeChange={handlePresentationModeChange}
      />

      <div className="flex-1 overflow-hidden">
        {presentationMode === 'time' && (
          <>
            {currentView === 'month' && (
              <MonthView currentDate={currentDate} onDateClick={handleDateChange} onViewChange={handleViewChange} />
            )}
            {currentView === 'week' && (
              <WeekView currentDate={currentDate} />
            )}
            {currentView === 'day' && (
              <DayView currentDate={currentDate} onDateChange={handleDateChange} />
            )}
          </>
        )}

        {presentationMode === 'category' && (
          <CategoryView
            onEditTask={handleEditTask}
            onNewTask={handleNewTask}
            newTaskDialogOpen={dialogOpen}
            setNewTaskDialogOpen={setDialogOpen}
            defaultDate={currentDate}
          />
        )}
      </div>

      <TaskEditDialog
        task={editingTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultDate={currentDate}
        defaultTagId={newTaskTagId}
      />
    </div>
  )
}
