-- 🔧 Final Safe Blog Schema Fix (Respects Shared Functions)
-- Run this in your Supabase SQL Editor

-- Step 1: Check current schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blogs'
ORDER BY ordinal_position;

-- Step 2: Add missing columns (one at a time for safety)
-- Note: These will skip columns that already exist
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL UNIQUE;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS excerpt TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS content TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS featured_image TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS featured_image_public_id TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS category TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS author_name TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS author_bio TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS published_date TIMESTAMPTZ;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS read_time INTEGER;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS meta_title TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS meta_description TEXT;

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[];

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 3: Handle the trigger properly (DON'T drop the shared function)
-- Only drop and recreate the blogs table trigger
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;

-- Step 4: Create the trigger using the existing shared function
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_created_by ON blogs(created_by);
CREATE INDEX IF NOT EXISTS idx_blogs_updated_by ON blogs(updated_by);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Step 6: Verify the final schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blogs'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Blog schema updated successfully!';
    RAISE NOTICE '📝 Added all missing columns to blogs table';
    RAISE NOTICE '🔄 Recreated blogs table trigger using shared function';
    RAISE NOTICE '📇 Created performance indexes';
END $$;