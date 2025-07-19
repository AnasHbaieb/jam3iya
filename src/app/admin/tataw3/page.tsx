'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface VolunteerApplication {
  id: number;
  fullName: string;
  ageCategory: string;
  gender: string;
  phone: string;
  email: string;
  educationLevel: string;
  previousExperience: string | null;
  organizationName: string | null;
  interestAreas: string[];
  createdAt: string;
}

const AdminVolunteerApplicationsPage = () => {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/volunteer-applications');
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        } else {
          const errorData = await res.json();
          setError(`فشل جلب البيانات: ${errorData.error || 'خطأ غير معروف'}`);
        }
      } catch (err: unknown) {
        setError(`خطأ في الاتصال: ${(err instanceof Error) ? err.message : 'الرجاء المحاولة لاحقاً.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">خطأ: {error}</div>;
  }

  const formatAgeCategory = (category: string) => {
    switch (category) {
      case 'under16': return 'دون 16 سنة';
      case '16-35': return 'بين 16 و 35 سنة';
      case 'over35': return 'فوق 35 سنة';
      default: return category;
    }
  };

  const formatGender = (gender: string) => {
    switch (gender) {
      case 'male': return 'ذكر';
      case 'female': return 'أنثى';
      default: return gender;
    }
  };

  const formatEducationLevel = (level: string) => {
    switch (level) {
      case 'middle': return 'دون الثانوي';
      case 'secondary': return 'ثانوي';
      case 'university': return 'جامعي';
      case 'other': return 'آخر';
      default: return level;
    }
  };

  const formatInterestAreas = (areas: string[]) => {
    const areaMap: { [key: string]: string } = {
      activitiesCampaigns: 'الفعاليات والحملات',
      transportDelivery: 'النقل والتوصيل',
      mediaDocumentation: 'الإعلام والتوثيق',
      consultationsExchange: 'الاستشارات وتبادل الآراء',
      administrativeOfficeWork: 'العمل الإداري والمكتبي',
      supportFunding: 'الدعم والتمويل',
      fieldSurveys: 'المعاينات الميدانية',
      other: 'مجالات أخرى',
    };
    return areas.map(area => areaMap[area] || area).join(', ');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700 text-center">بيانات طلبات التطوع</h1>
        <Link href="/" className="text-green-600 hover:text-green-800">
          {/* أيقونة العين */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
      
      {applications.length === 0 ? (
        <p className="text-center text-gray-600">لا توجد طلبات تطوع حالياً.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-right">الاسم واللقب</th>
                <th className="py-3 px-4 text-right">الفئة العمرية</th>
                <th className="py-3 px-4 text-right">الجنس</th>
                <th className="py-3 px-4 text-right">الهاتف</th>
                <th className="py-3 px-4 text-right">البريد الالكتروني</th>
                <th className="py-3 px-4 text-right">المستوى الدراسي</th>
                <th className="py-3 px-4 text-right">الخبرة السابقة</th>
                <th className="py-3 px-4 text-right">اسم المنظمة</th>
                <th className="py-3 px-4 text-right">مجالات الاهتمام</th>
                <th className="py-3 px-4 text-right">تاريخ الإرسال</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{app.fullName}</td>
                  <td className="py-3 px-4">{formatAgeCategory(app.ageCategory)}</td>
                  <td className="py-3 px-4">{formatGender(app.gender)}</td>
                  <td className="py-3 px-4">{app.phone}</td>
                  <td className="py-3 px-4">{app.email}</td>
                  <td className="py-3 px-4">{formatEducationLevel(app.educationLevel)}</td>
                  <td className="py-3 px-4">{app.previousExperience || 'لا يوجد'}</td>
                  <td className="py-3 px-4">{app.organizationName || 'لا يوجد'}</td>
                  <td className="py-3 px-4">{formatInterestAreas(app.interestAreas)}</td>
                  <td className="py-3 px-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminVolunteerApplicationsPage;
