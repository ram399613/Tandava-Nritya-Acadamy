import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import dbConnect, { isDbConnected } from '@/lib/mongodb';
import User from '@/models/User';
import Student from '@/models/Student';
import Instructor from '@/models/Instructor';

export async function GET(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    if (String(authUser._id).startsWith('demo_')) {
      return NextResponse.json({ success: true, user: authUser });
    }

    let conn = null;
    try {
      conn = await dbConnect();
    } catch (_) {}

    if (!conn || !isDbConnected()) {
      return NextResponse.json({ success: true, user: authUser });
    }

    try {
      const user = await User.findById(authUser._id).select('-password');
      if (!user) {
        return NextResponse.json({ success: true, user: authUser });
      }

      let extraProfile = null;
      if (user.role === 'student') {
        extraProfile = await Student.findOne({ user: user._id });
      } else if (user.role === 'instructor') {
        extraProfile = await Instructor.findOne({ user: user._id });
      }

      return NextResponse.json({
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.fullName,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          profile: extraProfile,
        },
      });
    } catch (_) {
      return NextResponse.json({ success: true, user: authUser });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
