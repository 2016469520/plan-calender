'use client'

import { useNotifications, type ReminderItem, type TaskReminder, type HabitReminder, type ReviewReminder } from '@/hooks/use-notifications'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { PERIOD_LABELS, PRIORITY_COLORS } from '@/lib/constants'
import {
  Bell,
  BellOff,
  BellRing,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ClipboardList,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

interface ReminderListProps {
  className?: string
  compact?: boolean
}

export function ReminderList({ className, compact = false }: ReminderListProps) {
  const {
    permission,
    requestPermission,
    isSupported,
    reminderList,
    notifyNow,
  } = useNotifications()

  const handleEnableNotifications = async () => {
    if (!isSupported) {
      toast.error('您的浏览器不支持通知功能')
      return
    }
    const state = await requestPermission()
    if (state === 'granted') {
      toast.success('通知已开启')
      notifyNow()
    } else if (state === 'denied') {
      toast.error('通知权限被拒绝，请在浏览器设置中开启')
    } else if (state === 'unsupported') {
      toast.error('您的浏览器不支持通知功能')
    }
  }

  const handleNotifyNow = () => {
    const { shown } = notifyNow()
    if (shown === 0) {
      toast.info('没有需要提醒的事项')
    } else {
      toast.success(`已发送 ${shown} 条提醒`)
    }
  }

  const { items, overdueCount } = reminderList

  // Group items by category
  const overdueItems: TaskReminder[] = items.filter(
    (i): i is TaskReminder => i.type === 'task' && i.isOverdue
  )
  const taskReminders: TaskReminder[] = items.filter(
    (i): i is TaskReminder => i.type === 'task' && !i.isOverdue
  )
  const habitReminders: HabitReminder[] = items.filter(
    (i): i is HabitReminder => i.type === 'habit'
  )
  const reviewReminder = items.find((i): i is ReviewReminder => i.type === 'review')

  // Compact mode: just show a bell icon with count
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {permission === 'granted' ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative"
            onClick={handleNotifyNow}
            title="发送提醒"
          >
            <BellRing className="h-4 w-4" />
            {overdueCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                {overdueCount}
              </span>
            )}
          </Button>
        ) : permission === 'denied' ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEnableNotifications}
            title="通知已关闭"
          >
            <BellOff className="h-4 w-4 text-muted-foreground" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEnableNotifications}
            title="开启通知"
          >
            <Bell className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  // Full panel mode
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          <h2 className="text-lg font-semibold">提醒中心</h2>
          {overdueCount > 0 && (
            <Badge variant="destructive">{overdueCount} 过期</Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {permission === 'granted' ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={handleNotifyNow}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              立即提醒
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={handleEnableNotifications}
              disabled={!isSupported || permission === 'denied'}
            >
              {permission === 'denied' ? (
                <>
                  <BellOff className="h-3 w-3 mr-1" />
                  通知已关闭
                </>
              ) : (
                <>
                  <Bell className="h-3 w-3 mr-1" />
                  开启通知
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Unsupported browser warning */}
      {!isSupported && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          您的浏览器不支持桌面通知，请使用 Chrome、Edge 或 Firefox 等现代浏览器
        </div>
      )}

      {/* Permission denied message */}
      {permission === 'denied' && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
          <BellOff className="h-4 w-4 shrink-0" />
          通知已被关闭，请在浏览器设置中重新开启通知权限
        </div>
      )}

      {/* Empty state */}
      {items.length === 1 && reviewReminder?.isDone && overdueItems.length === 0 && taskReminders.length === 0 && habitReminders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">今天没有需要提醒的事项</p>
          <p className="text-xs text-muted-foreground/60 mt-1">太棒了！</p>
        </div>
      )}

      {/* Overdue tasks section */}
      {overdueItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <h3 className="text-sm font-medium text-destructive">
              过期事项 ({overdueItems.length})
            </h3>
          </div>
          <div className="space-y-1.5">
            {overdueItems.map((item) => (
              <ReminderCard key={item.task.id} item={item} variant="overdue" />
            ))}
          </div>
        </div>
      )}

      {/* Task reminders */}
      {taskReminders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-sm font-medium">事项提醒 ({taskReminders.length})</h3>
          </div>
          <div className="space-y-1.5">
            {taskReminders.map((item) => (
              <ReminderCard key={item.task.id} item={item} variant="task" />
            ))}
          </div>
        </div>
      )}

      {/* Habit reminders */}
      {habitReminders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-sm font-medium">习惯打卡 ({habitReminders.length})</h3>
          </div>
          <div className="space-y-1.5">
            {habitReminders.map((item) => (
              <ReminderCard key={item.habit.id} item={item} variant="habit" />
            ))}
          </div>
        </div>
      )}

      {/* Daily review */}
      {reviewReminder && !reviewReminder.isDone && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
            <h3 className="text-sm font-medium">每日总结</h3>
          </div>
          <ReminderCard item={reviewReminder} variant="review" />
        </div>
      )}
    </div>
  )
}

// ---------- Sub-components ----------

interface ReminderCardProps {
  item: ReminderItem
  variant: 'overdue' | 'task' | 'habit' | 'review'
}

function ReminderCard({ item, variant }: ReminderCardProps) {
  const baseClasses =
    'flex items-center gap-3 p-2.5 rounded-lg border transition-colors'

  const variantClasses: Record<string, string> = {
    overdue: 'border-destructive/30 bg-destructive/5 hover:bg-destructive/10',
    task: 'border-border bg-card hover:bg-accent/50',
    habit: 'border-border bg-card hover:bg-accent/50',
    review: 'border-border bg-card hover:bg-accent/50 bg-muted/30',
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant])}>
      {/* Icon */}
      <div className="shrink-0">
        {variant === 'overdue' && (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        )}
        {variant === 'task' && (
          <Clock className="h-4 w-4 text-muted-foreground" />
        )}
        {variant === 'habit' && (
          <Activity className="h-4 w-4 text-muted-foreground" />
        )}
        {variant === 'review' && (
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {item.type === 'task' && (
          <>
            <p className="text-sm font-medium truncate">{item.task.title}</p>
            <p className="text-xs text-muted-foreground">
              {item.isOverdue ? '已过期' : `提醒 ${item.timeLabel}`}
              {item.task.task_date && ` · ${item.task.task_date}`}
              {item.task.period && ` · ${PERIOD_LABELS[item.task.period]}`}
            </p>
          </>
        )}
        {item.type === 'habit' && (
          <>
            <p className="text-sm font-medium truncate">{item.habit.name}</p>
            <p className="text-xs text-muted-foreground">
              提醒 {item.timeLabel}
              {item.habit.target_value > 1
                ? ` · 目标 ${item.habit.target_value}${item.habit.unit || ''}`
                : ''}
            </p>
          </>
        )}
        {item.type === 'review' && (
          <>
            <p className="text-sm font-medium">今日总结</p>
            <p className="text-xs text-muted-foreground">
              {item.isDone ? '已完成' : '尚未填写'}
            </p>
          </>
        )}
      </div>

      {/* Priority indicator for tasks */}
      {item.type === 'task' && (
        <span
          className={cn(
            'shrink-0 text-[10px] px-1.5 py-0.5 rounded-full',
            PRIORITY_COLORS[item.task.priority]
          )}
        >
          {item.task.priority === 'urgent' ? '紧急' : item.task.priority === 'high' ? '高' : ''}
        </span>
      )}
    </div>
  )
}

// ---------- Skeleton ----------

export function ReminderListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  )
}
