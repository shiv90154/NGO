// controllers/agricultureController.js
const mongoose = require('mongoose');
const Agriculture = require('../models/agriculture.model');
const User = require('../models/user.model');

// ======================
// FARMER REGISTRATION & PROFILE CONTROLLERS
// ======================

// @desc    Register new farmer
// @route   POST /api/agriculture/farmers
// @access  Public
exports.registerFarmer = async (req, res) => {
    try {
        const { name, email, password, phone, farmerDetails } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'AGRICULTURE'
        });

        const agriculture = await Agriculture.create({
            _id: user._id,
            farmerDetails: farmerDetails
        });

        res.status(201).json({ success: true, data: agriculture });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all farmers (Admin only)
// @route   GET /api/agriculture/farmers
exports.getFarmers = async (req, res) => {
    try {
        const farmers = await Agriculture.find().populate('farmerDetails');
        res.json({ success: true, data: farmers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get farmer by ID
// @route   GET /api/agriculture/farmers/:id
exports.getFarmerById = async (req, res) => {
    try {
        const farmer = await Agriculture.findById(req.params.id || req.user.id);
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        res.json({ success: true, data: farmer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update farmer profile
// @route   PUT /api/agriculture/farmers/:id
exports.updateFarmer = async (req, res) => {
    try {
        const farmer = await Agriculture.findById(req.params.id);
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        if (farmer._id.toString() !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updated = await Agriculture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete farmer (Admin only)
// @route   DELETE /api/agriculture/farmers/:id
exports.deleteFarmer = async (req, res) => {
    try {
        const farmer = await Agriculture.findById(req.params.id);
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        await User.findByIdAndDelete(req.params.id);
        await farmer.remove();
        res.json({ success: true, message: 'Farmer deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get dashboard data
// @route   GET /api/agriculture/dashboard
exports.getDashboardData = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const dashboardData = {
            farmingStats: agriculture.farmingStats,
            activeCrops: agriculture.crops.filter(c => c.growthStage !== 'harvested'),
            recentOrders: agriculture.ordersReceived.slice(-5),
            activeListings: agriculture.productListings.filter(l => l.status === 'active'),
            recentQueries: agriculture.supportQueries.slice(-3)
        };

        res.json({ success: true, data: dashboardData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get farming stats
// @route   GET /api/agriculture/stats
exports.getFarmingStats = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        res.json({ success: true, data: agriculture.farmingStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// CROP MANAGEMENT CONTROLLERS
// ======================

// @desc    Add new crop
// @route   POST /api/agriculture/crops
exports.addCrop = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.crops.push(req.body);
        await agriculture.save();

        res.status(201).json({ success: true, data: agriculture.crops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my crops
// @route   GET /api/agriculture/crops
exports.getMyCrops = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        res.json({ success: true, data: agriculture.crops });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update crop
// @route   PUT /api/agriculture/crops/:cropId
exports.updateCrop = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
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

// @desc    Delete crop
// @route   DELETE /api/agriculture/crops/:cropId
exports.deleteCrop = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.crops.id(req.params.cropId).remove();
        await agriculture.save();

        res.json({ success: true, message: 'Crop deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload crop photos
// @route   POST /api/agriculture/crops/:cropId/photos
exports.uploadCropPhotos = async (req, res) => {
    try {
        const { photos, statusUpdate } = req.body;
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const crop = agriculture.crops.id(req.params.cropId);
        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

        agriculture.cropPhotos.push({
            cropId: req.params.cropId,
            photos: photos,
            statusUpdate: statusUpdate
        });

        await agriculture.save();
        res.status(201).json({ success: true, data: agriculture.cropPhotos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get crop photos
// @route   GET /api/agriculture/crops/:cropId/photos
exports.getCropPhotos = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const photos = agriculture.cropPhotos.filter(p => p.cropId.toString() === req.params.cropId);
        res.json({ success: true, data: photos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// PRODUCT LISTING CONTROLLERS
// ======================

// @desc    Create product listing
// @route   POST /api/agriculture/products
exports.createProductListing = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.productListings.push(req.body);
        await agriculture.save();

        res.status(201).json({ success: true, data: agriculture.productListings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my listings
// @route   GET /api/agriculture/products/my-listings
exports.getMyListings = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        res.json({ success: true, data: agriculture.productListings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update listing
// @route   PUT /api/agriculture/products/:productId
exports.updateListing = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
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

// @desc    Delete listing
// @route   DELETE /api/agriculture/products/:productId
exports.deleteListing = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        agriculture.productListings.id(req.params.productId).remove();
        await agriculture.save();

        res.json({ success: true, message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active products (public)
// @route   GET /api/agriculture/products
exports.getAllProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;

        const farmers = await Agriculture.find({});
        let allProducts = [];

        farmers.forEach(farmer => {
            const activeProducts = farmer.productListings.filter(p => p.status === 'active');
            allProducts.push(...activeProducts);
        });

        if (category) allProducts = allProducts.filter(p => p.category === category);
        if (search) allProducts = allProducts.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()));

        const start = (page - 1) * limit;
        const paginated = allProducts.slice(start, start + limit);

        res.json({
            success: true,
            data: paginated,
            pagination: { page, limit, total: allProducts.length, pages: Math.ceil(allProducts.length / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get product by ID
// @route   GET /api/agriculture/products/:productId
exports.getProductById = async (req, res) => {
    try {
        const farmers = await Agriculture.find({});
        let foundProduct = null;

        for (const farmer of farmers) {
            const product = farmer.productListings.id(req.params.productId);
            if (product) {
                foundProduct = product;
                break;
            }
        }

        if (!foundProduct) return res.status(404).json({ success: false, message: 'Product not found' });

        res.json({ success: true, data: foundProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// ORDER MANAGEMENT CONTROLLERS
// ======================

// @desc    Place order
// @route   POST /api/agriculture/orders
exports.placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId, quantity, deliveryAddress, paymentMethod } = req.body;

        // Find seller
        const seller = await Agriculture.findOne({ 'productListings._id': productId });
        if (!seller) return res.status(404).json({ success: false, message: 'Product not found' });

        const product = seller.productListings.id(productId);
        if (!product || product.status !== 'active') {
            return res.status(400).json({ success: false, message: 'Product not available' });
        }

        const totalAmount = product.pricePerUnit * quantity;
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

        const orderData = {
            orderId,
            productId,
            buyerId: req.user.id,
            quantity,
            totalAmount,
            unitPrice: product.pricePerUnit,
            deliveryAddress,
            paymentMethod,
            orderStatus: 'pending',
            paymentStatus: 'pending'
        };

        // Add to seller's ordersReceived
        seller.ordersReceived.push(orderData);
        await seller.save({ session });

        // Add to buyer's ordersPlaced
        const buyer = await Agriculture.findById(req.user.id);
        if (buyer) {
            buyer.ordersPlaced.push(orderData);
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

// @desc    Get my orders (as buyer)
// @route   GET /api/agriculture/orders
exports.getMyOrders = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, data: agriculture.ordersPlaced });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status (for seller)
// @route   PUT /api/agriculture/orders/:orderId/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const order = agriculture.ordersReceived.id(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.orderStatus = status;
        if (status === 'delivered') order.deliveredAt = Date.now();
        if (status === 'confirmed') order.confirmedAt = Date.now();
        if (status === 'shipped') order.shippedAt = Date.now();
        if (status === 'cancelled') order.cancelledAt = Date.now();

        await agriculture.save();
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel order (for buyer)
// @route   PUT /api/agriculture/orders/:orderId/cancel
exports.cancelOrder = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });

        const order = agriculture.ordersPlaced.id(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.orderStatus !== 'pending') {
            return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
        }

        order.orderStatus = 'cancelled';
        order.cancelledAt = Date.now();
        await agriculture.save();

        // Also update in seller's ordersReceived
        const seller = await Agriculture.findOne({ 'ordersReceived.orderId': order.orderId });
        if (seller) {
            const sellerOrder = seller.ordersReceived.id(order._id);
            if (sellerOrder) {
                sellerOrder.orderStatus = 'cancelled';
                await seller.save();
            }
        }

        res.json({ success: true, message: 'Order cancelled' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// REVIEWS & RATINGS CONTROLLERS
// ======================

// @desc    Add review for seller
// @route   POST /api/agriculture/reviews/:orderId
exports.addReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });

        const order = agriculture.ordersPlaced.id(req.params.orderId);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.orderStatus !== 'delivered') {
            return res.status(400).json({ success: false, message: 'Can only review delivered orders' });
        }

        order.buyerRating = rating;
        order.buyerReview = review;
        await agriculture.save();

        // Update seller's average rating
        const seller = await Agriculture.findOne({ 'ordersReceived.orderId': order.orderId });
        if (seller) {
            const completedOrders = seller.ordersReceived.filter(o => o.buyerRating);
            const avgRating = completedOrders.reduce((sum, o) => sum + o.buyerRating, 0) / completedOrders.length;
            seller.farmingStats.averageRating = avgRating || 0;
            await seller.save();
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get seller reviews
// @route   GET /api/agriculture/reviews/seller/:sellerId
exports.getSellerReviews = async (req, res) => {
    try {
        const seller = await Agriculture.findById(req.params.sellerId);
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
// SUPPORT QUERIES CONTROLLERS
// ======================

// @desc    Create support query
// @route   POST /api/agriculture/support
exports.createSupportQuery = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });

        agriculture.supportQueries.push(req.body);
        await agriculture.save();

        res.status(201).json({ success: true, data: agriculture.supportQueries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my queries
// @route   GET /api/agriculture/support
exports.getMyQueries = async (req, res) => {
    try {
        const agriculture = await Agriculture.findById(req.user.id);
        if (!agriculture) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, data: agriculture.supportQueries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};