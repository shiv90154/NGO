const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware');

// ======================
// PUBLIC ROUTES
// ======================
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP); // 🔥 NEW
router.post('/login', authController.login);

// ======================
// PROTECTED ROUTES
// ======================
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

// ======================
// ADMIN ROUTES
// ======================
router.get('/users', protect, authController.getAllUsers);
router.delete('/users/:id', protect, authController.deleteUser);

module.exports = router;