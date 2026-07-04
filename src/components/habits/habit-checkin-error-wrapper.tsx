'use client'

import { Component, type ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Fine-grained error boundary for HabitCheckin.
 * Catches rendering errors so the habits page shell stays intact.
 */
export class HabitCheckinErrorWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[HabitCheckin] Render error:', error)
    console.error('[HabitCheckin] Component stack:', info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <Card className="border-destructive/30">
          <CardContent className="py-6 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive/60 mx-auto" />
            <div>
              <p className="text-sm font-medium text-destructive">习惯组件渲染失败</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto break-all">
                {this.state.error.message.slice(0, 200)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => this.setState({ error: null })}
            >
              重试
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
