'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ContentPost {
  id: number;
  title: string;
  category: string;
  description: string | null;
  date: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ContentPostDetailPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<ContentPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/content-posts/${id}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'فشل في جلب تفاصيل المستجد');
          }
          const data: ContentPost = await response.json();
          setPost(data);
        } catch (err: any) {
          setError(err.message || 'حدث خطأ غير متوقع أثناء جلب المستجد');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">جاري التحميل...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-600">
        المستجد غير موجود.
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', calendar: 'gregory' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { month: '2-digit', calendar: 'gregory' }).format(date);
    const day = new Intl.DateTimeFormat('en-US', { day: '2-digit', calendar: 'gregory' }).format(date);
    return `${year}/${month}/${day}`;
  };

  return (
    <div className="min-h-screen py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-green-600 hover:text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-amber-600">تفاصيل المستجد</h1>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h2>
        <p className="text-gray-600 text-lg mb-2">
          <span className="font-semibold">الصنف:</span> {post.category}
        </p>
        <p className="text-gray-600 text-lg mb-4">
          <span className="font-semibold">التاريخ:</span> {formatDate(post.date)}
        </p>

        {post.imageUrl && (
          <div className="mb-6 relative h-96 w-full rounded-lg overflow-hidden shadow-md">
            <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority={true} />
          </div>
        )}

        {post.videoUrl && (
          <div className="mb-6 w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-md">
            <video src={post.videoUrl} controls className="w-full" />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <p>{post.description}</p>
        </div>
      </div>
    </div>
  );
} 