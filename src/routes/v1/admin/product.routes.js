const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  deleteProduct,
} = require("../../controllers/admin/product.controller");

const auth = require("../../../middleware/auth.middleware");
const adminOnly = require("../../../middleware/admin.middleware");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", auth, adminOnly, createProduct);
router.put("/:id", auth, adminOnly, updateProduct);
router.put("/:id/deactivate", auth, adminOnly, deactivateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

module.exports = router;
