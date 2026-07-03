-- Migration 008: Add timer_mode to focus_sessions
-- Supports both countdown (倒计时) and stopwatch (正计时) modes

-- Add timer_mode column
ALTER TABLE focus_sessions
ADD COLUMN IF NOT EXISTS timer_mode TEXT NOT NULL DEFAULT 'countdown';

-- Add check constraint
ALTER TABLE focus_sessions
ADD CONSTRAINT chk_focus_timer_mode
CHECK (timer_mode IN ('countdown', 'stopwatch'));

-- Create index for timer_mode filtering
CREATE INDEX IF NOT EXISTS idx_focus_sessions_timer_mode
ON focus_sessions(user_id, timer_mode);
