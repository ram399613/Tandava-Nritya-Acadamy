import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['student', 'instructor', 'admin']).default('student'),
  danceExperience: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }).optional(),
});

export const courseSchema = z.object({
  name: z.string().min(3, 'Course name must be at least 3 characters'),
  category: z.enum(['hip-hop', 'ballet', 'contemporary', 'salsa', 'jazz', 'freestyle', 'bharatanatyam', 'classical']),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']).default('all-levels'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  fee: z.number().nonnegative('Fee must be a positive number'),
  duration: z.object({
    value: z.number().positive(),
    unit: z.enum(['weeks', 'months']).default('months'),
  }),
  capacity: z.number().int().positive('Capacity must be at least 1'),
  studio: z.string().default('Studio Nova (A)'),
});

export const timetableSchema = z.object({
  courseId: z.string().optional(),
  courseName: z.string(),
  instructorId: z.string().optional(),
  instructorName: z.string(),
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  startTime: z.string(),
  endTime: z.string(),
  studio: z.string(),
  maxCapacity: z.number().default(25),
});

export const attendanceSchema = z.object({
  classSessionId: z.string().optional(),
  courseName: z.string().optional(),
  studentId: z.string(),
  studentName: z.string().optional(),
  status: z.enum(['present', 'absent', 'late']),
  notes: z.string().optional(),
});
