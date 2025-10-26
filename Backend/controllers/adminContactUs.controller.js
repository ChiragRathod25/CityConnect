import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AdminContactModel from "../models/adminContactUs.model.js";

// Create a new contact message (Public)
const createContactMessage = asyncHandler(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return next(new ApiError("All fields are required", 400));
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Phone validation (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new ApiError(400, "Phone number must be 10 digits");
  }

  const contact = await AdminContactModel.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  if (!contact) {
    throw new ApiError(500, "Failed to submit contact message");
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, "Contact message submitted successfully", contact)
    );
});

// Get all contact messages (Admin)
const getAllContactMessages = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 6, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  // Build filter object
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate pagination
  const skip = (page - 1) * limit;

  const contacts = await AdminContactModel.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select("-__v");

  const totalContacts = await AdminContactModel.countDocuments(filter);
  const totalPages = Math.ceil(totalContacts / limit);

  if (!contacts || contacts.length === 0) {
    throw new ApiError(404, "No contact messages found");
  }

  res.status(200).json(
    new ApiResponse(200, "Contact messages retrieved successfully", {
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalContacts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  );
});

// Get single contact message by ID (Admin)
const getContactMessageById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Contact message ID is required");
  }

  const contact = await AdminContactModel.findById(id).select("-__v");

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Contact message retrieved successfully", contact)
  );
});

// Delete contact message (Admin)
const deleteContactMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Contact message ID is required");
  }

  const contact = await AdminContactModel.findByIdAndDelete(id);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Contact message deleted successfully", null)
  );
});

export {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  deleteContactMessage,
};