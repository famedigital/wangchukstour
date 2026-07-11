'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Tag } from 'lucide-react';

export function BlogSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
      <input
        type="text"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-2xl shadow-lg bg-background px-6 py-4 pl-14 pr-12 text-lg outline-none focus:ring-2 focus:ring-prayer-red/20 transition-all"
      />
      <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Tag className="h-5 w-5" />
        </button>
      )}
    </form>
  );
}