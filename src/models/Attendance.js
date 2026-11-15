import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    classSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassSession',
    },
    courseName: {
      type: String,
      default: '',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: true,
    },
    markedBy: {
      type: String,
      default: 'Instructor',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ student: 1, date: 1 });

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
