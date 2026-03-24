const express = require("express");
const { handleStripeWebhook } = require("../controllers/webhook.controller");
const router = express.Router();

// Stripe needs the raw body to verify the signature
router.post("/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;
