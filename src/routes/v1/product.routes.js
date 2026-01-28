const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/v1/product.controller");

const auth = require("../../middleware/auth.middleware");
const adminOnly = require("../../middleware/admin.middleware");

const router = express.Router();

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN
router.post("/", auth, adminOnly, createProduct);
router.put("/:id", auth, adminOnly, updateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

module.exports = router;
