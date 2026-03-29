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

const adminAuth = require("../../../middleware/adminAuth.middleware");

router.get("/", adminAuth, getTags);
router.get("/:id", adminAuth, getTagById);

router.post("/", adminAuth, createTag);
router.put("/:id", adminAuth, updateTag);
router.put("/:id/deactivate", adminAuth, deactivateTag);
router.delete("/:id", adminAuth, deleteTag);

module.exports = router;

