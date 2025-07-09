'use client'
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-700">إدارة من نحن</h1>
        
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
              <h2 className="text-xl font-semibold mb-2 text-green-800">اهداف الجمعية</h2>
              <p className="text-amber-600">تعرض هذه الصفحة الأهداف الرئيسية للجمعية ورؤيتها المستقبلية.</p>
              <div className="mt-4 text-green-600 font-medium">إدارة اهداف الجمعية →</div>
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
