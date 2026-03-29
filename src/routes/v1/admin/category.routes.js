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

const adminAuth = require("../../../middleware/adminAuth.middleware");

router.get("/", adminAuth, getCategories);
router.get("/:id", adminAuth, getCategoryById);

router.post("/", adminAuth, createCategory);
router.put("/:id", adminAuth, updateCategory);
router.put("/:id/deactivate", adminAuth, deactivateCategory);
router.delete("/:id", adminAuth, deleteCategory);

module.exports = router;

