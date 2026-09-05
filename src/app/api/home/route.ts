import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [settings, sections, services, faqs, testimonials, clientBrands] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 'global' } }),
      prisma.pageSection.findMany({
        where: { page: 'home', isPublished: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { displayOrder: 'asc' },
        include: {
          coverMedia: true,
          packages: {
            where: { status: 'PUBLISHED' },
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      prisma.faq.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.testimonial.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { displayOrder: 'asc' },
        include: { photoMedia: true },
      }),
      prisma.clientBrand.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { displayOrder: 'asc' },
        include: { logoMedia: true },
      }),
    ]);

    // Format sections into a convenient map by sectionKey
    const sectionsMap: Record<string, any> = {};
    for (const sec of sections) {
      sectionsMap[sec.sectionKey] = {
        ...sec,
        metadata: sec.metadata ? JSON.parse(sec.metadata) : null,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        settings,
        sections: sectionsMap,
        services,
        faqs,
        testimonials,
        clientBrands,
      },
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage data' },
      { status: 500 }
    );
  }
}
