'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const VolunteerFormPage = () => {
  const [fullName, setFullName] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [hasPreviousExperience, setHasPreviousExperience] = useState('no');
  const [previousExperience, setPreviousExperience] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [interestAreas, setInterestAreas] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setInterestAreas((prev) =>
      checked ? [...prev, value] : prev.filter((area) => area !== value)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const formData = {
      fullName,
      ageCategory,
      gender,
      phone,
      email,
      educationLevel,
      previousExperience: hasPreviousExperience === 'yes' ? previousExperience : null,
      organizationName: hasPreviousExperience === 'yes' ? organizationName : null,
      interestAreas,
    };

    try {
      const res = await fetch('/api/volunteer-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('تم إرسال طلبك بنجاح!');
        router.push('/'); // Redirect or show success message
      } else {
        const errorData = await res.json();
        setMessage(`فشل الإرسال: ${errorData.error || 'خطأ غير معروف'}`);
      }
    } catch (error: any) {
      setMessage(`خطأ في الاتصال: ${error.message || 'الرجاء المحاولة لاحقاً.'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">استمارة تطوع</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">المعلومات الشخصية</h2>
        
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">الاسم واللقب:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ageCategory" className="block text-gray-700 text-sm font-bold mb-2">الفئة العمرية:</label>
          <select
            id="ageCategory"
            value={ageCategory}
            onChange={(e) => setAgeCategory(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">اختر فئة العمر</option>
            <option value="under16">دون 16 سنة</option>
            <option value="16-35">بين 16 و 35 سنة</option>
            <option value="over35">فوق 35 سنة</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">الجنس:</label>
          <div className="mt-2">
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                className="form-radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <span className="ml-2">ذكر</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
                required
              />
              <span className="ml-2">أنثى</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">الهاتف:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">البريد الالكتروني:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="educationLevel" className="block text-gray-700 text-sm font-bold mb-2">المستوى الدراسي:</label>
          <select
            id="educationLevel"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">اختر مستوى التعليم</option>
            <option value="middle">دون الثانوي</option>
            <option value="secondary">ثانوي</option>
            <option value="university">جامعي</option>
            <option value="other">آخر</option>
          </select>
        </div>

        <h2 className="text-xl font-semibold text-orange-600 mb-4">الخبرات التطوعية والاهتمامات</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">هل لديك خبرة سابقة في العمل التطوعي؟ (نعم/لا)</label>
          <div className="mt-2">
            <label className="inline-flex items-center mr-6">
              <input
                type="radio"
                className="form-radio"
                name="hasPreviousExperience"
                value="yes"
                checked={hasPreviousExperience === 'yes'}
                onChange={(e) => setHasPreviousExperience(e.target.value)}
              />
              <span className="ml-2">نعم</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="hasPreviousExperience"
                value="no"
                checked={hasPreviousExperience === 'no'}
                onChange={(e) => {
                  setHasPreviousExperience(e.target.value);
                  setPreviousExperience('');
                  setOrganizationName('');
                }}
              />
              <span className="ml-2">لا</span>
            </label>
          </div>
        </div>

        {hasPreviousExperience === 'yes' && (
          <>
            <div className="mb-4">
              <label htmlFor="previousExperience" className="block text-gray-700 text-sm font-bold mb-2">إذا كانت الإجابة نعم نرجو منك تحديد طبيعة العمل التطوعي:</label>
              <textarea
                id="previousExperience"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="organizationName" className="block text-gray-700 text-sm font-bold mb-2">اذكر الجمعية أو المنظمة التي نشطت معها:</label>
              <input
                type="text"
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">ما هي المجالات التي ترغب في التطوع فيها؟</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="activitiesCampaigns"
                checked={interestAreas.includes('activitiesCampaigns')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">الفعاليات والحملات</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="transportDelivery"
                checked={interestAreas.includes('transportDelivery')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">النقل والتوصيل</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="mediaDocumentation"
                checked={interestAreas.includes('mediaDocumentation')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">الإعلام والتوثيق</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="consultationsExchange"
                checked={interestAreas.includes('consultationsExchange')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">الاستشارات وتبادل الآراء</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="administrativeOfficeWork"
                checked={interestAreas.includes('administrativeOfficeWork')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">العمل الإداري والمكتبي</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="supportFunding"
                checked={interestAreas.includes('supportFunding')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">الدعم والتمويل</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="fieldSurveys"
                checked={interestAreas.includes('fieldSurveys')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">المعاينات الميدانية</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                value="other"
                checked={interestAreas.includes('other')}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">مجالات أخرى</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          إرسال طلب التطوع
        </button>

        {message && (
          <p className="mt-4 text-center text-sm" style={{ color: message.includes('فشل') ? 'red' : 'green' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default VolunteerFormPage; 