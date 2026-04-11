// models/Agriculture.js
const mongoose = require('mongoose');

const agricultureSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    landHoldings: [{ surveyNumber: String, areaInAcres: Number, irrigationType: String }],
    crops: [{ cropName: String, sowingDate: Date, expectedHarvestDate: Date, areaCultivated: Number, expectedYield: Number, photos: [String] }],
    diseaseDetections: [{ imageUrl: String, diseaseName: String, confidence: Number, treatment: String, detectedAt: Date }],
    productListings: [{ productName: String, quantityAvailable: Number, pricePerUnit: Number, status: String, listedAt: Date }],
    ordersReceived: [{ buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, productId: mongoose.Schema.Types.ObjectId, quantity: Number, totalAmount: Number, status: String, orderDate: Date }],
    contracts: [{ buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, cropName: String, quantity: Number, agreedPrice: Number, startDate: Date, endDate: Date, status: String }],
    stats: {
        totalCrops: { type: Number, default: 0 },
        totalProducts: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Agriculture', agricultureSchema);