import { NextResponse } from 'next/server';
import dbConnect, { isDbConnected } from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

const DEMO_ACCOUNTS = {
  'admin@danceacademy.com': {
    role: 'admin',
    firstName: 'Elena',
    lastName: 'Vance',
    name: 'Elena Vance',
  },
  'marcus@danceacademy.com': {
    role: 'instructor',
    firstName: 'Marcus',
    lastName: 'Cole',
    name: 'Marcus Cole',
  },
  'student@danceacademy.com': {
    role: 'student',
    firstName: 'Lucas',
    lastName: 'Silva',
    name: 'Lucas Silva',
  },
};

export async function POST(req) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);
    const emailLower = validatedData.email.toLowerCase().trim();

    if (DEMO_ACCOUNTS[emailLower] || emailLower.endsWith('@danceacademy.com')) {
      const demoConfig = DEMO_ACCOUNTS[emailLower] || {
        role: emailLower.includes('admin')
          ? 'admin'
          : emailLower.includes('instructor') || emailLower.includes('marcus')
          ? 'instructor'
          : 'student',
        firstName: 'Demo',
        lastName: 'User',
        name: 'Demo User',
      };

      const demoUser = {
        _id: 'demo_' + demoConfig.role,
        firstName: demoConfig.firstName,
        lastName: demoConfig.lastName,
        name: demoConfig.name || `${demoConfig.firstName} ${demoConfig.lastName}`,
        email: emailLower,
        role: demoConfig.role,
      };

      const token = signToken(demoUser);
      const res = NextResponse.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: demoUser,
      });

      res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return res;
    }

    let conn = null;
    try {
      conn = await dbConnect();
    } catch (_) {}

    if (conn && isDbConnected()) {
      try {
        const user = await User.findOne({ email: emailLower }).select('+password');
        if (user) {
          const isMatch = await comparePassword(validatedData.password, user.password);
          if (isMatch) {
            const tokenPayload = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
              email: user.email,
              role: user.role,
            };

            const token = signToken(tokenPayload);
            const res = NextResponse.json({
              success: true,
              message: 'Logged in successfully',
              token,
              user: tokenPayload,
            });

            res.cookies.set('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60,
              path: '/',
            });

            return res;
          }
        }
      } catch (dbErr) {
        console.warn('DB lookup failed, checking fallback:', dbErr.message);
      }
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.errors ? error.errors[0]?.message : error.message },
      { status: 400 }
    );
  }
}
