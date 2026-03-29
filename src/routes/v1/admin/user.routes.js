const express = require("express");
const {
  // createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../../controllers/admin/user.controller");

const adminAuth = require("../../../middleware/adminAuth.middleware");

const router = express.Router();

// router.post("/", createUser);
router.get("/", adminAuth, getAllUsers);
router.get("/:id", adminAuth, getUserById);
router.put("/:id", adminAuth, updateUser);
router.delete("/:id", adminAuth, deleteUser);


module.exports = router;
