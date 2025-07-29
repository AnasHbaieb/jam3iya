'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

import { useEffect, useState } from 'react';

// Define the ContentPost type that matches our Prisma model
export interface ContentPost {
  id: number;
  title: string;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  secondaryImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  rang: number;
}

export default function ContentPostsPage() {
  const [contentPosts, setContentPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContentPosts = async () => {
      try {
        const response = await fetch('/api/content-posts');
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch content posts');
        }
        const data = await response.json();
        // ترتيب المستجدات تصاعدياً حسب حقل rang
        const sortedContentPosts = data.sort((a: ContentPost, b: ContentPost) => a.rang - b.rang);
        setContentPosts(sortedContentPosts);
      } catch (err) {
        setError('خطأ في تحميل المستجدات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContentPosts();
  }, []);

  //Delete
  const handleDelete = async (id: number) => {
    const confirmed = confirm('هل أنت متأكد أنك تريد حذف هذا المستجد؟');
    if (confirmed) {
      try {
        const response = await fetch(`/api/content-posts/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete content post');
        }
        setContentPosts(contentPosts.filter(post => post.id !== id));
      } catch (err) {
        console.error(err);
        setError('Error deleting content post');
      }
    }
  };

  // Move content post up in the list
  const handleMoveUp = async (contentPostId: number) => {
    try {
      const sortedContentPosts = [...contentPosts].sort((a, b) => a.rang - b.rang);
      const currentIndex = sortedContentPosts.findIndex(p => p.id === contentPostId);

      if (currentIndex <= 0) return; // Already at the top

      const currentContentPost = sortedContentPosts[currentIndex];
      const targetContentPost = sortedContentPosts[currentIndex - 1];

      console.log(`Move Up - Index: ${currentIndex} -> ${currentIndex - 1} (${currentIndex - (currentIndex - 1)})`);
      console.log(`Current: [${currentIndex}] ${currentContentPost.title} (rang: ${currentContentPost.rang})`);
      console.log(`Target:  [${currentIndex - 1}] ${targetContentPost.title} (rang: ${targetContentPost.rang})`);

      // Swap the rang values
      const response = await fetch(`/api/content-posts/${contentPostId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentRang: currentContentPost.rang,
          targetRang: targetContentPost.rang,
          targetContentPostId: targetContentPost.id
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to move content post up');
      }

      // Refresh the content posts list after update
      const contentPostsResponse = await fetch('/api/content-posts');
      if (!contentPostsResponse.ok) throw new Error('Failed to fetch updated content posts');
      const updatedContentPosts = await contentPostsResponse.json();
      setContentPosts(updatedContentPosts.sort((a: ContentPost, b: ContentPost) => a.rang - b.rang));

    } catch (err) {
      console.error('Error moving content post up:', err);
      setError('خطأ في تحديث ترتيب المستجد');
    }
  };

  // Move content post down in the list
  const handleMoveDown = async (contentPostId: number) => {
    try {
      const sortedContentPosts = [...contentPosts].sort((a, b) => a.rang - b.rang);
      const currentIndex = sortedContentPosts.findIndex(p => p.id === contentPostId);

      if (currentIndex === -1 || currentIndex === sortedContentPosts.length - 1) return; // Already at the bottom

      const currentContentPost = sortedContentPosts[currentIndex];
      const targetContentPost = sortedContentPosts[currentIndex + 1];

      console.log(`Move Down - Index: ${currentIndex} -> ${currentIndex + 1} (${(currentIndex + 1) - currentIndex})`);
      console.log(`Current: [${currentIndex}] ${currentContentPost.title} (rang: ${currentContentPost.rang})`);
      console.log(`Target:  [${currentIndex + 1}] ${targetContentPost.title} (rang: ${targetContentPost.rang})`);

      // Swap the rang values
      const response = await fetch(`/api/content-posts/${contentPostId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentRang: currentContentPost.rang,
          targetRang: targetContentPost.rang,
          targetContentPostId: targetContentPost.id
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to move content post down');
      }

      // Refresh the content posts list after update
      const contentPostsResponse = await fetch('/api/content-posts');
      if (!contentPostsResponse.ok) throw new Error('Failed to fetch updated content posts');
      const updatedContentPosts = await contentPostsResponse.json();
      setContentPosts(updatedContentPosts.sort((a: ContentPost, b: ContentPost) => a.rang - b.rang));

    } catch (err) {
      console.error('Error moving content post down:', err);
      setError('خطأ في تحديث ترتيب المستجد');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4"> {/* New div to group title and add button */}
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-600">إدارة المستجدات</h1>
            <Link
              href="/admin/new/add"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition duration-300 text-center"
            >
              إضافة مستجد جديد
            </Link>
          </div>
            {/* <Link href="/" className="text-green-600 hover:text-green-800">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            </Link> */}
        </div>
        
        {contentPosts.length === 0 ? (
          <div className="bg-green-50 border border-green-400 text-green-800 p-6 rounded-lg text-center">
            لا توجد مستجدات. قم بإضافة أول مستجد!
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
            {/* Mobile view - Cards */}
            <div className="block md:hidden">
              {contentPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 p-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 relative">
                        {post.imageUrl ? (
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized={post.imageUrl?.includes('supabase.co')}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            لا توجد صورة
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-green-700 mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
                      {post.shortDescription && (
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-semibold">وصف مختصر:</span> {post.shortDescription}
                        </p>
                      )}
                      
                      {post.secondaryImageUrl && (
                        <div className="flex-shrink-0 mt-2">
                            <div className="h-16 w-16 relative">
                                <Image
                                    src={post.secondaryImageUrl}
                                    alt={`صورة مصغرة لـ ${post.title}`}
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized={post.secondaryImageUrl?.includes('supabase.co')}
                                />
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-1">صورة مصغرة</p>
                        </div>
                      )}

                      {/* Mobile Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleMoveUp(post.id)}
                          disabled={post.rang === 0}
                          className={`p-2 rounded-md transition duration-300 ${
                            post.rang === 0
                              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                              : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                          }`}
                          title={post.rang === 0 ? 'المستجد في الأعلى' : 'نقل للأعلى'}
                        >
                          <FaArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(post.id)}
                          disabled={post.rang === contentPosts.length - 1}
                          className={`p-2 rounded-md transition duration-300 ${
                            post.rang === contentPosts.length - 1
                              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                              : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                          }`}
                          title={post.rang === contentPosts.length - 1 ? 'المستجد في الأسفل' : 'نقل للأسفل'}
                        >
                          <FaArrowDown size={14} />
                        </button>
                        <Link
                          href={`/admin/new/edit/${post.id}`}
                          className="text-amber-700 hover:text-amber-600 bg-amber-50 px-3 py-1 rounded-md text-sm transition duration-300"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-md text-sm transition duration-300"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider w-20">
                      الصورة
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider w-20">
                      صورة مصغرة
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider">
                      العنوان
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider">
                      الوصف
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider">
                      وصف مختصر
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider w-48">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {contentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-3">
                        <div className="h-16 w-16 relative">
                          {post.imageUrl ? (
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                              لا توجد صورة
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-16 w-16 relative">
                          {post.secondaryImageUrl ? (
                            <Image
                              src={post.secondaryImageUrl}
                              alt={`صورة مصغرة لـ ${post.title}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                              لا توجد صورة مصغرة
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-green-700 text-sm">{post.title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 text-sm max-w-xs truncate">{post.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 text-sm max-w-xs truncate">{post.shortDescription || 'لا يوجد وصف مختصر'}</div>
                      </td>
                     
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveUp(post.id)}
                            disabled={post.rang === 0}
                            className={`p-2 rounded-md transition duration-300 ${
                              post.rang === 0
                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                          }`}
                            title={post.rang === 0 ? 'المستجد في الأعلى' : 'نقل للأعلى'}
                          >
                            <FaArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(post.id)}
                            disabled={post.rang === contentPosts.length - 1}
                            className={`p-2 rounded-md transition duration-300 ${
                              post.rang === contentPosts.length - 1
                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                          }`}
                            title={post.rang === contentPosts.length - 1 ? 'المستجد في الأسفل' : 'نقل للأسفل'}
                          >
                            <FaArrowDown size={14} />
                          </button>
                          <Link
                            href={`/admin/new/edit/${post.id}`}
                            className="text-amber-700 hover:text-amber-600 bg-amber-50 px-3 py-1 rounded-md text-sm transition duration-300"
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-md text-sm transition duration-300"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
