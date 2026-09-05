import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    let config = await prisma.calculatorConfig.findUnique({
      where: { id: 'global_calculator' },
    });

    if (!config) {
      config = await prisma.calculatorConfig.create({
        data: { id: 'global_calculator' },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        tierPresets: config.tierPresets ? JSON.parse(config.tierPresets) : [],
        addOnOptions: config.addOnOptions ? JSON.parse(config.addOnOptions) : [],
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { basePrice, currency, tierPresets, addOnOptions, minPrice, maxPrice, ctaText, ctaLink, isVisible } = body;

    const updated = await prisma.calculatorConfig.upsert({
      where: { id: 'global_calculator' },
      update: {
        basePrice: basePrice !== undefined ? parseFloat(basePrice) : undefined,
        currency: currency !== undefined ? currency : undefined,
        tierPresets: tierPresets !== undefined ? (typeof tierPresets === 'string' ? tierPresets : JSON.stringify(tierPresets)) : undefined,
        addOnOptions: addOnOptions !== undefined ? (typeof addOnOptions === 'string' ? addOnOptions : JSON.stringify(addOnOptions)) : undefined,
        minPrice: minPrice !== undefined ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
        ctaText: ctaText !== undefined ? ctaText : undefined,
        ctaLink: ctaLink !== undefined ? ctaLink : undefined,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
      },
      create: {
        id: 'global_calculator',
        basePrice: basePrice !== undefined ? parseFloat(basePrice) : 1490,
        currency: currency || 'USD',
        tierPresets: typeof tierPresets === 'string' ? tierPresets : JSON.stringify(tierPresets || []),
        addOnOptions: typeof addOnOptions === 'string' ? addOnOptions : JSON.stringify(addOnOptions || []),
        minPrice: minPrice !== undefined ? parseFloat(minPrice) : 490,
        maxPrice: maxPrice !== undefined ? parseFloat(maxPrice) : 25000,
        ctaText: ctaText || 'Lock In Scope & Book Strategy Call',
        ctaLink: ctaLink || '#contact',
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Calculator pricing configuration updated successfully',
      data: {
        ...updated,
        tierPresets: updated.tierPresets ? JSON.parse(updated.tierPresets) : [],
        addOnOptions: updated.addOnOptions ? JSON.parse(updated.addOnOptions) : [],
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
