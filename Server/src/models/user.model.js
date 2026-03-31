const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    // ======================
    // BASIC INFO
    // ======================
    fullName: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    // ======================
    // ROLE & HIERARCHY
    // ======================
    role: {
        type: String,
        enum: [
            'SUPER_ADMIN',
            'STATE_OFFICER',
            'DISTRICT_MANAGER',
            'BLOCK_OFFICER',
            'VILLAGE_OFFICER',
            'DOCTOR',
            'TEACHER',
            'AGENT',
            'USER'
        ],
        default: 'USER'
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // ======================
    // PERSONAL DETAILS
    // ======================
    fatherName: String,
    motherName: String,
    dob: Date,
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER']
    },

    // ======================
    // KYC / DOCUMENTS
    // ======================
    aadhaarNumber: String,
    panNumber: String,
    aadhaarImage: String,
    panImage: String,

    // ======================
    // ADDRESS
    // ======================
    state: String,
    district: String,
    block: String,
    village: String,
    pincode: String,
    fullAddress: String,

    // ======================
    // PROFILE
    // ======================
    profileImage: String,
    signature: String,

    // ======================
    // EDUCATION MODULE
    // ======================
    enrolledCourses: [
        {
            courseId: mongoose.Schema.Types.ObjectId,
            progress: Number,
            completed: Boolean
        }
    ],

    // ======================
    // HEALTHCARE MODULE
    // ======================
    specialization: String, // for doctor
    experience: Number,
    consultationFee: Number,
    patients: [
        {
            patientId: mongoose.Schema.Types.ObjectId
        }
    ],

    // ======================
    // AGRICULTURE MODULE
    // ======================
    landSize: Number,
    crops: [String],
    farmingType: String,

    // ======================
    // FINANCE MODULE
    // ======================
    walletBalance: {
        type: Number,
        default: 0
    },

    totalEarnings: {
        type: Number,
        default: 0
    },

    bankAccount: {
        accountNumber: String,
        ifsc: String,
        bankName: String
    },

    // ======================
    // MLM / COMMISSION
    // ======================
    referralCode: String,
    referredBy: String,
    teamSize: {
        type: Number,
        default: 0
    },

    // ======================
    // STATUS
    // ======================
    isActive: {
        type: Boolean,
        default: true
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);