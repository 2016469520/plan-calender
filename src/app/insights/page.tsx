'use client'

import { useMemo } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import {
  getCalendarMonthRange,
  format,
  parseISO,
  addDays,
  toDateStr,
} from '@/lib/utils/date'
import { useToday } from '@/hooks/use-today'
import { PERIOD_LABELS } from '@/lib/constants'
import { calculateTagStats, calculateTaskStats, calculateReviewStats } from '@/lib/utils/stats'
import Link from 'next/link'
import type { Period } from '@/types'

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

export default function InsightsPage() {
  const { user } = useAuth()
  const { tasks, tags: tagRepo, habitLogs, dailyReviews } = useRepos()

  const today = useToday()
  // 自然月范围（不含相邻月份的日期）
  const range = useMemo(() => getCalendarMonthRange(today), [today])
  // 最近 7 天（含今天）
  const weekRange = useMemo(
    () => ({ start: toDateStr(addDays(parseISO(today), -6)), end: today }),
    [today]
  )

  const { data: monthTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', user?.id, 'month', range.start, range.end],
    queryFn: () => tasks.getByDateRange(user!.id, range),
    enabled: !!user,
  })

  const { data: weekTasks = [] } = useQuery({
    queryKey: ['tasks', user?.id, 'week', weekRange.start, weekRange.end],
    queryFn: () => tasks.getByDateRange(user!.id, weekRange),
    enabled: !!user,
  })

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags', user?.id],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  const { data: monthLogs = [] } = useQuery({
    queryKey: ['habitLogs', 'month', range.start, range.end],
    queryFn: () => habitLogs.getByDateRange(user!.id, range),
    enabled: !!user,
  })

  const { data: monthReviews = [] } = useQuery({
    queryKey: ['reviews', 'month', range.start, range.end],
    queryFn: () => dailyReviews.getByDateRange(user!.id, range),
    enabled: !!user,
  })

  const taskStats = useMemo(() => calculateTaskStats(monthTasks, today), [monthTasks, today])
  const tagStats = useMemo(() => calculateTagStats(monthTasks, tagList), [monthTasks, tagList])
  const reviewStats = useMemo(() => calculateReviewStats(monthReviews), [monthReviews])

  // 最近 7 天完成趋势
  const dailyTrend = useMemo(() => {
    const days: { date: string; done: number; total: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const dateStr = toDateStr(addDays(parseISO(today), -i))
      const dayTasks = weekTasks.filter((t) => t.task_date === dateStr && t.status !== 'cancelled')
      days.push({
        date: dateStr,
        done: dayTasks.filter((t) => t.status === 'done').length,
        total: dayTasks.length,
      })
    }
    return days
  }, [weekTasks, today])

  const maxDailyTotal = Math.max(...dailyTrend.map((d) => d.total), 1)
  const weekDone = dailyTrend.reduce((sum, d) => sum + d.done, 0)
  const weekTotal = dailyTrend.reduce((sum, d) => sum + d.total, 0)

  if (!user) return null

  const totalTasks = monthTasks.filter((t) => t.status !== 'cancelled').length
  const completionRate = Math.round(taskStats.completionRate * 100)
  const habitCompletionDays = monthLogs.filter((l) => l.is_completed).length
  const reviewDays = monthReviews.length

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">统计与复盘</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(), 'M月')} 数据概览
        </p>
      </div>

      {tasksLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">计划总数</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">本月计划事项</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">完成率</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {completionRate}%
              </div>
              <p className="text-xs text-muted-foreground">{taskStats.done} 项已完成</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">习惯打卡</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{habitCompletionDays}</div>
              <p className="text-xs text-muted-foreground">本月打卡记录</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">每日评价</CardTitle>
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{reviewDays}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">评价天数</p>
                <Link href="/reviews" className="text-xs text-primary hover:underline">
                  查看全部评价
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 最近 7 天完成趋势 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-baseline justify-between">
            <CardTitle className="text-base">最近 7 天</CardTitle>
            <span className="text-xs text-muted-foreground tabular-nums">
              完成 {weekDone} / {weekTotal}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-[140px]">
            {dailyTrend.map((day) => {
              const totalH = day.total > 0 ? Math.max(Math.round((day.total / maxDailyTotal) * 110), 8) : 3
              const doneH = day.total > 0 ? Math.round((day.done / day.total) * totalH) : 0
              const d = parseISO(day.date)
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0 h-full">
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {day.total > 0 ? `${day.done}/${day.total}` : ''}
                  </span>
                  <div
                    className="w-full max-w-[36px] rounded-t bg-muted relative overflow-hidden"
                    style={{ height: totalH }}
                    title={`${day.date}：完成 ${day.done} / 共 ${day.total}`}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-emerald-500/80"
                      style={{ height: doneH }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {format(d, 'M/d')}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            绿色为已完成数量，灰色为当天计划总量
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {/* 时段分布 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">时段分布</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {taskStats.total === 0 ? (
              <p className="text-sm text-muted-foreground">本月还没有计划事项</p>
            ) : (
              PERIODS.map((period) => {
                const p = taskStats.byPeriod[period]
                const pct = Math.round(p.rate * 100)
                return (
                  <div key={period} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{PERIOD_LABELS[period]}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {p.done}/{p.total} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* 标签统计 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">标签统计</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tagStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">本月还没有带标签的事项</p>
            ) : (
              tagStats.slice(0, 6).map((tag) => {
                const pct = Math.round(tag.rate * 100)
                const maxTotal = tagStats[0].total || 1
                return (
                  <div key={tag.tagId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: tag.tagColor }}
                        />
                        <span className="truncate">{tag.tagName}</span>
                      </span>
                      <span className="tabular-nums text-muted-foreground shrink-0">
                        {tag.done}/{tag.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(Math.round((tag.total / maxTotal) * 100), 4)}%`,
                          backgroundColor: tag.tagColor,
                          opacity: pct >= 100 ? 1 : 0.7,
                        }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* 评价趋势 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-baseline justify-between">
            <CardTitle className="text-base">评价趋势</CardTitle>
            <Link href="/reviews" className="text-xs text-primary hover:underline">
              查看历史评价
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {reviewStats.totalReviews === 0 ? (
            <p className="text-sm text-muted-foreground">
              本月还没有评价，
              <Link href="/reviews/today" className="text-primary hover:underline">
                写一篇今天的评价
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xl font-semibold tabular-nums">
                    {reviewStats.avgScore != null ? reviewStats.avgScore.toFixed(1) : '—'}
                    <span className="text-xs text-muted-foreground font-normal"> /10</span>
                  </div>
                  <p className="text-xs text-muted-foreground">平均评分</p>
                </div>
                <div>
                  <div className="text-xl font-semibold tabular-nums">
                    {reviewStats.avgMood != null ? reviewStats.avgMood.toFixed(1) : '—'}
                    <span className="text-xs text-muted-foreground font-normal"> /5</span>
                  </div>
                  <p className="text-xs text-muted-foreground">平均心情</p>
                </div>
                <div>
                  <div className="text-xl font-semibold tabular-nums">{reviewStats.totalReviews}</div>
                  <p className="text-xs text-muted-foreground">评价天数</p>
                </div>
              </div>

              {reviewStats.scoreTrend.length > 1 && (
                <div className="flex items-end gap-1 h-[72px]">
                  {reviewStats.scoreTrend.map((point) => (
                    <div
                      key={point.date}
                      className="flex-1 rounded-t bg-violet-500/70 min-w-1"
                      style={{ height: Math.max(Math.round((point.value / 10) * 72), 4) }}
                      title={`${point.date}：${point.value}/10`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
