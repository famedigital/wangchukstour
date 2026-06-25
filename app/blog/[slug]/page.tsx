import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBlogBySlug, mockBlogs } from '@/lib/mock-data/blogs';
import { Calendar, User, Clock, Tag, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export async function generateStaticParams() {
  return mockBlogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog || !blog.is_published) {
    notFound();
  }

  // Get related posts by category (excluding current post)
  const relatedPosts = mockBlogs
    .filter(b => b.is_published && b.category === blog.category && b.id !== blog.id)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 bg-gradient-to-br from-monastery-red/20 via-background to-prayer-red/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/10 via-transparent to-transparent" />

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="mx-auto max-w-4xl">
              <Badge
                className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                style={{
                  background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                  color: '#FFFFFF'
                }}
              >
                {blog.category}
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-lg">
                <div className="flex items-center gap-3 font-medium">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-3 font-medium">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)' }}>
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span>{format(new Date(blog.published_at), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-3 font-medium">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #B91C1C 0%, #8B0000 100%)' }}>
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.featured_image && (
          <section className="shadow-lg">
            <div className="container">
              <div className="mx-auto max-w-5xl">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <article className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="mb-10 flex flex-wrap gap-3">
                  {blog.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="px-4 py-2 text-sm font-semibold"
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {blog.content.split('\n').map((paragraph, i) => {
                  // Handle headings
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={i} className="font-heading text-3xl md:text-4xl font-bold mt-12 mb-6" style={{ color: 'var(--prayer-red)' }}>
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={i} className="font-heading text-4xl md:text-5xl font-bold mt-12 mb-6">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }

                  // Handle lists
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-8 text-lg">
                        {paragraph.replace('- ', '')}
                      </li>
                    );
                  }

                  // Handle bold
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={i} className="font-bold text-xl mt-6 mb-6">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }

                  // Regular paragraph
                  if (paragraph.trim()) {
                    return (
                      <p key={i} className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Share */}
              <div className="mt-16 pt-10 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div>
                    <p className="font-bold text-xl mb-2">Share this article</p>
                    <p className="text-muted-foreground">
                      Help others discover Bhutan
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                      border: 'none'
                    }}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Share
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <Card className="shadow-lg">
                <CardContent className="p-10">
                  <div className="flex gap-6 items-start">
                    <div className="h-20 w-20 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-xl mb-2">Written by {blog.author}</p>
                      <p className="text-muted-foreground text-lg leading-relaxed">{blog.author_bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <div className="mx-auto max-w-5xl">
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Related Articles</h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                        <div className="relative h-48 overflow-hidden">
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
                          <h3 className="font-heading font-bold text-lg mb-3 line-clamp-2 group-hover:text-prayer-red transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-monastery-red via-prayer-red to-crimson" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(212,160,23,0.2)_0%,_transparent_50%)]" />

          <div className="relative container text-center">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Inspired to Visit Bhutan?
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              Let us help you plan your journey through the Land of the Thunder Dragon.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/tours">
                <MagneticButton
                  className="rounded-xl px-10 py-6 text-lg font-semibold"
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--prayer-red)',
                    border: 'none'
                  }}
                >
                  Explore Our Tours
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>
              <Link href="/contact">
                <MagneticButton
                  className="rounded-xl px-10 py-6 text-lg font-semibold border-2"
                  style={{
                    background: 'transparent',
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF'
                  }}
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </MagneticButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
