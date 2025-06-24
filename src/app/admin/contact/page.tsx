import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ContactMessage } from '@/actions/contactActions';

// إزالة تعريف إجراء الخادم المحلي

export default async function ContactRequests() {
  // جلب الرسائل من قاعدة البيانات
  const messages: ContactMessage[] = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-700">إدارة طلبات العملاء</h1>
        
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-right">
            <thead>
              <tr>
                <th className="py-4 px-6 border-b">الاسم</th>
                <th className="py-4 px-6 border-b">البريد الإلكتروني</th>
                <th className="py-4 px-6 border-b">الرسالة</th>
                <th className="py-4 px-6 border-b">تاريخ الإرسال</th>
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
                    <td className="py-2 px-4 border-b">{message.name}</td>
                    <td className="py-2 px-4 border-b">{message.email}</td>
                    <td className="py-2 px-4 border-b">{message.message}</td>
                    <td className="py-2 px-4 border-b">{new Date(message.createdAt).toLocaleString()}</td>
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
