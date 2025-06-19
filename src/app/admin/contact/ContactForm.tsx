'use client';

import { useRef, useState, useTransition } from 'react';

// تعريف نوع الخصائص التي يستقبلها المكون
interface ContactFormProps {
  createMessageAction: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function ContactForm({ createMessageAction }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null); // مرجع للنموذج لمسح الحقول لاحقًا
  const [isPending, startTransition] = useTransition(); // لإدارة حالة الانتظار
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMessage(null); // مسح الرسالة السابقة

    startTransition(async () => {
      const result = await createMessageAction(formData);
      if (result.success) {
        setMessage({ text: 'تم إرسال الرسالة بنجاح!', type: 'success' });
        formRef.current?.reset(); // مسح حقول النموذج
      } else if (result.error) {
        setMessage({ text: result.error, type: 'error' });
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {message && (
        <div
          className={`p-3 rounded-md text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {message.text}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
        <input
          id="name"
          type="text"
          name="name"
          required
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="ادخل اسمك"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الالكتروني</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="ادخل البريد الالكتروني"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="ادخل رسالتك..."
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'جار الإرسال...' : 'إرسال'}
      </button>
    </form>
  );
} 