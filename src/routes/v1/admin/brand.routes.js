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

const auth = require("../../../middleware/auth.middleware");
const adminOnly = require("../../../middleware/admin.middleware");

router.get("/", auth, adminOnly, getBrands);
router.get("/:id", auth, adminOnly, getBrandById);

router.post("/", auth, adminOnly, createBrand);
router.put("/:id", auth, adminOnly, updateBrand);
router.put("/:id/deactivate", auth, adminOnly, deactivateBrand);
router.delete("/:id", auth, adminOnly, deleteBrand);

module.exports = router;
