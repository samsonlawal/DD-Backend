const express = require("express");
const { subscribe } = require("../../../controllers/newsletter.controller");
const router = express.Router();

// POST /api/newsletter/subscribe — no auth required
router.post("/subscribe", subscribe);

module.exports = router;
