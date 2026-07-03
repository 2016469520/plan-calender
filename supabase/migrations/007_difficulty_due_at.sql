-- ============================================================
-- Migration 007: Add difficulty and due_at to tasks
-- ============================================================

BEGIN;

-- 1. Add difficulty column (replaces priority for user choice)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'medium', 'hard', 'very_hard'));

-- 2. Add due_at column (deadline for auto urgency calculation)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ;

-- 3. Add index for due_at based queries
CREATE INDEX IF NOT EXISTS idx_tasks_due_at ON tasks(user_id, due_at) WHERE due_at IS NOT NULL;

-- 4. Migrate existing priority values to difficulty (best-effort mapping)
-- priority 'low' → 'easy', 'normal' → 'medium', 'high' → 'hard', 'urgent' → 'very_hard'
UPDATE tasks SET difficulty = 'easy' WHERE priority = 'low' AND difficulty = 'medium';
UPDATE tasks SET difficulty = 'hard' WHERE priority = 'high' AND difficulty = 'medium';
UPDATE tasks SET difficulty = 'very_hard' WHERE priority = 'urgent' AND difficulty = 'medium';
-- 'normal' already defaults to 'medium', no change needed

-- 5. Add comment for legacy priority column
COMMENT ON COLUMN tasks.priority IS 'Legacy priority field — superseded by difficulty. Kept for backward compatibility.';

COMMIT;
