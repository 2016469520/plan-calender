'use client'

// ============================================================
// 角色陪伴 dock
//
// - 只在有角色的主题（樱色 / 霓虹 / 像素）显示
// - 表情来自真实事件：完成任务 → happy，专注中 → working，失败 → error
// - 点击角色会回一句该状态的台词（不伪造进度）
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppearance } from '@/providers/appearance-provider'
import {
  getCharacter,
  linesFor,
  type CharacterExpression,
} from '@/lib/theme/atmosphere'
import { atmosphereEvents, subscribeAtmosphere } from '@/lib/atmosphere/bus'
import { renderCharacter } from './art/registry'
import { useCurrentCharacter } from './use-current-scene'

const MOOD_HOLD_MS = 4200

function pickLine(characterId: string, expression: CharacterExpression): string | null {
  const pool = linesFor(characterId, expression)
  const list = pool.length ? pool : linesFor(characterId, 'idle')
  if (!list.length) return null
  return list[Math.floor(Math.random() * list.length)]
}

export function CharacterCompanion() {
  const { state } = useAppearance()
  const atmosphere = state.atmosphere
  const character = useCurrentCharacter()

  const [mood, setMood] = useState<CharacterExpression>('idle')
  const [line, setLine] = useState<string | null>(null)
  const [reacting, setReacting] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showLine = useCallback((text: string | null) => {
    if (!text) return
    setLine(text)
    setReacting(true)
    window.setTimeout(() => setReacting(false), 560)
    if (lineTimer.current) clearTimeout(lineTimer.current)
    lineTimer.current = setTimeout(() => setLine(null), 5200)
  }, [])

  // 订阅真实事件：情绪与台词都在回调里更新，不在渲染期派生
  useEffect(() => {
    if (!character) return
    return subscribeAtmosphere((event) => {
      if (event.type !== 'mood') return
      setMood(event.mood)
      if (holdTimer.current) clearTimeout(holdTimer.current)
      holdTimer.current = setTimeout(
        () => setMood('idle'),
        event.mood === 'error' ? 6000 : MOOD_HOLD_MS
      )
      // 只在这两种强情绪时主动开口，避免话痨
      if (event.mood === 'happy' || event.mood === 'error') {
        showLine(pickLine(character.id, event.mood))
      }
    })
  }, [character, showLine])

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current)
      if (lineTimer.current) clearTimeout(lineTimer.current)
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!character) return
    atmosphereEvents.poke()
    showLine(pickLine(character.id, mood))
  }, [character, mood, showLine])

  const art = useMemo(
    () =>
      character
        ? renderCharacter(character.id, { expression: mood, className: 'h-full w-full', reacting })
        : null,
    [character, mood, reacting]
  )

  if (!atmosphere.enabled || !atmosphere.characterEnabled || !character || !art) return null

  return (
    <div
      className="atmo-character"
      data-testid="atmosphere-character"
      data-character={character.id}
      data-mood={mood}
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
        title={`${character.name}：点一下打个招呼`}
        aria-label={`${character.name}，当前状态：${mood}`}
        data-reacting={reacting ? 'true' : 'false'}
      >
        {art}
      </button>
    </div>
  )
}
