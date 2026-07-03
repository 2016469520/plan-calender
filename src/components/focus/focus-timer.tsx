'use client'

import { useState, useCallback, useRef } from 'react'
import { useFocus } from '@/hooks/use-focus'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
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
import { getTagDisplayName } from '@/lib/display-labels'
import { toast } from 'sonner'

const PRESET_DURATIONS = [
  { label: '25分钟', value: 25, mode: 'focus' as const, icon: Brain },
  { label: '5分钟', value: 5, mode: 'short_break' as const, icon: Coffee },
  { label: '15分钟', value: 15, mode: 'long_break' as const, icon: Moon },
  { label: '45分钟', value: 45, mode: 'focus' as const, icon: Brain },
]

export function HomeFocusTimer() {
  const { user } = useAuth()
  const { tasks: taskRepo, tags: tagRepo } = useRepos()
  const focus = useFocus()

  const [customMinutes, setCustomMinutes] = useState(25)
  const [localTimerMode, setLocalTimerMode] = useState<'countdown' | 'stopwatch'>('countdown')
  const durationAreaRef = useRef<HTMLDivElement>(null)
  // Focus category (tag-based) — separate from linked task
  const [focusTagId, setFocusTagId] = useState<string>('')
  // Linked task — optional, associates session with a specific task
  const [linkedTaskId, setLinkedTaskId] = useState<string>('')
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

  const { data: tagList = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagRepo.getAll(user!.id),
    enabled: !!user,
  })

  const activeTasks = todayTasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled')

  const handleStart = useCallback(
    (minutes: number, mode: 'focus' | 'short_break' | 'long_break' = 'focus') => {
      focus.start({
        planned_minutes: minutes,
        timer_mode: localTimerMode,
        task_id: linkedTaskId || undefined,
        title: focusTagId ? `分类：${getTagDisplayName(tagList, focusTagId)}` : undefined,
        mode,
      })
    },
    [focus, linkedTaskId, focusTagId, tagList, localTimerMode]
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

  // Display labels
  const focusCategoryLabel = focusTagId
    ? getTagDisplayName(tagList, focusTagId)
    : '选择专注分类'

  const linkedTaskLabel = linkedTaskId
    ? (todayTasks.find((t) => t.id === linkedTaskId)?.title || '未知任务')
    : '不关联日程'

  // Active focus state
  if (focus.isRunning || focus.isPaused) {
    const isStopwatch = focus.timerMode === 'stopwatch'
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
                {focus.isPaused ? '已暂停' : isStopwatch ? '正计时中' : '专注中'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {isStopwatch ? '正计时' : `${focus.plannedMinutes} 分钟`}
            </span>
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center py-3">
            <div className="relative w-32 h-32">
              {!isStopwatch && (
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none" stroke="currentColor" strokeWidth="4"
                    className="text-muted/20"
                  />
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none" stroke="currentColor" strokeWidth="4"
                    strokeLinecap="round"
                    className={cn(
                      'transition-all duration-1000',
                      focus.isPaused ? 'text-amber-500' : 'text-emerald-500'
                    )}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
              )}
              {isStopwatch && (
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="54"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    className="text-emerald-500 animate-pulse"
                    strokeDasharray="10 5"
                  />
                </svg>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn(
                  'text-2xl font-bold tabular-nums tracking-tight',
                  isStopwatch && 'font-mono'
                )}>
                  {focus.formattedTime}
                </span>
                {isStopwatch && (
                  <span className="text-[10px] text-muted-foreground">已用时间</span>
                )}
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
              <Button size="sm" onClick={focus.resume} className="h-8">
                <Play className="h-4 w-4 mr-1" />继续
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={focus.pause} className="h-8">
                <Pause className="h-4 w-4 mr-1" />暂停
              </Button>
            )}
            <Button
              size="sm" variant="outline"
              onClick={() => setShowCancelConfirm(true)}
              className="h-8 text-destructive hover:bg-destructive/10"
            >
              <Square className="h-4 w-4 mr-1" />结束
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
            {/* Focus category (tag-based) */}
            <Select value={focusTagId || 'none'} onValueChange={(v) => setFocusTagId(v && v !== 'none' ? v : '')}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="选择专注分类">
                  {focusTagId ? focusCategoryLabel : '选择专注分类'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">选择专注分类</SelectItem>
                {tagList.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Linked task (optional) */}
            <Select value={linkedTaskId || 'none'} onValueChange={(v) => setLinkedTaskId(v && v !== 'none' ? v : '')}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="不关联日程">
                  {linkedTaskId ? linkedTaskLabel : '不关联日程'}
                </SelectValue>
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

            {/* Timer mode toggle */}
            <div className="flex rounded-md bg-muted p-0.5">
              <button
                onClick={() => setLocalTimerMode('countdown')}
                className={cn(
                  'flex-1 py-1 text-xs rounded-sm transition-colors',
                  localTimerMode === 'countdown'
                    ? 'bg-background shadow-sm font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                倒计时
              </button>
              <button
                onClick={() => setLocalTimerMode('stopwatch')}
                className={cn(
                  'flex-1 py-1 text-xs rounded-sm transition-colors',
                  localTimerMode === 'stopwatch'
                    ? 'bg-background shadow-sm font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                正计时
              </button>
            </div>

            {/* Preset durations — only for countdown */}
            {localTimerMode === 'countdown' && (
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
            )}

            {/* Custom duration with wheel, slider, input */}
            {localTimerMode === 'countdown' ? (
            <div
              ref={durationAreaRef}
              className="space-y-2"
              onWheel={(e) => {
                e.preventDefault()
                const delta = e.deltaY < 0 ? 5 : -5
                setCustomMinutes((prev) => Math.min(240, Math.max(1, prev + delta)))
              }}
            >
              {/* Slider for quick adjustment */}
              <Slider
                value={[customMinutes]}
                onValueChange={(v) => {
                  const arr = v as number[]
                  if (arr.length > 0) setCustomMinutes(arr[0] ?? 25)
                }}
                min={1}
                max={240}
                step={5}
                aria-label="专注时长（分钟）"
                className="px-1"
              />

              {/* Buttons + input + start */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="icon" className="h-7 w-7"
                  onClick={() => setCustomMinutes(Math.max(1, customMinutes - 5))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number" min={1} max={240}
                  value={customMinutes}
                  onChange={(e) => {
                    const v = parseInt(e.target.value)
                    if (isNaN(v) || v < 1) {
                      setCustomMinutes(1)
                    } else if (v > 240) {
                      setCustomMinutes(240)
                    } else {
                      setCustomMinutes(v)
                    }
                  }}
                  onBlur={(e) => {
                    const v = parseInt(e.target.value)
                    if (isNaN(v) || v < 1) setCustomMinutes(25)
                    else if (v > 240) setCustomMinutes(240)
                  }}
                  className="h-7 text-xs text-center w-16"
                />
                <Button
                  variant="outline" size="icon" className="h-7 w-7"
                  onClick={() => setCustomMinutes(Math.min(240, customMinutes + 5))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <span className="text-xs text-muted-foreground">分钟</span>
                <Button size="sm" className="h-7 text-xs ml-auto" onClick={handleCustomStart}>
                  <Play className="h-3 w-3 mr-1" />开始
                </Button>
              </div>
            </div>
          ) : (
            /* Stopwatch mode: simple start button */
            <div className="flex flex-col items-center py-2 space-y-2">
              <p className="text-[10px] text-muted-foreground text-center">
                正计时从 00:00 开始累计<br />完成后保存实际时长
              </p>
              <Button size="sm" onClick={() => handleStart(0)} className="h-8">
                <Play className="h-4 w-4 mr-1" />开始正计时
              </Button>
            </div>
          )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
