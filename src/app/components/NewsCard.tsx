import Image from "next/image";
import Link from "next/link";

export interface ContentPost {
  id: number;
  imageUrl?: string;
  title: string;
  category: string;
  date: string;
  excerpt?: string;
}

interface NewsCardProps {
  post: ContentPost;
  index: number; // To handle priority prop for Image
}

export function NewsCard({ post, index }: NewsCardProps) {
    return (
      <article 
        key={post.id} 
        className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105"
      >
        {/* Background Image */}
        <div className="relative h-80 w-full">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-110 transition-transform duration-700"
              priority={index < 2}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium opacity-80">لا توجد صورة</p>
              </div>
            </div>
          )}
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>
  
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Top Section - Date Badge */}
          <div className="flex justify-end">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-xl font-bold leading-none">
                  {(() => {
                    const date = new Date(post.date);
                    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
                  })()}
                </div>
              </div>
            </div>
          </div>
  
          {/* Bottom Section - Content */}
          <div className="text-white">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block bg-amber-500 text-white px-3 py-1 rounded text-sm font-medium">
                {post.category}
              </span>
            </div>
  
            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-shadow-lg">
              {post.title.replace(/\n/g, ' ')}
            </h3>
  
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-gray-200 text-sm mb-6 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            )}
  
            {/* CTA Button */}
            <Link href={`/news/${post.id}`} className="group/btn">
              <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transform transition-all duration-300 hover:scale-105 shadow-lg">
                <span className="ml-2">التفاصيل</span>
                <svg 
                  className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </article>
  );
}