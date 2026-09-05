import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const pages = await prisma.legalPage.findMany({
      orderBy: { slug: 'asc' },
    });

    const parsedPages = pages.map((p) => ({
      ...p,
      sections: p.sections ? JSON.parse(p.sections) : [],
    }));

    return NextResponse.json({ success: true, data: parsedPages });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { slug, title, summary, content, sections, status } = body;

    if (!slug || !title) {
      return NextResponse.json({ success: false, error: 'Slug and title are required' }, { status: 400 });
    }

    const page = await prisma.legalPage.upsert({
      where: { slug },
      update: {
        title,
        summary: summary || null,
        content: content || null,
        sections: sections ? (typeof sections === 'string' ? sections : JSON.stringify(sections)) : undefined,
        status: status || 'PUBLISHED',
        lastUpdated: new Date(),
      },
      create: {
        slug,
        title,
        summary: summary || null,
        content: content || null,
        sections: sections ? (typeof sections === 'string' ? sections : JSON.stringify(sections)) : null,
        status: status || 'PUBLISHED',
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Legal page "${slug}" updated successfully`,
      data: {
        ...page,
        sections: page.sections ? JSON.parse(page.sections) : [],
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
