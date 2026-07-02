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
import { CategoryView } from '@/components/calendar/category-view'
import { TaskEditDialog } from '@/components/plans/task-edit-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useMediaQuery } from '@/hooks/use-media-query'
import { getMonthRange, todayStr } from '@/lib/utils/date'
import type { Task, Period } from '@/types'
import { FolderOpen, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

export default function SchedulePage() {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const [view, setView] = useState<ScheduleView>('today')
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const today = todayStr()

  // Load today + broader range for upcoming/overdue
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
    queryKey: ['tasks', 'schedule', range.start, range.end],
    queryFn: () => taskRepo.getByDateRange(user!.id, range),
    enabled: !!user,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  // Derived task groups
  const todayTasks = useMemo(
    () => allTasks.filter((t) => t.task_date === today && t.status !== 'cancelled'),
    [allTasks, today]
  )

  const overdueTasks = useMemo(
    () =>
      allTasks.filter(
        (t) => t.task_date < today && t.status !== 'done' && t.status !== 'cancelled'
      ),
    [allTasks, today]
  )

  const undatedTasks = useMemo(
    () => allTasks.filter((t) => !t.task_date && t.status !== 'cancelled'),
    [allTasks]
  )

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

  if (!user) return null

  // Mobile: when detail panel is open, show only the panel (full screen)
  if (!isDesktop && showDetailPanel) {
    return (
      <div className="h-full">
        <TaskDetailPanel
          task={activeTask}
          open={true}
          onClose={handleClosePanel}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {/* Header with greeting and stats */}
          <ScheduleHeader today={today} tasks={allTasks} />

          {/* Main content */}
          <div className="px-4 py-4 max-w-3xl mx-auto space-y-4">
            {/* Quick add - NO DIALOG */}
            <QuickAddTask />

            {/* View switcher */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <ScheduleViewSwitcher view={view} onViewChange={setView} />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <>
                {/* TODAY VIEW */}
                {view === 'today' && (
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
                        {/* Today Focus */}
                        <TodayFocus
                          tasks={todayTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />

                        {/* Overdue */}
                        <OverdueSection
                          tasks={overdueTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />

                        {/* Period sections */}
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

                        {/* Upcoming */}
                        <UpcomingTasks
                          tasks={allTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />

                        {/* Inbox */}
                        <InboxSection
                          tasks={undatedTasks}
                          tags={tags}
                          activeTaskId={activeTaskId}
                          onTaskClick={handleTaskClick}
                        />
                      </>
                    )}
                  </div>
                )}

                {/* UPCOMING VIEW */}
                {view === 'upcoming' && (
                  <UpcomingTasks
                    tasks={allTasks}
                    tags={tags}
                    activeTaskId={activeTaskId}
                    onTaskClick={handleTaskClick}
                    maxPreview={20}
                  />
                )}

                {/* ALL VIEW */}
                {view === 'all' && (
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
                            !searchQuery ||
                            t.title.toLowerCase().includes(searchQuery.toLowerCase())
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

                {/* CATEGORY VIEW */}
                {view === 'category' && (
                  <CategoryView
                    onEditTask={handleTaskClick}
                    onNewTask={() => {}}
                    newTaskDialogOpen={dialogOpen}
                    setNewTaskDialogOpen={setDialogOpen}
                    defaultDate={today}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Task detail side panel */}
      {isDesktop && (
        <TaskDetailPanel
          task={activeTask}
          open={showDetailPanel}
          onClose={handleClosePanel}
        />
      )}
    </div>
  )
}
