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

// ==================== HELPER: Get or create Agriculture doc ====================
const getAgri = async (req, res, next) => {
    let agri = await Agriculture.findOne({ userId: req.user.id });
    if (!agri) {
        // Create an empty agriculture document for new farmers
        agri = new Agriculture({ userId: req.user.id });
        await agri.save();
    }
    req.agri = agri;
    next();
};

// ==================== DATA MAPPING HELPERS ====================
// Convert backend (User + Agriculture) → frontend flattened structure
const toFrontendFormat = (user, agriculture) => {
    // agriculture may be null (though we ensure it exists now)
    const agri = agriculture || {};
    return {
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        dob: user.dob ? user.dob.toISOString().split('T')[0] : '',
        gender: user.gender || '',
        village: user.village || '',
        district: user.district || '',
        state: user.state || '',
        pincode: user.pincode || '',
        fullAddress: user.fullAddress || '',
        bankAccount: {
            accountNumber: user.bankAccount?.accountNumber || '',
            ifsc: user.bankAccount?.ifsc || '',
            bankName: user.bankAccount?.bankName || '',
            accountHolderName: user.bankAccount?.accountHolderName || user.fullName || ''
        },
        landHoldings: agri.landHoldings || []

    };
};

// Convert frontend payload → updates for User and Agriculture
const fromFrontendFormat = (frontendData) => {
    const {
        fullName, phone, dob, gender,
        village, district, state, pincode, fullAddress,
        bankAccount, landHoldings
    } = frontendData;

    const userUpdate = {};
    if (fullName !== undefined) userUpdate.fullName = fullName;
    if (phone !== undefined) userUpdate.phone = phone;
    if (dob !== undefined) userUpdate.dob = dob;
    if (gender !== undefined) userUpdate.gender = gender;
    if (village !== undefined) userUpdate.village = village;
    if (district !== undefined) userUpdate.district = district;
    if (state !== undefined) userUpdate.state = state;
    if (pincode !== undefined) userUpdate.pincode = pincode;
    if (fullAddress !== undefined) userUpdate.fullAddress = fullAddress;
    if (bankAccount !== undefined) userUpdate.bankAccount = bankAccount;

    const agricultureUpdate = {};
    if (landHoldings !== undefined) agricultureUpdate.landHoldings = landHoldings;

    return { userUpdate, agricultureUpdate };
};

// ==================== PROFILE ENDPOINTS ====================
// GET /api/agriculture/profile
router.get('/profile', protect, getAgri, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    const frontendData = toFrontendFormat(user, req.agri);
    res.status(200).json({ success: true, data: frontendData });
}));

// PUT /api/agriculture/profile
router.put('/profile', protect, getAgri, asyncHandler(async (req, res) => {
    const { userUpdate, agricultureUpdate } = fromFrontendFormat(req.body);

    // Update User model
    if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(req.user.id, userUpdate);
    }

    // Update Agriculture model
    if (Object.keys(agricultureUpdate).length > 0) {
        Object.assign(req.agri, agricultureUpdate);
        await req.agri.save();
    }

    // Return updated data
    const updatedUser = await User.findById(req.user.id).select('-password');
    const updatedAgri = await Agriculture.findOne({ userId: req.user.id });
    const frontendData = toFrontendFormat(updatedUser, updatedAgri);
    res.status(200).json({ success: true, data: frontendData });
}));

// ==================== CROPS ====================
router.route('/crops')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        res.status(200).json({ success: true, data: req.agri.crops });
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.crops.push(req.body);
        req.agri.stats.totalCrops = req.agri.crops.length;
        await req.agri.save();
        res.status(201).json({ success: true, data: req.agri.crops });
    }));

router.route('/crops/:cropId')
    .put(protect, getAgri, asyncHandler(async (req, res) => {
        const crop = req.agri.crops.id(req.params.cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        Object.assign(crop, req.body);
        await req.agri.save();
        res.status(200).json({ success: true, data: crop });
    }))
    .delete(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.crops.id(req.params.cropId).remove();
        req.agri.stats.totalCrops = req.agri.crops.length;
        await req.agri.save();
        res.status(200).json({ success: true, message: 'Crop deleted' });
    }));

// ==================== DISEASE DETECTIONS ====================
router.route('/diseases')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        res.status(200).json({ success: true, data: req.agri.diseaseDetections });
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.diseaseDetections.push({ ...req.body, detectedAt: new Date() });
        await req.agri.save();
        res.status(201).json({ success: true, data: req.agri.diseaseDetections });
    }));

// ==================== PRODUCT LISTINGS ====================
router.get('/products', asyncHandler(async (req, res) => {
    const farmers = await Agriculture.find({ 'productListings.status': 'active' }).populate('userId', 'fullName phone village district');
    const products = farmers.flatMap(f =>
        f.productListings.filter(p => p.status === 'active').map(p => ({
            ...p.toObject(),
            farmerName: f.userId?.fullName,
            farmerPhone: f.userId?.phone,
            farmerLocation: `${f.userId?.village || ''}, ${f.userId?.district || ''}`
        }))
    );
    res.status(200).json({ success: true, data: products });
}));

router.route('/my-products')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        res.status(200).json({ success: true, data: req.agri.productListings });
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.productListings.push({ ...req.body, status: 'active', listedAt: new Date() });
        req.agri.stats.totalProducts = req.agri.productListings.length;
        await req.agri.save();
        res.status(201).json({ success: true, data: req.agri.productListings });
    }));

router.route('/my-products/:productId')
    .put(protect, getAgri, asyncHandler(async (req, res) => {
        const product = req.agri.productListings.id(req.params.productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        Object.assign(product, req.body);
        await req.agri.save();
        res.status(200).json({ success: true, data: product });
    }))
    .delete(protect, getAgri, asyncHandler(async (req, res) => {
        req.agri.productListings.id(req.params.productId).remove();
        req.agri.stats.totalProducts = req.agri.productListings.length;
        await req.agri.save();
        res.status(200).json({ success: true, message: 'Product deleted' });
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
    const order = {
        buyerId: req.user.id,
        productId: req.params.productId,
        quantity,
        totalAmount,
        status: 'pending',
        orderDate: new Date()
    };
    seller.ordersReceived.push(order);
    product.quantityAvailable -= quantity;
    if (product.quantityAvailable === 0) product.status = 'sold';
    seller.stats.totalOrders = seller.ordersReceived.length;
    seller.stats.totalRevenue = seller.ordersReceived.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);
    await seller.save();

    // Ensure buyer has an Agriculture document (for ordersPlaced if needed)
    await Agriculture.findOneAndUpdate({ userId: req.user.id }, {}, { upsert: true, new: true });

    res.status(201).json({ success: true, data: order });
}));

router.get('/orders/seller', protect, getAgri, asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: req.agri.ordersReceived });
}));

router.put('/orders/:orderId/status', protect, getAgri, asyncHandler(async (req, res) => {
    const order = req.agri.ordersReceived.id(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = req.body.status;
    if (req.body.status === 'delivered') {
        req.agri.stats.totalRevenue = req.agri.ordersReceived
            .filter(o => o.status === 'delivered')
            .reduce((s, o) => s + o.totalAmount, 0);
    }
    await req.agri.save();
    res.status(200).json({ success: true, data: order });
}));

// ==================== CONTRACT FARMING ====================
router.route('/contracts')
    .get(protect, getAgri, asyncHandler(async (req, res) => {
        const contracts = await Agriculture.findOne({ userId: req.user.id }).populate('contracts.buyerId', 'fullName phone email');
        res.status(200).json({ success: true, data: contracts?.contracts || [] });
    }))
    .post(protect, getAgri, asyncHandler(async (req, res) => {
        const { buyerId, cropName, quantity, agreedPrice, startDate, endDate } = req.body;
        if (!await User.findById(buyerId)) {
            return res.status(404).json({ success: false, message: 'Buyer not found' });
        }
        req.agri.contracts.push({ buyerId, cropName, quantity, agreedPrice, startDate, endDate, status: 'active' });
        await req.agri.save();
        res.status(201).json({ success: true, data: req.agri.contracts });
    }));

router.put('/contracts/:contractId/status', protect, getAgri, asyncHandler(async (req, res) => {
    const contract = req.agri.contracts.id(req.params.contractId);
    if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });
    contract.status = req.body.status;
    await req.agri.save();
    res.status(200).json({ success: true, data: contract });
}));

// ==================== STATS & DASHBOARD ====================
router.get('/stats', protect, getAgri, asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: req.agri.stats });
}));

router.get('/dashboard', protect, getAgri, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('fullName email phone village district profileImage');
    res.status(200).json({
        success: true,
        data: {
            user,
            stats: req.agri.stats,
            recentCrops: req.agri.crops.slice(-5),
            recentOrders: req.agri.ordersReceived.slice(-5),
            activeProducts: req.agri.productListings.filter(p => p.status === 'active').length
        }
    });
}));

// ==================== GLOBAL ERROR HANDLER ====================
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
});

module.exports = router;