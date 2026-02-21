const express = require("express");
const router = express.Router();

const {
  getBrands,
  getBrandById,
} = require("../../../controllers/user/brand.controller");

router.get("/", getBrands);
router.get("/:id", getBrandById);

module.exports = router;
