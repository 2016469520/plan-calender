'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { enrichCountdown, sortCountdowns } from '@/lib/utils/countdown'
import { formatDisplayDate } from '@/lib/utils/date'
import type { Countdown } from '@/types'
import {
  Plus,
  Pin,
  PinOff,
  Archive,
  Trash2,
  Pencil,
  Target,
  Calendar,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']
const ICONS = ['Target', 'Star', 'Heart', 'GraduationCap', 'Briefcase', 'Plane', 'Gift', 'Calendar']

export default function CountdownsPage() {
  const { user } = useAuth()
  const { countdowns: cdRepo } = useRepos()
  const queryClient = useQueryClient()

  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Countdown | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'yearly' | 'archived'>('all')

  // Form state
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [isYearly, setIsYearly] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [icon, setIcon] = useState(ICONS[0])
  const [description, setDescription] = useState('')
  const [showOnHome, setShowOnHome] = useState(true)

  const { data: rawList = [] } = useQuery({
    queryKey: ['countdowns'],
    queryFn: async () => {
      const includeArchived = filter === 'archived'
      return cdRepo.list(user!.id, includeArchived)
    },
    enabled: !!user,
  })

  const enriched = rawList.map(enrichCountdown)

  const filtered = (() => {
    if (filter === 'archived') return enriched.filter((c) => c.archived_at)
    const active = enriched.filter((c) => !c.archived_at)
    if (filter === 'upcoming') return active.filter((c) => (c.days_remaining ?? 0) >= 0)
    if (filter === 'past') return active.filter((c) => (c.days_remaining ?? 0) < 0 && !c.is_yearly)
    if (filter === 'yearly') return active.filter((c) => c.is_yearly)
    return active
  })()

  const sorted = sortCountdowns(filtered)

  const resetForm = () => {
    setTitle('')
    setTargetDate('')
    setIsYearly(false)
    setColor(COLORS[0])
    setIcon(ICONS[0])
    setDescription('')
    setShowOnHome(true)
  }

  const startEdit = (c: Countdown) => {
    setEditingId(c.id)
    setTitle(c.title)
    setTargetDate(c.target_date)
    setIsYearly(c.is_yearly)
    setColor(c.color)
    setIcon(c.icon || ICONS[0])
    setDescription(c.description || '')
    setShowOnHome(c.show_on_home !== false)
  }

  const handleSave = useCallback(async () => {
    if (!title.trim() || !targetDate || !user) return
    try {
      if (editingId) {
        await cdRepo.update(user.id, editingId, {
          title: title.trim(),
          target_date: targetDate,
          is_yearly: isYearly,
          color,
          icon,
          description: description || undefined,
          show_on_home: showOnHome,
        } as Partial<Countdown>)
        toast.success('已更新')
        setEditingId(null)
      } else {
        await cdRepo.create(user.id, {
          title: title.trim(),
          target_date: targetDate,
          is_yearly: isYearly,
          color,
          icon,
          description: description || undefined,
          show_on_home: showOnHome,
          is_pinned: false,
          sort_order: rawList.length,
        })
        toast.success('已创建')
        setShowCreate(false)
      }
      queryClient.invalidateQueries({ queryKey: ['countdowns'] })
      resetForm()
    } catch {
      toast.error('保存失败')
    }
  }, [title, targetDate, isYearly, color, icon, description, showOnHome, editingId, user, cdRepo, queryClient, rawList.length])

  const handleTogglePin = useCallback(
    async (c: Countdown) => {
      try {
        await cdRepo.update(user!.id, c.id, { is_pinned: !c.is_pinned } as Partial<Countdown>)
        queryClient.invalidateQueries({ queryKey: ['countdowns'] })
      } catch {
        toast.error('操作失败')
      }
    },
    [user, cdRepo, queryClient]
  )

  const handleArchive = useCallback(
    async (c: Countdown) => {
      try {
        if (c.archived_at) {
          await cdRepo.unarchive(user!.id, c.id)
        } else {
          await cdRepo.archive(user!.id, c.id)
        }
        queryClient.invalidateQueries({ queryKey: ['countdowns'] })
      } catch {
        toast.error('操作失败')
      }
    },
    [user, cdRepo, queryClient]
  )

  const handleDelete = useCallback(async () => {
    if (!deleteTarget || !user) return
    try {
      await cdRepo.delete(user.id, deleteTarget.id)
      queryClient.invalidateQueries({ queryKey: ['countdowns'] })
      setDeleteTarget(null)
      toast.success('已删除')
    } catch {
      toast.error('删除失败')
    }
  }, [deleteTarget, user, cdRepo, queryClient])

  const formContent = (
    <div className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="倒数日标题"
        className="h-9 text-sm"
        autoFocus
      />
      <Input
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className="h-9 text-sm"
      />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="描述（可选）"
        className="h-9 text-sm"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsYearly(!isYearly)}
          className={cn(
            'h-8 px-3 text-xs rounded-md border transition-colors',
            isYearly ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-input'
          )}
        >
          每年重复
        </button>
        <button
          type="button"
          onClick={() => setShowOnHome(!showOnHome)}
          className={cn(
            'h-8 px-3 text-xs rounded-md border transition-colors',
            showOnHome ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-input'
          )}
        >
          显示在首页
        </button>
      </div>
      <div className="flex gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={cn(
              'w-6 h-6 rounded-full border-2 transition-all',
              color === c ? 'border-foreground scale-110' : 'border-transparent'
            )}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={handleSave} disabled={!title.trim() || !targetDate}>
          {editingId ? '保存修改' : '创建'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setEditingId(null)
            setShowCreate(false)
            resetForm()
          }}
        >
          取消
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/schedule">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">倒数日</h1>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowCreate(true); }}>
          <Plus className="h-4 w-4 mr-1" />
          新建
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-1 overflow-x-auto">
        {(['all', 'upcoming', 'past', 'yearly', 'archived'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setFilter(f)}
          >
            {f === 'all' && '全部'}
            {f === 'upcoming' && '即将到来'}
            {f === 'past' && '已过去'}
            {f === 'yearly' && '每年重复'}
            {f === 'archived' && '已归档'}
          </Button>
        ))}
      </div>

      {/* Create/Edit form */}
      {(showCreate || editingId) && (
        <Card>
          <CardContent className="p-4">
            {editingId && <h3 className="text-sm font-medium mb-3">编辑倒数日</h3>}
            {formContent}
          </CardContent>
        </Card>
      )}

      {/* Countdown list */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground space-y-3">
          <Target className="h-10 w-10 mx-auto opacity-40" />
          <p className="text-sm">暂无倒数日</p>
          <p className="text-xs text-muted-foreground/70">点击上方新建按钮添加</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((c) => (
            <Card
              key={c.id}
              className={cn(
                'shadow-none hover:shadow-sm transition-shadow',
                c.archived_at && 'opacity-50'
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    className="h-3 w-3 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.title}</span>
                      {c.is_pinned && (
                        <Pin className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                      {c.is_yearly && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">每年</Badge>
                      )}
                      {c.archived_at && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1">已归档</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDisplayDate(c.is_yearly ? c.target_date : c.target_date)}
                    </div>
                    {c.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {c.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={cn(
                        'text-lg font-bold tabular-nums',
                        c.days_remaining === 0
                          ? 'text-emerald-500'
                          : c.days_remaining && c.days_remaining > 0
                            ? 'text-foreground'
                            : 'text-destructive'
                      )}
                    >
                      {c.days_remaining !== undefined ? Math.abs(c.days_remaining) : '—'}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{c.display_text}</div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => startEdit(c)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleTogglePin(c)}
                    >
                      {c.is_pinned ? (
                        <PinOff className="h-3.5 w-3.5" />
                      ) : (
                        <Pin className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleArchive(c)}
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteTarget(c)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>删除倒数日</DialogTitle>
            <DialogDescription>
              确定要删除「{deleteTarget?.title}」吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
