import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    const blogs = await prisma.blogPost.findMany({
      orderBy: [{ displayOrder: 'asc' }, { publishedAt: 'desc' }],
      include: { coverMedia: true },
    });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      authorRole,
      readTime,
      coverUrl,
      coverMediaId,
      displayOrder,
      status,
      seoTitle,
      seoDesc,
    } = body;

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, excerpt, and content are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }

    const blog = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category: category || 'Strategy',
        author: author || 'Scalemint Studio',
        authorRole: authorRole || 'Principal Strategist',
        readTime: readTime || '5 min read',
        coverUrl: coverUrl || null,
        coverMediaId: coverMediaId || null,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        status: status || 'PUBLISHED',
        seoTitle: seoTitle || title,
        seoDesc: seoDesc || excerpt,
        publishedAt: new Date(),
      },
      include: { coverMedia: true },
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
      revalidatePath('/blog');
    } catch (e) {}

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      authorRole,
      readTime,
      coverUrl,
      coverMediaId,
      displayOrder,
      status,
      seoTitle,
      seoDesc,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog ID is required' }, { status: 400 });
    }

    const blog = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(category && { category }),
        ...(author && { author }),
        ...(authorRole !== undefined && { authorRole }),
        ...(readTime !== undefined && { readTime }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(coverMediaId !== undefined && { coverMediaId }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(status && { status }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDesc !== undefined && { seoDesc }),
      },
      include: { coverMedia: true },
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
      revalidatePath('/blog');
    } catch (e) {}

    return NextResponse.json({ success: true, data: blog });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog ID is required' }, { status: 400 });
    }

    await prisma.blogPost.delete({ where: { id } });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
      revalidatePath('/blog');
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete blog post' }, { status: 500 });
  }
}
