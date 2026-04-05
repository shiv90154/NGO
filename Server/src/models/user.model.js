const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // ======================
    // BASIC INFO
    // ======================
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // ======================
    // USER ROLE (Hierarchy)
    // ======================
    role: {
      type: String,
      enum: [
        'SUPER_ADMIN',
        'ADDITIONAL_DIRECTOR',
        'STATE_OFFICER',
        'DISTRICT_MANAGER',
        'DISTRICT_PRESIDENT',
        'FIELD_OFFICER',
        'BLOCK_OFFICER',
        'VILLAGE_OFFICER',
        'DOCTOR',
        'TEACHER',
        'AGENT',
        'USER',
      ],
      default: 'USER',
    },

    // ======================
    // MODULE ACCESS
    // ======================
    modules: {
      type: [String],
      enum: ['EDUCATION', 'AGRICULTURE', 'FINANCE', 'HEALTHCARE', 'NEWS', 'IT'],
      default: [],
    },

    // ======================
    // OFFICIAL HIERARCHY
    // ======================
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    hierarchyLevel: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ======================
    // MLM / FRANCHISE TREE
    // ======================
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    mlmLevel: {
      type: Number,
      default: 0,
    },
    leftChild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rightChild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    teamSize: {
      type: Number,
      default: 0,
    },

    // ======================
    // PERSONAL DETAILS
    // ======================
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    dob: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    // ======================
    // KYC / DOCUMENTS (FIXED)
    // ======================
    aadhaarNumber: {
      type: String,
      match: [/^\d{12}$/, 'Aadhaar must be 12 digits'],
      unique: true,
      sparse: true,
      default: null,
      set: v => (v === '' ? null : v),
    },
    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'],
      uppercase: true,
      unique: true,
      sparse: true,
      default: null,
      set: v => (v === '' ? null : v),
    },
    aadhaarImage: String,
    panImage: String,

    // ======================
    // ADDRESS
    // ======================
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    block: { type: String, trim: true },
    village: { type: String, trim: true },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Pincode must be 6 digits'],
    },
    fullAddress: { type: String, trim: true },

    // ======================
    // PROFILE
    // ======================
    profileImage: String,
    signature: String,

    // ======================
    // EDUCATION MODULE
    // ======================
    teacherProfile: {
      specialization: { type: String, trim: true },
      qualifications: [String],
      experienceYears: { type: Number, min: 0, default: 0 },
      taughtCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    },
    enrolledCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        completed: { type: Boolean, default: false },
        enrolledAt: { type: Date, default: Date.now },
      },
    ],

    // ======================
    // HEALTHCARE MODULE
    // ======================
    doctorProfile: {
      specialization: { type: String, trim: true },
      experienceYears: { type: Number, min: 0, default: 0 },
      consultationFee: { type: Number, min: 0, default: 0 },
      registrationNumber: { type: String, trim: true },
      availableSlots: [Date],
    },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],

    // ======================
    // AGRICULTURE MODULE
    // ======================
    farmerProfile: {
      landSize: { type: Number, min: 0, default: 0 },
      crops: [String],
      farmingType: { type: String, enum: ['organic', 'conventional', 'mixed'], default: 'conventional' },
      isContractFarmer: { type: Boolean, default: false },
    },

    // ======================
    // FINANCE MODULE
    // ======================
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    bankAccount: {
      accountNumber: { type: String, trim: true },
      ifsc: { type: String, trim: true },
      bankName: { type: String, trim: true },
      accountHolderName: { type: String, trim: true },
    },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],

    // ======================
    // AGENT / MLM SPECIFIC
    // ======================
    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalCommissionEarned: {
      type: Number,
      default: 0,
    },

    // ======================
    // OTP VERIFICATION
    // ======================
    otp: String,
    otpExpire: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },

    // ======================
    // STATUS & TRACKING
    // ======================
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ======================
// INDEXES (only non‑unique or composite)
// ======================
userSchema.index({ role: 1 });
userSchema.index({ modules: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ reportsTo: 1 });
userSchema.index({ sponsorId: 1 });
userSchema.index({ 'doctorProfile.specialization': 1 });
userSchema.index({ 'teacherProfile.specialization': 1 });
userSchema.index({ 'farmerProfile.crops': 1 });

// ======================
// PRE-SAVE HOOK (async, no `next` parameter)
// ======================
userSchema.pre('save', async function () {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate referral code if not present
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Auto-set hierarchyLevel based on role (only for new documents)
  const roleLevelMap = {
    SUPER_ADMIN: 0,
    ADDITIONAL_DIRECTOR: 1,
    STATE_OFFICER: 2,
    DISTRICT_MANAGER: 3,
    DISTRICT_PRESIDENT: 4,
    FIELD_OFFICER: 5,
    BLOCK_OFFICER: 6,
    VILLAGE_OFFICER: 7,
    DOCTOR: 8,
    TEACHER: 8,
    AGENT: 8,
    USER: 9,
  };
  if (this.isNew && !this.hierarchyLevel) {
    this.hierarchyLevel = roleLevelMap[this.role] || 9;
  }
});

// ======================
// METHOD: COMPARE PASSWORD
// ======================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ======================
// VIRTUAL: Full address as string
// ======================
userSchema.virtual('fullAddressString').get(function () {
  const parts = [this.fullAddress, this.village, this.block, this.district, this.state, this.pincode].filter(Boolean);
  return parts.join(', ');
});

module.exports = mongoose.model('User', userSchema);