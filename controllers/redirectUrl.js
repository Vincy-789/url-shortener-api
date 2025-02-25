const Url = require('../models/Url');
const analyticsMiddleware = require('../middlewares/analyticsMiddleware');
const UrlAnalytics = require('../models/UrlAnalytics');

const redirectUrl = async (req, res) => {
    try {
        const { alias } = req.params;
        console.log(alias);
        // Find the long URL from the database
        const urlEntry = await Url.findOne({ shortUrl: alias });
        if (!urlEntry) {
            return res.status(404).json({ error: 'Short URL not found' , data: urlEntry});
        }
        
        // Log analytics
        const { os, device } = analyticsMiddleware(req);
        const ip = req.ip || req.connection.remoteAddress || null;
        const userId = req.user ? req.user.id : null; // If user authentication is used
        console.log(ip, userId, os, device);

        // Store analytics data
        await UrlAnalytics.findOneAndUpdate(
            { alias },
            {
                $push: {
                    clicks: { timestamp: new Date(), ip, userId, os, device }
                }
            },
            { upsert: true, new: true }
        );
        
        // Redirect to the original URL
        let redirectUrl = urlEntry.longUrl;
        if (!/^https?:\/\//i.test(redirectUrl)) {
            redirectUrl = `https://${redirectUrl}`;
        }
        return res.status(302).redirect(redirectUrl);
    } catch (error) {
        console.error('Error in redirecting:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = redirectUrl;