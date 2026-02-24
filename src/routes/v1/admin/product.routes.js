const express = require("express");
const router = express.Router();

// TEMP MIGRATION ROUTE
router.get("/migrate-categories", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const collection = mongoose.connection.db.collection("categories");
    const result = await collection.updateMany(
      {}, 
      { 
        $set: { status: "active" },
        $unset: { isActive: "" } 
      }
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct,
  deleteProduct,
} = require("../../../controllers/admin/product.controller");

const upload = require("../../../middleware/upload");

const auth = require("../../../middleware/auth.middleware");
const adminOnly = require("../../../middleware/admin.middleware");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", auth, adminOnly, upload.array("images", 5), createProduct);
router.put("/:id", auth, adminOnly, upload.array("images", 5), updateProduct);
router.put("/:id/deactivate", auth, adminOnly, deactivateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

module.exports = router;
