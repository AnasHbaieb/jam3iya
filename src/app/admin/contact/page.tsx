'use client'
import { ContactMessage } from '@/actions/contactActions';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

// إزالة تعريف إجراء الخادم المحلي

export default function ContactRequests() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/contact-messages');
        if (res.ok) {
          const data = await res.json();
          // قد تحتاج إلى تعديل هذا إذا كانت بنية البيانات مختلفة
          setMessages(data.messages || data);
        } else {
          const errorData = await res.json();
          setError(`فشل جلب البيانات: ${errorData.error || 'خطأ غير معروف'}`);
        }
      } catch (err: unknown) {
        setError(`خطأ في الاتصال: ${(err instanceof Error) ? err.message : 'الرجاء المحاولة لاحقاً.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(messages.map(msg => ({
      name: msg.name,
      email: msg.email,
      message: msg.message,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'طلبات الاتصال');
    XLSX.writeFile(wb, 'طلبات_الاتصال.xlsx');
  };

  if (loading) {
    return <div className="text-center mt-8">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">خطأ: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">إدارة طلبات العملاء</h1>
          {/* <Link href="/" className="text-green-600 hover:text-green-800">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link> */}
        </div>
        
        <div className="mb-6">
          <button
            onClick={exportToExcel}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            تصدير إلى Excel
          </button>
        </div>

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
        {/* تم نقل الزر إلى الأعلى وتغييره إلى أيقونة */}
        {/*
        <div className="mt-6">
          <Link href="/admin" className="inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition">
            العودة للادارة 
          </Link>
        </div>
        */}

        
      </div>
    </div>
  );
}
