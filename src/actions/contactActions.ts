'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// تعريف دالة لإنشاء رسالة جديدة
export async function createMessage(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // تحقق أساسي من الحقول
  if (!name || !email || !message) {
    return { error: 'يرجى ملء جميع الحقول المطلوبة.' };
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    // إعادة تحميل البيانات في صفحة الإدارة لإظهار الرسالة الجديدة فورًا
    revalidatePath('/admin/contact');
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: 'حدث خطأ أثناء محاولة إرسال الرسالة. يرجى المحاولة مرة أخرى.' };
  }
} 