import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const clients = await prisma.clientBrand.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { logoMedia: true },
    });
    return NextResponse.json({ success: true, data: clients });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch client brands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, websiteUrl, logoMediaId, displayOrder, status } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Brand name is required' }, { status: 400 });
    }

    const client = await prisma.clientBrand.create({
      data: {
        name,
        websiteUrl: websiteUrl || null,
        logoMediaId: logoMediaId || null,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
      },
      include: { logoMedia: true },
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch (e) {}

    return NextResponse.json({ success: true, data: client });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create client brand error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create client brand' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, name, websiteUrl, logoMediaId, displayOrder, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Client Brand ID is required' }, { status: 400 });
    }

    const client = await prisma.clientBrand.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(logoMediaId !== undefined && { logoMediaId }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(status && { status }),
      },
      include: { logoMedia: true },
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch (e) {}

    return NextResponse.json({ success: true, data: client });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update client brand error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update client brand' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Client Brand ID is required' }, { status: 400 });
    }

    await prisma.clientBrand.delete({ where: { id } });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete client brand' }, { status: 500 });
  }
}
