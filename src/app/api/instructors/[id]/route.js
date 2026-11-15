import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Instructor from '@/models/Instructor';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await User.findById(params.id).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'Instructor not found' }, { status: 404 });
    }

    const profile = await Instructor.findOne({ user: user._id });
    return NextResponse.json({ success: true, data: { ...user.toObject(), profile } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
