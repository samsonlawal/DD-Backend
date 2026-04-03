const express = require("express");
const router = express.Router();
const validate = require("../../../middleware/validation.middleware");
const { mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");

const {
  getCategories,
  getCategoryById,
} = require("../../../controllers/user/category.controller");

router.get("/", getCategories);
router.get("/:id", validate(Joi.object({ id: mongoId }), "params"), getCategoryById);

module.exports = router;
