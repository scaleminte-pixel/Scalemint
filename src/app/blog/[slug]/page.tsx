import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const blog = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!blog) return { title: 'Article Not Found — Scalemint' };

  return {
    title: `${blog.title} — Scalemint Insights`,
    description: blog.excerpt,
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDesc || blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt.toISOString(),
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [settings, blog, recentPosts] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: { coverMedia: true },
    }),
    prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: params.slug },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    }),
  ]);

  if (!blog || blog.status !== 'PUBLISHED') {
    notFound();
  }

  const coverImage =
    blog.coverMedia?.publicUrl ||
    blog.coverUrl ||
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(blog.publishedAt));

  return (
    <div className="min-h-screen flex flex-col bg-agency-dark">
      <Header
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        whatsappNumber={settings?.whatsappNumber}
      />

      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Apple-style Top Spotlight & Ambient Orbs */}
        <div className="spotlight-top" />
        <div className="ambient-orb top-40 left-1/4 w-[600px] h-[600px] bg-purple-600/10" />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all articles</span>
            </Link>
          </div>

          {/* Article Header */}
          <AnimateOnScroll variant="fadeUp" className="space-y-6 text-left mb-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                {blog.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {formattedDate}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {blog.readTime}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {blog.title}
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed border-l-2 border-purple-500 pl-4 italic">
              {blog.excerpt}
            </p>

            {/* Author Byline */}
            <div className="pt-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
                {blog.author.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-white block">
                  {blog.author}
                </span>
                <span className="text-xs text-purple-300">
                  {blog.authorRole || 'Principal Strategist'} · Scalemint Studio
                </span>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Hero Cover Visual with Glowing Border */}
          <AnimateOnScroll variant="scaleUp" duration={0.6} className="mb-14">
            <div className="relative rounded-2xl p-1 bg-gradient-to-tr from-purple-500/30 via-indigo-500/20 to-blue-500/20 shadow-2xl animate-border-glow">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-agency-surface">
                <img
                  src={coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Article Body */}
          <AnimateOnScroll variant="fadeUp" duration={0.6}>
            <div className="glass-card rounded-2xl p-8 sm:p-12 border border-white/10 space-y-6 text-gray-200 leading-relaxed text-base sm:text-lg">
              {blog.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();

                // Inline Image Block: ![caption](url)
                if (trimmed.startsWith('![') && trimmed.includes('](')) {
                  const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
                  if (match) {
                    const caption = match[1];
                    const src = match[2];
                    return (
                      <figure key={idx} className="my-8 space-y-2">
                        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-xl">
                          <img
                            src={src}
                            alt={caption || blog.title}
                            className="w-full h-auto object-cover max-h-[550px]"
                            loading="lazy"
                          />
                        </div>
                        {caption && (
                          <figcaption className="text-xs text-center text-gray-400 font-mono italic pt-1">
                            {caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                }

                // Markdown Headings ###
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3
                      key={idx}
                      className="font-heading text-2xl sm:text-3xl font-bold text-white pt-6 pb-2 border-b border-white/[0.08]"
                    >
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }

                // Markdown Headings ##
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="font-heading text-3xl font-extrabold text-white pt-8 pb-3"
                    >
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }

                // Code block / Callout
                if (trimmed.startsWith('```')) {
                  const cleaned = trimmed.replace(/```/g, '').trim();
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-black/50 border border-purple-500/30 font-mono text-sm text-purple-300 my-4"
                    >
                      {cleaned}
                    </div>
                  );
                }

                // Bullet points
                if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
                  const items = trimmed.split('\n');
                  return (
                    <ul key={idx} className="space-y-3 my-4 pl-2">
                      {items.map((item, itemIdx) => {
                        const cleanItem = item.replace(/^[-*]|\d+\.\s*/, '').trim();
                        return (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
                            <span className="text-gray-300 text-base">{cleanItem}</span>
                          </li>
                        );
                      })}
                    </ul>
                  );
                }

                // Normal Paragraph
                return (
                  <p key={idx} className="text-gray-300 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </AnimateOnScroll>

          {/* Article Bottom Conversion Banner */}
          <div className="mt-16 rounded-2xl p-8 sm:p-10 bg-gradient-to-r from-purple-900/40 via-[#121228] to-blue-900/40 border border-purple-500/30 text-center space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              Execute With Confidence
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Ready to Upgrade Your Brand & Growth Strategy?
            </h3>
            <p className="text-gray-300 text-sm max-w-xl mx-auto">
              Partner with our dedicated 360° squad. From brand systems and Next.js web applications to viral video and Google Ads.
            </p>
            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-heading font-semibold text-xs sm:text-sm bg-white text-black hover:bg-gray-100 transition-all shadow-lg active:scale-95"
              >
                <span>Schedule Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Recent Articles */}
          {recentPosts.length > 0 && (
            <div className="mt-20 space-y-6">
              <h3 className="font-heading text-xl font-bold text-white">
                Related Agency Perspectives
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="glass-card rounded-xl p-5 border border-white/[0.08] hover:border-purple-500/40 transition-all group block space-y-2"
                  >
                    <span className="text-[10px] uppercase font-bold text-purple-400 block">
                      {post.category}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <span className="text-xs text-gray-400 block">
                      {post.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        contactEmail={settings?.contactEmail}
        contactPhone={settings?.contactPhone}
        whatsappNumber={settings?.whatsappNumber}
        address={settings?.address}
        footerText={settings?.footerText}
      />
    </div>
  );
}
