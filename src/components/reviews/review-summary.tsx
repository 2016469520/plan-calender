'use client'

import { Card, CardContent } from '@/components/ui/card'
import { calculateMonthlyReviewSummary } from '@/lib/utils/review-stats'
import type { DailyReview } from '@/types'
import { Star, Smile, Zap, TrendingUp, Flame, CalendarCheck } from 'lucide-react'

interface ReviewSummaryProps {
  reviews: DailyReview[]
  year: number
  month: number
}

export function ReviewSummary({ reviews, year, month }: ReviewSummaryProps) {
  const summary = calculateMonthlyReviewSummary(reviews, year, month)

  const stats = [
    {
      label: '已评价',
      value: `${summary.reviewedDays}/${summary.totalDays}`,
      sub: '天',
      icon: CalendarCheck,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: '平均评分',
      value: summary.avgScore != null ? summary.avgScore.toFixed(1) : '—',
      sub: '/10',
      icon: Star,
      color: 'text-amber-500',
    },
    {
      label: '平均完成度',
      value: summary.avgCompletion != null ? `${Math.round(summary.avgCompletion)}%` : '—',
      sub: '',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      label: '平均心情',
      value: summary.avgMood != null ? summary.avgMood.toFixed(1) : '—',
      sub: '/5',
      icon: Smile,
      color: 'text-rose-500',
    },
  ]

  const streakStats = [
    {
      label: '当前连续',
      value: summary.currentStreak,
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      label: '最长连续',
      value: summary.longestStreak,
      icon: Zap,
      color: 'text-violet-500',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-none">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`h-5 w-5 shrink-0 ${s.color}`} />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-lg font-bold tabular-nums">
                  {s.value}
                  {s.sub && <span className="text-xs font-normal text-muted-foreground ml-0.5">{s.sub}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        {streakStats.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <s.icon className={`h-4 w-4 ${s.color}`} />
            <span>{s.label}</span>
            <span className="font-semibold tabular-nums text-foreground">{s.value}</span>
            <span>天</span>
          </div>
        ))}
      </div>
    </div>
  )
}
