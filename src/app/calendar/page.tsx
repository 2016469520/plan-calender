'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { CalendarHeader } from '@/components/calendar/calendar-header'
import { MonthView } from '@/components/calendar/month-view'
import { WeekView } from '@/components/calendar/week-view'
import { DayView } from '@/components/calendar/day-view'
import type { CalendarView } from '@/types'
import { todayStr } from '@/lib/utils/date'
import { STORAGE_KEYS } from '@/lib/constants'

function getInitialView(): CalendarView {
  if (typeof window === 'undefined') return 'month'
  const saved = localStorage.getItem(STORAGE_KEYS.lastView)
  if (saved === 'month' || saved === 'week' || saved === 'day') return saved
  return 'month'
}

function getInitialDate(): string {
  if (typeof window === 'undefined') return todayStr()
  return localStorage.getItem(STORAGE_KEYS.lastDate) || todayStr()
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<CalendarView>(getInitialView)
  const [currentDate, setCurrentDate] = useState(getInitialDate)

  const handleViewChange = useCallback((view: CalendarView) => {
    setCurrentView(view)
    localStorage.setItem(STORAGE_KEYS.lastView, view)
  }, [])

  const handleDateChange = useCallback((date: string) => {
    setCurrentDate(date)
    localStorage.setItem(STORAGE_KEYS.lastDate, date)
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentView={currentView}
        currentDate={currentDate}
        onViewChange={handleViewChange}
        onDateChange={handleDateChange}
      />

      <div className="flex-1 overflow-hidden">
        {currentView === 'month' && (
          <MonthView currentDate={currentDate} onDateClick={handleDateChange} onViewChange={handleViewChange} />
        )}
        {currentView === 'week' && (
          <WeekView currentDate={currentDate} />
        )}
        {currentView === 'day' && (
          <DayView currentDate={currentDate} onDateChange={handleDateChange} />
        )}
      </div>
    </div>
  )
}
