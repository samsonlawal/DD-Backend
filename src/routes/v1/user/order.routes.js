const express = require("express");
const {
  createOrder,
  getOrderById,
  getUserOrders,
} = require("../../../controllers/user/order.controller");
const auth = require("../../../middleware/auth.middleware");
const router = express.Router();

router.post("/", auth, createOrder);
router.get("/:id", auth, getOrderById);
router.get("/user/:userId", auth, getUserOrders);

module.exports = router;
