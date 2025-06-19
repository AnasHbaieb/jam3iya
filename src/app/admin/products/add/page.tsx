'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isNew: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create and display image preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData object for the API request
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      submitFormData.append('isNew', formData.isNew.toString());

      // Add image file if available
      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        // No Content-Type header - browser will set it with proper boundary for FormData
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      // Product added successfully - redirect to products list or show success message
      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while adding the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-amber-600">إضافة مشروع جديد</h1>
        <Link href="/admin/products" className="text-green-700 hover:underline">
          عودة لادارة المشاريع
        </Link>
        <div className="mt-2">
          <Link href="/admin" className="text-green-700 hover:underline">
            عودة للإدارة→
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-amber-700 mb-1">
              اسم المشروع
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-amber-700 mb-1">
              وصف المشروع
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            ></textarea>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-amber-700">
              الفئة
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-green-700"
            >
              <option value="">اختر الفئة</option>
              <option value="مشاريع شهرية">مشاريع شهرية</option>
              <option value="مشاريع موسمية">مشاريع موسمية</option>
              <option value="مشاريع ظرفية">مشاريع ظرفية</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-amber-700">
              الصورة
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="معاينة"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isNew"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isNew" className="mr-2 block text-sm text-green-700">
              مشروع يحدث الان
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة المشروع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
