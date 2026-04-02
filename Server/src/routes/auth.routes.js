const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const { validateRegister } = require('../middleware/validation.middleware');
const { otpLimiter, loginLimiter } = require('../middleware/rateLimit.middleware');

// ======================
// PUBLIC ROUTES
// ======================

// REGISTER (with file uploads)
router.post(
  '/register',
  otpLimiter,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 }
  ]),
  validateRegister,
  authController.register
);

// VERIFY OTP
router.post('/verify-otp', authController.verifyOTP);

// RESEND OTP
router.post('/resend-otp', otpLimiter, authController.resendOTP);

// LOGIN
router.post('/login', loginLimiter, authController.login);

// ======================
// PROTECTED ROUTES
// ======================

// GET PROFILE
router.get('/profile', protect, authController.getProfile);

// UPDATE PROFILE (with optional profile image)
router.put(
  '/profile',
  protect,
  upload.single('profileImage'),
  authController.updateProfile
);

// GET ALL USERS (admin only)
router.get('/users', protect, authController.getAllUsers);

// DELETE USER (admin only)
router.delete('/users/:id', protect, authController.deleteUser);

module.exports = router;