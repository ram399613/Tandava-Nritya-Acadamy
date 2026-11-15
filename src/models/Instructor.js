import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specializations: [{
      type: String,
      enum: ['hip-hop', 'ballet', 'contemporary', 'salsa', 'jazz', 'freestyle', 'bharatanatyam', 'classical'],
    }],
    bio: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    qualifications: [{
      type: String,
    }],
    salary: {
      type: Number,
      default: 0,
    },
    assignedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Instructor || mongoose.model('Instructor', instructorSchema);
