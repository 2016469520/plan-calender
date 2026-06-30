'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  downloadJson,
  downloadCsv,
  parseImportJson,
  readFileAsText,
  type ImportableTask,
} from '@/lib/utils/import-export'
import { toast } from 'sonner'
import {
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'
import type { Task } from '@/types'
import { todayStr } from '@/lib/utils/date'

interface ImportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportExportDialog({ open, onOpenChange }: ImportExportDialogProps) {
  const { user } = useAuth()
  const { tasks } = useRepos()
  const queryClient = useQueryClient()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [importPreview, setImportPreview] = useState<ImportableTask[] | null>(null)
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)

  const today = todayStr()

  const { data: allTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const result = await tasks.getByDate(user!.id, today)
      return result
    },
    enabled: !!user && open,
  })

  const handleExportJson = () => {
    downloadJson(allTasks, `tasks-${today}.json`)
    toast.success('JSON 已导出')
  }

  const handleExportCsv = () => {
    downloadCsv(allTasks, `tasks-${today}.csv`)
    toast.success('CSV 已导出')
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await readFileAsText(file)
      const result = parseImportJson(text)

      setImportErrors(result.errors)
      setImportPreview(result.errors.length === 0 ? result.tasks : null)

      if (result.errors.length > 0) {
        toast.error(`JSON 验证失败：${result.errors.length} 个错误`)
      } else if (result.tasks.length === 0) {
        toast.info('JSON 中没有可导入的事项')
      } else {
        toast.success(`已解析 ${result.tasks.length} 个事项`)
      }
    } catch {
      toast.error('读取文件失败')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImport = async () => {
    if (!importPreview || importPreview.length === 0) return

    setImporting(true)
    let imported = 0
    let skipped = 0

    for (const item of importPreview) {
      try {
        await tasks.create(user!.id, {
          title: item.title,
          description: item.description,
          task_date: item.task_date || today,
          period: item.period || 'morning',
          start_time: item.start_time,
          end_time: item.end_time,
          priority: item.priority || 'normal',
          status: 'todo',
          tag_id: item.tag_id,
          estimated_minutes: item.estimated_minutes,
          recurrence_rule: item.recurrence_rule,
          order_index: 0,
        } as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        imported++
      } catch {
        skipped++
      }
    }

    setImporting(false)
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    toast.success(`导入完成：${imported} 个成功，${skipped} 个跳过`)
    setImportPreview(null)
    setImportErrors([])
    onOpenChange(false)
  }

  const content = (
    <div className="space-y-4">
      {/* Export section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Download className="h-4 w-4 text-muted-foreground" />
          导出事项
        </h3>
        <p className="text-xs text-muted-foreground">
          将当前所有事项导出为文件，可用于备份或迁移
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleExportJson}
          >
            <FileJson className="h-4 w-4 mr-1.5" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleExportCsv}
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            CSV
          </Button>
        </div>
      </div>

      <div className="border-t" />

      {/* Import section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Upload className="h-4 w-4 text-muted-foreground" />
          导入事项
        </h3>
        <p className="text-xs text-muted-foreground">
          从 JSON 文件导入事项（仅支持 JSON 格式）
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
          id="import-file"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-1.5" />
          选择 JSON 文件
        </Button>

        {/* Import errors */}
        {importErrors.length > 0 && (
          <div className="space-y-1 p-3 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              验证错误
            </div>
            <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
              {importErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Import preview */}
        {importPreview && importPreview.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-sm font-medium">
                预览 ({importPreview.length} 个事项)
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {importPreview.slice(0, 10).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/30 text-sm"
                >
                  <span className="text-muted-foreground text-xs w-5">{i + 1}.</span>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.period && (
                    <Badge variant="outline" className="text-[10px] h-4">
                      {item.period === 'morning' ? '上午' : item.period === 'afternoon' ? '下午' : '晚上'}
                    </Badge>
                  )}
                </div>
              ))}
              {importPreview.length > 10 && (
                <p className="text-xs text-muted-foreground text-center">
                  ...还有 {importPreview.length - 10} 个
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-1.5" />
                  确认导入 {importPreview.length} 个事项
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>导入 / 导出</DialogTitle>
            <DialogDescription>
              导出事项备份或从 JSON 文件导入
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>导入 / 导出</DrawerTitle>
          <DrawerDescription>
            导出事项备份或从 JSON 文件导入
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  )
}
