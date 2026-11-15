import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dbConnect, { isDbConnected } from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import Student from '@/models/Student';
import Instructor from '@/models/Instructor';
import ClassSession from '@/models/ClassSession';
import Payment from '@/models/Payment';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    let conn = null;
    try {
      conn = await dbConnect();
    } catch (_) {}

    const readyState = mongoose.connection ? mongoose.connection.readyState : 0;
    const connected = readyState === 1;
    const currentUri = process.env.MONGODB_URI || '';
    const isPlaceholder = currentUri.includes('placeholder') || !currentUri;

    let collections = [];
    if (connected && mongoose.connection.db) {
      try {
        const cols = await mongoose.connection.db.listCollections().toArray();
        collections = cols.map(c => c.name);
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      connected,
      readyState,
      isPlaceholder,
      databaseName: connected && mongoose.connection.db ? mongoose.connection.db.databaseName : 'dance_academy',
      collections,
      statusText: connected ? 'Connected to MongoDB Atlas Cluster' : isPlaceholder ? 'MongoDB URI has placeholder credentials' : 'Disconnected / Offline',
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { mongoUri, seedData = true } = await req.json();

    if (!mongoUri || !mongoUri.startsWith('mongodb')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid MongoDB connection string (e.g. mongodb+srv://...)' },
        { status: 400 }
      );
    }

    
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }

      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 12000,
        bufferCommands: false,
      });
    } catch (connErr) {
      return NextResponse.json(
        { success: false, message: `MongoDB Atlas connection failed: ${connErr.message}` },
        { status: 400 }
      );
    }

    
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      if (envContent.includes('MONGODB_URI=')) {
        envContent = envContent.replace(/MONGODB_URI=.*/g, `MONGODB_URI=${mongoUri}`);
      } else {
        envContent += `\nMONGODB_URI=${mongoUri}\n`;
      }

      fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
      process.env.MONGODB_URI = mongoUri;
    } catch (fsErr) {
      console.warn('Could not write to .env.local:', fsErr.message);
    }

    let seededCount = 0;

    
    if (seedData) {
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          const hashedPassword = await bcrypt.hash('password123', 10);

          await User.create([
            {
              name: 'Academy Administrator',
              email: 'admin@danceacademy.com',
              password: hashedPassword,
              role: 'admin',
            },
            {
              name: 'Marcus Cole',
              email: 'marcus@danceacademy.com',
              password: hashedPassword,
              role: 'instructor',
            },
            {
              name: 'Sophia Patel',
              email: 'student@danceacademy.com',
              password: hashedPassword,
              role: 'student',
            },
          ]);
          seededCount++;
        }
      } catch (seedErr) {
        console.warn('Seed notice:', seedErr.message);
      }
    }

    const cols = await mongoose.connection.db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB Atlas! Connection saved to .env.local',
      databaseName: mongoose.connection.db.databaseName,
      collections: cols.map(c => c.name),
      seededDefaultUsers: seededCount > 0,
    });
  } catch (err) {
    console.error('Setup MongoDB error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Setup failed' },
      { status: 500 }
    );
  }
}
