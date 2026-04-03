const express = require("express");
const router = express.Router();

const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deactivateTag,
  deleteTag,
} = require("../../../controllers/admin/tag.controller");
const validate = require("../../../middleware/validation.middleware");
const { tagSchema, mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");
const adminAuth = require("../../../middleware/adminAuth.middleware");

router.get("/", adminAuth, getTags);
router.get("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), getTagById);

router.post("/", adminAuth, validate(tagSchema), createTag);
router.put("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), validate(tagSchema), updateTag);
router.put("/:id/deactivate", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deactivateTag);
router.delete("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deleteTag);

module.exports = router;

