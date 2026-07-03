'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { enrichCountdown, sortCountdowns } from '@/lib/utils/countdown'
import type { Countdown } from '@/types'
import {
  Clock,
  Plus,
  ChevronRight,
  Pin,
  PinOff,
  Pencil,
  Archive,
  Trash2,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const COUNTDOWN_ICONS = ['Target', 'Star', 'Heart', 'GraduationCap', 'Briefcase', 'Plane', 'Gift', 'Calendar']
const COUNTDOWN_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

export function HomeCountdowns() {
  const { user } = useAuth()
  const { countdowns: cdRepo } = useRepos()
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<Countdown | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Countdown | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  // Create form state
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [isYearly, setIsYearly] = useState(false)
  const [color, setColor] = useState(COUNTDOWN_COLORS[0])
  const [icon, setIcon] = useState(COUNTDOWN_ICONS[0])
  const [description, setDescription] = useState('')
  const [showOnHome, setShowOnHome] = useState(true)

  const { data: rawList = [] } = useQuery({
    queryKey: ['countdowns'],
    queryFn: () => cdRepo.list(user!.id),
    enabled: !!user,
  })

  const countdowns = sortCountdowns(rawList.map(enrichCountdown)).filter((c) => c.show_on_home !== false)
  const displayCountdowns = countdowns.slice(0, 4)

  const handleCreate = useCallback(async () => {
    if (!title.trim() || !targetDate || !user) return
    try {
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
      queryClient.invalidateQueries({ queryKey: ['countdowns'] })
      setTitle('')
      setTargetDate('')
      setDescription('')
      setShowOnHome(true)
      setShowCreate(false)
      toast.success('倒数日已创建')
    } catch {
      toast.error('创建失败')
    }
  }, [title, targetDate, isYearly, color, icon, user, cdRepo, queryClient, rawList.length])

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

  const startEdit = useCallback((c: Countdown) => {
    setEditTarget(c)
    setTitle(c.title)
    setTargetDate(c.target_date)
    setIsYearly(c.is_yearly)
    setColor(c.color)
    setIcon(c.icon || COUNTDOWN_ICONS[0])
    setDescription(c.description || '')
    setShowOnHome(c.show_on_home !== false)
  }, [])

  const handleUpdate = useCallback(async () => {
    if (!editTarget || !title.trim() || !targetDate || !user) return
    try {
      await cdRepo.update(user.id, editTarget.id, {
        title: title.trim(),
        target_date: targetDate,
        is_yearly: isYearly,
        color,
        icon,
        description: description || undefined,
        show_on_home: showOnHome,
      } as Partial<Countdown>)
      queryClient.invalidateQueries({ queryKey: ['countdowns'] })
      setEditTarget(null)
      toast.success('已更新')
    } catch {
      toast.error('保存失败')
    }
  }, [editTarget, title, targetDate, isYearly, color, icon, description, showOnHome, user, cdRepo, queryClient])

  const handleArchive = useCallback(
    async (c: Countdown) => {
      try {
        if (c.archived_at) {
          await cdRepo.unarchive(user!.id, c.id)
          toast.success('已取消归档')
        } else {
          await cdRepo.archive(user!.id, c.id)
          toast.success('已归档')
        }
        queryClient.invalidateQueries({ queryKey: ['countdowns'] })
      } catch {
        toast.error('操作失败')
      }
    },
    [user, cdRepo, queryClient]
  )

  if (displayCountdowns.length === 0 && !showCreate) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">倒数日</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              新建
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center py-3">
            还没有倒数日，点击新建添加
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="shadow-none">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Clock className="h-3 w-3" />
              倒数日
              <ChevronRight className={cn('h-3 w-3 transition-transform', !collapsed && 'rotate-90')} />
            </button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Link href="/countdowns">
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  全部
                </Button>
              </Link>
            </div>
          </div>

          {!collapsed && (
            <div className="space-y-1.5">
              {displayCountdowns.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors group',
                    c.is_pinned && 'bg-accent/30'
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{c.title}</div>
                    <div
                      className={cn(
                        'text-[10px]',
                        c.days_remaining === 0
                          ? 'text-emerald-500 font-semibold'
                          : c.days_remaining && c.days_remaining > 0
                            ? 'text-muted-foreground'
                            : 'text-destructive'
                      )}
                    >
                      {c.display_text}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => startEdit(c)}
                      title="编辑"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleTogglePin(c)}
                      title={c.is_pinned ? '取消置顶' : '置顶'}
                    >
                      {c.is_pinned ? (
                        <PinOff className="h-3 w-3" />
                      ) : (
                        <Pin className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleArchive(c)}
                      title={c.archived_at ? '取消归档' : '归档'}
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-destructive"
                      onClick={() => setDeleteTarget(c)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Inline create form */}
              {showCreate && (
                <div className="p-2 border rounded-md bg-muted/30 space-y-2">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="倒数日标题"
                    className="h-7 text-xs"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="h-7 text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setIsYearly(!isYearly)}
                      className={cn(
                        'h-7 px-2 text-xs rounded-md border transition-colors shrink-0',
                        isYearly ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-input'
                      )}
                    >
                      每年
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {COUNTDOWN_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          'w-5 h-5 rounded-full border-2 transition-all',
                          color === c ? 'border-foreground scale-110' : 'border-transparent'
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-7 text-xs flex-1"
                      onClick={handleCreate}
                      disabled={!title.trim() || !targetDate}
                    >
                      保存
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowCreate(false)}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
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

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑倒数日</DialogTitle>
          </DialogHeader>
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
              {COUNTDOWN_COLORS.map((c) => (
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>取消</Button>
            <Button onClick={handleUpdate} disabled={!title.trim() || !targetDate}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
