'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todayStr } from '@/lib/utils/date'
import type { DailyReview, DailyReviewFormData } from '@/types'
import { Star, Smile, Zap, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DailyReviewFormProps {
  date?: string
}

export function DailyReviewForm({ date = todayStr() }: DailyReviewFormProps) {
  const { user } = useAuth()
  const { dailyReviews } = useRepos()
  const queryClient = useQueryClient()

  const { data: existingReview, isLoading } = useQuery({
    queryKey: ['dailyReview', date],
    queryFn: () => dailyReviews.getByDate(user!.id, date),
    enabled: !!user,
  })

  const mutation = useMutation({
    mutationFn: (data: Omit<DailyReview, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
      dailyReviews.upsert(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyReview', date] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('评价已保存')
    },
    onError: () => {
      toast.error('保存失败，请重试')
    },
  })

  const form = useForm<DailyReviewFormData>({
    defaultValues: {
      score: undefined,
      subjective_completion: undefined,
      mood: undefined,
      energy: undefined,
      achievement: '',
      unfinished: '',
      problems: '',
      lessons: '',
      tomorrow_focus: '',
      summary: '',
    },
  })

  useEffect(() => {
    if (existingReview) {
      form.reset({
        score: existingReview.score,
        subjective_completion: existingReview.subjective_completion,
        mood: existingReview.mood,
        energy: existingReview.energy,
        achievement: existingReview.achievement || '',
        unfinished: existingReview.unfinished || '',
        problems: existingReview.problems || '',
        lessons: existingReview.lessons || '',
        tomorrow_focus: existingReview.tomorrow_focus || '',
        summary: existingReview.summary || '',
      })
    }
  }, [existingReview, form])

  const handleSubmit = (data: DailyReviewFormData) => {
    if (!user) return
    mutation.mutate({
      review_date: date,
      ...data,
      score: data.score ?? undefined,
      subjective_completion: data.subjective_completion ?? undefined,
      mood: data.mood ?? undefined,
      energy: data.energy ?? undefined,
    })
  }

  if (isLoading) return <div className="h-32 bg-muted animate-pulse rounded-lg" />

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">每日评价</CardTitle>
          <Button type="submit" size="sm" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            保存
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ScoreSelect
              label="评分"
              icon={<Star className="h-4 w-4" />}
              value={form.watch('score')}
              onChange={(v) => form.setValue('score', v ?? undefined)}
              max={10}
            />
            <ScoreSelect
              label="完成度"
              value={form.watch('subjective_completion')}
              onChange={(v) => form.setValue('subjective_completion', v ?? undefined)}
              max={100}
              step={10}
              unit="%"
            />
            <ScoreSelect
              label="心情"
              icon={<Smile className="h-4 w-4" />}
              value={form.watch('mood')}
              onChange={(v) => form.setValue('mood', v ?? undefined)}
              max={5}
            />
            <ScoreSelect
              label="精力"
              icon={<Zap className="h-4 w-4" />}
              value={form.watch('energy')}
              onChange={(v) => form.setValue('energy', v ?? undefined)}
              max={5}
            />
          </div>

          {/* Text fields */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>今日最重要的成果</Label>
              <Textarea {...form.register('achievement')} placeholder="今天完成了什么？" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>未完成的事情</Label>
              <Textarea {...form.register('unfinished')} placeholder="什么没有按计划完成？" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>遇到的问题</Label>
              <Textarea {...form.register('problems')} placeholder="遇到了什么困难？" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>今日收获</Label>
              <Textarea {...form.register('lessons')} placeholder="今天学到了什么？" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>明日最重要的三件事</Label>
              <Textarea {...form.register('tomorrow_focus')} placeholder="明天需要优先完成什么？" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>自由总结</Label>
              <Textarea {...form.register('summary')} placeholder="还有想记录的..." rows={3} />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

function ScoreSelect({
  label,
  icon,
  value,
  onChange,
  max,
  step = 1,
  unit = '',
}: {
  label: string
  icon?: React.ReactNode
  value?: number
  onChange: (v: number | null) => void
  max: number
  step?: number
  unit?: string
}) {
  const options = Array.from({ length: max / step }, (_, i) => (i + 1) * step)
  const stringValue = value?.toString() ?? ''

  return (
    <div className="space-y-1.5">
      <Label className="text-xs flex items-center gap-1">
        {icon}
        {label}
      </Label>
      <Select value={stringValue} onValueChange={(v: string | null) => onChange(v ? Number(v) : null)}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">—</SelectItem>
          {options.map((n) => (
            <SelectItem key={n} value={n.toString()}>
              {n}{unit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
