'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Document {
  id: number;
  title: string;
  url: string;
}

export default function RaportsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/page-content?pageName=raports');
        if (res.ok) {
          const data = await res.json();
          setDocuments(data.documents || []);
        } else if (res.status === 404) {
          setDocuments([]); // في حالة 404، لا توجد مستندات
        } else {
          setError('فشل جلب المحتوى.');
        }
      } catch (err) {
        console.error('خطأ في جلب المحتوى:', err);
        setError('خطأ في جلب المحتوى.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-lg text-red-500">خطأ: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <main className="flex-grow py-12">
        <div className="container mx-auto p-4 flex-grow">
          <h1 className="text-3xl font-bold mb-6 text-center text-amber-500">التقارير</h1>
          <div className="shadow-md rounded-lg p-6 mb-8 bg-gray-100">
            {documents.length === 0 ? (
              <p className="text-center text-gray-600">لا توجد مستندات متاحة حاليًا.</p>
            ) : (
              <div className="space-y-8">
                {documents.map((doc) => (
                  <div key={doc.id} className="border-b pb-4 last:border-b-0">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">{doc.title}</h2>
                    <embed src={doc.url} type="application/pdf" width="100%" height="600px" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
