import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { id } = params;

    const source = await prisma.servicePackage.findUnique({
      where: { id },
    });

    if (!source) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    const cloned = await prisma.servicePackage.create({
      data: {
        serviceId: source.serviceId,
        name: `${source.name} (Copy)`,
        bestFor: source.bestFor,
        price: source.price,
        originalPrice: source.originalPrice,
        discount: source.discount,
        billingType: source.billingType,
        currency: source.currency,
        deliverables: source.deliverables,
        revisions: source.revisions,
        timeline: source.timeline,
        ctaText: source.ctaText,
        ctaLink: source.ctaLink,
        badge: source.badge,
        guaranteeText: source.guaranteeText,
        isPopular: false, // cloned packages start as regular
        displayOrder: source.displayOrder + 1,
        status: 'DRAFT', // cloned packages start in Draft mode
      },
      include: {
        service: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Package duplicated as "${cloned.name}" in Draft mode`,
      data: cloned,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
