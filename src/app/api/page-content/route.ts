import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { pageName, content } = await request.json();

    if (!pageName || !content) {
      return NextResponse.json({ error: 'Page name and content are required' }, { status: 400 });
    }

    const existingPageContent = await prisma.pageContent.findUnique({
      where: { pageName },
    });

    let pageContent;
    if (existingPageContent) {
      pageContent = await prisma.pageContent.update({
        where: { pageName },
        data: { content },
      });
    } else {
      pageContent = await prisma.pageContent.create({
        data: { pageName, content },
      });
    }

    return NextResponse.json(pageContent, { status: 200 });
  } catch (error) {
    console.error('Error saving page content:', error);
    return NextResponse.json(
      { error: 'Failed to save page content' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get('pageName');

    if (!pageName) {
      return NextResponse.json({ error: 'Page name is required' }, { status: 400 });
    }

    const pageContent = await prisma.pageContent.findUnique({
      where: { pageName },
    });

    if (!pageContent) {
      return NextResponse.json({ error: 'Page content not found' }, { status: 404 });
    }

    return NextResponse.json(pageContent, { status: 200 });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    );
  }
} 