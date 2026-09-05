import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { extractYouTubeId } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        category: true,
        coverMedia: true,
        gallery: {
          include: { media: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const body = await request.json();

    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.clientName !== undefined) data.clientName = body.clientName;
    if (body.shortDesc !== undefined) data.shortDesc = body.shortDesc;
    if (body.fullDesc !== undefined) data.fullDesc = body.fullDesc;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.coverMediaId !== undefined) data.coverMediaId = body.coverMediaId;
    if (body.projectUrl !== undefined) data.projectUrl = body.projectUrl;
    if (body.youtubeUrl !== undefined) {
      const cleanYoutubeUrl = body.youtubeUrl ? body.youtubeUrl.trim() : null;
      data.youtubeUrl = cleanYoutubeUrl;
      data.youtubeId = cleanYoutubeUrl ? extractYouTubeId(cleanYoutubeUrl) : null;
    }
    if (body.status !== undefined) data.status = body.status;
    if (body.displayOrder !== undefined) data.displayOrder = parseInt(body.displayOrder);

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data,
      include: {
        category: true,
        coverMedia: true,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Portfolio update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    await prisma.portfolioProject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Portfolio delete error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete project' }, { status: 500 });
  }
}
