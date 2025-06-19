import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const { email, password, name } = body;

        console.log("Login request received for email:", email);

        if(!email || !password){
            return NextResponse.json(
            { error: 'Email and password are required'},
            { status: 400}
            );
        }

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Admin credentials not configured' },
                { status: 500 }
            );
        }

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // منطق تسجيل الدخول للمدير
            return NextResponse.json({
                user: { email: ADMIN_EMAIL, role: 'ADMIN' },
                message: 'Login successful',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdminRegistration = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name,
                role: isAdminRegistration ? 'ADMIN' : 'USER'
            }
        });
        
        const { password: _, ...userWithoutPassword } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json(
            {
                message: `User created successfully as ${isAdminRegistration ? 'ADMIN' : 'USER'}`,
                user: userWithoutPassword
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Error creating user' },
            { status: 500 }
        );
    }
}
//7ata nt4akar