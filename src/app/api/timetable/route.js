import { NextResponse } from 'next/server';
import dbConnect, { isDbConnected } from '@/lib/mongodb';
import ClassSession from '@/models/ClassSession';
import { getAuthUser } from '@/lib/auth';

let SEED_TIMETABLE = [
  {
    _id: 's_1',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '09:30',
    courseTitle: 'Classical Russian Ballet & Pointe Mastery',
    instructorName: 'Isabella Rossi',
    studioRoom: 'Studio 4 (Ballet Barre Conservatory)',
    level: 'Advanced',
    icon: '🩰',
    maxCapacity: 20,
    enrolledCount: 16,
  },
  {
    _id: 's_2',
    dayOfWeek: 'Monday',
    startTime: '18:00',
    endTime: '19:30',
    courseTitle: 'Urban Hip-Hop & Street Choreography',
    instructorName: 'Marcus Cole',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'Intermediate',
    icon: '🔥',
    maxCapacity: 25,
    enrolledCount: 19,
  },
  {
    _id: 's_3',
    dayOfWeek: 'Monday',
    startTime: '20:00',
    endTime: '21:30',
    courseTitle: 'Jazz Funk & Commercial Stage Performance',
    instructorName: 'Chloe Bennett',
    studioRoom: 'Studio 2 (Mirror Suite)',
    level: 'Intermediate',
    icon: '🎷',
    maxCapacity: 24,
    enrolledCount: 21,
  },
  {
    _id: 's_4',
    dayOfWeek: 'Tuesday',
    startTime: '10:00',
    endTime: '11:30',
    courseTitle: 'Bharatanatyam Nritta & Classical Mudras',
    instructorName: 'Priya Nair',
    studioRoom: 'Studio 3 (Acoustic Sprung Floor)',
    level: 'Intermediate',
    icon: '🪔',
    maxCapacity: 18,
    enrolledCount: 14,
  },
  {
    _id: 's_5',
    dayOfWeek: 'Tuesday',
    startTime: '17:00',
    endTime: '18:45',
    courseTitle: 'Classical Russian Ballet & Pointe Mastery',
    instructorName: 'Isabella Rossi',
    studioRoom: 'Studio 4 (Ballet Barre Conservatory)',
    level: 'Advanced',
    icon: '🩰',
    maxCapacity: 20,
    enrolledCount: 16,
  },
  {
    _id: 's_6',
    dayOfWeek: 'Tuesday',
    startTime: '20:00',
    endTime: '21:30',
    courseTitle: 'Street Breaking, Power Moves & Battle Concepts',
    instructorName: 'Kenji Sato',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'All Levels',
    icon: '⚡',
    maxCapacity: 20,
    enrolledCount: 16,
  },
  {
    _id: 's_7',
    dayOfWeek: 'Wednesday',
    startTime: '18:00',
    endTime: '19:30',
    courseTitle: 'Urban Hip-Hop & Street Choreography',
    instructorName: 'Marcus Cole',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'Intermediate',
    icon: '🔥',
    maxCapacity: 25,
    enrolledCount: 19,
  },
  {
    _id: 's_8',
    dayOfWeek: 'Wednesday',
    startTime: '19:00',
    endTime: '20:30',
    courseTitle: 'Contemporary Flow & Lyrical Emotion',
    instructorName: 'Elena Vance',
    studioRoom: 'Studio 2 (Mirror Suite)',
    level: 'All Levels',
    icon: '🌊',
    maxCapacity: 22,
    enrolledCount: 20,
  },
  {
    _id: 's_9',
    dayOfWeek: 'Thursday',
    startTime: '17:00',
    endTime: '18:45',
    courseTitle: 'Classical Russian Ballet & Pointe Mastery',
    instructorName: 'Isabella Rossi',
    studioRoom: 'Studio 4 (Ballet Barre Conservatory)',
    level: 'Advanced',
    icon: '🩰',
    maxCapacity: 20,
    enrolledCount: 16,
  },
  {
    _id: 's_10',
    dayOfWeek: 'Thursday',
    startTime: '18:00',
    endTime: '19:30',
    courseTitle: 'Bharatanatyam Nritta & Classical Mudras',
    instructorName: 'Priya Nair',
    studioRoom: 'Studio 3 (Acoustic Sprung Floor)',
    level: 'Intermediate',
    icon: '🪔',
    maxCapacity: 18,
    enrolledCount: 14,
  },
  {
    _id: 's_11',
    dayOfWeek: 'Thursday',
    startTime: '20:30',
    endTime: '22:00',
    courseTitle: 'Heels Masterclass & Empower Choreography',
    instructorName: 'Sasha Fox',
    studioRoom: 'Studio 2 (Mirror Suite)',
    level: 'Intermediate',
    icon: '👠',
    maxCapacity: 20,
    enrolledCount: 17,
  },
  {
    _id: 's_12',
    dayOfWeek: 'Friday',
    startTime: '18:00',
    endTime: '19:30',
    courseTitle: 'Urban Hip-Hop & Street Choreography',
    instructorName: 'Marcus Cole',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'Intermediate',
    icon: '🔥',
    maxCapacity: 25,
    enrolledCount: 19,
  },
  {
    _id: 's_13',
    dayOfWeek: 'Friday',
    startTime: '19:30',
    endTime: '21:00',
    courseTitle: 'Salsa Cubana & Sensual Bachata Styling',
    instructorName: 'Carlos Rivera',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'Beginner',
    icon: '💃',
    maxCapacity: 30,
    enrolledCount: 26,
  },
  {
    _id: 's_14',
    dayOfWeek: 'Saturday',
    startTime: '10:00',
    endTime: '12:00',
    courseTitle: 'Kathak Heritage, Chakkars & Tatkar',
    instructorName: 'Dr. Meera Sen',
    studioRoom: 'Studio 3 (Acoustic Sprung Floor)',
    level: 'All Levels',
    icon: '🕉️',
    maxCapacity: 20,
    enrolledCount: 15,
  },
  {
    _id: 's_15',
    dayOfWeek: 'Saturday',
    startTime: '17:00',
    endTime: '18:30',
    courseTitle: 'Afrobeats, Amapiano & Dancehall Grooves',
    instructorName: 'Kwame Osei',
    studioRoom: 'Studio 5 (Rooftop Open Sky Deck)',
    level: 'All Levels',
    icon: '🌴',
    maxCapacity: 28,
    enrolledCount: 22,
  },
  {
    _id: 's_16',
    dayOfWeek: 'Saturday',
    startTime: '19:30',
    endTime: '21:00',
    courseTitle: 'Salsa Cubana & Sensual Bachata Styling',
    instructorName: 'Carlos Rivera',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'Beginner',
    icon: '💃',
    maxCapacity: 30,
    enrolledCount: 26,
  },
  {
    _id: 's_17',
    dayOfWeek: 'Sunday',
    startTime: '10:00',
    endTime: '12:00',
    courseTitle: 'Kathak Heritage, Chakkars & Tatkar',
    instructorName: 'Dr. Meera Sen',
    studioRoom: 'Studio 3 (Acoustic Sprung Floor)',
    level: 'All Levels',
    icon: '🕉️',
    maxCapacity: 20,
    enrolledCount: 15,
  },
  {
    _id: 's_18',
    dayOfWeek: 'Sunday',
    startTime: '11:00',
    endTime: '13:00',
    courseTitle: 'Bollywood Cinematic & Semi-Classical Fusion',
    instructorName: 'Rohit Joshi',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'All Levels',
    icon: '🎬',
    maxCapacity: 30,
    enrolledCount: 27,
  },
  {
    _id: 's_19',
    dayOfWeek: 'Sunday',
    startTime: '17:00',
    endTime: '18:30',
    courseTitle: 'Afrobeats, Amapiano & Dancehall Grooves',
    instructorName: 'Kwame Osei',
    studioRoom: 'Studio 5 (Rooftop Open Sky Deck)',
    level: 'All Levels',
    icon: '🌴',
    maxCapacity: 28,
    enrolledCount: 22,
  },
  {
    _id: 's_20',
    dayOfWeek: 'Monday',
    startTime: '19:00',
    endTime: '20:30',
    courseTitle: 'Spanish Flamenco & Passionate Zapateado',
    instructorName: 'Elena Gomez',
    studioRoom: 'Studio 3 (Acoustic Sprung Floor)',
    level: 'All Levels',
    icon: '🌹',
    maxCapacity: 18,
    enrolledCount: 13,
  },
  {
    _id: 's_21',
    dayOfWeek: 'Tuesday',
    startTime: '20:00',
    endTime: '21:30',
    courseTitle: 'Argentine Tango & Milonga Passion',
    instructorName: 'Mateo & Sofia',
    studioRoom: 'Studio 1 (Grand Hall)',
    level: 'Intermediate',
    icon: '🕺',
    maxCapacity: 24,
    enrolledCount: 19,
  },
  {
    _id: 's_22',
    dayOfWeek: 'Wednesday',
    startTime: '17:30',
    endTime: '19:00',
    courseTitle: 'Oriental Belly Dance & Silk Veil Flow',
    instructorName: 'Yasmin Al-Noor',
    studioRoom: 'Studio 2 (Mirror Suite)',
    level: 'All Levels',
    icon: '✨',
    maxCapacity: 22,
    enrolledCount: 17,
  },
  {
    _id: 's_23',
    dayOfWeek: 'Friday',
    startTime: '16:00',
    endTime: '18:00',
    courseTitle: 'Aerial Silks & Acrobatics Conservatory',
    instructorName: 'Aria Sterling',
    studioRoom: 'Studio 5 (Rooftop Open Sky Deck)',
    level: 'All Levels',
    icon: '🎪',
    maxCapacity: 12,
    enrolledCount: 10,
  },
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const day = searchParams.get('day');
    const studio = searchParams.get('studio');

    let conn = null;
    try {
      conn = await dbConnect();
    } catch (_) {}

    if (conn && isDbConnected()) {
      try {
        const query = { status: { $ne: 'cancelled' } };
        if (day && day !== 'All') query.dayOfWeek = new RegExp(day, 'i');
        if (studio && studio !== 'All') query.studio = new RegExp(studio, 'i');

        const sessions = await ClassSession.find(query);
        if (sessions && sessions.length > 0) {
          const formatted = sessions.map((s) => {
            const doc = s.toObject ? s.toObject() : s;
            return {
              ...doc,
              dayOfWeek: doc.dayOfWeek
                ? doc.dayOfWeek.charAt(0).toUpperCase() + doc.dayOfWeek.slice(1)
                : 'Monday',
              courseTitle: doc.courseName || doc.title,
              studioRoom: doc.studio || doc.studioRoom,
            };
          });
          return NextResponse.json({
            success: true,
            count: formatted.length,
            sessions: formatted,
            data: formatted,
          });
        }
      } catch (dbErr) {
        console.warn('DB timetable query failed, returning comprehensive schedule:', dbErr.message);
      }
    }

    let list = SEED_TIMETABLE;
    if (day && day !== 'All') {
      const dayLower = day.toLowerCase();
      list = list.filter((s) => s.dayOfWeek.toLowerCase() === dayLower);
    }
    if (studio && studio !== 'All') {
      const studioLower = studio.toLowerCase();
      list = list.filter((s) => s.studioRoom.toLowerCase().includes(studioLower));
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      sessions: list,
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

    
    const collision = SEED_TIMETABLE.find(
      (s) =>
        s.dayOfWeek.toLowerCase() === body.dayOfWeek.toLowerCase() &&
        s.studioRoom.toLowerCase() === body.studioRoom.toLowerCase() &&
        s.startTime === body.startTime
    );

    if (collision) {
      return NextResponse.json(
        {
          success: false,
          error: `Studio Collision Detected: ${body.studioRoom} is already booked on ${body.dayOfWeek} at ${body.startTime} for "${collision.courseTitle}".`,
        },
        { status: 409 }
      );
    }

    const newSession = {
      _id: 's_' + Date.now(),
      dayOfWeek: body.dayOfWeek.charAt(0).toUpperCase() + body.dayOfWeek.slice(1),
      startTime: body.startTime,
      endTime: body.endTime,
      courseTitle: body.courseTitle || 'Studio Dance Session',
      instructorName: body.instructorName || 'Faculty Instructor',
      studioRoom: body.studioRoom || 'Studio 1 (Grand Hall)',
      level: body.level || 'All Levels',
      icon: '🩰',
      maxCapacity: 20,
      enrolledCount: 0,
    };

    SEED_TIMETABLE.push(newSession);

    if (global.io) {
      global.io.emit('timetable_updated', SEED_TIMETABLE);
    }

    return NextResponse.json({
      success: true,
      message: 'Class session scheduled successfully',
      session: newSession,
      data: newSession,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
