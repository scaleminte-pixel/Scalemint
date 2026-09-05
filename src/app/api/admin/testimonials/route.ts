import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { photoMedia: true },
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      clientName,
      clientRole,
      companyName,
      quote,
      rating,
      photoMediaId,
      displayOrder,
      status,
    } = body;

    if (!clientName || !quote) {
      return NextResponse.json(
        { success: false, error: 'Client name and quote are required' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        clientRole: clientRole || null,
        companyName: companyName || null,
        quote,
        rating: rating ? parseInt(rating) : 5,
        photoMediaId: photoMediaId || null,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
      },
      include: { photoMedia: true },
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch (e) {}

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create testimonial error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      id,
      clientName,
      clientRole,
      companyName,
      quote,
      rating,
      photoMediaId,
      displayOrder,
      status,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Testimonial ID is required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(clientName && { clientName }),
        ...(clientRole !== undefined && { clientRole }),
        ...(companyName !== undefined && { companyName }),
        ...(quote && { quote }),
        ...(rating !== undefined && { rating: parseInt(rating) }),
        ...(photoMediaId !== undefined && { photoMediaId }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(status && { status }),
      },
      include: { photoMedia: true },
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch (e) {}

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update testimonial error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Testimonial ID is required' }, { status: 400 });
    }

    await prisma.testimonial.delete({ where: { id } });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
