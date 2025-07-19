import Header from "../components/Header";
import Footer from "../components/Footer";
import PublicContactForm from "./PublicContactForm";
import { createMessage } from "@/actions/contactActions";

export default function Contact() {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-b from-green-900 to-gold-900">
        <div className="max-w-6xl mx-auto w-full p-8">
          {/* Contact Info Cards */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-sky-400 text-4xl mb-4 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">مقرنا</h3>
                <p className="text-gray-600">طريق المهدية كم 6 نهج مكة المكرمة ساقية الدائر-صفاقس</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-sky-400 text-4xl mb-4 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">ارقام الهاتف</h3>
                <p className="text-gray-600">29214150 216+</p>
                <p className="text-gray-600">52778107 216+</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-sky-400 text-4xl mb-4 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">حساب الالكتروني</h3>
                <p className="text-gray-600">alkalimah.attaybah@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">تواصل معنا</h2>
            <PublicContactForm createMessageAction={createMessage} />
          </div>
        </div>
      </main>

      <Footer pageType="other" />
    </div>
  );
}
