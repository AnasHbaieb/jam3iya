'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(userData);
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">لوحة تحكم الإدارة</h1>
          <Link href="/" className="text-green-600 hover:text-green-800">
            {/* أيقونة العين */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/products" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-200">
              <h2 className="text-xl font-semibold mb-2 text-green-800">إدارة المشاريع</h2>
              <p className="text-amber-600">إضافة، تعديل، أو حذف المشاريع  .</p>
              <div className="mt-4 text-green-600 font-medium">إدارة المشاريع →</div>
            </div>
          </Link>
          
          <Link href="/admin/contact" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-200">
              <h2 className="text-xl font-semibold mb-2 text-green-800">إدارة الطلبات</h2>
              <p className="text-amber-600">إدارة طلبات العملاء .</p>
              <div className="mt-4 text-green-600 font-medium">إدارة الطلبات →</div>
            </div>
          </Link>
          <Link href="/admin/nous" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-200">
              <h2 className="text-xl font-semibold mb-2 text-green-800"> إدارة من نحن </h2>
              <p className="text-amber-600"> تعريف الجمعية,الهيكل الإداري,التقارير السنوبة.</p>
              <div className="mt-4 text-green-600 font-medium">إدارة من نحن →</div>
            </div>
          </Link>
        </div>

       

        <div className="flex items-center gap-4 mt-4">
          <span className="text-gray-600">مرحبًا، {user.name || user.email}</span>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className="text-red-600 hover:text-red-700"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
