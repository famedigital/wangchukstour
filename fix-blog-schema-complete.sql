-- 🔧 Complete Blog Schema Fix Script
-- Run this in your Supabase SQL Editor to fix all blog-related database issues

-- First, let's check current schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blogs'
ORDER BY ordinal_position;

-- Step 1: Add missing columns to blogs table
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL UNIQUE,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS featured_image_public_id TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS author_bio TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS published_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS read_time INTEGER,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[],
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_created_by ON blogs(created_by);
CREATE INDEX IF NOT EXISTS idx_blogs_updated_by ON blogs(updated_by);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Step 3: Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Add helpful comments
COMMENT ON TABLE blogs IS 'Blog posts and articles';
COMMENT ON COLUMN blogs.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN blogs.title IS 'Blog post title';
COMMENT ON COLUMN blogs.slug IS 'URL-friendly identifier (unique)';
COMMENT ON COLUMN blogs.excerpt IS 'Short summary/preview';
COMMENT ON COLUMN blogs.content IS 'Main blog content (can be HTML/Markdown)';
COMMENT ON COLUMN blogs.featured_image IS 'Featured image URL';
COMMENT ON COLUMN blogs.featured_image_public_id IS 'Cloudinary public ID for featured image';
COMMENT ON COLUMN blogs.category IS 'Blog post category';
COMMENT ON COLUMN blogs.tags IS 'Array of tags for categorization';
COMMENT ON COLUMN blogs.author_name IS 'Author display name';
COMMENT ON COLUMN blogs.author_bio IS 'Author biography';
COMMENT ON COLUMN blogs.is_published IS 'Publication status';
COMMENT ON COLUMN blogs.is_featured IS 'Featured post flag';
COMMENT ON COLUMN blogs.published_date IS 'Publication date (legacy)';
COMMENT ON COLUMN blogs.published_at IS 'Publication timestamp';
COMMENT ON COLUMN blogs.read_time IS 'Estimated reading time (minutes)';
COMMENT ON COLUMN blogs.meta_title IS 'SEO meta title';
COMMENT ON COLUMN blogs.meta_description IS 'SEO meta description';
COMMENT ON COLUMN blogs.meta_keywords IS 'SEO meta keywords';
COMMENT ON COLUMN blogs.created_by IS 'User who created the post';
COMMENT ON COLUMN blogs.updated_by IS 'User who last updated the post';
COMMENT ON COLUMN blogs.created_at IS 'Creation timestamp';
COMMENT ON COLUMN blogs.updated_at IS 'Last update timestamp';

-- Step 5: Verify the schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blogs'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Blog schema has been successfully updated!';
    RAISE NOTICE '📝 All columns, indexes, and triggers have been created.';
END $$;