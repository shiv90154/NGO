const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
            fullName,
            email,
            phone,
            password,
            role,
            modules
        } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();

        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: role || 'USER',
            modules,
            otp,
            otpExpire: Date.now() + 5 * 60 * 1000
        });

        // send OTP
        if (email) {
            await sendEmail(email, otp);
        }

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: user.email
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================
// VERIFY OTP
// ======================
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

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

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 🔒 OTP check
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email first'
            });
        }

        // 🔒 Role check
        if (role && user.role !== role) {
            return res.status(403).json({
                message: 'Role mismatch'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                modules: user.modules
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        const userData = user.toObject();
        delete userData.password;

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
        const user = await User.findById(req.user.id).select('-password');
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

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true }
        ).select('-password');

        res.json({
            message: 'Profile updated',
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================
// GET ALL USERS (ADMIN)
// ======================
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
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
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};