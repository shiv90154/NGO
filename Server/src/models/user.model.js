const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    // ======================
    // BASIC INFO
    // ======================
    fullName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    // ======================
    // ROLE
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

    // ======================
    // MODULE ACCESS (🔥 IMPORTANT)
    // ======================
    modules: [
        {
            type: String,
            enum: [
                "EDUCATION",
                "AGRICULTURE",
                "FINANCE",
                "HEALTHCARE",
                "NEWS",
                "IT"
            ]
        }
    ],

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
            progress: { type: Number, default: 0 },
            completed: { type: Boolean, default: false }
        }
    ],

    // ======================
    // HEALTHCARE MODULE
    // ======================
    specialization: String,
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
    // OTP VERIFICATION (🔥 NEW)
    // ======================
    otp: String,
    otpExpire: Date,

    isVerified: {
        type: Boolean,
        default: false
    },

    // ======================
    // STATUS
    // ======================
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);