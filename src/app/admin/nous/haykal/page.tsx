'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminHaykalPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/page-content?pageName=haykal');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        } else if (res.status === 404) {
          setMessage('لم يتم العثور على محتوى لهذه الصفحة بعد.');
        } else {
          setMessage('فشل جلب المحتوى.');
        }
      } catch (error) {
        console.error('خطأ في جلب المحتوى:', error);
        setMessage('خطأ في جلب المحتوى.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    } else {
      setPdfFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!pdfFile) {
      setMessage('الرجاء تحديد ملف PDF لتحميله.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('pageName', 'haykal');
    formData.append('pdfFile', pdfFile);

    try {
      const res = await fetch('/api/page-content', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('تم حفظ المحتوى بنجاح!');
        router.refresh();
      } else {
        setMessage('فشل حفظ المحتوى.');
      }
    } catch (error) {
      console.error('خطأ في حفظ المحتوى:', error);
      setMessage('خطأ في حفظ المحتوى.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">إدارة صفحة الهيكل التنظيمي</h1>
        <Link href="/" className="text-green-600 hover:text-green-800">
          {/* أيقونة العين */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="mb-4">
          <label htmlFor="pdfFile" className="block text-gray-700 text-sm font-bold mb-2">تحميل ملف PDF:</label>
          <input
            type="file"
            id="pdfFile"
            accept="application/pdf"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {content && (
            <p className="text-sm text-gray-500 mt-2">
              الملف الحالي: <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{content.split('/').pop()}</a>
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'جارٍ الحفظ...' : 'حفظ المحتوى'}
          </button>
          {/* زر الرجوع تم استبداله بأيقونة العين في أعلى اليمين */}
          {/*
          <Link href="/admin/nous" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            الرجوع
          </Link>
          */}
        </div>
        {message && <p className="mt-4 text-center text-sm font-semibold text-gray-600">{message}</p>}
      </form>
    </div>
  );
}
