import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: { coverMedia: true },
    });

    if (!blog || blog.status !== 'PUBLISHED') {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 });
  }
}
