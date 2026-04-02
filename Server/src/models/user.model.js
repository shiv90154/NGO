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
    // REFERRAL (MLM)
    // ======================
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: String,
    teamSize: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ======================
    // PERSONAL DETAILS
    // ======================
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    dob: Date,
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
    },

    // ======================
    // KYC / DOCUMENTS
    // ======================
    aadhaarNumber: {
      type: String,
      match: [/^\d{12}$/, 'Aadhaar must be 12 digits'],
      unique: true,
      sparse: true,
    },
    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'],
      uppercase: true,
      unique: true,
      sparse: true,
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
    enrolledCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    taughtCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],

    // ======================
    // HEALTHCARE MODULE
    // ======================
    specialization: String,
    experience: Number,
    consultationFee: Number,
    patients: [
      {
        patientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
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
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    bankAccount: {
      accountNumber: String,
      ifsc: String,
      bankName: String,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],

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
    // STATUS
    // ======================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================
// INDEXES
// ======================
userSchema.index({ role: 1 });
userSchema.index({ modules: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ referralCode: 1 }, { sparse: true });

// ======================
// PRE-SAVE HOOK (combine password hashing and referral code)
// ======================
userSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate referral code if not present
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  next();
});

// ======================
// METHOD: COMPARE PASSWORD
// ======================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);