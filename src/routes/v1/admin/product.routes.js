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
const validate = require("../../../middleware/validation.middleware");
const { productSchema, mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");
const upload = require("../../../middleware/upload");

const adminAuth = require("../../../middleware/adminAuth.middleware");

router.get("/", validate(Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
}), "query"), getProducts);
router.get("/:id", validate(Joi.object({ id: mongoId }), "params"), getProductById);

router.post("/", adminAuth, upload.array("images", 5), validate(productSchema), createProduct);
router.put("/:id", adminAuth, upload.array("images", 5), validate(Joi.object({ id: mongoId }), "params"), validate(productSchema), updateProduct);
router.put("/:id/deactivate", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deactivateProduct);
router.delete("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deleteProduct);


module.exports = router;
