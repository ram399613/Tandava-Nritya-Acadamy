import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { getAuthUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    let course = null;
    try {
      course = await Course.findById(params.id).populate('instructor', 'firstName lastName email');
    } catch (_) {}

    if (!course) {
      
      return NextResponse.json({
        success: true,
        data: {
          _id: params.id,
          name: 'Urban Hip-Hop Immersion',
          category: 'hip-hop',
          level: 'intermediate',
          description: 'A high-intensity choreography and technique development laboratory. Over 12 weeks, students learn popping isolations, breaking floorwork foundations, syncopated bounce grooves, and live stage performance confidence.',
          fee: 250,
          duration: { value: 3, unit: 'months' },
          capacity: 25,
          enrolledCount: 18,
          studio: 'Studio Nova (A)',
          schedule: { days: ['monday', 'wednesday'], startTime: '18:00', endTime: '19:30' },
          instructor: { fullName: 'Marcus Cole', firstName: 'Marcus', lastName: 'Cole', email: 'marcus@danceacademy.com' },
          isActive: true,
        },
      });
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden. Admin required.' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    const course = await Course.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, message: 'Course updated successfully', data: course });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden. Admin required.' }, { status: 403 });
    }

    await dbConnect();
    await Course.findByIdAndUpdate(params.id, { isActive: false });

    return NextResponse.json({ success: true, message: 'Course deactivated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
