import { ApiResponse as ApiResponce } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Business } from "../models/business.model.js";
import { BusinessService } from "../models/businessService.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addService = asyncHandler(async (req, res, next) => {
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
  const service = await BusinessService.findById(serviceId);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  //upload images to cloudinary and get the urls
  let imageUrls = service.images || [];
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

  service.name = name || service.name;
  service.description = description || service.description;
  service.price = price || service.price;
  service.duration = duration || service.duration;
  service.category = category || service.category;
  service.isActive = isActive !== undefined ? isActive : service.isActive;
  service.tags = tags || service.tags;
  service.images = imageUrls;
  service.serviceType = serviceType || service.serviceType;
  service.availability = availability || service.availability;
  service.warrantyDays = warrantyDays || service.warrantyDays;
  service.cancellationPolicy = cancellationPolicy || service.cancellationPolicy;

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
