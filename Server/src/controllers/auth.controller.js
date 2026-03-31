const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ======================
// REGISTER
// ======================
exports.register = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        // check user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: 'User registered successfully',
            user
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user
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