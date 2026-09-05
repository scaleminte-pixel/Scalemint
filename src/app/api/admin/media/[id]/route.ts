import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { safelyDeleteMediaAsset } from '@/lib/media';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const deleted = await safelyDeleteMediaAsset(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Media asset not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Media asset and all references safely removed',
      data: deleted,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Media delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media asset' }, { status: 500 });
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

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        altText: body.altText !== undefined ? body.altText : undefined,
        category: body.category !== undefined ? body.category : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update media asset' }, { status: 500 });
  }
}
