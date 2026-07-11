'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Clock, Star, Loader2, FileText } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { BlogEditor } from './BlogEditor';
import { PremiumModal } from '@/components/ui/premium-modal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string; // Keep as featured_image for consistency with BlogEditor
  featured_image_public_id?: string;
  author_name: string; // Changed from author to match BlogEditor interface
  author_bio?: string;
  category: string;
  tags: string[];
  published_date?: string;
  is_published: boolean;
  read_time?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  views?: number;
  created_at?: string;
}

export function BlogManagement() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [filterStatus, filterCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/blog?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error: any) {
      console.error('Failed to fetch blog posts:', error);
      setError(error.message || 'An error occurred while fetching posts');
      toast.error('Failed to load blog posts', {
        description: error.message || 'Please try again later',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPosts.size === 0) {
      toast.error('No posts selected', {
        description: 'Please select at least one post to delete.',
        duration: 3000,
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedPosts.size} post(s)?`)) {
      return;
    }

    try {
      // Add all selected posts to deleting state
      setDeleting(new Set(selectedPosts));

      const deletePromises = Array.from(selectedPosts).map(async (id) => {
        const response = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to delete post ${id}`);
        }
        return id;
      });

      await Promise.all(deletePromises);

      setSelectedPosts(new Set());
      await fetchPosts();

      toast.success(`${selectedPosts.size} post(s) deleted successfully!`, {
        description: 'The posts have been removed.',
        duration: 4000,
      });
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete posts', {
        description: error.message || 'An error occurred while deleting. Please try again.',
        duration: 5000,
      });
    } finally {
      setDeleting(new Set());
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      // Add to deleting state
      setDeleting(new Set([id]));

      const response = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete post');
      }

      await fetchPosts();

      toast.success('Post deleted successfully!', {
        description: 'The post has been removed.',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete post', {
        description: error.message || 'An error occurred while deleting. Please try again.',
        duration: 5000,
      });
    } finally {
      setDeleting(new Set());
    }
  };

  const toggleSelectPost = (id: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPosts(newSelected);
  };

  const selectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map(p => p.id)));
    }
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50';
  };

  return (
    <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Blog Posts</h2>
            <p className="text-gray-500 mt-1">{posts.length} posts</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300 bg-white">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              onClick={() => router.push('/admin/blog/new')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
              style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
            >
              <Plus className="h-4 w-4" />
              New Post
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            <option value="travel">Travel</option>
            <option value="culture">Culture</option>
            <option value="trekking">Trekking</option>
            <option value="festival">Festival</option>
          </select>

          {/* Actions */}
          {selectedPosts.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-5 h-5" />
              Delete ({selectedPosts.size})
            </button>
          )}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600">Loading blog posts...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-xl p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="mt-4 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 shadow-sm"
            >
              Try Again
            </button>
          </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => window.location.href = `/admin/blog/${post.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold">{post.title}</div>
                  <div className="text-sm text-gray-500">{post.excerpt}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(post.is_published)}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.published_date || post.created_at || 'No date')}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Eye className="h-4 w-4" />
                    {post.views} views
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/admin/blog/${post.id}`;
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/admin/blog/${post.id}`;
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post.id);
                    }}
                    disabled={deleting.has(post.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    {deleting.has(post.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No blog posts yet. Create your first blog post to get started!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-white mx-auto"
            style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
          >
            <Plus className="h-4 w-4" />
            Create Your First Post
          </button>
        </div>
      )}

      {/* Create Post Modal */}
      <PremiumModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Blog Post"
        size="full"
        showCloseButton={true}
      >
        <div className="h-full overflow-y-auto">
          <BlogEditor
            isNewPost={true}
            onSave={async (post) => {
              try {
                const response = await fetch('/api/admin/blog', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(post),
                });

                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.error || 'Failed to create blog post');
                }

                await fetchPosts();
                setShowCreateModal(false);
                toast.success('Blog post created successfully!', {
                  description: 'Your new post has been added.',
                  duration: 4000,
                });
              } catch (error: any) {
                console.error('Create error:', error);
                toast.error('Failed to create blog post', {
                  description: error.message || 'An error occurred while creating. Please try again.',
                  duration: 5000,
                });
                throw error;
              }
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </div>
      </PremiumModal>

      {/* Edit Post Modal */}
      <PremiumModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPost(null);
        }}
        title="Edit Blog Post"
        size="full"
        showCloseButton={true}
      >
        <div className="h-full overflow-y-auto">
          {editingPost && (
            <BlogEditor
              post={editingPost}
              postId={editingPost.id}
              isNewPost={false}
              onSave={async (post) => {
                try {
                  const response = await fetch(`/api/admin/blog/${editingPost.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(post),
                  });

                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Failed to update blog post');
                  }

                  await fetchPosts();
                  setShowEditModal(false);
                  setEditingPost(null);
                  toast.success('Blog post updated successfully!', {
                    description: 'Your changes have been saved.',
                    duration: 4000,
                  });
                } catch (error: any) {
                  console.error('Update error:', error);
                  toast.error('Failed to update blog post', {
                    description: error.message || 'An error occurred while updating. Please try again.',
                    duration: 5000,
                  });
                  throw error;
                }
              }}
              onCancel={() => {
                setShowEditModal(false);
                setEditingPost(null);
              }}
            />
          )}
        </div>
      </PremiumModal>
      </CardContent>
    </Card>
  );
}
