const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/authMiddleware");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");

router.post("/", auth, createCategory);
router.get("/", auth, getAllCategories);
router.get("/:id", auth, getCategory);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
