'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDays, Mail, Key, AlertCircle, Loader2 } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
})

const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: '两次密码不一致',
  path: ['confirmPassword'],
})

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading, isDemoMode, signIn, signUp } = useAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    if (user) router.push('/calendar')
  }, [user, router])

  const handleLogin = async (data: LoginData) => {
    setError('')
    setSubmitting(true)
    const result = await signIn(data.email, data.password)
    setSubmitting(false)
    if (result.error) setError(result.error)
  }

  const handleRegister = async (data: RegisterData) => {
    setError('')
    setSubmitting(true)
    const result = await signUp(data.email, data.password)
    setSubmitting(false)
    if (result.error) setError(result.error)
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-sm text-muted-foreground">
            {isDemoMode ? '本地演示模式' : '个人计划管理'}
          </p>
        </div>

        {isDemoMode && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>本地演示模式：点击登录即可使用，数据保存在浏览器中。配置 Supabase 后可跨设备同步。</span>
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">登录</CardTitle>
                <CardDescription>使用邮箱和密码登录你的账户</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••"
                        className="pl-10"
                        {...loginForm.register('password')}
                      />
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    登录
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">注册</CardTitle>
                <CardDescription>创建新账户开始使用</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">邮箱</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="your@email.com"
                      {...registerForm.register('email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">密码</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="至少6位"
                      {...registerForm.register('password')}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">确认密码</Label>
                    <Input
                      id="reg-confirm"
                      type="password"
                      placeholder="再次输入密码"
                      {...registerForm.register('confirmPassword')}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    注册
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
