import { ApiResponse as ApiResponce } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Business } from "../models/business.model.js";
import { BusinessLocation } from "../models/businessLocation.model.js";

const addLocation = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;

    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }
    
    const { street, lat, lng, address, city, state, postalCode, country } = req.body;
    
    // Validate required fields
    if (!lat || !lng || !address || !city || !state || !postalCode) {
        throw new ApiError(400, "Missing required fields");
    }

    const newLocation = await BusinessLocation.create({
        businessId,
        street,
        lat,
        lng,
        address,
        city,
        state,
        postalCode,
        country: country || "India",
    });

    if(!newLocation) {
        throw new ApiError(500, "Failed to add location");
    }
    
    res.status(201).json(new ApiResponce(
        201,
        "Location added successfully",
        newLocation
    ));

});

const getAllLocationsByBusinessId = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;
    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    const locations = await BusinessLocation.find({ businessId });

    if (!locations) {
        throw new ApiError(404, "No locations found for this business");
    }

    res.status(200).json(new ApiResponce(
        200,
        "Locations fetched successfully",
        locations
    ));
});

const getLocationById = asyncHandler(async (req, res, next) => {
    const { businessId, locationId } = req.params;

    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    const location = await BusinessLocation.findOne({ _id: locationId, businessId });

    if (!location) {
        throw new ApiError(404, "Location not found");
    }

    res.status(200).json(new ApiResponce(
        200,
        "Location fetched successfully",
        location
    ));
});

const updateLocationById = asyncHandler(async (req, res, next) => {
    const { businessId, locationId } = req.params;
    
    const { street, lat, lng, address, city, state, postalCode, country } = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }

    //update only which one is provided, other should be remain unchanged of original exisiting value of DB
    if(street!==undefined){
        business.street=street;
    }
    if(lat!==undefined){
        business.lat=lat;
    }
    if(lng!==undefined){
        business.lng=lng;
    }
    if(address!==undefined){
        business.address=address;
    }
    if(city!==undefined){
        business.city=city;
    }
    if(state!==undefined){
        business.state=state;
    }
    if(postalCode!==undefined){
        business.postalCode=postalCode;
    }
    if(country!==undefined){
        business.country=country;
    }
    
    await business.save();

    res.status(200).json(new ApiResponce(
        200,
        "Location updated successfully",
        business
    ));
});

const deleteLocationById = asyncHandler(async (req, res, next) => {
    const { businessId, locationId } = req.params;
    if (!businessId || !locationId) {
        throw new ApiError(400, "Business ID and Location ID are required");
    }
    
    const business = await Business.findById(businessId);
    if (!business) {
        throw new ApiError(404, "Business not found");
    }
    
    const location = await BusinessLocation.findOneAndDelete({ _id: locationId, businessId });

    if(!location) {
        throw new ApiError(404, "Location not found or already deleted");
    }

    res.status(200).json(new ApiResponce(
        200,
        "Location deleted successfully",
        location
    ));
});

const findNearbyBusinesses = asyncHandler(async (req, res, next) => {
    // Implement logic to search for nearby business locations based on provided coordinates (lat. and lang.) and radius
    const { lat, lng, radius } = req.query;
    
    if (!lat || !lng || !radius) {
        throw new ApiError(400, "Missing required query parameters");
    }

    // Implement logic to find nearby businesses using the provided coordinates and radius
    const nearbyLocations = await BusinessLocation.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [parseFloat(lng), parseFloat(lat)],
                    parseFloat(radius) / 3963.2 // radius in miles; use 6378.1 for kilometers
                ]
            }
        }
    });

    if(!nearbyLocations || nearbyLocations.length === 0) {
        throw new ApiError(404, "No nearby businesses found");
    }

    res.status(200).json(new ApiResponce(
        200,
        "Nearby businesses fetched successfully",
        nearbyLocations
    ));
});



export {
    addLocation,
    getAllLocationsByBusinessId,
    getLocationById,
    updateLocationById,
    deleteLocationById,
    findNearbyBusinesses
}