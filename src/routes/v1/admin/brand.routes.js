const express = require("express");
const router = express.Router();

const {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deactivateBrand,
  deleteBrand,
} = require("../../../controllers/admin/brand.controller");
const validate = require("../../../middleware/validation.middleware");
const { brandSchema, mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");
const adminAuth = require("../../../middleware/adminAuth.middleware");

router.get("/", adminAuth, getBrands);
router.get("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), getBrandById);

router.post("/", adminAuth, validate(brandSchema), createBrand);
router.put("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), validate(brandSchema), updateBrand);
router.put("/:id/deactivate", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deactivateBrand);
router.delete("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deleteBrand);

module.exports = router;

