import { NextResponse } from 'next/server';
import dbConnect, { isDbConnected } from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import Payment from '@/models/Payment';
import { getAuthUser } from '@/lib/auth';
import { createPendingInvoice } from '@/lib/payments-store';

if (!global._danceflowEnrollments) {
  global._danceflowEnrollments = [
    {
      _id: 'enr_1',
      student: { fullName: 'Lucas Silva', email: 'student@danceacademy.com', name: 'Lucas Silva' },
      studentName: 'Lucas Silva',
      course: { name: 'Urban Hip-Hop & Street Choreography', title: 'Urban Hip-Hop & Street Choreography', fee: 4500 },
      courseTitle: 'Urban Hip-Hop & Street Choreography',
      enrollmentDate: '2026-11-01',
      status: 'approved',
    },
    {
      _id: 'enr_2',
      student: { fullName: 'Ananya Sharma', email: 'ananya@example.com', name: 'Ananya Sharma' },
      studentName: 'Ananya Sharma',
      course: { name: 'Classical Russian Ballet & Pointe Mastery', title: 'Classical Russian Ballet & Pointe Mastery', fee: 6200 },
      courseTitle: 'Classical Russian Ballet & Pointe Mastery',
      enrollmentDate: '2026-11-03',
      status: 'approved',
    },
    {
      _id: 'enr_3',
      student: { fullName: 'Aarav Patel', email: 'aarav@example.com', name: 'Aarav Patel' },
      studentName: 'Aarav Patel',
      course: { name: 'Contemporary Flow & Lyrical Emotion', title: 'Contemporary Flow & Lyrical Emotion', fee: 4800 },
      courseTitle: 'Contemporary Flow & Lyrical Emotion',
      enrollmentDate: '2026-11-10',
      status: 'approved',
    },
  ];
}

export async function GET(req) {
  try {
    const authUser = await getAuthUser(req);

    let conn = null;
    try {
      conn = await dbConnect();
    } catch (_) {}

    if (conn && isDbConnected()) {
      try {
        const query = {};
        if (authUser && authUser.role === 'student') {
          query.student = authUser._id;
        }

        const enrollments = await Enrollment.find(query)
          .populate('student', 'firstName lastName fullName email')
          .populate('course', 'name title fee duration durationWeeks category level photo')
          .sort({ createdAt: -1 });

        if (enrollments && enrollments.length > 0) {
          return NextResponse.json({
            success: true,
            count: enrollments.length,
            enrollments,
            data: enrollments,
          });
        }
      } catch (dbErr) {
        console.warn('DB enrollment read notice:', dbErr.message);
      }
    }

    const list = global._danceflowEnrollments;
    return NextResponse.json({
      success: true,
      count: list.length,
      enrollments: list,
      data: list,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authUser = await getAuthUser(req);
    const body = await req.json();
    const { courseId } = body;

    const studentName = authUser?.fullName || `${authUser?.firstName || 'Lucas'} ${authUser?.lastName || 'Silva'}`.trim();
    const studentEmail = authUser?.email || 'student@danceacademy.com';
    const studentId = authUser?._id || 'std_3';

    let courseObj = null;

    
    try {
      const conn = await dbConnect();
      if (conn && isDbConnected() && courseId) {
        courseObj = await Course.findById(courseId);
      }
    } catch (_) {}

    
    if (!courseObj) {
      courseObj = {
        _id: courseId || 'crs_' + Date.now(),
        name: body.courseTitle || 'Academy Dance Discipline',
        title: body.courseTitle || 'Academy Dance Discipline',
        fee: Number(body.fee) || 4500,
        category: 'Dance',
        level: 'Intermediate',
      };
    }

    const courseTitle = courseObj.name || courseObj.title || 'Academy Dance Discipline';
    const courseFee = courseObj.fee || 4500;

    
    const existing = global._danceflowEnrollments.find(
      (e) => (e.student?.email === studentEmail || e.studentName === studentName) &&
             (e.courseTitle === courseTitle || e.course?.name === courseTitle)
    );

    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'You are already registered for this choreography course',
      }, { status: 400 });
    }

    
    const newEnrollment = {
      _id: `enr_${Date.now()}`,
      student: { fullName: studentName, email: studentEmail, name: studentName },
      studentName,
      course: {
        _id: courseId,
        name: courseTitle,
        title: courseTitle,
        fee: courseFee,
      },
      courseTitle,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    global._danceflowEnrollments.unshift(newEnrollment);

    
    const pendingInvoice = createPendingInvoice({
      studentName,
      studentId,
      courseTitle,
      courseId,
      amount: courseFee,
    });

    
    try {
      const conn = await dbConnect();
      if (conn && isDbConnected()) {
        await Enrollment.create({
          student: studentId,
          course: courseId,
          status: 'approved',
        });
        await Payment.create({
          student: studentId,
          studentName,
          course: courseId,
          courseName: courseTitle,
          amount: courseFee,
          status: 'pending',
          receiptNumber: pendingInvoice.transactionId,
        });
      }
    } catch (_) {}

    
    if (global.io) {
      global.io.emit('new_enrollment', newEnrollment);
      global.io.emit('enrollment_created', newEnrollment);
      global.io.emit('new_notification', {
        _id: `notif_${Date.now()}`,
        title: 'New Student Enrollment',
        message: `${studentName} enrolled in ${courseTitle}`,
        type: 'enrollment',
        createdAt: new Date().toISOString(),
        read: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Enrollment confirmed! Tuition invoice generated.',
      data: newEnrollment,
      enrollment: newEnrollment,
      invoice: pendingInvoice,
    }, { status: 201 });
  } catch (error) {
    console.error('Enrollment POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, status } = await req.json();
    const idx = global._danceflowEnrollments.findIndex((e) => e._id === id);
    if (idx !== -1) {
      global._danceflowEnrollments[idx].status = status;
    }

    try {
      const conn = await dbConnect();
      if (conn && isDbConnected()) {
        await Enrollment.findByIdAndUpdate(id, { status });
      }
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
