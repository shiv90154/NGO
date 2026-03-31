const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// Create order (any logged-in user)
router.post("/", protect, createOrder);

// Get my orders
router.get("/my", protect, getMyOrders);

// Update order (admin or higher)
router.put("/:id", protect, requireRole("admin"), updateOrderStatus);

module.exports = router;