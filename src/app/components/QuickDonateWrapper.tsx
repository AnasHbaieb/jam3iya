"use client";
import QuickDonateWidget from "./QuickDonate";
import { usePathname } from "next/navigation";

export default function QuickDonateWrapper() {
  const pathname = usePathname();
  // أخفِ التبرع السريع في صفحات تسجيل الدخول وإنشاء الحساب
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }
  return <QuickDonateWidget />;
}