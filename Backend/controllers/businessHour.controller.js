import { ApiResponse as ApiResponce } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {BusinessHour} from "../models/businessHour.model.js";
import { Business } from "../models/business.model.js";

const addBusinessHours= asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;

    if (!businessId) {
        throw new ApiError(400, "Business ID is required");
    }
    const business = await Business.findById(businessId);
    if(!business) {
        throw new ApiError(404, "Business not found");
    }

    const { dayOfWeek, openTime, closeTime, isClosed } = req.body;
    
    if (!dayOfWeek ) {
        throw new ApiError(400, "dayOfWeek, openTime and closeTime are required");
    }

    const newBusinessHour = await BusinessHour.create({
        businessId,
        dayOfWeek,
        openTime,
        closeTime,
        isClosed: isClosed || false,
    });

    res.status(201).json(new ApiResponce(
        201,
        "Business hours added successfully",
        newBusinessHour 
    ));
});

const getBusinessHours = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;
    if(!businessId){
        throw new ApiError(400,"Business ID is required");
    }
    
    const business = await Business.findById(businessId);
    if(!business) {
        throw new ApiError(404, "Business not found");
    }

    const businessHours = await BusinessHour.find({ businessId });

    if(!businessHours.length){
        throw new ApiError(404,"No business hours found for this business");
    }
    
    console.log("Business Hours:", businessHours);
    res.status(200).json(new ApiResponce(
        200,
        "Business hours fetched successfully",
        businessHours
    ));
});

const updateBusinessHours = asyncHandler(async (req, res, next) => {
    const { businessId, hourId } = req.params;
    if(!businessId || !hourId){
        throw new ApiError(400,"Business ID and Hour ID are required");
    }

    const business = await Business.findById(businessId);
    if(!business) {
        throw new ApiError(404, "Business not found");
    }

    const { dayOfWeek, openTime, closeTime, isClosed } = req.body;
    
    const businessHour = await BusinessHour.findOne({ _id: hourId, businessId });
    if (!businessHour) {
        throw new ApiError(404, "Business hour not found");
    }
    
    if (dayOfWeek) businessHour.dayOfWeek = dayOfWeek;

    if (openTime) businessHour.openTime = openTime;
    if (closeTime) businessHour.closeTime = closeTime;
    if (isClosed !== undefined) businessHour.isClosed = isClosed;

    await businessHour.save();
    
    res.status(200).json(new ApiResponce(
        200,
        "Business hours updated successfully",
        businessHour
    ));
});

const deleteBusinessHours = asyncHandler(async (req, res, next) => {
    const { businessId, hourId } = req.params;
    if(!businessId || !hourId){
        throw new ApiError(400,"Business ID and Hour ID are required");
    }

    const business = await Business.findById(businessId);
    if(!business) {
        throw new ApiError(404, "Business not found");
    }
    
    const businessHour = await BusinessHour.findOneAndDelete({ _id: hourId, businessId });
    if (!businessHour) {
        throw new ApiError(404, "Business hour not found");
    }
    
    res.status(200).json(new ApiResponce(
        200,
        "Business hours deleted successfully",
        businessHour
    ));
});

export {
    addBusinessHours,
    getBusinessHours,
    updateBusinessHours,
    deleteBusinessHours
};
