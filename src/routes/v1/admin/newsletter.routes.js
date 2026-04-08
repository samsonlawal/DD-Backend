const express = require("express");
const { getAllSubscribers, getSubscriberCount } = require("../../../controllers/admin/newsletter.controller");
const adminAuth = require("../../../middleware/adminAuth.middleware");
const router = express.Router();

// GET /api/admin/newsletter/stats — returns only the total count
router.get("/stats", adminAuth, getSubscriberCount);

// GET /api/admin/newsletter — requires admin authentication
router.get("/", adminAuth, getAllSubscribers);

module.exports = router;
