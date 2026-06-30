'use client'

import { useAuth } from '@/providers/auth-provider'
import { DayView } from '@/components/calendar/day-view'
import { DailyReviewForm } from '@/components/reviews/daily-review-form'
import { HabitCheckin } from '@/components/habits/habit-checkin'
import { todayStr } from '@/lib/utils/date'
import { useState } from 'react'

export default function TodayPage() {
  const { user } = useAuth()
  const [currentDate] = useState(todayStr())

  if (!user) return null

  return (
    <div className="flex flex-col h-full overflow-auto">
      <DayView currentDate={currentDate} onDateChange={() => {}} />

      <div className="p-4 space-y-6 border-t">
        <div className="max-w-2xl mx-auto space-y-6">
          <HabitCheckin compact />
          <DailyReviewForm date={currentDate} />
        </div>
      </div>
    </div>
  )
}
