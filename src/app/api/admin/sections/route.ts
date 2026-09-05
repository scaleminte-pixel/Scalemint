import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const sections = await prisma.pageSection.findMany({
      orderBy: [{ page: 'asc' }, { displayOrder: 'asc' }],
    });
    return NextResponse.json({ success: true, data: sections });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { page, sectionKey, title, subtitle, content, mediaId, ctaText, ctaLink, ctaSecondaryText, ctaSecondaryLink, metadata, isPublished, displayOrder } = body;

    if (!page || !sectionKey) {
      return NextResponse.json({ success: false, error: 'Page and sectionKey are required' }, { status: 400 });
    }

    const updated = await prisma.pageSection.upsert({
      where: {
        page_sectionKey: { page, sectionKey },
      },
      update: {
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        content: content !== undefined ? content : undefined,
        mediaId: mediaId !== undefined ? mediaId : undefined,
        ctaText: ctaText !== undefined ? ctaText : undefined,
        ctaLink: ctaLink !== undefined ? ctaLink : undefined,
        ctaSecondaryText: ctaSecondaryText !== undefined ? ctaSecondaryText : undefined,
        ctaSecondaryLink: ctaSecondaryLink !== undefined ? ctaSecondaryLink : undefined,
        metadata: metadata !== undefined ? (typeof metadata === 'object' ? JSON.stringify(metadata) : metadata) : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        displayOrder: displayOrder !== undefined ? displayOrder : undefined,
      },
      create: {
        page,
        sectionKey,
        title,
        subtitle,
        content,
        mediaId,
        ctaText,
        ctaLink,
        ctaSecondaryText,
        ctaSecondaryLink,
        metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
        isPublished: isPublished ?? true,
        displayOrder: displayOrder ?? 0,
      },
    });

    // Purge cached public homepage to reflect CMS update immediately
    revalidatePath('/', 'page');

    return NextResponse.json({
      success: true,
      message: `Section ${sectionKey} updated successfully`,
      data: updated,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Section update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update section' }, { status: 500 });
  }
}
