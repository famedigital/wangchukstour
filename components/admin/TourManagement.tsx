'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Clock, TrendingUp, MapPin, Users, Calendar, X } from 'lucide-react';

interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  hero_image_url: string;
  thumbnail_url: string;
  category: string;
  duration: number;
  price: number;
  difficulty_level: string;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
}

export function TourManagement() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTours, setSelectedTours] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTours();
  }, [filterCategory, filterStatus, searchQuery]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/tours?${params.toString()}`);
      const data = await response.json();
      setTours(data.tours || []);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTours.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedTours.size} tour(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedTours).map(id =>
          fetch(`/api/admin/tours/${id}`, { method: 'DELETE' })
        )
      );

      setSelectedTours(new Set());
      await fetchTours();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    try {
      await fetch(`/api/admin/tours/${id}`, { method: 'DELETE' });
      await fetchTours();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const toggleSelectTour = (id: string) => {
    const newSelected = new Set(selectedTours);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTours(newSelected);
  };

  const selectAll = () => {
    if (selectedTours.size === tours.length) {
      setSelectedTours(new Set());
    } else {
      setSelectedTours(new Set(tours.map(t => t.id)));
    }
  };

  const openEditModal = (tour: Tour) => {
    setEditingTour(tour);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Tours</h1>
          <p className="text-gray-500 mt-1">{tours.length} tours</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add New Tour
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
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Categories</option>
            <option value="all">All Categories</option>
            <option value="international">International Tour</option>
            <option value="regional">Regional Tour</option>
            <option value="festival">Festival</option>
            <option value="spiritual">Spiritual</option>
            <option value="adventure">Adventure</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Actions */}
          {selectedTours.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
              Delete ({selectedTours.size})
            </button>
          )}
        </div>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : tours.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Select All */}
          <div className="col-span-full flex items-center gap-2 p-2">
            <input
              type="checkbox"
              checked={selectedTours.size === tours.length}
              onChange={selectAll}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>

          {tours.map((tour) => (
            <div
              key={tour.id}
              className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow ${
                selectedTours.has(tour.id) ? 'ring-2 ring-red-500' : ''
              }`}
            >
              {/* Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedTours.has(tour.id)}
                  onChange={() => toggleSelectTour(tour.id)}
                  className="w-4 h-4 rounded"
                />
              </div>

              {/* Image */}
              <div className="relative h-48">
                <img
                  src={tour.hero_image_url || tour.thumbnail_url || '/placeholder.jpg'}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold capitalize">
                    {tour.category}
                  </span>
                  {tour.is_featured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                      ⭐ Featured
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tour.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {tour.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg px-3 py-1 shadow">
                  <div className="text-lg font-bold" style={{ color: '#DC143C' }}>
                    ${tour.price}
                  </div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{tour.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tour.tagline}</p>

                {/* Quick Info */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{tour.duration}d</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{tour.difficulty_level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span>{tour.view_count}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <button
                    onClick={() => window.open(`/tours/${tour.slug}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(tour)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTour(tour.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
          <p className="text-gray-500 mb-6">Create your first tour to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
          >
            <Plus className="w-5 h-5" />
            Create Tour
          </button>
        </div>
      )}
    </div>
  );
}