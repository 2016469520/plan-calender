'use client'

import { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { type CalendarView } from '@/types'
import { navigateDate, todayStr } from '@/lib/utils/date'
import { KEYBOARD_SHORTCUTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CalendarHeaderProps {
  currentView: CalendarView
  currentDate: string
  onViewChange: (view: CalendarView) => void
  onDateChange: (date: string) => void
  onNewTask: () => void
}

const VIEW_OPTIONS: { value: CalendarView; label: string; shortcut: string }[] = [
  { value: 'month', label: '月', shortcut: 'M' },
  { value: 'week', label: '周', shortcut: 'W' },
  { value: 'day', label: '日', shortcut: 'D' },
]

export function CalendarHeader({
  currentView,
  currentDate,
  onViewChange,
  onDateChange,
  onNewTask,
}: CalendarHeaderProps) {
  const displayDate = (() => {
    const d = parseISO(currentDate)
    switch (currentView) {
      case 'month':
        return format(d, 'yyyy年 M月', { locale: zhCN })
      case 'week':
        return format(d, "yyyy年 M月 '第'w周", { locale: zhCN })
      case 'day':
        return format(d, 'yyyy年 M月 d日 EEEE', { locale: zhCN })
    }
  })()

  const goToday = useCallback(() => {
    onDateChange(todayStr())
  }, [onDateChange])

  const goPrev = useCallback(() => {
    onDateChange(navigateDate(currentDate, currentView, -1))
  }, [currentDate, currentView, onDateChange])

  const goNext = useCallback(() => {
    onDateChange(navigateDate(currentDate, currentView, 1))
  }, [currentDate, currentView, onDateChange])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()
      if (key === KEYBOARD_SHORTCUTS.today) goToday()
      if (key === KEYBOARD_SHORTCUTS.monthView) onViewChange('month')
      if (key === KEYBOARD_SHORTCUTS.weekView) onViewChange('week')
      if (key === KEYBOARD_SHORTCUTS.dayView) onViewChange('day')
      if (key === KEYBOARD_SHORTCUTS.newTask) {
        e.preventDefault()
        onNewTask()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goToday, onViewChange, onNewTask])

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="flex items-center justify-between px-4 py-2 gap-2">
        {/* Left: Navigation */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goPrev} title="上一页">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium min-w-[120px]"
            onClick={goToday}
            title="回到今天"
          >
            {displayDate}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goNext} title="下一页">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="ml-2 h-8" onClick={goToday}>
            今天
          </Button>
        </div>

        {/* Center: View toggle (Desktop) */}
        <div className="hidden sm:flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
          {VIEW_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-3 text-xs rounded-md transition-all',
                currentView === opt.value
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => onViewChange(opt.value)}
              title={`${opt.label}视图 (${opt.shortcut})`}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Button variant="default" size="sm" className="h-8" onClick={onNewTask} title="新建事项 (N)">
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">新建</span>
          </Button>
        </div>
      </div>

      {/* Mobile view toggle */}
      <div className="sm:hidden flex justify-center pb-2">
        <div className="inline-flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
          {VIEW_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-4 text-xs rounded-md',
                currentView === opt.value
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground'
              )}
              onClick={() => onViewChange(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </header>
  )
}
