import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// GET /api/admin/packages/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const pkg = await prisma.servicePackage.findUnique({
      where: { id },
      include: {
        service: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pkg, package: pkg });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/packages/[id] & PUT /api/admin/packages/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return handleUpdate(request, params.id);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return handleUpdate(request, params.id);
}

async function handleUpdate(request: Request, id: string) {
  try {
    await requireAdmin();
    const body = await request.json();

    const existing = await prisma.servicePackage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    const {
      serviceId,
      name,
      bestFor,
      price,
      originalPrice,
      discount,
      billingType,
      currency,
      deliverables,
      features,
      revisions,
      timeline,
      ctaText,
      ctaLink,
      badge,
      guaranteeText,
      isPopular,
      displayOrder,
      status,
    } = body;

    const targetServiceId = serviceId || existing.serviceId;

    if (isPopular && targetServiceId) {
      await prisma.servicePackage.updateMany({
        where: { serviceId: targetServiceId, id: { not: id } },
        data: { isPopular: false },
      });
    }

    const rawDeliverables = deliverables !== undefined ? deliverables : features;
    const deliverablesStr = rawDeliverables !== undefined
      ? typeof rawDeliverables === 'string'
        ? rawDeliverables
        : JSON.stringify(rawDeliverables)
      : undefined;

    const priceStr = price !== undefined && price !== null
      ? (typeof price === 'string' && price.startsWith('$') ? price : `$${price.toString().replace(/^\$/, '')}`)
      : undefined;

    const origPriceStr = originalPrice !== undefined && originalPrice !== null && originalPrice !== '' && originalPrice !== 0
      ? (typeof originalPrice === 'string' && originalPrice.startsWith('$') ? originalPrice : `$${originalPrice.toString().replace(/^\$/, '')}`)
      : originalPrice === null || originalPrice === '' || originalPrice === 0
      ? null
      : undefined;

    const updated = await prisma.servicePackage.update({
      where: { id },
      data: {
        serviceId: serviceId !== undefined ? serviceId : undefined,
        name: name !== undefined ? name : undefined,
        bestFor: bestFor !== undefined ? bestFor : undefined,
        price: priceStr,
        originalPrice: origPriceStr,
        discount: discount !== undefined ? discount : undefined,
        billingType: billingType !== undefined ? billingType : undefined,
        currency: currency !== undefined ? currency : undefined,
        deliverables: deliverablesStr,
        revisions: revisions !== undefined ? revisions : undefined,
        timeline: timeline !== undefined ? timeline : undefined,
        ctaText: ctaText !== undefined ? ctaText : undefined,
        ctaLink: ctaLink !== undefined ? ctaLink : undefined,
        badge: badge !== undefined ? badge : undefined,
        guaranteeText: guaranteeText !== undefined ? guaranteeText : undefined,
        isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
        status: status !== undefined ? status : undefined,
      },
      include: {
        service: { select: { id: true, name: true, slug: true } },
      },
    });

    try {
      revalidatePath('/');
      revalidatePath('/pricing');
      revalidatePath('/services/[slug]', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Package updated successfully',
      data: updated,
      package: updated,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Package update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update package' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/packages/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const existing = await prisma.servicePackage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    await prisma.servicePackage.delete({
      where: { id },
    });

    try {
      revalidatePath('/');
      revalidatePath('/pricing');
      revalidatePath('/services/[slug]', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete package' },
      { status: 500 }
    );
  }
}
