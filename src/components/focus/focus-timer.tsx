'use client'

import { useState, useCallback } from 'react'
import { useFocus } from '@/hooks/use-focus'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQuery } from '@tanstack/react-query'
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
import {
  Play,
  Pause,
  Square,
  Timer,
  Brain,
  Coffee,
  Moon,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SELECT_LABELS } from '@/lib/constants'
import { toast } from 'sonner'

const PRESET_DURATIONS = [
  { label: '25分钟', value: 25, mode: 'focus' as const, icon: Brain },
  { label: '5分钟', value: 5, mode: 'short_break' as const, icon: Coffee },
  { label: '15分钟', value: 15, mode: 'long_break' as const, icon: Moon },
  { label: '45分钟', value: 45, mode: 'focus' as const, icon: Brain },
]

export function HomeFocusTimer() {
  const { user } = useAuth()
  const { tasks: taskRepo } = useRepos()
  const focus = useFocus()

  const [customMinutes, setCustomMinutes] = useState(25)
  const [selectedTaskId, setSelectedTaskId] = useState<string>('none')
  const [focusTitle, setFocusTitle] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const { data: todayTasks = [] } = useQuery({
    queryKey: ['tasks', 'today-focus'],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10)
      return taskRepo.getByDate(user!.id, today)
    },
    enabled: !!user,
  })

  const activeTasks = todayTasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled')

  const handleStart = useCallback(
    (minutes: number, mode: 'focus' | 'short_break' | 'long_break' = 'focus') => {
      focus.start({
        planned_minutes: minutes,
        task_id: selectedTaskId === 'none' ? undefined : selectedTaskId,
        title: focusTitle || undefined,
        mode,
      })
    },
    [focus, selectedTaskId, focusTitle]
  )

  const handleCustomStart = () => {
    if (customMinutes <= 0) {
      toast.error('请输入有效时长')
      return
    }
    handleStart(customMinutes)
  }

  // Compute circular progress
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (focus.progress / 100) * circumference

  // Active focus state
  if (focus.isRunning || focus.isPaused) {
    return (
      <Card className={cn('shadow-none', focus.isPaused && 'border-amber-400/50')}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={cn(
                'h-2 w-2 rounded-full',
                focus.isPaused ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
              )} />
              <span className="text-xs font-medium text-muted-foreground">
                {focus.isPaused ? '已暂停' : '专注中'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {focus.plannedMinutes} 分钟
            </span>
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center py-3">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className={cn(
                    'transition-all duration-1000',
                    focus.isPaused ? 'text-amber-500' : 'text-emerald-500'
                  )}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tabular-nums tracking-tight">
                  {focus.formattedTime}
                </span>
                {focus.sessionTitle && (
                  <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                    {focus.sessionTitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            {focus.isPaused ? (
              <Button
                size="sm"
                onClick={focus.resume}
                className="h-8"
              >
                <Play className="h-4 w-4 mr-1" />
                继续
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={focus.pause}
                className="h-8"
              >
                <Pause className="h-4 w-4 mr-1" />
                暂停
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCancelConfirm(true)}
              className="h-8 text-destructive hover:bg-destructive/10"
            >
              <Square className="h-4 w-4 mr-1" />
              结束
            </Button>
          </div>

          {/* Cancel confirmation */}
          <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>结束专注</DialogTitle>
                <DialogDescription>
                  {focus.isPaused
                    ? '确定要放弃当前专注吗？已有进度将保存。'
                    : '确定要提前结束专注吗？已用时间将计入记录。'}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>取消</Button>
                <Button variant="destructive" onClick={() => { setShowCancelConfirm(false); focus.cancel(); }}>
                  确认结束
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  // Idle state — show start options
  return (
    <Card className="shadow-none">
      <CardContent className="p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full mb-2"
        >
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Timer className="h-3 w-3" />
            专注
          </span>
          <ChevronRight className={cn('h-3 w-3 text-muted-foreground transition-transform', !collapsed && 'rotate-90')} />
        </button>

        {!collapsed && (
          <div className="space-y-2">
            {/* Task selector */}
            <Select value={selectedTaskId} onValueChange={(v: string | null) => setSelectedTaskId(v || 'none')}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="关联日程（可选）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">不关联日程</SelectItem>
                {activeTasks.slice(0, 10).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Preset durations */}
            <div className="grid grid-cols-4 gap-1">
              {PRESET_DURATIONS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleStart(p.value, p.mode)}
                  className="flex flex-col items-center py-1.5 rounded-md hover:bg-accent transition-colors"
                >
                  <p.icon className="h-4 w-4 mb-0.5 text-muted-foreground" />
                  <span className="text-xs">{p.label}</span>
                </button>
              ))}
            </div>

            {/* Custom duration */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCustomMinutes(Math.max(1, customMinutes - 5))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min={1}
                max={180}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                className="h-7 text-xs text-center w-16"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCustomMinutes(Math.min(180, customMinutes + 5))}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground">分钟</span>
              <Button
                size="sm"
                className="h-7 text-xs ml-auto"
                onClick={handleCustomStart}
              >
                <Play className="h-3 w-3 mr-1" />
                开始
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
