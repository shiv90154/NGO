// models/Student.js
const mongoose = require('mongoose');
const User = require('./user.model');

/* ================= SUB SCHEMAS ================= */
const enrolledCourseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completed: {
        type: Boolean,
        default: false
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: Date
});

const classAttendanceSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    attended: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'missed'],
        default: 'pending'
    },
    date: {
        type: Date,
        required: true
    },
    duration: Number // in minutes
});

const studentNoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            trim: true
        },
        attachments: [String], // URLs to files
        courseRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        classRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    },
    {
        timestamps: true
    }
);

/* ================= STUDENT SCHEMA ================= */
const studentSchema = new mongoose.Schema({
    // Learning statistics
    learningStats: {
        totalCoursesEnrolled: {
            type: Number,
            default: 0
        },
        coursesCompleted: {
            type: Number,
            default: 0
        },
        totalLearningHours: {
            type: Number,
            default: 0
        },
        attendanceRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },

    // Enhanced course tracking
    enrolledCourses: [enrolledCourseSchema],

    // Class participation
    classAttendances: [classAttendanceSchema],

    // Academic records
    academicRecords: {
        notes: [studentNoteSchema],
        assignments: [{
            assignmentId: mongoose.Schema.Types.ObjectId,
            status: String,
            submittedAt: Date,
            grade: String
        }],
        certificates: [{
            courseId: mongoose.Schema.Types.ObjectId,
            issuedAt: Date,
            credentialUrl: String
        }]
    },

    // Student preferences
    preferences: {
        notificationSettings: {
            courseUpdates: { type: Boolean, default: true },
            classReminders: { type: Boolean, default: true },
            assignmentDeadlines: { type: Boolean, default: true }
        },
        learningStyle: {
            type: String,
            enum: ['visual', 'auditory', 'kinesthetic', 'mixed'],
            default: 'mixed'
        }
    }
}, {
    // Keep the same timestamps and discriminator key as parent
    timestamps: true,
    discriminatorKey: 'role'
});

/* ================= INDEXES ================= */
studentSchema.index({ 'enrolledCourses.courseId': 1 });
studentSchema.index({ 'classAttendances.classId': 1 });
studentSchema.index({ 'academicRecords.certificates.courseId': 1 });

/* ================= MIDDLEWARE ================= */
studentSchema.pre('save', function (next) {
    // Update learning stats whenever courses are modified
    if (this.isModified('enrolledCourses')) {
        this.learningStats.totalCoursesEnrolled = this.enrolledCourses.length;
        this.learningStats.coursesCompleted = this.enrolledCourses.filter(
            course => course.completed
        ).length;
    }
    next();
});

// Register Student as a discriminator of User
const Student = User.discriminator('STUDENT', studentSchema);
module.exports = Student;