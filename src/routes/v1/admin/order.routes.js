const express = require("express");
const {
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  // deleteOrder,
} = require("../../../controllers/admin/order.controller");
const adminAuth = require("../../../middleware/adminAuth.middleware");
const router = express.Router();

router.get("/", adminAuth, getAllOrders);
router.get("/:id", adminAuth, getOrderById);
router.get("/user/:userId", adminAuth, getUserOrders);
router.patch("/:id/status", adminAuth, updateOrderStatus);
// router.delete("/:id", adminAuth, deleteOrder);


module.exports = router;
