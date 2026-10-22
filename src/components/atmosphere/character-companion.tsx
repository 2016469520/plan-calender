'use client'

// ============================================================
// 角色陪伴
//
// - 内置角色（樱色小葵 / 霓虹 NOVA / 像素 PIX）为原创 SVG，自带多表情
// - 也可以挂自定义图片（用户导入的 PNG/GIF），此时只有一张图，不切表情
// - 表情由真实事件驱动；纯净模式、关闭角色、关闭自动状态都会让它退场
// - 位置/尺寸/不透明度/待机动画都由设置控制
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppearance } from '@/providers/appearance-provider'
import { EXPRESSION_LABELS, linesFor, type CharacterExpression } from '@/lib/theme/atmosphere'
import { packLinesFor } from '@/lib/atmosphere/pack-dialogue'
import { resolveAtmosphere } from '@/lib/theme/scene-resolve'
import { atmosphereEvents, subscribeAtmosphere } from '@/lib/atmosphere/bus'
import { getAssetUrl, useCustomAssets } from '@/lib/atmosphere/custom-assets'
import { stateUrl, useCharacterPacks } from '@/lib/atmosphere/character-packs'
import { renderCharacter } from './art/registry'
import { useCurrentCharacter } from './use-current-scene'
import { cn } from '@/lib/utils'

const MOOD_HOLD_MS = 4200

function pickLine(characterId: string, expression: CharacterExpression): string | null {
  const pool = linesFor(characterId, expression)
  const list = pool.length ? pool : linesFor(characterId, 'idle')
  if (!list.length) return null
  return list[Math.floor(Math.random() * list.length)]
}

const POSITION_CLASS: Record<string, string> = {
  'bottom-left': 'atmo-pos-bottom-left',
  'bottom-right': 'atmo-pos-bottom-right',
  hero: 'atmo-pos-hero',
  sidebar: 'atmo-pos-sidebar',
}

export function CharacterCompanion() {
  const character = useCurrentCharacter()
  const { state } = useAppearance()
  return <Companion key={`${character?.id ?? 'none'}:${state.atmosphere.customCharacterId ?? ''}`} />
}

function Companion() {
  const { state } = useAppearance()
  const atmo = useMemo(() => resolveAtmosphere(state.atmosphere), [state.atmosphere])
  // 位置选「主视觉」时角色由首页 Hero 卡承担，dock 退场，避免同一角色出现两次
  const showDock = atmo.characterPosition !== 'hero'
  const character = useCurrentCharacter()
  const assets = useCustomAssets()
  const packs = useCharacterPacks()
  const activePack = useMemo(
    () => (character?.packId ? packs.find((p) => p.id === character.packId) ?? null : null),
    [character, packs]
  )
  const pickCharacterLine = useCallback((expression: CharacterExpression) => {
    const pool = packLinesFor(activePack?.manifest.dialogue, expression)
    return pool.length
      ? pool[Math.floor(Math.random() * pool.length)]
      : character ? pickLine(character.id, expression) : null
  }, [activePack, character])

  const [mood, setMood] = useState<CharacterExpression>('idle')
  const [line, setLine] = useState<string | null>(null)
  const [reacting, setReacting] = useState(false)
  const [loadedImage, setLoadedImage] = useState<{ id: string; url: string } | null>(null)
  const clickTimes = useRef<number[]>([])
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const customAsset = assets.find((a) => a.id === atmo.customCharacterId && a.kind === 'character')
  // 同一次导入的多张表情共享 groupId：按当前状态挑图，找不到就退回通用图
  const customGroup = customAsset
    ? assets.filter((a) => a.kind === 'character' && a.groupId === customAsset.groupId)
    : []
  const stateAsset =
    customGroup.find((a) => a.state === mood) ??
    customGroup.find((a) => !a.state) ??
    customAsset
  const customUrl = stateAsset && loadedImage?.id === stateAsset.id ? loadedImage.url : null

  useEffect(() => {
    if (!stateAsset) return
    let alive = true
    void getAssetUrl(stateAsset.id).then((url) => {
      if (alive && url) setLoadedImage({ id: stateAsset.id, url })
    })
    return () => {
      alive = false
    }
  }, [stateAsset])

  const showLine = useCallback((text: string | null) => {
    if (!text) return
    setLine(text)
    setReacting(true)
    if (reactionTimer.current) clearTimeout(reactionTimer.current)
    reactionTimer.current = setTimeout(() => setReacting(false), 560)
    if (lineTimer.current) clearTimeout(lineTimer.current)
    lineTimer.current = setTimeout(() => setLine(null), 5200)
  }, [])

  // 真实事件 → 表情 / 台词（关闭"自动状态"后只保留手动点击）
  useEffect(() => {
    if (!character) return
    return subscribeAtmosphere((event) => {
      if (event.type !== 'mood') return
      if (!atmo.characterAutoState) return
      setMood(event.mood)
      if (holdTimer.current) clearTimeout(holdTimer.current)
      holdTimer.current = setTimeout(
        () => setMood('idle'),
        event.mood === 'error' ? 6000 : MOOD_HOLD_MS
      )
      if (atmo.characterWelcome && (activePack || event.mood === 'happy' || event.mood === 'error')) {
        showLine(pickCharacterLine(event.mood))
      }
    })
  }, [character, activePack, atmo.characterAutoState, atmo.characterWelcome, showLine, pickCharacterLine])

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current)
      if (lineTimer.current) clearTimeout(lineTimer.current)
      if (reactionTimer.current) clearTimeout(reactionTimer.current)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!character) return
    atmosphereEvents.poke()
    // 彩蛋：1.5 秒内连点三次会撒一次彩带
    const now = Date.now()
    clickTimes.current = [...clickTimes.current.filter((t) => now - t < 1500), now]
    if (clickTimes.current.length >= 3) {
      clickTimes.current = []
      atmosphereEvents.celebrate()
    }
    // 彩蛋：连点会换到随机表情，再随机说一句
    const pool = character.expressions
    const next = pool[Math.floor(Math.random() * pool.length)]
    if (atmo.characterAutoState) {
      setMood(next)
      if (holdTimer.current) clearTimeout(holdTimer.current)
      holdTimer.current = setTimeout(() => setMood('idle'), MOOD_HOLD_MS)
    }
    showLine(pickCharacterLine(atmo.characterAutoState ? next : 'idle'))
  }, [character, atmo.characterAutoState, showLine, pickCharacterLine])

  // 本地素材包（模式 A）：按当前情绪挑状态图，没有就退回展示图
  const packUrl = useMemo(() => {
    if (!activePack) return null
    return stateUrl(activePack, atmo.characterAutoState ? mood : 'idle')
  }, [activePack, atmo.characterAutoState, mood])

  const art = useMemo(() => {
    if (packUrl || customUrl) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- 本地素材是运行时 object URL，next/image 无法优化
        <img
          key={packUrl ?? customUrl}
          src={(packUrl ?? customUrl) as string}
          alt=""
          className="atmo-character-cutout h-full w-full object-contain"
          draggable={false}
        />
      )
    }
    return character
      ? renderCharacter(character.artId, {
          expression: atmo.characterAnimate ? mood : 'idle',
          className: 'h-full w-full',
          reacting: atmo.characterAnimate && reacting,
        })
      : null
  }, [packUrl, customUrl, character, atmo.characterAnimate, mood, reacting])

  if (!showDock) return null
  if (!atmo.enabled || !atmo.characterEnabled || !art) return null
  if (!character && !customUrl) return null

  const scale = Math.min(160, Math.max(60, atmo.characterSize)) / 100

  return (
    <div
      className={cn('atmo-character', POSITION_CLASS[atmo.characterPosition] ?? POSITION_CLASS['bottom-left'])}
      data-testid="atmosphere-character"
      data-character={customAsset?.id ?? character?.id ?? 'custom'}
      data-mood={mood}
      data-animate={atmo.characterAnimate ? 'true' : 'false'}
      style={{
        opacity: Math.min(100, Math.max(30, atmo.characterOpacity)) / 100,
        ['--char-scale' as string]: String(scale),
      }}
    >
      {line && (
        <div className="atmo-bubble text-caption leading-snug" role="status">
          {line}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        className="atmo-character-figure bg-transparent p-0"
        title={`${activePack?.manifest.name ?? customAsset?.name ?? character?.name ?? '角色'}：点一下打个招呼`}
        aria-label={`${activePack?.manifest.name ?? customAsset?.name ?? character?.name ?? '角色'}，当前状态：${EXPRESSION_LABELS[mood]}`}
        data-reacting={reacting ? 'true' : 'false'}
      >
        {art}
      </button>
    </div>
  )
}
