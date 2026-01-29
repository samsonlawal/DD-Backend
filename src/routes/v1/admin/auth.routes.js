const express = require("express");
const { login } = require("../../../controllers/auth/auth.controller");
const adminOnly = require("../../../middleware/admin.middleware");
const router = express.Router();

router.post("/login", adminOnly, login);

module.exports = router;
