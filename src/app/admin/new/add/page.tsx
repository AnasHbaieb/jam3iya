'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Assuming you use Next.js Image component
import { FaUpload, FaTimes } from 'react-icons/fa'; // For upload icon and remove button

const NewPostPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      setError('حجم الصورة يتجاوز الحد المسموح به (5MB).');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('الرجاء تحميل ملف صورة صالح (PNG, JPG, GIF).');
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
    setError(''); // Clear previous errors
  }, [MAX_FILE_SIZE]);

  const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      setError('حجم الفيديو يتجاوز الحد المسموح به (5MB).');
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('الرجاء تحميل ملف فيديو صالح.');
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreview(previewUrl);
    setError(''); // Clear previous errors
  }, [MAX_FILE_SIZE]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError('حجم الصورة يتجاوز الحد المسموح به (5MB).');
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('الرجاء تحميل ملف صورة صالح (PNG, JPG, GIF).');
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewUrl);
      setError('');
    }
  }, [MAX_FILE_SIZE]);

  const handleVideoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        setError('حجم الفيديو يتجاوز الحد المسموح به (5MB).');
        setVideoFile(null);
        setVideoPreview(null);
        return;
      }
      if (!file.type.startsWith('video/')) {
        setError('الرجاء تحميل ملف فيديو صالح.');
        setVideoFile(null);
        setVideoPreview(null);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoPreview(previewUrl);
      setError('');
    }
  }, [MAX_FILE_SIZE]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.title.trim()) {
      setError('العنوان مطلوب.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.category.trim()) {
      setError('الصنف مطلوب.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('الوصف مطلوب.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.date.trim()) {
      setError('التاريخ مطلوب.');
      setIsSubmitting(false);
      return;
    }
    if (!imageFile) {
      setError('الصورة مطلوبة.');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('date', formData.date);
      if (imageFile) {
        data.append('image', imageFile);
      }
      if (videoFile) {
        data.append('video', videoFile);
      }

      const response = await fetch('/api/content-posts', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إضافة المستجد.');
      }

      alert('تمت إضافة المستجد بنجاح!');
      setFormData({
        title: '',
        category: '',
        description: '',
        date: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setVideoFile(null);
      setVideoPreview(null);
      router.push('/admin/new'); // Redirect to the news management page
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">تسجيل المستجدات</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Success message will now be an alert */}

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-lg font-bold mb-2 text-right">
            العنوان
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            dir="rtl"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-lg font-bold mb-2 text-right">
            الصنف
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            dir="rtl"
          />
        </div>

        {/* Image Upload Field */}
        <div className="mb-4">
          <label htmlFor="image-upload" className="block text-gray-700 text-lg font-bold mb-2 text-right">
            الصورة
          </label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleImageDrop}
            onClick={() => document.getElementById('image-input')?.click()}
          >
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative w-48 h-48 mx-auto">
                  <Image
                    src={imagePreview}
                    alt="معاينة الصورة"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview(null);
                      setError('');
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 text-center justify-center">
                    <span className="font-medium text-amber-600">رفع صورة</span>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF بحد أقصى 5MB</p>
                </>
              )}
              <input
                id="image-input"
                name="image"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleImageChange}
                className="sr-only"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-lg font-bold mb-2 text-right">
            التاريخ
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            dir="rtl"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-lg font-bold mb-2 text-right">
            الوصف
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
            dir="rtl"
          ></textarea>
        </div>

        {/* Video Upload Field */}
        <div className="mb-4">
          <label htmlFor="video-upload" className="block text-gray-700 text-lg font-bold mb-2 text-right">
            فيديو إن وجد
          </label>
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleVideoDrop}
            onClick={() => document.getElementById('video-input')?.click()}
          >
            <div className="space-y-1 text-center">
              {videoPreview ? (
                <div className="relative w-full max-w-md mx-auto">
                  <video src={videoPreview} controls className="rounded-md w-full" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoFile(null);
                      setVideoPreview(null);
                      setError('');
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 text-center justify-center">
                    <span className="font-medium text-amber-600">رفع فيديو</span>
                  </div>
                  <p className="text-xs text-gray-500">MP4, WebM, Ogg بحد أقصى 5MB</p>
                </>
              )}
              <input
                id="video-input"
                name="video"
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleVideoChange}
                className="sr-only"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between flex-row-reverse">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-right flex-grow" dir="rtl">{error}</div>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {isSubmitting ? 'جاري الإضافة...' : 'إضافة'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostPage;