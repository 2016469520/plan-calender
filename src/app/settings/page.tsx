'use client'

import { useAuth } from '@/providers/auth-provider'
import { useRepos } from '@/providers/repo-provider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LogOut, Moon, Sun, Monitor, Bell, BellOff, BellRing, MonitorDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TagManager } from '@/components/common/tag-manager'
import { ReminderList } from '@/components/reminders/reminder-list'
import { TemplateManager } from '@/components/plans/template-manager'
import { OverdueProcessor } from '@/components/plans/overdue-processor'
import { ImportExportDialog } from '@/components/plans/import-export-dialog'
import { useNotifications } from '@/hooks/use-notifications'
import { usePwa } from '@/components/pwa/pwa-provider'
import { toast } from 'sonner'
import { Download } from 'lucide-react'
import { useState } from 'react'
import type { CalendarView, WeekStartDay, ThemeMode } from '@/types'

export default function SettingsPage() {
  const { user, isDemoMode, signOut } = useAuth()
  const { users } = useRepos()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()
  const [showImportExport, setShowImportExport] = useState(false)
  const {
    permission,
    requestPermission,
    isSupported: notifSupported,
  } = useNotifications()
  const { isInstallable, promptInstall } = usePwa()

  const { data: prefs } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: () => users.getPreferences(user!.id),
    enabled: !!user,
  })

  const upsertMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      users.upsertPreferences(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] })
    },
    onError: () => toast.error('保存失败'),
  })

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked && permission !== 'granted') {
      // Trigger notification permission request - user initiated click
      const state = await requestPermission()
      if (state === 'denied') {
        toast.error('通知权限被拒绝，请在浏览器设置中开启')
        return
      }
      if (state === 'unsupported') {
        toast.error('您的浏览器不支持通知功能')
        return
      }
      if (state === 'granted') {
        toast.success('通知已开启')
      }
    }
    upsertMutation.mutate({ notification_enabled: checked })
  }

  const handleThemeChange = (t: string) => {
    setTheme(t)
    upsertMutation.mutate({ theme: t as ThemeMode })
  }

  const handleCompactMode = (checked: boolean) => {
    upsertMutation.mutate({ compact_mode: checked })
  }

  const handleDefaultView = (view: string | null) => {
    if (!view) return
    upsertMutation.mutate({ default_calendar_view: view as CalendarView })
  }

  const handleWeekStart = (day: string | null) => {
    if (day === null) return
    upsertMutation.mutate({ week_starts_on: parseInt(day) as WeekStartDay })
  }

  const handleSignOut = async () => {
    await signOut()
    queryClient.clear()
    router.push('/login')
  }

  if (!user) return null

  const notificationEnabled = prefs?.notification_enabled ?? true
  const compactMode = prefs?.compact_mode ?? false
  const defaultView = prefs?.default_calendar_view || 'month'
  const weekStartsOn = prefs?.week_starts_on ?? 0

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">设置</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isDemoMode ? '本地演示模式' : user.email}
        </p>
      </div>

      {/* PWA Install */}
      {isInstallable && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MonitorDown className="h-5 w-5" />安装应用
            </CardTitle>
            <CardDescription>
              将应用安装到桌面或主屏幕，像原生 App 一样使用
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => { promptInstall(); toast.success('请在弹出的安装窗口中确认') }}>
              <MonitorDown className="h-4 w-4 mr-2" />添加到主屏幕
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">提醒</CardTitle>
          <CardDescription>管理通知和提醒设置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>浏览器通知</Label>
              <p className="text-xs text-muted-foreground">
                {!notifSupported
                  ? '当前浏览器不支持通知'
                  : permission === 'granted'
                  ? '通知已开启'
                  : permission === 'denied'
                  ? '通知已被浏览器阻止'
                  : '点击开启通知权限'}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {permission === 'granted' ? (
                <BellRing className="h-4 w-4 text-primary" />
              ) : permission === 'denied' ? (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bell className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                checked={notificationEnabled && permission === 'granted'}
                onCheckedChange={handleNotificationToggle}
                disabled={!notifSupported || permission === 'denied'}
              />
            </div>
          </div>

          <div className="pt-3 border-t">
            <ReminderList />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">外观</CardTitle>
          <CardDescription>调整主题和显示偏好</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>主题</Label>
            <div className="flex items-center gap-1">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleThemeChange('light')}
                title="浅色模式"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleThemeChange('dark')}
                title="深色模式"
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => handleThemeChange('system')}
                title="跟随系统"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>紧凑模式</Label>
              <p className="text-xs text-muted-foreground">使用更紧凑的界面布局</p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={handleCompactMode}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">日历</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>默认视图</Label>
            <Select
              value={defaultView}
              onValueChange={handleDefaultView}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">月视图</SelectItem>
                <SelectItem value="week">周视图</SelectItem>
                <SelectItem value="day">日视图</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>每周起始日</Label>
            <Select
              value={String(weekStartsOn)}
              onValueChange={handleWeekStart}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">周日</SelectItem>
                <SelectItem value="1">周一</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md">
        <TagManager />
      </div>

      {/* Overdue tasks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            延期事项处理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OverdueProcessor />
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">事项模板</CardTitle>
          <CardDescription>从常用事项创建模板，快速添加</CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateManager />
        </CardContent>
      </Card>

      {/* Import/Export */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">数据管理</CardTitle>
          <CardDescription>导入导出事项数据</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => setShowImportExport(true)}
          >
            <Download className="h-4 w-4 mr-2" />导入 / 导出
          </Button>
        </CardContent>
      </Card>

      <ImportExportDialog
        open={showImportExport}
        onOpenChange={setShowImportExport}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">账户</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="h-4 w-4 mr-2" />退出登录
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
