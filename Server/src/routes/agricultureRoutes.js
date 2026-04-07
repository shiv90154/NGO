// routes/agricultureRoutes.js
const express = require('express');
const router = express.Router();
const {
    registerFarmer,
    getFarmers,
    getFarmerById,
    updateFarmer,
    deleteFarmer,
    addCrop,
    getMyCrops,
    updateCrop,
    deleteCrop,
    uploadCropPhotos,
    getCropPhotos,
    createProductListing,
    getMyListings,
    updateListing,
    deleteListing,
    getAllProducts,
    getProductById,
    placeOrder,
    getMyOrders,
    updateOrderStatus,
    cancelOrder,
    addReview,
    getSellerReviews,
    createSupportQuery,
    getMyQueries,
    getFarmingStats,
    getDashboardData
} = require('../controllers/agricultureController');

const { protect, authorize } = require('../middleware/auth.middleware');

// ======================
// FARMER REGISTRATION & PROFILE ROUTES
// ======================
router.route('/farmers')
    .get(protect, authorize('SUPER_ADMIN'), getFarmers)
    .post(registerFarmer);

router.route('/farmers/:id')
    .get(protect, getFarmerById)
    .put(protect, updateFarmer)
    .delete(protect, authorize('SUPER_ADMIN'), deleteFarmer);

router.get('/my-profile', protect, getFarmerById);
router.get('/dashboard', protect, getDashboardData);
router.get('/stats', protect, getFarmingStats);

// ======================
// CROP MANAGEMENT ROUTES
// ======================
router.route('/crops')
    .post(protect, addCrop)
    .get(protect, getMyCrops);

router.route('/crops/:cropId')
    .put(protect, updateCrop)
    .delete(protect, deleteCrop);

// Crop Photos
router.route('/crops/:cropId/photos')
    .post(protect, uploadCropPhotos)
    .get(protect, getCropPhotos);

// ======================
// PRODUCT LISTING ROUTES
// ======================
router.route('/products')
    .get(getAllProducts)
    .post(protect, createProductListing);

router.route('/products/my-listings')
    .get(protect, getMyListings);

router.route('/products/:productId')
    .get(getProductById)
    .put(protect, updateListing)
    .delete(protect, deleteListing);

// ======================
// ORDER MANAGEMENT ROUTES
// ======================
router.route('/orders')
    .post(protect, placeOrder)
    .get(protect, getMyOrders);

router.route('/orders/:orderId/status')
    .put(protect, updateOrderStatus);

router.route('/orders/:orderId/cancel')
    .put(protect, cancelOrder);

// ======================
// REVIEWS & RATINGS
// ======================
router.post('/reviews/:orderId', protect, addReview);
router.get('/reviews/seller/:sellerId', getSellerReviews);

// ======================
// SUPPORT QUERIES
// ======================
router.route('/support')
    .post(protect, createSupportQuery)
    .get(protect, getMyQueries);

module.exports = router;