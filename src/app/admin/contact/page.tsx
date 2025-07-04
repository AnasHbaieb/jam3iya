import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ContactMessage } from '@/actions/contactActions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// إزالة تعريف إجراء الخادم المحلي

export default async function ContactRequests() {
  let messages: ContactMessage[] = [];
  try {
    // جلب الرسائل من قاعدة البيانات
    messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error("Error fetching contact messages during prerendering:", error);
    // يمكنك هنا التعامل مع الخطأ بشكل أكثر تفصيلاً إذا لزم الأمر
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-700">إدارة طلبات العملاء</h1>
        
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-right table-fixed">
            <thead>
              <tr>
                <th className="py-2 px-2 sm:py-4 sm:px-6 border-b text-wrap">الاسم</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 border-b text-wrap">البريد الإلكتروني</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 border-b text-wrap">الرسالة</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 border-b text-wrap">تاريخ الإرسال</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-6 border-b text-center text-gray-500">
                    لا توجد رسائل لعرضها.
                  </td>
                </tr>
              ) : (
                messages.map((message: ContactMessage) => (
                  <tr key={message.id}>
                    <td className="py-2 px-2 sm:py-2 sm:px-4 border-b break-words text-xs sm:text-sm">{message.name}</td>
                    <td className="py-2 px-2 sm:py-2 sm:px-4 border-b break-words text-xs sm:text-sm">{message.email}</td>
                    <td className="py-2 px-2 sm:py-2 sm:px-4 border-b break-words text-xs sm:text-sm">{message.message}</td>
                    <td className="py-2 px-2 sm:py-2 sm:px-4 border-b break-words text-xs sm:text-sm">{new Date(message.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* زر العودة إلى لوحة التحكم */}
        <div className="mt-6">
          <Link href="/admin" className="inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition">
            العودة للادارة 
          </Link>
        </div>

        
      </div>
    </div>
  );
}
