import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

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
    // Remove local uploadsDir as we'll use S3
    // const uploadsDir = join(process.cwd(), 'public', 'uploads');

    // Fetch existing content to potentially delete old PDF
    const existingPageContent = await prisma.pageContent.findUnique({
      where: { pageName },
    });

    if (pdfFile) {
      if (pdfFile.size === 0) {
        return NextResponse.json({ error: 'ملف PDF فارغ' }, { status: 400 });
      }

      const s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/s3`,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID!,
          secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      });

      const fileExtension = pdfFile.name.split('.').pop();
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const key = `PDF-folder/${uniqueFilename}`;
      fileUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/uploads/${key}`;

      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const command = new PutObjectCommand({
        Bucket: 'uploads',
        Key: key,
        Body: buffer,
        ContentType: pdfFile.type,
      });

      await s3Client.send(command);

      // Delete old PDF if it exists and is different from the new one
      if (existingPageContent?.content && existingPageContent.content !== fileUrl) {
        // Extract the key from the old S3 URL
        const oldKey = existingPageContent.content.split('/uploads/')[1];
        try {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: 'uploads',
            Key: oldKey,
          });
          await s3Client.send(deleteCommand);
        } catch (unlinkError) {
          console.error('خطأ في حذف الملف القديم من S3:', unlinkError);
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

    // Ensure the URL is correct for S3, especially if old entries were local paths
    let finalFileUrl = pageContent.content;
    if (pageContent.content && !pageContent.content.startsWith('http')) {
      finalFileUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/uploads/PDF-folder/${pageContent.content.split('/').pop()}`;
    }

    return NextResponse.json({ ...pageContent, content: finalFileUrl }, { status: 200 });
  } catch (error) {
    console.error('خطأ في جلب محتوى الصفحة:', error);
    return NextResponse.json(
      { error: 'فشل جلب محتوى الصفحة' },
      { status: 500 }
    );
  }
} 