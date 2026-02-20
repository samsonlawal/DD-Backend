const express = require("express");
const {
  getProducts,
  getProductById,
} = require("../../../controllers/user/product.controller");

// const auth = require("../../../middleware/auth.middleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
