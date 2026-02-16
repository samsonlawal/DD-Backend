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

router.get("/", auth, adminOnly, getCategories);
router.get("/:id", auth, adminOnly, getCategoryById);

router.post("/", auth, adminOnly, createCategory);
router.put("/:id", auth, adminOnly, updateCategory);
router.put("/:id/deactivate", auth, adminOnly, deactivateCategory);
router.delete("/:id", auth, adminOnly, deleteCategory);

// router.post("/", auth, adminOnly, createCategory);
// router.put("/:id", auth, adminOnly, updateCategory);
// router.put("/:id/deactivate", auth, adminOnly, deactivateCategory);
// router.delete("/:id", auth, adminOnly, deleteCategory);

module.exports = router;
