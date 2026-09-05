import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from '@/components/AnimateOnScroll';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Insights & Thought Leadership — Scalemint Studio',
  description:
    'Strategic perspectives on modern brand positioning, Next.js web architecture, viral AI UGC, and high-ROAS Google Ads.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const [settings, blogs] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        ...(searchParams?.category && searchParams.category !== 'All'
          ? { category: searchParams.category }
          : {}),
      },
      orderBy: [{ displayOrder: 'asc' }, { publishedAt: 'desc' }],
      include: { coverMedia: true },
    }),
  ]);

  const categories = [
    'All',
    'Branding & Positioning',
    'Web Engineering & CRO',
    'Video & Paid Ads',
    'Performance Marketing',
  ];

  const currentCategory = searchParams?.category || 'All';

  const featuredPost = blogs[0];
  const regularPosts = blogs.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-agency-dark">
      <Header
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        whatsappNumber={settings?.whatsappNumber}
      />

      <main className="flex-grow pt-28 pb-16 relative overflow-hidden">
        {/* Apple-style Top Spotlight */}
        <div className="spotlight-top" />
        <div className="ambient-orb top-40 left-10 w-[500px] h-[500px] bg-purple-600/10" />
        <div className="ambient-orb top-96 right-10 w-[500px] h-[500px] bg-blue-600/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Page Header */}
          <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-purple-300 border border-white/10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Agency Journal & Perspectives</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Architecting Brand & Commercial Velocity
            </h1>

            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Actionable insights on high-converting design systems, technical Next.js architecture, viral video psychology, and algorithmic acquisition.
            </p>
          </AnimateOnScroll>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {categories.map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <Link
                  key={cat}
                  href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Featured Post Card */}
          {featuredPost && (
            <AnimateOnScroll variant="scaleUp" duration={0.6} className="mb-16">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-purple-500/40 hover:shadow-card-hover transition-all duration-500 relative"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Visual Image */}
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-agency-surface">
                    <img
                      src={
                        featuredPost.coverMedia?.publicUrl ||
                        featuredPost.coverUrl ||
                        'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop'
                      }
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                          {featuredPost.category}
                        </span>
                        <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured Read
                        </span>
                      </div>

                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>

                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs text-white">
                          {featuredPost.author.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-heading text-xs font-bold text-white block">
                            {featuredPost.author}
                          </span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-2">
                            <span>{featuredPost.readTime}</span>
                          </span>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-white/[0.05] group-hover:bg-purple-600 border border-white/10 group-hover:border-purple-500 flex items-center justify-center transition-all">
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          )}

          {/* Regular Posts Grid */}
          {regularPosts.length > 0 ? (
            <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <StaggerItem key={post.id} variant="fadeUp">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden glass-card border border-white/[0.08] hover:border-purple-500/40 hover:shadow-card-hover transition-all duration-400 h-full flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-agency-surface">
                        <img
                          src={
                            post.coverMedia?.publicUrl ||
                            post.coverUrl ||
                            'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop'
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-transparent to-transparent opacity-80" />

                        <div className="absolute top-3.5 left-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-purple-400" />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Author Footer */}
                    <div className="p-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-gray-300 font-medium truncate">
                        {post.author}
                      </span>
                      <span className="text-xs font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            blogs.length === 0 && (
              <div className="text-center py-20 glass-card rounded-2xl border border-white/10 p-12">
                <BookOpen className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  No Articles in this Category Yet
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Check back soon or explore our complete library across all disciplines.
                </p>
                <Link
                  href="/blog"
                  className="px-6 py-2.5 rounded-full bg-purple-600 text-white text-xs font-semibold"
                >
                  View All Posts
                </Link>
              </div>
            )
          )}
        </div>
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
