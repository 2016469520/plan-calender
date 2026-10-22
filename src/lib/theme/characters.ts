// ============================================================
// 角色库：作品 / 分类 / 推荐配色
//
// 重要说明（也写进 docs/ATMOSPHERE_ASSETS.md）：
// 内置立绘全部是**本项目原创的同人风 SVG 推演**，不是官方素材，
// 仅用于本地体验与风格测试。角色名与作品名仅作指代；
// 用户可以用「导入角色图」换成自己拥有的立绘。
//
// `artId` 为 null 表示"有推荐位但没有内置立绘"，只会出现在
// 「待导入」列表里，不会被当成已安装角色。
// ============================================================

import type { CharacterExpression } from './atmosphere'
import type { ThemeId } from './types'

export type CharacterCategory = 'yiren' | 'classic' | 'childhood' | 'japan' | 'game' | 'original' | 'custom'

export const CATEGORY_LABELS: Record<CharacterCategory, string> = {
  yiren: '一人之下',
  classic: '国产经典动画',
  childhood: '00 后童年回忆',
  japan: '日本动漫',
  game: '游戏角色',
  original: '时格原创',
  custom: '用户自定义',
}

export interface CharacterRecommendation {
  themeId: ThemeId
  sceneId: string
  /** 推荐的强调色（hex） */
  accent: string
}

export interface CharacterEntry {
  id: string
  name: string
  /** 来源作品；原创角色填「时格」 */
  work: string
  categories: CharacterCategory[]
  tags: string[]
  /** 内置美术的 key；null = 尚未内置立绘 */
  artId: string | null
  /** 素材形态：多表情 / 单立绘 / 仅头像 / 仅默认图 */
  form: 'full' | 'single' | 'avatar' | 'default'
  recommend: CharacterRecommendation
}

/** 全部角色（含尚未内置立绘的推荐位） */
export const CHARACTER_LIBRARY: CharacterEntry[] = [
  // ---------- 一人之下 ----------
  {
    id: 'feng-baobao',
    name: '冯宝宝',
    work: '一人之下',
    categories: ['yiren'],
    tags: ['黑长直', '菜刀', '呆萌', '国漫'],
    artId: 'feng-baobao',
    form: 'full',
    recommend: { themeId: 'minimal', sceneId: 'bento-ocean', accent: '#3f7a6a' },
  },
  {
    id: 'zhang-chulan',
    name: '张楚岚',
    work: '一人之下',
    categories: ['yiren'],
    tags: ['少年', '白衬衫', '炁体源流'],
    artId: 'zhang-chulan',
    form: 'full',
    recommend: { themeId: 'fluent', sceneId: 'bento-mesh', accent: '#1f6feb' },
  },
  {
    id: 'wang-ye',
    name: '王也',
    work: '一人之下',
    categories: ['yiren'],
    tags: ['道系', '八奇技', '慵懒'],
    artId: 'wang-ye',
    form: 'full',
    recommend: { themeId: 'minimal', sceneId: 'minimal-ridge', accent: '#8a6d3b' },
  },
  {
    id: 'zhuge-qing',
    name: '诸葛青',
    work: '一人之下',
    categories: ['yiren'],
    tags: ['术士', '扇子', '贵公子'],
    artId: 'zhuge-qing',
    form: 'full',
    recommend: { themeId: 'minimal', sceneId: 'minimal-lake', accent: '#7c6bb0' },
  },

  // ---------- 00 后童年经典 ----------
  {
    id: 'hongmao',
    name: '虹猫',
    work: '虹猫蓝兔七侠传',
    categories: ['classic', 'childhood'],
    tags: ['猫耳', '长虹剑', '侠客'],
    artId: 'hongmao',
    form: 'full',
    recommend: { themeId: 'pixel', sceneId: 'pixel-forest', accent: '#f97316' },
  },
  {
    id: 'lantu',
    name: '蓝兔',
    work: '虹猫蓝兔七侠传',
    categories: ['classic', 'childhood'],
    tags: ['冰魄剑', '兔耳', '侠女'],
    artId: 'lantu',
    form: 'full',
    recommend: { themeId: 'pixel', sceneId: 'pixel-forest', accent: '#60a5fa' },
  },
  {
    id: 'kaixin-chaoren',
    name: '开心超人',
    work: '开心宝贝',
    categories: ['classic', 'childhood'],
    tags: ['机甲', '红头盔', '星标'],
    artId: 'kaixin-chaoren',
    form: 'full',
    recommend: { themeId: 'cyber', sceneId: 'cyber-neon-rain', accent: '#ef4444' },
  },
  {
    id: 'xiyangyang',
    name: '喜羊羊',
    work: '喜羊羊与灰太狼',
    categories: ['classic', 'childhood'],
    tags: ['羊', '铃铛', '机灵'],
    artId: 'xiyangyang',
    form: 'full',
    recommend: { themeId: 'anime', sceneId: 'anime-sakura-street', accent: '#3b82f6' },
  },
  {
    id: 'huitailang',
    name: '灰太狼',
    work: '喜羊羊与灰太狼',
    categories: ['classic', 'childhood'],
    tags: ['狼', '补丁帽', '怕老婆'],
    artId: 'huitailang',
    form: 'full',
    recommend: { themeId: 'pixel', sceneId: 'pixel-town', accent: '#f59e0b' },
  },
  {
    id: 'cheng-liuxiang',
    name: '橙留香',
    work: '果宝特攻',
    categories: ['classic', 'childhood'],
    tags: ['橙子', '武侠', '剑'],
    artId: 'cheng-liuxiang',
    form: 'full',
    recommend: { themeId: 'pixel', sceneId: 'pixel-town', accent: '#fb923c' },
  },
  {
    id: 'boluo-chuixue',
    name: '菠萝吹雪',
    work: '果宝特攻',
    categories: ['classic', 'childhood'],
    tags: ['菠萝', '剑客', '黄绿'],
    artId: 'boluo-chuixue',
    form: 'full',
    recommend: { themeId: 'pixel', sceneId: 'pixel-town', accent: '#84cc16' },
  },
  {
    id: 'huolinfei',
    name: '火麟飞',
    work: '超兽武装',
    categories: ['classic', 'childhood'],
    tags: ['机甲', '火焰', '红橙'],
    artId: 'huolinfei',
    form: 'full',
    recommend: { themeId: 'cyber', sceneId: 'cyber-deep-space', accent: '#f97316' },
  },
  {
    id: 'leiyi',
    name: '雷伊',
    work: '赛尔号',
    categories: ['classic', 'childhood', 'game'],
    tags: ['机甲', '电流', '蓝紫'],
    artId: 'leiyi',
    form: 'full',
    recommend: { themeId: 'cyber', sceneId: 'cyber-orbit-station', accent: '#6366f1' },
  },
  {
    id: 'luoluo',
    name: '洛洛',
    work: '洛洛历险记',
    categories: ['classic', 'childhood'],
    tags: ['飞行员', '护目镜', '少年'],
    artId: 'luoluo',
    form: 'full',
    recommend: { themeId: 'pixel', sceneId: 'pixel-sky', accent: '#ef4444' },
  },
  {
    id: 'nangong-wentian',
    name: '南宫问天',
    work: '神兵小将',
    categories: ['classic', 'childhood'],
    tags: ['国风', '长枪', '少年侠'],
    artId: 'nangong-wentian',
    form: 'full',
    recommend: { themeId: 'minimal', sceneId: 'minimal-skyline', accent: '#0ea5e9' },
  },
  {
    id: 'maidang',
    name: '麦当',
    work: '星游记',
    categories: ['classic', 'childhood'],
    tags: ['头巾', '星星', '热血'],
    artId: 'maidang',
    form: 'full',
    recommend: { themeId: 'anime', sceneId: 'anime-star-night', accent: '#fb923c' },
  },

  // ---------- 时格原创 ----------
  {
    id: 'anime-aoi',
    name: '小葵',
    work: '时格',
    categories: ['original'],
    tags: ['看板娘', '樱花', '原创'],
    artId: 'anime-aoi',
    form: 'full',
    recommend: { themeId: 'anime', sceneId: 'anime-sakura-street', accent: '#db2777' },
  },
  {
    id: 'cyber-nova',
    name: 'NOVA',
    work: '时格',
    categories: ['original'],
    tags: ['全息', 'AI', '原创'],
    artId: 'cyber-nova',
    form: 'full',
    recommend: { themeId: 'cyber', sceneId: 'cyber-orbit-station', accent: '#22d3ee' },
  },
  {
    id: 'pixel-pix',
    name: 'PIX',
    work: '时格',
    categories: ['original'],
    tags: ['像素', '冒险者', '原创'],
    artId: 'pixel-pix',
    form: 'full',
    recommend: { themeId: 'pixel', sceneId: 'pixel-town', accent: '#d7263d' },
  },

  // ---------- 预留位（还没有内置立绘，只出现在「待导入」） ----------
  {
    id: 'hatsune-miku',
    name: '初音未来',
    work: 'VOCALOID',
    categories: ['japan'],
    tags: ['双马尾', '青绿', '音乐'],
    artId: null,
    form: 'full',
    recommend: { themeId: 'cyber', sceneId: 'cyber-deep-space', accent: '#39c5bb' },
  },
  {
    id: 'zhongli',
    name: '钟离',
    work: '原神',
    categories: ['game'],
    tags: ['岩', '长枪', '沉稳'],
    artId: null,
    form: 'full',
    recommend: { themeId: 'bento', sceneId: 'bento-mesh', accent: '#c8a45c' },
  },
  {
    id: 'raiden-shogun',
    name: '雷电将军',
    work: '原神',
    categories: ['game'],
    tags: ['雷', '太刀', '紫'],
    artId: null,
    form: 'full',
    recommend: { themeId: 'bento', sceneId: 'bento-ocean', accent: '#8b5cf6' },
  },
  {
    id: 'amiya',
    name: '阿米娅',
    work: '明日方舟',
    categories: ['game'],
    tags: ['兔耳', '罗德岛'],
    artId: null,
    form: 'full',
    recommend: { themeId: 'bento', sceneId: 'bento-grain', accent: '#4f7cff' },
  },
  {
    id: 'reimu',
    name: '博丽灵梦',
    work: '东方 Project',
    categories: ['japan', 'game'],
    tags: ['巫女', '红白'],
    artId: null,
    form: 'full',
    recommend: { themeId: 'anime', sceneId: 'anime-sunset-city', accent: '#e05263' },
  },
  {
    id: 'saber',
    name: 'Saber',
    work: 'Fate',
    categories: ['japan'],
    tags: ['骑士王', '金蓝'],
    artId: null,
    form: 'full',
    recommend: { themeId: 'minimal', sceneId: 'minimal-skyline', accent: '#c8a45c' },
  },
]

export const CHARACTER_IDS = CHARACTER_LIBRARY.map((c) => c.id)

/** 已内置立绘的角色 */
export function installedCharacters(): CharacterEntry[] {
  return CHARACTER_LIBRARY.filter((c) => c.artId !== null)
}

/** 只有推荐位、等用户导入的角色 */
export function pendingCharacters(): CharacterEntry[] {
  return CHARACTER_LIBRARY.filter((c) => c.artId === null)
}

export function getCharacterEntry(id: string | null | undefined): CharacterEntry | null {
  if (!id) return null
  return CHARACTER_LIBRARY.find((c) => c.id === id) ?? null
}

/** 关键词搜索：角色名、作品名、标签 */
export function searchCharacters(query: string): CharacterEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return CHARACTER_LIBRARY
  return CHARACTER_LIBRARY.filter((c) => {
    const haystack = [c.name, c.work, ...c.tags].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

/** 分类过滤（'all' 表示全部） */
export function filterByCategory(
  list: CharacterEntry[],
  category: CharacterCategory | 'all'
): CharacterEntry[] {
  if (category === 'all') return list
  return list.filter((c) => c.categories.includes(category))
}

/** 统计每个分类下的角色数量（只算已安装的） */
export function categoryCounts(): Record<string, number> {
  const installed = installedCharacters()
  const counts: Record<string, number> = { all: installed.length }
  for (const key of Object.keys(CATEGORY_LABELS) as CharacterCategory[]) {
    counts[key] = installed.filter((c) => c.categories.includes(key)).length
  }
  return counts
}

/** 按作品分组（用于"按作品筛选"） */
export function worksOf(list: CharacterEntry[]): string[] {
  return Array.from(new Set(list.map((c) => c.work)))
}

/** 角色支持的表情：默认 5 态，冯宝宝额外有困倦 */
export function expressionsOf(entry: CharacterEntry): CharacterExpression[] {
  if (entry.id === 'feng-baobao') {
    return ['idle', 'happy', 'thinking', 'working', 'error', 'sleepy']
  }
  return ['idle', 'happy', 'thinking', 'working', 'error']
}

/** 解析出可直接渲染的角色形象；没有内置美术时返回 null */
export function figureOf(id: string | null | undefined): {
  id: string
  name: string
  artId: string
  work: string
  expressions: CharacterExpression[]
} | null {
  const entry = getCharacterEntry(id)
  if (!entry || !entry.artId) return null
  return {
    id: entry.id,
    name: entry.name,
    artId: entry.artId,
    work: entry.work,
    expressions: expressionsOf(entry),
  }
}