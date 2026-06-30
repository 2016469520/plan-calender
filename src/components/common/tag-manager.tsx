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
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#e11d48', '#0ea5e9', '#a855f7', '#64748b',
]

export function TagManager() {
  const { user } = useAuth()
  const { tags } = useRepos()
  const queryClient = useQueryClient()
  const [editingTag, setEditingTag] = useState<{ id: string; name: string; color: string } | null>(null)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3b82f6')
  const [showNewForm, setShowNewForm] = useState(false)

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
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string; color: string }) =>
      tags.update(user!.id, data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      setEditingTag(null)
      toast.success('标签已更新')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tags.delete(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('标签已删除')
    },
  })

  const handleCreate = () => {
    if (!newTagName.trim()) return
    createMutation.mutate({ name: newTagName.trim(), color: newTagColor })
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
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              {!tag.is_default && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => {
                    if (confirm(`确定删除标签「${tag.name}」？`)) {
                      deleteMutation.mutate(tag.id)
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}

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
      </CardContent>
    </Card>
  )
}
