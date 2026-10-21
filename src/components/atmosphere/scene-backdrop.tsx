'use client'

// ============================================================
// 场景背景层
//
// 固定铺满视口、pointer-events: none，位于内容之下（内容层 z-10）。
// 支持：内置 SVG 场景 / 自定义图片、可见度、模糊、压暗、色相、亮度、遮罩强度。
// 纯净模式（pure）由 resolveAtmosphere 折算成"极淡背景"，无需在这里分支。
// ============================================================

import { useEffect, useMemo, useState } from 'react'
import { useAppearance } from '@/providers/appearance-provider'
import { resolveAtmosphere } from '@/lib/theme/scene-resolve'
import { getAssetUrl } from '@/lib/atmosphere/custom-assets'
import { renderScene } from './art/registry'
import { AtmosphereParticles } from './atmosphere-particles'
import { useCurrentScene } from './use-current-scene'

export function SceneBackdrop() {
  const { state } = useAppearance()
  const atmo = useMemo(() => resolveAtmosphere(state.atmosphere), [state.atmosphere])
  const scene = useCurrentScene()
  const bgId = atmo.customBackgroundId
  const useCustom = atmo.bgSource === 'custom' && !!bgId
  // 记住是哪个 id 解出的 url，切换素材时不会闪现上一张
  const [loadedImage, setLoadedImage] = useState<{ id: string; url: string } | null>(null)
  const customUrl = useCustom && loadedImage?.id === bgId ? loadedImage.url : null

  useEffect(() => {
    if (!useCustom || !bgId) return
    let alive = true
    void getAssetUrl(bgId).then((url) => {
      if (alive && url) setLoadedImage({ id: bgId, url })
    })
    return () => {
      alive = false
    }
  }, [useCustom, bgId])

  const opacity = Math.min(100, Math.max(0, atmo.bgOpacity)) / 100
  const filters = [
    atmo.bgBlur > 0 ? `blur(${atmo.bgBlur}px)` : '',
    atmo.bgHue !== 0 ? `hue-rotate(${atmo.bgHue}deg)` : '',
    atmo.bgBrightness !== 100 ? `brightness(${atmo.bgBrightness}%)` : '',
  ]
    .filter(Boolean)
    .join(' ')

  const art = useCustom
    ? customUrl
      ? // eslint-disable-next-line @next/next/no-img-element -- 用户素材是运行时 object URL，Next/Image 无法优化
        <img src={customUrl} alt="" className="h-full w-full object-cover" />
      : null
    : scene
      ? renderScene(scene.id, 'h-full w-full')
      : null

  if (!atmo.enabled || !art) return null

  return (
    <div className="atmo-backdrop" aria-hidden="true" data-testid="atmosphere-backdrop">
      <div className="atmo-art" style={{ opacity, filter: filters || undefined }}>
        {art}
      </div>
      {/* 压暗层：在遮罩之下，只影响画面亮度不影响卡片 */}
      {atmo.bgDarken > 0 && (
        <div
          className="atmo-darken"
          style={{ backgroundColor: `rgba(0,0,0,${atmo.bgDarken / 100})` }}
        />
      )}
      <div
        className="atmo-scrim"
        style={{ ['--mask-strength' as string]: String(atmo.bgMask / 100) }}
      />
      {atmo.animations && <AtmosphereParticles themeId={state.themeId} />}
    </div>
  )
}
