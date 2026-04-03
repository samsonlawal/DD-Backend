const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  verifyCode,
  resetPassword,
} = require("../../../controllers/auth/auth.controller");
const validate = require("../../../middleware/validation.middleware");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyCodeSchema,
  resetPasswordSchema,
} = require("../../../validations/auth.validation");
const router = express.Router();

router.post("/register", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-code", validate(verifyCodeSchema), verifyCode);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;
