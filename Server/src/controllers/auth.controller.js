const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises; 
const { validationResult } = require('express-validator'); 
const VALID_ROLES = [
  'SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_MANAGER',
  'BLOCK_OFFICER', 'VILLAGE_OFFICER', 'DOCTOR', 'TEACHER', 'AGENT', 'USER'
];

// Ensure permanent upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
  }
})();

// ======================
// OTP GENERATOR & HASHING
// ======================
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

const verifyOTP = async (plainOtp, hashedOtp) => {
  return bcrypt.compare(plainOtp, hashedOtp);
};

// ======================
// EMAIL SEND
// ======================
const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  });
};

// ======================
// REGISTER + SEND OTP
// ======================
exports.register = async (req, res) => {
  try {
    // Check for validation errors if using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      fullName, email, phone, password,
      role, modules,
      fatherName, motherName, dob, gender,
      aadhaarNumber, panNumber,
      state, district, block, village, pincode, fullAddress
    } = req.body;

    // Basic validation (should be handled by validator, but keep for safety)
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);

    // Map role to a valid enum value
    let mappedRole = (role || 'USER').toUpperCase();
    if (!VALID_ROLES.includes(mappedRole)) {
      mappedRole = 'USER';
    }

    // Prepare user data (password will be hashed by pre-save hook)
    const userData = {
      fullName, email, phone, password,
      role: mappedRole,
      modules: modules ? (Array.isArray(modules) ? modules : [modules]) : [],
      fatherName, motherName,
      dob: dob ? new Date(dob) : undefined,
      gender: gender && gender !== '' ? gender : undefined,
      aadhaarNumber, panNumber,
      state, district, block, village, pincode, fullAddress,
      otp: hashedOtp,
      otpExpire: Date.now() + 5 * 60 * 1000,
    };

    // Create user without files first to get an id
    const user = new User(userData);

    // Handle file uploads
    if (req.files) {
      // Helper to move file from temp to permanent location and set field
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

    // Save user
    await user.save();

    // Send OTP email (asynchronously, don't wait if it fails)
    sendEmail(email, otp).catch(err => console.error('Email send error:', err));

    res.status(201).json({
      success: true,
      message: 'OTP sent to email. Please verify.',
      email: user.email
    });
  } catch (error) {
    console.error('Register error:', error);

    // Clean up any uploaded files on error
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
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
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
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Account already verified' });

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
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email first' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: 'Role mismatch' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, modules: user.modules },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.otp;
    delete userData.otpExpire;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// GET PROFILE
// ======================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpire');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// UPDATE PROFILE (with optional file upload)
// ======================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Handle profile image upload
    if (req.file) {
      // Delete old image if exists
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

    // Update text fields
    const allowedUpdates = [
      'fullName', 'phone', 'fatherName', 'motherName', 'dob', 'gender',
      'state', 'district', 'block', 'village', 'pincode', 'fullAddress',
      'specialization', 'experience', 'consultationFee', 'landSize', 'crops',
      'farmingType', 'bankAccount', 'aadhaarNumber', 'panNumber'
    ];
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    }

    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.otp;
    delete userData.otpExpire;

    res.json({ success: true, message: 'Profile updated', user: userData });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// GET ALL USERS (ADMIN)
// ======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpExpire');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// DELETE USER
// ======================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};