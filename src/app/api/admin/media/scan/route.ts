import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Curated seed assets across all website sections & disciplines
const DEFAULT_SYSTEM_IMAGES = [
  // 1. Branding Design 1:1 Logos
  {
    originalFilename: 'brand_seal_zenflow.webp',
    publicUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: 'Minimalist Clean Brand Seal - ZenFlow',
    targetServiceSlug: 'branding-design',
  },
  {
    originalFilename: 'vector_geom_apex.webp',
    publicUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: 'Vector Geometric Branding - Apex',
  },
  {
    originalFilename: 'monogram_emblem_pulse.webp',
    publicUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: 'Monogram Emblem - Pulse',
  },
  {
    originalFilename: 'token_icon_horizon.webp',
    publicUrl: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: '3D Token Icon - Horizon',
  },
  {
    originalFilename: 'tech_mark_novatech.webp',
    publicUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: 'Cybernetic Tech Mark - NovaTech',
  },
  {
    originalFilename: 'enterprise_crest_elevate.webp',
    publicUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: 'Enterprise Identity - Elevate',
  },
  {
    originalFilename: 'luxury_typo_solaris.webp',
    publicUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: 'Modern Luxury Typography Mark - Solaris',
  },
  {
    originalFilename: 'circular_mark_lumina.webp',
    publicUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    category: 'branding',
    altText: 'Abstract Circular Logo - Lumina',
  },

  // 2. Web Design / Flagship Websites
  {
    originalFilename: 'web_apex_fintech.webp',
    publicUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    category: 'websites',
    altText: 'Apex Ventures Next.js 14 Flagship Platform',
    targetServiceSlug: 'website-design',
  },
  {
    originalFilename: 'web_pulse_storefront.webp',
    publicUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    category: 'websites',
    altText: 'Pulse Commerce Headless Storefront',
  },
  {
    originalFilename: 'web_zenflow_app.webp',
    publicUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    category: 'websites',
    altText: 'ZenFlow AI Real-time Analytics Dashboard',
  },
  {
    originalFilename: 'web_horizon_cloud.webp',
    publicUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
    category: 'websites',
    altText: 'Horizon Cloud Infrastructure Portal',
  },

  // 3. Cinematic Video Editing
  {
    originalFilename: 'video_zenflow_anthem.webp',
    publicUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
    category: 'video-editing',
    altText: 'ZenFlow Cinematic Brand Anthem - ProRes 422HQ',
    targetServiceSlug: 'video-editing',
  },
  {
    originalFilename: 'video_solaris_manifesto.webp',
    publicUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    category: 'video-editing',
    altText: 'Solaris Global Manifesto Film',
  },
  {
    originalFilename: 'video_pulse_launch.webp',
    publicUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    category: 'video-editing',
    altText: 'Pulse Hardware Global Keynote Reel',
  },

  // 4. AI UGC Video Editing
  {
    originalFilename: 'ugc_viral_hook_1.webp',
    publicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    category: 'ai-ugc',
    altText: '9:16 Creator Problem-Solution Hook',
    targetServiceSlug: 'ai-ugc-video-editing',
  },
  {
    originalFilename: 'ugc_viral_hook_2.webp',
    publicUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    category: 'ai-ugc',
    altText: 'TikTok Fast-Cut Sound Trend Reel',
  },
  {
    originalFilename: 'ugc_viral_hook_3.webp',
    publicUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    category: 'ai-ugc',
    altText: 'Split-Screen Side-by-Side Comparison UGC',
  },

  // 5. Digital Marketing & Paid Social
  {
    originalFilename: 'meta_ad_creative_apex.webp',
    publicUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop',
    category: 'digital-marketing',
    altText: 'High-Converting Meta Ads Creative - 4.8x ROAS',
    targetServiceSlug: 'digital-marketing',
  },
  {
    originalFilename: 'meta_ad_creative_pulse.webp',
    publicUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop',
    category: 'digital-marketing',
    altText: 'Social Proof Carousel Ad Campaign',
  },

  // 6. Google Ads & PPC Search Engine
  {
    originalFilename: 'google_ads_serp_shield.webp',
    publicUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    category: 'google-ads',
    altText: 'High-Intent Google Ads SERP Engine & Conversion Funnel',
    targetServiceSlug: 'google-ads',
  },

  // 7. Testimonials Client Photos
  {
    originalFilename: 'testimonial_alex_chen.webp',
    publicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    category: 'testimonials',
    altText: 'Alex Chen - VP Product at ZenFlow',
  },
  {
    originalFilename: 'testimonial_marcus_vance.webp',
    publicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    category: 'testimonials',
    altText: 'Marcus Vance - Founder at Apex Ventures',
  },
  {
    originalFilename: 'testimonial_sarah_jenkins.webp',
    publicUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    category: 'testimonials',
    altText: 'Sarah Jenkins - CMO at Pulse Commerce',
  },

  // 8. Client Brand Logos
  {
    originalFilename: 'client_apex_logo.webp',
    publicUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
    category: 'clients',
    altText: 'Apex Ventures Official Logo',
  },
  {
    originalFilename: 'client_zenflow_logo.webp',
    publicUrl: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=300&auto=format&fit=crop',
    category: 'clients',
    altText: 'ZenFlow AI Official Logo',
  },
];

export async function POST(request: Request) {
  try {
    await requireAdmin();

    let registeredCount = 0;
    let linkedCount = 0;

    for (const item of DEFAULT_SYSTEM_IMAGES) {
      // 1. Check if media asset already exists by publicUrl
      let asset = await prisma.mediaAsset.findFirst({
        where: { publicUrl: item.publicUrl },
      });

      if (!asset) {
        asset = await prisma.mediaAsset.create({
          data: {
            filename: item.originalFilename,
            originalFilename: item.originalFilename,
            mimeType: 'image/webp',
            fileSize: 145200, // Estimated WebP size
            width: 1200,
            height: 800,
            storagePath: `/uploads/${item.originalFilename}`,
            publicUrl: item.publicUrl,
            category: item.category,
            altText: item.altText,
          },
        });
        registeredCount++;
      }

      // 2. Link to matching service if designated
      if (item.targetServiceSlug) {
        const service = await prisma.service.findUnique({
          where: { slug: item.targetServiceSlug },
        });
        if (service && !service.coverMediaId) {
          await prisma.service.update({
            where: { id: service.id },
            data: { coverMediaId: asset.id },
          });
          linkedCount++;
        }
      }

      // 3. Link to matching portfolio project if matching category has null coverMediaId
      const unlinkedProject = await prisma.portfolioProject.findFirst({
        where: {
          category: { slug: item.category },
          coverMediaId: null,
        },
      });

      if (unlinkedProject) {
        await prisma.portfolioProject.update({
          where: { id: unlinkedProject.id },
          data: { coverMediaId: asset.id },
        });
        linkedCount++;
      }
    }

    // 4. Also scan any existing testimonials with null photoMediaId
    const unlinkedTestimonial = await prisma.testimonial.findFirst({
      where: { photoMediaId: null },
    });
    if (unlinkedTestimonial) {
      const photoAsset = await prisma.mediaAsset.findFirst({
        where: { category: 'testimonials' },
      });
      if (photoAsset) {
        await prisma.testimonial.updateMany({
          where: { photoMediaId: null },
          data: { photoMediaId: photoAsset.id },
        });
        linkedCount++;
      }
    }

    // 5. Also link clients with null logoMediaId
    const logoAsset = await prisma.mediaAsset.findFirst({
      where: { category: 'clients' },
    });
    if (logoAsset) {
      await prisma.clientBrand.updateMany({
        where: { logoMediaId: null },
        data: { logoMediaId: logoAsset.id },
      });
      linkedCount++;
    }

    const totalMediaCount = await prisma.mediaAsset.count();

    return NextResponse.json({
      success: true,
      message: `Scan complete: ${registeredCount} new media assets registered, ${linkedCount} relationships linked. Total media assets: ${totalMediaCount}`,
      data: {
        newlyRegistered: registeredCount,
        linkedRelationships: linkedCount,
        totalAssets: totalMediaCount,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Media scan error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Media scan failed' }, { status: 500 });
  }
}
