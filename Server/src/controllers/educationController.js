const mongoose = require('mongoose');
const {
  Course,
  Enrollment,
  Test,
  TestResult,
  Certificate,
  Note,
  TeacherEarning
} = require('../models/education.model');
const User = require('../models/user.model'); // if needed

// ======================
// COURSE CONTROLLERS
// ======================

// @desc    Create a new course (Teacher/Admin only)
// @route   POST /api/education/courses
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, duration, level, category, syllabus, isLive, liveSchedule } = req.body;
    const instructor = req.user.id;

    const course = await Course.create({
      title,
      description,
      price,
      duration,
      level,
      category,
      instructor,
      syllabus: syllabus || [],
      isLive: isLive || false,
      liveSchedule: liveSchedule || null,
      isPublished: false
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all published courses (with filters) – supports ?myCourses=true for teacher
// @route   GET /api/education/courses
exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 10, myCourses } = req.query;
    let filter = { isPublished: true };

    // If teacher requests only their own courses (for dashboard)
    if (myCourses === 'true' && req.user) {
      filter = { instructor: req.user.id };
      // Also include unpublished courses for teacher
      delete filter.isPublished;
    }

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.$text = { $search: search };

    const courses = await Course.find(filter)
      .populate('instructor', 'fullName email profileImage')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: courses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/education/courses/:id
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'fullName email profileImage')
      .populate('reviews.user', 'fullName profileImage');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course (Teacher/Admin only)
// @route   PUT /api/education/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete course (Admin only)
// @route   DELETE /api/education/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// ENROLLMENT CONTROLLERS
// ======================

// @desc    Enroll user into a course (payment assumed)
// @route   POST /api/education/enroll/:courseId
exports.enrollCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) throw new Error('Course not found');

    const alreadyEnrolled = await Enrollment.findOne({ user: userId, course: courseId });
    if (alreadyEnrolled) throw new Error('Already enrolled');

    // Deduct wallet or handle payment here (integrate finance module)
    // For demo, assume payment success

    const enrollment = await Enrollment.create([{
      user: userId,
      course: courseId,
      progress: 0,
      completed: false
    }], { session });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } }, { session });

    // Teacher earning (example: 70% of course price)
    const teacherCommission = course.price * 0.7;
    await TeacherEarning.create([{
      teacher: course.instructor,
      course: courseId,
      amount: teacherCommission,
      type: 'enrollment',
      status: 'pending'
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: enrollment[0] });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/education/my-courses
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course progress
// @route   PUT /api/education/progress/:enrollmentId
exports.updateProgress = async (req, res) => {
  try {
    const { progress, completedLessons } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    if (enrollment.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });

    enrollment.progress = progress;
    if (completedLessons) enrollment.completedLessons = completedLessons;
    if (progress === 100) enrollment.completed = true;

    await enrollment.save();
    res.json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// TEST CONTROLLERS
// ======================

// @desc    Create a test (Teacher/Admin)
// @route   POST /api/education/tests
exports.createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tests for a course
// @route   GET /api/education/tests/course/:courseId
exports.getTestsByCourse = async (req, res) => {
  try {
    const tests = await Test.find({ course: req.params.courseId, isPublished: true });
    res.json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW: Get a single test by ID (for taking the test)
// @route   GET /api/education/tests/:testId
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).populate('course', 'title');
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    // Optionally check if user is enrolled in the course
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a test
// @route   POST /api/education/tests/:testId/submit
exports.submitTest = async (req, res) => {
  try {
    const { answers, startedAt } = req.body;
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

    let score = 0;
    const userAnswers = [];

    test.questions.forEach((q, idx) => {
      const selected = answers[idx];
      const isCorrect = (selected === q.correctOption);
      if (isCorrect) score += q.marks;
      userAnswers.push({ questionId: idx, selectedOption: selected, isCorrect });
    });

    const totalMarks = test.totalMarks;
    const percentage = (score / totalMarks) * 100;
    const passed = percentage >= test.passingMarks;

    const result = await TestResult.create({
      user: req.user.id,
      test: test._id,
      score,
      totalMarks,
      percentage,
      passed,
      answers: userAnswers,
      startedAt: startedAt || new Date(),
      submittedAt: new Date()
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's test results
// @route   GET /api/education/my-results
exports.getMyResults = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user.id })
      .populate('test', 'title course')
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// CERTIFICATE CONTROLLERS
// ======================

// @desc    Generate certificate after course completion
// @route   POST /api/education/certificates/:courseId/generate
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId, completed: true });
    if (!enrollment) return res.status(400).json({ success: false, message: 'Course not completed' });

    const existing = await Certificate.findOne({ user: userId, course: courseId });
    if (existing) return res.json({ success: true, data: existing, message: 'Certificate already exists' });

    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      certificateId,
      downloadUrl: `https://api.example.com/certificates/${certificateId}` // placeholder
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my certificates
// @route   GET /api/education/my-certificates
exports.getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.user.id }).populate('course', 'title');
    res.json({ success: true, data: certs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW: Get a single certificate by ID
// @route   GET /api/education/certificates/:certId
exports.getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.certId)
      .populate('user', 'fullName email')
      .populate('course', 'title');
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });

    // Ensure the requesting user owns the certificate or is admin
    if (certificate.user._id.toString() !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// NOTES CONTROLLERS
// ======================

// @desc    Upload note (Teacher/Admin)
// @route   POST /api/education/notes
exports.uploadNote = async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, uploadedBy: req.user.id });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notes for a course
// @route   GET /api/education/notes/course/:courseId
exports.getNotesByCourse = async (req, res) => {
  try {
    const notes = await Note.find({ course: req.params.courseId }).populate('uploadedBy', 'fullName');
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// TEACHER EARNINGS
// ======================

// @desc    Get teacher earnings
// @route   GET /api/education/teacher/earnings
exports.getTeacherEarnings = async (req, res) => {
  try {
    const earnings = await TeacherEarning.find({ teacher: req.user.id })
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    const total = earnings.reduce((sum, e) => sum + e.amount, 0);
    res.json({ success: true, data: { earnings, total } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};