const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  verifyCode,
  resetPassword,
} = require("../../../controllers/auth/auth.controller");
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

module.exports = router;
