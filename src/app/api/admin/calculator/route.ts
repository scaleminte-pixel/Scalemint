import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { safeParseFloat, safeJsonParse } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const serviceSlug = searchParams.get('service') || 'global';
    const configId = serviceSlug === 'global' ? 'global_calculator' : `calc_${serviceSlug}`;

    let config = await prisma.calculatorConfig.findUnique({
      where: { id: configId },
    });

    // If not found and not global, fall back to global as template
    if (!config && configId !== 'global_calculator') {
      config = await prisma.calculatorConfig.findUnique({
        where: { id: 'global_calculator' },
      });
    }

    if (!config) {
      config = await prisma.calculatorConfig.create({
        data: { id: configId },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        tierPresets: safeJsonParse<any[]>(config.tierPresets, []),
        addOnOptions: safeJsonParse<any[]>(config.addOnOptions, []),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching calculator config:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch calculator config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      serviceSlug = 'global',
      basePrice,
      currency,
      tierPresets,
      addOnOptions,
      minPrice,
      maxPrice,
      ctaText,
      ctaLink,
      isVisible,
    } = body;

    const configId = serviceSlug === 'global' ? 'global_calculator' : `calc_${serviceSlug}`;

    const updated = await prisma.calculatorConfig.upsert({
      where: { id: configId },
      update: {
        basePrice: basePrice !== undefined ? safeParseFloat(basePrice, 1490) : undefined,
        currency: currency !== undefined ? currency : undefined,
        tierPresets:
          tierPresets !== undefined
            ? typeof tierPresets === 'string'
              ? tierPresets
              : JSON.stringify(tierPresets)
            : undefined,
        addOnOptions:
          addOnOptions !== undefined
            ? typeof addOnOptions === 'string'
              ? addOnOptions
              : JSON.stringify(addOnOptions)
            : undefined,
        minPrice: minPrice !== undefined ? safeParseFloat(minPrice, 490) : undefined,
        maxPrice: maxPrice !== undefined ? safeParseFloat(maxPrice, 25000) : undefined,
        ctaText: ctaText !== undefined ? ctaText : undefined,
        ctaLink: ctaLink !== undefined ? ctaLink : undefined,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
      },
      create: {
        id: configId,
        basePrice: basePrice !== undefined ? safeParseFloat(basePrice, 1490) : 1490,
        currency: currency || 'USD',
        tierPresets: typeof tierPresets === 'string' ? tierPresets : JSON.stringify(tierPresets || []),
        addOnOptions: typeof addOnOptions === 'string' ? addOnOptions : JSON.stringify(addOnOptions || []),
        minPrice: minPrice !== undefined ? safeParseFloat(minPrice, 490) : 490,
        maxPrice: maxPrice !== undefined ? safeParseFloat(maxPrice, 25000) : 25000,
        ctaText: ctaText || 'Lock In Scope & Book Strategy Call',
        ctaLink: ctaLink || '#contact',
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      },
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/services/[slug]', 'page');
      if (serviceSlug !== 'global') {
        revalidatePath(`/services/${serviceSlug}`, 'page');
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Calculator pricing configuration for "${serviceSlug}" updated successfully!`,
      data: {
        ...updated,
        tierPresets: safeJsonParse<any[]>(updated.tierPresets, []),
        addOnOptions: safeJsonParse<any[]>(updated.addOnOptions, []),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error saving calculator config:', error);
    return NextResponse.json({ success: false, error: 'Failed to update calculator config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return PUT(request);
}
