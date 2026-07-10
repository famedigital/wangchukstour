'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Clock, Star, Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  author: string; // Changed from author_name to match database
  category: string;
  tags: string[];
  published_date: string;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  read_time: number;
  created_at: string;
}

export function BlogManagement() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">{posts.length} posts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
        >
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
              Delete ({selectedPosts.size})
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mb-4" />
          <p className="text-gray-600 text-lg">Loading blog posts...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Posts</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => fetchPosts()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
          >
            Try Again
          </button>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Select All */}
          <div className="col-span-full flex items-center gap-2 p-2">
            <input
              type="checkbox"
              checked={selectedPosts.size === posts.length}
              onChange={selectAll}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow ${
                selectedPosts.has(post.id) ? 'ring-2 ring-red-500' : ''
              }`}
            >
              {/* Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedPosts.has(post.id)}
                  onChange={() => toggleSelectPost(post.id)}
                  className="w-4 h-4 rounded"
                />
              </div>

              {/* Featured Image */}
              <div className="relative h-48">
                <img
                  src={post.featured_image_url || '/placeholder.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  {post.is_featured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                      <Star className="w-3 h-3 inline mr-1" />
                      Featured
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.is_published ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold capitalize">
                    {post.category}
                  </span>
                </div>

                {/* Read Time */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.read_time} min read
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm mb-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.published_date || post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <button
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(post)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deleting.has(post.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting.has(post.id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No blog posts found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
              : 'Create your first blog post to start sharing your travel stories and insights.'}
          </p>
          {(searchQuery || filterStatus !== 'all' || filterCategory !== 'all') ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterCategory('all');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
            >
              <Plus className="w-5 h-5" />
              Create Your First Post
            </button>
          )}
        </div>
      )}
    </div>
  );
}
