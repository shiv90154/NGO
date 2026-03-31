const express = require("express");
const router = express.Router();

const { createCourse, getCourses, enrollCourse } = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// ✅ Create course (admin or higher)
router.post("/", protect, requireRole("admin"), createCourse);

// ✅ Get all courses
router.get("/", protect, getCourses);

// ✅ Enroll
router.post("/enroll/:id", protect, enrollCourse);

module.exports = router;