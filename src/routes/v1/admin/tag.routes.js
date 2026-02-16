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

const auth = require("../../../middleware/auth.middleware");
const adminOnly = require("../../../middleware/admin.middleware");

router.get("/", auth, adminOnly, getTags);
router.get("/:id", auth, adminOnly, getTagById);

router.post("/", auth, adminOnly, createTag);
router.put("/:id", auth, adminOnly, updateTag);
router.put("/:id/deactivate", auth, adminOnly, deactivateTag);
router.delete("/:id", auth, adminOnly, deleteTag);

// router.delete("/:id", auth, adminOnly, deleteTag);

module.exports = router;
