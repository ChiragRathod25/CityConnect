import Order from "../models/orderHistory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BusinessProduct } from "../models/businessProduct.model.js";

const getRecommendations = asyncHandler(async (req, res) => {
  const userId  = req.user._id;

  if(!userId){
    throw new ApiError(400, "User ID is required for recommendations");
  }
  // user order history
  const orders = await Order.find({ userId }).lean();
  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No order history found for recommendations");
  }

  //frequently purchased categories
  const categoryCount = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (categoryCount[item.category]) {
        categoryCount[item.category] += item.quantity;
      } else {
        categoryCount[item.category] = item.quantity;
      }
    });
  });

  // Sort categories
  const sortedCategories = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1]
  );

  //top categories
  const topCategories = sortedCategories.slice(0, 3).map((entry) => entry[0]);

  // Fetch products from top categories (assuming a Product model exists)
  const recommendedProducts = await BusinessProduct.find({
    category: { $in: topCategories },
  })
    .limit(10)
    .lean();

  return res.status(200).json(
    new ApiResponse(true, "Recommendations fetched successfully", {
      recommendations: recommendedProducts,
    })
  );
});

export { getRecommendations };
