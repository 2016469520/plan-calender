'use client'

// ============================================================
// 氛围设置面板
//
// 组织原则：先给"看起来是什么"（场景缩略图），再给"怎么用"（开关与强度），
// 最后是"恢复"。避免把设置页堆成参数表。
// ============================================================

import { useMemo, useState } from 'react'
import {
  Check,
  Eye,
  ImageIcon,
  MessageSquareQuote,
  RotateCcw,
  Shuffle,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useAppearance } from '@/providers/appearance-provider'
import {
  EXPRESSION_LABELS,
  charactersForTheme,
  quotesForTheme,
  scenesForTheme,
} from '@/lib/theme/atmosphere'
import { renderCharacter, renderScene } from '@/components/atmosphere/art/registry'
import { QuoteStrip } from '@/components/atmosphere/quote-strip'

function Row({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-body text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-micro text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function AtmospherePanel() {
  const { state, theme, patchAtmosphere, resetAtmosphere } = useAppearance()
  const atmo = state.atmosphere
  const [customQuote, setCustomQuote] = useState('')

  const scenes = useMemo(() => scenesForTheme(state.themeId), [state.themeId])
  const characters = useMemo(() => charactersForTheme(state.themeId), [state.themeId])
  const activeSceneId = atmo.sceneByTheme[state.themeId] ?? scenes[0]?.id
  const activeCharacter = characters.find(
    (c) => c.id === atmo.characterByTheme[state.themeId]
  ) ?? characters[0]
  const customList = atmo.customQuotes[state.themeId] ?? []
  const builtinCount = quotesForTheme(state.themeId).length

  const setScene = (id: string) =>
    patchAtmosphere({ sceneByTheme: { ...atmo.sceneByTheme, [state.themeId]: id } })

  const setCharacter = (id: string) =>
    patchAtmosphere({
      characterByTheme: { ...atmo.characterByTheme, [state.themeId]: id },
    })

  const addCustomQuote = () => {
    const text = customQuote.trim()
    if (!text) return
    patchAtmosphere({
      customQuotes: {
        ...atmo.customQuotes,
        [state.themeId]: [...customList, text].slice(0, 20),
      },
    })
    setCustomQuote('')
  }

  const removeCustomQuote = (index: number) => {
    patchAtmosphere({
      customQuotes: {
        ...atmo.customQuotes,
        [state.themeId]: customList.filter((_, i) => i !== index),
      },
    })
  }

  return (
    <section className="surface p-4" data-testid="atmosphere-panel">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-section text-foreground">沉浸氛围</h2>
            <p className="mt-0.5 text-caption text-muted-foreground">
              场景、角色、每日一句与氛围动画。全部随包离线，可随时整体关闭
            </p>
          </div>
        </div>
        <Switch
          checked={atmo.enabled}
          onCheckedChange={(v) => patchAtmosphere({ enabled: v })}
          aria-label="沉浸氛围开关"
        />
      </div>

      <div className={cn(!atmo.enabled && 'pointer-events-none opacity-50')}>
        {/* 场景 */}
        <div className="border-t border-border pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {theme.name} · 场景
            </p>
            <span className="text-micro text-muted-foreground">{scenes.length} 张</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {scenes.map((scene) => {
              const active = activeSceneId === scene.id
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setScene(scene.id)}
                  aria-pressed={active}
                  data-testid={`scene-${scene.id}`}
                  className={cn(
                    'atmo-thumb group relative border-2 text-left ui-transition',
                    active
                      ? 'border-primary shadow-[var(--shadow-card)]'
                      : 'border-transparent hover:border-border-strong'
                  )}
                >
                  <div className="relative h-20 w-full overflow-hidden bg-surface-2">
                    {renderScene(scene.id, 'h-full w-full')}
                  </div>
                  <div className="flex items-center justify-between gap-1 px-1.5 py-1">
                    <span className="truncate text-micro text-foreground">{scene.name}</span>
                    {active && <Check className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />}
                  </div>
                </button>
              )
            })}
          </div>
          <Row label="随机轮换" description="每天首次打开时换一张（同一天内稳定）">
            <Switch
              checked={atmo.rotateScenes}
              onCheckedChange={(v) => patchAtmosphere({ rotateScenes: v })}
              aria-label="随机轮换场景"
            />
          </Row>
        </div>

        {/* 角色 */}
        {characters.length > 0 && (
          <div className="border-t border-border pt-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                角色伙伴
              </p>
              <Switch
                checked={atmo.characterEnabled}
                onCheckedChange={(v) => patchAtmosphere({ characterEnabled: v })}
                aria-label="角色显示开关"
              />
            </div>
            <div className="space-y-2">
              {characters.map((character) => {
                const active = activeCharacter?.id === character.id
                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => setCharacter(character.id)}
                    aria-pressed={active}
                    data-testid={`character-${character.id}`}
                    className={cn(
                      'atmo-thumb flex w-full items-center gap-3 border p-2 text-left ui-transition',
                      active
                        ? 'border-primary/50 bg-primary/[0.06]'
                        : 'border-border hover:bg-accent/60'
                    )}
                  >
                    <span className="atmo-thumb flex h-16 w-14 shrink-0 items-center justify-center bg-surface-2">
                      {renderCharacter(character.id, { expression: 'idle', className: 'h-full w-full' })}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-body font-medium text-foreground">
                          {character.name}
                        </span>
                        {active && (
                          <span className="rounded-full bg-primary/12 px-1.5 py-0.5 text-[10px] text-primary">
                            使用中
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-micro text-muted-foreground">
                        {character.description}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1">
                        {character.expressions.map((e) => (
                          <span
                            key={e}
                            className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {EXPRESSION_LABELS[e]}
                          </span>
                        ))}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-micro text-muted-foreground">
              表情由真实状态驱动：完成任务会开心，专注计时中会进入工作状态，保存失败会提醒你。
            </p>
          </div>
        )}

        {/* 每日一句 */}
        <div className="border-t border-border pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
              <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden="true" />
              每日一句
            </p>
            <Switch
              checked={atmo.quoteEnabled}
              onCheckedChange={(v) => patchAtmosphere({ quoteEnabled: v })}
              aria-label="每日一句开关"
            />
          </div>

          <QuoteStrip className="mb-2" />

          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              placeholder="加一句自己的话…"
              maxLength={120}
              className="h-8 w-56"
              aria-label="自定义短句"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomQuote()
                }
              }}
            />
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              disabled={!customQuote.trim() || customList.length >= 20}
              onClick={addCustomQuote}
            >
              添加
            </Button>
            <span className="text-micro text-muted-foreground">
              内置 {builtinCount} 句 · 自定义 {customList.length}/20
            </span>
          </div>

          {customList.length > 0 && (
            <ul className="mt-2 space-y-1">
              {customList.map((text, i) => (
                <li
                  key={`${text}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-md bg-surface-2 px-2 py-1"
                >
                  <span className="min-w-0 truncate text-caption text-foreground">{text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 shrink-0 px-1.5 text-micro text-muted-foreground hover:text-destructive"
                    onClick={() => removeCustomQuote(i)}
                  >
                    删除
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 背景强度 */}
        <div className="border-t border-border pt-3">
          <p className="mb-2 flex items-center gap-1.5 text-caption text-muted-foreground">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            背景强度
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Label className="w-16 shrink-0 text-caption text-muted-foreground">可见度</Label>
              <Slider
                value={[atmo.bgOpacity]}
                onValueChange={(v) => patchAtmosphere({ bgOpacity: (v as number[])[0] })}
                min={0}
                max={100}
                step={5}
                className="flex-1"
                aria-label="背景可见度"
              />
              <span className="w-10 shrink-0 text-right text-caption tabular-nums text-muted-foreground">
                {atmo.bgOpacity}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-16 shrink-0 text-caption text-muted-foreground">模糊</Label>
              <Slider
                value={[atmo.bgBlur]}
                onValueChange={(v) => patchAtmosphere({ bgBlur: (v as number[])[0] })}
                min={0}
                max={20}
                step={1}
                className="flex-1"
                aria-label="背景模糊"
              />
              <span className="w-10 shrink-0 text-right text-caption tabular-nums text-muted-foreground">
                {atmo.bgBlur}px
              </span>
            </div>
          </div>
        </div>

        {/* 效果开关 */}
        <div className="border-t border-border pt-3">
          <Row label="氛围动画" description="花瓣、星点、扫描线、像素粒子（低帧耗）">
            <Switch
              checked={atmo.animations}
              onCheckedChange={(v) => patchAtmosphere({ animations: v })}
              aria-label="氛围动画开关"
            />
          </Row>
          <Row label="完成庆祝" description="勾选完成时撒一点彩带">
            <Switch
              checked={atmo.celebration}
              onCheckedChange={(v) => patchAtmosphere({ celebration: v })}
              aria-label="完成庆祝开关"
            />
          </Row>
          <Row label="每日开场页" description="每天第一次打开时展示场景与问候">
            <Switch
              checked={atmo.welcome}
              onCheckedChange={(v) => patchAtmosphere({ welcome: v })}
              aria-label="开场页开关"
            />
          </Row>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={resetAtmosphere}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            恢复主题默认视觉素材
          </Button>
          <span className="flex items-center gap-1 text-micro text-muted-foreground">
            <Shuffle className="h-3 w-3" aria-hidden="true" />
            所有素材为原创 SVG，随包离线可用
          </span>
        </div>
      </div>
    </section>
  )
}
