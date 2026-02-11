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

const auth = require("../../../middleware/auth.middleware");
const adminOnly = require("../../../middleware/admin.middleware");

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.put("/:id/deactivate", deactivateCategory);
router.delete("/:id", deleteCategory);

// router.post("/", auth, adminOnly, createCategory);
// router.put("/:id", auth, adminOnly, updateCategory);
// router.put("/:id/deactivate", auth, adminOnly, deactivateCategory);
// router.delete("/:id", auth, adminOnly, deleteCategory);

module.exports = router;
