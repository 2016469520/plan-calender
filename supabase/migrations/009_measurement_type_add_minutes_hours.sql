-- Migration 009: Add 'minutes' and 'hours' to habits.measurement_type CHECK constraint
-- The app now supports measurement_type 'minutes' and 'hours' in addition to the original four.
-- This migration alters the CHECK constraint to add these two new values.

BEGIN;

-- 1. Drop the old CHECK constraint (name may vary; use DO block for safety)
DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'habits'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) LIKE '%measurement_type%';

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE habits DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

-- 2. Add the new CHECK constraint with all six values
ALTER TABLE habits ADD CONSTRAINT chk_habits_measurement_type
    CHECK (measurement_type IN ('boolean', 'count', 'duration', 'minutes', 'hours', 'numeric'));

-- 3. Comment for documentation
COMMENT ON COLUMN habits.measurement_type IS 'Measurement type: boolean, count, duration, minutes, hours, numeric';

COMMIT;
