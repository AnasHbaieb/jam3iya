"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsLoggedIn(!!localStorage.getItem("user"));
        }
    }, []);

    const handleUserIconClick = () => {
        if (isLoggedIn) {
            const confirmed = window.confirm("هل أنت متأكد من الغاء تسجيل الدخول؟");
            if (!confirmed) return;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            router.push("/");
        } else {
            router.push("/login");
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/kalima.jpg"
                                alt="شعار الجمعية"
                                width={60}
                                height={60}
                                className="ml-3 rounded-full"
                            />
                            <span className="text-3xl font-bold text-green-700 hover:text-green-400 arabic-title tracking-wide drop-shadow-md">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-amber-500">
                                    الجمعية الخيرية الكلمة الطيبة
                                </span>
                            </span>
                        </Link>
                    </div>
                    <button
                        className="md:hidden p-2 rounded focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="hidden md:flex items-center gap-8">
                        <div className="relative group">
                            <button className="text-gray-700 hover:text-amber-600 font-bold text-xl flex items-center">
                                من نحن
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                <div className="py-1">
                                    <Link href="/nous/about" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">تعريف الجمعية</Link>
                                    <Link href="/nous/ahdaf" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">أهداف الجمعية</Link>
                                    <Link href="/Contact" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">اتصل بنا</Link>
                                    <Link href="/nous/haykal" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">الهيكل الاداري</Link>
                                    <Link href="/nous/engagement" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">  الانخراط</Link>
                                    <Link href="/nous/raports" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">التقارير السنوية </Link>
                                </div>
                            </div>
                        </div>
                        <Link href="/produits" className="text-gray-700 hover:text-amber-600 font-bold text-xl">
                            المشاريع
                        </Link>
                        <Link href="/tataw3" className="text-gray-700 hover:text-amber-600 font-bold text-xl">
                            تطوع معنا
                        </Link>
                        <Link href="/new" className="text-gray-700 hover:text-amber-600 font-bold flex items-center text-xl">
                            مستجدات
                        </Link>
                        {   /*  <Link href="/donate" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-bold text-xl transition-colors duration-300">
                            تبرع
                        </Link>*/}
                    </div>
                    <div className="hidden md:block">
                        <button
                            onClick={handleUserIconClick}
                            className="ml-2 flex items-center justify-center p-2 rounded-full hover:bg-amber-100 transition"
                            title={isLoggedIn ? "تسجيل الخروج" : "تسجيل الدخول"}
                        >
                            {isLoggedIn ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-minus">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.009 .128" />
                                    <path d="M16 19h6" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-plus">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M16 19h6" />
                                    <path d="M19 16v6" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                {menuOpen && (
                    <div className="md:hidden mt-4 flex flex-col gap-4 bg-white rounded shadow p-4">
                        <div className="relative">
                            <button 
                                className="text-gray-700 hover:text-amber-600 font-bold text-xl flex items-center mb-2"
                                onClick={() => setAboutMenuOpen(!aboutMenuOpen)}
                            >
                                من نحن
                                <svg className={`w-4 h-4 mr-1 transition-transform ${aboutMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {aboutMenuOpen && (
                                <div className="flex flex-col gap-1 pl-4">
                                    <Link href="/nous/about" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">تعريف الجمعية</Link>
                                    <Link href="/nous/ahdaf" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">أهداف الجمعية</Link>
                                    <Link href="/Contact" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">اتصل بنا</Link>
                                    <Link href="/nous/haykal" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">الهيكل الإداري</Link>
                                    <Link href="/nous/engagement" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">الانخراط</Link>
                                    <Link href="/nous/raports" className="block px-4 py-2 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-100">التقارير السنوية</Link>
                                </div>
                            )}
                        </div>
                        <Link href="/produits" className="text-gray-700 hover:text-amber-600 font-bold text-xl">
                            المشاريع
                        </Link>
                        <Link href="/tataw3" className="text-gray-700 hover:text-amber-600 font-bold text-xl">
                            تطوع معنا
                        </Link>
                        <Link href="/new" className="text-gray-700 hover:text-amber-600 font-bold text-xl">
                            مستجدات
                        </Link>
                        {/* <Link href="/donate" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-bold text-xl transition-colors duration-300 text-center">
                            تبرع
                        </Link>*/}
                        <button
                            onClick={handleUserIconClick}
                            className="flex items-center justify-center p-2 rounded-full hover:bg-amber-100 transition"
                            title={isLoggedIn ? "تسجيل الخروج" : "تسجيل الدخول"}
                        >
                            {isLoggedIn ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-minus">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.009 .128" />
                                    <path d="M16 19h6" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-plus">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M16 19h6" />
                                    <path d="M19 16v6" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}