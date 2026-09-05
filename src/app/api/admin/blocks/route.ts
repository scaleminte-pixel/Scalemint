import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const blocks = await prisma.dynamicBlock.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      include: { coverMedia: true },
    });
    return NextResponse.json({ success: true, data: blocks });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { title, subtitle, bodyText, contentSections, coverMediaId, videoUrl, ctaText, ctaLink, category, displayOrder, status } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Block title is required' }, { status: 400 });
    }

    const slug = (body.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const block = await prisma.dynamicBlock.create({
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        bodyText: bodyText || null,
        contentSections: contentSections ? (typeof contentSections === 'string' ? contentSections : JSON.stringify(contentSections)) : null,
        coverMediaId: coverMediaId || null,
        videoUrl: videoUrl || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        category: category || 'general',
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
      },
      include: { coverMedia: true },
    });

    return NextResponse.json({ success: true, message: 'Dynamic block published successfully', data: block });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
