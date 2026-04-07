// models/Agriculture.js
const mongoose = require('mongoose');
const User = require('./user.model');

// ==================== FARMER REGISTRATION ====================
const farmerDetailsSchema = new mongoose.Schema({
    aadhaarNumber: { type: String, sparse: true, unique: true },
    phoneNumber: { type: String, required: true },
    alternatePhone: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: {
        village: { type: String, required: true },
        postOffice: String,
        district: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: String
    },
    landHoldings: [{
        surveyNumber: { type: String, required: true },
        areaInAcres: { type: Number, required: true },
        irrigationType: { type: String, enum: ['canal', 'borewell', 'rainfed', 'drip', 'sprinkler'] },
        ownershipType: { type: String, enum: ['owned', 'leased', 'shared'], default: 'owned' }
    }],
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountHolderName: String,
        upiId: String
    },
    isVerified: { type: Boolean, default: false },
    verificationDate: Date,
    registeredAt: { type: Date, default: Date.now }
});

// ==================== CROP MANAGEMENT ====================
const cropDetailSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    variety: String,
    category: {
        type: String,
        enum: ['cereal', 'pulses', 'oilseeds', 'vegetables', 'fruits', 'spices', 'flowers', 'cash_crops'],
        required: true
    },
    expectedHarvestDate: Date,
    actualHarvestDate: Date,
    landSurveyNumber: { type: String, required: true },
    areaCultivated: { type: Number, required: true },
    cropHealth: {
        type: String,
        enum: ['excellent', 'good', 'average', 'poor', 'critical'],
        default: 'good'
    },
    expectedYield: { type: Number },
    actualYield: { type: Number },
    yieldUnit: { type: String, default: 'kg' },
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// ==================== CROP PHOTOS ====================
const cropPhotoSchema = new mongoose.Schema({
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropDetail', required: true },
    photos: [{
        url: { type: String, required: true },
        caption: String,
        growthStage: String,
        uploadedAt: { type: Date, default: Date.now },
        location: {
            latitude: Number,
            longitude: Number
        }
    }],
    statusUpdate: {
        healthStatus: String,
        growthProgress: Number,
        notes: String
    }
});

// ==================== AI CROP DISEASE DETECTION ====================
const diseaseDetectionSchema = new mongoose.Schema({
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropDetail' },
    imageUrl: { type: String, required: true },
    detectionDate: { type: Date, default: Date.now },
    diseaseName: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 100, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    symptoms: [String],
    causes: [String],
    treatment: {
        organic: String,
        chemical: String,
        precautions: [String]
    },
    preventionTips: [String],
    detectedBy: { type: String, enum: ['ai', 'expert', 'farmer'], default: 'ai' },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    status: { type: String, enum: ['pending', 'confirmed', 'false_positive'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// ==================== PRODUCT SELLING SYSTEM ====================
const productListingSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropDetail' },
    category: { type: String, enum: ['cereal', 'pulses', 'oilseeds', 'vegetables', 'fruits', 'spices', 'flowers', 'cash_crops'] },
    variety: String,
    quantityAvailable: { type: Number, required: true },
    quantityUnit: { type: String, default: 'kg', enum: ['kg', 'quintal', 'ton', 'pieces'] },
    minimumOrderQuantity: { type: Number, default: 1 },
    pricePerUnit: { type: Number, required: true },
    priceNegotiable: { type: Boolean, default: false },
    expectedPrice: Number,
    quality: {
        grade: { type: String, enum: ['A', 'B', 'C', 'organic'] },
        certification: String,
        isOrganic: { type: Boolean, default: false },
        inspectionDate: Date,
        labReportUrl: String
    },
    listingType: { type: String, enum: ['fixed', 'auction', 'bidding'], default: 'fixed' },
    status: { type: String, enum: ['active', 'sold', 'expired', 'paused'], default: 'active' },
    productPhotos: [String],
    deliveryOptions: {
        selfPickup: { type: Boolean, default: true },
        localDelivery: { type: Boolean, default: false },
        shipping: { type: Boolean, default: false },
        deliveryRadius: Number,
        deliveryCharge: { type: Number, default: 0 }
    },
    listedAt: { type: Date, default: Date.now },
    expiryDate: Date,
    soldAt: Date,
    views: { type: Number, default: 0 },
    interestedBuyers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// ==================== ORDER MANAGEMENT ====================
const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductListing', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    unitPrice: Number,
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'completed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'bank_transfer', 'upi', 'credit', 'escrow']
    },
    paymentId: String,
    deliveryAddress: {
        fullAddress: { type: String, required: true },
        contactPerson: { type: String, required: true },
        contactNumber: { type: String, required: true },
        landmark: String
    },
    deliveryDate: Date,
    deliveredAt: Date,
    trackingId: String,
    orderDate: { type: Date, default: Date.now },
    confirmedAt: Date,
    shippedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    buyerNotes: String,
    sellerNotes: String,
    buyerRating: { type: Number, min: 1, max: 5 },
    buyerReview: String,
    sellerRating: { type: Number, min: 1, max: 5 },
    sellerReview: String
});

// ==================== CONTRACT FARMING ====================
const contractSchema = new mongoose.Schema({
    contractId: { type: String, unique: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true },
    cropVariety: String,
    quantity: { type: Number, required: true },
    quantityUnit: { type: String, default: 'kg' },
    agreedPrice: { type: Number, required: true },
    totalValue: { type: Number, required: true },

    // Contract Terms
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    deliverySchedule: [{
        date: Date,
        quantity: Number,
        status: { type: String, enum: ['pending', 'delivered', 'partial'], default: 'pending' },
        deliveredAt: Date
    }],

    // Payment Terms
    advancePayment: { type: Number, default: 0 },
    advancePaid: { type: Boolean, default: false },
    advancePaidAt: Date,
    paymentSchedule: {
        type: String,
        enum: ['full_on_delivery', 'partial_upfront', 'installments'],
        default: 'full_on_delivery'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'completed', 'overdue'],
        default: 'pending'
    },

    // Quality Specifications
    qualitySpecs: {
        minGrade: { type: String, enum: ['A', 'B', 'C'] },
        moistureContent: { type: Number, max: 100 },
        purityPercentage: { type: Number, min: 0, max: 100 },
        sizeRequirement: String,
        colorRequirement: String,
        additionalSpecs: Map
    },

    // Support Provided by Buyer
    supportProvided: {
        seeds: { type: Boolean, default: false },
        fertilizer: { type: Boolean, default: false },
        pesticides: { type: Boolean, default: false },
        training: { type: Boolean, default: false },
        technicalSupport: { type: Boolean, default: false },
        equipment: { type: Boolean, default: false },
        details: String
    },

    // Contract Status
    status: {
        type: String,
        enum: ['draft', 'pending_approval', 'active', 'completed', 'cancelled', 'disputed'],
        default: 'draft'
    },

    // Penalty Clauses
    penaltyClauses: {
        lateDelivery: { type: Number, default: 0 },
        qualityFailure: { type: Number, default: 0 },
        breachOfContract: { type: Number, default: 0 },
        terms: String
    },

    // Documents
    contractDocument: String,
    signedByFarmer: { type: Boolean, default: false },
    signedByBuyer: { type: Boolean, default: false },
    signedAt: Date,

    // Disputes
    disputes: [{
        raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        description: String,
        resolution: String,
        status: { type: String, enum: ['open', 'resolved', 'escalated'], default: 'open' },
        createdAt: { type: Date, default: Date.now },
        resolvedAt: Date
    }],

    // Ratings
    farmerRating: { type: Number, min: 1, max: 5 },
    buyerRating: { type: Number, min: 1, max: 5 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// ==================== SUPPORT QUERIES ====================
const supportQuerySchema = new mongoose.Schema({
    queryType: {
        type: String,
        enum: ['technical', 'payment', 'product', 'delivery', 'contract', 'general'],
        required: true
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [String],
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolution: String,
    createdAt: { type: Date, default: Date.now },
    resolvedAt: Date
});

// ==================== NOTIFICATIONS ====================
const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['order', 'contract', 'disease', 'crop', 'payment', 'system'],
        required: true
    },
    isRead: { type: Boolean, default: false },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
    createdAt: { type: Date, default: Date.now }
});

// ==================== MAIN AGRICULTURE SCHEMA ====================
const agricultureSchema = new mongoose.Schema({
    farmerDetails: farmerDetailsSchema,
    crops: [cropDetailSchema],
    cropPhotos: [cropPhotoSchema],
    diseaseDetections: [diseaseDetectionSchema],
    productListings: [productListingSchema],
    ordersReceived: [orderSchema],
    ordersPlaced: [orderSchema],
    contractsAsFarmer: [contractSchema],
    contractsAsBuyer: [contractSchema],
    supportQueries: [supportQuerySchema],
    notifications: [notificationSchema],

    // AI Model Settings
    aiSettings: {
        diseaseDetectionEnabled: { type: Boolean, default: true },
        autoAlertEnabled: { type: Boolean, default: true },
        confidenceThreshold: { type: Number, default: 70 },
        lastModelUpdate: Date
    },

    // Statistics
    farmingStats: {
        totalCropsPlanted: { type: Number, default: 0 },
        activeCrops: { type: Number, default: 0 },
        harvestedCrops: { type: Number, default: 0 },
        totalProductsListed: { type: Number, default: 0 },
        activeListings: { type: Number, default: 0 },
        totalOrdersReceived: { type: Number, default: 0 },
        completedOrders: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalLandCultivated: { type: Number, default: 0 },
        activeContracts: { type: Number, default: 0 },
        completedContracts: { type: Number, default: 0 },
        totalContractValue: { type: Number, default: 0 },
        diseasesDetected: { type: Number, default: 0 },
        diseasesResolved: { type: Number, default: 0 }
    },

    // Preferences
    preferences: {
        notifications: {
            cropReminders: { type: Boolean, default: true },
            weatherAlerts: { type: Boolean, default: true },
            orderUpdates: { type: Boolean, default: true },
            pestAlerts: { type: Boolean, default: true },
            diseaseAlerts: { type: Boolean, default: true },
            contractUpdates: { type: Boolean, default: true },
            marketPrices: { type: Boolean, default: false }
        },
        language: { type: String, default: 'hindi' },
        preferredPaymentMethod: String,
        contractAlertThreshold: { type: Number, default: 7 } // days before contract end
    }
}, { timestamps: true, discriminatorKey: 'role' });

// ==================== INDEXES ====================
agricultureSchema.index({ 'farmerDetails.phoneNumber': 1 });
agricultureSchema.index({ 'farmerDetails.address.district': 1 });
agricultureSchema.index({ 'crops.cropName': 1 });
agricultureSchema.index({ 'crops.growthStage': 1 });
agricultureSchema.index({ 'productListings.status': 1 });
agricultureSchema.index({ 'productListings.category': 1 });
agricultureSchema.index({ 'ordersReceived.orderStatus': 1 });
agricultureSchema.index({ 'ordersReceived.orderDate': -1 });
agricultureSchema.index({ 'contractsAsFarmer.status': 1 });
agricultureSchema.index({ 'contractsAsFarmer.endDate': 1 });
agricultureSchema.index({ 'diseaseDetections.diseaseName': 1 });
agricultureSchema.index({ 'diseaseDetections.status': 1 });

// ==================== MIDDLEWARE ====================
// Update farming statistics
agricultureSchema.pre('save', function (next) {
    if (this.isModified('crops')) {
        this.farmingStats.totalCropsPlanted = this.crops.length;
        this.farmingStats.activeCrops = this.crops.filter(crop => crop.growthStage !== 'harvested').length;
        this.farmingStats.harvestedCrops = this.crops.filter(crop => crop.growthStage === 'harvested').length;

        // Calculate total land cultivated
        const uniqueLand = new Set();
        this.crops.forEach(crop => {
            if (crop.landSurveyNumber) uniqueLand.add(crop.landSurveyNumber);
        });
        this.farmingStats.totalLandCultivated = uniqueLand.size;
    }

    if (this.isModified('productListings')) {
        this.farmingStats.totalProductsListed = this.productListings.length;
        this.farmingStats.activeListings = this.productListings.filter(listing => listing.status === 'active').length;
    }

    if (this.isModified('ordersReceived')) {
        this.farmingStats.totalOrdersReceived = this.ordersReceived.length;
        this.farmingStats.completedOrders = this.ordersReceived.filter(order => order.orderStatus === 'delivered').length;
        this.farmingStats.totalRevenue = this.ordersReceived
            .filter(order => order.orderStatus === 'delivered')
            .reduce((sum, order) => sum + order.totalAmount, 0);
    }

    if (this.isModified('contractsAsFarmer')) {
        this.farmingStats.activeContracts = this.contractsAsFarmer.filter(c => c.status === 'active').length;
        this.farmingStats.completedContracts = this.contractsAsFarmer.filter(c => c.status === 'completed').length;
        this.farmingStats.totalContractValue = this.contractsAsFarmer
            .filter(c => c.status === 'active' || c.status === 'completed')
            .reduce((sum, contract) => sum + contract.totalValue, 0);
    }

    if (this.isModified('diseaseDetections')) {
        this.farmingStats.diseasesDetected = this.diseaseDetections.length;
        this.farmingStats.diseasesResolved = this.diseaseDetections.filter(d => d.status === 'confirmed').length;
    }

    next();
});

// Auto-generate order ID
agricultureSchema.pre('save', function (next) {
    if (this.isModified('ordersReceived')) {
        this.ordersReceived.forEach(order => {
            if (!order.orderId) {
                order.orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
            }
        });
    }
    next();
});

// Auto-generate contract ID
agricultureSchema.pre('save', function (next) {
    if (this.isModified('contractsAsFarmer')) {
        this.contractsAsFarmer.forEach(contract => {
            if (!contract.contractId) {
                contract.contractId = `CTR-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
            }
        });
    }
    if (this.isModified('contractsAsBuyer')) {
        this.contractsAsBuyer.forEach(contract => {
            if (!contract.contractId) {
                contract.contractId = `CTR-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
            }
        });
    }
    next();
});

// Check for contract expiry and send notification
agricultureSchema.pre('save', function (next) {
    const today = new Date();
    this.contractsAsFarmer.forEach(contract => {
        if (contract.status === 'active') {
            const daysUntilExpiry = Math.ceil((contract.endDate - today) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= this.preferences.contractAlertThreshold && daysUntilExpiry > 0) {
                // Auto-create notification
                this.notifications.push({
                    title: 'Contract Expiring Soon',
                    message: `Your contract for ${contract.cropName} will expire in ${daysUntilExpiry} days`,
                    type: 'contract',
                    relatedId: contract._id
                });
            }
        }
    });
    next();
});

// ==================== VIRTUAL PROPERTIES ====================
agricultureSchema.virtual('activeContractsCount').get(function () {
    return this.contractsAsFarmer.filter(c => c.status === 'active').length;
});

agricultureSchema.virtual('pendingOrdersCount').get(function () {
    return this.ordersReceived.filter(o => ['pending', 'confirmed', 'processing'].includes(o.orderStatus)).length;
});

agricultureSchema.virtual('unreadNotificationsCount').get(function () {
    return this.notifications.filter(n => !n.isRead).length;
});

agricultureSchema.virtual('diseaseAlertCount').get(function () {
    return this.diseaseDetections.filter(d => d.status === 'pending' && d.confidence > this.aiSettings.confidenceThreshold).length;
});

agricultureSchema.set('toJSON', { virtuals: true });
agricultureSchema.set('toObject', { virtuals: true });

const Agriculture = User.discriminator('AGRICULTURE', agricultureSchema);
module.exports = Agriculture;