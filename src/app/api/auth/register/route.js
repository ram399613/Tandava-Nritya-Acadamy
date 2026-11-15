import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Student from '@/models/Student';
import { hashPassword, signToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(req) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    await dbConnect();

    
    const existing = await User.findOne({ email: validatedData.email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email address' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const user = await User.create({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: hashedPassword,
      phone: validatedData.phone || '',
      role: validatedData.role || 'student',
    });

    if (user.role === 'student') {
      await Student.create({
        user: user._id,
        danceExperience: validatedData.danceExperience || 'beginner',
        emergencyContact: validatedData.emergencyContact || {},
      });
    }

    const tokenPayload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    const token = signToken(tokenPayload);

    const res = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      token,
      user: tokenPayload,
    }, { status: 201 });

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.errors ? error.errors[0]?.message : error.message },
      { status: 400 }
    );
  }
}
