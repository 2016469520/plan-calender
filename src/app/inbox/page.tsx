'use client'

import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Inbox, ArrowRight } from 'lucide-react'

export default function InboxPage() {
  const { user } = useAuth()
  const { tasks } = useRepos()

  const { data: inboxTasks = [] } = useQuery({
    queryKey: ['tasks', 'inbox'],
    queryFn: () => tasks.getByDate(user!.id, 'inbox'),
    enabled: !!user,
  })

  if (!user) return null

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">收集箱</h1>
        <p className="text-sm text-muted-foreground mt-1">
          快速记录想法和待安排事项
        </p>
      </div>

      {inboxTasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <Inbox className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">收集箱为空</p>
            <p className="text-xs text-muted-foreground">快速记录暂时没有日期和时段的事项</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {inboxTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex items-center gap-3 py-3">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span>{task.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
