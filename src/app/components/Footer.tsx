import Link from 'next/link';

type FooterProps = {
  pageType?: 'home' | 'products' | 'other';
};

export default function Footer({ pageType = 'other' }: FooterProps) {
  return (
    <footer className='bg-green-800 text-white mt-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>        
         <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
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
                alkalimah.attaybah@gmail.com
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
          </ul>
        </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm text-amber-200 font-bold">
          <p>2025 © جمعية الكلمة الطيبة all rights reserved by</p>
        </div>
        </div>
    </footer>
  );
}