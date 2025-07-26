import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { pageName, content } = await request.json();

    if (!pageName || content === undefined) {
      return NextResponse.json({ error: 'اسم الصفحة والمحتوى مطلوبان' }, { status: 400 });
    }

    let pageContent;
    const existingPageContent = await prisma.pageContent.findUnique({
      where: { pageName },
    });

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
    console.error('خطأ في حفظ محتوى النص الغني:', error);
    return NextResponse.json(
      { error: 'فشل حفظ محتوى النص الغني' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get('pageName');

    if (!pageName) {
      return NextResponse.json({ error: 'اسم الصفحة مطلوب' }, { status: 400 });
    }

    const pageContent = await prisma.pageContent.findUnique({
      where: { pageName },
    });

    if (!pageContent) {
      return NextResponse.json({ error: 'لم يتم العثور على محتوى الصفحة' }, { status: 404 });
    }

    return NextResponse.json(pageContent, { status: 200 });
  } catch (error) {
    console.error('خطأ في جلب محتوى النص الغني:', error);
    return NextResponse.json(
      { error: 'فشل جلب محتوى النص الغني' },
      { status: 500 }
    );
  }
} 