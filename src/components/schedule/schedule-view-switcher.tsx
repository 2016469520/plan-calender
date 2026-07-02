'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sun, CalendarRange, ListFilter, LayoutGrid } from 'lucide-react'

export type ScheduleView = 'today' | 'upcoming' | 'all' | 'category'

const VIEWS: { value: ScheduleView; label: string; icon: typeof Sun }[] = [
  { value: 'today', label: '今天', icon: Sun },
  { value: 'upcoming', label: '近期', icon: CalendarRange },
  { value: 'all', label: '全部', icon: ListFilter },
  { value: 'category', label: '按分类', icon: LayoutGrid },
]

interface ScheduleViewSwitcherProps {
  view: ScheduleView
  onViewChange: (view: ScheduleView) => void
}

export function ScheduleViewSwitcher({ view, onViewChange }: ScheduleViewSwitcherProps) {
  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
      {VIEWS.map((v) => (
        <Button
          key={v.value}
          variant="ghost"
          size="sm"
          className={cn(
            'h-7 px-3 text-xs rounded-md transition-all',
            view === v.value
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={() => onViewChange(v.value)}
        >
          <v.icon className="h-3.5 w-3.5 mr-1" />
          {v.label}
        </Button>
      ))}
    </div>
  )
}
