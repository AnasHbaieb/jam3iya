"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
          <h1 className="text-6xl font-bold text-red-600 mb-4">خطأ</h1>
          <h2 className="text-3xl font-semibold mb-2">حدث خطأ غير متوقع</h2>
          <p className="text-lg text-center mb-8">
            عذرًا، حدث خطأ غير متوقع.
            <br />
            الرجاء المحاولة مرة أخرى لاحقًا.
          </p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300 mb-4"
            onClick={() => reset()}
          >
            حاول مرة أخرى
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition duration-300"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </body>
    </html>
  );
} 