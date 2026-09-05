import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ displayOrder: 'asc' }, { publishedAt: 'desc' }],
      include: { coverMedia: true },
    });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
