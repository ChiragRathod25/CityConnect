import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addLocation = asyncHandler(async (req, res, next) => {
});

const getAllLocationsByBusinessId = asyncHandler(async (req, res, next) => {
});

const getLocationById = asyncHandler(async (req, res, next) => {
});

const updateLocationById = asyncHandler(async (req, res, next) => {
});

const deleteLocationById = asyncHandler(async (req, res, next) => {
});

const findNearbyBusinesses = asyncHandler(async (req, res, next) => {
    // Implement logic to search for nearby business locations based on provided coordinates (lat. and lang.) and radius
});



export {
    addLocation,
    getAllLocationsByBusinessId,
    getLocationById,
    updateLocationById,
    deleteLocationById,
    findNearbyBusinesses
}