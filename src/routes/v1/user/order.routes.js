const express = require("express");
const {
  createOrder,
  getOrderById,
  getUserOrders,
} = require("../../../controllers/user/order.controller");
const validate = require("../../../middleware/validation.middleware");
const { checkoutSchema, mongoId, orderIdSchema } = require("../../../validations/user.validation");
const Joi = require("joi");
const auth = require("../../../middleware/auth.middleware");
const router = express.Router();

router.post("/", auth, validate(checkoutSchema), createOrder);
router.get("/:id", auth, validate(Joi.object({ id: orderIdSchema }), "params"), getOrderById);
router.get("/user/:userId", auth, validate(Joi.object({ userId: mongoId }), "params"), getUserOrders);

module.exports = router;
