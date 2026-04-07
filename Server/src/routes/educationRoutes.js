const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyCourses,
  updateProgress,
  createTest,
  getTestsByCourse,
  submitTest,
  getMyResults,
  generateCertificate,
  getMyCertificates,
  uploadNote,
  getNotesByCourse,
  getTeacherEarnings
} = require('../controllers/educationController');

const { protect, authorize } = require('../middleware/auth'); // Placeholder middleware

// ======================
// COURSE ROUTES
// ======================
router.route('/courses')
  .get(getCourses)
  .post(protect, authorize('TEACHER', 'SUPER_ADMIN'), createCourse);

router.route('/courses/:id')
  .get(getCourseById)
  .put(protect, updateCourse)
  .delete(protect, authorize('SUPER_ADMIN'), deleteCourse);

// ======================
// ENROLLMENT ROUTES
// ======================
router.post('/enroll/:courseId', protect, enrollCourse);
router.get('/my-courses', protect, getMyCourses);
router.put('/progress/:enrollmentId', protect, updateProgress);

// ======================
// TEST ROUTES
// ======================
router.route('/tests')
  .post(protect, authorize('TEACHER', 'SUPER_ADMIN'), createTest);

router.get('/tests/course/:courseId', getTestsByCourse);
router.post('/tests/:testId/submit', protect, submitTest);
router.get('/my-results', protect, getMyResults);

// ======================
// CERTIFICATE ROUTES
// ======================
router.post('/certificates/:courseId/generate', protect, generateCertificate);
router.get('/my-certificates', protect, getMyCertificates);

// ======================
// NOTES ROUTES
// ======================
router.route('/notes')
  .post(protect, authorize('TEACHER', 'SUPER_ADMIN'), uploadNote);

router.get('/notes/course/:courseId', getNotesByCourse);

// ======================
// TEACHER EARNINGS
// ======================
router.get('/teacher/earnings', protect, authorize('TEACHER'), getTeacherEarnings);

module.exports = router;