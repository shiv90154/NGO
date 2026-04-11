// controllers/agricultureController.js
const mongoose = require('mongoose');
const Agriculture = require('../models/agriculture.model');
const CropGuide = require('../models/cropGuide.model');
const User = require('../models/user.model');

// ======================
// FARMER PROFILE
// ======================

exports.registerFarmer = async (req, res) => {
    try {
        const { name, email, password, phone, farmerDetails } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        const user = await User.create({ name, email, password, phone, role: 'AGRICULTURE' });
        const agriculture = await Agriculture.create({ userId: user._id, ...farmerDetails });

        res.status(201).json({ success: true, data: agriculture });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFarmers = async (req, res) => {
    try {
        const farmers = await Agriculture.find().populate('userId', 'fullName email phone');
        res.json({ success: true, data: farmers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFarmerById = async (req, res) => {
    try {
        const farmer = await Agriculture.findOne({ userId: req.params.id || req.user.id });
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
        res.json({ success: true, data: farmer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateFarmer = async (req, res) => {
    try {
        const farmer = await Agriculture.findOne({ userId: req.params.id });
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        if (farmer.userId.toString() !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updated = await Agriculture.findOneAndUpdate({ userId: req.params.id }, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteFarmer = async (req, res) => {
    try {
        const farmer = await Agriculture.findOneAndDelete({ userId: req.params.id });
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Farmer deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        res.json({
            success: true,
            data: {
                stats: agriculture.stats,
                activeCrops: agriculture.crops.filter(c => c.growthStage !== 'harvested'),
                recentOrders: agriculture.ordersReceived.slice(-5),
                activeListings: agriculture.productListings.filter(l => l.status === 'active'),
                recentQueries: agriculture.supportQueries.slice(-3),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFarmingStats = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });
        res.json({ success: true, data: agriculture.stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// CROP MANAGEMENT
// ======================

exports.addCrop = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.crops.push(req.body);
        agriculture.stats.totalCrops = agriculture.crops.length;
        await agriculture.save();

        res.status(201).json({ success: true, data: agriculture.crops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyCrops = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });
        res.json({ success: true, data: agriculture.crops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCrop = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const crop = agriculture.crops.id(req.params.cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

        Object.assign(crop, req.body);
        await agriculture.save();
        res.json({ success: true, data: agriculture.crops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCrop = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.crops.pull({ _id: req.params.cropId });
        agriculture.stats.totalCrops = agriculture.crops.length;
        await agriculture.save();
        res.json({ success: true, message: 'Crop deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadCropPhotos = async (req, res) => {
    try {
        const { photos, statusUpdate } = req.body;
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const crop = agriculture.crops.id(req.params.cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

        crop.photos.push(...(photos || []));
        if (statusUpdate) crop.notes = statusUpdate;
        await agriculture.save();
        res.status(201).json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCropPhotos = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const crop = agriculture.crops.id(req.params.cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

        res.json({ success: true, data: crop.photos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// PRODUCT LISTINGS
// ======================

exports.createProductListing = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.productListings.push(req.body);
        agriculture.stats.totalProducts = agriculture.productListings.length;
        await agriculture.save();
        res.status(201).json({ success: true, data: agriculture.productListings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyListings = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });
        res.json({ success: true, data: agriculture.productListings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateListing = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const listing = agriculture.productListings.id(req.params.productId);
        if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

        Object.assign(listing, req.body);
        await agriculture.save();
        res.json({ success: true, data: agriculture.productListings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteListing = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.productListings.pull({ _id: req.params.productId });
        agriculture.stats.totalProducts = agriculture.productListings.length;
        await agriculture.save();
        res.json({ success: true, message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        // Efficient aggregation instead of loading all documents in memory
        const pipeline = [
            { $unwind: '$productListings' },
            { $match: { 'productListings.status': 'active' } },
            ...(category ? [{ $match: { 'productListings.category': category } }] : []),
            ...(search ? [{ $match: { 'productListings.productName': { $regex: search, $options: 'i' } } }] : []),
            { $replaceRoot: { newRoot: '$productListings' } },
            { $skip: (page - 1) * Number(limit) },
            { $limit: Number(limit) },
        ];

        const products = await Agriculture.aggregate(pipeline);
        const total = await Agriculture.aggregate([
            { $unwind: '$productListings' },
            { $match: { 'productListings.status': 'active' } },
            { $count: 'count' },
        ]);

        res.json({
            success: true,
            data: products,
            pagination: { page: Number(page), limit: Number(limit), total: total[0]?.count || 0, pages: Math.ceil((total[0]?.count || 0) / limit) },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const result = await Agriculture.aggregate([
            { $unwind: '$productListings' },
            { $match: { 'productListings._id': new mongoose.Types.ObjectId(req.params.productId) } },
            { $replaceRoot: { newRoot: '$productListings' } },
        ]);

        if (!result.length) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// ORDERS
// ======================

exports.placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { productId, quantity, deliveryAddress, paymentMethod } = req.body;

        const seller = await Agriculture.findOne({ 'productListings._id': productId }).session(session);
        if (!seller) return res.status(404).json({ success: false, message: 'Product not found' });

        const product = seller.productListings.id(productId);
        if (!product || product.status !== 'active') {
            return res.status(400).json({ success: false, message: 'Product not available' });
        }

        const totalAmount = product.pricePerUnit * quantity;
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const orderData = { orderId, productId, buyerId: req.user.id, quantity, totalAmount, unitPrice: product.pricePerUnit, deliveryAddress, paymentMethod };

        seller.ordersReceived.push(orderData);
        seller.stats.totalOrders = seller.ordersReceived.length;
        seller.stats.totalRevenue += totalAmount;
        await seller.save({ session });

        const buyer = await Agriculture.findOne({ userId: req.user.id }).session(session);
        if (buyer) {
            buyer.ordersPlaced.push({ ...orderData, sellerId: seller.userId });
            await buyer.save({ session });
        }

        await session.commitTransaction();
        res.status(201).json({ success: true, data: orderData });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: agriculture.ordersPlaced });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const order = agriculture.ordersReceived.id(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.orderStatus = status;
        const now = Date.now();
        if (status === 'confirmed') order.confirmedAt = now;
        if (status === 'shipped') order.shippedAt = now;
        if (status === 'delivered') order.deliveredAt = now;
        if (status === 'cancelled') order.cancelledAt = now;

        await agriculture.save();
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });

        const order = agriculture.ordersPlaced.id(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.orderStatus !== 'pending') return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });

        order.orderStatus = 'cancelled';
        order.cancelledAt = Date.now();
        await agriculture.save();

        // Mirror cancellation to seller
        const seller = await Agriculture.findOne({ 'ordersReceived.orderId': order.orderId });
        if (seller) {
            const sellerOrder = seller.ordersReceived.find(o => o.orderId === order.orderId);
            if (sellerOrder) { sellerOrder.orderStatus = 'cancelled'; await seller.save(); }
        }

        res.json({ success: true, message: 'Order cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// REVIEWS
// ======================

exports.addReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });

        const order = agriculture.ordersPlaced.id(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.orderStatus !== 'delivered') return res.status(400).json({ success: false, message: 'Can only review delivered orders' });

        order.buyerRating = rating;
        order.buyerReview = review;
        await agriculture.save();

        // Recalculate seller average rating
        const seller = await Agriculture.findOne({ 'ordersReceived.orderId': order.orderId });
        if (seller) {
            const rated = seller.ordersReceived.filter(o => o.buyerRating);
            seller.stats.averageRating = rated.length ? rated.reduce((s, o) => s + o.buyerRating, 0) / rated.length : 0;
            await seller.save();
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSellerReviews = async (req, res) => {
    try {
        const seller = await Agriculture.findOne({ userId: req.params.sellerId });
        if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

        const reviews = seller.ordersReceived
            .filter(o => o.buyerRating)
            .map(o => ({ rating: o.buyerRating, review: o.buyerReview, date: o.deliveredAt }));

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// SUPPORT QUERIES
// ======================

exports.createSupportQuery = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });
        agriculture.supportQueries.push(req.body);
        await agriculture.save();
        res.status(201).json({ success: true, data: agriculture.supportQueries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyQueries = async (req, res) => {
    try {
        const agriculture = await Agriculture.findOne({ userId: req.user.id });
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: agriculture.supportQueries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// CROP GUIDE  (public reference data — no auth needed)
// ======================

// @desc   Get all crop guide entries (with optional season filter & search)
// @route  GET /api/agriculture/crop-guide
// @access Public
exports.getCropGuide = async (req, res) => {
    try {
        const { season, search, page = 1, limit = 50 } = req.query;

        const filter = { isActive: true };
        if (season && season !== 'All') filter.season = season;
        if (search) filter.$text = { $search: search };           // uses the text index on `name`

        const crops = await CropGuide.find(filter)
            .sort({ season: 1, name: 1 })
            .skip((page - 1) * Number(limit))
            .limit(Number(limit))
            .select('-__v');

        const total = await CropGuide.countDocuments(filter);

        res.json({
            success: true,
            data: crops,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
                seasons: ['Rabi', 'Kharif', 'Zaid', 'Perennial'],
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get single crop guide entry by ID or name
// @route  GET /api/agriculture/crop-guide/:idOrName
// @access Public
exports.getCropGuideById = async (req, res) => {
    try {
        const { idOrName } = req.params;
        const isObjectId = mongoose.Types.ObjectId.isValid(idOrName);

        const crop = isObjectId
            ? await CropGuide.findById(idOrName).select('-__v')
            : await CropGuide.findOne({ name: { $regex: `^${idOrName}$`, $options: 'i' } }).select('-__v');

        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        res.json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Add a crop guide entry (admin only)
// @route  POST /api/agriculture/crop-guide
// @access Admin
exports.addCropGuideEntry = async (req, res) => {
    try {
        const crop = await CropGuide.create(req.body);
        res.status(201).json({ success: true, data: crop });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'A crop with this name already exists' });
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Update a crop guide entry (admin only)
// @route  PUT /api/agriculture/crop-guide/:id
// @access Admin
exports.updateCropGuideEntry = async (req, res) => {
    try {
        const crop = await CropGuide.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-__v');
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        res.json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Delete a crop guide entry (admin only)
// @route  DELETE /api/agriculture/crop-guide/:id
// @access Admin
exports.deleteCropGuideEntry = async (req, res) => {
    try {
        const crop = await CropGuide.findByIdAndDelete(req.params.id);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
        res.json({ success: true, message: `${crop.name} removed from crop guide` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};