const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');


// ======================
// ENSURE DIRECTORIES
// ======================
const tempDir = path.join(__dirname, '../uploads/temp');
const permDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(permDir)) fs.mkdirSync(permDir, { recursive: true });


// ======================
// MULTER STORAGE
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),

  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});


// ======================
// FILE FILTER
// ======================
const fileFilter = (req, file, cb) => {
  try {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } catch (err) {
    cb(err);
  }
};


// ======================
// MULTER INSTANCE
// ======================
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});


// ======================
// MULTER ERROR HANDLER
// ======================
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  next();
};


// ======================
// PUBLIC ROUTES
// ======================

// REGISTER (with files)
router.post(
  '/register',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 }
  ]),
  handleMulterError,
  authController.register
);


// VERIFY OTP
router.post('/verify-otp', authController.verifyOTP);


// LOGIN
router.post('/login', authController.login);


// ======================
// PROTECTED ROUTES
// ======================

// GET PROFILE
router.get('/profile', protect, authController.getProfile);


// UPDATE PROFILE
router.put(
  '/profile',
  protect,
  upload.fields([
    { name: 'profileImage', maxCount: 1 }
  ]),
  handleMulterError,
  authController.updateProfile
);


// GET ALL USERS
router.get('/users', protect, authController.getAllUsers);


// DELETE USER
router.delete('/users/:id', protect, authController.deleteUser);


module.exports = router;