'use client'

// ============================================================
// 场景背景层
//
// 固定铺满视口、pointer-events: none，位于内容之下（内容层 z-10）。
// 遮罩强度由主题明暗与场景明暗共同决定，保证正文对比度。
// ============================================================

import { useMemo } from 'react'
import { useAppearance } from '@/providers/appearance-provider'
import { renderScene } from './art/registry'
import { AtmosphereParticles } from './atmosphere-particles'
import { useCurrentScene } from './use-current-scene'

export function SceneBackdrop() {
  const { state } = useAppearance()
  const scene = useCurrentScene()

  const style = useMemo(() => {
    const atmo = state.atmosphere
    const opacity = Math.min(100, Math.max(0, atmo.bgOpacity)) / 100
    return {
      opacity,
      filter: atmo.bgBlur > 0 ? `blur(${atmo.bgBlur}px)` : undefined,
    }
  }, [state.atmosphere])

  if (!state.atmosphere.enabled || !scene) return null
  const art = renderScene(scene.id, 'h-full w-full')

  return (
    <div className="atmo-backdrop" aria-hidden="true" data-testid="atmosphere-backdrop">
      <div className="atmo-art" style={style}>
        {art}
      </div>
      <div className="atmo-scrim" />
      {state.atmosphere.animations && <AtmosphereParticles themeId={state.themeId} />}
    </div>
  )
}
