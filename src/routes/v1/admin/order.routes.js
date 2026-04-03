const express = require("express");
const {
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  // deleteOrder,
} = require("../../../controllers/admin/order.controller");
const validate = require("../../../middleware/validation.middleware");
const { updateOrderStatusSchema, mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");
const adminAuth = require("../../../middleware/adminAuth.middleware");
const router = express.Router();

router.get("/", adminAuth, getAllOrders);
router.get("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), getOrderById);
router.get("/user/:userId", adminAuth, validate(Joi.object({ userId: mongoId }), "params"), getUserOrders);
router.patch("/:id/status", adminAuth, validate(Joi.object({ id: mongoId }), "params"), validate(updateOrderStatusSchema), updateOrderStatus);
// router.delete("/:id", adminAuth, deleteOrder);


module.exports = router;
