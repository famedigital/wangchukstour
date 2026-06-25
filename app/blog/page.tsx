'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { getPublishedBlogs, getFeaturedBlogs, mockBlogs } from '@/lib/mock-data/blogs';
import { Calendar, User, Clock, Tag, Search, ArrowRight } from 'lucide-react';
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

  const allTags = Array.from(new Set(mockBlogs.flatMap(b => b.tags)));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-monastery-red/20 via-background to-prayer-red/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/10 via-transparent to-transparent" />

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-20">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-3xl text-center">
                <Badge
                  className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  Blog
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8">
                  <span className="bg-clip-text text-transparent" style={{
                    backgroundImage: 'linear-gradient(135deg, #DC143C 0%, #8B0000 50%, #D4A017 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Stories from the Land of the Thunder Dragon
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                  Discover Bhutan through our travel guides, cultural insights, and stories from the
                  Himalayan kingdom.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative">
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
                      onClick={() => setSearchQuery('')}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Tag className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <section className="py-16 md:py-20">
            <div className="container">
              <ScrollReveal>
                <div className="mb-12">
                  <Badge
                    className="mb-3 px-4 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                    style={{
                      background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
                      color: '#FFFFFF'
                    }}
                  >
                    Featured
                  </Badge>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold">Featured Stories</h2>
                </div>
              </ScrollReveal>
              <StaggerChildren>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <Badge
                            className="absolute top-5 right-5 border-0 font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                              color: '#FFFFFF'
                            }}
                          >
                            {post.category}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2 font-medium">
                              <Calendar className="h-4 w-4" style={{ color: 'var(--prayer-red)' }} />
                              {format(new Date(post.published_at), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                              <User className="h-4 w-4" style={{ color: 'var(--prayer-red)' }} />
                              {post.author}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 group-hover:text-prayer-red transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs font-semibold">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </StaggerChildren>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="py-8 bg-muted/30 backdrop-blur-md sticky top-20 z-30 shadow-lg">
          <div className="container">
            <div className="flex items-center gap-6 overflow-x-auto">
              <div className="flex gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedCategory === category.value
                        ? 'text-white shadow-lg'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    style={selectedCategory === category.value ? {
                      background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)'
                    } : {}}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="font-heading text-2xl md:text-3xl font-bold">
                {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
              </h2>
              <p className="text-muted-foreground text-lg">
                <span className="font-bold" style={{ color: 'var(--prayer-red)' }}>
                  {filteredPosts.length}
                </span>
                {' '}{filteredPosts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            {filteredPosts.length > 0 ? (
              <StaggerChildren>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <Badge
                            className="absolute top-5 right-5 border-0 font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                              color: '#FFFFFF'
                            }}
                          >
                            {post.category}
                          </Badge>
                        </div>
                        <CardContent className="p-6">
                          <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2 font-medium">
                              <Calendar className="h-4 w-4" style={{ color: 'var(--prayer-red)' }} />
                              {format(new Date(post.published_at), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-2 font-medium">
                              <User className="h-4 w-4" style={{ color: 'var(--prayer-red)' }} />
                              {post.author}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 group-hover:text-prayer-red transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs font-semibold">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </StaggerChildren>
            ) : (
              <div className="py-24 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">No articles found</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    border: 'none'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Tags Cloud */}
        {allTags.length > 0 && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                    <Tag className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-8">Explore by Tags</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer px-5 py-2 text-sm font-semibold hover:shadow-md transition-all"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-monastery-red via-prayer-red to-crimson" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,160,23,0.2)_0%,_transparent_50%)]" />

          <div className="relative container text-center">
            <ScrollReveal>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Stay Updated on Bhutan Travel
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                Get travel tips, cultural insights, and exclusive offers delivered to your inbox.
              </p>
              <Link href="/contact">
                <MagneticButton
                  className="rounded-xl px-10 py-6 text-lg font-semibold"
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--prayer-red)',
                    border: 'none'
                  }}
                >
                  Subscribe to Our Newsletter
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
