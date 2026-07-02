'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { filterReviews, type ReviewFilterOptions } from '@/lib/utils/review-stats'
import { formatDisplayDate, formatWeekday } from '@/lib/utils/date'
import type { DailyReview } from '@/types'
import { Star, Smile, Zap, TrendingUp, ChevronRight, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 20

interface ReviewTimelineProps {
  reviews: DailyReview[]
  onSelect: (review: DailyReview) => void
}

export function ReviewTimeline({ reviews, onSelect }: ReviewTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [filters, setFilters] = useState<ReviewFilterOptions>({})
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const hasFilters = filters.month || filters.scoreMin != null || filters.scoreMax != null || filters.mood != null || filters.hasTextOnly
    if (!hasFilters) {
      // Default: sort by date descending
      return [...reviews].sort((a, b) => b.review_date.localeCompare(a.review_date))
    }
    return filterReviews(reviews, filters)
  }, [reviews, filters])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const hasFilters = filters.month || filters.scoreMin != null || filters.scoreMax != null || filters.mood != null || filters.hasTextOnly

  // Generate month options from available reviews
  const monthOptions = useMemo(() => {
    const months = new Set<string>()
    for (const r of reviews) {
      months.add(r.review_date.slice(0, 7))
    }
    return [...months].sort().reverse()
  }, [reviews])

  const clearFilters = () => {
    setFilters({})
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={showFilters ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          筛选
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-3.5 w-3.5 mr-1" />
            清除
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <Label className="text-xs">月份</Label>
            <Select
              value={filters.month ?? ''}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, month: v || undefined }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                {monthOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">最低评分</Label>
            <Select
              value={filters.scoreMin?.toString() ?? ''}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, scoreMin: v ? Number(v) : undefined }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="不限" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">不限</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    ≥ {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">心情</Label>
            <Select
              value={filters.mood?.toString() ?? ''}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, mood: v ? Number(v) : undefined }))
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部</SelectItem>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {'😔😐🙂😊🤩'[n - 1]} {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end pb-0.5">
            <div className="flex items-center gap-2">
              <Switch
                id="has-text"
                checked={filters.hasTextOnly ?? false}
                onCheckedChange={(v) =>
                  setFilters((f) => ({ ...f, hasTextOnly: v || undefined }))
                }
              />
              <Label htmlFor="has-text" className="text-xs">
                仅有总结
              </Label>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">当前筛选没有匹配记录</p>
          {hasFilters && (
            <Button variant="link" size="sm" onClick={clearFilters} className="mt-2">
              清除筛选
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((review) => (
            <button
              key={review.id}
              onClick={() => onSelect(review)}
              className="w-full text-left"
            >
              <Card className="shadow-none hover:shadow-sm transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {formatDisplayDate(review.review_date)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatWeekday(review.review_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {review.score != null && (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 text-amber-500" />
                            <span className="font-semibold">{review.score}</span>
                            <span className="text-muted-foreground">/10</span>
                          </span>
                        )}
                        {review.subjective_completion != null && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-3 w-3" />
                            {review.subjective_completion}%
                          </span>
                        )}
                        {review.mood != null && (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <Smile className="h-3 w-3 text-rose-400" />
                            {review.mood}/5
                          </span>
                        )}
                        {review.energy != null && (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <Zap className="h-3 w-3 text-amber-400" />
                            {review.energy}/5
                          </span>
                        )}
                      </div>

                      {review.achievement && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          <span className="font-medium text-foreground/70">成果：</span>
                          {review.achievement}
                        </p>
                      )}

                      {review.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {review.summary}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground mt-1" />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}

          {hasMore && (
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                加载更多（{filtered.length - visibleCount} 条）
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
