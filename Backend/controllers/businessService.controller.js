import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Business } from "../models/business.model.js";
import { BusinessService } from "../models/businessService.model.js";

const addService = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;
    const { name, description, price, duration, category, isActive } = req.body;
    
    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }
    
    const service = await BusinessService.create({
        businessId,
        name,
        description,
        price,
        duration,
        category,
        isActive
    });
    res.status(201).json(new ApiResponce(201, "Service added successfully", service));
});

const getAllServices = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;
    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }
    const services = await BusinessService.find({ businessId });
    res.status(200).json(new ApiResponce(200, "Services fetched successfully", services));
});
const getServiceById= asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const service = await BusinessService.findById(serviceId);
    if (!service) {
        throw new ApiError(404, "Service not found");
    }
    res.status(200).json(new ApiResponce(200, "Service fetched successfully", service));
});

const updateServiceById = asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const { name, description, price, duration, category, isActive } = req.body;
    
    const service = await BusinessService.findById(serviceId);
    if (!service) {
        throw new ApiError(404, "Service not found");
    }
    
    if(name !== undefined) service.name = name;
    if(description !== undefined) service.description = description;
    if(price !== undefined) service.price = price;
    if(duration !== undefined) service.duration = duration;
    if(category !== undefined) service.category = category;
    if(isActive !== undefined) service.isActive = isActive;
    
    await service.save();
    res.status(200).json(new ApiResponce(200, "Service updated successfully", service));

});
const deleteServiceById = asyncHandler(async (req, res, next) => {
    const { serviceId } = req.params;
    const service = await BusinessService.findById(serviceId);
    if (!service) {
        throw new ApiError(404, "Service not found");
    }
    await service.remove();
    res.status(200).json(new ApiResponce(200, "Service deleted successfully", null));
});

export {
    addService,
    getAllServices,
    getServiceById,
    updateServiceById,
    deleteServiceById
};