const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const fs = require('fs').promises;
const { validationResult } = require('express-validator');

// Complete roles list (matching model)
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
// REGISTER (Full version with all new fields)
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

      // NEW: Media creator
      isMediaCreator,

      // NEW: Seller profile
      isSeller, storeName, gstNumber,

      // NEW: CRM/IT fields (can be updated later)
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
      if (isMediaCreator === 'true' || isMediaCreator === true) userModules.push('MEDIA');
      if (isSeller === 'true' || isSeller === true) userModules.push('ECOMMERCE');
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
        earnings: 0,
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

    // Education profile (for students)
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

    // Media creator profile
    if (userModules.includes('MEDIA') || isMediaCreator === 'true' || isMediaCreator === true) {
      userData.mediaCreatorProfile = {
        isCreator: true,
        totalPosts: 0,
        totalFollowers: 0,
        monetizationEarnings: 0,
        liveStreamingKey: Math.random().toString(36).substring(2, 15),
      };
    }

    // Seller profile (E-commerce)
    if (userModules.includes('ECOMMERCE') || isSeller === 'true' || isSeller === true) {
      userData.sellerProfile = {
        isSeller: true,
        storeName: storeName || `${finalName}'s Store`,
        gstNumber: gstNumber || '',
        rating: 0,
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

    // Handle file uploads (profile, aadhaar, pan, store logo)
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
      // Store logo
      await moveFile('storeLogo', 'store_logo');
      if (req.files['storeLogo']?.[0]) {
        user.sellerProfile.storeLogo = `/uploads/${fileNameFromMove}`; // careful: need to capture filename
      }
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

    // Update last login
    await user.updateLastLogin(req.ip, req.headers['user-agent']);

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
// GET PROFILE (with populated new fields)
// ======================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -otp -otpExpire')
      .populate('reportsTo', 'fullName email role')
      .populate('sponsorId', 'fullName email')
      .populate('enrolledCourses.courseId')
      .populate('testResults.testId')
      .populate('certificates.courseId')
      .populate('prescriptions')
      .populate('productListings')
      .populate('contractFarmingAgreements.buyerId')
      .populate('loans')
      .populate('mediaPosts')
      .populate('clients')
      .populate('projects')
      .populate('storeProducts');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// UPDATE PROFILE (includes all new fields)
// ======================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Helper to move uploaded file
    const moveFile = async (fieldName, prefix) => {
      const file = req.files?.[fieldName]?.[0];
      if (file) {
        if (user[fieldName]) {
          const oldPath = path.join(__dirname, '../', user[fieldName]);
          await fs.unlink(oldPath).catch(() => { });
        }
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}_${prefix}_${Math.random().toString(36).substring(2)}${ext}`;
        const newPath = path.join(uploadDir, fileName);
        await fs.rename(file.path, newPath);
        user[fieldName] = `/uploads/${fileName}`;
        return fileName;
      }
      return null;
    };

    // Profile image
    await moveFile('profileImage', 'profile');
    await moveFile('profilePicture', 'profile');
    // Store logo
    const logoFileName = await moveFile('storeLogo', 'store_logo');
    if (logoFileName && user.sellerProfile) {
      user.sellerProfile.storeLogo = `/uploads/${logoFileName}`;
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

    // Education profile (student)
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

    // Media creator profile
    if (req.body.isMediaCreator !== undefined) {
      const isCreator = req.body.isMediaCreator === 'true' || req.body.isMediaCreator === true;
      if (isCreator && !user.mediaCreatorProfile) {
        user.mediaCreatorProfile = {
          isCreator: true,
          totalPosts: 0,
          totalFollowers: 0,
          monetizationEarnings: 0,
          liveStreamingKey: Math.random().toString(36).substring(2, 15),
        };
      } else if (!isCreator) {
        user.mediaCreatorProfile = null;
      }
    }
    if (req.body.mediaBio !== undefined && user.mediaCreatorProfile) {
      user.mediaCreatorProfile.bio = req.body.mediaBio;
    }

    // Seller profile
    if (req.body.isSeller !== undefined) {
      const isSeller = req.body.isSeller === 'true' || req.body.isSeller === true;
      if (isSeller && !user.sellerProfile) {
        user.sellerProfile = {
          isSeller: true,
          storeName: req.body.storeName || `${user.fullName}'s Store`,
          gstNumber: req.body.gstNumber || '',
          rating: 0,
        };
      } else if (!isSeller) {
        user.sellerProfile = null;
      } else if (user.sellerProfile) {
        if (req.body.storeName) user.sellerProfile.storeName = req.body.storeName;
        if (req.body.gstNumber) user.sellerProfile.gstNumber = req.body.gstNumber;
      }
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

// ======================
// NEW: ADD HEALTH RECORD
// ======================
exports.addHealthRecord = async (req, res) => {
  try {
    const { recordType, title, description, date } = req.body;
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let fileUrl = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${Date.now()}_health_${Math.random().toString(36).substring(2)}${ext}`;
      const newPath = path.join(uploadDir, fileName);
      await fs.rename(req.file.path, newPath);
      fileUrl = `/uploads/${fileName}`;
    }

    user.healthRecords.push({
      recordType,
      title,
      description,
      fileUrl,
      date: date ? new Date(date) : new Date(),
      doctorId: req.user.id,
    });
    await user.save();
    res.json({ success: true, message: 'Health record added', healthRecords: user.healthRecords });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => { });
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// NEW: ADD PRODUCT LISTING (Agriculture/E-commerce)
// ======================
exports.addProductListing = async (req, res) => {
  try {
    const { name, price, quantity, unit, category, description } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let imageUrl = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${Date.now()}_product_${Math.random().toString(36).substring(2)}${ext}`;
      const newPath = path.join(uploadDir, fileName);
      await fs.rename(req.file.path, newPath);
      imageUrl = `/uploads/${fileName}`;
    }

    const newProduct = {
      name,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      unit,
      category,
      description,
      imageUrl,
      sellerId: userId,
      createdAt: new Date(),
    };
    user.productListings.push(newProduct);
    await user.save();
    res.json({ success: true, message: 'Product added', product: newProduct });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => { });
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// NEW: ADD CONTRACT FARMING AGREEMENT
// ======================
exports.addContractFarming = async (req, res) => {
  try {
    const { buyerId, crop, quantity, pricePerUnit, startDate, endDate } = req.body;
    const farmerId = req.user.id;
    const farmer = await User.findById(farmerId);
    if (!farmer || !farmer.farmerProfile) {
      return res.status(400).json({ success: false, message: 'User is not a farmer' });
    }
    const buyer = await User.findById(buyerId);
    if (!buyer) return res.status(404).json({ success: false, message: 'Buyer not found' });

    const agreement = {
      buyerId,
      crop,
      quantity: parseFloat(quantity),
      pricePerUnit: parseFloat(pricePerUnit),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'pending',
    };
    farmer.contractFarmingAgreements.push(agreement);
    await farmer.save();
    res.json({ success: true, message: 'Contract farming request sent', agreement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// NEW: ADD LOAN
// ======================
exports.addLoan = async (req, res) => {
  try {
    const { amount, emiAmount, tenureMonths } = req.body;
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const loan = {
      amount: parseFloat(amount),
      emiAmount: parseFloat(emiAmount),
      tenureMonths: parseInt(tenureMonths),
      outstanding: parseFloat(amount),
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      sanctionedAt: new Date(),
    };
    user.loans.push(loan);
    await user.save();
    res.json({ success: true, message: 'Loan added', loan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// NEW: ADD CLIENT (CRM)
// ======================
exports.addClient = async (req, res) => {
  try {
    const { name, email, phone, company, gstNumber, address } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const client = {
      name,
      email,
      phone,
      company,
      gstNumber,
      address,
      createdBy: userId,
      createdAt: new Date(),
    };
    user.clients.push(client);
    await user.save();
    res.json({ success: true, message: 'Client added', client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// NEW: ADD PROJECT (CRM/IT)
// ======================
exports.addProject = async (req, res) => {
  try {
    const { name, description, clientId, startDate, endDate, budget } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const project = {
      name,
      description,
      clientId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: parseFloat(budget),
      status: 'active',
      createdBy: userId,
      createdAt: new Date(),
    };
    user.projects.push(project);
    await user.save();
    res.json({ success: true, message: 'Project added', project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// NEW: ADD STORE PRODUCT (E-commerce)
// ======================
exports.addStoreProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || !user.sellerProfile) {
      return res.status(400).json({ success: false, message: 'User is not a seller' });
    }

    let imageUrl = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${Date.now()}_store_${Math.random().toString(36).substring(2)}${ext}`;
      const newPath = path.join(uploadDir, fileName);
      await fs.rename(req.file.path, newPath);
      imageUrl = `/uploads/${fileName}`;
    }

    const product = {
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      description,
      imageUrl,
      sellerId: userId,
      createdAt: new Date(),
    };
    user.storeProducts.push(product);
    await user.save();
    res.json({ success: true, message: 'Store product added', product });
  } catch (error) {
    if (req.file) await fs.unlink(req.file.path).catch(() => { });
    res.status(500).json({ success: false, error: error.message });
  }
};