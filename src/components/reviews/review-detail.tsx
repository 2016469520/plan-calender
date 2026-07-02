'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { DailyReviewForm } from './daily-review-form'
import { useRepos } from '@/providers/repo-provider'
import { useAuth } from '@/providers/auth-provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDisplayDate, formatWeekday } from '@/lib/utils/date'
import type { DailyReview } from '@/types'
import {
  Star,
  Smile,
  Zap,
  TrendingUp,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

interface ReviewDetailProps {
  review: DailyReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: () => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function ReviewDetail({
  review,
  open,
  onOpenChange,
  onEdit,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ReviewDetailProps) {
  const [editing, setEditing] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { user } = useAuth()
  const { dailyReviews } = useRepos()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => dailyReviews.delete(user!.id, review!.review_date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      queryClient.invalidateQueries({ queryKey: ['dailyReview'] })
      toast.success('评价已删除')
      setDeleteOpen(false)
      onOpenChange(false)
    },
    onError: () => {
      toast.error('删除失败，请重试')
    },
  })

  if (!review) return null

  if (editing) {
    return (
      <Sheet open={open} onOpenChange={(o) => { if (!o) setEditing(false); onOpenChange(o); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <ScrollArea className="h-full p-6">
            <SheetHeader className="mb-4">
              <SheetTitle>编辑评价 — {formatDisplayDate(review.review_date)}</SheetTitle>
            </SheetHeader>
            <DailyReviewForm
              date={review.review_date}
              onSaved={() => {
                setEditing(false)
                queryClient.invalidateQueries({ queryKey: ['reviews'] })
              }}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  const fields = [
    { label: '评分', value: review.score, icon: Star, unit: '/10', color: 'text-amber-500' },
    { label: '完成度', value: review.subjective_completion, icon: TrendingUp, unit: '%', color: 'text-emerald-500' },
    { label: '心情', value: review.mood, icon: Smile, unit: '/5', color: 'text-rose-400' },
    { label: '精力', value: review.energy, icon: Zap, unit: '/5', color: 'text-amber-400' },
  ]

  const textFields = [
    { label: '今日成果', value: review.achievement },
    { label: '未完成事项', value: review.unfinished },
    { label: '遇到的问题', value: review.problems },
    { label: '今日收获', value: review.lessons },
    { label: '明日重点', value: review.tomorrow_focus },
    { label: '自由总结', value: review.summary },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <ScrollArea className="h-full p-6">
            <SheetHeader className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasPrevious && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrevious}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <SheetTitle className="text-base">
                    {formatDisplayDate(review.review_date)}
                  </SheetTitle>
                  {hasNext && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNext}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatWeekday(review.review_date)}
                </span>
              </div>
            </SheetHeader>

            {/* Score fields */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {fields.map((f) => (
                <div key={f.label} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{f.label}</div>
                  <div className="flex items-center justify-center gap-0.5">
                    <f.icon className={`h-4 w-4 ${f.color}`} />
                    <span className="text-lg font-bold tabular-nums">
                      {f.value != null ? f.value : '—'}
                    </span>
                  </div>
                  {f.value != null && (
                    <div className="text-[10px] text-muted-foreground">{f.unit}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Text fields */}
            <div className="space-y-4">
              {textFields.map((f) =>
                f.value ? (
                  <div key={f.label} className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">{f.label}</div>
                    <p className="text-sm whitespace-pre-wrap">{f.value}</p>
                  </div>
                ) : null
              )}
            </div>

            {/* Created/Updated */}
            <div className="mt-6 pt-4 border-t space-y-1 text-xs text-muted-foreground">
              <div>创建：{new Date(review.created_at).toLocaleString('zh-CN')}</div>
              <div>更新：{new Date(review.updated_at).toLocaleString('zh-CN')}</div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                编辑
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                删除
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除评价</DialogTitle>
            <DialogDescription>
              确定要删除 {formatDisplayDate(review.review_date)} 的评价吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
