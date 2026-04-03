const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deactivateCategory,
  deleteCategory,
} = require("../../../controllers/admin/category.controller");
const validate = require("../../../middleware/validation.middleware");
const { categorySchema, mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");
const adminAuth = require("../../../middleware/adminAuth.middleware");

router.get("/", adminAuth, getCategories);
router.get("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), getCategoryById);

router.post("/", adminAuth, validate(categorySchema), createCategory);
router.put("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), validate(categorySchema), updateCategory);
router.put("/:id/deactivate", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deactivateCategory);
router.delete("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deleteCategory);

module.exports = router;

