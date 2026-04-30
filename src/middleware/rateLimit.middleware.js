const rateLimit = require("express-rate-limit");

const publicRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    skip: (req) => process.env.NODE_ENV === 'development',
    message: { success: false, message: "Too many requests from your IP, please try again after 15 minutes" },
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Too many requests from this IP, please try again after 15 minutes" });
    }
})

const sensitiveRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skip: (req) => process.env.NODE_ENV === 'development',
    message: { success: false, message: "Too many requests from your IP, please try again after 15 minutes" },
    handler: (req, res) => {
        res.status(429).json({ success: false, message: "Too many requests from this IP, please try again after 15 minutes" });
    }
})

module.exports = {publicRateLimit, sensitiveRateLimit}