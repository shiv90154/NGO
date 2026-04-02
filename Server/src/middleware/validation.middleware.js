const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone')
    .matches(/^\d{10}$/).withMessage('Phone number must be 10 digits')
    .notEmpty().withMessage('Phone number is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .notEmpty().withMessage('Password is required'),

  // Optional fields – treat empty string as missing
  body('aadhaarNumber')
    .optional({ checkFalsy: true })   // ← important
    .matches(/^\d{12}$/).withMessage('Aadhaar must be 12 digits'),
  body('panNumber')
    .optional({ checkFalsy: true })
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage('Invalid PAN format'),
  body('pincode')
    .optional({ checkFalsy: true })
    .matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
  body('gender')
    .optional({ checkFalsy: true })
    .isIn(['MALE', 'FEMALE', 'OTHER']).withMessage('Invalid gender value'),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];