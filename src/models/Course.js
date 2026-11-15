import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: 3000,
    },
    category: {
      type: String,
      required: [true, 'Dance category is required'],
      enum: ['hip-hop', 'ballet', 'contemporary', 'salsa', 'jazz', 'freestyle', 'bharatanatyam', 'classical'],
    },
    level: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'all-levels',
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fee: {
      type: Number,
      required: [true, 'Course fee is required'],
      min: 0,
    },
    duration: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['weeks', 'months'], default: 'months' },
    },
    capacity: {
      type: Number,
      required: [true, 'Course capacity is required'],
      min: 1,
    },
    enrolledCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    studio: {
      type: String,
      default: 'Studio Nova (A)',
    },
    schedule: {
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      }],
      startTime: { type: String, default: '18:00' },
      endTime: { type: String, default: '19:30' },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ isActive: 1 });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
