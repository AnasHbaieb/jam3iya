"use client";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${!isAdminPage ? "bg-gradient-to-b from-[#14532d] to-[#ffffff] relative" : ""}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 