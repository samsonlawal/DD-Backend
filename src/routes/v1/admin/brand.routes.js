const express = require("express");
const router = express.Router();

const {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deactivateBrand,
  deleteBrand,
} = require("../../../controllers/admin/brand.controller");

const adminAuth = require("../../../middleware/adminAuth.middleware");

router.get("/", adminAuth, getBrands);
router.get("/:id", adminAuth, getBrandById);

router.post("/", adminAuth, createBrand);
router.put("/:id", adminAuth, updateBrand);
router.put("/:id/deactivate", adminAuth, deactivateBrand);
router.delete("/:id", adminAuth, deleteBrand);

module.exports = router;

