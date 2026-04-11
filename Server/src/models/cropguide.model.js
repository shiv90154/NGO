// models/cropGuide.model.js
const mongoose = require('mongoose');

const cropGuideSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        season: { type: String, required: true, enum: ['Rabi', 'Kharif', 'Zaid', 'Perennial'] },
        duration: { type: String, required: true },          // e.g. "120-150 days"
        soil: { type: String, required: true },
        tips: { type: String, required: true },
        waterRequirement: { type: String, required: true },          // e.g. "Moderate (450-650 mm)"
        temperature: { type: String, required: true },          // e.g. "10°C - 25°C"
        rainfall: { type: String, required: true },          // e.g. "75-100 cm"
        fertilizer: { type: String, required: true },          // e.g. "NPK - 120:60:40 kg/ha"
        imageColor: { type: String, default: 'from-green-500 to-emerald-600' }, // Tailwind gradient kept for FE
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

cropGuideSchema.index({ season: 1 });
cropGuideSchema.index({ name: 'text' }); // enables $text search

module.exports = mongoose.model('CropGuide', cropGuideSchema);

