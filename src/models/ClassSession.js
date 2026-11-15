import mongoose from 'mongoose';

const classSessionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    courseName: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    instructorName: {
      type: String,
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    studio: {
      type: String,
      required: true,
      default: 'Studio Nova (A)',
    },
    maxCapacity: {
      type: Number,
      default: 25,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

classSessionSchema.index({ dayOfWeek: 1, startTime: 1, studio: 1 });
classSessionSchema.index({ dayOfWeek: 1, startTime: 1, instructorName: 1 });

export default mongoose.models.ClassSession || mongoose.model('ClassSession', classSessionSchema);
