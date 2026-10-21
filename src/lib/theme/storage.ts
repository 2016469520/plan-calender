// ============================================================
// 外观设置的持久化：读取、校验、迁移、导入导出
//
// 原则：任何一步校验失败都回退到安全默认值，绝不把坏配置应用到界面。
// 存储用 localStorage：Web / Electron(app://) / Android(Capacitor) 都可用。
// ============================================================

import type {
  AppearanceState,
  MotionLevel,
  ThemeId,
  ThemePersonalization,
  UserPreset,
} from './types'
import {
  DEFAULT_RADIUS,
  DEFAULT_THEME_ID,
  MOTION_OPTIONS,
  SCALE_OPTIONS,
  THEMES,
  THEME_IDS,
  getTheme,
} from './themes'

export const STORAGE_KEY = 'timegrid:appearance:v1'
export const APPEARANCE_VERSION = 1

const MOTION_VALUES = MOTION_OPTIONS.map((m) => m.value)
const FONT_VALUES = ['theme', 'system', 'rounded', 'mono', 'serif']

export function defaultPersonalization(id: ThemeId): ThemePersonalization {
  return { ...getTheme(id).defaults, radius: { ...getTheme(id).defaults.radius } }
}

export function defaultState(): AppearanceState {
  return {
    version: APPEARANCE_VERSION,
    themeId: DEFAULT_THEME_ID,
    mode: getTheme(DEFAULT_THEME_ID).defaultMode,
    followSystem: false,
    perTheme: {},
    presets: [],
  }
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function validThemeId(value: unknown): ThemeId | null {
  return typeof value === 'string' && THEME_IDS.includes(value as ThemeId)
    ? (value as ThemeId)
    : null
}

/** 校验单份个性化参数；任何非法字段都退回主题默认 */
export function sanitizePersonalization(
  id: ThemeId,
  raw: unknown
): ThemePersonalization {
  const base = defaultPersonalization(id)
  if (!raw || typeof raw !== 'object') return base
  const input = raw as Record<string, unknown>

  const radiusInput = (input.radius ?? {}) as Record<string, unknown>
  const radius = {
    button: clamp(radiusInput.button, 0, 32, base.radius.button),
    card: clamp(radiusInput.card, 0, 32, base.radius.card),
    input: clamp(radiusInput.input, 0, 32, base.radius.input),
    dialog: clamp(radiusInput.dialog, 0, 32, base.radius.dialog),
  }

  const scaleInput = typeof input.scale === 'number' ? input.scale : Number(input.scale)
  const scale = (SCALE_OPTIONS as readonly number[]).includes(scaleInput) ? scaleInput : base.scale

  const accent =
    typeof input.accent === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(input.accent.trim())
      ? input.accent.trim()
      : null

  return {
    accent,
    radius,
    scale,
    fontId: FONT_VALUES.includes(String(input.fontId))
      ? (input.fontId as ThemePersonalization['fontId'])
      : base.fontId,
    typeScale: clamp(input.typeScale, 0.85, 1.2, base.typeScale),
    titleScale: clamp(input.titleScale, 0.85, 1.25, base.titleScale),
    motion: MOTION_VALUES.includes(input.motion as MotionLevel)
      ? (input.motion as MotionLevel)
      : base.motion,
  }
}

function sanitizePresets(raw: unknown): UserPreset[] {
  if (!Array.isArray(raw)) return []
  const out: UserPreset[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const rec = item as Record<string, unknown>
    const baseThemeId = validThemeId(rec.baseThemeId)
    if (!baseThemeId) continue
    if (typeof rec.name !== 'string' || !rec.name.trim()) continue
    out.push({
      id: typeof rec.id === 'string' && rec.id ? rec.id : `preset-${Date.now()}-${out.length}`,
      name: rec.name.trim().slice(0, 40),
      baseThemeId,
      personalization: sanitizePersonalization(baseThemeId, rec.personalization),
      createdAt: typeof rec.createdAt === 'string' ? rec.createdAt : new Date().toISOString(),
    })
    if (out.length >= 30) break
  }
  return out
}

/** 校验整体状态（也用于导入 JSON） */
export function sanitizeState(raw: unknown): AppearanceState {
  const fallback = defaultState()
  if (!raw || typeof raw !== 'object') return fallback
  const input = raw as Record<string, unknown>

  const themeId = validThemeId(input.themeId) ?? fallback.themeId
  const theme = getTheme(themeId)

  const perThemeInput = (input.perTheme ?? {}) as Record<string, unknown>
  const perTheme: Partial<Record<ThemeId, ThemePersonalization>> = {}
  for (const id of THEME_IDS) {
    if (perThemeInput[id] !== undefined) {
      perTheme[id] = sanitizePersonalization(id, perThemeInput[id])
    }
  }

  const desiredMode = input.mode === 'dark' ? 'dark' : input.mode === 'light' ? 'light' : null

  return {
    version: APPEARANCE_VERSION,
    themeId,
    mode: theme.modes.length === 1 ? theme.modes[0] : (desiredMode ?? theme.defaultMode),
    followSystem: input.followSystem === true,
    perTheme,
    presets: sanitizePresets(input.presets),
  }
}

export function loadState(): AppearanceState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return sanitizeState(JSON.parse(raw))
  } catch {
    // 坏 JSON 直接重置，避免每次启动都抛错
    return defaultState()
  }
}

export function saveState(state: AppearanceState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 存储被禁用（隐私模式/配额满）时静默跳过，界面仍然可用
  }
}

/** 导出为可读 JSON */
export function exportState(state: AppearanceState): string {
  const payload = {
    app: 'timegrid',
    kind: 'appearance',
    version: APPEARANCE_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  }
  return JSON.stringify(payload, null, 2)
}

export type ImportResult =
  | { ok: true; state: AppearanceState }
  | { ok: false; error: string }

/** 导入：严格校验结构 + 数值范围 */
export function importState(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: '不是合法的 JSON 文件' }
  }
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: '文件内容为空或格式不对' }
  }
  const rec = parsed as Record<string, unknown>
  const state = rec.state && typeof rec.state === 'object' ? rec.state : rec
  if (typeof (state as Record<string, unknown>).themeId !== 'string') {
    return { ok: false, error: '缺少主题字段，可能不是外观配置文件' }
  }
  if (!validThemeId((state as Record<string, unknown>).themeId)) {
    return { ok: false, error: '主题标识无法识别' }
  }
  return { ok: true, state: sanitizeState(state) }
}

/** 取某主题的有效个性化（没有就用主题默认） */
export function personalizationFor(
  state: AppearanceState,
  id: ThemeId
): ThemePersonalization {
  return state.perTheme[id] ?? defaultPersonalization(id)
}

export { DEFAULT_RADIUS, THEMES }
