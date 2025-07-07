import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { 
      fullName,
      ageCategory,
      gender,
      phone,
      email,
      educationLevel,
      previousExperience,
      organizationName,
      interestAreas,
    } = body;

    // Basic validation
    if (!fullName || !ageCategory || !gender || !phone || !email || !educationLevel || !interestAreas) {
      return NextResponse.json({ error: 'جميع الحقول المطلوبة غير متوفرة.' }, { status: 400 });
    }

    const newApplication = await prisma.volunteerApplication.create({
      data: {
        fullName,
        ageCategory,
        gender,
        phone,
        email,
        educationLevel,
        previousExperience,
        organizationName,
        interestAreas,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error: any) {
    console.error('خطأ في معالجة طلب التطوع:', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await prisma.volunteerApplication.findMany();
    return NextResponse.json(applications, { status: 200 });
  } catch (error: any) {
    console.error('خطأ في جلب طلبات التطوع:', error);
    return NextResponse.json({ error: 'خطأ داخلي في الخادم', details: error.message }, { status: 500 });
  }
} 