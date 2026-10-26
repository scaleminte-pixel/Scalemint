import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    const where: any = {};
    if (serviceId && serviceId !== 'all') {
      where.serviceId = serviceId;
    }

    const packages = await prisma.servicePackage.findMany({
      where,
      orderBy: [{ serviceId: 'asc' }, { displayOrder: 'asc' }],
      include: {
        service: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    });

    return NextResponse.json({ success: true, data: packages, packages, services });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching packages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
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

    if (!serviceId || !name || !price) {
      return NextResponse.json({ success: false, error: 'Service, Package Name, and Price are required' }, { status: 400 });
    }

    if (isPopular) {
      await prisma.servicePackage.updateMany({
        where: { serviceId },
        data: { isPopular: false },
      });
    }

    const rawDeliverables = deliverables || body.features;
    const deliverablesStr = rawDeliverables
      ? typeof rawDeliverables === 'string'
        ? rawDeliverables
        : JSON.stringify(rawDeliverables)
      : null;

    const priceStr = price !== undefined && price !== null ? price.toString() : '';
    const origPriceStr = originalPrice !== undefined && originalPrice !== null && originalPrice !== ''
      ? originalPrice.toString()
      : null;

    const pkg = await prisma.servicePackage.create({
      data: {
        serviceId,
        name,
        bestFor: bestFor || null,
        price: priceStr,
        originalPrice: origPriceStr,
        discount: discount || null,
        billingType: billingType || 'ONE_TIME',
        currency: currency || 'USD',
        deliverables: deliverablesStr,
        revisions: revisions || null,
        timeline: timeline || null,
        ctaText: ctaText || 'Get Started',
        ctaLink: ctaLink || '#contact',
        badge: badge || null,
        guaranteeText: guaranteeText || null,
        isPopular: Boolean(isPopular),
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
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

    return NextResponse.json({ success: true, message: 'Package created successfully', data: pkg });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to create package' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      id,
      serviceId,
      name,
      bestFor,
      price,
      originalPrice,
      discount,
      billingType,
      currency,
      deliverables,
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

    if (!id) {
      return NextResponse.json({ success: false, error: 'Package ID is required' }, { status: 400 });
    }

    if (isPopular && serviceId) {
      await prisma.servicePackage.updateMany({
        where: { serviceId, id: { not: id } },
        data: { isPopular: false },
      });
    }

    const rawDeliverables = deliverables !== undefined ? deliverables : body.features;
    const deliverablesStr = rawDeliverables !== undefined
      ? typeof rawDeliverables === 'string'
        ? rawDeliverables
        : JSON.stringify(rawDeliverables)
      : undefined;

    const updated = await prisma.servicePackage.update({
      where: { id },
      data: {
        serviceId: serviceId !== undefined ? serviceId : undefined,
        name: name !== undefined ? name : undefined,
        bestFor: bestFor !== undefined ? bestFor : undefined,
        price: price !== undefined ? price.toString() : undefined,
        originalPrice: originalPrice !== undefined && originalPrice !== null && originalPrice !== '' ? originalPrice.toString() : undefined,
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

    return NextResponse.json({ success: true, message: 'Package updated successfully', data: updated });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Package ID is required' }, { status: 400 });
    }

    await prisma.servicePackage.delete({
      where: { id },
    });

    try {
      revalidatePath('/');
      revalidatePath('/pricing');
      revalidatePath('/services/[slug]', 'page');
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete package' }, { status: 500 });
  }
}
