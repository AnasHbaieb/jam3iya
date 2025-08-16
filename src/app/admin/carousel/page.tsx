'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CarouselImage {
  id: number;
  imageUrl: string;
  order: number;
}

export default function CarouselAdminPage() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/carousel-images');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImages(data);
    } catch {
      setError('Failed to fetch images.');
      toast.error('فشل جلب الصور.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageFile) {
      toast.error('الرجاء اختيار ملف صورة.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', newImageFile);

      const response = await fetch('/api/carousel-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إضافة الصورة');
      }

      toast.success('تمت إضافة الصورة بنجاح!');
      setNewImageFile(null);
      const fileInput = document.getElementById('imageUrl') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchImages();
    } catch (err: unknown) {
      toast.error(`فشل إضافة الصورة: ${(err as Error).message}`);
    }
  };

  const handleDeleteImage = async (id: number) => {
    try {
      const response = await fetch('/api/carousel-images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('تم حذف الصورة بنجاح!');
      fetchImages();
    } catch {
      toast.error('فشل حذف الصورة.');
    }
  };

  const handleUpdateOrder = async (id: number, newOrder: number) => {
    try {
      const response = await fetch('/api/carousel-images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, order: newOrder }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('تم تحديث ترتيب الصورة بنجاح!');
      fetchImages(); // Refetch to show updated order
    } catch {
      toast.error('فشل تحديث ترتيب الصورة.');
    }
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (error) return <div className="text-center py-8 text-red-500">خطأ: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">إدارة الكاروسيل</h1>

      <div className="mb-8 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">إضافة صورة جديدة</h2>
        <form onSubmit={handleAddImage} className="space-y-4">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">اختر ملف الصورة</label>
            <input
              type="file"
              id="imageUrl"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              accept="image/*"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            إضافة صورة
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="text-xl font-semibold mb-4">الصور الحالية</h2>
        {images.length === 0 ? (
          <p>لا توجد صور في الكاروسيل حاليًا.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden shadow-md flex flex-col">
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={image.imageUrl}
                    alt={'صورة كاروسيل'}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-2"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-sm text-gray-600 mb-2">الترتيب: {image.order}</p>
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      حذف
                    </button>
                    <input
                      type="number"
                      defaultValue={image.order}
                      onBlur={(e) => handleUpdateOrder(image.id, parseInt(e.target.value))}
                      className="w-20 border border-gray-300 rounded-md shadow-sm p-1 text-center"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
