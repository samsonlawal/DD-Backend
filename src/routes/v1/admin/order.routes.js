const express = require("express");
const {
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  // deleteOrder,
} = require("../../controllers/admin/order.controller");
const { auth } = require("../../../middleware/auth.middleware");
const { adminOnly } = require("../../../middleware/admin.middleware");
const router = express.Router();

router.get("/", auth, adminOnly, getAllOrders);
router.get("/:id", auth, adminOnly, getOrderById);
router.get("/user/:userId", auth, adminOnly, getUserOrders);
router.patch("/:id/status", auth, adminOnly, updateOrderStatus);
// router.delete("/:id", auth, deleteOrder);

module.exports = router;
