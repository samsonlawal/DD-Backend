const express = require("express");
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
  uploadAvatar,
} = require("../../../controllers/user/profile.controller");

const auth = require("../../../middleware/auth.middleware");
const upload = require("../../../middleware/upload.middleware");

const router = express.Router();

router.get("/:id", auth, getProfile);
router.put("/:id", auth, updateProfile);
router.get("/:id/addresses", auth, getAddresses);
router.post("/:id/addresses", auth, addAddress);
router.delete("/:id/addresses/:addressId", auth, deleteAddress);
router.put("/:id/addresses/:addressId", auth, updateAddress);
router.post("/:id/avatar", auth, upload.single("image"), uploadAvatar);

module.exports = router;
