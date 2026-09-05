import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;
    const block = await prisma.dynamicBlock.findUnique({
      where: { id },
      include: { coverMedia: true },
    });
    if (!block) {
      return NextResponse.json({ success: false, error: 'Block not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: block });
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
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.subtitle !== undefined) data.subtitle = body.subtitle;
    if (body.bodyText !== undefined) data.bodyText = body.bodyText;
    if (body.contentSections !== undefined) {
      data.contentSections = typeof body.contentSections === 'string' ? body.contentSections : JSON.stringify(body.contentSections);
    }
    if (body.coverMediaId !== undefined) data.coverMediaId = body.coverMediaId;
    if (body.videoUrl !== undefined) data.videoUrl = body.videoUrl;
    if (body.ctaText !== undefined) data.ctaText = body.ctaText;
    if (body.ctaLink !== undefined) data.ctaLink = body.ctaLink;
    if (body.category !== undefined) data.category = body.category;
    if (body.status !== undefined) data.status = body.status;
    if (body.displayOrder !== undefined) data.displayOrder = parseInt(body.displayOrder);

    const updated = await prisma.dynamicBlock.update({
      where: { id },
      data,
      include: { coverMedia: true },
    });

    return NextResponse.json({ success: true, message: 'Block updated successfully', data: updated });
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
    await prisma.dynamicBlock.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Block deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
