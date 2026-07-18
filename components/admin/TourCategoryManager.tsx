'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

type TourCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function TourCategoryManager() {
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/tour-categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  const update = (index: number, patch: Partial<TourCategory>) => {
    setCategories((prev) =>
      prev.map((c, i) => {
        if (i !== index) return c;
        const next = { ...c, ...patch };
        if (patch.name !== undefined && (!c.slug || c.slug === slugify(c.name))) {
          next.slug = slugify(patch.name);
        }
        return next;
      })
    );
  };

  const addCategory = () => {
    const id = `cat-${Date.now()}`;
    setCategories((prev) => [
      ...prev,
      {
        id,
        name: 'New Category',
        slug: `new-category-${prev.length + 1}`,
        sort_order: prev.length,
        is_active: true,
      },
    ]);
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, sort_order: i })));
  };

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/tour-categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });
      if (!response.ok) throw new Error('Save failed');
      toast.success('Categories saved — public Tours menu will update');
    } catch {
      toast.error('Failed to save categories');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 flex items-center gap-2 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading categories...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Tour Categories</h2>
          <p className="text-sm text-gray-500">Shown as submenu under Tours on the public site</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addCategory}
            className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Categories
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
          >
            <input
              className="md:col-span-4 min-h-11 px-3 rounded-lg border border-gray-200"
              value={cat.name}
              onChange={(e) => update(index, { name: e.target.value })}
              placeholder="Category name"
            />
            <input
              className="md:col-span-3 min-h-11 px-3 rounded-lg border border-gray-200"
              value={cat.slug}
              onChange={(e) => update(index, { slug: slugify(e.target.value) })}
              placeholder="slug"
            />
            <label className="md:col-span-3 min-h-11 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cat.is_active}
                onChange={(e) => update(index, { is_active: e.target.checked })}
              />
              Active in public menu
            </label>
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="md:col-span-2 min-h-11 inline-flex items-center justify-center gap-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
