'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRaportsPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/page-content?pageName=raports');
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
    formData.append('pageName', 'raports');
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
      <h1 className="text-3xl font-bold mb-6 text-center">إدارة صفحة التقارير</h1>
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
          <Link href="/admin/nous" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            الرجوع
          </Link>
        </div>
        {message && <p className="mt-4 text-center text-sm font-semibold text-gray-600">{message}</p>}
      </form>
    </div>
  );
}
