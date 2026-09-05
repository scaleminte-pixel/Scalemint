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
    await requireAdmin();
    const { id } = params;
    const video = await prisma.youTubeVideo.findUnique({ where: { id } });
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: video });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
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
    if (body.description !== undefined) data.description = body.description;
    if (body.category !== undefined) data.category = body.category;
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
    if (body.status !== undefined) data.status = body.status;
    if (body.displayOrder !== undefined) data.displayOrder = parseInt(body.displayOrder);

    if (body.youtubeUrl) {
      const youtubeId = extractYouTubeId(body.youtubeUrl);
      if (!youtubeId) {
        return NextResponse.json({ success: false, error: 'Invalid YouTube URL' }, { status: 400 });
      }
      data.youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
      data.youtubeId = youtubeId;
    }

    const updated = await prisma.youTubeVideo.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, message: 'Video updated successfully', data: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    await prisma.youTubeVideo.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
