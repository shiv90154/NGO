const express = require('express');
const router = express.Router();
const Student = require('../models/student.model');
const { protect } = require('../middleware/auth.middleware');
const asyncHandler = require('express-async-handler');

// Helper function for 404 responses
const throwIfNotFound = (resource, message = 'Not found') => {
    if (!resource) {
        const error = new Error(message);
        error.statusCode = 404;
        throw error;
    }
};

// ======================
// DASHBOARD
// ======================
router.get('/dashboard/:studentId', protect, asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.studentId)
        .select('learningStats enrolledCourses classAttendances academicRecords.notes')
        .populate([
            { path: 'enrolledCourses.courseId' },
            { path: 'classAttendances.classId' },
            { path: 'academicRecords.notes.courseRef' },
            { path: 'academicRecords.notes.classRef' }
        ]);

    throwIfNotFound(student, 'Student not found');

    res.json({
        stats: student.learningStats,
        courses: student.enrolledCourses,
        classes: student.classAttendances,
        notes: student.academicRecords.notes
    });
}));

// ======================
// PROFILE
// ======================
router.get('/profile/:studentId', protect, asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.studentId)
        .select('-password')
        .populate([
            { path: 'enrolledCourses.courseId' },
            { path: 'classAttendances.classId' },
            { path: 'academicRecords.notes.courseRef' },
            { path: 'academicRecords.notes.classRef' }
        ]);

    throwIfNotFound(student, 'Student not found');
    res.json(student);
}));

// ======================
// COURSES ROUTES
// ======================
router.route('/courses/:studentId')
    .get(protect, asyncHandler(async (req, res) => {
        const student = await Student.findById(req.params.studentId)
            .select('enrolledCourses')
            .populate('enrolledCourses.courseId');

        throwIfNotFound(student, 'Student not found');
        res.json(student.enrolledCourses);
    }));

router.route('/profile/:studentId')
    .get(protect, asyncHandler(async (req, res) => {
        const student = await Student.findById(req.params.studentId)
            .select('-password')
            .populate('enrolledCourses.courseId');

        throwIfNotFound(student, 'Student not found');
        res.json(student);
    }))
    .put(protect, asyncHandler(async (req, res) => {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.studentId,
            { $set: req.body },
            { new: true }
        ).select('-password');

        throwIfNotFound(updatedStudent, 'Student not found');
        res.json(updatedStudent);
    }));
router.post('/courses/enroll', protect, asyncHandler(async (req, res) => {
    const { studentId, courseId } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        {
            $addToSet: {
                enrolledCourses: {
                    courseId,
                    progress: 0,
                    completed: false,
                    enrolledAt: new Date()
                }
            }
        },
        { new: true }
    ).populate('enrolledCourses.courseId');

    throwIfNotFound(updatedStudent, 'Student not found');
    res.json(updatedStudent.enrolledCourses);
}));

router.patch('/courses/progress/:studentId', protect, asyncHandler(async (req, res) => {
    const { courseId, progress } = req.body;
    const student = await Student.findById(req.params.studentId);

    throwIfNotFound(student, 'Student not found');

    const course = student.enrolledCourses.find(
        c => c.courseId.toString() === courseId
    );
    throwIfNotFound(course, 'Course not found');

    course.progress = progress;
    course.completed = progress >= 100;
    course.lastAccessed = new Date();

    await student.save();
    res.json(course);
}));

// ======================
// CLASSES ROUTES
// ======================
router.route('/classes/:studentId')
    .get(protect, asyncHandler(async (req, res) => {
        const student = await Student.findById(req.params.studentId)
            .select('classAttendances')
            .populate('classAttendances.classId');

        throwIfNotFound(student, 'Student not found');
        res.json(student.classAttendances);
    }));

router.post('/classes/attendance', protect, asyncHandler(async (req, res) => {
    const { studentId, classId, attended, duration } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        {
            $push: {
                classAttendances: {
                    classId,
                    attended,
                    status: attended ? 'completed' : 'missed',
                    date: new Date(),
                    duration
                }
            }
        },
        { new: true }
    ).populate('classAttendances.classId');

    throwIfNotFound(updatedStudent, 'Student not found');

    // Update attendance stats
    const totalClasses = updatedStudent.classAttendances.length;
    const attendedClasses = updatedStudent.classAttendances.filter(c => c.attended).length;
    updatedStudent.learningStats.attendanceRate = Math.round((attendedClasses / totalClasses) * 100);

    await updatedStudent.save();
    res.json(updatedStudent.classAttendances);
}));

// ======================
// NOTES ROUTES
// ======================
router.route('/notes/:studentId')
    .get(protect, asyncHandler(async (req, res) => {
        const student = await Student.findById(req.params.studentId)
            .select('academicRecords.notes')
            .populate([
                { path: 'academicRecords.notes.courseRef' },
                { path: 'academicRecords.notes.classRef' }
            ]);

        throwIfNotFound(student, 'Student not found');
        res.json(student.academicRecords.notes);
    }))
    .post(protect, asyncHandler(async (req, res) => {
        const { studentId, ...noteData } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { $push: { 'academicRecords.notes': noteData } },
            { new: true }
        );

        throwIfNotFound(updatedStudent, 'Student not found');
        res.status(201).json(updatedStudent.academicRecords.notes);
    }));



module.exports = router;