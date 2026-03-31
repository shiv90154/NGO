const router = require('express').Router();
const userController = require('../controllers/auth.controller');

const { protect, authorizeRoles } = require('../middleware');

// ======================
// USER ROUTES
// ======================

// profile
router.get('/profile', protect, userController.getProfile);

// update
router.put('/profile', protect, userController.updateProfile);

// ======================
// ADMIN ROUTES
// ======================

// get all users
router.get(
    '/',
    protect,
    authorizeRoles('SUPER_ADMIN', 'ADMIN'),
    userController.getAllUsers
);

// delete user
router.delete(
    '/:id',
    protect,
    authorizeRoles('SUPER_ADMIN'),
    userController.deleteUser
);

module.exports = router;