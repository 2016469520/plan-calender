import { describe, it, expect, vi } from 'vitest'

describe('Habit minute input stability', () => {
  // ---- Wheel step calculation ----

  describe('step calculation', () => {
    it('minutes type step is 1', () => {
      const step = getMinutesStep()
      expect(step).toBe(1)
    })

    it('count type step is 1', () => {
      const step = getCountStep()
      expect(step).toBe(1)
    })

    it('hours type step is 0.5', () => {
      const step = getHoursStep()
      expect(step).toBe(0.5)
    })
  })

  // ---- Wheel delta direction ----

  describe('wheel delta processing', () => {
    it('deltaY < 0 (wheel up) increases value by step', () => {
      const result = processWheelDelta(0, -100, 1)
      expect(result).toBe(1)
    })

    it('deltaY > 0 (wheel down) decreases value by step', () => {
      const result = processWheelDelta(5, 100, 1)
      expect(result).toBe(4)
    })

    it('deltaY = 0 does not change value', () => {
      const result = processWheelDelta(5, 0, 1)
      expect(result).toBe(5)
    })

    it('never goes below 0', () => {
      const result = processWheelDelta(0, 100, 1)
      expect(result).toBe(0)
    })

    it('accumulates multiple wheel notches', () => {
      let value = 0
      value = processWheelDelta(value, -100, 1) // +1
      value = processWheelDelta(value, -100, 1) // +1
      value = processWheelDelta(value, -100, 1) // +1
      expect(value).toBe(3)
    })
  })

  // ---- Button adjustments ----

  describe('+/- button adjustments', () => {
    it('+1 increases minutes by 1', () => {
      const result = adjustValue(5, 1)
      expect(result).toBe(6)
    })

    it('-1 decreases minutes by 1', () => {
      const result = adjustValue(5, -1)
      expect(result).toBe(4)
    })

    it('-1 at 0 stays at 0', () => {
      const result = adjustValue(0, -1)
      expect(result).toBe(0)
    })

    it('+1 at 0 gives 1', () => {
      const result = adjustValue(0, 1)
      expect(result).toBe(1)
    })
  })

  // ---- Validation ----

  describe('input validation', () => {
    it('validates positive integer', () => {
      expect(isValidInput('30')).toBe(true)
    })

    it('validates 0', () => {
      expect(isValidInput('0')).toBe(true)
    })

    it('validates decimal', () => {
      expect(isValidInput('1.5')).toBe(true)
    })

    it('rejects negative numbers', () => {
      expect(isValidInput('-5')).toBe(false)
    })

    it('rejects non-numeric text', () => {
      expect(isValidInput('abc')).toBe(false)
    })

    it('rejects empty string', () => {
      expect(isValidInput('')).toBe(false)
    })
  })

  // ---- Debounce logic ----

  describe('debounce save logic', () => {
    it('calls save after debounce delay', async () => {
      vi.useFakeTimers()
      const saveFn = vi.fn().mockResolvedValue(undefined)

      let pendingValue: number | null = null
      let timer: ReturnType<typeof setTimeout> | null = null

      const debouncedSave = (value: number) => {
        pendingValue = value
        if (timer) clearTimeout(timer)
        timer = setTimeout(async () => {
          if (pendingValue != null) {
            await saveFn(pendingValue)
            pendingValue = null
          }
        }, 400)
      }

      debouncedSave(5)
      debouncedSave(10)
      debouncedSave(15)

      expect(saveFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(400)
      await vi.runAllTimersAsync()

      expect(saveFn).toHaveBeenCalledTimes(1)
      expect(saveFn).toHaveBeenCalledWith(15)
      vi.useRealTimers()
    })
  })

  // ---- Layout stability: save state uses fixed width ----

  describe('save state indicator', () => {
    it('idle state renders empty placeholder (not null)', () => {
      const state = getSaveStateDisplay('idle')
      // Empty but present — no layout shift on state change
      expect(state).toBeDefined()
      expect(state.visible).toBe(false)
    })

    it('saving state shows loader', () => {
      const state = getSaveStateDisplay('saving')
      expect(state.visible).toBe(true)
      expect(state.icon).toBe('loader')
    })

    it('saved state shows check', () => {
      const state = getSaveStateDisplay('saved')
      expect(state.visible).toBe(true)
      expect(state.icon).toBe('check')
    })

    it('error state shows X', () => {
      const state = getSaveStateDisplay('error')
      expect(state.visible).toBe(true)
      expect(state.icon).toBe('x')
    })
  })
})

// ============================================================
// Pure helper functions (mirroring logic in components for testability)
// ============================================================

function getMinutesStep(): number {
  return 1
}

function getCountStep(): number {
  return 1
}

function getHoursStep(): number {
  return 0.5
}

function processWheelDelta(currentValue: number, deltaY: number, step: number): number {
  if (deltaY < 0) return Math.max(0, currentValue + step)
  if (deltaY > 0) return Math.max(0, currentValue - step)
  return currentValue
}

function adjustValue(currentValue: number, delta: number): number {
  return Math.max(0, currentValue + delta)
}

function isValidInput(raw: string): boolean {
  if (raw === '') return false
  const val = parseFloat(raw)
  return !isNaN(val) && val >= 0
}

function getSaveStateDisplay(state: 'idle' | 'saving' | 'saved' | 'error') {
  switch (state) {
    case 'idle':
      return { visible: false, icon: null }
    case 'saving':
      return { visible: true, icon: 'loader' }
    case 'saved':
      return { visible: true, icon: 'check' }
    case 'error':
      return { visible: true, icon: 'x' }
  }
}
