'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Document {
  id: number;
  title: string;
  url: string;
}

export default function AdminRaportsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/page-content?pageName=raports');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
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
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setPdfTitle(e.target.files[0].name.split('.')[0] || '');
    } else {
      setPdfFile(null);
      setPdfTitle('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!pdfFile || !pdfTitle) {
      setMessage('الرجاء تحديد ملف PDF وإدخال عنوان له.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('pageName', 'raports');
    formData.append('pdfFile', pdfFile);
    formData.append('title', pdfTitle);

    try {
      const res = await fetch('/api/page-content', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('تم حفظ المستند بنجاح!');
        setPdfFile(null);
        setPdfTitle('');
        fetchContent();
      } else {
        setMessage('فشل حفظ المستند.');
      }
    } catch (error) {
      console.error('خطأ في حفظ المستند:', error);
      setMessage('خطأ في حفظ المستند.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المستند؟')) {
      setMessage('');
      setLoading(true);
      try {
        const res = await fetch(`/api/page-content?documentId=${documentId}`,
          { method: 'DELETE' });

        if (res.ok) {
          setMessage('تم حذف المستند بنجاح!');
          fetchContent();
        } else {
          setMessage('فشل حذف المستند.');
        }
      } catch (error) {
        console.error('خطأ في حذف المستند:', error);
        setMessage('خطأ في حذف المستند.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">إدارة صفحة التقارير</h1>
        <Link href="/" className="text-green-600 hover:text-green-800">
          {/* أيقونة العين */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">إضافة مستند PDF جديد</h2>
        <div className="mb-4">
          <label htmlFor="pdfTitle" className="block text-gray-700 text-sm font-bold mb-2">عنوان ملف PDF:</label>
          <input
            type="text"
            id="pdfTitle"
            value={pdfTitle}
            onChange={(e) => setPdfTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            placeholder="أدخل عنوان ملف PDF"
          />
          <label htmlFor="pdfFile" className="block text-gray-700 text-sm font-bold mb-2">تحميل ملف PDF:</label>
          <input
            type="file"
            id="pdfFile"
            accept="application/pdf"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'جارٍ الحفظ...' : 'حفظ المستند'}
          </button>
          <Link href="/admin/nous" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            الرجوع
          </Link>
        </div>
        {message && <p className="mt-4 text-center text-sm font-semibold text-gray-600">{message}</p>}
      </form>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">المستندات الحالية</h2>
        {documents.length === 0 ? (
          <p>لا توجد مستندات محملة حاليًا.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li key={doc.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {doc.title}
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
