'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { ScheduleHeader } from '@/components/schedule/schedule-header'
import { QuickAddTask } from '@/components/schedule/quick-add-task'
import { ScheduleViewSwitcher } from '@/components/schedule/schedule-view-switcher'
import type { ScheduleView } from '@/components/schedule/schedule-view-switcher'
import { TodayFocus } from '@/components/schedule/today-focus'
import { TimePeriodSection } from '@/components/schedule/time-period-section'
import { OverdueSection } from '@/components/schedule/overdue-section'
import { UpcomingTasks } from '@/components/schedule/upcoming-tasks'
import { InboxSection } from '@/components/schedule/inbox-section'
import { TaskDetailPanel } from '@/components/schedule/task-detail-panel'
import { TaskListItem } from '@/components/schedule/task-list-item'
import { HomeFocusTimer } from '@/components/focus/focus-timer'
import { HomeCountdowns } from '@/components/countdowns/home-countdowns'
import { HomeHabitsSummary } from '@/components/habits/home-habits-summary'
import { Skeleton } from '@/components/ui/skeleton'
import { useMediaQuery } from '@/hooks/use-media-query'
import { todayStr, addDays, format, parseISO } from '@/lib/utils/date'
import { groupTasksByTag } from '@/lib/utils/task-grouping'
import type { Task, Period } from '@/types'
import { FolderOpen, Search, TagIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

/** Generate the next 7 days (today + 6) as date strings */
function getWeekDateRange(today: string): { dates: string[]; end: string } {
  const dates: string[] = []
  const todayDate = parseISO(today)
  for (let i = 0; i < 7; i++) {
    const d = addDays(todayDate, i)
    dates.push(format(d, 'yyyy-MM-dd'))
  }
  return { dates, end: dates[6] }
}

/** Format a date string for display in week groups */
function formatWeekDateLabel(dateStr: string, today: string): string {
  const d = parseISO(dateStr)
  const monthDay = format(d, 'M月d日')
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[parseInt(format(d, 'i')) % 7]

  if (dateStr === today) return `今天 · ${monthDay} ${weekday}`
  const tomorrow = format(addDays(parseISO(today), 1), 'yyyy-MM-dd')
  if (dateStr === tomorrow) return `明天 · ${monthDay} ${weekday}`
  return `${monthDay} ${weekday}`
}

export default function SchedulePage() {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const [view, setView] = useState<ScheduleView>('today')
  const [groupBy, setGroupBy] = useState<'none' | 'category'>('none')
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const today = todayStr()

  // Load today + broader range for overdue/upcoming
  const range = useMemo(() => {
    const start = new Date()
    start.setDate(start.getDate() - 30) // 30 days back for overdue
    const end = new Date()
    end.setDate(end.getDate() + 60) // 60 days forward
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    }
  }, [])

  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id, 'schedule', range.start, range.end],
    queryFn: () =>
      taskRepo.filter(user!.id, {
        dateFrom: range.start,
        dateTo: range.end,
        includeUndated: true,
        maxResults: 500,
      }),
    enabled: !!user,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ['tags', user?.id],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  // Pre-compute the week date range
  const weekRange = useMemo(() => getWeekDateRange(today), [today])

  // Derived task groups
  const todayTasks = useMemo(
    () => allTasks.filter((t) => t.task_date === today && t.status !== 'cancelled'),
    [allTasks, today]
  )

  const overdueTasks = useMemo(
    () =>
      allTasks.filter(
        (t) => t.task_date && t.task_date < today && t.status !== 'done' && t.status !== 'cancelled'
      ),
    [allTasks, today]
  )

  const undatedTasks = useMemo(
    () => allTasks.filter((t) => !t.task_date && t.status !== 'cancelled'),
    [allTasks]
  )

  // Week view tasks: today through today+6, not cancelled
  const weekTasks = useMemo(
    () =>
      allTasks.filter(
        (t) =>
          t.task_date &&
          t.task_date >= today &&
          t.task_date <= weekRange.end &&
          t.status !== 'cancelled'
      ),
    [allTasks, today, weekRange.end]
  )

  // Week tasks grouped by date
  const weekDateGroups = useMemo(() => {
    const groups: { date: string; label: string; tasks: Task[] }[] = []
    for (const date of weekRange.dates) {
      const dateTasks = weekTasks.filter((t) => t.task_date === date)
      if (dateTasks.length > 0) {
        groups.push({
          date,
          label: formatWeekDateLabel(date, today),
          tasks: dateTasks,
        })
      }
    }
    return groups
  }, [weekTasks, weekRange.dates, today])

  const periodGroups = useMemo(() => {
    const groups: Record<Period, Task[]> = { morning: [], afternoon: [], evening: [] }
    for (const task of todayTasks) {
      groups[task.period]?.push(task)
    }
    return groups
  }, [todayTasks])

  const activeTask = useMemo(
    () => allTasks.find((t) => t.id === activeTaskId) || null,
    [allTasks, activeTaskId]
  )

  const handleTaskClick = useCallback((task: Task) => {
    setActiveTaskId(task.id)
  }, [])

  const handleClosePanel = useCallback(() => {
    setActiveTaskId(null)
  }, [])

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const showDetailPanel = !!activeTaskId

  // Get time-range-filtered tasks for category grouping overlay
  const timeFilteredTasks = useMemo(() => {
    switch (view) {
      case 'today':
        return [...todayTasks, ...overdueTasks]
      case 'week':
        return [...overdueTasks, ...weekTasks]
      case 'all':
      default:
        return allTasks.filter((t) => t.status !== 'cancelled')
    }
  }, [view, todayTasks, overdueTasks, weekTasks, allTasks])

  // Category groups from time-filtered tasks
  const categoryGroups = useMemo(() => {
    if (groupBy !== 'category') return null
    return groupTasksByTag(timeFilteredTasks, tags, { hideCancelled: true, hideEmpty: true })
  }, [groupBy, timeFilteredTasks, tags])

  if (!user) return null

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Header with greeting and stats */}
          <ScheduleHeader today={today} tasks={allTasks} />

          {/* Main content */}
          <div className="px-4 py-4 max-w-3xl mx-auto space-y-4">
            {/* Quick add */}
            <QuickAddTask />

            {/* View controls: time range + category grouping */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <ScheduleViewSwitcher
                view={view}
                onViewChange={(v) => {
                  setView(v)
                  // Reset search and groupBy when switching to 'all'
                  if (v === 'all') {
                    setSearchQuery('')
                    setGroupBy('none')
                  }
                }}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
              />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <>
                {/* === TODAY VIEW === */}
                {view === 'today' && groupBy === 'none' && (
                  <div className="space-y-4">
                    {todayTasks.length === 0 &&
                    overdueTasks.length === 0 &&
                    undatedTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
                        <FolderOpen className="h-10 w-10 opacity-40" />
                        <p className="text-sm">今天还没有计划</p>
                        <p className="text-xs text-muted-foreground/70">
                          在上方输入框添加一项计划吧
                        </p>
                      </div>
                    ) : (
                      <>
                        <TodayFocus
                          tasks={todayTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />
                        <OverdueSection
                          tasks={overdueTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />
                        {PERIODS.map((period) => (
                          <TimePeriodSection
                            key={period}
                            period={period}
                            tasks={periodGroups[period]}
                            tags={tags}
                            activeTaskId={activeTaskId}
                            onTaskClick={handleTaskClick}
                          />
                        ))}
                        <UpcomingTasks
                          tasks={allTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />
                        <InboxSection
                          tasks={undatedTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />
                        {!isDesktop && (
                          <div className="space-y-3 lg:hidden">
                            <HomeFocusTimer />
                            <HomeCountdowns />
                            <HomeHabitsSummary />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* === WEEK VIEW (未来7天) === */}
                {view === 'week' && groupBy === 'none' && (
                  <div className="space-y-4">
                    {weekDateGroups.length === 0 && overdueTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
                        <FolderOpen className="h-10 w-10 opacity-40" />
                        <p className="text-sm">未来7天暂无计划</p>
                        <p className="text-xs text-muted-foreground/70">
                          可以新增一项计划，提前安排接下来的时间
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Overdue tasks still shown at top */}
                        <OverdueSection
                          tasks={overdueTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />

                        {/* Date-grouped week tasks */}
                        {weekDateGroups.map((group) => (
                          <div key={group.date} className="space-y-1">
                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                              {group.label}
                            </h3>
                            {group.tasks.map((task) => (
                              <TaskListItem
                                key={task.id}
                                task={task}
                                tags={tags}
                                isActive={task.id === activeTaskId}
                                onClick={() => handleTaskClick(task)}
                              />
                            ))}
                          </div>
                        ))}

                        {/* Inbox (undated) — shown in week view for context */}
                        <InboxSection
                          tasks={undatedTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />

                        {!isDesktop && (
                          <div className="space-y-3 lg:hidden">
                            <HomeFocusTimer />
                            <HomeCountdowns />
                            <HomeHabitsSummary />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* === ALL VIEW === */}
                {view === 'all' && groupBy === 'none' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索所有事项……"
                        className="pl-8 h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      {allTasks
                        .filter(
                          (t) =>
                            t.status !== 'cancelled' &&
                            (!searchQuery ||
                              t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        )
                        .slice(0, 50)
                        .map((task) => (
                          <TaskListItem
                            key={task.id}
                            task={task}
                            tags={tags}
                            isActive={task.id === activeTaskId}
                            onClick={() => handleTaskClick(task)}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* === CATEGORY GROUPING OVERLAY === */}
                {groupBy === 'category' && categoryGroups && (
                  <div className="space-y-4">
                    {categoryGroups.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
                        <TagIcon className="h-10 w-10 opacity-40" />
                        <p className="text-sm">暂无分类任务</p>
                        <p className="text-xs text-muted-foreground/70">
                          当前视图范围内没有任务
                        </p>
                      </div>
                    ) : (
                      categoryGroups.map((group) => (
                        <div key={group.tagId ?? '__uncategorized__'} className="space-y-1">
                          <div className="flex items-center gap-2 px-1">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: group.tagColor }}
                            />
                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {group.tagName}
                            </h3>
                            <span className="text-[10px] text-muted-foreground tabular-nums">
                              {group.total}
                            </span>
                          </div>
                          {group.tasks.map((task) => (
                            <TaskListItem
                              key={task.id}
                              task={task}
                              tags={tags}
                              isActive={task.id === activeTaskId}
                              onClick={() => handleTaskClick(task)}
                            />
                          ))}
                        </div>
                      ))
                    )}
                    {!isDesktop && (
                      <div className="space-y-3 lg:hidden">
                        <HomeFocusTimer />
                        <HomeCountdowns />
                        <HomeHabitsSummary />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Right panel */}
      {isDesktop && (
        <div className="w-72 xl:w-80 border-l bg-card/50 h-full overflow-y-auto shrink-0 p-3 space-y-3">
          <HomeFocusTimer />
          <HomeCountdowns />
          <HomeHabitsSummary />
        </div>
      )}

      {/* Floating task detail panel */}
      <TaskDetailPanel
        task={activeTask}
        open={showDetailPanel}
        onClose={handleClosePanel}
      />
    </div>
  )
}
