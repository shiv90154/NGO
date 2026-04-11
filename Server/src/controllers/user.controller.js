const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const fs = require('fs').promises;
const { validationResult } = require('express-validator');

// Complete roles list
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
  'ADMIN'
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
// REGISTER (Full version with all fields)
// ======================
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      // Basic Info
      fullName, name, email, phone, mobile, password,
      role, modules,
      fatherName, motherName, dob, dateOfBirth, gender,
      aadhaarNumber, aadharCard, panNumber, panCard, voterId, passportNumber,
      state, district, block, village, pincode, fullAddress,
      reportsTo, sponsorId,

      // Teacher fields
      specialization, qualifications, experienceYears,

      // Doctor fields
      doctorSpecialization, doctorExperience, consultationFee, registrationNumber, bloodGroup,
      allergies, medicalHistory,
      emergencyContactName, emergencyContactRelation, emergencyContactPhone,

      // Farmer/Agriculture fields
      landSize, crops, cropType, farmingType, isContractFarmer, farmLocation, irrigationType,

      // Education fields
      className, schoolName, board, percentage,

      // IT fields
      projectType, techStack, experience,

      // Social fields
      username, bio, interests,

      // Bank account
      bankAccount,

      // Agent commission rate
      commissionRate,
    } = req.body;

    // Handle both field name variations
    const finalName = fullName || name;
    const finalEmail = email;
    const finalPhone = phone || mobile;
    const finalDob = dob || dateOfBirth;
    const finalAadhaar = aadhaarNumber || aadharCard;
    const finalPan = panNumber || panCard;

    if (!finalName || !finalEmail || !finalPhone || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email: finalEmail }, { phone: finalPhone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);

    let mappedRole = (role || 'USER').toUpperCase();
    if (!VALID_ROLES.includes(mappedRole)) mappedRole = 'USER';

    // Parse modules
    let userModules = [];
    if (modules) {
      userModules = Array.isArray(modules) ? modules : [modules];
    } else {
      // Auto-detect modules from filled fields
      if (finalAadhaar || finalPan || voterId || passportNumber) userModules.push('FINANCE');
      if (bloodGroup || allergies || medicalHistory || emergencyContactName) userModules.push('HEALTHCARE');
      if (landSize || crops || cropType || farmLocation || irrigationType) userModules.push('AGRICULTURE');
      if (className || schoolName || board || percentage) userModules.push('EDUCATION');
      if (projectType || techStack || experience) userModules.push('IT');
      if (username || bio || interests) userModules.push('SOCIAL');
    }

    // Base user data
    const userData = {
      fullName: finalName,
      email: finalEmail,
      phone: finalPhone,
      password,
      role: mappedRole,
      modules: userModules,
      fatherName, motherName,
      dob: finalDob ? new Date(finalDob) : undefined,
      gender: gender && gender !== '' ? gender : undefined,
      aadhaarNumber: finalAadhaar,
      panNumber: finalPan,
      voterId, passportNumber,
      state, district, block, village, pincode, fullAddress,
      bloodGroup, allergies, medicalHistory,
      emergencyContact: {
        name: emergencyContactName,
        relationship: emergencyContactRelation,
        phone: emergencyContactPhone,
      },
      otp: hashedOtp,
      otpExpire: Date.now() + 5 * 60 * 1000,
      reportsTo: reportsTo || null,
      sponsorId: sponsorId || null,
      createdBy: req.user ? req.user.id : null,
      updatedBy: req.user ? req.user.id : null,
    };

    // Teacher profile
    if (mappedRole === 'TEACHER' || userModules.includes('EDUCATION')) {
      userData.teacherProfile = {
        specialization: specialization || '',
        qualifications: parseArray(qualifications),
        experienceYears: experienceYears ? parseInt(experienceYears) : 0,
      };
    }

    // Doctor profile
    if (mappedRole === 'DOCTOR' || userModules.includes('HEALTHCARE')) {
      userData.doctorProfile = {
        specialization: doctorSpecialization || '',
        experienceYears: doctorExperience ? parseInt(doctorExperience) : 0,
        consultationFee: consultationFee ? parseFloat(consultationFee) : 0,
        registrationNumber: registrationNumber || '',
      };
    }

    // Farmer profile
    if (userModules.includes('AGRICULTURE')) {
      userData.farmerProfile = {
        landSize: landSize ? parseFloat(landSize) : 0,
        crops: parseArray(crops || cropType),
        farmingType: farmingType || 'conventional',
        isContractFarmer: isContractFarmer === 'true' || isContractFarmer === true,
        farmLocation: farmLocation || '',
        irrigationType: irrigationType || '',
      };
    }

    // Education profile
    if (userModules.includes('EDUCATION')) {
      userData.educationProfile = {
        className: className || '',
        schoolName: schoolName || '',
        board: board || '',
        percentage: percentage || '',
      };
    }

    // IT profile
    if (userModules.includes('IT')) {
      userData.itProfile = {
        projectType: projectType || '',
        techStack: techStack || '',
        experience: experience || '',
      };
    }

    // Social profile
    if (userModules.includes('SOCIAL')) {
      userData.socialProfile = {
        username: username || '',
        bio: bio || '',
        interests: interests || '',
        followersCount: 0,
        followingCount: 0,
      };
    }

    // Bank account
    if (bankAccount) {
      try {
        userData.bankAccount = typeof bankAccount === 'string' ? JSON.parse(bankAccount) : bankAccount;
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid bankAccount JSON' });
      }
    }

    // Agent commission rate
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
      await moveFile('profilePicture', 'profile');
      await moveFile('aadhaarImage', 'aadhaar');
      await moveFile('aadharDocument', 'aadhaar');
      await moveFile('panImage', 'pan');
      await moveFile('panDocument', 'pan');
    }

    await user.save();
    sendEmail(finalEmail, otp).catch(err => console.error('Email error:', err));

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
          await fs.unlink(file.path).catch(() => { });
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
// VERIFY OTP  (registration flow)
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

    const token = jwt.sign(
      { id: user._id, role: user.role, modules: user.modules },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.otp;
    delete userData.otpExpire;

    res.json({ success: true, message: 'Account verified successfully', token, user: userData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// RESEND OTP  (registration flow)
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
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email first' });
    }
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
// FORGOT PASSWORD — Step 1
// Send OTP only if the account exists and is verified
// ======================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    // Return the same message whether the user exists or not to prevent
    // email enumeration attacks, but only send when the account is real.
    if (!user || !user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'If this email is registered and verified, an OTP has been sent.',
      });
    }

    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);

    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Fire-and-forget — do not await so the response is immediate
    sendEmail(email, otp, 5).catch(err =>
      console.error(`[forgotPassword] Email send failed for ${email}:`, err.message)
    );

    res.status(200).json({
      success: true,
      message: 'If this email is registered and verified, an OTP has been sent.',
    });
  } catch (error) {
    console.error('[forgotPassword] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// VERIFY FORGOT-PASSWORD OTP — Step 2
// Validates the OTP but does NOT clear it (needed again in resetPassword)
// ======================
exports.verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.otp) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    }
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const isValid = await verifyOTP(otp, user.otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP is valid — intentionally keep it on the document so resetPassword
    // can re-verify it in the next step. It expires at the same otpExpire.
    res.status(200).json({ success: true, message: 'OTP verified. You may now reset your password.' });
  } catch (error) {
    console.error('[verifyForgotPasswordOTP] Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// RESET PASSWORD — Step 3
// Re-verifies OTP, then saves the new hashed password and clears OTP fields
// ======================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.otp) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please restart the reset flow.' });
    }
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const isValid = await verifyOTP(otp, user.otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Set new password — the pre-save hook in user.model.js will hash it
    user.password = newPassword;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('[resetPassword] Error:', error);
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
      .populate('sponsorId', 'fullName email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// UPDATE PROFILE
// ======================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Profile image upload
    if (req.file) {
      if (user.profileImage) {
        const oldPath = path.join(__dirname, '../', user.profileImage);
        await fs.unlink(oldPath).catch(() => { });
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
      'aadhaarNumber', 'panNumber', 'bloodGroup', 'allergies', 'medicalHistory',
      'voterId', 'passportNumber'
    ];
    for (const key of simpleFields) {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    }

    // Emergency contact
    if (req.body.emergencyContactName || req.body.emergencyContactRelation || req.body.emergencyContactPhone) {
      user.emergencyContact = {
        name: req.body.emergencyContactName || user.emergencyContact?.name,
        relationship: req.body.emergencyContactRelation || user.emergencyContact?.relationship,
        phone: req.body.emergencyContactPhone || user.emergencyContact?.phone,
      };
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
      if (req.body.farmLocation !== undefined) user.farmerProfile.farmLocation = req.body.farmLocation;
      if (req.body.irrigationType !== undefined) user.farmerProfile.irrigationType = req.body.irrigationType;
    }

    // Education profile
    if (req.body.className !== undefined || req.body.schoolName !== undefined || req.body.board !== undefined || req.body.percentage !== undefined) {
      user.educationProfile = user.educationProfile || {};
      if (req.body.className !== undefined) user.educationProfile.className = req.body.className;
      if (req.body.schoolName !== undefined) user.educationProfile.schoolName = req.body.schoolName;
      if (req.body.board !== undefined) user.educationProfile.board = req.body.board;
      if (req.body.percentage !== undefined) user.educationProfile.percentage = req.body.percentage;
    }

    // IT profile
    if (req.body.projectType !== undefined || req.body.techStack !== undefined || req.body.experience !== undefined) {
      user.itProfile = user.itProfile || {};
      if (req.body.projectType !== undefined) user.itProfile.projectType = req.body.projectType;
      if (req.body.techStack !== undefined) user.itProfile.techStack = req.body.techStack;
      if (req.body.experience !== undefined) user.itProfile.experience = req.body.experience;
    }

    // Social profile
    if (req.body.username !== undefined || req.body.bio !== undefined || req.body.interests !== undefined) {
      user.socialProfile = user.socialProfile || {};
      if (req.body.username !== undefined) user.socialProfile.username = req.body.username;
      if (req.body.bio !== undefined) user.socialProfile.bio = req.body.bio;
      if (req.body.interests !== undefined) user.socialProfile.interests = req.body.interests;
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
    if (req.file) await fs.unlink(req.file.path).catch(() => { });
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
      user.mlmLevel = (sponsor.mlmLevel || 0) + 1;
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

    const subordinates = await User.find({ reportsTo: userId }).select('fullName email role');
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
      .populate('sponsorId', 'fullName email');
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
      await fs.unlink(filePath).catch(() => { });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// UPDATE WALLET
// ======================
exports.updateWallet = async (req, res) => {
  try {
    const { userId, amount, operation } = req.body;
    if (!userId || amount === undefined || !operation) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (operation === 'add') {
      user.walletBalance = (user.walletBalance || 0) + amount;
      user.totalEarnings = (user.totalEarnings || 0) + amount;
    } else if (operation === 'deduct') {
      if ((user.walletBalance || 0) < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }
      user.walletBalance = (user.walletBalance || 0) - amount;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid operation. Use "add" or "deduct"' });
    }
    await user.save();
    res.json({ success: true, message: `Wallet ${operation}ed by ${amount}`, walletBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};