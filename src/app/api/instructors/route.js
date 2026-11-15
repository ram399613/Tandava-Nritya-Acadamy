import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Instructor from '@/models/Instructor';
import { getAuthUser } from '@/lib/auth';

const SEED_INSTRUCTORS = [
  {
    _id: 'ins_1',
    firstName: 'Marcus',
    lastName: 'Cole',
    fullName: 'Marcus Cole',
    email: 'marcus@danceacademy.com',
    phone: '+1 555-0201',
    specialties: ['hip-hop', 'freestyle'],
    experience: 12,
    assignedCourses: ['Urban Hip-Hop Immersion', 'Freestyle Dance & Battle Concepts'],
  },
  {
    _id: 'ins_2',
    firstName: 'Isabella',
    lastName: 'Rossi',
    fullName: 'Isabella Rossi',
    email: 'isabella@danceacademy.com',
    phone: '+1 555-0202',
    specialties: ['ballet', 'contemporary'],
    experience: 15,
    assignedCourses: ['Classical Ballet & Pointe Mastery', 'Contemporary Movement & Fluidity'],
  },
  {
    _id: 'ins_3',
    firstName: 'Priya',
    lastName: 'Nair',
    fullName: 'Priya Nair',
    email: 'priya@danceacademy.com',
    phone: '+1 555-0203',
    specialties: ['bharatanatyam', 'classical'],
    experience: 10,
    assignedCourses: ['Bharatanatyam Heritage & Adavus'],
  },
  {
    _id: 'ins_4',
    firstName: 'Carlos',
    lastName: 'Rivera',
    fullName: 'Carlos Rivera',
    email: 'carlos@danceacademy.com',
    phone: '+1 555-0204',
    specialties: ['salsa', 'jazz'],
    experience: 9,
    assignedCourses: ['Salsa & Latin Ballroom Styling'],
  },
];

export async function GET() {
  try {
    await dbConnect();
    let instructors = [];
    try {
      instructors = await User.find({ role: 'instructor', isActive: true }).select('-password');
    } catch (_) {}

    if (!instructors || instructors.length === 0) {
      const formatted = SEED_INSTRUCTORS.map(i => ({ ...i, name: i.name || i.fullName || `${i.firstName} ${i.lastName}` }));
      return NextResponse.json({ success: true, count: formatted.length, instructors: formatted, data: formatted });
    }

    const formatted = instructors.map(i => {
      const doc = i.toObject ? i.toObject() : i;
      return { ...doc, name: doc.name || doc.fullName || `${doc.firstName || ''} ${doc.lastName || ''}`.trim() };
    });
    return NextResponse.json({ success: true, count: formatted.length, instructors: formatted, data: formatted });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden. Admin required.' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      password: body.password || 'password123',
      role: 'instructor',
    });

    await Instructor.create({
      user: user._id,
      experience: Number(body.experience) || 5,
      specializations: body.specialties ? body.specialties.split(',').map((s) => s.trim().toLowerCase()) : ['hip-hop'],
    });

    return NextResponse.json({ success: true, message: 'Instructor added successfully', data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
