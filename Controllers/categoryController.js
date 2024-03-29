const pool = require("../config/connectDb");
const asyncHandler = require("express-async-handler");
const {
  getCategoryById,
  getCategoryByName,
} = require("../lib/categoryFunctions");
const uuid = require("uuid").v4;

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const creator = req.user._id;
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  const duplicateCategory = await getCategoryByName(name);
  if (duplicateCategory) {
    return res.status(409).json({ message: "category Name already exists" });
  }
  const Category = {
    _id: uuid(),
    name,
    creator,
  };
  await pool.query("INSERT INTO Category SET ?", [Category]);
  return res.status(201).json(Category);
});
const getAllCategories = asyncHandler(async (req, res) => {
  const [row] = await pool.query("SELECT * FROM Category");
  return res.status(200).json(row);
});
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Id is required" });
  const category = await getCategoryById(id);
  if (category) {
    return res.status(200).json(category);
  } else {
    return res.status(404).json({ message: "Category not found" });
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user._id;
  if (!id || !name) {
    return res.status(400).json({ message: "id and name are required" });
  }
  const category = await getCategoryById(id);
  if (!category) {
    return res.status(404).json({ message: "Category Not found" });
  }
  if (userId !== category.creator) {
    return res
      .status(401)
      .json({ message: "You don't have the right to update this category" });
  }
  const duplicateCategory = await getCategoryByName(name);
  if (duplicateCategory && duplicateCategory._id !== category._id) {
    return res.status(409).json({ message: "category Name already exists" });
  }
  await pool.query("UPDATE Category SET name = ? WHERE _id=?", [name, id]);
  console.log();
  return res.status(201).json({ id, name, creator: category.creator });
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }
  const category = await getCategoryById(id);
  if (!category) {
    return res.status(404).json({ message: "Category Not found" });
  }
  if (userId !== category.creator) {
    return res
      .status(401)
      .json({ message: "You don't have the right to delete this category" });
  }
  await pool.query("DELETE FROM category WHERE _id=?", [id]);

  return res.sendStatus(204);
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
