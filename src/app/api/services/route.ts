import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { safeJsonParse } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: {
        coverMedia: true,
        packages: {
          where: { status: 'PUBLISHED' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    const parsed = services.map((s) => ({
      ...s,
      whatIsIncluded: safeJsonParse(s.whatIsIncluded, []),
      benefits: safeJsonParse(s.benefits, []),
    }));

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
