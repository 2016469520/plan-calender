'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  X,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'
import type { TaskFilterOptions } from '@/lib/repositories/interfaces'
import { formatDisplayDate, todayStr } from '@/lib/utils/date'
import { PERIOD_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/constants'

interface SearchFilterProps {
  onSelectTask?: (task: Task) => void
  compact?: boolean
}

export function SearchFilter({ onSelectTask, compact = false }: SearchFilterProps) {
  const { user } = useAuth()
  const { tasks, tags } = useRepos()
  const [searchText, setSearchText] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterOptions, setFilterOptions] = useState<Omit<TaskFilterOptions, 'search'>>({})

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tags.getAll(user!.id),
    enabled: !!user,
  })

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['tasks', 'filter', searchText, filterOptions],
    queryFn: () =>
      tasks.filter(user!.id, {
        search: searchText || undefined,
        ...filterOptions,
        maxResults: 50,
      }),
    enabled: !!user && (!!searchText || Object.keys(filterOptions).length > 0),
  })

  const clearAll = useCallback(() => {
    setSearchText('')
    setFilterOptions({})
    setShowFilters(false)
  }, [])

  const hasActiveFilters = searchText || Object.keys(filterOptions).length > 0

  const overdueTasks = results.filter(
    (t) => t.task_date < todayStr() && t.status !== 'done' && t.status !== 'cancelled'
  )

  if (!user) return null

  return (
    <div className={cn('space-y-4', compact && 'space-y-2')}>
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索事项标题或描述..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={showFilters || hasActiveFilters ? 'default' : 'outline'}
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter chips */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.status?.map((s: string) => (
            <Badge key={s} variant="secondary" className="text-xs gap-1">
              {STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    status: prev.status?.filter((x: string) => x !== s),
                  }))
                }
              />
            </Badge>
          ))}
          {filterOptions.priority?.map((p: string) => (
            <Badge key={p} variant="secondary" className="text-xs gap-1">
              {PRIORITY_LABELS[p as keyof typeof PRIORITY_LABELS]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    priority: prev.priority?.filter((x: string) => x !== p),
                  }))
                }
              />
            </Badge>
          ))}
          {filterOptions.overdue && (
            <Badge variant="destructive" className="text-xs gap-1">
              已过期
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilterOptions((prev) => ({ ...prev, overdue: false }))}
              />
            </Badge>
          )}
          {filterOptions.hasRecurrence && (
            <Badge variant="secondary" className="text-xs gap-1">
              重复
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilterOptions((prev) => ({ ...prev, hasRecurrence: false }))}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearAll}>
            清除全部
          </Button>
        </div>
      )}

      {/* Expanded filters */}
      {showFilters && (
        <Card>
          <CardContent className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">状态</label>
                <Select
                  value={filterOptions.status?.[0] || ''}
                  onValueChange={(v) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      status: v ? [v] : undefined,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="todo">未开始</SelectItem>
                    <SelectItem value="in_progress">进行中</SelectItem>
                    <SelectItem value="done">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">优先级</label>
                <Select
                  value={filterOptions.priority?.[0] || ''}
                  onValueChange={(v) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      priority: v ? [v] : undefined,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="normal">普通</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">标签</label>
                <Select
                  value={filterOptions.tagIds?.[0] || ''}
                  onValueChange={(v) =>
                    setFilterOptions((prev) => ({
                      ...prev,
                      tagIds: v ? [v] : undefined,
                    }))
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="全部" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {tagList.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                          {tag.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">日期范围</label>
                <div className="flex gap-1">
                  <Input
                    type="date"
                    value={filterOptions.dateFrom || ''}
                    onChange={(e) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        dateFrom: e.target.value || undefined,
                      }))
                    }
                    className="h-8 text-xs"
                  />
                  <Input
                    type="date"
                    value={filterOptions.dateTo || ''}
                    onChange={(e) =>
                      setFilterOptions((prev) => ({
                        ...prev,
                        dateTo: e.target.value || undefined,
                      }))
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Toggle buttons */}
            <div className="flex gap-2">
              <Button
                variant={filterOptions.overdue ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() =>
                  setFilterOptions((prev) => ({ ...prev, overdue: !prev.overdue }))
                }
              >
                <AlertCircle className="h-3 w-3 mr-1" />已过期
              </Button>
              <Button
                variant={filterOptions.hasRecurrence ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    hasRecurrence: !prev.hasRecurrence,
                  }))
                }
              >
                <RefreshCw className="h-3 w-3 mr-1" />重复
              </Button>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearAll}>
                清除全部筛选
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {results.length} 条结果
            {overdueTasks.length > 0 && (
              <span className="text-destructive ml-2">
                {overdueTasks.length} 项已过期
              </span>
            )}
          </p>
          {results.map((task) => (
            <Card
              key={task.id}
              className={cn(
                'cursor-pointer hover:shadow-sm transition-all',
                task.task_date < todayStr() &&
                  task.status !== 'done' &&
                  task.status !== 'cancelled' &&
                  'border-destructive/40'
              )}
              onClick={() => onSelectTask?.(task)}
            >
              <CardContent className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {task.tag && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: task.tag.color }}
                      />
                    )}
                    <span
                      className={cn(
                        'text-sm font-medium truncate',
                        task.status === 'done' && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-3 w-3" />
                      {formatDisplayDate(task.task_date)}
                    </span>
                    <span>{PERIOD_LABELS[task.period]}</span>
                    {task.status !== 'done' && task.status !== 'cancelled' && (
                      <Badge variant="secondary" className="text-[10px] h-4">
                        {STATUS_LABELS[task.status as keyof typeof STATUS_LABELS]}
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>

                {task.task_date < todayStr() &&
                  task.status !== 'done' &&
                  task.status !== 'cancelled' && (
                    <Badge variant="destructive" className="text-[10px] h-4 shrink-0">
                      <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                      过期
                    </Badge>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : hasActiveFilters ? (
        <div className="text-center py-8 text-muted-foreground">
          <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">没有匹配的事项</p>
          <Button variant="link" size="sm" onClick={clearAll}>
            清除筛选
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          输入关键词或添加筛选条件来搜索事项
        </div>
      )}
    </div>
  )
}
