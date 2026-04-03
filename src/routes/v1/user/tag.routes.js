const express = require("express");
const router = express.Router();
const validate = require("../../../middleware/validation.middleware");
const { mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");

const {
  getTags,
  getTagById,
} = require("../../../controllers/user/tag.controller");

router.get("/", getTags);
router.get("/:id", validate(Joi.object({ id: mongoId }), "params"), getTagById);

module.exports = router;
