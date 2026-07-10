-- Add tracking columns to blogs table
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Create index on created_by for faster queries
CREATE INDEX IF NOT EXISTS idx_blogs_created_by ON blogs(created_by);
CREATE INDEX IF NOT EXISTS idx_blogs_updated_by ON blogs(updated_by);

-- Add comment for documentation
COMMENT ON COLUMN blogs.created_by IS 'User ID who created the blog post';
COMMENT ON COLUMN blogs.updated_by IS 'User ID who last updated the blog post';