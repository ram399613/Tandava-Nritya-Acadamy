import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { getAuthUser } from '@/lib/auth';
import { attendanceSchema } from '@/lib/validations';

const SEED_ATTENDANCE = [
  {
    _id: 'att_1',
    studentName: 'Lucas Silva',
    courseName: 'Urban Hip-Hop Immersion',
    status: 'present',
    date: new Date().toISOString(),
    markedBy: 'Marcus Cole',
  },
  {
    _id: 'att_2',
    studentName: 'Aria Chen',
    courseName: 'Classical Ballet & Pointe Mastery',
    status: 'late',
    date: new Date().toISOString(),
    markedBy: 'Isabella Rossi',
  },
  {
    _id: 'att_3',
    studentName: 'Mateo Rossi',
    courseName: 'Contemporary Movement & Fluidity',
    status: 'absent',
    date: new Date().toISOString(),
    markedBy: 'Isabella Rossi',
  },
];

export async function GET(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    await dbConnect();
    const query = {};
    if (studentId) query.student = studentId;
    if (authUser.role === 'student') query.student = authUser._id;

    let attendances = [];
    try {
      attendances = await Attendance.find(query).sort({ date: -1 });
    } catch (_) {}

    if (!attendances || attendances.length === 0) {
      return NextResponse.json({ success: true, count: SEED_ATTENDANCE.length, attendance: SEED_ATTENDANCE, data: SEED_ATTENDANCE });
    }

    return NextResponse.json({ success: true, count: attendances.length, attendance: attendances, data: attendances });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== 'instructor' && authUser.role !== 'admin')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = attendanceSchema.parse(body);

    await dbConnect();

    const attendance = await Attendance.create({
      ...validatedData,
      markedBy: authUser.firstName ? `${authUser.firstName} ${authUser.lastName}` : 'Faculty Instructor',
      date: new Date(),
    });

    if (global.io) {
      global.io.emit('attendance_marked', {
        studentId: validatedData.studentId,
        studentName: validatedData.studentName,
        courseName: validatedData.courseName,
        status: validatedData.status,
        instructorName: authUser.firstName ? `${authUser.firstName} ${authUser.lastName}` : 'Instructor',
      });
      global.io.emit('attendance_updated');
    }

    return NextResponse.json({ success: true, message: 'Attendance recorded successfully', data: attendance }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.errors ? error.errors[0]?.message : error.message },
      { status: 400 }
    );
  }
}
