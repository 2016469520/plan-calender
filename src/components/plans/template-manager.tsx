'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Skeleton } from '@/components/ui/skeleton'
import { useMediaQuery } from '@/hooks/use-media-query'
import { PERIOD_LABELS, PRIORITY_LABELS } from '@/lib/constants'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  FileText,
  Play,
  Copy,
} from 'lucide-react'
import type { TaskTemplate, Task, Period, Priority } from '@/types'

interface TemplateManagerProps {
  onApply?: (template: Partial<Task>) => void
}

export function TemplateManager({ onApply }: TemplateManagerProps) {
  const { user } = useAuth()
  const { taskTemplates, tasks } = useRepos()
  const queryClient = useQueryClient()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null)

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['taskTemplates'],
    queryFn: () => taskTemplates.getAll(user!.id),
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: () =>
      taskTemplates.create(user!.id, {
        name: newName,
        description: newDesc || undefined,
        template_data: [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTemplates'] })
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
      toast.success('模板已创建')
    },
    onError: () => toast.error('创建失败'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskTemplates.delete(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTemplates'] })
      toast.success('模板已删除')
    },
    onError: () => toast.error('删除失败'),
  })

  const handleApply = async (template: TaskTemplate) => {
    if (onApply) {
      onApply(template.template_data[0] as Partial<Task>)
      toast.success(`已应用模板「${template.name}」`)
      return
    }
    // Create a task from the template data
    if (template.template_data.length > 0) {
      const taskData = template.template_data[0] as Partial<Task>
      try {
        await tasks.create(user!.id, {
          title: taskData.title || '未命名事项',
          description: taskData.description,
          task_date: new Date().toISOString().slice(0, 10),
          period: taskData.period || 'morning',
          priority: taskData.priority || 'normal',
          status: 'todo',
          estimated_minutes: taskData.estimated_minutes,
          tag_id: taskData.tag_id,
          order_index: 0,
        } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        toast.success(`已从模板「${template.name}」创建事项`)
      } catch {
        toast.error('创建失败')
      }
    }
  }

  const handleSaveAsTemplate = async (task: Partial<Task>) => {
    if (!task.title) {
      toast.error('无法保存空模板')
      return
    }
    try {
      await taskTemplates.create(user!.id, {
        name: task.title,
        description: task.description,
        template_data: [task],
      })
      queryClient.invalidateQueries({ queryKey: ['taskTemplates'] })
      toast.success('已保存为模板')
    } catch {
      toast.error('保存失败')
    }
  }

  const createFormContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!newName.trim()) return
        createMutation.mutate()
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="tpl-name">模板名称</Label>
        <Input
          id="tpl-name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="如：每日站会、周报"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tpl-desc">描述（可选）</Label>
        <Textarea
          id="tpl-desc"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="模板用途说明"
          rows={2}
        />
      </div>
      <Button type="submit" className="w-full" disabled={createMutation.isPending || !newName.trim()}>
        创建模板
      </Button>
    </form>
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-24" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">事项模板</h3>
          {templates.length > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {templates.length}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-3 w-3 mr-1" />
          新建模板
        </Button>
      </div>

      {/* Empty state */}
      {templates.length === 0 && (
        <div className="text-center py-6 border rounded-lg border-dashed">
          <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">暂无模板</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            从常用事项创建模板，快速添加
          </p>
        </div>
      )}

      {/* Template list */}
      <div className="space-y-2">
        {templates.map((template) => (
          <Card key={template.id} className="hover:bg-accent/30 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{template.name}</p>
                  {template.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {template.description}
                    </p>
                  )}
                  {template.template_data.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {template.template_data[0].period && (
                        <Badge variant="outline" className="text-[10px] h-4">
                          {PERIOD_LABELS[template.template_data[0].period as Period]}
                        </Badge>
                      )}
                      {template.template_data[0].priority && (
                        <Badge variant="outline" className="text-[10px] h-4">
                          {PRIORITY_LABELS[template.template_data[0].priority as Priority]}
                        </Badge>
                      )}
                      {template.template_data[0].estimated_minutes && (
                        <Badge variant="outline" className="text-[10px] h-4">
                          {template.template_data[0].estimated_minutes}分钟
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleApply(template)}
                    title="应用模板"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm(`确定删除模板「${template.name}」吗？`)) {
                        deleteMutation.mutate(template.id)
                      }
                    }}
                    title="删除模板"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create dialog */}
      {isDesktop ? (
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>新建模板</DialogTitle>
            </DialogHeader>
            {createFormContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={showCreate} onOpenChange={setShowCreate}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>新建模板</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">{createFormContent}</div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}
