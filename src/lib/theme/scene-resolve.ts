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
