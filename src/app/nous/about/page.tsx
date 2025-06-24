'use client'
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AboutPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/page-content?pageName=about');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        } else if (res.status === 404) {
          setContent('لا يوجد محتوى متاح لهذه الصفحة بعد.');
        } else {
          setError('Failed to fetch content.');
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Error fetching content.');
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center text-amber-500">حول الجمعية</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
