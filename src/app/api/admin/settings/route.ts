import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 'global' },
      });
    }

    let logoMedia = null;
    let faviconMedia = null;

    if (settings.logoMediaId) {
      logoMedia = await prisma.mediaAsset.findUnique({ where: { id: settings.logoMediaId } });
    }
    if (settings.faviconMediaId) {
      faviconMedia = await prisma.mediaAsset.findUnique({ where: { id: settings.faviconMediaId } });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        logoMedia,
        faviconMedia,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();

    let resolvedLogoUrl = body.logoUrl;
    if (body.logoMediaId) {
      const media = await prisma.mediaAsset.findUnique({ where: { id: body.logoMediaId } });
      if (media) resolvedLogoUrl = media.publicUrl;
    }
    let resolvedFaviconUrl = body.faviconUrl;
    if (body.faviconMediaId) {
      const favMedia = await prisma.mediaAsset.findUnique({ where: { id: body.faviconMediaId } });
      if (favMedia) resolvedFaviconUrl = favMedia.publicUrl;
    }

    const updated = await prisma.siteSettings.upsert({
      where: { id: 'global' },
      update: {
        siteName: body.siteName !== undefined ? body.siteName : undefined,
        tagline: body.tagline !== undefined ? body.tagline : undefined,
        logoMediaId: body.logoMediaId !== undefined ? body.logoMediaId : undefined,
        logoUrl: resolvedLogoUrl !== undefined ? resolvedLogoUrl : undefined,
        faviconMediaId: body.faviconMediaId !== undefined ? body.faviconMediaId : undefined,
        faviconUrl: resolvedFaviconUrl !== undefined ? resolvedFaviconUrl : undefined,
        contactEmail: body.contactEmail !== undefined ? body.contactEmail : undefined,
        contactPhone: body.contactPhone !== undefined ? body.contactPhone : undefined,
        whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : undefined,
        address: body.address !== undefined ? body.address : undefined,
        socialLinks: body.socialLinks ? (typeof body.socialLinks === 'string' ? body.socialLinks : JSON.stringify(body.socialLinks)) : undefined,
        footerText: body.footerText !== undefined ? body.footerText : undefined,
        defaultSeoTitle: body.defaultSeoTitle !== undefined ? body.defaultSeoTitle : undefined,
        defaultSeoDesc: body.defaultSeoDesc !== undefined ? body.defaultSeoDesc : undefined,
        googleAnalyticsId: body.googleAnalyticsId !== undefined ? body.googleAnalyticsId : undefined,
        metaPixelId: body.metaPixelId !== undefined ? body.metaPixelId : undefined,
        customHeadCode: body.customHeadCode !== undefined ? body.customHeadCode : undefined,
      },
      create: {
        id: 'global',
        siteName: body.siteName || 'Scalemint',
        tagline: body.tagline || '360° Creative & Digital Growth Partner',
        contactEmail: body.contactEmail || 'hello@scalemint.com',
        logoMediaId: body.logoMediaId || null,
        logoUrl: resolvedLogoUrl || null,
        faviconMediaId: body.faviconMediaId || null,
        faviconUrl: resolvedFaviconUrl || null,
        socialLinks: body.socialLinks ? (typeof body.socialLinks === 'string' ? body.socialLinks : JSON.stringify(body.socialLinks)) : undefined,
      },
    });

    const { revalidatePath } = await import('next/cache');
    try {
      revalidatePath('/', 'layout');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Global settings saved successfully',
      data: updated,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Settings update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
