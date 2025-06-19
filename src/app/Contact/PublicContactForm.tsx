'use client';

import { useRef, useState, useTransition } from 'react';

// تعريف نوع الخصائص التي يستقبلها المكون
interface PublicContactFormProps {
  createMessageAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function PublicContactForm({ createMessageAction }: PublicContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null); // مرجع للنموذج لمسح الحقول
  const [isPending, startTransition] = useTransition(); // لإدارة حالة الانتظار
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMessage(null); // مسح الرسالة السابقة

    startTransition(async () => {
      const result = await createMessageAction(formData);
      if (result.success) {
        setMessage({ text: 'تم إرسال رسالتك بنجاح! شكرًا لتواصلك معنا.', type: 'success' });
        formRef.current?.reset(); // مسح حقول النموذج
      } else if (result.error) {
        setMessage({ text: result.error, type: 'error' });
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* عرض رسائل النجاح أو الخطأ */}
      {message && (
        <div
          className={`p-4 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          الاسم
        </label>
        <input
          id="name"
          type="text"
          name="name" // تأكد من وجود name
          required
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-70"
          placeholder="ادخل اسمك"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          البريد الالكتروني
        </label>
        <input
          id="email"
          type="email"
          name="email" // تأكد من وجود name
          required
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-70"
          placeholder="ادخل البريد الالكتروني"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          الرسالة
        </label>
        <textarea
          id="message"
          name="message" // تأكد من وجود name
          rows={4}
          required
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-70"
          placeholder="ادخل رسالتك..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'جار الإرسال...' : 'إرسال'}
      </button>
    </form>
  );
} 