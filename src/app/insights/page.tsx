'use client'

import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { getMonthRange, todayStr, format } from '@/lib/utils/date'
import Link from 'next/link'

export default function InsightsPage() {
  const { user } = useAuth()
  const { tasks, habitLogs, dailyReviews } = useRepos()

  const range = getMonthRange(todayStr())

  const { data: monthTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', 'month', range.start, range.end],
    queryFn: () => tasks.getByDateRange(user!.id, range),
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

  if (!user) return null

  const totalTasks = monthTasks.length
  const doneTasks = monthTasks.filter((t) => t.status === 'done').length
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
  const habitCompletionDays = monthLogs.filter((l) => l.is_completed).length
  const reviewDays = monthReviews.length

  return (
    <div className="p-4 space-y-6">
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
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">本月计划事项</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">完成率</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {completionRate}%
              </div>
              <p className="text-xs text-muted-foreground">{doneTasks} 项已完成</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">习惯打卡</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{habitCompletionDays}</div>
              <p className="text-xs text-muted-foreground">本月打卡记录</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">每日评价</CardTitle>
              <TrendingUp className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviewDays}</div>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">更多统计即将推出</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            标签统计、时段分析、评分趋势、习惯热力图等功能正在开发中...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
