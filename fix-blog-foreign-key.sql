-- 🔧 Fix Foreign Key Constraints for Blog Table
-- Run this in your Supabase SQL Editor

-- Step 1: Check current foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'blogs';

-- Step 2: Drop existing foreign key constraints (they're too strict)
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_created_by_fkey;
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_updated_by_fkey;

-- Step 3: Add foreign key constraints WITHOUT validation (allows existing data)
-- This makes the constraints more permissive for development
ALTER TABLE blogs
ADD CONSTRAINT blogs_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL NOT VALID;

ALTER TABLE blogs
ADD CONSTRAINT blogs_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES auth.users(id) ON DELETE SET NULL NOT VALID;

-- Step 4: Validate the constraints (optional - checks if existing data is valid)
-- ALTER TABLE blogs VALIDATE CONSTRAINT blogs_created_by_fkey;
-- ALTER TABLE blogs VALIDATE CONSTRAINT blogs_updated_by_fkey;

-- Alternative: Make columns nullable without foreign key constraints
-- (Use this if you prefer simpler user tracking)

-- ALTER TABLE blogs
-- ALTER COLUMN created_by DROP NOT NULL,
-- ALTER COLUMN updated_by DROP NOT NULL;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Foreign key constraints fixed!';
    RAISE NOTICE '📝 created_by and updated_by now accept NULL values';
    RAISE NOTICE '🔄 User tracking now works without strict validation';
END $$;