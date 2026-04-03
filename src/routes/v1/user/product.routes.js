const express = require("express");
const {
  getProducts,
  getProductById,
} = require("../../../controllers/user/product.controller");
const validate = require("../../../middleware/validation.middleware");
const { mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");

// const auth = require("../../../middleware/auth.middleware");

const router = express.Router();

router.get("/", validate(Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category: mongoId,
  brand: mongoId,
  subCategory: Joi.string().trim(),
}), "query"), getProducts);
router.get("/:id", validate(Joi.object({ id: mongoId }), "params"), getProductById);

module.exports = router;
