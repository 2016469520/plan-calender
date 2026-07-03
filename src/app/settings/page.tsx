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
import {
  LogOut, Moon, Sun, Monitor, Bell, BellOff, BellRing, MonitorDown,
  Palette, CalendarDays, Timer, Database, User, Tag
} from 'lucide-react'
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
import { CALENDAR_VIEW_LABELS, WEEK_START_LABELS } from '@/lib/constants'

type SettingsSection = 'appearance' | 'calendar' | 'focus' | 'notifications' | 'tags' | 'data' | 'account'

const SECTION_ITEMS: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'appearance', label: '外观', icon: Palette },
  { id: 'calendar', label: '日历', icon: CalendarDays },
  { id: 'focus', label: '专注', icon: Timer },
  { id: 'notifications', label: '提醒', icon: Bell },
  { id: 'tags', label: '标签', icon: Tag },
  { id: 'data', label: '数据', icon: Database },
  { id: 'account', label: '账户', icon: User },
]

export default function SettingsPage() {
  const { user, isDemoMode, signOut } = useAuth()
  const { users } = useRepos()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()
  const [showImportExport, setShowImportExport] = useState(false)
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance')
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
    <div className="flex flex-col lg:flex-row h-full">
      {/* Desktop secondary nav */}
      <aside className="hidden lg:flex flex-col w-48 lg:w-56 border-b lg:border-b-0 lg:border-r bg-card/30 shrink-0">
        <div className="p-4">
          <h1 className="text-lg font-bold">设置</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isDemoMode ? '本地演示模式' : user.email?.split('@')[0]}
          </p>
        </div>
        <nav className="flex-1 px-2 pb-2 space-y-0.5">
          {SECTION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile section tabs */}
      <div className="lg:hidden flex overflow-x-auto border-b px-2 py-2 gap-1">
        {SECTION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
              activeSection === item.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 lg:max-w-3xl xl:max-w-4xl">
        {/* PWA Install — always visible at top */}
        {isInstallable && (
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
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

        {/* Appearance */}
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">主题</CardTitle>
                  <CardDescription>选择界面颜色模式</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('light')}
                    >
                      <Sun className="h-4 w-4 mr-1" />浅色
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('dark')}
                    >
                      <Moon className="h-4 w-4 mr-1" />深色
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleThemeChange('system')}
                    >
                      <Monitor className="h-4 w-4 mr-1" />跟随系统
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">界面偏好</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">紧凑模式</Label>
                      <p className="text-xs text-muted-foreground">使用更紧凑的界面布局</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={handleCompactMode} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Calendar */}
        {activeSection === 'calendar' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">日历偏好</CardTitle>
              <CardDescription>设置默认视图和每周起始日</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">默认视图</Label>
                <Select value={defaultView} onValueChange={handleDefaultView}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="请选择">
                      {CALENDAR_VIEW_LABELS[defaultView as CalendarView] || defaultView}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(CALENDAR_VIEW_LABELS) as [CalendarView, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">每周起始日</Label>
                <Select value={String(weekStartsOn)} onValueChange={handleWeekStart}>
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="请选择">
                      {WEEK_START_LABELS[weekStartsOn as WeekStartDay] || String(weekStartsOn)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(WEEK_START_LABELS) as [string, string][]).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Focus */}
        {activeSection === 'focus' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">专注设置</CardTitle>
              <CardDescription>设置专注计时的默认参数</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                专注功能使用番茄钟计时法。默认专注时长为 25 分钟，
                短休息 5 分钟，长休息 15 分钟。可在专注页面中自定义每次时长。
              </p>
            </CardContent>
          </Card>
        )}

        {/* Notifications */}
        {activeSection === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">浏览器通知</CardTitle>
                <CardDescription>管理通知和提醒设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">通知开关</Label>
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
              <CardHeader className="pb-3">
                <CardTitle className="text-base">延期事项处理</CardTitle>
              </CardHeader>
              <CardContent>
                <OverdueProcessor />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tags */}
        {activeSection === 'tags' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">标签管理</CardTitle>
              <CardDescription>创建、编辑和排序标签</CardDescription>
            </CardHeader>
            <CardContent>
              <TagManager />
            </CardContent>
          </Card>
        )}

        {/* Data */}
        {activeSection === 'data' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">事项模板</CardTitle>
                <CardDescription>从常用事项创建模板，快速添加</CardDescription>
              </CardHeader>
              <CardContent>
                <TemplateManager />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">数据管理</CardTitle>
                <CardDescription>导入导出事项数据</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setShowImportExport(true)}>
                  <Download className="h-4 w-4 mr-2" />导入 / 导出
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Account */}
        {activeSection === 'account' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">账户</CardTitle>
              <CardDescription>
                {isDemoMode ? '本地演示模式 — 数据保存在浏览器中' : `登录账号：${user.email}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />退出登录
              </Button>
            </CardContent>
          </Card>
        )}

        <ImportExportDialog open={showImportExport} onOpenChange={setShowImportExport} />
      </div>
    </div>
  )
}
