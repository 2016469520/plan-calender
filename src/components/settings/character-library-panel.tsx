'use client'

// ============================================================
// 角色库
//
// 分类 + 搜索 + 收藏 + 最近使用 + 推荐联动。
// 只显示"能真正渲染出来"的角色：没有内置立绘的进「待导入」，
// 不会被当成已安装。
// ============================================================

import { useMemo, useRef, useState } from 'react'
import {
  Check,
  Heart,
  Search,
  Sparkles,
  Star,
  Upload,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAppearance } from '@/providers/appearance-provider'
import {
  CATEGORY_LABELS,
  categoryCounts,
  filterByCategory,
  getCharacterEntry,
  installedCharacters,
  pendingCharacters,
  searchCharacters,
  worksOf,
  type CharacterCategory,
} from '@/lib/theme/characters'
import { getTheme } from '@/lib/theme/themes'
import { getScene } from '@/lib/theme/atmosphere'
import { renderCharacter } from '@/components/atmosphere/art/registry'
import { addAsset } from '@/lib/atmosphere/custom-assets'

const CATEGORY_ORDER: (CharacterCategory | 'all')[] = [
  'all',
  'yiren',
  'classic',
  'childhood',
  'japan',
  'game',
  'original',
]

export function CharacterLibraryPanel() {
  const {
    state,
    patchAtmosphere,
    setThemeId,
    applySeed,
    selectCharacter,
    toggleFavoriteCharacter,
  } = useAppearance()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CharacterCategory | 'all'>('all')
  const [work, setWork] = useState<string>('all')
  const [note, setNote] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const counts = useMemo(() => categoryCounts(), [])
  const installed = useMemo(() => installedCharacters(), [])
  const pending = useMemo(() => pendingCharacters(), [])
  const favorites = state.characterLibrary.favorites
  const recent = state.characterLibrary.recent
  const selectedId = state.atmosphere.characterId

  const list = useMemo(() => {
    let out = searchCharacters(query)
    out = filterByCategory(out, category)
    if (work !== 'all') out = out.filter((c) => c.work === work)
    return out.filter((c) => c.artId !== null)
  }, [query, category, work])

  const works = useMemo(() => worksOf(installed), [installed])
  const favoritesList = useMemo(
    () => favorites.map((id) => getCharacterEntry(id)).filter((c): c is NonNullable<typeof c> => !!c),
    [favorites]
  )
  const recentList = useMemo(
    () =>
      recent
        .map((id) => getCharacterEntry(id))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .slice(0, 6),
    [recent]
  )

  const selected = useMemo(() => getCharacterEntry(selectedId), [selectedId])

  const applyRecommendation = () => {
    if (!selected) return
    const { themeId, sceneId, accent } = selected.recommend
    setThemeId(themeId)
    patchAtmosphere({
      enabled: true,
      mode: 'immersive',
      sceneByTheme: { ...state.atmosphere.sceneByTheme, [themeId]: sceneId },
      bgSource: 'scene',
    })
    applySeed(accent, 'accent')
    setNote(`已应用「${selected.name}」的推荐：${getTheme(themeId).name} · ${getScene(sceneId)?.name ?? sceneId} · ${accent}`)
  }

  const importFor = async (id: string) => {
    const input = fileInput.current
    if (!input) return
    const entry = getCharacterEntry(id)
    // 只接受一次选择，选完立刻导入并绑定到这个角色
    const handler = async () => {
      const files = input.files
      if (!files || files.length === 0) return
      const first = files[0]
      const result = await addAsset(first, {
        kind: 'character',
        name: entry ? `${entry.name}（导入）` : '自定义角色',
      })
      if (!result.ok) {
        setNote(result.error)
      } else {
        patchAtmosphere({
          customCharacterId: result.asset.id,
          characterEnabled: true,
          mode: 'immersive',
        })
        setNote(`已导入 ${first.name}，可在「沉浸氛围 → 我的角色图」里管理`)
      }
      input.value = ''
      input.removeEventListener('change', handler)
    }
    input.addEventListener('change', handler)
    input.click()
  }

  return (
    <section className="surface p-4" data-testid="character-library">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UserRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-section text-foreground">角色库</h2>
            <p className="mt-0.5 text-caption text-muted-foreground">
              已内置 {installed.length} 个角色 · 另有 {pending.length} 个推荐位等你导入立绘
            </p>
          </div>
        </div>
        <input ref={fileInput} type="file" accept="image/*" className="hidden" />
      </div>

      {/* 搜索 + 作品 */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <div className="relative min-w-40 flex-1">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜角色名 / 作品名 / 标签…"
            className="h-8 pl-7"
            aria-label="搜索角色"
            data-testid="character-search"
          />
        </div>
        <select
          value={work}
          onChange={(e) => setWork(e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2 text-caption"
          aria-label="按作品筛选"
        >
          <option value="all">全部作品</option>
          {works.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      {/* 分类 */}
      <div className="mt-2 flex flex-wrap gap-1">
        {CATEGORY_ORDER.map((key) => {
          const label = key === 'all' ? '全部角色' : CATEGORY_LABELS[key as CharacterCategory]
          const count = counts[key] ?? 0
          return (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
              disabled={count === 0 && key !== 'all'}
              className={cn(
                'flex h-7 items-center gap-1 rounded-full px-2.5 text-caption ui-transition',
                category === key
                  ? 'bg-primary/12 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                count === 0 && key !== 'all' && 'opacity-40'
              )}
            >
              {label}
              <span className="text-[10px] tabular-nums opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {/* 收藏 / 最近 */}
      {(favoritesList.length > 0 || recentList.length > 0) && (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-micro text-muted-foreground">
          {favoritesList.length > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" aria-hidden="true" />
              收藏
              {favoritesList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCharacter(c.id)}
                  className={cn(
                    'rounded-full px-1.5 py-0.5 ui-transition hover:bg-accent',
                    selectedId === c.id && 'bg-primary/12 text-primary'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </span>
          )}
          {recentList.length > 0 && (
            <span className="flex items-center gap-1">
              最近
              {recentList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCharacter(c.id)}
                  className={cn(
                    'rounded-full px-1.5 py-0.5 ui-transition hover:bg-accent',
                    selectedId === c.id && 'bg-primary/12 text-primary'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </span>
          )}
        </div>
      )}

      {/* 角色网格 */}
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((entry) => {
          const active = selectedId === entry.id
          const fav = favorites.includes(entry.id)
          return (
            <div
              key={entry.id}
              className={cn(
                'atmo-thumb relative border ui-transition',
                active ? 'border-primary/60 bg-primary/[0.06]' : 'border-border hover:bg-accent/50'
              )}
            >
              <button
                type="button"
                onClick={() => selectCharacter(entry.id)}
                aria-pressed={active}
                data-testid={`character-card-${entry.id}`}
                className="block w-full p-2 text-left"
                title={`${entry.name} · ${entry.work}`}
              >
                <span className="atmo-thumb flex h-24 w-full items-center justify-center bg-surface-2">
                  {renderCharacter(entry.artId, {
                    expression: 'idle',
                    className: 'h-full w-full',
                  })}
                </span>
                <span className="mt-1 flex items-center gap-1">
                  <span className="truncate text-caption font-medium text-foreground">
                    {entry.name}
                  </span>
                  {active && <Check className="h-3 w-3 shrink-0 text-primary" />}
                </span>
                <span className="block truncate text-[10px] text-muted-foreground">
                  {entry.work}
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggleFavoriteCharacter(entry.id)}
                aria-label={fav ? `取消收藏 ${entry.name}` : `收藏 ${entry.name}`}
                aria-pressed={fav}
                className={cn(
                  'absolute right-1 top-1 rounded-full p-1 ui-transition',
                  fav
                    ? 'text-primary'
                    : 'text-muted-foreground/60 hover:text-foreground'
                )}
              >
                <Star className={cn('h-3.5 w-3.5', fav && 'fill-current')} />
              </button>
            </div>
          )
        })}
        {list.length === 0 && (
          <p className="col-span-full py-4 text-center text-caption text-muted-foreground">
            没有匹配的角色，换个关键词试试
          </p>
        )}
      </div>

      {/* 选中角色的推荐 */}
      {selected && (
        <div className="mt-3 rounded-md border border-border bg-surface-2/60 p-2.5">
          <p className="flex flex-wrap items-center gap-1.5 text-micro text-muted-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {'推荐搭配：'}
            <span className="text-foreground">{getTheme(selected.recommend.themeId).name}</span>
            <span>·</span>
            <span className="text-foreground">
              {getScene(selected.recommend.sceneId)?.name ?? selected.recommend.sceneId}
            </span>
            <span>·</span>
            <span
              className="inline-block h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: selected.recommend.accent }}
            />
            <span className="font-mono text-[10px]">{selected.recommend.accent}</span>
            <Button
              size="sm"
              variant="outline"
              className="ml-auto h-6 px-2 text-micro"
              onClick={applyRecommendation}
              data-testid="apply-character-recommend"
            >
              应用推荐
            </Button>
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            只在你点「应用推荐」时才改动主题与配色；已锁定的背景不会被替换
          </p>
        </div>
      )}

      {/* 待导入 */}
      {pending.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="mb-1.5 text-micro text-muted-foreground">
            待导入（{pending.length}）：这些角色只有推荐位，还没有立绘
          </p>
          <ul className="space-y-1">
            {pending.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-2 rounded-md bg-surface-2/60 px-2 py-1"
              >
                <span className="min-w-0 flex-1 truncate text-caption text-foreground">
                  {entry.name}
                  <span className="ml-1.5 text-[10px] text-muted-foreground">{entry.work}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-1.5 text-micro text-muted-foreground"
                  onClick={() => void importFor(entry.id)}
                  data-testid={`character-import-${entry.id}`}
                >
                  <Upload className="h-3 w-3" />
                  导入立绘
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {note && <p className="mt-2 text-micro text-muted-foreground">{note}</p>}

      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        内置立绘为本项目绘制的**同人风推演**（非官方素材），仅用于本地体验与风格测试；
        角色与作品名仅作指代。你可以导入自己拥有的立绘替换。
      </p>
    </section>
  )
}
