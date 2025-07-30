//page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsCard, ContentPost } from "./components/NewsCard";
/*import QuickDonate from "./components/QuickDonate";
*/
interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string | null;
  imageUrl: string | null;
  secondaryImageUrl: string | null;
  category: string;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  rang: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [contentPosts, setContentPosts] = useState<ContentPost[]>([]); // New state for content posts

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // تغيير الصورة كل 3 ثواني

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'فشل في جلب البيانات');
        }
        const data: Product[] = await response.json();
        // Sort products by rang property
        const sortedProducts = data.sort((a, b) => a.rang - b.rang);
        setProducts(sortedProducts);
      } catch (err: unknown) {
        console.error('Error:', err);
      }
    };

    const fetchContentPosts = async () => {
      try {
        const response = await fetch('/api/content-posts');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'فشل في جلب المستجدات');
        }
        const data: ContentPost[] = await response.json();
        setContentPosts(data);
      } catch (err: unknown) {
        console.error('Error fetching content posts:', err);
      }
    };

    fetchProducts();
    fetchContentPosts(); // Fetch content posts

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <main className="flex-grow">
        <div className="relative z-50">
          {/*   <QuickDonate /> */}
        </div>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col items-center relative h-72 md:h-96">
            <Image src={images[currentImageIndex]} alt="صورة متغيرة" fill style={{ objectFit: 'contain' }} priority={true} /> 
          </div>
        </section>
        <section className="py-12">
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
                
                <div id="projects-container" className="flex overflow-x-auto scroll-smooth gap-6 py-4 px-8 hide-scrollbar ">
                  {products.map((product) => (
                    <div key={product.id} className="flex-none w-72">
                      <div className="p-6 rounded-lg shadow-md bg-gray-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                          {product.secondaryImageUrl ? (
                            <Image
                              src={product.secondaryImageUrl}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: 'cover' }}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              لا توجد صورة
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-center text-sm">
                          {product.shortDescription || product.description}
                        </p>
                      </div>
                    </div>
                  ))}
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
        
        {/* قسم المستجدات */}
        {contentPosts.length > 0 && (
  <section className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          اخر المستجدات
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-amber-600 mx-auto rounded-full"></div>
      </div>
      
      {contentPosts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {contentPosts.map((post, index) => (
            <NewsCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  </section>
)}
        {/* قسم الانخراط والتطوع */}
        <section className="py-12">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* بطاقة الانخراط */}
      <div className="p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl transition w-100 h-60 bg-gray-100">
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
      <Link href="/tataw3" className="block">
<div className="p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl transition w-100 h-60 bg-gray-100">
  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
    {/* أيقونة تطوع جديدة  */}
    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </div>
  <h3 className="text-xl font-bold mb-2">التطوع</h3>
  <p className="text-gray-600">
    شارك بوقتك وخبرتك وساعد في تحسين حياة الأطفال والأسر عبر برامجنا التطوعية المتنوعة.
  </p>
</div>
</Link>
    </div>
  </div>
         </section>

      </main>
    </div>
  );
}