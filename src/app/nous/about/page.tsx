'use client'
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/richtext-content?pageName=about');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        } else if (res.status === 404) {
          // Keep content empty
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
        <div className="container mx-auto p-4 flex-grow ">
          <h1 className="text-3xl font-bold mb-6 text-center text-amber-500">تعريف الجمعية</h1>
          <div className="shadow-md rounded-lg p-6 mb-8 bg-gray-100">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-center text-gray-500">لم يتم إضافة محتوى لهذه الصفحة بعد.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
