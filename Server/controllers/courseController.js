const Course = require("../models/Course");

// Create course (Admin only)
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user.id,
    });

    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

// Get all courses
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// Enroll user
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ msg: "Course not found" });

    if (!course.students.includes(req.user.id)) {
      course.students.push(req.user.id);
      await course.save();
    }

    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    next(err);
  }
};