const express = require("express");
const {
  getProfile,
  updateProfile,
} = require("../../../controllers/user/profile.controller");

const auth = require("../../../middleware/auth.middleware");

const router = express.Router();

router.get("/:id", auth, getProfile);
router.put("/:id", auth, updateProfile);

module.exports = router;
