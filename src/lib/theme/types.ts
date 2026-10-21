// ============================================================
// 主题系统的类型契约
//
// 分工：
// - CSS（src/styles/theme-*.css）保存每套主题的调色板与结构规则
// - 本模块只保存元数据（名称、描述、预览色、默认个性化）
// 这样调色板只有一份，不会出现 TS 与 CSS 两处漂移。
// ============================================================

export type ThemeMode = 'light' | 'dark'

export type ThemeId = 'fluent' | 'anime' | 'cyber' | 'minimal' | 'pixel' | 'bento'

export type MotionLevel = 'off' | 'low' | 'standard' | 'high'

export type FontId = 'theme' | 'system' | 'rounded' | 'mono' | 'serif'

/** 可调的四类圆角（px） */
export interface RadiusSettings {
  button: number
  card: number
  input: number
  dialog: number
}

/** 单套主题下的个性化覆盖（每套主题各存一份，互不污染） */
export interface ThemePersonalization {
  /** 自定义强调色；空表示用主题自带强调色 */
  accent: string | null
  radius: RadiusSettings
  /** 界面缩放 0.8 / 0.9 / 1 / 1.1 / 1.25 / 1.5 */
  scale: number
  fontId: FontId
  /** 正文基准字号倍率 */
  typeScale: number
  /** 标题倍率 */
  titleScale: number
  motion: MotionLevel
}

export interface ThemePreview {
  background: string
  surface: string
  text: string
  accent: string
  accentSoft: string
}

export interface ThemeDefinition {
  id: ThemeId
  /** 中文名 */
  name: string
  /** 英文名，用于强调 */
  latinName: string
  /** 一句话定位 */
  tagline: string
  /** 详细描述（设置页展示） */
  description: string
  /** 设计关键词 */
  keywords: string[]
  /** 支持的明暗模式；只有一个表示该主题会强制该模式 */
  modes: ThemeMode[]
  defaultMode: ThemeMode
  /** 预览卡配色（与 CSS 调色板保持一致，仅用于小尺寸预览） */
  preview: Record<ThemeMode, ThemePreview>
  /** 该主题的默认个性化参数 */
  defaults: ThemePersonalization
  /** 是否为新用户默认推荐 */
  recommended?: boolean
}

/** 用户保存的自定义预设 */
export interface UserPreset {
  id: string
  name: string
  baseThemeId: ThemeId
  personalization: ThemePersonalization
  createdAt: string
}

/** 持久化的整体外观状态 */
export interface AppearanceState {
  version: number
  themeId: ThemeId
  mode: ThemeMode
  /** 明暗跟随系统（仅对支持双模式的主题生效） */
  followSystem: boolean
  /** 每套主题各自的个性化覆盖 */
  perTheme: Partial<Record<ThemeId, ThemePersonalization>>
  presets: UserPreset[]
}
