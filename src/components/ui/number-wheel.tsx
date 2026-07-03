'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, Minus, Plus } from 'lucide-react'

export interface NumberWheelProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled?: boolean
  size?: 'sm' | 'default'
  className?: string
  showAdjacent?: boolean
  /** If true, the wheel adjusts via +/- buttons only, no adjacent number display */
  compactButtons?: boolean
}

/**
 * NumberWheel — a wheel-style numeric input that replaces the native
 * <input type="number"> spinner. Supports mouse wheel, click on adjacent
 * values, keyboard arrows, and a direct text-entry fallback.
 */
export function NumberWheel({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  unit,
  disabled = false,
  size = 'default',
  className,
  showAdjacent = true,
  compactButtons = false,
}: NumberWheelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const clamped = (v: number) => Math.max(min, Math.min(max, v))

  const applyChange = useCallback(
    (delta: number) => {
      if (disabled) return
      onChange(clamped(value + delta))
    },
    [disabled, onChange, value, clamped]
  )

  const commitEdit = useCallback(() => {
    const parsed = parseFloat(editText)
    if (!isNaN(parsed)) {
      onChange(clamped(parsed))
    }
    setIsEditing(false)
    setEditText('')
  }, [editText, onChange, clamped])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditText('')
  }, [])

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Wheel handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (disabled || isEditing) return
      // Only handle if the wheel target is inside our container
      if (!containerRef.current?.contains(e.target as Node)) return
      e.preventDefault()
      if (e.deltaY < 0) {
        applyChange(step)
      } else if (e.deltaY > 0) {
        applyChange(-step)
      }
    },
    [disabled, isEditing, applyChange, step]
  )

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || isEditing) return
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault()
          applyChange(step)
          break
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault()
          applyChange(-step)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          setIsEditing(true)
          setEditText(String(value))
          break
      }
    },
    [disabled, isEditing, applyChange, step, value]
  )

  // Attach/detach wheel listener
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Touch drag handling
  const touchStartY = useRef<number | null>(null)
  const touchAccum = useRef(0)
  const DRAG_THRESHOLD = 20 // px per step

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isEditing) return
    touchStartY.current = e.touches[0].clientY
    touchAccum.current = 0
  }, [disabled, isEditing])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isEditing || touchStartY.current == null) return
      const deltaY = touchStartY.current - e.touches[0].clientY
      touchStartY.current = e.touches[0].clientY
      touchAccum.current += deltaY

      while (touchAccum.current >= DRAG_THRESHOLD) {
        touchAccum.current -= DRAG_THRESHOLD
        applyChange(step)
      }
      while (touchAccum.current <= -DRAG_THRESHOLD) {
        touchAccum.current += DRAG_THRESHOLD
        applyChange(-step)
      }
    },
    [disabled, isEditing, applyChange, step]
  )

  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null
    touchAccum.current = 0
  }, [])

  // Format display value
  const formatValue = (v: number) => {
    if (Number.isInteger(v)) return String(v)
    // Show at most 1 decimal place
    return v.toFixed(1)
  }

  const prevValue = clamped(value - step)
  const nextValue = clamped(value + step)
  const isSm = size === 'sm'

  // Sizes for the different numbers
  const currentSize = isSm ? 'text-lg' : 'text-xl'
  const adjacentSize = isSm ? 'text-xs' : 'text-sm'
  const currentWeight = 'font-bold'
  const adjacentWeight = 'font-normal'

  // If compact mode — just show +/- buttons around the value with no adjacent numbers
  if (compactButtons || !showAdjacent) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'inline-flex items-center gap-0.5 select-none',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        tabIndex={disabled ? undefined : 0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-label={unit ? `Value (${unit})` : 'Value'}
      >
        {/* Decrease button */}
        <button
          type="button"
          className={cn(
            'rounded-md border border-input bg-background hover:bg-muted transition-colors flex items-center justify-center',
            'focus-visible:ring-2 focus-visible:ring-ring/50 outline-none',
            'active:translate-y-px',
            isSm ? 'h-7 w-7' : 'h-8 w-8'
          )}
          onClick={() => applyChange(-step)}
          disabled={disabled || value <= min}
          aria-label={`Decrease by ${step}`}
        >
          <Minus className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        </button>

        {/* Current value (click to edit) */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            className={cn(
              'rounded-md border-2 border-ring bg-background text-center font-bold tabular-nums outline-none',
              isSm ? 'h-7 w-14 text-sm' : 'h-8 w-16'
            )}
            aria-label="Enter value"
          />
        ) : (
          <button
            type="button"
            className={cn(
              'rounded-md tabular-nums font-bold text-foreground transition-all',
              'hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50 outline-none',
              isSm ? 'h-7 min-w-[2.5rem] px-1.5 text-sm' : 'h-8 min-w-[3rem] px-2 text-base'
            )}
            onClick={() => {
              if (!disabled) {
                setIsEditing(true)
                setEditText(String(value))
              }
            }}
            aria-label={`Current value: ${value}. Click to edit.`}
          >
            {formatValue(value)}
          </button>
        )}

        {/* Unit label */}
        {unit && (
          <span className={cn(
            'tabular-nums text-muted-foreground shrink-0',
            isSm ? 'text-[10px]' : 'text-xs'
          )}>
            {unit}
          </span>
        )}

        {/* Increase button */}
        <button
          type="button"
          className={cn(
            'rounded-md border border-input bg-background hover:bg-muted transition-colors flex items-center justify-center',
            'focus-visible:ring-2 focus-visible:ring-ring/50 outline-none',
            'active:translate-y-px',
            isSm ? 'h-7 w-7' : 'h-8 w-8'
          )}
          onClick={() => applyChange(step)}
          disabled={disabled || value >= max}
          aria-label={`Increase by ${step}`}
        >
          <Plus className={isSm ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        </button>
      </div>
    )
  }

  // Full mode: vertical wheel with adjacent values
  return (
    <div
      ref={containerRef}
      className={cn(
        'inline-flex flex-col items-center select-none',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      tabIndex={disabled ? undefined : 0}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="group"
      aria-label={unit ? `Value (${unit})` : 'Value'}
    >
      {/* Prev / step-up value (clickable) */}
      <button
        type="button"
        className={cn(
          'tabular-nums rounded px-1.5 py-0 transition-all outline-none',
          'text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30',
          'focus-visible:ring-2 focus-visible:ring-ring/50',
          adjacentSize, adjacentWeight,
          isSm ? 'h-5 leading-5' : 'h-6 leading-6'
        )}
        onClick={() => applyChange(step)}
        disabled={disabled || value >= max}
        aria-label={`Increase to ${formatValue(nextValue)}`}
      >
        {formatValue(nextValue)}
      </button>

      {/* Current value (prominent) */}
      <div
        className={cn(
          'flex items-center gap-1 rounded-md transition-all',
          isFocused && 'ring-2 ring-ring/50',
          isSm ? 'px-1.5 py-0.5' : 'px-2 py-1'
        )}
      >
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit()
                if (e.key === 'Escape') cancelEdit()
              }}
              className={cn(
                'rounded border-2 border-ring bg-background text-center font-bold tabular-nums outline-none',
                currentSize,
                isSm ? 'w-12' : 'w-16'
              )}
              aria-label="Enter value"
            />
            {unit && (
              <span className={cn('tabular-nums text-muted-foreground', isSm ? 'text-[10px]' : 'text-xs')}>
                {unit}
              </span>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className={cn(
                'tabular-nums font-bold text-foreground transition-colors rounded px-1 outline-none',
                'hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50',
                currentSize, currentWeight
              )}
              onClick={() => {
                if (!disabled) {
                  setIsEditing(true)
                  setEditText(String(value))
                }
              }}
              aria-label={`Current value: ${value}. Click to edit.`}
            >
              {formatValue(value)}
            </button>
            {unit && (
              <span className={cn(
                'tabular-nums text-muted-foreground font-medium',
                isSm ? 'text-[11px]' : 'text-sm'
              )}>
                {unit}
              </span>
            )}
          </>
        )}
      </div>

      {/* Next / step-down value (clickable) */}
      <button
        type="button"
        className={cn(
          'tabular-nums rounded px-1.5 py-0 transition-all outline-none',
          'text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30',
          'focus-visible:ring-2 focus-visible:ring-ring/50',
          adjacentSize, adjacentWeight,
          isSm ? 'h-5 leading-5' : 'h-6 leading-6'
        )}
        onClick={() => applyChange(-step)}
        disabled={disabled || value <= min}
        aria-label={`Decrease to ${formatValue(prevValue)}`}
      >
        {formatValue(prevValue)}
      </button>
    </div>
  )
}
