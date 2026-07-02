'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { todayStr } from '@/lib/utils/date'
import { PERIOD_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import type { Period, Priority, Task } from '@/types'
import { Plus, X, Loader2, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface QuickAddTaskProps {
  defaultDate?: string
  defaultTagId?: string
  className?: string
}

export function QuickAddTask({ defaultDate, defaultTagId, className }: QuickAddTaskProps) {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate || todayStr())
  const [period, setPeriod] = useState<Period>('morning')
  const [tagId, setTagId] = useState<string>(defaultTagId || 'none')
  const [priority, setPriority] = useState<Priority>('normal')
  const [saving, setSaving] = useState(false)

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  const reset = useCallback(() => {
    setTitle('')
    setDate(defaultDate || todayStr())
    setPeriod('morning')
    setTagId(defaultTagId || 'none')
    setPriority('normal')
    setExpanded(false)
  }, [defaultDate, defaultTagId])

  const handleSave = useCallback(async () => {
    if (!title.trim() || !user) return
    setSaving(true)
    try {
      await taskRepo.create(user.id, {
        title: title.trim(),
        task_date: date,
        period,
        tag_id: tagId === 'none' ? undefined : tagId,
        priority,
        status: 'todo',
        order_index: 0,
      } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('已添加')
      reset()
      inputRef.current?.focus()
    } catch {
      toast.error('添加失败，请重试')
    } finally {
      setSaving(false)
    }
  }, [title, date, period, tagId, priority, user, taskRepo, queryClient, reset])

  // Keyboard handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (title.trim()) handleSave()
      }
      if (e.key === 'Escape') {
        if (expanded && title) {
          // If expanded with content, first clear; second Esc collapses
          if (title) {
            reset()
          }
        }
      }
    },
    [handleSave, reset, expanded, title]
  )

  // Global 'N' shortcut to focus
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

        {/* Expanded fields */}
        {expanded && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/50">
            <div>
              <Select value={date} onValueChange={(v) => setDate(v || '')}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={todayStr()}>今天</SelectItem>
                  <SelectItem value={tomorrowStr()}>明天</SelectItem>
                  <SelectItem value="">无日期</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={period} onValueChange={(v) => v && setPeriod(v as Period)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERIOD_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={tagId} onValueChange={(v) => setTagId(v || 'none')}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="标签" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无标签</SelectItem>
                  {tagList.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full inline-block"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function tomorrowStr(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}
