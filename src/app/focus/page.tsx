'use client'

import { useMemo } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { HomeFocusTimer } from '@/components/focus/focus-timer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { todayStr, toDateStr } from '@/lib/utils/date'
import { Timer, Flame, TrendingUp, Target, Clock, Calendar } from 'lucide-react'

export default function FocusPage() {
  const { user } = useAuth()
  const { focusSessions: fsRepo } = useRepos()

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['focus', 'all'],
    queryFn: async () => {
      const end = todayStr()
      const d = new Date()
      d.setDate(d.getDate() - 30)
      const start = toDateStr(d)
      return fsRepo.getByDateRange(user!.id, { start, end })
    },
    enabled: !!user,
  })

  const stats = useMemo(() => {
    const today = todayStr()
    /** completed_at / created_at 是 UTC ISO 时间戳，按本地日期归组 */
    const localDay = (iso?: string | null): string =>
      iso ? toDateStr(new Date(iso)) : ''
    const todaySessions = sessions.filter((s) => localDay(s.created_at) === today && s.status === 'completed')
    const completedSessions = sessions.filter((s) => s.status === 'completed')

    const todayMinutes = todaySessions.reduce((sum, s) => sum + Math.floor(s.actual_seconds / 60), 0)
    const todayCount = todaySessions.length
    const totalMinutes = completedSessions.reduce((sum, s) => sum + Math.floor(s.actual_seconds / 60), 0)
    const totalCount = completedSessions.length
    const avgMinutes = totalCount > 0 ? Math.round(totalMinutes / totalCount) : 0
    const maxMinutes = completedSessions.length > 0
      ? Math.max(...completedSessions.map((s) => Math.floor(s.actual_seconds / 60)))
      : 0

    // Weekly stats (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekStr = toDateStr(weekAgo)
    const weekCompleted = completedSessions.filter((s) => localDay(s.completed_at) >= weekStr)
    const weekMinutes = weekCompleted.reduce((sum, s) => sum + Math.floor(s.actual_seconds / 60), 0)

    // Monthly stats (last 30 days)
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const monthCompleted = completedSessions.filter((s) => localDay(s.completed_at) >= toDateStr(monthAgo))
    const monthMinutes = monthCompleted.reduce((sum, s) => sum + Math.floor(s.actual_seconds / 60), 0)

    // Streak
    let streak = 0
    const checkDate = new Date()
    while (true) {
      const dateStr = toDateStr(checkDate)
      const hasSession = completedSessions.some((s) => localDay(s.completed_at) === dateStr)
      if (hasSession) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return {
      todayMinutes,
      todayCount,
      totalMinutes,
      totalCount,
      avgMinutes,
      maxMinutes,
      weekMinutes,
      monthMinutes,
      streak,
    }
  }, [sessions])

  // Recent 7-day trend
  const trend = useMemo(() => {
    const days: { date: string; minutes: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = toDateStr(d)
      const daySessions = sessions.filter(
        (s) => s.status === 'completed' && s.completed_at && toDateStr(new Date(s.completed_at)) === dateStr
      )
      const mins = daySessions.reduce((sum, s) => sum + Math.floor(s.actual_seconds / 60), 0)
      days.push({ date: dateStr, minutes: mins })
    }
    return days
  }, [sessions])

  const maxTrendMin = Math.max(...trend.map((d) => d.minutes), 1)

  if (!user) return null

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">专注</h1>
        <p className="text-sm text-muted-foreground mt-1">番茄钟计时与专注统计</p>
      </div>

      {/* Timer section */}
      <div className="max-w-md mx-auto">
        <HomeFocusTimer />
      </div>

      {/* Stats overview */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={Timer}
              label="今日专注"
              value={`${stats.todayMinutes} 分钟`}
              sub={`${stats.todayCount} 次`}
            />
            <StatCard
              icon={Flame}
              label="连续天数"
              value={`${stats.streak} 天`}
            />
            <StatCard
              icon={Target}
              label="本周专注"
              value={`${stats.weekMinutes} 分钟`}
            />
            <StatCard
              icon={TrendingUp}
              label="平均时长"
              value={`${stats.avgMinutes} 分钟`}
              sub={`最长 ${stats.maxMinutes} 分钟`}
            />
          </div>

          {/* 7-day trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                最近 7 天趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {trend.map((day) => {
                  const height = maxTrendMin > 0 ? (day.minutes / maxTrendMin) * 100 : 0
                  const d = new Date(day.date + 'T00:00:00')
                  const dayLabel = `${d.getMonth() + 1}/${d.getDate()}`
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">
                        {day.minutes > 0 ? `${day.minutes}分` : ''}
                      </span>
                      <div
                        className="w-full bg-primary/20 rounded-t-sm transition-all min-h-[4px]"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground mt-1">{dayLabel}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent sessions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                最近专注记录
              </CardTitle>
              <CardDescription>
                累计 {stats.totalCount} 次，共 {stats.totalMinutes} 分钟
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.filter((s) => s.status === 'completed').length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">还没有专注记录</p>
              ) : (
                <div className="space-y-1">
                  {sessions
                    .filter((s) => s.status === 'completed')
                    .slice(0, 10)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 text-sm"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Timer className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">
                            {s.title || (s.mode === 'short_break' ? '短休息' : s.mode === 'long_break' ? '长休息' : '专注')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                          <span>{Math.floor(s.actual_seconds / 60)} 分钟</span>
                          <span>{s.completed_at ? new Date(s.completed_at).toLocaleDateString('zh-CN') : ''}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div className="text-xl font-bold">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  )
}
