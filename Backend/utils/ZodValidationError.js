import { ApiResponse } from "./ApiResponse.js";

export const handleZodValidationError = (validationResult, res) => {
  if (!validationResult.success) {
    console.error("Zod Validation failed!");
    console.error("Error issues:", validationResult.error.issues);

    const errorMessages = validationResult.error.issues.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    );

    const response = {
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    };

    return res.status(400).json(
      new ApiResponse(400,"Validation Error",response)
    );
  }
  return null; // No error, continue with normal flow
};