"use client";
import React, { useState } from "react";
import { MdOutlineTimer } from "react-icons/md";
import { products } from "../data/products"; // تأكد من استيراد المنتجات
import { usePathname } from "next/navigation"; // إذا كنت تستخدم Next.js 13+

// زر التبرع السريع الجديد (للشاشات الكبيرة)
const QuickDonateButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <>
    {/* زر دائري صغير للجوال مع نص أسفل الأيقونة */}
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        bg-amber-600 text-white shadow-lg cursor-pointer transition-all duration-200
        min-w-[60px] min-h-[60px] px-0 py-0 rounded-full
        hover:bg-amber-700 active:scale-95
        md:hidden
      `}
      style={{ border: "none", outline: "none" }}
    >
      <MdOutlineTimer size={32} className="mb-1 drop-shadow" />
      <span className="text-xs font-bold">تبرع</span>
    </button>

    {/* زر مربع مع سهم وأيقونة ونص للشاشات الكبيرة */}
    <button
      onClick={onClick}
      className={`
        hidden md:flex flex-col items-center justify-center
        bg-amber-600 text-white shadow-2xl cursor-pointer transition-all duration-200
        min-w-[120px] min-h-[90px] px-2 py-2
        rounded-r-2xl rounded-l-lg
        relative group
        hover:bg-amber-700 active:scale-95
      `}
      style={{
        boxShadow: "0 4px 16px rgba(161, 98, 7, 0.18)",
        border: "none",
        outline: "none"
      }}
      dir="rtl"
    >
      {/* السهم الجانبي */}
      <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </span>
      {/* الأيقونة */}
      <MdOutlineTimer size={36} className="mb-1 mt-1 drop-shadow" />
      {/* النص */}
      <span className="text-lg font-bold">تبرع سريع</span>
    </button>
  </>
);

// نموذج التبرع السريع
const DonateForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [selectedProject, setSelectedProject] = useState("عام");

  const handleAmountClick = (amt: number) => {
    setAmount(amt.toString());
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 min-w-[320px] mr-0 z-50" dir="rtl">
      {/* زر الرجوع دائري وبارز في الأعلى على اليسار */}
      <button
        onClick={onClose}
        className="absolute left-2 top-4 w-10 h-10 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full shadow hover:bg-amber-200 transition text-2xl"
        aria-label="إغلاق"
        type="button"
      >
        {/* سهم لليسار */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* محتوى النموذج */}
      <h3 className="font-bold mb-4 mt-2">اختر المبلغ</h3>
      <div className="flex gap-2 mb-4">
        {[500, 300, 100, 50].map((amt) => (
          <button
            key={amt}
            className="border border-amber-600 rounded-lg px-4 py-2 text-amber-600 font-bold hover:bg-amber-50 transition"
            onClick={() => handleAmountClick(amt)}
            type="button"
          >
            {amt}
          </button>
        ))}
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="د.ت"
          className="border rounded-lg px-2 py-2 w-20 text-right"
        />
      </div>
      <h3 className="font-bold mb-4">اختر المشروع</h3>
      <div className="mb-4">
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="w-full border rounded-lg px-2 py-2"
        >
          <option value="عام">عام</option>
          {products.map((project) => (
            <option key={project.id} value={project.name}>
              {project.name.trim()}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 mb-2">
        <button className="flex-1 bg-amber-600 text-white rounded-lg py-2 font-bold">تبرع</button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        * سيتم تخصيص هذا التبرع للكفالات والمشاريع الأكثر احتياجاً للدعم
      </p>
    </div>
  );
};

const QuickDonateWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.includes("admin")) {
    return null;
  }

  return (
    <div className="fixed right-0 top-1/4 z-50">
      <div className="relative overflow-hidden">
        {/* الزر لا يظهر إذا كان الفورم مفتوح */}
        {!open ? (
          <QuickDonateButton onClick={() => setOpen(true)} />
        ) : (
          <DonateForm onClose={() => setOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default QuickDonateWidget;