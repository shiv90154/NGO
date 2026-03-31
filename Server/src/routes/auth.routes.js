const router = require('express').Router();
const authController = require('../controllers/auth.controller');

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;