import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

type FooterProps = {
  pageType?: 'home' | 'products' | 'other';
};

export default function Footer({ pageType = 'other' }: FooterProps) {
  return (
    <footer className='bg-green-800 text-white mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>        
         <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
           <h3 className='text-lg font-bold mb-4 text-amber-200'>معلومات عنا </h3>
            <p className='text-gray-100 text-sm font-bold'>
            الجمعية الخيرية الكلمة الطيبة هي جمعية خيرية تهدف إلى تحسين الحالة المعيشية للأفراد الضعيفين والمحتاجين في المجتمع.
            نحن نقدم مجموعة متنوعة من المساعدات والخدمات التي تساعد في تحسين حياة الأفراد الضعيفين والمحتاجين.
            </p>
            </div>
        <div>
          <h3 className='text-lg font-bold mb-4 text-amber-200'>روابط سريعة</h3>
          <ul className='space-y-2'>
            {pageType === 'products' ? (
              <>
                <li>
                  <Link href="/produits" className='text-gray-100 hover:text-amber-200 text-sm font-bold'>
                  انشطتنا
                  </Link>
                </li>
                <li>
                  <Link href="/Contact" className='text-gray-100 hover:text-amber-200 text-sm font-bold'>
                  الاتصال بنا
                  </Link>
                </li>
                <li>
                  <Link href="/" className='text-gray-100 hover:text-amber-200 text-sm font-bold'>
                  الرئيسية
                  </Link>
                </li>
              </>
            ) : (
              <>
              <li>
                  <Link href="/" className='text-gray-100 hover:text-amber-200 text-sm font-bold'>
                  الرئيسية
                  </Link>
                </li>
                <li>
                  <Link href="/produits" className='text-gray-100 hover:text-amber-200 text-sm font-bold'>
                  مشاريعنا
                  </Link>
                </li>
                <li>
                  <Link href="/Contact" className='text-gray-100 hover:text-amber-200 text-sm font-bold'>
                  الاتصال بنا
                  </Link>
                </li>
                
              </>
            )}
          </ul>
        </div>
        <div>
          <h3 className='text-lg font-bold mb-4 text-amber-200'>معلومات الاتصال</h3>
          <ul className='space-y-2 text-sm text-gray-100 font-bold'>
            <li className='flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-200" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=alkalimah.attaybah@gmail.com" className="hover:underline" target="_blank" rel="noopener noreferrer">alkalimah.attaybah@gmail.com</a>
            </li>
            <li className='flex items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-200" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                طريق المهدية كم 6 نهج مكة المكرمة ساقية الدائر-صفاقس
            </li>
            <li className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-200" viewBox="0 0 512 512" fill="currentColor">
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
              </svg>
              29214150 216+
            </li>
            <li className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-200" viewBox="0 0 512 512" fill="currentColor">
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
              </svg>
              52778107 216+
            </li>
          </ul>
        </div>
        <div>
          <h3 className='text-lg font-bold mb-4 text-amber-200'>تابعنا</h3>
          <div className="flex space-x-4">
            <a href="https://www.youtube.com/@الجمعيةالخيريةالكلمةالطيّبة" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-amber-200 transition-colors duration-300 transform hover:scale-110">
              <svg className="h-7 w-7" height="512px" enableBackground="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" width="512px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="_x33_95-youtube">
                  <g>
                    <path d="M476.387,144.888c-5.291-19.919-20.878-35.608-40.67-40.933C399.845,94.282,256,94.282,256,94.282    s-143.845,0-179.719,9.674c-19.791,5.325-35.378,21.013-40.668,40.933c-9.612,36.105-9.612,111.438-9.612,111.438    s0,75.334,9.612,111.438c5.29,19.92,20.877,34.955,40.668,40.281C112.155,417.719,256,417.719,256,417.719    s143.845,0,179.717-9.674c19.792-5.326,35.379-20.361,40.67-40.281c9.612-36.104,9.612-111.438,9.612-111.438    S485.999,180.994,476.387,144.888z" style={{fill: '#FF0000'}}/>
                    <polygon points="208.954,324.723 208.954,187.93 329.18,256.328" style={{fill: '#FFFFFF'}}/>
                  </g>
                </g>
                <g id="Layer_1"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/al.kalima.attaybah/" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-amber-200 transition-colors duration-300 transform hover:scale-110">
              <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" style={{fill: '#E1306C'}}/>
              </svg>
            </a>
            <a href="https://www.facebook.com/alklmt.altybt.72579/" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-amber-200 transition-colors duration-300 transform hover:scale-110">
              <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" style={{fill: '#1877F2'}}/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/alkalimah-attaybah-155016372/" target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:text-amber-200 transition-colors duration-300 transform hover:scale-110">
              <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" style={{fill: '#4695D6'}}/>
              </svg>
            </a>
          </div>
          {/* Google Map inside Follow Us section */}
          <div className="mt-4">
            <h4 className="text-md font-bold mb-2 text-amber-200">موقعنا</h4>
            <MapComponent />
          </div>
        </div>
      </div>
      <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm text-amber-200 font-bold">
          <p>2025 © جمعية الكلمة الطيبة all rights reserved by</p>
        </div>
      </div>
    </footer>
  );
}
