'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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

export default function ContentPostDetailPage() {
  const pathname = usePathname(); // هنا نحصل على مسار الصفحة
  const [post, setPost] = useState<ContentPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // استخراج الـ id من الـ URL
  const idMatch = pathname?.match(/\/news\/(\d+)/);
  const id = idMatch ? idMatch[1] : null;

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
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
    <div className="min-h-screen  py-8 sm:py-12" dir="rtl">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 sm:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-2 h-8 bg-white rounded-full opacity-80"></div>
            تفاصيل المستجد
          </h1>
        </div>
        
        {/* Main Content */}
        <div className="p-6 sm:p-8">
          {/* Title Section */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h2>
            
            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-semibold text-amber-700">الصنف:</span>
                <span className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="font-semibold text-gray-700">التاريخ:</span>
                <span className="text-gray-800 font-medium">{formatDate(post.date)}</span>
              </div>
            </div>
          </div>
  
          {/* Media Section */}
          {post.imageUrl && (
            <div className="mb-8">
              <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  style={{ objectFit: 'cover' }} 
                  priority={true}
                  className="transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          )}
  
          {post.videoUrl && (
            <div className="mb-8">
              <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
                <video 
                  src={post.videoUrl} 
                  controls 
                  className="w-full bg-black"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
            </div>
          )}
  
          {/* Content Section */}
          <div className="bg-gray-50/50 rounded-xl p-6 sm:p-8 border border-gray-200/50">
            <div className="prose prose-lg prose-gray max-w-none">
              <div className="text-gray-800 leading-relaxed text-lg sm:text-xl font-light">
                {post.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
} 