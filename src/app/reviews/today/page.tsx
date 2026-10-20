'use client'

import { useRouter } from 'next/navigation'
import { DailyReviewForm } from '@/components/reviews/daily-review-form'
import { formatDisplayDate, formatWeekday } from '@/lib/utils/date'
import { useToday } from '@/hooks/use-today'
import { Button } from '@/components/ui/button'
import { History } from 'lucide-react'

export default function ReviewTodayPage() {
  const router = useRouter()
  const today = useToday()

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">每日总结</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDisplayDate(today)} {formatWeekday(today)}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/reviews')}
        >
          <History className="h-4 w-4 mr-1" />
          查看历史记录
        </Button>
      </div>

      <DailyReviewForm date={today} />
    </div>
  )
}
