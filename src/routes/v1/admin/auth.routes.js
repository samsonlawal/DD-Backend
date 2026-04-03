const express = require("express");
const { adminLogin, logout } = require("../../../controllers/auth/auth.controller");
const validate = require("../../../middleware/validation.middleware");
const { loginSchema } = require("../../../validations/auth.validation");
const adminAuth = require("../../../middleware/adminAuth.middleware");
const router = express.Router();

router.post("/login", validate(loginSchema), adminLogin);
// Clears the admin_token cookie — logout uses same function but admin UI should call this route
router.post("/logout", (req, res) => {
  res.clearCookie("admin_token", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Logged out" });
});

module.exports = router;

