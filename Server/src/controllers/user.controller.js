const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const fs = require('fs').promises;
const { validationResult } = require('express-validator');

const VALID_ROLES = [
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
];

const uploadDir = path.join(__dirname, '../uploads');
(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
})();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};
const verifyOTP = async (plainOtp, hashedOtp) => bcrypt.compare(plainOtp, hashedOtp);

// Helper to parse comma-separated string to array
const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

// ======================
// REGISTER (with role-specific fields)
// ======================
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      fullName, email, phone, password,
      role, modules,
      fatherName, motherName, dob, gender,
      aadhaarNumber, panNumber,
      state, district, block, village, pincode, fullAddress,
      reportsTo, sponsorId,
      // Teacher fields
      specialization, qualifications, experienceYears,
      // Doctor fields
      doctorSpecialization, doctorExperience, consultationFee, registrationNumber,
      // Farmer fields
      landSize, crops, farmingType, isContractFarmer,
      // Bank account
      bankAccount,
      // Agent commission rate
      commissionRate,
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);

    let mappedRole = (role || 'USER').toUpperCase();
    if (!VALID_ROLES.includes(mappedRole)) mappedRole = 'USER';

    let userModules = [];
    if (modules) {
      userModules = Array.isArray(modules) ? modules : [modules];
    }

    // Base user data
    const userData = {
      fullName, email, phone, password,
      role: mappedRole,
      modules: userModules,
      fatherName, motherName,
      dob: dob ? new Date(dob) : undefined,
      gender: gender && gender !== '' ? gender : undefined,
      aadhaarNumber, panNumber,
      state, district, block, village, pincode, fullAddress,
      otp: hashedOtp,
      otpExpire: Date.now() + 5 * 60 * 1000,
      reportsTo: reportsTo || null,
      sponsorId: sponsorId || null,
      createdBy: req.user ? req.user.id : null,
      updatedBy: req.user ? req.user.id : null,
    };

    // Teacher profile (only if role is TEACHER or modules include EDUCATION)
    if (mappedRole === 'TEACHER' || userModules.includes('EDUCATION')) {
      userData.teacherProfile = {
        specialization: specialization || '',
        qualifications: parseArray(qualifications),
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
      };
    }

    // Doctor profile (only if role is DOCTOR or modules include HEALTHCARE)
    if (mappedRole === 'DOCTOR' || userModules.includes('HEALTHCARE')) {
      userData.doctorProfile = {
        specialization: doctorSpecialization || '',
        experienceYears: doctorExperience ? parseInt(doctorExperience) : 0,
        consultationFee: consultationFee ? parseFloat(consultationFee) : 0,
        registrationNumber: registrationNumber || '',
      };
    }

    // Farmer profile (only if modules include AGRICULTURE)
    if (userModules.includes('AGRICULTURE')) {
      userData.farmerProfile = {
        landSize: landSize ? parseFloat(landSize) : 0,
        crops: parseArray(crops),
        farmingType: farmingType || 'conventional',
        isContractFarmer: isContractFarmer === 'true' || isContractFarmer === true,
      };
    }

    // Bank account (if provided)
    if (bankAccount) {
      try {
        userData.bankAccount = typeof bankAccount === 'string' ? JSON.parse(bankAccount) : bankAccount;
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid bankAccount JSON' });
      }
    }

    // Agent commission rate (only for AGENT role)
    if (mappedRole === 'AGENT' && commissionRate !== undefined) {
      userData.commissionRate = parseFloat(commissionRate);
    }

    const user = new User(userData);

    // Handle file uploads
    if (req.files) {
      const moveFile = async (fieldName, prefix) => {
        const file = req.files[fieldName]?.[0];
        if (file) {
          const ext = path.extname(file.originalname);
          const fileName = `${Date.now()}_${prefix}_${Math.random().toString(36).substring(2)}${ext}`;
          const newPath = path.join(uploadDir, fileName);
          await fs.rename(file.path, newPath);
          user[fieldName] = `/uploads/${fileName}`;
        }
      };
      await moveFile('profileImage', 'profile');
      await moveFile('aadhaarImage', 'aadhaar');
      await moveFile('panImage', 'pan');
    }

    await user.save();
    sendEmail(email, otp).catch(err => console.error('Email error:', err));

    res.status(201).json({
      success: true,
      message: 'OTP sent to email. Please verify.',
      email: user.email,
    });
  } catch (error) {
    console.error('Register error:', error);
    if (req.files) {
      for (const field in req.files) {
        for (const file of req.files[field]) {
          await fs.unlink(file.path).catch(() => {});
        }
      }
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// VERIFY OTP
// ======================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }
    const user = await User.findOne({ email });
    if (!user || !user.otp || !(await verifyOTP(otp, user.otp))) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    res.json({ success: true, message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// RESEND OTP
// ======================
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Already verified' });
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendEmail(email, otp);
    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// LOGIN (role mismatch check removed)
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email first' });
    }
    // Role mismatch check removed – user can log in from any role-specific page
    // if (role && user.role !== role) {
    //   return res.status(403).json({ success: false, message: 'Role mismatch' });
    // }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, modules: user.modules },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.otp;
    delete userData.otpExpire;

    res.json({ success: true, message: 'Login successful', token, user: userData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// GET PROFILE
// ======================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -otp -otpExpire')
      .populate('reportsTo', 'fullName email role')
      .populate('sponsorId', 'fullName email referralCode');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// UPDATE PROFILE (supports all nested fields)
// ======================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Profile image upload
    if (req.file) {
      if (user.profileImage) {
        const oldPath = path.join(__dirname, '../', user.profileImage);
        await fs.unlink(oldPath).catch(() => {});
      }
      const ext = path.extname(req.file.originalname);
      const fileName = `${Date.now()}_profile_${Math.random().toString(36).substring(2)}${ext}`;
      const newPath = path.join(uploadDir, fileName);
      await fs.rename(req.file.path, newPath);
      user.profileImage = `/uploads/${fileName}`;
    }

    // Simple fields
    const simpleFields = [
      'fullName', 'phone', 'fatherName', 'motherName', 'dob', 'gender',
      'state', 'district', 'block', 'village', 'pincode', 'fullAddress',
      'aadhaarNumber', 'panNumber',
    ];
    for (const key of simpleFields) {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    }

    // Teacher profile
    if (req.body.teacherSpecialization !== undefined || req.body.qualifications !== undefined || req.body.teacherExperience !== undefined) {
      user.teacherProfile = user.teacherProfile || {};
      if (req.body.teacherSpecialization !== undefined) user.teacherProfile.specialization = req.body.teacherSpecialization;
      if (req.body.qualifications !== undefined) user.teacherProfile.qualifications = parseArray(req.body.qualifications);
      if (req.body.teacherExperience !== undefined) user.teacherProfile.experienceYears = parseInt(req.body.teacherExperience);
    }

    // Doctor profile
    if (req.body.doctorSpecialization !== undefined || req.body.doctorExperience !== undefined || req.body.consultationFee !== undefined || req.body.registrationNumber !== undefined) {
      user.doctorProfile = user.doctorProfile || {};
      if (req.body.doctorSpecialization !== undefined) user.doctorProfile.specialization = req.body.doctorSpecialization;
      if (req.body.doctorExperience !== undefined) user.doctorProfile.experienceYears = parseInt(req.body.doctorExperience);
      if (req.body.consultationFee !== undefined) user.doctorProfile.consultationFee = parseFloat(req.body.consultationFee);
      if (req.body.registrationNumber !== undefined) user.doctorProfile.registrationNumber = req.body.registrationNumber;
    }

    // Farmer profile
    if (req.body.landSize !== undefined || req.body.crops !== undefined || req.body.farmingType !== undefined || req.body.isContractFarmer !== undefined) {
      user.farmerProfile = user.farmerProfile || {};
      if (req.body.landSize !== undefined) user.farmerProfile.landSize = parseFloat(req.body.landSize);
      if (req.body.crops !== undefined) user.farmerProfile.crops = parseArray(req.body.crops);
      if (req.body.farmingType !== undefined) user.farmerProfile.farmingType = req.body.farmingType;
      if (req.body.isContractFarmer !== undefined) user.farmerProfile.isContractFarmer = req.body.isContractFarmer === 'true' || req.body.isContractFarmer === true;
    }

    // Bank account
    if (req.body.bankAccount !== undefined) {
      try {
        user.bankAccount = typeof req.body.bankAccount === 'string' ? JSON.parse(req.body.bankAccount) : req.body.bankAccount;
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid bankAccount JSON' });
      }
    }

    // Agent commission rate
    if (req.body.commissionRate !== undefined && user.role === 'AGENT') {
      user.commissionRate = parseFloat(req.body.commissionRate);
    }

    user.updatedBy = req.user.id;
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.otp;
    delete userData.otpExpire;

    res.json({ success: true, message: 'Profile updated', user: userData });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// ASSIGN HIERARCHY (Admin)
// ======================
exports.assignReporting = async (req, res) => {
  try {
    const { userId, reportsToId, sponsorId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (reportsToId) {
      const superior = await User.findById(reportsToId);
      if (!superior) return res.status(404).json({ success: false, message: 'Superior not found' });
      user.reportsTo = reportsToId;
    }
    if (sponsorId) {
      const sponsor = await User.findById(sponsorId);
      if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
      user.sponsorId = sponsorId;
      user.mlmLevel = sponsor.mlmLevel + 1;
    }
    user.updatedBy = req.user.id;
    await user.save();

    res.json({ success: true, message: 'Hierarchy updated', user: { _id: user._id, reportsTo: user.reportsTo, sponsorId: user.sponsorId } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// GET SUBORDINATES
// ======================
exports.getSubordinates = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const subordinates = await User.find({ reportsTo: userId }).select('fullName email role hierarchyLevel');
    const mlmDownlines = await User.find({ sponsorId: userId }).select('fullName email role mlmLevel');

    res.json({
      success: true,
      officialSubordinates: subordinates,
      mlmDownlines: mlmDownlines,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// GET ALL USERS (Admin)
// ======================
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isVerified, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const users = await User.find(filter)
      .select('-password -otp -otpExpire')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// GET USER BY ID (Admin)
// ======================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otp -otpExpire')
      .populate('reportsTo', 'fullName email role')
      .populate('sponsorId', 'fullName email referralCode');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// DELETE USER (Admin)
// ======================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.profileImage) {
      const filePath = path.join(__dirname, '../', user.profileImage);
      await fs.unlink(filePath).catch(() => {});
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// ADD/UPDATE WALLET (Bonus method for finance module)
// ======================
exports.updateWallet = async (req, res) => {
  try {
    const { userId, amount, operation } = req.body; // operation: 'add' or 'deduct'
    if (!userId || amount === undefined || !operation) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (operation === 'add') {
      user.walletBalance += amount;
      user.totalEarnings += amount;
    } else if (operation === 'deduct') {
      if (user.walletBalance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
      user.walletBalance -= amount;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid operation. Use "add" or "deduct"' });
    }
    await user.save();
    res.json({ success: true, message: `Wallet ${operation}ed by ${amount}`, walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};