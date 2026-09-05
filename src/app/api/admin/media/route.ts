import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { processAndSaveImage } from '@/lib/media';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { originalFilename: { contains: search } },
        { altText: { contains: search } },
      ];
    }

    const assets = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            servicesAsCover: true,
            portfolioAsCover: true,
            testimonialsAsPhoto: true,
            clientBrandsAsLogo: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Media fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch media assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate mime type & extension
    const validMimes = [
      'image/jpeg',
      'image/jpg',
      'image/pjpeg',
      'image/png',
      'image/x-png',
      'image/webp',
      'image/svg+xml',
      'image/svg',
      'image/gif',
      'image/avif',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/bmp',
    ];
    const hasValidExt = /\.(jpe?g|png|webp|svg|gif|avif|ico|bmp)$/i.test(file.name);
    const hasValidMime = validMimes.includes(file.type?.toLowerCase()) || (file.type?.startsWith('image/') && !file.type.includes('tiff'));

    if (!hasValidMime && !hasValidExt) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Please upload a JPEG, PNG, WebP, SVG, AVIF, or ICO image.' },
        { status: 400 }
      );
    }

    // Max 25MB limit for high-res creative assets
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 25MB limit' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await processAndSaveImage(buffer, file.name, category);

    return NextResponse.json({
      success: true,
      message: 'Media uploaded and optimized successfully',
      data: asset,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Media upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload media' }, { status: 500 });
  }
}
