const express = require("express");
const { sendContactMessage } = require("../../controllers/contact.controller");
const validate = require("../../middleware/validation.middleware");
const { contactSchema } = require("../../validations/contact.validation");
const router = express.Router();

// POST /api/contact — no auth required
router.post("/", validate(contactSchema), sendContactMessage);

module.exports = router;
