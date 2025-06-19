'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false });

export default function AdminRaportsPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/page-content?pageName=raports');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        } else if (res.status === 404) {
          setMessage('No content found for this page yet.');
        } else {
          setMessage('Failed to fetch content.');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setMessage('Error fetching content.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/page-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageName: 'raports', content }),
      });

      if (res.ok) {
        setMessage('Content saved successfully!');
        router.refresh();
      } else {
        setMessage('Failed to save content.');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">إدارة صفحة التقارير</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">محتوى الصفحة:</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'جارٍ الحفظ...' : 'حفظ المحتوى'}
          </button>
        </div>
        {message && <p className="mt-4 text-center text-sm font-semibold text-gray-600">{message}</p>}
      </form>
    </div>
  );
}
