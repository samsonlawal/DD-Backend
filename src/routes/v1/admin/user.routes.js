const express = require("express");
const {
  // createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../../../controllers/user.controller");

const auth = require("../../../middleware/auth.middleware");
const adminOnly = require("../../../middleware/admin.middleware");

const router = express.Router();

// router.post("/", createUser);
router.get("/", auth, adminOnly, getAllUsers);
router.get("/:id", auth, adminOnly, getUserById);
router.put("/:id", auth, adminOnly, updateUser);
router.delete("/:id", auth, adminOnly, deleteUser);

module.exports = router;
