"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">الصفحة غير موجودة</h2>
      <p className="text-lg text-center mb-8">
        عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.
        <br />
        قد تكون الصفحة تحت الإنشاء أو حدث خطأ ما.
      </p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300">
          العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
