'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function HabitsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[HabitsPage] Unhandled error:', error)
  }, [error])

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">习惯打卡</h1>
        <p className="text-sm text-muted-foreground mt-1">坚持每一天</p>
      </div>

      <Card className="border-destructive/30">
        <CardContent className="py-8 text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-destructive/60 mx-auto" />
          <div>
            <p className="text-sm font-medium">页面加载出错</p>
            <p className="text-xs text-muted-foreground mt-1">
              请尝试刷新页面或检查网络连接
            </p>
            {error.digest && (
              <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">
                ID: {error.digest}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            重试
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
