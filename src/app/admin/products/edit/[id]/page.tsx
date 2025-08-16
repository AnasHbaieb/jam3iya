'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(null);
  const [secondaryImagePreview, setSecondaryImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // إضافة حالة النجاح

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('فشل في جلب البيانات');
        
        const productData = await response.json();
        
        setFormData({
          name: productData.name,
          description: productData.description,
          shortDescription: productData.shortDescription || '',
          category: productData.category,
        });

        if (productData.imageUrl) {
          setImagePreview(productData.imageUrl);
        }
        if (productData.secondaryImageUrl) {
          setSecondaryImagePreview(productData.secondaryImageUrl);
        }
        
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // معالجة التغييرات في النموذج
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // معالجة تغيير الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);

    if (e.target.name === 'image') {
      setImageFile(file);
      setImagePreview(previewUrl);
    } else if (e.target.name === 'secondaryImage') {
      setSecondaryImageFile(file);
      setSecondaryImagePreview(previewUrl);
    }

    // Cleanup function will be called when component unmounts or when the preview changes
    return () => URL.revokeObjectURL(previewUrl);
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false); // إعادة تعيين حالة النجاح

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('shortDescription', formData.shortDescription);
      form.append('category', formData.category);

      if (imageFile) {
        form.append('image', imageFile);
      } else if (imagePreview && !imageFile) { // If no new file, but there was a preview, keep the old image
        form.append('imageUrl', imagePreview);
      }
      if (secondaryImageFile) {
        form.append('secondaryImage', secondaryImageFile);
      } else if (secondaryImagePreview && !secondaryImageFile) { // If no new file, but there was a preview, keep the old image
        form.append('secondaryImageUrl', secondaryImagePreview);
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في التحديث');
      }

      setSuccess(true); // تعيين حالة النجاح
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1500);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-amber-600 mb-2">تعديل المشروع</h1>
          {/* <Link href="/" className="text-green-600 hover:text-green-800 self-center">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link> */}
        </div>

        {/* تم إزالة أزرار الرجوع واستبدالها بأيقونة العين في أعلى اليمين */}
        {/*
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-amber-600 mb-2">تعديل المشروع</h1>
            <div className="flex space-x-4 space-x-reverse">
              <Link href="/admin/products" className="text-green-700 hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                عودة لإدارة المشاريع
              </Link>
              <Link href="/admin" className="text-green-700 hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                عودة للوحة التحكم
              </Link>
            </div>
          </div>
        </div>
        */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">تم تحديث المشروع بنجاح!</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المشروع <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="أدخل اسم المشروع"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">اختر الفئة</option>
                  <option value="مشاريع شهرية">مشاريع شهرية</option>
                  <option value="مشاريع موسمية">مشاريع موسمية</option>
                  <option value="مشاريع ظرفية">مشاريع ظرفية</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">المحتوى  المختصر</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  وصف مختصر للمشروع
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="وصف مختصر يظهر في صفحة المشاريع الرئيسية"
                ></textarea>
              </div>

              <div>
                <label htmlFor="secondaryImage" className="block text-sm font-medium text-gray-700 mb-1">
                  الصورة المصغرة
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {secondaryImagePreview ? (
                      <div className="relative">
                        <Image
                          src={secondaryImagePreview}
                          alt="معاينة الصورة المصغرة"
                          width={200}
                          height={200}
                          className="rounded-lg object-cover mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSecondaryImageFile(null);
                            setSecondaryImagePreview(null);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="secondaryImage"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                          >
                            <span className='p-20'>رفع صورة</span>
                            <input
                              id="secondaryImage"
                              name="secondaryImage"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF بحد أقصى 5MB</p>
                        <p className="text-xs text-gray-500">أبعاد الصورة الموصى بها: 300x200 بكسل</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">المحتوى الرئيسي</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  وصف المشروع
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="وصف مفصل عن المشروع"
                ></textarea>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  الصورة الرئيسية <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="معاينة الصورة الرئيسية"
                          width={300}
                          height={200}
                          className="rounded-lg object-cover mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                          >
                            <span className='p-20'>رفع صورة</span>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="sr-only"
                              required
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF بحد أقصى 5MB</p>
                        <p className="text-xs text-gray-500">أبعاد الصورة الموصى بها: 1200x800 بكسل</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التحديث...
                </>
              ) : 'تحديث المشروع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 