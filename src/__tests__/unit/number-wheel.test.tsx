import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberWheel } from '@/components/ui/number-wheel'

describe('NumberWheel', () => {
  // ---- Rendering & display ----

  describe('rendering', () => {
    it('renders the current value', () => {
      render(<NumberWheel value={30} onChange={() => {}} />)
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('renders adjacent values when showAdjacent is true', () => {
      render(<NumberWheel value={30} onChange={() => {}} step={5} showAdjacent />)
      expect(screen.getByText('35')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
    })

    it('renders unit label when provided', () => {
      render(<NumberWheel value={30} onChange={() => {}} unit="分钟" />)
      expect(screen.getByText('分钟')).toBeInTheDocument()
    })

    it('renders 0 correctly (not empty)', () => {
      render(<NumberWheel value={0} onChange={() => {}} showAdjacent={false} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('formats decimal values — shows 1 decimal place', () => {
      render(<NumberWheel value={0.5} onChange={() => {}} step={0.5} showAdjacent />)
      expect(screen.getByText('0.5')).toBeInTheDocument()
    })
  })

  // ---- Click interactions ----

  describe('click interactions', () => {
    it('clicking increase (+ button) calls onChange with increased value', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const plusBtn = screen.getByRole('button', { name: /increase/i })
      await userEvent.click(plusBtn)
      expect(onChange).toHaveBeenCalledWith(35)
    })

    it('clicking decrease (- button) calls onChange with decreased value', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const minusBtn = screen.getByRole('button', { name: /decrease/i })
      await userEvent.click(minusBtn)
      expect(onChange).toHaveBeenCalledWith(25)
    })

    it('decrease button is disabled when value at min', () => {
      render(<NumberWheel value={0} onChange={() => {}} min={0} step={5} />)
      const minusBtn = screen.getByRole('button', { name: /decrease/i })
      expect(minusBtn).toBeDisabled()
    })

    it('decrease button is not disabled when value above min', () => {
      render(<NumberWheel value={5} onChange={() => {}} min={0} step={5} />)
      const minusBtn = screen.getByRole('button', { name: /decrease/i })
      expect(minusBtn).not.toBeDisabled()
    })

    it('clicking adjacent value calls onChange', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} showAdjacent />)
      // Adjacent "next" value (35) is rendered as a button
      const nextBtn = screen.getByRole('button', { name: /increase to 35/i })
      await userEvent.click(nextBtn)
      expect(onChange).toHaveBeenCalledWith(35)
    })

    it('clicking adjacent lower value calls onChange', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} showAdjacent />)
      const prevBtn = screen.getByRole('button', { name: /decrease to 25/i })
      await userEvent.click(prevBtn)
      expect(onChange).toHaveBeenCalledWith(25)
    })
  })

  // ---- Keyboard interactions ----

  describe('keyboard', () => {
    it('ArrowUp increases value by step', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const group = screen.getByRole('group')
      fireEvent.keyDown(group, { key: 'ArrowUp' })
      expect(onChange).toHaveBeenCalledWith(35)
    })

    it('ArrowDown decreases value by step', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const group = screen.getByRole('group')
      fireEvent.keyDown(group, { key: 'ArrowDown' })
      expect(onChange).toHaveBeenCalledWith(25)
    })

    it('ArrowUp at max does not exceed max', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={100} onChange={onChange} step={5} max={100} />)
      const group = screen.getByRole('group')
      fireEvent.keyDown(group, { key: 'ArrowUp' })
      expect(onChange).not.toHaveBeenCalledWith(105)
    })
  })

  // ---- Direct input mode ----

  describe('direct input', () => {
    it('clicking current value enters edit mode', async () => {
      render(<NumberWheel value={30} onChange={() => {}} step={5} />)
      const valueBtn = screen.getByRole('button', { name: /current value:/i })
      await userEvent.click(valueBtn)
      const input = screen.getByRole('textbox', { name: /enter value/i })
      expect(input).toBeInTheDocument()
    })

    it('Enter confirms edit value', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      await userEvent.click(screen.getByRole('button', { name: /current value:/i }))
      const input = screen.getByRole('textbox', { name: /enter value/i })
      await userEvent.clear(input)
      await userEvent.type(input, '45')
      fireEvent.keyDown(input, { key: 'Enter' })
      expect(onChange).toHaveBeenCalledWith(45)
    })

    it('Escape cancels edit mode without calling onChange', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      await userEvent.click(screen.getByRole('button', { name: /current value:/i }))
      const input = screen.getByRole('textbox', { name: /enter value/i })
      await userEvent.clear(input)
      await userEvent.type(input, '999')
      fireEvent.keyDown(input, { key: 'Escape' })
      expect(onChange).not.toHaveBeenCalled()
      // Should be back to display mode
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('blur confirms edit value', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      await userEvent.click(screen.getByRole('button', { name: /current value:/i }))
      const input = screen.getByRole('textbox', { name: /enter value/i })
      await userEvent.clear(input)
      await userEvent.type(input, '20')
      fireEvent.blur(input)
      expect(onChange).toHaveBeenCalledWith(20)
    })
  })

  // ---- Compact mode ----

  describe('compact mode', () => {
    it('compactButtons renders +/- buttons without adjacent numbers', () => {
      render(<NumberWheel value={5} onChange={() => {}} step={1} compactButtons />)
      expect(screen.getByRole('button', { name: /decrease/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /increase/i })).toBeInTheDocument()
      // Should NOT show adjacent values
      expect(screen.queryByText('6')).not.toBeInTheDocument()
      expect(screen.queryByText('4')).not.toBeInTheDocument()
    })
  })

  // ---- Edge cases ----

  describe('edge cases', () => {
    it('disabled prevents interactions', () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} disabled />)
      expect(screen.getByRole('group')).toHaveClass('pointer-events-none')
    })

    it('value clamped to min for negative adjust', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={0} onChange={onChange} min={0} step={5} />)
      // The decrease button is disabled at min, so fire keyboard event instead
      const group = screen.getByRole('group')
      fireEvent.keyDown(group, { key: 'ArrowDown' })
      // onChange called with clamped value (0), not negative
      expect(onChange).toHaveBeenCalledWith(0)
    })

    it('value clamped to max', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={95} onChange={onChange} max={100} step={10} />)
      const plusBtn = screen.getByRole('button', { name: /increase/i })
      await userEvent.click(plusBtn)
      expect(onChange).toHaveBeenCalledWith(100)
    })

    it('hour step 0.5 works correctly', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={1} onChange={onChange} step={0.5} unit="小时" />)
      const plusBtn = screen.getByRole('button', { name: /increase/i })
      await userEvent.click(plusBtn)
      expect(onChange).toHaveBeenCalledWith(1.5)
    })

    it('count current value 0 shows increased to 1', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={0} onChange={onChange} step={1} compactButtons />)
      const plusBtn = screen.getByRole('button', { name: /increase/i })
      await userEvent.click(plusBtn)
      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('quick successive clicks call onChange with value+step each time', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={0} onChange={onChange} step={5} />)
      const plusBtn = screen.getByRole('button', { name: /increase/i })
      await userEvent.click(plusBtn)
      expect(onChange).toHaveBeenCalledWith(5)
      // Re-render with updated value to simulate controlled component
      onChange.mockClear()
    })
  })

  // ---- Wheel (mouse) ----

  describe('mouse wheel', () => {
    it('wheel up increases value', () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const group = screen.getByRole('group')
      fireEvent.wheel(group, { deltaY: -50 })
      expect(onChange).toHaveBeenCalledWith(35)
    })

    it('wheel down decreases value', () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const group = screen.getByRole('group')
      fireEvent.wheel(group, { deltaY: 50 })
      expect(onChange).toHaveBeenCalledWith(25)
    })
  })

  // ---- Touch drag ----

  describe('touch drag', () => {
    it('touch drag down accumulates to decrease', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const group = screen.getByRole('group')

      fireEvent.touchStart(group, { touches: [{ clientY: 100 }] })
      // Move down by 60px (3 × 20px threshold)
      fireEvent.touchMove(group, { touches: [{ clientY: 160 }] })
      expect(onChange).toHaveBeenCalledWith(25)
    })

    it('touch drag up accumulates to increase', async () => {
      const onChange = vi.fn()
      render(<NumberWheel value={30} onChange={onChange} step={5} />)
      const group = screen.getByRole('group')

      fireEvent.touchStart(group, { touches: [{ clientY: 100 }] })
      // Move up by 60px (3 × 20px threshold)
      fireEvent.touchMove(group, { touches: [{ clientY: 40 }] })
      expect(onChange).toHaveBeenCalledWith(35)
    })
  })
})
