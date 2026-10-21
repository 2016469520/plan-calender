// ============================================================
// 场景 / 角色的解析逻辑（纯函数，无 React 依赖，便于单测）
// ============================================================

import {
  defaultCharacterFor,
  defaultSceneFor,
  getCharacter,
  getScene,
  scenesForTheme,
  type CharacterDefinition,
  type SceneDefinition,
} from './atmosphere'
import type { AtmosphereSettings, ThemeId } from './types'

/** 本地时区的日期键，例如 2026-10-22 */
export function todayKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

/**
 * 把「沉浸 / 纯净」模式折算成实际生效的氛围参数。
 *
 * 纯净工作模式：隐藏角色、关掉动画与短句、背景压到极淡、遮罩拉满，
 * 但仍保留主题配色——切回来时状态不丢（原始设置一直存在 state 里）。
 */
export function resolveAtmosphere(atmosphere: AtmosphereSettings): AtmosphereSettings {
  if (atmosphere.mode !== 'pure') return atmosphere
  return {
    ...atmosphere,
    characterEnabled: false,
    animations: false,
    quoteEnabled: false,
    celebration: false,
    bgOpacity: Math.min(atmosphere.bgOpacity, 22),
    bgMask: Math.max(atmosphere.bgMask, 90),
    bgBlur: Math.max(atmosphere.bgBlur, 6),
  }
}

function hashOf(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 100000
  return hash
}

/**
 * 当前该显示哪个场景。
 * 优先级：用户选定 > 每日轮换 > 主题默认；关闭氛围时为 null。
 */
export function resolveScene(
  themeId: ThemeId,
  atmosphere: AtmosphereSettings,
  date: Date = new Date()
): SceneDefinition | null {
  if (!atmosphere.enabled) return null

  const list = scenesForTheme(themeId)
  if (list.length === 0) return null

  const chosen = getScene(atmosphere.sceneByTheme[themeId])
  if (chosen && chosen.themeId === themeId) return chosen

  if (atmosphere.rotateScenes) {
    return list[hashOf(todayKey(date)) % list.length]
  }

  // 彩蛋：暗格按时间段换一张——深夜用颗粒渐变，白天用网格
  if (themeId === 'bento') {
    const hour = date.getHours()
    const night = hour < 6 || hour >= 21
    const picked = list.find((s) => s.id === (night ? 'bento-grain' : 'bento-mesh'))
    if (picked) return picked
  }

  return defaultSceneFor(themeId)
}

/** 当前该显示哪个角色；主题没有角色时返回 null */
export function resolveCharacter(
  themeId: ThemeId,
  atmosphere: AtmosphereSettings
): CharacterDefinition | null {
  if (!atmosphere.enabled || !atmosphere.characterEnabled) return null
  const chosen = getCharacter(atmosphere.characterByTheme[themeId])
  if (chosen && chosen.themeId === themeId) return chosen
  return defaultCharacterFor(themeId)
}

/** 当天的那一句（同一天稳定） */
export function resolveDailyQuoteIndex(
  total: number,
  offset: number,
  date: Date = new Date()
): number {
  if (total <= 0) return 0
  return (hashOf(todayKey(date)) + offset) % total
}
