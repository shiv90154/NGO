// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controller
const userController = require('../controllers/user.controller');

// Import middleware
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Configure multer for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../../temp_uploads');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ======================
// PUBLIC ROUTES (No authentication)
// ======================
router.post(
  '/register',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 },
  ]),
  userController.register
);

router.post('/verify-otp', userController.verifyOTP);
router.post('/resend-otp', userController.resendOTP);
router.post('/login', userController.login);

// ── Forgot-password flow (3 steps, all public) ──────────────────────────────
// Step 1: Submit email → OTP is sent if the account exists and is verified
router.post('/forgot-password', userController.forgotPassword);

// Step 2: Submit email + OTP → validates the code (OTP kept alive for step 3)
router.post('/verify-reset-otp', userController.verifyForgotPasswordOTP);

// Step 3: Submit email + OTP + newPassword → saves the new password
router.post('/reset-password', userController.resetPassword);
// ────────────────────────────────────────────────────────────────────────────

// ======================
// PROTECTED ROUTES (Authentication required)
// ======================
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, upload.single('profileImage'), userController.updateProfile);

router.get('/subordinates', protect, userController.getSubordinates);
router.get('/subordinates/:id', protect, userController.getSubordinates);

router.post('/wallet', protect, userController.updateWallet);

router.get('/', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR'), userController.getAllUsers);
router.get('/:id', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR', 'STATE_OFFICER'), userController.getUserById);
router.delete('/:id', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR'), userController.deleteUser);
router.post('/assign-hierarchy', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR', 'STATE_OFFICER'), userController.assignReporting);

module.exports = router;