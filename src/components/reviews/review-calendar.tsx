'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { todayStr, format, parseISO } from '@/lib/utils/date'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns'
import type { DailyReview } from '@/types'
import { Star, Smile, ChevronLeft, ChevronRight } from 'lucide-react'

interface ReviewCalendarProps {
  currentMonth: Date
  reviews: DailyReview[]
  selectedDate: string | null
  onMonthChange: (date: Date) => void
  onDateSelect: (date: string) => void
}

export function ReviewCalendar({
  currentMonth,
  reviews,
  selectedDate,
  onMonthChange,
  onDateSelect,
}: ReviewCalendarProps) {
  const today = todayStr()

  const reviewMap = useMemo(() => {
    const map = new Map<string, DailyReview>()
    for (const r of reviews) {
      map.set(r.review_date, r)
    }
    return map
  }, [reviews])

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const days = eachDayOfInterval({ start: calStart, end: calEnd })

    const result: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7))
    }
    return result
  }, [currentMonth])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const isFutureDate = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return dateStr > today
  }

  return (
    <div className="space-y-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {format(currentMonth, 'yyyy年M月')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onMonthChange(new Date())}
          >
            本月
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden text-center">
        {/* Weekday headers */}
        {weekDays.map((d) => (
          <div
            key={d}
            className="bg-card py-1.5 text-xs text-muted-foreground font-medium"
          >
            {d}
          </div>
        ))}

        {/* Day cells */}
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const review = reviewMap.get(dateStr)
            const isSelected = dateStr === selectedDate
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isTodayDate = isToday(day)
            const isFuture = isFutureDate(day)
            const hasReview = !!review
            const score = review?.score

            return (
              <button
                key={`${wi}-${di}`}
                onClick={() => !isFuture && onDateSelect(dateStr)}
                disabled={isFuture}
                className={cn(
                  'bg-card p-1.5 min-h-[3rem] flex flex-col items-center justify-center gap-0.5 transition-colors',
                  'hover:bg-accent',
                  !isCurrentMonth && 'opacity-30',
                  isSelected && 'ring-2 ring-primary ring-inset',
                  isTodayDate && !isSelected && 'ring-1 ring-primary/30',
                  isFuture && 'cursor-default hover:bg-card opacity-40'
                )}
              >
                <span
                  className={cn(
                    'text-xs tabular-nums',
                    isTodayDate && 'font-bold text-primary'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {hasReview && (
                  <div className="flex items-center gap-0.5">
                    {score != null && (
                      <span
                        className={cn(
                          'text-[10px] font-semibold tabular-nums',
                          score >= 8
                            ? 'text-emerald-500'
                            : score >= 6
                              ? 'text-amber-500'
                              : 'text-red-400'
                        )}
                      >
                        {score}
                      </span>
                    )}
                    {review?.mood != null && review.mood >= 4 && (
                      <Smile className="h-2.5 w-2.5 text-rose-400" />
                    )}
                  </div>
                )}
                {hasReview && score == null && review?.mood == null && (
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
