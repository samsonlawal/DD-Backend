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

router.get("/", getTags);
router.get("/:id", getTagById);

router.post("/", createTag);
router.put("/:id", updateTag);
router.put("/:id/deactivate", deactivateTag);
router.delete("/:id", deleteTag);

// router.delete("/:id", auth, adminOnly, deleteTag);

module.exports = router;
