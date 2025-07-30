'use client';

import React, { useState, useEffect } from 'react';
import { NewsCard, ContentPost } from '../components/NewsCard';

const NewPage = () => {
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/content-posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ContentPost[] = await response.json();
        setPosts(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-700">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-amber-500 mb-12">مستجداتنا</h1>
        {posts.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            لا توجد مستجدات لعرضها حالياً.
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post, index) => (
              <NewsCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPage;
