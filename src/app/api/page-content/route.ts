import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { join } from 'path';
import { unlink, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

const uploadDir = join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageName = searchParams.get('pageName');

  if (!pageName) {
    return NextResponse.json({ message: 'اسم الصفحة مطلوب' }, { status: 400 });
  }

  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { pageName: pageName },
      include: {
        documents: true, // تضمين المستندات المرتبطة
      },
    });

    if (!pageContent) {
      return NextResponse.json({ documents: [], message: 'لم يتم العثور على محتوى لهذه الصفحة.' }, { status: 200 });
    }

    return NextResponse.json(pageContent);
  } catch (error) {
    console.error('خطأ في جلب المحتوى:', error);
    return NextResponse.json({ message: 'فشل جلب المحتوى.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pageName = formData.get('pageName') as string;
    const pdfFile = formData.get('pdfFile') as File;
    const title = formData.get('title') as string;

    if (!pageName || !pdfFile || !title) {
      return NextResponse.json({ message: 'اسم الصفحة وملف PDF والعنوان مطلوبون.' }, { status: 400 });
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `${Date.now()}-${pdfFile.name}`;
    const filePath = join(uploadDir, filename);
    const fileUrl = `/uploads/${filename}`;

    await writeFile(filePath, buffer);

    // Find or create the PageContent entry
    let pageContent = await prisma.pageContent.findUnique({
      where: { pageName: pageName },
    });

    if (!pageContent) {
      pageContent = await prisma.pageContent.create({
        data: {
          pageName: pageName,
        },
      });
    }

    // Create a new PageDocument entry linked to the PageContent
    const newDocument = await prisma.pageDocument.create({
      data: {
        title: title,
        url: fileUrl,
        pageContent: {
          connect: {
            id: pageContent.id,
          },
        },
      },
    });

    return NextResponse.json({ message: 'تم حفظ المستند بنجاح!', document: newDocument }, { status: 201 });
  } catch (error) {
    console.error('خطأ في حفظ المستند:', error);
    return NextResponse.json({ message: 'فشل حفظ المستند.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return NextResponse.json({ message: 'معرف المستند مطلوب.' }, { status: 400 });
  }

  try {
    const docToDelete = await prisma.pageDocument.findUnique({
      where: { id: parseInt(documentId) },
    });

    if (!docToDelete) {
      return NextResponse.json({ message: 'المستند غير موجود.' }, { status: 404 });
    }

    // Delete the file from the filesystem
    const filePath = join(process.cwd(), 'public', docToDelete.url);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete the document from the database
    await prisma.pageDocument.delete({
      where: { id: parseInt(documentId) },
    });

    return NextResponse.json({ message: 'تم حذف المستند بنجاح!' }, { status: 200 });
  } catch (error) {
    console.error('خطأ في حذف المستند:', error);
    return NextResponse.json({ message: 'فشل حذف المستند.' }, { status: 500 });
  }
} 