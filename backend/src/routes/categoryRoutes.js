const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// GET    /api/categories       → list categories
router.get("/", getAllCategories);

// POST   /api/categories       → create new category
router.post("/", createCategory);

// DELETE /api/categories/:id   → delete category
router.delete("/:id", deleteCategory);

module.exports = router;
