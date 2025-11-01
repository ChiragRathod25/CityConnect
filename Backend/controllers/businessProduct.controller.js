import { ApiResponse as ApiResponce } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BusinessProduct } from "../models/businessProduct.model.js";
import { Business } from "../models/business.model.js";
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res, next) => {

    const { businessId } = req.params;

    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }
    
    const { name, description, price, stock, category } = req.body;

    if(!name || !price) {
        throw new ApiError(400, "Name and Price are required");
    }

    const newProduct =await BusinessProduct.create({
        businessId,
        name,
        description,
        price,
        stock,
        category
    });

    if(!newProduct) {
        throw new ApiError(500, "Failed to create product");
    }

    res.status(201).json(new ApiResponce(201, "Product created successfully", newProduct));
});

const getAllProducts = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;
    
    const business = await Business.findById(businessId);   
    if (!business) {
        throw new ApiError(404, "Business not found");
    }
    
    const products = await BusinessProduct.find({ businessId });

    res.status(200).json(new ApiResponce(200, "Products fetched successfully", products));
});

const getProductById = asyncHandler(async (req, res, next) => {
    const { businessId, productId } = req.params;

    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    const product = await BusinessProduct.findOne({ _id: productId, businessId });
    if (!product) {
        throw new ApiError(404, "Product not found for this business");
    }

    res.status(200).json(new ApiResponce(200, "Product fetched successfully", product));
});

const updateProductById = asyncHandler(async (req, res, next) => {
    const { businessId, productId } = req.params;

    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    const { name, description, price, stock, category, isActive } = req.body;

    if(!name && !description && !price && !stock && !category  && isActive===undefined) {
        throw new ApiError(400, "At least one field is required to update");
    }
    //check if product exists
    const product = await BusinessProduct.findOne({ _id: productId, businessId });
    if (!product) {
        throw new ApiError(404, "Product not found for this business");
    }
    
    //update product
    if(name) product.name = name;
    if(description) product.description = description;
    if(price) product.price = price;
    if(stock) product.stock = stock;
    if(category) product.category = category;
    if(isActive!==undefined) product.isActive = isActive;


    await product.save();
    
    res.status(200).json(new ApiResponce(200, "Product updated successfully", product));
});

const deleteProductById = asyncHandler(async (req, res, next) => {
    const { businessId, productId } = req.params;
    
    const business = await Business.findById(businessId);   
    if (!business) {
        throw new ApiError(404, "Business not found");
    }
    
    const product = await BusinessProduct.findOne({ _id: productId, businessId });
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

    res.status(200).json(new ApiResponce(200, "Images added successfully", product));
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
        if(process.env.NODE_ENV==="development") {
            throw new ApiError(500, "Failed to delete image from cloudinary");
        }
    }
    res.status(200).json(new ApiResponce(200, "Image removed successfully", product));
});


export {
    addProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    deleteAllProducts,
    addProductImages,
    removeProductImage
    
};
