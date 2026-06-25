import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getBlogBySlug, mockBlogs } from '@/lib/mock-data/blogs';
import { Calendar, User, Clock, Tag, ArrowLeft, Share2, Mail } from 'lucide-react';
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
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
          <div className="container px-4">
            <Link
              href="/blog"
              className="inline-flex items-center justify-start rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <div className="mx-auto max-w-4xl">
              <Badge className="mb-4 bg-primary">{blog.category}</Badge>
              <h1 className="font-heading text-3xl font-bold md:text-4xl lg:text-5xl mb-6">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{blog.author}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(blog.published_at), 'MMMM d, yyyy')}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {blog.featured_image && (
          <section className="border-y">
            <div className="container px-4">
              <div className="mx-auto max-w-4xl">
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
        <article className="py-12 bg-background">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl">
              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="mr-1 h-3 w-3" />
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
                      <h2 key={i} className="font-heading text-2xl font-bold mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={i} className="font-heading text-3xl font-bold mt-8 mb-4">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }

                  // Handle lists
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-6">
                        {paragraph.replace('- ', '')}
                      </li>
                    );
                  }

                  // Handle bold
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={i} className="font-bold mt-4 mb-4">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  }

                  // Regular paragraph
                  if (paragraph.trim()) {
                    return (
                      <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Share */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-medium mb-1">Share this article</p>
                    <p className="text-sm text-muted-foreground">
                      Help others discover Bhutan
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <section className="py-12 bg-muted/30">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Written by {blog.author}</p>
                      <p className="text-sm text-muted-foreground">{blog.author_bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-background">
            <div className="container px-4">
              <div className="mx-auto max-w-4xl">
                <h2 className="font-heading text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                        <div className="relative h-36 bg-muted">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <Badge className="mb-2 text-xs" variant="secondary">
                            {post.category}
                          </Badge>
                          <h3 className="font-heading font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
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
        <section className="py-16 bg-gradient-to-br from-primary to-secondary">
          <div className="container px-4 text-center">
            <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-4">
              Inspired to Visit Bhutan?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
              Let us help you plan your journey through the Land of the Thunder Dragon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tours"
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-10 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/80 bg-background text-foreground hover:bg-background/90"
              >
                Explore Our Tours
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-background px-10 py-6 text-lg font-medium text-foreground transition-all hover:bg-muted border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Mail className="mr-2 h-4 w-4" />
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
