const express = require("express");
const { subscribe } = require("../../../controllers/newsletter.controller");
const validate = require("../../../middleware/validation.middleware");
const { subscribeSchema } = require("../../../validations/newsletter.validation");
const router = express.Router();

// POST /api/newsletter/subscribe — no auth required
router.post("/subscribe", validate(subscribeSchema), subscribe);

module.exports = router;
