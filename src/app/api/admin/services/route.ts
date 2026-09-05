import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        coverMedia: true,
        packages: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, slug, shortDesc, fullDesc, tagline, iconName, startingPrice, displayOrder, status, coverMediaId, whatIsIncluded, benefits } = body;

    if (!name || !slug || !shortDesc) {
      return NextResponse.json({ success: false, error: 'Name, slug, and short description are required' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        tagline: tagline || null,
        shortDesc,
        fullDesc: fullDesc || null,
        iconName: iconName || 'sparkles',
        startingPrice: startingPrice || null,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
        coverMediaId: coverMediaId || null,
        whatIsIncluded: whatIsIncluded ? (typeof whatIsIncluded === 'string' ? whatIsIncluded : JSON.stringify(whatIsIncluded)) : null,
        benefits: benefits ? (typeof benefits === 'string' ? benefits : JSON.stringify(benefits)) : null,
      },
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create service error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}
