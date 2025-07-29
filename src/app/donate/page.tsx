"use client";
import { useState, useEffect, Suspense } from "react";
import { products } from "../data/products";
import { useSearchParams, useRouter } from "next/navigation";

export default function DonatePageWrapper() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <DonatePage />
    </Suspense>
  );
}

function DonatePage() {
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // استخراج المعلمات مع trim()
  const initialProject = searchParams.get("project")?.trim() || "";
  const initialAmount = searchParams.get("amount") || "";

  const [selectedProject, setSelectedProject] = useState(initialProject);
  const [amount, setAmount] = useState(initialAmount);

  // تحديث الحالة عند تغيير المعلمات
  useEffect(() => {
    const project = searchParams.get("project")?.trim() || "";
    const amount = searchParams.get("amount") || "";
    setSelectedProject(project);
    setAmount(amount);
  }, [searchParams]);

  // التأكد من تطابق أسماء المشاريع مع القائمة
  const matchedProject = products.find(
    (p) => p.name.trim() === selectedProject.trim()
  );

  // تحديث القيمة الافتراضية إذا كان المشروع غير موجود
  useEffect(() => {
    if (!matchedProject && initialProject) {
      setSelectedProject("");
    }
  }, [matchedProject, initialProject]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !localStorage.getItem("user")) {
      const params = new URLSearchParams();
      if (selectedProject) params.append("project", selectedProject);
      if (amount) params.append("amount", amount.toString());
      const redirectUrl = `/donate?${params.toString()}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-xl mx-auto rounded-3xl shadow-lg p-8 border-2 border-amber-400">
          <h1 className="text-3xl font-extrabold text-green-800 text-center mb-2">
            صفحة التبرع
          </h1>
          <p className="text-center text-amber-700 font-bold mb-8">
            شارك في الخير وكن سببًا في تغيير حياة شخص محتاج
          </p>
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg p-4 text-center font-bold">
              شكراً لك على تبرعك!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-bold text-green-900">المبلغ (د.ت)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  placeholder="أدخل المبلغ"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-green-900">المشروع</label>
                <select
                  required
                  value={matchedProject ? selectedProject : ""}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="">اختر المشروع</option>
                  {products.map((project) => (
                    <option key={project.id} value={project.name.trim()}>
                      {project.name.trim()}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-700 via-amber-500 to-green-900 text-white font-extrabold text-xl shadow-lg hover:scale-105 transition"
              >
                تبرع الآن
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

