// routes/agriculture.routes.js
const express = require('express');
const router = express.Router();
const Agriculture = require('../models/agriculture.model');
const User = require('../models/user.model');
const { protect } = require('../middleware/auth.middleware');

// ==================== ASYNC WRAPPER ====================
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== HELPER FUNCTIONS ====================
const getAgri = async (req, res, next) => {
    req.agri = await Agriculture.findOne({ userId: req.user.id }) || await Agriculture.create({ userId: req.user.id });
    next();
};

const handleRes = (res, data, status = 200) => res.status(status).json({ success: true, data });

// ==================== PROFILE ====================
router.get('/profile', protect, getAgri, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    handleRes(res, { user, agriculture: req.agri });
}));

router.put('/profile', protect, getAgri, asyncHandler(async (req, res) => {
    if (req.body.landHoldings) req.agri.landHoldings = req.body.landHoldings;
    await req.agri.save();
    handleRes(res, req.agri);
}));

// ==================== CROPS ====================
router.route('/crops')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        handleRes(res, req.agri.crops);
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.crops.push(req.body);
        req.agri.stats.totalCrops = req.agri.crops.length;
        await req.agri.save();
        handleRes(res, req.agri.crops, 201);
    }));

router.route('/crops/:cropId')
    .put(protect, getAgri, asyncHandler(async (req, res) => {
        const crop = req.agri.crops.id(req.params.cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        Object.assign(crop, req.body);
        await req.agri.save();
        handleRes(res, crop);
    }))
    .delete(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.crops.id(req.params.cropId).remove();
        req.agri.stats.totalCrops = req.agri.crops.length;
        await req.agri.save();
        handleRes(res, { message: 'Crop deleted' });
    }));

// ==================== DISEASES ====================
router.route('/diseases')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        handleRes(res, req.agri.diseaseDetections);
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.diseaseDetections.push({ ...req.body, detectedAt: new Date() });
        await req.agri.save();
        handleRes(res, req.agri.diseaseDetections, 201);
    }));

// ==================== PRODUCTS ====================
router.get('/products', asyncHandler(async (req, res) => {
    const farmers = await Agriculture.find({ 'productListings.status': 'active' }).populate('userId', 'fullName phone village district');
    const products = farmers.flatMap(f => f.productListings.filter(p => p.status === 'active').map(p => ({
        ...p.toObject(), farmerName: f.userId?.fullName, farmerPhone: f.userId?.phone, farmerLocation: `${f.userId?.village}, ${f.userId?.district}`
    })));
    handleRes(res, products);
}));

router.route('/my-products')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        handleRes(res, req.agri.productListings);
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.productListings.push({ ...req.body, status: 'active', listedAt: new Date() });
        req.agri.stats.totalProducts = req.agri.productListings.length;
        await req.agri.save();
        handleRes(res, req.agri.productListings, 201);
    }));

router.route('/my-products/:productId')
    .put(protect, getAgri, asyncHandler(async (req, res) => {
        const product = req.agri.productListings.id(req.params.productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        Object.assign(product, req.body);
        await req.agri.save();
        handleRes(res, product);
    }))
    .delete(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.productListings.id(req.params.productId).remove();
        req.agri.stats.totalProducts = req.agri.productListings.length;
        await req.agri.save();
        handleRes(res, { message: 'Product deleted' });
    }));

// ==================== ORDERS ====================
router.post('/orders/:productId', protect, asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const seller = await Agriculture.findOne({ 'productListings._id': req.params.productId });
    if (!seller) return res.status(404).json({ success: false, message: 'Product not found' });

    const product = seller.productListings.id(req.params.productId);
    if (!product || product.status !== 'active' || product.quantityAvailable < quantity) {
        return res.status(400).json({ success: false, message: 'Product not available or insufficient quantity' });
    }

    const totalAmount = product.pricePerUnit * quantity;
    seller.ordersReceived.push({ buyerId: req.user.id, productId: req.params.productId, quantity, totalAmount, status: 'pending', orderDate: new Date() });
    product.quantityAvailable -= quantity;
    if (product.quantityAvailable === 0) product.status = 'sold';
    seller.stats.totalOrders = seller.ordersReceived.length;
    seller.stats.totalRevenue = seller.ordersReceived.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);
    await seller.save();

    await Agriculture.findOneAndUpdate({ userId: req.user.id }, {}, { upsert: true, new: true });
    handleRes(res, seller.ordersReceived.slice(-1)[0], 201);
}));

router.get('/orders/seller', protect, getAgri, asyncHandler(async (req, res) => {
    handleRes(res, req.agri.ordersReceived);
}));

router.put('/orders/:orderId/status', protect, getAgri, asyncHandler(async (req, res) => {
    const order = req.agri.ordersReceived.id(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = req.body.status;
    if (req.body.status === 'delivered') {
        req.agri.stats.totalRevenue = req.agri.ordersReceived.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);
    }
    await req.agri.save();
    handleRes(res, order);
}));

// ==================== CONTRACTS ====================
router.route('/contracts')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        const contracts = await Agriculture.findOne({ userId: req.user.id }).populate('contracts.buyerId', 'fullName phone email');
        handleRes(res, contracts?.contracts || []);
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        const { buyerId, cropName, quantity, agreedPrice, startDate, endDate } = req.body;
        if (!await User.findById(buyerId)) return res.status(404).json({ success: false, message: 'Buyer not found' });
        req.agri.contracts.push({ buyerId, cropName, quantity, agreedPrice, startDate, endDate, status: 'active' });
        await req.agri.save();
        handleRes(res, req.agri.contracts, 201);
    }));

router.put('/contracts/:contractId/status', protect, getAgri, asyncHandler(async (req, res) => {
    const contract = req.agri.contracts.id(req.params.contractId);
    if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });
    contract.status = req.body.status;
    await req.agri.save();
    handleRes(res, contract);
}));

// ==================== STATS & DASHBOARD ====================
router.get('/stats', protect, getAgri, asyncHandler(async (req, res) => {
    handleRes(res, req.agri.stats);
}));

router.get('/dashboard', protect, getAgri, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('fullName email phone village district profileImage');
    handleRes(res, {
        user, stats: req.agri.stats,
        recentCrops: req.agri.crops.slice(-5),
        recentOrders: req.agri.ordersReceived.slice(-5),
        activeProducts: req.agri.productListings.filter(p => p.status === 'active').length
    });
}));

// ==================== ERROR HANDLER ====================
router.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
});

module.exports = router;