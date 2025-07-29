'use client'
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">إدارة من نحن</h1>
          {/* <Link href="/" className="text-green-600 hover:text-green-800">
            {/* أيقونة العين */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/nous/about" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-200">
              <h2 className="text-xl font-semibold mb-2 text-green-800">تعريف الجمعية</h2>
              <p className="text-amber-600">  إدارة وتحديث تعريف بالجمعية ومعلوماتنا الأساسية.</p>
              <div className="mt-4 text-green-600 font-medium">تعريف الجمعية →</div>
            </div>
          </Link>
          <Link href="/admin/nous/haykal" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-200">
              <h2 className="text-xl font-semibold mb-2 text-green-800">الهيكل الإداري</h2>
              <p className="text-amber-600">تعديل الهيكل الإداري للجمعية وتفاصيل الأعضاء.</p>
              <div className="mt-4 text-green-600 font-medium">إدارة الهيكل الإداري →</div>
            </div>
          </Link>
 
          <Link href="/admin/nous/raports" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-green-200">
              <h2 className="text-xl font-semibold mb-2 text-green-800">التقارير السنوية</h2>
              <p className="text-amber-600">عرض وتحرير التقارير المالية والأدبية السنوية للجمعية.</p>
              <div className="mt-4 text-green-600 font-medium">إدارة التقارير →</div>
            </div>
          </Link>
        </div>

        {/* زر العودة للادارة */}
        <div className="mt-6">
        <Link href="/admin" className="inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition">
            العودة للوحة تحكم الادارة
          </Link>
        </div>
      </div>
    </div>
  );
}
