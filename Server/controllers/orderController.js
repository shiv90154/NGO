const Order = require("../models/Order");
const Course = require("../models/Course");

// Create Order
exports.createOrder = async (req, res, next) => {
  try {
    const { courseIds } = req.body;

    const courses = await Course.find({ _id: { $in: courseIds } });

    const totalAmount = courses.reduce((sum, c) => sum + c.price, 0);

    const order = await Order.create({
      user: req.user.id,
      courses: courseIds,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// Get user orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("courses", "title price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Update payment status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    order.paymentId = paymentId;

    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};