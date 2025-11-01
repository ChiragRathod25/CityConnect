import mongoose from "mongoose";

const adminCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Name must be less than 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
      maxlength: [200, "Description must be less than 200 characters"],
    },
    type: {
      type: String,
      required: [true, "Category type is required"],
      enum: {
        values: ["product", "service"],
        message: "Type must be either product or service",
      },
      default: "product",
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
      enum: {
        values: [
          "Box",
          "Zap",
          "Settings",
          "Star",
          "Heart",
          "Shield",
          "Globe",
          "Package",
          "Wrench",
          "Sparkles",
        ],
        message: "Invalid icon name",
      },
      default: "Box",
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
adminCategorySchema.index({ name: 1 });
adminCategorySchema.index({ type: 1 });
adminCategorySchema.index({ createdAt: -1 });

// Add compound index for search and filter operations
adminCategorySchema.index({ name: "text", description: "text" });

const AdminManageCategory = mongoose.model("Category", adminCategorySchema);

export default AdminManageCategory;
