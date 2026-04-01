const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Allowed roles (must match the enum in the User model)
const VALID_ROLES = [
    'SUPER_ADMIN', 'STATE_OFFICER', 'DISTRICT_MANAGER',
    'BLOCK_OFFICER', 'VILLAGE_OFFICER', 'DOCTOR', 'TEACHER', 'AGENT', 'USER'
];

// Ensure permanent upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ======================
// OTP GENERATOR
// ======================
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
        const {
            fullName, email, phone, password,
            role, modules,
            fatherName, motherName, dob, gender,
            aadhaarNumber, panNumber,
            state, district, block, village, pincode, fullAddress
        } = req.body;

        // Basic validation
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

        // Map role to a valid enum value
        let mappedRole = (role || 'USER').toUpperCase();
        if (!VALID_ROLES.includes(mappedRole)) {
            mappedRole = 'USER';
        }

        // Prepare user data
        const userData = {
            fullName, email, phone, password,  // password will be hashed by pre-save hook
            role: mappedRole,
            modules: modules ? (Array.isArray(modules) ? modules : [modules]) : [],
            fatherName, motherName,
            dob: dob ? new Date(dob) : undefined,
            gender: gender && gender !== '' ? gender : undefined,  // avoid empty string
            aadhaarNumber, panNumber,
            state, district, block, village, pincode, fullAddress,
            otp,
            otpExpire: Date.now() + 5 * 60 * 1000,
        };

        // Handle file uploads (if any)
        if (req.files) {
            // Profile image
            if (req.files.profileImage) {
                const file = req.files.profileImage[0];
                const fileName = `${Date.now()}_profile_${file.originalname}`;
                const filePath = path.join(uploadDir, fileName);
                fs.renameSync(file.path, filePath);
                userData.profileImage = `/uploads/${fileName}`;
            }
            // Aadhaar image
            if (req.files.aadhaarImage) {
                const file = req.files.aadhaarImage[0];
                const fileName = `${Date.now()}_aadhaar_${file.originalname}`;
                const filePath = path.join(uploadDir, fileName);
                fs.renameSync(file.path, filePath);
                userData.aadhaarImage = `/uploads/${fileName}`;
            }
            // PAN image
            if (req.files.panImage) {
                const file = req.files.panImage[0];
                const fileName = `${Date.now()}_pan_${file.originalname}`;
                const filePath = path.join(uploadDir, fileName);
                fs.renameSync(file.path, filePath);
                userData.panImage = `/uploads/${fileName}`;
            }
        }

        // Create user
        const user = await User.create(userData);

        // Send OTP email
        await sendEmail(email, otp);

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: user.email
        });

    } catch (error) {
        console.error('Register error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ error: error.message });
    }
};

// ======================
// VERIFY OTP
// ======================
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpire < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;
        await user.save();

        res.json({ message: 'Account verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: 'Role mismatch' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
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
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================
// GET PROFILE
// ======================
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -otp -otpExpire');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================
// UPDATE PROFILE
// ======================
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        // Prevent updating sensitive fields
        delete updates.password;
        delete updates.otp;
        delete updates.isVerified;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password -otp -otpExpire');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ error: error.message });
    }
};

// ======================
// GET ALL USERS (ADMIN)
// ======================
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -otp -otpExpire');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================
// DELETE USER
// ======================
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};