import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getAuthUser } from '@/lib/auth';

const SEED_NOTIFS = [
  {
    _id: 'n_1',
    title: 'Spring Showcase 2026 Auditions Open!',
    message: 'Auditions for our annual academy showcase will take place next weekend across Studio Nova and Grand Hall.',
    priority: 'high',
    targetRole: 'all',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'n_2',
    title: 'Marley Sprung Floor Maintenance',
    message: 'Grand Hall B will undergo resurfacing on Sunday evening from 20:00 to 23:00. Classes will relocate to Studio A.',
    priority: 'medium',
    targetRole: 'all',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req) {
  try {
    const authUser = await getAuthUser(req);
    await dbConnect();

    const query = {
      $or: [{ targetRole: 'all' }, { targetRole: authUser?.role || 'student' }],
    };

    let notifications = [];
    try {
      notifications = await Notification.find(query).sort({ createdAt: -1 });
    } catch (_) {}

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({ success: true, count: SEED_NOTIFS.length, notifications: SEED_NOTIFS, data: SEED_NOTIFS });
    }

    return NextResponse.json({ success: true, count: notifications.length, notifications, data: notifications });
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

    const notification = await Notification.create(body);

    if (global.io) {
      global.io.emit('announcement_received', notification);
    }

    return NextResponse.json({ success: true, message: 'Notification broadcast successfully', data: notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
