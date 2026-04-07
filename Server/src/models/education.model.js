const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  duration: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  category: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  syllabus: [{ title: String, description: String, videoUrl: String, duration: Number }],
  isLive: { type: Boolean, default: false },
  liveSchedule: { type: Date, default: null },
  isPublished: { type: Boolean, default: false },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number, comment: String, date: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completed: { type: Boolean, default: false },
  completedLessons: [{ type: String }],
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date,
  certificateIssued: { type: Boolean, default: false }
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  description: String,
  duration: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOption: { type: Number, required: true },
    marks: { type: Number, default: 1 }
  }],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const testResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  answers: [{ questionId: Number, selectedOption: Number, isCorrect: Boolean }],
  startedAt: Date,
  submittedAt: { type: Date, default: Date.now }
});

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  certificateId: { type: String, unique: true, required: true },
  issueDate: { type: Date, default: Date.now },
  downloadUrl: String,
  isVerified: { type: Boolean, default: true }
});

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  description: String,
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const teacherEarningSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['enrollment', 'commission', 'bonus'], default: 'enrollment' },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date
});

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1, isPublished: 1 });
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
testResultSchema.index({ user: 1, test: 1 }, { unique: true });
certificateSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = {
  Course: mongoose.model('Course', courseSchema),
  Enrollment: mongoose.model('Enrollment', enrollmentSchema),
  Test: mongoose.model('Test', testSchema),
  TestResult: mongoose.model('TestResult', testResultSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
  Note: mongoose.model('Note', noteSchema),
  TeacherEarning: mongoose.model('TeacherEarning', teacherEarningSchema)
};