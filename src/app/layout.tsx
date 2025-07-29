import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Kufi_Arabic, Cairo } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// إضافة خط عربي للنصوص العادية
const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-kufi',
});

// إضافة خط عربي للعناوين
const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: "الجمعية الخيرية الكلمة الطيبة",
  description: "موقع الجمعية الخيرية الكلمة الطيبة",
  icons: {
    icon: [
      {
        url: '/kalima.jpg',
        href: '/kalima.jpg',
      },
    ],
    apple: {
      url: '/kalima.jpg',
      href: '/kalima.jpg',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoKufiArabic.variable} ${cairo.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
