const express = require("express");
const router = express.Router();
const validate = require("../../../middleware/validation.middleware");
const { mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");

const {
  getBrands,
  getBrandById,
} = require("../../../controllers/user/brand.controller");

router.get("/", getBrands);
router.get("/:id", validate(Joi.object({ id: mongoId }), "params"), getBrandById);

module.exports = router;
