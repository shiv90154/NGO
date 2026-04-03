const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const financeController = require('../controllers/finance.controller');

router.use(protect); // All routes require authentication

router.get('/wallet', financeController.getWallet);
router.post('/add-money', financeController.addMoney);
router.post('/transfer', financeController.transferMoney);
router.post('/recharge', financeController.recharge);
router.post('/apply-loan', financeController.applyLoan);

module.exports = router;