import { ApiResponse as ApiResponce } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BusinessProduct } from "../models/businessProduct.model.js";
import { Business } from "../models/business.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addProduct = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const {
    name,
    description,
    price,
    stock,
    category,
    brand,
    sku,
    weight,
    dimensions,
    tags,
    warranty,
    deliveryCharge,
    returnPolicyDays,
  } = req.body;

  if (!name || !price) {
    throw new ApiError(400, "Name and Price are required");
  }

  //upload image to cloudinary, it can be single or multiple based on imageMethod
  let images = [];
  // if one
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult && uploadResult.secure_url) {
      images.push(uploadResult.secure_url);
    }
  } else {
    // if multiple
    const files = req.files;
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await uploadOnCloudinary(file.path);
        if (uploadResult && uploadResult.secure_url) {
          images.push(uploadResult.secure_url);
        }
      }
    }
  }

  const newProduct = await BusinessProduct.create({
    businessId,
    name,
    description,
    price,
    stock,
    category,
    brand,
    sku,
    weight,
    dimensions,
    tags,
    images,
    warranty,
    deliveryCharge,
    returnPolicyDays,
  });

  if (!newProduct) {
    throw new ApiError(500, "Failed to create product");
  }

  res
    .status(201)
    .json(new ApiResponce(201, "Product created successfully", newProduct));
});

const getAllProductsByBusinessId = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  console.log("Fetching products for business:", businessId);
  const products = await BusinessProduct.find({
    businessId: new mongoose.Types.ObjectId(businessId),
  })

  console.log("Fetched products:", products);
  res
    .status(200)
    .json(new ApiResponce(200, "Products fetched successfully", products));
});

const getProductById = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  console.log("Fetching product:", productId);

  const product = await BusinessProduct.findOne({ _id: productId });
  if (!product) {
    throw new ApiError(404, "Product not found for this business");
  }

  res
    .status(200)
    .json(new ApiResponce(200, "Product fetched successfully", product));
});

const updateProductById = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await BusinessProduct.findOne({ _id: productId });
  if (!product) {
    throw new ApiError(404, "Product not found for this business");
  }

  const {
    name,
    description,
    price,
    stock,
    category,
    brand,
    sku,
    weight,
    dimensions,
    tags,
    warranty,
    deliveryCharge,
    returnPolicyDays,
  } = req.body;

  // Update fields if provided
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (brand) product.brand = brand;
  if (sku) product.sku = sku;
  if (weight) product.weight = weight;
  if (dimensions) product.dimensions = dimensions;
  if (tags) product.tags = tags;
  if (warranty) product.warranty = warranty;
  if (deliveryCharge) product.deliveryCharge = deliveryCharge;
  if (returnPolicyDays) product.returnPolicyDays = returnPolicyDays;

  await product.save();

  //handle images separately
  // if only one image
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult && uploadResult.secure_url) {
      product.images.push(uploadResult.secure_url);
    }
  } else {
    // if multiple images
    const files = req.files;
    if (files && files.length > 0) {
      for (const file of files) {
        const uploadResult = await uploadOnCloudinary(file.path);
        if (uploadResult && uploadResult.secure_url) {
          product.images.push(uploadResult.secure_url);
        }
      }
    }
  }

  await product.save();

  res
    .status(200)
    .json(new ApiResponce(200, "Product updated successfully", product));
});

const deleteProductById = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await BusinessProduct.findOne({ _id: productId });
  if (!product) {
    throw new ApiError(404, "Product not found for this business");
  }

  await product.remove();

  res.status(200).json(new ApiResponce(200, "Product deleted successfully"));
});

const deleteAllProducts = asyncHandler(async (businessId) => {
  await BusinessProduct.deleteMany({ businessId });
});

const addProductImages = asyncHandler(async (req, res, next) => {
  const { businessId, productId } = req.params;

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const product = await BusinessProduct.findOne({ _id: productId, businessId });

  if (!product) {
    throw new ApiError(404, "Product not found for this business");
  }

  const files = req.files;
  if (!files || files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  try {
    const uploadedImages = [];
    for (const file of files) {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult && uploadResult.secure_url) {
        uploadedImages.push(uploadResult.secure_url);
      }
    }
    if (uploadedImages.length === 0) {
      throw new ApiError(500, "Failed to upload images");
    }
    product.images = product.images.concat(uploadedImages);
    await product.save();
  } catch (error) {
    throw new ApiError(500, "Error while uploading images");
  }

  res
    .status(200)
    .json(new ApiResponce(200, "Images added successfully", product));
});

const removeProductImage = asyncHandler(async (req, res, next) => {
  const { businessId, productId } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    throw new ApiError(400, "Image URL is required");
  }

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const product = await BusinessProduct.findOne({ _id: productId, businessId });
  if (!product) {
    throw new ApiError(404, "Product not found for this business");
  }

  const imageIndex = product.images.indexOf(imageUrl);
  if (imageIndex === -1) {
    throw new ApiError(404, "Image not found in product");
  }

  product.images.splice(imageIndex, 1);
  await product.save();

  // delete from cloudinary
  try {
    await deleteFromCloudinary(imageUrl);
  } catch (error) {
    console.error("Failed to delete image from cloudinary:", error);
    if (process.env.NODE_ENV === "development") {
      throw new ApiError(500, "Failed to delete image from cloudinary");
    }
  }
  res
    .status(200)
    .json(new ApiResponce(200, "Image removed successfully", product));
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await BusinessProduct.find({});
  res
    .status(200)
    .json(new ApiResponce(200, "Products fetched successfully", products));
});

export {
  addProduct,
  getAllProductsByBusinessId,
  getProductById,
  updateProductById,
  deleteProductById,
  deleteAllProducts,
  addProductImages,
  removeProductImage,
  getAllProducts,
};
