import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { extractYouTubeId } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

// GET all portfolio projects
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    const where: any = {};
    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    const projects = await prisma.portfolioProject.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
        coverMedia: true,
      },
    });

    const categories = await prisma.portfolioCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, projects, categories });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio projects' }, { status: 500 });
  }
}

// POST create new portfolio project (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      title,
      slug,
      clientName,
      shortDesc,
      fullDesc,
      categoryId,
      categorySlug,
      coverMediaId,
      projectUrl,
      youtubeUrl,
      displayOrder,
      status,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Title and slug are required' }, { status: 400 });
    }

    // Resolve categoryId from categorySlug if provided
    let finalCategoryId = categoryId || null;
    if (!finalCategoryId && categorySlug) {
      const cat = await prisma.portfolioCategory.findUnique({ where: { slug: categorySlug } });
      if (cat) finalCategoryId = cat.id;
    }

    // Extract normalized YouTube ID if link provided
    const cleanYoutubeUrl = youtubeUrl ? youtubeUrl.trim() : null;
    const normalizedYoutubeId = cleanYoutubeUrl ? extractYouTubeId(cleanYoutubeUrl) : null;

    const project = await prisma.portfolioProject.create({
      data: {
        title,
        slug,
        clientName: clientName || null,
        shortDesc: shortDesc || '',
        fullDesc: fullDesc || null,
        categoryId: finalCategoryId,
        coverMediaId: coverMediaId || null,
        projectUrl: projectUrl || null,
        youtubeUrl: cleanYoutubeUrl || null,
        youtubeId: normalizedYoutubeId || null,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
      },
      include: {
        category: true,
        coverMedia: true,
      },
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
      revalidatePath('/portfolio');
    } catch (e) {}

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
