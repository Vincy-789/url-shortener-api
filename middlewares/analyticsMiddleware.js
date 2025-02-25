const analyticsMiddleware = (req) => {
    const userAgent = req.headers["user-agent"] || "Unknown";
    let os = "Unknown";
    let device = "Unknown";

    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
    else if (/linux/i.test(userAgent)) os = "Linux";
    else if (/android/i.test(userAgent)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";

    if (/mobile/i.test(userAgent)) device = "Mobile";
    else device = "Desktop";

    return { os, device };
};

module.exports = analyticsMiddleware;