const express = require("express");
const {
  // createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../../controllers/admin/user.controller");
const validate = require("../../../middleware/validation.middleware");
const { adminUpdateUserSchema, mongoId } = require("../../../validations/admin.validation");
const Joi = require("joi");
const adminAuth = require("../../../middleware/adminAuth.middleware");

const router = express.Router();

// router.post("/", createUser);
router.get("/", adminAuth, getAllUsers);
router.get("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), getUserById);
router.put("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), validate(adminUpdateUserSchema), updateUser);
router.delete("/:id", adminAuth, validate(Joi.object({ id: mongoId }), "params"), deleteUser);


module.exports = router;
