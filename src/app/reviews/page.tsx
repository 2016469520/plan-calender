'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { ReviewSummary } from '@/components/reviews/review-summary'
import { ReviewCalendar } from '@/components/reviews/review-calendar'
import { ReviewTimeline } from '@/components/reviews/review-timeline'
import { ReviewDetail } from '@/components/reviews/review-detail'
import { DailyReviewForm } from '@/components/reviews/daily-review-form'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { todayStr } from '@/lib/utils/date'
import { getMonthRange } from '@/lib/utils/date'
import type { DailyReview } from '@/types'
import { CalendarDays, List, ClipboardList } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ReviewMode = 'calendar' | 'timeline'

function getInitialMode(): ReviewMode {
  if (typeof window === 'undefined') return 'calendar'
  const saved = localStorage.getItem('plan-calendar-review-mode')
  if (saved === 'calendar' || saved === 'timeline') return saved
  return 'calendar'
}

export default function ReviewsPage() {
  const { user } = useAuth()
  const { dailyReviews } = useRepos()
  const router = useRouter()

  const [mode, setMode] = useState<ReviewMode>(getInitialMode)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [detailReview, setDetailReview] = useState<DailyReview | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [composeDate, setComposeDate] = useState<string | null>(null)
  const today = todayStr()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth() + 1

  // Load reviews for a wide range to support month view and stats
  const range = useMemo(() => {
    const start = `${year - 1}-01-01`
    const end = `${year + 1}-12-31`
    return { start, end }
  }, [year])

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', range.start, range.end],
    queryFn: () => dailyReviews.getByDateRange(user!.id, range),
    enabled: !!user,
  })

  const handleModeChange = useCallback((newMode: ReviewMode) => {
    setMode(newMode)
    localStorage.setItem('plan-calendar-review-mode', newMode)
  }, [])

  const handleDateSelect = useCallback(
    (date: string) => {
      setSelectedDate(date)
      const review = reviews.find((r) => r.review_date === date)
      if (review) {
        setDetailReview(review)
        setDetailOpen(true)
      } else if (date <= today) {
        // Allow composing review for past dates without a review
        setComposeDate(date)
      }
    },
    [reviews, today]
  )

  const handleTimelineSelect = useCallback((review: DailyReview) => {
    setDetailReview(review)
    setSelectedDate(review.review_date)
    setDetailOpen(true)
  }, [])

  // Find previous/next reviews for navigation in detail view
  const sortedDates = useMemo(() => {
    return [...reviews]
      .sort((a, b) => a.review_date.localeCompare(b.review_date))
      .map((r) => r.review_date)
  }, [reviews])

  const currentIndex = selectedDate ? sortedDates.indexOf(selectedDate) : -1

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevDate = sortedDates[currentIndex - 1]
      const prevReview = reviews.find((r) => r.review_date === prevDate)
      if (prevReview) {
        setSelectedDate(prevDate)
        setDetailReview(prevReview)
      }
    }
  }, [currentIndex, sortedDates, reviews])

  const handleNext = useCallback(() => {
    if (currentIndex < sortedDates.length - 1) {
      const nextDate = sortedDates[currentIndex + 1]
      const nextReview = reviews.find((r) => r.review_date === nextDate)
      if (nextReview) {
        setSelectedDate(nextDate)
        setDetailReview(nextReview)
      }
    }
  }, [currentIndex, sortedDates, reviews])

  if (!user) return null

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">复盘记录</h1>
          <p className="text-sm text-muted-foreground mt-1">
            回顾过去的每一天
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          <Button
            variant={mode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            className="h-8"
            onClick={() => handleModeChange('calendar')}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            月历
          </Button>
          <Button
            variant={mode === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            className="h-8"
            onClick={() => handleModeChange('timeline')}
          >
            <List className="h-4 w-4 mr-1" />
            时间线
          </Button>
        </div>
      </div>

      {/* Monthly summary */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <ReviewSummary reviews={reviews} year={year} month={month} />
      )}

      {/* Main content */}
      {isLoading ? (
        <Skeleton className="h-96" />
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <div>
            <p className="text-sm text-muted-foreground">还没有评价记录</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              每天结束时写下一份评价，记录自己的成长
            </p>
          </div>
          <Button onClick={() => router.push('/today')}>
            写下今天的评价
          </Button>
        </div>
      ) : mode === 'calendar' ? (
        <ReviewCalendar
          currentMonth={currentMonth}
          reviews={reviews}
          selectedDate={selectedDate}
          onMonthChange={setCurrentMonth}
          onDateSelect={handleDateSelect}
        />
      ) : (
        <ReviewTimeline reviews={reviews} onSelect={handleTimelineSelect} />
      )}

      {/* Detail drawer */}
      <ReviewDetail
        review={detailReview}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={currentIndex > 0}
        hasNext={currentIndex < sortedDates.length - 1}
      />

      {/* Compose review for blank date */}
      {composeDate && (
        <ReviewDetail
          review={{
            id: '',
            user_id: user.id,
            review_date: composeDate,
            created_at: '',
            updated_at: '',
          }}
          open={!!composeDate}
          onOpenChange={(o) => { if (!o) setComposeDate(null); }}
        />
      )}
    </div>
  )
}
