'use client'

import { useState, useCallback, useRef, useEffect, startTransition } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { FocusSession, FocusSessionFormData } from '@/types'
import { toast } from 'sonner'

const STORAGE_KEY = 'plan-calendar-active-focus'

interface FocusState {
  sessionId: string
  plannedMinutes: number
  startedAt: string
  pausedAt: string | null
  elapsedBeforePause: number
}

function calcElapsed(session: FocusSession): number {
  if (!session.started_at) return 0
  const start = new Date(session.started_at).getTime()
  const now = Date.now()
  let elapsed = Math.floor((now - start) / 1000)
  if (session.paused_at) {
    elapsed = Math.floor((new Date(session.paused_at).getTime() - start) / 1000)
  }
  return Math.max(0, elapsed)
}

function fmtTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function useFocus() {
  const { user } = useAuth()
  const { focusSessions: fsRepo, tasks: taskRepo } = useRepos()
  const queryClient = useQueryClient()

  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [plannedMinutes, setPlannedMinutes] = useState(25)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | undefined>(undefined)
  const [sessionTitle, setSessionTitle] = useState<string | undefined>(undefined)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef<FocusState | null>(null)

  // Keep refs in sync with latest state for callbacks
  const latestRef = useRef({ userId: '', sessionId: null as string | null, plannedMinutes: 25, taskId: undefined as string | undefined })
  useEffect(() => {
    latestRef.current = { userId: user?.id || '', sessionId, plannedMinutes, taskId }
  })

  const { data: activeSession } = useQuery({
    queryKey: ['focus', 'active'],
    queryFn: () => fsRepo.getActive(user!.id),
    enabled: !!user,
    refetchOnWindowFocus: true,
  })

  // Complete callback via ref to avoid dependency issues in interval
  const completeRef = useRef<() => Promise<void>>(async () => {})

  const completeSession = useCallback(async () => {
    const { userId: uid, sessionId: sid, plannedMinutes: mins, taskId: tid } = latestRef.current

    if (!uid || !sid) return

    setIsRunning(false)
    setIsPaused(false)
    const now = new Date().toISOString()

    try {
      await fsRepo.update(uid, sid, {
        status: 'completed',
        completed_at: now,
        actual_seconds: mins * 60,
      } as Partial<FocusSession>)

      if (tid) {
        try {
          const task = await taskRepo.getById(uid, tid)
          if (task) {
            const currentActual = task.actual_minutes || 0
            await taskRepo.update(uid, tid, {
              actual_minutes: currentActual + Math.round(mins),
            } as Partial<import('@/types').Task>)
          }
        } catch { /* non-critical */ }
      }

      localStorage.removeItem(STORAGE_KEY)
      stateRef.current = null
      queryClient.invalidateQueries({ queryKey: ['focus', 'active'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['focus', 'stats'] })
      toast.success('专注完成！', { duration: 3000 })
    } catch {
      toast.error('保存专注记录失败')
    }
  }, [fsRepo, taskRepo, queryClient])

  useEffect(() => {
    completeRef.current = completeSession
  })

  // Sync state from DB on mount / active session change
  useEffect(() => {
    if (activeSession && (activeSession.status === 'running' || activeSession.status === 'paused')) {
      const totalSeconds = activeSession.planned_minutes * 60
      const elapsed = calcElapsed(activeSession)
      const remaining = Math.max(0, totalSeconds - elapsed)

      startTransition(() => {
        setSessionId(activeSession.id)
        setPlannedMinutes(activeSession.planned_minutes)
        setTaskId(activeSession.task_id)
        setSessionTitle(activeSession.title || undefined)
        setIsPaused(activeSession.status === 'paused')
        setRemainingSeconds(remaining)
        if (activeSession.status === 'running') {
          setIsRunning(true)
        }
      })

      stateRef.current = {
        sessionId: activeSession.id,
        plannedMinutes: activeSession.planned_minutes,
        startedAt: activeSession.started_at || new Date().toISOString(),
        pausedAt: activeSession.paused_at || null,
        elapsedBeforePause: elapsed,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current))
    } else {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed: FocusState = JSON.parse(stored)
          stateRef.current = parsed
          startTransition(() => {
            setSessionId(parsed.sessionId)
            setPlannedMinutes(parsed.plannedMinutes)
          })
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }, [activeSession])

  // Timer tick
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = Math.max(0, prev - 1)
        if (next === 0) {
          completeRef.current()
        }
        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning, isPaused])

  const start = useCallback(
    async (data: FocusSessionFormData) => {
      if (!user) return
      if (isRunning) {
        toast.error('当前已有专注正在进行')
        return
      }

      const now = new Date().toISOString()
      try {
        const session = await fsRepo.create(user.id, {
          task_id: data.task_id,
          title: data.title,
          mode: data.mode || 'focus',
          planned_minutes: data.planned_minutes,
          actual_seconds: 0,
          started_at: now,
          status: 'running',
          pause_count: 0,
        })

        setSessionId(session.id)
        setPlannedMinutes(data.planned_minutes)
        setRemainingSeconds(data.planned_minutes * 60)
        setTaskId(data.task_id)
        setSessionTitle(data.title)
        setIsRunning(true)
        setIsPaused(false)

        stateRef.current = {
          sessionId: session.id,
          plannedMinutes: data.planned_minutes,
          startedAt: now,
          pausedAt: null,
          elapsedBeforePause: 0,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current))

        toast.success(data.mode === 'short_break' ? '休息开始' : '专注开始', { duration: 1500 })
      } catch {
        toast.error('开始专注失败')
      }
    },
    [user, fsRepo, isRunning]
  )

  const pause = useCallback(async () => {
    if (!user || !sessionId || !isRunning) return
    const now = new Date().toISOString()
    try {
      const elapsed = plannedMinutes * 60 - remainingSeconds
      await fsRepo.update(user.id, sessionId, {
        status: 'paused',
        paused_at: now,
        actual_seconds: elapsed,
        pause_count: (activeSession?.pause_count || 0) + 1,
      } as Partial<FocusSession>)

      setIsPaused(true)
      if (stateRef.current) {
        stateRef.current.pausedAt = now
        stateRef.current.elapsedBeforePause = elapsed
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current))
      }
      queryClient.invalidateQueries({ queryKey: ['focus', 'active'] })
    } catch {
      toast.error('暂停失败')
    }
  }, [user, fsRepo, sessionId, isRunning, plannedMinutes, remainingSeconds, activeSession, queryClient])

  const resume = useCallback(async () => {
    if (!user || !sessionId) return
    try {
      await fsRepo.update(user.id, sessionId, {
        status: 'running',
        paused_at: undefined,
      } as Partial<FocusSession>)

      setIsPaused(false)
      if (stateRef.current) {
        stateRef.current.pausedAt = null
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current))
      }
      queryClient.invalidateQueries({ queryKey: ['focus', 'active'] })
    } catch {
      toast.error('恢复失败')
    }
  }, [user, fsRepo, sessionId, queryClient])

  const cancel = useCallback(async () => {
    if (!user || !sessionId) return
    try {
      const elapsed = plannedMinutes * 60 - remainingSeconds
      await fsRepo.update(user.id, sessionId, {
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        actual_seconds: Math.max(0, elapsed),
      } as Partial<FocusSession>)

      setIsRunning(false)
      setIsPaused(false)
      setSessionId(null)
      setRemainingSeconds(0)

      localStorage.removeItem(STORAGE_KEY)
      stateRef.current = null
      queryClient.invalidateQueries({ queryKey: ['focus', 'active'] })
      toast('专注已取消')
    } catch {
      toast.error('取消失败')
    }
  }, [user, fsRepo, sessionId, plannedMinutes, remainingSeconds, queryClient])

  const progress = plannedMinutes > 0
    ? ((plannedMinutes * 60 - remainingSeconds) / (plannedMinutes * 60)) * 100
    : 0

  return {
    isRunning,
    isPaused,
    remainingSeconds,
    plannedMinutes,
    sessionId,
    taskId,
    sessionTitle,
    progress,
    formattedTime: fmtTime(remainingSeconds),
    start,
    pause,
    resume,
    cancel,
    formatTime: fmtTime,
  }
}
