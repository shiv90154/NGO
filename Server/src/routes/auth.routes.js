const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controller
const userController = require('../controllers/auth.controller');

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
    { name: 'profilePicture', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'aadharDocument', maxCount: 1 },
    { name: 'panImage', maxCount: 1 },
    { name: 'panDocument', maxCount: 1 },
    { name: 'storeLogo', maxCount: 1 },
  ]),
  userController.register
);

router.post('/verify-otp', userController.verifyOTP);
router.post('/resend-otp', userController.resendOTP);
router.post('/login', userController.login);

// ======================
// PROTECTED ROUTES (Authentication required)
// ======================
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, upload.single('profileImage'), userController.updateProfile);

router.get('/subordinates', protect, userController.getSubordinates);
router.get('/subordinates/:id', protect, userController.getSubordinates);

router.post('/wallet', protect, userController.updateWallet);

// ======================
// HEALTH RECORDS
// ======================
router.post(
  '/health-records',
  protect,
  upload.single('file'),
  userController.addHealthRecord
);
router.post(
  '/health-records/:userId',
  protect,
  restrictTo('DOCTOR', 'SUPER_ADMIN', 'ADDITIONAL_DIRECTOR'),
  upload.single('file'),
  userController.addHealthRecord
);

// ======================
// AGRICULTURE PRODUCTS (Listings)
// ======================
router.post(
  '/products',
  protect,
  upload.single('image'),
  userController.addProductListing
);

// ======================
// CONTRACT FARMING
// ======================
router.post('/contract-farming', protect, userController.addContractFarming);

// ======================
// LOANS
// ======================
router.post('/loans', protect, userController.addLoan);
router.post('/loans/:userId', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR'), userController.addLoan);

// ======================
// CRM: CLIENTS
// ======================
router.post('/clients', protect, userController.addClient);

// ======================
// CRM: PROJECTS
// ======================
router.post('/projects', protect, userController.addProject);

// ======================
// E-COMMERCE STORE PRODUCTS
// ======================
router.post(
  '/store-products',
  protect,
  upload.single('image'),
  userController.addStoreProduct
);

// ======================
// ADMIN ROUTES (User management)
// ======================
router.get('/', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR'), userController.getAllUsers);
router.get('/:id', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR', 'STATE_OFFICER'), userController.getUserById);
router.delete('/:id', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR'), userController.deleteUser);
router.post('/assign-hierarchy', protect, restrictTo('SUPER_ADMIN', 'ADDITIONAL_DIRECTOR', 'STATE_OFFICER'), userController.assignReporting);

module.exports = router;