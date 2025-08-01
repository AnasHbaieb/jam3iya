'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

import { useEffect, useState } from 'react';

// Define the Product type that matches our Prisma model
export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string | null;
  imageUrl: string | null;
  secondaryImageUrl: string | null;
  category: string;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
  rang: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        // ترتيب المشاريع تصاعدياً حسب حقل rang
        const sortedProducts = data.sort((a: Product, b: Product) => a.rang - b.rang);
        setProducts(sortedProducts);
      } catch (err) {
        setError('خطأ في تحميل المشاريع');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //Delete
  const handleDelete = async (id: number) => {
    const confirmed = confirm('هل أنت متأكد أنك تريد حذف هذا المشروع؟');
    if (confirmed) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        console.error(err);
        setError('Error deleting product');
      }
    }
  };

  // Move product up in the list
  const handleMoveUp = async (productId: number) => {
    try {
      const sortedProducts = [...products].sort((a, b) => a.rang - b.rang);
      const currentIndex = sortedProducts.findIndex(p => p.id === productId);

      if (currentIndex <= 0) return; // Already at the top

      const currentProduct = sortedProducts[currentIndex];
      const targetProduct = sortedProducts[currentIndex - 1];

      console.log(`Move Up - Index: ${currentIndex} -> ${currentIndex - 1} (${currentIndex - (currentIndex - 1)})`);
      console.log(`Current: [${currentIndex}] ${currentProduct.name} (rang: ${currentProduct.rang})`);
      console.log(`Target:  [${currentIndex - 1}] ${targetProduct.name} (rang: ${targetProduct.rang})`);

      // Swap the rang values
      const response = await fetch(`/api/products/${productId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentRang: currentProduct.rang,
          targetRang: targetProduct.rang,
          targetProductId: targetProduct.id
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to move product up');
      }

      // Refresh the products list after update
      const productsResponse = await fetch('/api/products');
      if (!productsResponse.ok) throw new Error('Failed to fetch updated products');
      const updatedProducts = await productsResponse.json();
      setProducts(updatedProducts.sort((a: Product, b: Product) => a.rang - b.rang));

    } catch (err) {
      console.error('Error moving product up:', err);
      setError('خطأ في تحديث ترتيب المشروع');
    }
  };

  // Move product down in the list
  const handleMoveDown = async (productId: number) => {
    try {
      const sortedProducts = [...products].sort((a, b) => a.rang - b.rang);
      const currentIndex = sortedProducts.findIndex(p => p.id === productId);

      if (currentIndex === -1 || currentIndex === sortedProducts.length - 1) return; // Already at the bottom

      const currentProduct = sortedProducts[currentIndex];
      const targetProduct = sortedProducts[currentIndex + 1];

      console.log(`Move Down - Index: ${currentIndex} -> ${currentIndex + 1} (${(currentIndex + 1) - currentIndex})`);
      console.log(`Current: [${currentIndex}] ${currentProduct.name} (rang: ${currentProduct.rang})`);
      console.log(`Target:  [${currentIndex + 1}] ${targetProduct.name} (rang: ${targetProduct.rang})`);

      // Swap the rang values
      const response = await fetch(`/api/products/${productId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentRang: currentProduct.rang,
          targetRang: targetProduct.rang,
          targetProductId: targetProduct.id
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to move product down');
      }

      // Refresh the products list after update
      const productsResponse = await fetch('/api/products');
      if (!productsResponse.ok) throw new Error('Failed to fetch updated products');
      const updatedProducts = await productsResponse.json();
      setProducts(updatedProducts.sort((a: Product, b: Product) => a.rang - b.rang));

    } catch (err) {
      console.error('Error moving product down:', err);
      setError('خطأ في تحديث ترتيب المشروع');
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
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-600">إدارة المشاريع</h1>
            <Link
              href="/admin/products/add"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition duration-300 text-center"
            >
              إضافة مشروع جديد
            </Link>
          </div>
            {/* <Link href="/" className="text-green-600 hover:text-green-800">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            </Link> */}
        </div>
        
        {/* تم إزالة زر الرجوع واستبداله بأيقونة العين في أعلى اليمين */}
        {/*
        <div className="mb-6">
          <Link href="/admin" className="text-green-700 hover:underline text-sm sm:text-base">
            ← ارجع للإدارة
          </Link>
        </div>
        */}

        {products.length === 0 ? (
          <div className="bg-green-50 border border-green-400 text-green-800 p-6 rounded-lg text-center">
            لا توجد المشاريع. قم بإضافة أول مشروع!
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
            {/* Mobile view - Cards */}
            <div className="block md:hidden">
              {products.map((product) => (
                <div key={product.id} className="border-b border-gray-200 p-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 relative">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized={product.imageUrl?.includes('supabase.co')}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            لا توجد صورة
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-green-700 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      {product.shortDescription && (
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-semibold">وصف مختصر:</span> {product.shortDescription}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{product.category}</span>
                      </div>
                      
                      {product.secondaryImageUrl && (
                        <div className="flex-shrink-0 mt-2">
                            <div className="h-16 w-16 relative">
                                <Image
                                    src={product.secondaryImageUrl}
                                    alt={`صورة مصغرة لـ ${product.name}`}
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized={product.secondaryImageUrl?.includes('supabase.co')}
                                />
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-1">صورة مصغرة</p>
                        </div>
                      )}

                      {/* Mobile Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleMoveUp(product.id)}
                          disabled={product.rang === 0}
                          className={`p-2 rounded-md transition duration-300 ${
                            product.rang === 0
                              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                              : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                          }`}
                          title={product.rang === 0 ? 'المنتج في الأعلى' : 'نقل للأعلى'}
                        >
                          <FaArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(product.id)}
                          disabled={product.rang === products.length - 1}
                          className={`p-2 rounded-md transition duration-300 ${
                            product.rang === products.length - 1
                              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                              : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                          }`}
                          title={product.rang === products.length - 1 ? 'المنتج في الأسفل' : 'نقل للأسفل'}
                        >
                          <FaArrowDown size={14} />
                        </button>
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="text-amber-700 hover:text-amber-600 bg-amber-50 px-3 py-1 rounded-md text-sm transition duration-300"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
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
                      الاسم
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider">
                      الوصف
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider">
                      وصف مختصر
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider w-32">
                      الفئة
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-green-800 tracking-wider w-48">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-3">
                        <div className="h-16 w-16 relative">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
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
                          {product.secondaryImageUrl ? (
                            <Image
                              src={product.secondaryImageUrl}
                              alt={`صورة مصغرة لـ ${product.name}`}
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
                        <div className="font-medium text-green-700 text-sm">{product.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 text-sm max-w-xs truncate">{product.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 text-sm max-w-xs truncate">{product.shortDescription || 'لا يوجد وصف مختصر'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700 text-sm">{product.category}</div>
                      </td>
                     
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveUp(product.id)}
                            disabled={product.rang === 0}
                            className={`p-2 rounded-md transition duration-300 ${
                              product.rang === 0
                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                            }`}
                            title={product.rang === 0 ? 'المنتج في الأعلى' : 'نقل للأعلى'}
                          >
                            <FaArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveDown(product.id)}
                            disabled={product.rang === products.length - 1}
                            className={`p-2 rounded-md transition duration-300 ${
                              product.rang === products.length - 1
                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                            }`}
                            title={product.rang === products.length - 1 ? 'المنتج في الأسفل' : 'نقل للأسفل'}
                          >
                            <FaArrowDown size={14} />
                          </button>
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="text-amber-700 hover:text-amber-600 bg-amber-50 px-3 py-1 rounded-md text-sm transition duration-300"
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
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