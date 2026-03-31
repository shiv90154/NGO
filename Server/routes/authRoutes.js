const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;