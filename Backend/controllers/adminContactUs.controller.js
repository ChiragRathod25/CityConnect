import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Contact } from "../models/contact.model.js";

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

  const contact = await Contact.create({
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
  const { page = 1, limit = 10, status, search } = req.query;
  const filter = {};

  // Filter by status if provided
  if (status) {
    filter.status = status;
  }

  // Search by name, email, or subject
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalContacts = await Contact.countDocuments(filter);

  if (!contacts || contacts.length === 0) {
    throw new ApiError(404, "No contact messages found");
  }

  const response = {
    contacts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalContacts / parseInt(limit)),
      totalMessages: totalContacts,
      messagesPerPage: parseInt(limit),
    },
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, "Contact messages fetched successfully", response)
    );
});

// Get contact message by ID (Admin)
const getContactMessageById = asyncHandler(async (req, res, next) => {
  const contactId = req.params.id;

  if (!contactId) {
    throw new ApiError(400, "Contact ID is required");
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Contact message fetched successfully", contact)
    );
});

// Update contact message status (Admin)
const updateContactStatus = asyncHandler(async (req, res, next) => {
  const contactId = req.params.id;
  const { status } = req.body;

  if (!contactId) {
    throw new ApiError(400, "Contact ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status field is required");
  }

  const validStatuses = ["pending", "in-progress", "resolved", "closed"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  contact.status = status;
  await contact.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(
      new ApiResponse(200, "Contact status updated successfully", contact)
    );
});

// Add admin notes/reply (Admin)
const addAdminNotes = asyncHandler(async (req, res, next) => {
  const contactId = req.params.id;
  const { notes } = req.body;

  if (!contactId) {
    throw new ApiError(400, "Contact ID is required");
  }

  if (!notes) {
    throw new ApiError(400, "Notes field is required");
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  contact.adminNotes = notes;
  contact.repliedAt = new Date();
  contact.repliedBy = req.user._id; // Assuming admin user ID from auth middleware

  await contact.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(new ApiResponse(200, "Admin notes added successfully", contact));
});

// Mark as read/unread (Admin)
const toggleReadStatus = asyncHandler(async (req, res, next) => {
  const contactId = req.params.id;

  if (!contactId) {
    throw new ApiError(400, "Contact ID is required");
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  contact.isRead = !contact.isRead;
  if (contact.isRead && !contact.readAt) {
    contact.readAt = new Date();
  }

  await contact.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Contact marked as ${contact.isRead ? "read" : "unread"}`,
        contact
      )
    );
});

// Delete contact message (Admin)
const deleteContactMessage = asyncHandler(async (req, res, next) => {
  const contactId = req.params.id;

  if (!contactId) {
    throw new ApiError(400, "Contact ID is required");
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(404, "Contact message not found");
  }

  await contact.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, "Contact message deleted successfully", null));
});

// Bulk delete contact messages (Admin)
const bulkDeleteContactMessages = asyncHandler(async (req, res, next) => {
  const { contactIds } = req.body;

  if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
    throw new ApiError(400, "Contact IDs array is required");
  }

  const result = await Contact.deleteMany({ _id: { $in: contactIds } });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No contact messages found to delete");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `${result.deletedCount} contact messages deleted successfully`,
        { deletedCount: result.deletedCount }
      )
    );
});

// Get contact statistics (Admin)
const getContactStatistics = asyncHandler(async (req, res, next) => {
  const totalMessages = await Contact.countDocuments();
  const pendingMessages = await Contact.countDocuments({ status: "pending" });
  const resolvedMessages = await Contact.countDocuments({ status: "resolved" });
  const unreadMessages = await Contact.countDocuments({ isRead: false });

  const recentMessages = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email subject createdAt status");

  const statistics = {
    total: totalMessages,
    pending: pendingMessages,
    resolved: resolvedMessages,
    unread: unreadMessages,
    recentMessages,
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, "Contact statistics fetched successfully", statistics)
    );
});

// Search contact messages (Admin)
const searchContactMessages = asyncHandler(async (req, res, next) => {
  const { name, email, subject, status, startDate, endDate } = req.query;
  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }
  if (email) {
    filter.email = { $regex: email, $options: "i" };
  }
  if (subject) {
    filter.subject = { $regex: subject, $options: "i" };
  }
  if (status) {
    filter.status = status;
  }
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  const contacts = await Contact.find(filter).sort({ createdAt: -1 });

  if (!contacts || contacts.length === 0) {
    throw new ApiError(404, "No contact messages found matching the criteria");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Contact messages fetched successfully", contacts)
    );
});

export {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactStatus,
  addAdminNotes,
  toggleReadStatus,
  deleteContactMessage,
  bulkDeleteContactMessages,
  getContactStatistics,
  searchContactMessages,
};


// ==================== ROUTES ====================
// routes/contact.routes.js

import { Router } from "express";
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactStatus,
  addAdminNotes,
  toggleReadStatus,
  deleteContactMessage,
  bulkDeleteContactMessages,
  getContactStatistics,
  searchContactMessages,
} from "../controllers/contact.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Public route - Submit contact form
router.route("/submit").post(createContactMessage);

// Admin routes - All require authentication and admin role
router.route("/admin/all").get(verifyJWT, isAdmin, getAllContactMessages);
router.route("/admin/search").get(verifyJWT, isAdmin, searchContactMessages);
router.route("/admin/statistics").get(verifyJWT, isAdmin, getContactStatistics);
router.route("/admin/bulk-delete").delete(verifyJWT, isAdmin, bulkDeleteContactMessages);

router.route("/admin/:id").get(verifyJWT, isAdmin, getContactMessageById);
router.route("/admin/:id/status").patch(verifyJWT, isAdmin, updateContactStatus);
router.route("/admin/:id/notes").patch(verifyJWT, isAdmin, addAdminNotes);
router.route("/admin/:id/toggle-read").patch(verifyJWT, isAdmin, toggleReadStatus);
router.route("/admin/:id").delete(verifyJWT, isAdmin, deleteContactMessage);

export default router;
