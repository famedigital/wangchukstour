import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { Calendar, User, Clock, Tag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getPublishedBlogPosts } from '@/lib/database';
import { BlogSearch } from '@/components/blog/BlogSearch';

const optimizeImageUrl = (url: string, width: number, height: number) => {
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

export default async function BlogPage() {
  // Fetch blog posts on server side - instant loading!
  const posts = await getPublishedBlogPosts();

  // Get featured posts (only published ones) - using recent posts as featured since is_featured was removed from schema
  const featuredPosts = posts.filter(post => post.status === 'published').slice(0, 3);

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  // Handle empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Stories Yet</h2>
            <p className="text-gray-500">Check back soon for new stories from Bhutan!</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911267/tigernest_paro_wdenqu.jpg', 1920, 1080)}
              alt="Tiger's Nest Monastery"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/20 via-transparent to-transparent" />
          </div>

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
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 text-white">
                  Stories from the Land of the Thunder Dragon
                </h1>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-10">
                  Discover Bhutan through our travel guides, cultural insights, and stories from the
                  Himalayan kingdom.
                </p>

                {/* Interactive Search Component */}
                <BlogSearch />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
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
                  <h2 className="font-heading text-3xl md:text-4xl font-bold">Featured Stories</h2>
                </div>
              </ScrollReveal>

              <StaggerChildren className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post) => (
                  <ScrollReveal key={post.id}>
                    <Link href={`/blog/${post.slug}`}>
                      <Card className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                        <div className="relative overflow-hidden aspect-[16/10]">
                          {post.featured_image_url ? (
                            <img
                              src={optimizeImageUrl(post.featured_image_url, 800, 500)}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                              <span className="text-6xl">🏔️</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <Badge
                              className="px-4 py-2 text-xs font-semibold border-0"
                              style={{
                                background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                                color: '#FFFFFF'
                              }}
                            >
                              {post.category}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{post.author_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}</span>
                            </div>
                          </div>

                          <h3 className="font-heading text-xl font-bold mb-3 line-clamp-2 group-hover:text-prayer-red transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.excerpt || post.content?.substring(0, 150) + '...'}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{post.read_time ? `${post.read_time} min read` : '5 min read'}</span>
                            </div>
                            <ArrowRight className="h-5 w-5 text-prayer-red group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </StaggerChildren>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container">
            <ScrollReveal>
              <div className="mb-12">
                <Badge
                  className="mb-3 px-4 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  All Stories
                </Badge>
                <h2 className="font-heading text-3xl md:text-4xl font-bold">Latest from Bhutan</h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ScrollReveal key={post.id}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div className="relative overflow-hidden aspect-[16/10]">
                        {post.featured_image_url ? (
                          <img
                            src={optimizeImageUrl(post.featured_image_url, 800, 500)}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                            <span className="text-6xl">🏔️</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge
                            className="px-4 py-2 text-xs font-semibold border-0"
                            style={{
                              background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                              color: '#FFFFFF'
                            }}
                          >
                            {post.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}</span>
                          </div>
                        </div>

                        <h3 className="font-heading text-xl font-bold mb-3 line-clamp-2 group-hover:text-prayer-red transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt || post.content?.substring(0, 150) + '...'}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{post.read_time ? `${post.read_time} min read` : '5 min read'}</span>
                          </div>
                          <ArrowRight className="h-5 w-5 text-prayer-red group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Popular Tags */}
        {allTags.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <Badge
                    className="mb-3 px-4 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                    style={{
                      background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
                      color: '#FFFFFF'
                    }}
                  >
                    Explore
                  </Badge>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold">Popular Topics</h2>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                  {allTags.slice(0, 12).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="group"
                    >
                      <Badge
                        variant="outline"
                        className="px-6 py-3 text-sm font-semibold border-2 hover:border-prayer-red transition-colors cursor-pointer"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl('https://res.cloudinary.com/hckgrdeh/image/upload/q_auto,f_auto/v1782911256/buddhapoint_z2kucc.jpg', 1920, 1080)}
              alt="Buddha Point, Thimphu"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent" />
          </div>

          <div className="relative container">
            <ScrollReveal>
              <div className="max-w-2xl">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Experience Bhutan?
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Let our stories inspire your journey. Explore our tours and discover the magic of the Land of the Thunder Dragon.
                </p>
                <MagneticButton>
                  <Link
                    href="/tours"
                    className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
                  >
                    Explore Tours
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}