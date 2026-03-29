const express = require("express");
const { sendContactMessage } = require("../../controllers/contact.controller");
const router = express.Router();

// POST /api/contact — no auth required
router.post("/", sendContactMessage);

module.exports = router;
