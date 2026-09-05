import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        coverMedia: true,
        packages: {
          where: { status: 'PUBLISHED' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    const parsed = {
      ...service,
      whatIsIncluded: service.whatIsIncluded ? JSON.parse(service.whatIsIncluded) : [],
      benefits: service.benefits ? JSON.parse(service.benefits) : [],
      packages: service.packages.map((pkg) => ({
        ...pkg,
        deliverables: pkg.deliverables ? JSON.parse(pkg.deliverables) : [],
      })),
    };

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
