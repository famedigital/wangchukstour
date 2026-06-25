'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPublishedBlogs, getFeaturedBlogs, mockBlogs } from '@/lib/mock-data/blogs';
import { Calendar, User, Clock, Tag, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'Travel Guide', label: 'Travel Guides' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Seasonal', label: 'Seasonal' },
  { value: 'Food & Culture', label: 'Food & Culture' },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPosts = getFeaturedBlogs();

  const filteredPosts = mockBlogs.filter((blog) => {
    if (!blog.is_published) return false;

    if (selectedCategory !== 'all' && blog.category !== selectedCategory) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = `${blog.title} ${blog.excerpt} ${blog.tags.join(' ')}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const allCategories = Array.from(new Set(mockBlogs.filter(b => b.is_published).map(b => b.category)));
  const allTags = Array.from(new Set(mockBlogs.flatMap(b => b.tags)));

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4">Blog</Badge>
              <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl mb-6">
                Stories from the Land of the Thunder Dragon
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover Bhutan through our travel guides, cultural insights, and stories from the
                Himalayan kingdom.
              </p>

              {/* Search Bar */}
              <div className="mt-8 relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 pl-12 pr-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <section className="py-12 bg-background">
            <div className="container px-4">
              <div className="mb-8">
                <Badge className="mb-2">Featured</Badge>
                <h2 className="font-heading text-2xl font-bold">Featured Stories</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow border-2">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Badge className="absolute top-4 right-4 bg-primary">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(post.published_at), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="py-6 border-t bg-background/95 backdrop-blur sticky top-16 z-30">
          <div className="container px-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-12 bg-background">
          <div className="container px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold">
                {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
              </h2>
              <p className="text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Badge className="absolute top-4 right-4 bg-primary">
                          {post.category}
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(post.published_at), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                        </div>
                        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query.
                </p>
                <Button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Tags Cloud */}
        {allTags.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="font-heading text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                  <Tag className="h-5 w-5" />
                  Explore by Tags
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {allTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-br from-primary to-secondary">
          <div className="container px-4 text-center">
            <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-4">
              Stay Updated on Bhutan Travel
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
              Get travel tips, cultural insights, and exclusive offers delivered to your inbox.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-10 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/80 bg-background text-foreground hover:bg-background/90"
            >
              Subscribe to Our Newsletter
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
