import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AdminManageCategory from "../models/adminManageCategory.model.js";

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, type, icon } = req.body;

  // Validate required fields
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  // Check if category with same name already exists
  const existingCategory = await AdminManageCategory.findOne({ name });

  if (existingCategory) {
    throw new ApiError(409, "Category with this name already exists");
  }

  // Create category
  const category = await AdminManageCategory.create({
    name,
    description,
    type: type || "product",
    icon: icon || "Box",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

// Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await AdminManageCategory.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, "Categories fetched successfully")
    );
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, type, icon } = req.body;

  // Find category
  const category = await AdminManageCategory.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if updating name to an existing name
  if (name && name !== category.name) {

    const existingCategory = await AdminManageCategory.findOne({ name });

    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exists");
    }
  }

  // Update fields
  if (name) category.name = name;
  if (description) category.description = description;
  if (type) category.type = type;
  if (icon) category.icon = icon;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find and delete category
  const category = await AdminManageCategory.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export { createCategory, getAllCategories, updateCategory, deleteCategory };