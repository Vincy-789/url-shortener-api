const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    userId: { type: String },
    os: { type: String },
    device: { type: String }
});

const UrlAnalyticsSchema = new mongoose.Schema({
    alias: { type: String, required: true, unique: true },
    clicks: [ClickSchema]
});

const UrlAnalytics = mongoose.model("UrlAnalytics", UrlAnalyticsSchema);

module.exports = UrlAnalytics;
