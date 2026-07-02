'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types'

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#64748b',
]

type DeleteAction = 'migrate' | 'clear' | null

export function TagManager() {
  const { user } = useAuth()
  const { tags, tasks } = useRepos()
  const queryClient = useQueryClient()
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3b82f6')
  const [showNewForm, setShowNewForm] = useState(false)
  // Delete confirmation state
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null)
  const [deleteAction, setDeleteAction] = useState<DeleteAction>(null)
  const [migrateTargetId, setMigrateTargetId] = useState<string>('')
  const [tagUsageCount, setTagUsageCount] = useState(0)
  const [isLoadingUsage, setIsLoadingUsage] = useState(false)

  const { data: tagList = [], isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tags.getAll(user!.id),
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) =>
      tags.create(user!.id, { ...data, is_default: false, is_visible: true, sort_order: tagList.length }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setNewTagName('')
      setShowNewForm(false)
      toast.success('标签已创建')
    },
    onError: () => toast.error('创建标签失败'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; color: string }) =>
      tags.update(user!.id, data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setEditingTag(null)
      toast.success('标签已更新')
    },
    onError: () => toast.error('更新标签失败'),
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, migrateToTagId }: { id: string; migrateToTagId?: string }) => {
      if (deleteAction === 'clear') {
        // Clear tag from all tasks first
        return (async () => {
          const userTasks = await tasks.filter(user!.id, { tagIds: [id] })
          for (const task of userTasks) {
            await tasks.update(user!.id, task.id, { tag_id: undefined } as Partial<import('@/types').Task>)
          }
          await tags.delete(user!.id, id)
        })()
      }
      return tags.delete(user!.id, id, migrateToTagId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setDeletingTag(null)
      setDeleteAction(null)
      setMigrateTargetId('')
      toast.success('标签已删除')
    },
    onError: () => toast.error('删除标签失败'),
  })

  const handleCreate = () => {
    if (!newTagName.trim()) return
    createMutation.mutate({ name: newTagName.trim(), color: newTagColor })
  }

  const openDeleteDialog = async (tag: Tag) => {
    setDeletingTag(tag)
    setDeleteAction(null)
    setMigrateTargetId('')
    setIsLoadingUsage(true)

    try {
      const userTasks = await tasks.filter(user!.id, { tagIds: [tag.id] })
      setTagUsageCount(userTasks.length)
      if (userTasks.length === 0) {
        setDeleteAction('clear') // No tasks, so default action is fine
      }
    } catch {
      setTagUsageCount(0)
    } finally {
      setIsLoadingUsage(false)
    }
  }

  const handleConfirmDelete = () => {
    if (!deletingTag) return

    if (tagUsageCount === 0) {
      // No tasks using this tag — simple delete
      deleteMutation.mutate({ id: deletingTag.id })
    } else if (deleteAction === 'migrate') {
      if (!migrateTargetId) {
        toast.error('请选择目标标签')
        return
      }
      deleteMutation.mutate({ id: deletingTag.id, migrateToTagId: migrateTargetId })
    } else if (deleteAction === 'clear') {
      deleteMutation.mutate({ id: deletingTag.id })
    } else {
      toast.error('请选择处理方式')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">标签管理</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const availableTargets = tagList.filter((t) => t.id !== deletingTag?.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">标签管理</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          新建
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* New tag form */}
        {showNewForm && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Input
              placeholder="标签名称"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="h-8 text-sm flex-1"
            />
            <div className="flex gap-1">
              {PRESET_COLORS.slice(0, 5).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewTagColor(c)}
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all',
                    newTagColor === c ? 'border-foreground scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <Button size="sm" className="h-8" onClick={handleCreate} disabled={createMutation.isPending}>
              添加
            </Button>
          </div>
        )}

        {/* Tag list */}
        {tagList.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
          >
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            <span className="flex-1 text-sm">{tag.name}</span>
            {tag.is_default && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">默认</Badge>
            )}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setEditingTag({ id: tag.id, name: tag.name, color: tag.color })}
                title="编辑标签"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => openDeleteDialog(tag)}
                title="删除标签"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {tagList.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">暂无标签</p>
        )}

        {/* Edit dialog */}
        {editingTag && (
          <Dialog open={!!editingTag} onOpenChange={(o) => !o && setEditingTag(null)}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>编辑标签</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>标签名称</Label>
                  <Input
                    value={editingTag.name}
                    onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>颜色</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditingTag({ ...editingTag, color: c })}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-all',
                          editingTag.color === c ? 'border-foreground scale-110' : 'border-transparent'
                        )}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingTag(null)}>取消</Button>
                <Button
                  onClick={() => updateMutation.mutate(editingTag)}
                  disabled={updateMutation.isPending}
                >
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete confirmation dialog */}
        <Dialog open={!!deletingTag} onOpenChange={(o) => !o && setDeletingTag(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>删除标签</DialogTitle>
              <DialogDescription>
                确定要删除标签「{deletingTag?.name}」吗？
              </DialogDescription>
            </DialogHeader>

            {isLoadingUsage ? (
              <div className="py-4 text-center text-sm text-muted-foreground">检查标签使用情况...</div>
            ) : tagUsageCount === 0 ? (
              <div className="py-2">
                <p className="text-sm text-muted-foreground">该标签未被任何事项使用，可以安全删除。</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">
                  该标签正被 <strong>{tagUsageCount}</strong> 个事项使用。
                  请选择如何处理这些事项：
                </p>

                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deleteAction"
                      value="migrate"
                      checked={deleteAction === 'migrate'}
                      onChange={() => setDeleteAction('migrate')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">迁移到其他标签</span>
                      {deleteAction === 'migrate' && (
                        <div className="mt-1">
                          <Select value={migrateTargetId} onValueChange={(v) => setMigrateTargetId(v ?? '')}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="选择目标标签" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTargets.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                                    {t.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deleteAction"
                      value="clear"
                      checked={deleteAction === 'clear'}
                      onChange={() => { setDeleteAction('clear'); setMigrateTargetId('') }}
                      className="mt-1"
                    />
                    <span className="text-sm font-medium">清除关联，保留事项</span>
                  </label>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeletingTag(null)}>取消</Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending || (tagUsageCount > 0 && deleteAction === null)}
              >
                {deleteMutation.isPending ? '删除中...' : '确认删除'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
