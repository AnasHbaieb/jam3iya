import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pageName = formData.get('pageName') as string;
    const pdfFile = formData.get('pdfFile') as File | null;

    if (!pageName) {
      return NextResponse.json({ error: 'اسم الصفحة مطلوب' }, { status: 400 });
    }

    let fileUrl = '';
    const uploadsDir = join(process.cwd(), 'public', 'uploads');

    // Fetch existing content to potentially delete old PDF
    const existingPageContent = await prisma.pageContent.findUnique({
      where: { pageName },
    });

    if (pdfFile) {
      if (pdfFile.size === 0) {
        return NextResponse.json({ error: 'ملف PDF فارغ' }, { status: 400 });
      }

      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const filename = `${timestamp}-${pdfFile.name.replace(/\s/g, '_')}`;
      const path = join(uploadsDir, filename);
      fileUrl = `/uploads/${filename}`;

      await writeFile(path, buffer);

      // Delete old PDF if it exists and is different from the new one
      if (existingPageContent?.content && existingPageContent.content !== fileUrl) {
        const oldFilePath = join(process.cwd(), 'public', existingPageContent.content);
        try {
          await unlink(oldFilePath);
        } catch (unlinkError) {
          console.error('خطأ في حذف الملف القديم:', unlinkError);
        }
      }
    } else if (!existingPageContent) {
      return NextResponse.json({ error: 'ملف PDF مطلوب للصفحة الجديدة' }, { status: 400 });
    } else {
      // If no new PDF is provided, keep the existing one
      fileUrl = existingPageContent.content;
    }

    let pageContent;
    if (existingPageContent) {
      pageContent = await prisma.pageContent.update({
        where: { pageName },
        data: { content: fileUrl },
      });
    } else {
      pageContent = await prisma.pageContent.create({
        data: { pageName, content: fileUrl },
      });
    }

    return NextResponse.json(pageContent, { status: 200 });
  } catch (error) {
    console.error('خطأ في حفظ محتوى الصفحة:', error);
    return NextResponse.json(
      { error: 'فشل حفظ محتوى الصفحة' },
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
    console.error('خطأ في جلب محتوى الصفحة:', error);
    return NextResponse.json(
      { error: 'فشل جلب محتوى الصفحة' },
      { status: 500 }
    );
  }
} 