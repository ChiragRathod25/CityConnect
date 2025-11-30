import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { BusinessProduct } from "../models/businessProduct.model.js"
import { BusinessService } from "../models/businessService.model.js";
import { Business } from "../models/business.model.js";


const getAdminDashboardStats = asyncHandler(async (req, res) => {
  //get datafrom various models from mongodb through API call

  const stats=await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: "count" }],
        totalBusinessmen: [
          { $match: { role: "businessman" } },
            { $count: "count" },
        ],
        emailVerified: [
          { $match: { isEmailVerified: true } },
          { $count: "count" },
        ],
        phoneVerified: [
          { $match: { isPhoneVerified: true } },
            { $count: "count" },
        ],
      },
    },
  ]);
    const totalProducts=await BusinessProduct.countDocuments();
    const totalServices=await BusinessService.countDocuments();

    const responseData={
        totalProducts,
        totalServices,
        totalUsers: stats[0].totalUsers[0] ? stats[0].totalUsers[0].count : 0,
        totalBusinessmen: stats[0].totalBusinessmen[0] ? stats[0].totalBusinessmen[0].count : 0,
        emailVerified: stats[0].emailVerified[0] ? stats[0].emailVerified[0].count : 0,
        phoneVerified: stats[0].phoneVerified[0] ? stats[0].phoneVerified[0].count : 0,
    }

    console.log("Admin Dashboard Stats:", responseData);
    res
    .status(200)
    .json(
      new ApiResponse(200, "Admin dashboard stats retrieved successfully", responseData)
    );
});

const getAllUsers= asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -__v").sort({ createdAt: -1 });
    res
    .status(200)
    .json(
      new ApiResponse(200, "All users retrieved successfully", users)
    );
});

const allBusinesses= asyncHandler(async (req, res) => {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res
    .status(200)
    .json(
      new ApiResponse(200, "All businesses retrieved successfully", businesses)
    );
});


export { getAdminDashboardStats, getAllUsers, allBusinesses };