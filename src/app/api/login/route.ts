import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
    console.log("Login request received");
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            console.log("Returning 400: Email and password required");
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.log("Returning 500: Admin credentials not configured");
            return NextResponse.json(
                { error: 'Admin credentials not configured' },
                { status: 500 }
            );
        }

        // تحقق من البريد الإلكتروني وكلمة المرور للمدير أولاً
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign(
                {
                    userId: 'admin', // يمكنك استخدام معرف ثابت للمدير
                    email: ADMIN_EMAIL,
                    role: 'ADMIN',
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );
            console.log("Returning 200: Admin login successful");
            return NextResponse.json({
                user: { email: ADMIN_EMAIL, role: 'ADMIN' },
                token,
                message: 'Login successful',
            });
        }

        // إذا لم يكن الأدمن، ابحث في قاعدة البيانات
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            console.log("Returning 404: User not found");
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Returning 401: Invalid credentials");
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
        console.log("Returning 200: User login successful");
        return NextResponse.json({
            user: userWithoutPassword,
            token,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Login error:', error);
        console.log("Returning 500: Error during login");
        return NextResponse.json(
            { error: 'Error during login' },
            { status: 500 }
        );
    }
}