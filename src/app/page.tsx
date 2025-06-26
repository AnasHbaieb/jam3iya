//page.tsx
"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import ProductCard from "./components/ProductCard";
import { useEffect, useState } from "react";
import Image from "next/image";
/*import QuickDonate from "./components/QuickDonate";
*/
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}



// قائمة الصور
const images = [
  "/3id lkbir.jpg",
  "/7afr abar.jpg",
  "/kiswat il 3aid.jpg",
  "/mi7t itlmi4.jpg",
  "/koft ram4an.jpg",
  "/ta7sin maskan.jpg",
  "/iftar saim.jpg",
  // أضف المزيد من الصور حسب الحاجة
];


// Page d'accueil de notre application
export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // تغيير الصورة كل 3 ثواني

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json(); // قراءة التفاصيل من الخادم
          throw new Error(errorData.error || 'فشل في جلب البيانات');
        }
        const data = await response.json();
        // الحصول على 3 من أحدث المنتجات التي تم وضع علامة عليها كجديدة
        const featured = data
          .filter((product: Product) => product.isNew)
          .sort((a: Product, b: Product) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        setFeaturedProducts(featured);
      } catch (err: unknown) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع'); // عرض الرسالة التفصيلية
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Header />
      <main className="flex-grow">
        <div className="relative z-50">
          {/*   <QuickDonate /> */}
        </div>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col items-center relative h-96 md:h-screen">
            <Image src={images[currentImageIndex]} alt="صورة متغيرة" layout="fill" objectFit="cover" /> 
          </div>
        </section>
        {/*<section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              مستجدات
            </h2>
            </div>
        </section>*/}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              مشاريعنا
            </h2>
            <div className="relative">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    const container = document.getElementById('projects-container');
                    if (container) container.scrollLeft -= 300;
                  }}
                  className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div id="projects-container" className="flex overflow-x-auto scroll-smooth gap-6 py-4 px-8 hide-scrollbar">
                  {/* عيد الأضحى */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {/* SVG أيقونة خروف */}
                       <svg
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 64 64"
                         width="64"
                         height="64"
                         fill="none"
                          >
                        <ellipse cx="32" cy="32" rx="20" ry="18" fill="#CDEAC0" />
                        <circle cx="20" cy="20" r="6" fill="#E6F2D9" />
                        <circle cx="28" cy="18" r="7" fill="#E6F2D9" />
                        <circle cx="36" cy="18" r="7" fill="#E6F2D9" />
                        <circle cx="44" cy="20" r="6" fill="#E6F2D9" />
                        <circle cx="24" cy="28" r="8" fill="#E6F2D9" />
                        <circle cx="40" cy="28" r="8" fill="#E6F2D9" />
                        <circle cx="32" cy="38" r="10" fill="#E6F2D9" />
                        <ellipse cx="32" cy="32" rx="12" ry="10" fill="#FFF" />
                        <circle cx="26" cy="30" r="2" fill="#333" />
                        <circle cx="38" cy="30" r="2" fill="#333" />
                        <ellipse cx="32" cy="38" rx="5" ry="3" fill="#666" />
                        <path d="M20 32 Q18 28 22 26" fill="#FFF" />
                        <path d="M44 32 Q46 28 42 26" fill="#FFF" />
                       </svg>

                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">عيد الأضحى</h3>
                      <p className="text-gray-600 text-center text-sm">
                        وصف مختصر لعيد الاضحى.
                      </p>
                     
                    </div>
                  </div>

                  {/* كفالة يتيم */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">كفالة يتيم</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر لكفالة يتيم.</p>
                    </div>
                  </div>

                  {/* حفر الأبار */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 384 512"><path fill="#157e1c" d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg>
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">حفر الأبار</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر لحفر الأبار.</p>
                    </div>
                  </div>

                  {/* العودة المدرسية */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 512 512"><path fill="#157e1c" d="M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z"/></svg>
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">العودة المدرسية</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر للعودة المدرسية.</p>
                    </div>
                  </div>

                  {/* كسوة العيد */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 640 512"><path fill="#157e1c" d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0l12.6 0c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7 480 448c0 35.3-28.7 64-64 64l-192 0c-35.3 0-64-28.7-64-64l0-250.3-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0l12.6 0z"/></svg>
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">كسوة العيد</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر لكسوة العيد.</p>
                    </div>
                  </div>

                  {/* منحة التلميذ و الطالب */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 448 512"><path fill="#157e1c" d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>                       
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">منحة التلميذ و الطالب</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر لمنحة التلميذ و الطالب.</p>
                    </div>
                  </div>

                  {/* تحسين مسكن */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 576 512"><path fill="#157e1c" d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>                       
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">تحسين مسكن</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر لتحسين مسكن.</p>
                    </div>
                  </div>

                  {/* افطار صائم */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 512 512"><path fill="#157e1c" d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32L8.6 224C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256l457.1 0c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28l-231.5 0c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z"/></svg>                       
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">افطار صائم</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر لافطار صائم.</p>
                    </div>
                  </div>

                  {/* قفة رمضان */}
                  <div className="flex-none w-72">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 384 512"><path fill="#157e1c" d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>                      
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">قفة رمضان</h3>
                      <p className="text-gray-600 text-center text-sm">وصف مختصر لقفة رمضان.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const container = document.getElementById('projects-container');
                    if (container) container.scrollLeft += 300;
                  }}
                  className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </section>
        
        {/* Produits en vedette */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
              مشاريع تحدث الان
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">لا يوجد منتج مميز في الوقت الحالي.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => {
                  // Debug log for development
                  console.log('Rendering product:', product);
                  return (
                    <ProductCard
                      key={product.id}
                      {...product}
                    />
                  );
                })}
              </div>
            )}
            <div className="text-center mt-8">
              <Link
                href="/produits"
                className="inline-block bg-amber-700 text-white px-6 py-3 rounded-md font-bold hover:bg-amber-600 transition-colors"
              >
                مشاهدة جميع المشاريع
              </Link>
            </div>
          </div>
        </section>
        {/* قسم الانخراط والتطوع */}
        <section className="py-12 bg-white">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* بطاقة الانخراط */}
      <div className="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl transition">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {/* أيقونة انخراط (أشخاص/مجموعة) */}
          <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">الانخراط</h3>
        <p className="text-gray-600">
          كن جزءًا من عائلتنا وساهم في دعم الأطفال والأسر عبر الانخراط في الجمعية والاستفادة من برامجنا ومبادراتنا المختلفة.
        </p>
      </div>
      {/* بطاقة التطوع */}
<div className="bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl transition">
  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
    {/* أيقونة تطوع جديدة (يدين تحمل قلب) */}
    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </div>
  <h3 className="text-xl font-bold mb-2">التطوع</h3>
  <p className="text-gray-600">
    شارك بوقتك وخبرتك وساعد في تحسين حياة الأطفال والأسر عبر برامجنا التطوعية المتنوعة.
  </p>
</div>

    </div>
  </div>
         </section>

      </main>
      <Footer />
    </div>
  );
}