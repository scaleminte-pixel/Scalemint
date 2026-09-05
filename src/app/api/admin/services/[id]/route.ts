import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        tagline: body.tagline,
        shortDesc: body.shortDesc,
        fullDesc: body.fullDesc,
        iconName: body.iconName,
        startingPrice: body.startingPrice,
        displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder) : undefined,
        status: body.status,
        coverMediaId: body.coverMediaId,
        whatIsIncluded: body.whatIsIncluded ? (typeof body.whatIsIncluded === 'string' ? body.whatIsIncluded : JSON.stringify(body.whatIsIncluded)) : null,
        benefits: body.benefits ? (typeof body.benefits === 'string' ? body.benefits : JSON.stringify(body.benefits)) : null,
      },
      include: {
        coverMedia: true,
        packages: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update service error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
