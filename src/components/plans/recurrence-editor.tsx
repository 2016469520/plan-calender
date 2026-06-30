'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { RefreshCw, Calendar, Hash, X } from 'lucide-react'
import type { RecurrenceRule } from '@/types'

const FREQUENCY_LABELS: Record<string, string> = {
  none: '不重复',
  daily: '每天',
  weekdays: '每个工作日',
  weekly: '每周',
  monthly: '每月',
  yearly: '每年',
}

const WEEKDAY_OPTIONS = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' },
]

interface RecurrenceEditorProps {
  value: RecurrenceRule | null | undefined
  onChange: (rule: RecurrenceRule | null) => void
}

export function RecurrenceEditor({ value, onChange }: RecurrenceEditorProps) {
  const frequency = value?.frequency || 'none'
  const [endType, setEndType] = useState<'none' | 'count' | 'date'>(
    value?.count ? 'count' : value?.endDate ? 'date' : 'none'
  )

  const handleFrequencyChange = (freq: string | null) => {
    if (!freq) return
    if (freq === 'none') {
      onChange(null)
      return
    }

    const base: RecurrenceRule = {
      frequency: freq as RecurrenceRule['frequency'],
      interval: value?.interval || 1,
    }

    // Preserve and set appropriate defaults
    if (freq === 'weekly' && !base.byWeekday) {
      base.byWeekday = [1] // Default to Monday
    }
    if (freq === 'monthly') {
      base.byMonthDay = value?.byMonthDay || 1
    }

    if (value?.endDate) base.endDate = value.endDate
    if (value?.count) base.count = value.count

    onChange(base)
  }

  const handleIntervalChange = (interval: number) => {
    if (!value) return
    onChange({ ...value, interval: Math.max(1, interval) })
  }

  const handleWeekdayToggle = (day: number) => {
    if (!value) return
    const current = value.byWeekday || []
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort()
    onChange({ ...value, byWeekday: next.length > 0 ? next : undefined })
  }

  const handleMonthDayChange = (day: number) => {
    if (!value) return
    onChange({ ...value, byMonthDay: Math.min(31, Math.max(1, day)) })
  }

  const handleSetPosChange = (pos: number) => {
    if (!value) return
    onChange({
      ...value,
      bySetPos: pos || undefined,
      byWeekday: pos ? (value.byWeekday || [1]) : undefined,
    })
  }

  const handleEndCount = (count: number) => {
    if (!value) return
    const next = { ...value }
    delete next.endDate
    next.count = count > 0 ? count : undefined
    onChange(next)
  }

  const handleEndDate = (date: string) => {
    if (!value) return
    const next = { ...value }
    delete next.count
    next.endDate = date || undefined
    onChange(next)
  }

  if (!value) {
    return (
      <div className="space-y-2">
        <Label>重复</Label>
        <Select value="none" onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="不重复" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {key !== 'none' && <RefreshCw className="h-3.5 w-3.5 inline mr-1.5" />}
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-3 border rounded-lg p-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          重复规则
        </Label>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-xs text-muted-foreground"
          onClick={() => onChange(null)}
        >
          <X className="h-3 w-3 mr-1" />移除
        </Button>
      </div>

      {/* Frequency */}
      <div className="space-y-1.5">
        <Select value={frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FREQUENCY_LABELS)
              .filter(([key]) => key !== 'none')
              .map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interval */}
      <div className="flex items-center gap-3">
        <Label className="text-xs shrink-0">间隔</Label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">每</span>
          <Input
            type="number"
            min={1}
            max={99}
            value={value.interval || 1}
            onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
            className="h-7 w-16 text-sm text-center"
          />
          <span className="text-xs text-muted-foreground">
            {frequency === 'daily' || frequency === 'weekdays'
              ? '天'
              : frequency === 'weekly'
              ? '周'
              : frequency === 'monthly'
              ? '月'
              : '年'}
          </span>
        </div>
      </div>

      {/* Weekly: day selection */}
      {frequency === 'weekly' && (
        <div className="space-y-1.5">
          <Label className="text-xs">重复日</Label>
          <div className="flex gap-1 flex-wrap">
            {WEEKDAY_OPTIONS.map(({ value: day, label }) => (
              <button
                key={day}
                type="button"
                onClick={() => handleWeekdayToggle(day)}
                className={cn(
                  'px-2 py-1 text-xs rounded-md border transition-colors',
                  (value.byWeekday || []).includes(day)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent border-border'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monthly: day selection */}
      {frequency === 'monthly' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs shrink-0">每月</Label>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">第</span>
              <Input
                type="number"
                min={1}
                max={31}
                value={value.byMonthDay || 1}
                onChange={(e) => handleMonthDayChange(parseInt(e.target.value) || 1)}
                className="h-7 w-14 text-sm text-center"
              />
              <span className="text-xs text-muted-foreground">天</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">或</span>
            <Select
              value={value.bySetPos ? String(value.bySetPos) : ''}
              onValueChange={(v) => handleSetPosChange(v ? parseInt(v) : 0)}
            >
              <SelectTrigger className="h-8 text-xs w-36">
                <SelectValue placeholder="选择第几个星期几" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">不使用</SelectItem>
                <SelectItem value="1">第1个</SelectItem>
                <SelectItem value="2">第2个</SelectItem>
                <SelectItem value="3">第3个</SelectItem>
                <SelectItem value="4">第4个</SelectItem>
                <SelectItem value="-1">最后一个</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* End condition */}
      <div className="space-y-2 pt-1 border-t">
        <Label className="text-xs">结束条件</Label>
        <div className="flex gap-2">
          <Button
            variant={endType === 'none' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setEndType('none')
              const next = { ...value }
              delete next.count
              delete next.endDate
              onChange(next)
            }}
          >
            永不
          </Button>
          <Button
            variant={endType === 'count' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setEndType('count')}
          >
            <Hash className="h-3 w-3 mr-1" />次数
          </Button>
          <Button
            variant={endType === 'date' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setEndType('date')}
          >
            <Calendar className="h-3 w-3 mr-1" />日期
          </Button>
        </div>

        {endType === 'count' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">重复</span>
            <Input
              type="number"
              min={1}
              max={999}
              value={value.count || ''}
              onChange={(e) => handleEndCount(parseInt(e.target.value) || 0)}
              className="h-7 w-20 text-sm text-center"
              placeholder="次数"
            />
            <span className="text-xs text-muted-foreground">次</span>
          </div>
        )}

        {endType === 'date' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">截止</span>
            <Input
              type="date"
              value={value.endDate || ''}
              onChange={(e) => handleEndDate(e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  )
}
