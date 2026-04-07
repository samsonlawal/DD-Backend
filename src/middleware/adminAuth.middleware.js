const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Reads the admin_token cookie — completely separate from the customer token
const adminAuth = async (req, res, next) => {
  const token = req.cookies.admin_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      req.user = await User.findById(decoded.id).select("-password");
  
      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
  
      // Extra safety: reject if somehow a non-admin token ends up here
      if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
  
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = adminAuth;
