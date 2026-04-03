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
const validate = require("../../../middleware/validation.middleware");
const { updateProfileSchema, addressSchema, mongoId } = require("../../../validations/user.validation");
const Joi = require("joi");
const auth = require("../../../middleware/auth.middleware");
const upload = require("../../../middleware/upload.middleware");

const router = express.Router();

router.get("/:id", auth, validate(Joi.object({ id: mongoId }), "params"), getProfile);
router.put("/:id", auth, validate(Joi.object({ id: mongoId }), "params"), validate(updateProfileSchema), updateProfile);
router.get("/:id/addresses", auth, validate(Joi.object({ id: mongoId }), "params"), getAddresses);
router.post("/:id/addresses", auth, validate(Joi.object({ id: mongoId }), "params"), validate(addressSchema), addAddress);
router.delete("/:id/addresses/:addressId", auth, validate(Joi.object({ id: mongoId, addressId: mongoId }), "params"), deleteAddress);
router.put("/:id/addresses/:addressId", auth, validate(Joi.object({ id: mongoId, addressId: mongoId }), "params"), validate(addressSchema), updateAddress);
router.post("/:id/avatar", auth, validate(Joi.object({ id: mongoId }), "params"), upload.single("image"), uploadAvatar);

module.exports = router;
