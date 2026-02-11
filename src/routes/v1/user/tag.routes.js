const express = require("express");
const router = express.Router();

const {
  getTags,
  getTagById,
} = require("../../../controllers/user/tag.controller");

router.get("/", getTags);
router.get("/:id", getTagById);

module.exports = router;
