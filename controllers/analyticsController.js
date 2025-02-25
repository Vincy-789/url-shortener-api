const mongoose = require('mongoose');
const UrlAnalytics = require("../models/UrlAnalytics");
const { isValidObjectId } = require("mongoose");


const analyticsController = async (req, res) => { 
    try {
        const { alias } = req.params;
        
        // Fetch URL analytics from database
        const analytics = await UrlAnalytics.findOne({ alias });
        if (!analytics) {
            return res.status(404).json({ message: "Analytics data not found for this alias." });
        }

        // Calculate total clicks
        const totalClicks = analytics.clicks.length;

        // Calculate unique users
        const uniqueUsers = new Set(analytics.clicks.map(click => click.userId || click.ip)).size;

        // Get clicks by date (last 7 days)
        const recentClicks = analytics.clicks.filter(click => {
            const clickDate = new Date(click.timestamp);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return clickDate >= sevenDaysAgo;
        });
        
        const clicksByDate = recentClicks.reduce((acc, click) => {
            const date = click.timestamp.toISOString().split("T")[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        
        // Format clicksByDate
        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({ date, count }));

        // Get clicks by OS type
        const osType = analytics.clicks.reduce((acc, click) => {
            const os = click.os || "Unknown";
            if (!acc[os]) acc[os] = { osName: os, uniqueClicks: 0, uniqueUsers: new Set() };
            acc[os].uniqueClicks++;
            acc[os].uniqueUsers.add(click.userId || click.ip);
            return acc;
        }, {});

        // Format osType array
        const osTypeArray = Object.values(osType).map(os => ({
            osName: os.osName,
            uniqueClicks: os.uniqueClicks,
            uniqueUsers: os.uniqueUsers.size
        }));

        // Get clicks by device type
        const deviceType = analytics.clicks.reduce((acc, click) => {
            const device = click.device || "Unknown";
            if (!acc[device]) acc[device] = { deviceName: device, uniqueClicks: 0, uniqueUsers: new Set() };
            acc[device].uniqueClicks++;
            acc[device].uniqueUsers.add(click.userId || click.ip);
            return acc;
        }, {});

        // Format deviceType array
        const deviceTypeArray = Object.values(deviceType).map(device => ({
            deviceName: device.deviceName,
            uniqueClicks: device.uniqueClicks,
            uniqueUsers: device.uniqueUsers.size
        }));

        return res.json({
            totalClicks,
            uniqueUsers,
            clicksByDate: clicksByDateArray,
            osType: osTypeArray,
            deviceType: deviceTypeArray
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = analyticsController;