'use client'

import { useState } from 'react'
import type { Period, Tag } from '@/types'
import { PERIOD_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Trash2, X } from 'lucide-react'

export interface WidgetTaskDraft {
  title: string
  period: Period
  tag_id: string
  start_time: string
  end_time: string
}

interface WidgetTaskFormProps {
  mode: 'create' | 'edit'
  initial?: Partial<WidgetTaskDraft>
  tags: Tag[]
  saving?: boolean
  isDone?: boolean
  onCancel: () => void
  onSave: (draft: WidgetTaskDraft) => void
  onDelete?: () => void
  onToggleDone?: () => void
}

const PERIODS: Period[] = ['morning', 'afternoon', 'evening']

/**
 * 浮窗内的任务表单：标题 + 时段 + 标签 + 起止时间。
 * 新建和编辑共用同一套字段，编辑时额外提供「完成 / 删除」。
 */
export function WidgetTaskForm({
  mode,
  initial,
  tags,
  saving,
  isDone,
  onCancel,
  onSave,
  onDelete,
  onToggleDone,
}: WidgetTaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [period, setPeriod] = useState<Period>((initial?.period as Period) ?? 'morning')
  const [tagId, setTagId] = useState(initial?.tag_id ?? '')
  const [startTime, setStartTime] = useState(initial?.start_time ?? '')
  const [endTime, setEndTime] = useState(initial?.end_time ?? '')

  const canSave = title.trim().length > 0 && !saving

  const submit = () => {
    if (!canSave) return
    onSave({
      title: title.trim(),
      period,
      tag_id: tagId,
      start_time: startTime,
      end_time: endTime,
    })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col rounded-[inherit] bg-card/98 backdrop-blur">
      <div className="app-drag flex items-center gap-2 border-b px-3 py-2">
        <span className="text-xs font-semibold">{mode === 'create' ? '新建事项' : '编辑事项'}</span>
        <button
          type="button"
          onClick={onCancel}
          aria-label="取消"
          className="app-no-drag ml-auto flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-2.5">
        <input
          data-testid="widget-form-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
          placeholder="要做的事…"
          autoFocus
          className="w-full rounded-lg border border-violet-200/70 bg-background/70 px-2 py-1.5 text-xs outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-300/50 dark:border-violet-500/25"
        />

        {/* 时段 */}
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground">时段</p>
          <div className="flex gap-1">
            {PERIODS.map((item) => (
              <button
                key={item}
                type="button"
                data-testid={`widget-period-${item}`}
                onClick={() => setPeriod(item)}
                className={cn(
                  'flex-1 rounded-full py-1 text-[11px] transition-all',
                  period === item
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 font-medium text-white'
                    : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                )}
              >
                {PERIOD_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        {/* 标签 */}
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground">标签</p>
          <select
            data-testid="widget-form-tag"
            value={tagId}
            onChange={(e) => setTagId(e.target.value)}
            className="w-full rounded-lg border border-violet-200/70 bg-background/70 px-2 py-1.5 text-xs outline-none focus:border-violet-400 dark:border-violet-500/25"
          >
            <option value="">未分类</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* 时间 */}
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground">时间（可选）</p>
          <div className="flex items-center gap-1.5">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              aria-label="开始时间"
              className="min-w-0 flex-1 rounded-lg border border-violet-200/70 bg-background/70 px-1.5 py-1 text-xs tabular-nums outline-none focus:border-violet-400 dark:border-violet-500/25"
            />
            <span className="text-[10px] text-muted-foreground">→</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              aria-label="结束时间"
              className="min-w-0 flex-1 rounded-lg border border-violet-200/70 bg-background/70 px-1.5 py-1 text-xs tabular-nums outline-none focus:border-violet-400 dark:border-violet-500/25"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5 border-t px-3 py-2">
        <Button
          data-testid="widget-form-save"
          onClick={submit}
          disabled={!canSave}
          className="h-7 w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-xs text-white hover:opacity-90"
        >
          {saving ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
          {mode === 'create' ? '添加' : '保存'}
        </Button>
        {mode === 'edit' && (
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              onClick={onToggleDone}
              className="h-6 flex-1 text-[11px]"
            >
              <Check className="mr-1 h-3 w-3" />
              {isDone ? '标记未完成' : '标记完成'}
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="h-6 text-[11px] text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
