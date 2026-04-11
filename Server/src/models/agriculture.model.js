// models/agriculture.model.js
const mongoose = require('mongoose');

const agricultureSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        // ── Land ─────────────────────────────────────────────────────────────
        landHoldings: [
            {
                surveyNumber: { type: String, trim: true },
                areaInAcres: { type: Number, min: 0 },
                irrigationType: { type: String, enum: ['rainfed', 'canal', 'drip', 'sprinkler', 'tube-well', 'other'], default: 'rainfed' },
                location: { type: String, trim: true },
            },
        ],

        // ── Crops ─────────────────────────────────────────────────────────────
        crops: [
            {
                cropName: { type: String, required: true, trim: true },
                sowingDate: { type: Date },
                expectedHarvestDate: { type: Date },
                areaCultivated: { type: Number, min: 0 },   // in acres
                expectedYield: { type: Number, min: 0 },   // in quintals
                actualYield: { type: Number, min: 0 },
                growthStage: { type: String, enum: ['sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'harvested'], default: 'sowing' },
                photos: [String],
                notes: { type: String, trim: true },
            },
        ],

        // ── Disease detections ────────────────────────────────────────────────
        diseaseDetections: [
            {
                imageUrl: { type: String },
                diseaseName: { type: String, trim: true },
                confidence: { type: Number, min: 0, max: 100 },
                treatment: { type: String, trim: true },
                detectedAt: { type: Date, default: Date.now },
            },
        ],

        // ── Market ─────────────────────────────────────────────────────────────
        productListings: [
            {
                productName: { type: String, required: true, trim: true },
                category: { type: String, trim: true },
                quantityAvailable: { type: Number, min: 0 },
                unit: { type: String, default: 'kg' },
                pricePerUnit: { type: Number, min: 0 },
                status: { type: String, enum: ['active', 'inactive', 'sold-out'], default: 'active' },
                images: [String],
                listedAt: { type: Date, default: Date.now },
            },
        ],

        // ── Orders ─────────────────────────────────────────────────────────────
        ordersReceived: [
            {
                orderId: { type: String },
                buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                productId: { type: mongoose.Schema.Types.ObjectId },
                quantity: { type: Number, min: 0 },
                totalAmount: { type: Number, min: 0 },
                unitPrice: { type: Number, min: 0 },
                deliveryAddress: { type: String, trim: true },
                paymentMethod: { type: String },
                orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
                paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
                buyerRating: { type: Number, min: 1, max: 5 },
                buyerReview: { type: String, trim: true },
                orderDate: { type: Date, default: Date.now },
                confirmedAt: Date,
                shippedAt: Date,
                deliveredAt: Date,
                cancelledAt: Date,
            },
        ],

        ordersPlaced: [
            {
                orderId: { type: String },
                productId: { type: mongoose.Schema.Types.ObjectId },
                sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                quantity: { type: Number, min: 0 },
                totalAmount: { type: Number, min: 0 },
                unitPrice: { type: Number, min: 0 },
                deliveryAddress: { type: String, trim: true },
                paymentMethod: { type: String },
                orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
                paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
                buyerRating: { type: Number, min: 1, max: 5 },
                buyerReview: { type: String, trim: true },
                orderDate: { type: Date, default: Date.now },
                deliveredAt: Date,
                cancelledAt: Date,
            },
        ],

        // ── Contracts ──────────────────────────────────────────────────────────
        contracts: [
            {
                buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                cropName: { type: String, trim: true },
                quantity: { type: Number, min: 0 },
                agreedPrice: { type: Number, min: 0 },
                startDate: Date,
                endDate: Date,
                status: { type: String, enum: ['draft', 'active', 'completed', 'cancelled'], default: 'draft' },
                terms: { type: String, trim: true },
            },
        ],

        // ── Support queries ────────────────────────────────────────────────────
        supportQueries: [
            {
                subject: { type: String, trim: true },
                message: { type: String, trim: true },
                category: { type: String, enum: ['crop', 'order', 'payment', 'general'], default: 'general' },
                status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
                response: { type: String, trim: true },
                createdAt: { type: Date, default: Date.now },
                resolvedAt: Date,
            },
        ],

        // ── Aggregated stats (denormalised for dashboard speed) ────────────────
        stats: {
            totalCrops: { type: Number, default: 0 },
            totalProducts: { type: Number, default: 0 },
            totalOrders: { type: Number, default: 0 },
            totalRevenue: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0, min: 0, max: 5 },
        },
    },
    { timestamps: true }
);

// Indexes
agricultureSchema.index({ userId: 1 });
agricultureSchema.index({ 'productListings.status': 1 });
agricultureSchema.index({ 'ordersReceived.orderStatus': 1 });
agricultureSchema.index({ 'crops.growthStage': 1 });

module.exports = mongoose.model('Agriculture', agricultureSchema);