'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { todayStr, tomorrowStr, thisWeekendStr, nextWeekStr } from '@/lib/utils/date'
import { defaultPeriodByTime } from '@/lib/utils/period'
import { getPeriodLabel, getDifficultyLabel, getTagDisplayName } from '@/lib/display-labels'
import type { Period, Difficulty, Task } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Plus, X, Loader2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface QuickAddTaskProps {
  defaultDate?: string
  defaultTagId?: string
  className?: string
}

function formatDateChinese(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[d.getDay()]
  return `${year}年${month}月${day}日 ${weekday}`
}

export function QuickAddTask({ defaultDate, defaultTagId, className }: QuickAddTaskProps) {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate || todayStr())
  const [period, setPeriod] = useState<Period | ''>('')
  const [tagId, setTagId] = useState<string>(defaultTagId || '')
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('')
  const [saving, setSaving] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags', user?.id],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  const reset = useCallback(() => {
    setTitle('')
    setDate(defaultDate || todayStr())
    setPeriod('')
    setTagId(defaultTagId || '')
    setDifficulty('')
    setExpanded(false)
  }, [defaultDate, defaultTagId])

  const handleSave = useCallback(async () => {
    if (!title.trim() || !user) return
    setSaving(true)
    try {
      const savePeriod: Period = period || defaultPeriodByTime()
      const saveDifficulty: Difficulty = difficulty || 'medium'
      await taskRepo.create(user.id, {
        title: title.trim(),
        task_date: date,
        period: savePeriod,
        tag_id: tagId || undefined,
        difficulty: saveDifficulty,
        priority: 'normal' as const,
        status: 'todo',
        order_index: 0,
      } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
      queryClient.invalidateQueries({ queryKey: ['tasks', user.id] })
      toast.success('已添加')
      reset()
      inputRef.current?.focus()
    } catch {
      toast.error('添加失败，请重试')
    } finally {
      setSaving(false)
    }
  }, [title, date, period, tagId, difficulty, user, taskRepo, queryClient, reset])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (title.trim()) handleSave()
      }
      if (e.key === 'Escape') {
        if (title) reset()
      }
    },
    [handleSave, reset, title]
  )

  // Global 'N' shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
      if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        inputRef.current?.focus()
        setExpanded(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Display labels
  const tagDisplay = getTagDisplayName(tagList, tagId)
  const isToday = date === todayStr()
  const isTomorrow = date === tomorrowStr()

  const getDateLabel = () => {
    if (isToday) return '今天'
    if (isTomorrow) return '明天'
    return formatDateChinese(date)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'border rounded-lg transition-all',
          expanded ? 'border-border bg-card shadow-sm p-3' : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 p-2'
        )}
      >
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            data-testid="quick-add-title"
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="添加一项计划……"
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60"
          />
          {title && (
            <Button
              data-testid="quick-add-save"
              size="sm"
              className="h-7 text-xs"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '保存'}
            </Button>
          )}
          {expanded && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={reset}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Expanded fields: date, period, tag, difficulty */}
        {expanded && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/50">
            {/* 1. Date with calendar picker */}
            <div>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className="h-8 text-xs w-full justify-start font-normal"
                      type="button"
                    >
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {getDateLabel()}
                    </Button>
                  }
                />
                <PopoverContent className="w-64 p-2" align="start">
                  <div className="space-y-2">
                    {/* Quick shortcuts */}
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        variant={isToday ? 'default' : 'outline'}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => { setDate(todayStr()); setCalendarOpen(false) }}
                      >
                        今天
                      </Button>
                      <Button
                        variant={isTomorrow ? 'default' : 'outline'}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => { setDate(tomorrowStr()); setCalendarOpen(false) }}
                      >
                        明天
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => { setDate(thisWeekendStr()); setCalendarOpen(false) }}
                      >
                        本周末
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => { setDate(nextWeekStr()); setCalendarOpen(false) }}
                      >
                        下周
                      </Button>
                    </div>
                    {/* Calendar date input */}
                    <div className="border-t pt-2">
                      <p className="text-[10px] text-muted-foreground mb-1">选择日期</p>
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value)
                          setCalendarOpen(false)
                        }}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* 2. Period — placeholder until selected */}
            <div>
              <Select value={period || ''} onValueChange={(v) => setPeriod((v as Period) || '')}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue>
                    {period ? getPeriodLabel(period) : '选择时段'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">上午</SelectItem>
                  <SelectItem value="afternoon">下午</SelectItem>
                  <SelectItem value="evening">晚上</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Tag */}
            <div>
              <Select value={tagId || 'none'} onValueChange={(v) => setTagId(v && v !== 'none' ? v : '')}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="选择标签">
                    {tagId ? (
                      <span className="flex items-center gap-1.5">
                        {(() => {
                          const t = tagList.find((tag) => tag.id === tagId)
                          if (t) return (
                            <>
                              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                              <span>{t.name}</span>
                            </>
                          )
                          return <span>{tagDisplay}</span>
                        })()}
                      </span>
                    ) : (
                      '未分类'
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未分类</SelectItem>
                  {tagList.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 4. Difficulty — placeholder until selected */}
            <div>
              <Select value={difficulty || ''} onValueChange={(v) => setDifficulty((v as Difficulty) || '')}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue>
                    {difficulty ? getDifficultyLabel(difficulty) : '选择难度'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">简单</SelectItem>
                  <SelectItem value="medium">一般</SelectItem>
                  <SelectItem value="hard">困难</SelectItem>
                  <SelectItem value="very_hard">极难</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
