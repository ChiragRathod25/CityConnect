import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.log("Error caught:", err.message);
  
  // Handle our custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statuscode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Handle any other errors
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: []
  });
};

export { errorHandler };