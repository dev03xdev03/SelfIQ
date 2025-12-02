-- Update detected_gender constraint from 'n' (neutral) to 'd' (divers)
-- This aligns with the app's gender detection logic

-- Drop the old constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_detected_gender_check;

-- Add new constraint with 'd' instead of 'n'
ALTER TABLE users ADD CONSTRAINT users_detected_gender_check 
    CHECK (detected_gender IN ('m', 'w', 'd'));

-- Update existing 'n' values to 'd'
UPDATE users SET detected_gender = 'd' WHERE detected_gender = 'n';

-- Update default value
ALTER TABLE users ALTER COLUMN detected_gender SET DEFAULT 'd';
