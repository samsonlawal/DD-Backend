const express = require("express");
const {
  getProfile,
  updateProfile,
  getAddresses,
} = require("../../../controllers/user/profile.controller");

const auth = require("../../../middleware/auth.middleware");

const router = express.Router();

router.get("/:id", auth, getProfile);
router.put("/:id", auth, updateProfile);
router.get("/:id/addresses", auth, getAddresses);

module.exports = router;
