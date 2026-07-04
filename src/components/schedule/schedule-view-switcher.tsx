'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sun, CalendarRange, ListFilter, LayoutGrid } from 'lucide-react'

export type ScheduleView = 'today' | 'week' | 'all'

const TIME_VIEWS: { value: ScheduleView; label: string; icon: typeof Sun; shortLabel: string }[] = [
  { value: 'today', label: '今天', icon: Sun, shortLabel: '今天' },
  { value: 'week', label: '未来7天', icon: CalendarRange, shortLabel: '7天' },
  { value: 'all', label: '全部', icon: ListFilter, shortLabel: '全部' },
]

interface ScheduleViewSwitcherProps {
  view: ScheduleView
  onViewChange: (view: ScheduleView) => void
  groupBy: 'none' | 'category'
  onGroupByChange: (groupBy: 'none' | 'category') => void
}

export function ScheduleViewSwitcher({
  view,
  onViewChange,
  groupBy,
  onGroupByChange,
}: ScheduleViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Time range segmented control */}
      <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
        {TIME_VIEWS.map((v) => (
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
            <v.icon className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
            <span className="hidden sm:inline">{v.label}</span>
            <span className="sm:hidden">{v.shortLabel}</span>
          </Button>
        ))}
      </div>

      {/* Category grouping toggle — visually separated */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-7 px-2.5 text-xs rounded-md transition-all border',
          groupBy === 'category'
            ? 'bg-background shadow-sm text-foreground border-border'
            : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border'
        )}
        onClick={() =>
          onGroupByChange(groupBy === 'category' ? 'none' : 'category')
        }
      >
        <LayoutGrid className="h-3.5 w-3.5 mr-1" />
        <span className="hidden sm:inline">按分类</span>
      </Button>
    </div>
  )
}
