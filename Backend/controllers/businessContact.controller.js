import { ApiResponse as ApiResponce } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Business } from "../models/business.model.js";
import { BusinessContact } from "../models/businessContact.model.js";

const addBusinessContact = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;
  
  const business = await Business.findById(businessId);

  if (!business) {
    throw new ApiError(404, "Business not found");
  }
  
  const { phone, email, website, socialMedia } = req.body;
  if(!phone || !email ) {
    throw new ApiError(400, "Phone and Email are required");
  }

  const newContact = await BusinessContact.create({
    businessId,
    phone,
    email,
    website,
    socialMedia
  });

  if (!newContact) {
    throw new ApiError(500, "Failed to create business contact");
  }

  res
    .status(201)
    .json(
      new ApiResponce(
        201,
        "Business contact created successfully",
        newContact
      )
    );
});

const getBusinessContact = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;

  if(!businessId) {
    throw new ApiError("Business ID is required", 400)
  }
  const businessContact = await BusinessContact.findOne({ 
    businessId: businessId
   });

  if (!businessContact) {
    throw new ApiError(500,"Business not found")
  }

  res
    .status(200)
    .json(
      new ApiResponce(
        200,
        "Business contact fetched successfully",
        businessContact
      )
    );
});

const updateBusinessContact = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;
    console.log("req.body:", req.body);
    const { phone, email, address, socialLinks, website } = req.body;

    if(!businessId) {
      return next(new ApiError("Business ID is required", 400));
    }
  
    console.log("Updating business contact for businessId:", businessId);
    const business= await Business.findById(businessId);
    if(!business) {
      throw new ApiError(404, "Business not found");
    }

    let businessContact = await BusinessContact.findOne({ businessId: businessId });
    if (!businessContact) {
      throw new ApiError(404, "Business contact not found");
    }

    businessContact.phone = phone || businessContact.phone;
    businessContact.email = email || businessContact.email;
    businessContact.address = address || businessContact.address;
    businessContact.socialLinks = socialLinks || businessContact.socialLinks;
    businessContact.website = website || businessContact.website;

    await businessContact.save({
      validateBeforeSave: false,
    }); 

    res
      .status(200)
      .json(
        new ApiResponce(
          200,
          "Business contact updated successfully",
          businessContact
        )
      );

});

const deleteBusinessContact = asyncHandler(async (req, res, next) => {
    const { businessId } = req.params;
    
    if(!businessId) {
      throw new ApiError(400,"Business ID is required"

      )
    }

    const business= await Business.findById(businessId);

    if(!business) {
      throw new ApiError(404, "Business not found");
    }

    const businessContact = await BusinessContact.findOneAndDelete({ businessId: businessId });
    if (!businessContact) {
      throw new ApiError(500,"Business contact not found")
    }
    res.
    status(200)
    .json(
      new ApiResponce(
        200,
        "Business contact deleted successfully",
        businessContact
      )
    )
});

const getBusinessSocialLinks = asyncHandler(async (req, res, next) => {
  const { businessId } = req.params;

  if (!businessId) {
    throw new ApiError(400, "Business ID is required"); 
  }
  
  const business = await Business.findById(businessId);
  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  const businessContact = await BusinessContact.findOne({ businessid: businessId });
  if (!businessContact) {
    throw new ApiError(500,"Business not found")
  }
  res
    .status(200)
    .json(
      new ApiResponce(
        200,
        "Business social links fetched successfully",
        businessContact.socialMedia
      )
    );
});

export {
  addBusinessContact,
  getBusinessContact,
  updateBusinessContact,
  deleteBusinessContact,
  getBusinessSocialLinks,
};
