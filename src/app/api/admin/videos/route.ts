import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { extractYouTubeId } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const videos = await prisma.youTubeVideo.findMany({
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json({ success: true, data: videos });
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
    const { title, youtubeUrl, description, category, isFeatured, displayOrder, status } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json({ success: false, error: 'Title and YouTube URL are required' }, { status: 400 });
    }

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json(
        { success: false, error: 'Invalid YouTube URL. Please provide a valid YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)' },
        { status: 400 }
      );
    }

    const video = await prisma.youTubeVideo.create({
      data: {
        title,
        youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
        youtubeId,
        description: description || null,
        category: category || 'general',
        isFeatured: Boolean(isFeatured),
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
      },
    });

    return NextResponse.json({ success: true, message: 'YouTube video added successfully', data: video });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
