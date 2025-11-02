import { ApiResponse as ApiResponce } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Business } from "../models/business.model.js";
import { BusinessService } from "../models/businessService.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addService = asyncHandler(async (req, res, next) => {
  // {
  // businessId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Business",
  //   required: true,
  // },
  // name: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minlength: 3,
  //   maxlength: 100,
  // },
  // description: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minlength: 20,
  // },
  // category: {
  //   type: String,
  //   trim: true,
  // },
  // price: {
  //   type: Number,
  //   required: true,
  //   min: 0,
  // },
  // duration: {
  //   type: String, // e.g. "30 mins", "2 hours"
  //   required: true,
  //   trim: true,
  // },
  // serviceType: {
  //   type: String,
  //   enum: ["onsite", "offsite", "remote"],
  //   default: "onsite",
  // },
  // availability: {
  //   type: String, // e.g. "Mon–Fri 9AM–6PM"
  //   trim: true,
  // },
  // tags: {
  //   type: [String],
  //   default: [],
  // },
  // images: {
  //   type: [String],
  //   default: [],
  // },

  // warrantyDays: {
  //   type: Number,
  //   enum: [0, 7, 15, 30],
  //   default: 0,
  // },
  // cancellationPolicy: {
  //   type: String,
  //   enum: ["no-cancel", "24hr", "48hr", "flexible"],
  //   default: "flexible",
  // },
  // isActive: {
  //   type: Boolean,
  //   default: true,
  // },

  const { businessId } = req.params;
  const {
    name,
    description,
    price,
    duration,
    category,
    isActive,
    tags,

    serviceType,
    availability,
    warrantyDays,
    cancellationPolicy,
  } = req.body;

  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  //upload images to cloudinary and get the urls
  let imageUrls = [];
  //if one file
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult && uploadResult.secure_url) {
      imageUrls.push(uploadResult.secure_url);
    }
  }
  //if multiple files
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult && uploadResult.secure_url) {
        imageUrls.push(uploadResult.secure_url);
      }
    }
  }

  const service = await BusinessService.create({
    businessId,
    name,
    description,
    price,
    duration,
    category,
    isActive,
    tags,
    images: imageUrls,
    serviceType,
    availability,
    warrantyDays,
    cancellationPolicy,
  });
  if(!service){
    throw new ApiError(400, "Service not created");
  }
  res
    .status(201)
    .json(new ApiResponce(201, "Service added successfully", service));
});

const getAllServices = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;
  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }
  const services = await BusinessService.find({ businessId });
  res
    .status(200)
    .json(new ApiResponce(200, "Services fetched successfully", services));
});
const getServiceById = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;
  const service = await BusinessService.findById(serviceId);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  res
    .status(200)
    .json(new ApiResponce(200, "Service fetched successfully", service));
});

const updateServiceById = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;
  const { name, description, price, duration, category, isActive } = req.body;

  const service = await BusinessService.findById(serviceId);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  if (name !== undefined) service.name = name;
  if (description !== undefined) service.description = description;
  if (price !== undefined) service.price = price;
  if (duration !== undefined) service.duration = duration;
  if (category !== undefined) service.category = category;
  if (isActive !== undefined) service.isActive = isActive;

  await service.save();
  res
    .status(200)
    .json(new ApiResponce(200, "Service updated successfully", service));
});
const deleteServiceById = asyncHandler(async (req, res, next) => {
  const { serviceId } = req.params;
  const service = await BusinessService.findById(serviceId);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  await service.remove();
  res
    .status(200)
    .json(new ApiResponce(200, "Service deleted successfully", null));
});

export {
  addService,
  getAllServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
};
