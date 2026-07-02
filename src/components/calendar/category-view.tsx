'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { groupTasksByTag } from '@/lib/utils/task-grouping'
import { TIME_BUCKET_LABELS, TIME_BUCKET_ORDER } from '@/lib/utils/task-grouping'
import { CategoryTaskCard } from './category-task-card'
import { TaskEditDialog } from '@/components/plans/task-edit-dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { getMonthRange, todayStr } from '@/lib/utils/date'
import type { Task, Tag } from '@/types'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  TagIcon,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryViewProps {
  onEditTask: (task: Task) => void
  onNewTask: (defaultTagId?: string) => void
  newTaskDialogOpen: boolean
  setNewTaskDialogOpen: (open: boolean) => void
  defaultDate: string
}

export function CategoryView({
  onEditTask,
  onNewTask,
  newTaskDialogOpen,
  setNewTaskDialogOpen,
  defaultDate,
}: CategoryViewProps) {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())
  const [collapsedDone, setCollapsedDone] = useState<Set<string>>(new Set())
  const [hideEmpty, setHideEmpty] = useState(true)
  const [hideDoneTasks, setHideDoneTasks] = useState(false)
  const [newTaskTagId, setNewTaskTagId] = useState<string | undefined>()

  const range = useMemo(() => getMonthRange(todayStr()), [])

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', 'month', range.start, range.end],
    queryFn: () => taskRepo.getByDateRange(user!.id, range),
    enabled: !!user,
  })

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  const groups = useMemo(() => {
    return groupTasksByTag(tasks, tags, { hideEmpty, hideCancelled: true })
  }, [tasks, tags, hideEmpty])

  const toggleCategory = useCallback((tagId: string | null) => {
    const key = tagId ?? '__uncategorized__'
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const toggleDone = useCallback((tagId: string | null) => {
    const key = tagId ?? '__uncategorized__'
    setCollapsedDone((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleNewInCategory = useCallback(
    (tagId?: string | null) => {
      setNewTaskTagId(tagId ?? undefined)
      onNewTask(tagId ?? undefined)
    },
    [onNewTask]
  )

  if (tasksLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
        <FolderOpen className="h-10 w-10 opacity-40" />
        <p className="text-sm">没有事项</p>
        <Button size="sm" onClick={() => onNewTask()}>
          <Plus className="h-4 w-4 mr-1" />
          新建事项
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Switch
            id="hide-empty"
            checked={hideEmpty}
            onCheckedChange={setHideEmpty}
          />
          <Label htmlFor="hide-empty" className="text-xs">
            隐藏空分类
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="hide-done"
            checked={hideDoneTasks}
            onCheckedChange={setHideDoneTasks}
          />
          <Label htmlFor="hide-done" className="text-xs">
            隐藏已完成
          </Label>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((group) => {
          const catKey = group.tagId ?? '__uncategorized__'
          const isCollapsed = collapsedCategories.has(catKey)
          const isDoneCollapsed = collapsedDone.has(catKey)

          return (
            <div
              key={catKey}
              className="border border-border rounded-lg bg-card overflow-hidden"
            >
              {/* Category header */}
              <div className="p-3 flex items-center justify-between border-b border-border/50">
                <button
                  onClick={() => toggleCategory(group.tagId)}
                  className="flex items-center gap-2 min-w-0 flex-1"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: group.tagColor }}
                  />
                  <span className="font-medium text-sm truncate">
                    {group.tagName}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {group.done}/{group.total}
                  </span>
                  {/* Mini progress bar */}
                  {group.total > 0 && (
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden shrink-0">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.round(group.completionRate * 100)}%` }}
                      />
                    </div>
                  )}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => handleNewInCategory(group.tagId)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Category body */}
              {!isCollapsed && (
                <div className="divide-y divide-border/30">
                  {TIME_BUCKET_ORDER.map((bucket) => {
                    const bucketTasks = group.buckets[bucket]
                    if (bucketTasks.length === 0) return null
                    if (bucket === 'done' && hideDoneTasks) return null

                    const displayTasks =
                      bucket === 'done' && isDoneCollapsed ? [] : bucketTasks

                    return (
                      <div key={bucket} className="px-3 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {TIME_BUCKET_LABELS[bucket]}
                            <span className="ml-1 text-muted-foreground/60">
                              ({bucketTasks.length})
                            </span>
                          </span>
                          {bucket === 'done' && bucketTasks.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => toggleDone(group.tagId)}
                            >
                              {isDoneCollapsed ? '展开' : '收起'}
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {displayTasks.map((task) => (
                            <CategoryTaskCard
                              key={task.id}
                              task={{ ...task, tag: tags.find((t) => t.id === task.tag_id) }}
                              onClick={onEditTask}
                              showMoveMenu
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
