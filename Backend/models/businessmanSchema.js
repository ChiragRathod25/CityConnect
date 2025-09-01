import { Schema, model } from 'mongoose';
import { businessCategory } from '../constant';

const LocationSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String , required : true},
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});

const VerificationStatusSchema = new Schema({
  govtIdProof: { 
    type: String, 
    enum: ['pending', 'verifying', 'verified', 'failed'], 
    default: 'pending' 
  },
  selfieWithId: { 
    type: String, 
    enum: ['pending', 'verifying', 'verified', 'failed'], 
    default: 'pending' 
  },
  businessLicense: { 
    type: String, 
    enum: ['pending', 'verifying', 'verified', 'failed'], 
    default: 'pending' 
  },
  businessPhoto: { 
    type: String, 
    enum: ['pending', 'verifying', 'verified', 'failed'], 
    default: 'pending' 
  },
  professionalPhoto: { 
    type: String, 
    enum: ['pending', 'verifying', 'verified', 'failed'], 
    default: 'pending' 
  }
});


const DocumentSchema = new Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  fileSize: Number,
  mimeType: String
});

const SellerSchema = new Schema({
  fullName: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  contactNumber: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian mobile number!`
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },


  businessName: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  businessType: { 
    type: String, 
    required: true,
    enum: ['product', 'service', 'both']
  },
  businessCategory: { 
    type: String, 
    required: true,
    enum: businessCategory
  },
  businessDescription: { 
    type: String, 
    required: true,
    minlength: 20,
    maxlength: 500
  },
  yearsInBusiness: { 
    type: String, 
    required: true,
    enum: ['0-1', '1-3', '3-5', '5-10', '10+']
  },

  // Location Details
  location: { 
    type: LocationSchema, 
    required: true 
  },

  // Business Settings
  deliveryAvailable: { 
    type: Boolean, 
    default: false 
  },
  homeServiceAvailable: { 
    type: Boolean, 
    default: false 
  },
  paymentMethods: [{ 
    type: String, 
    enum: ['Cash', 'UPI', 'Card', 'Net Banking', 'Digital Wallet'] 
  }],
  openingTime: { 
    type: String, 
    required: true,
    match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
  },
  closingTime: { 
    type: String, 
    required: true,
    match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/,
    validate: {
      validator: function(v) {
        return this.openingTime < v;
      },
      message: 'Closing time must be after opening time'
    }
  },
  weeklyOff: { 
    type: String, 
    required: true,
    enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'none']
  },

  // Document Uploads (URLs to cloud storage)
  govtIdProof: {
    type: DocumentSchema,
    required: true
  },
  selfieWithId: {
    type: DocumentSchema,
    required: true
  },
  businessLicense: {
    type: DocumentSchema,
    required: false // Optional
  },
  businessPhoto: {
    type: DocumentSchema,
    required: true
  },
  professionalPhoto: {
    type: DocumentSchema,
    required: true
  },

  // Verification Status
  verificationStatus: {
    type: VerificationStatusSchema,
    default: () => ({})
  },

  // Agreement
  acceptTerms: { 
    type: Boolean, 
    required: true,
    validate: {
      validator: function(v) {
        return v === true;
      },
      message: 'You must accept the terms and conditions'
    }
  },

  accountStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },

  rejectionReason: String,
  lastLogin: Date,
  registrationIP: String,
  deviceInfo: String

},{
  timestamps : true
});

// Indexes for better query performance
SellerSchema.index({ email: 1 });
SellerSchema.index({ contactNumber: 1 });
SellerSchema.index({ businessName: 1 });
SellerSchema.index({ 'location.city': 1, 'location.state': 1 });
SellerSchema.index({ businessCategory: 1 });
SellerSchema.index({ accountStatus: 1 });

// Pre-save middleware to update the updatedAt field
SellerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for document upload progress
SellerSchema.virtual('documentProgress').get(function() {
  const requiredDocs = ['govtIdProof', 'selfieWithId', 'businessPhoto', 'professionalPhoto'];
  const optionalDocs = ['businessLicense'];
  
  const requiredCompleted = requiredDocs.filter(doc => this[doc]).length;
  const optionalCompleted = optionalDocs.filter(doc => this[doc]).length;
  
  const totalDocs = requiredDocs.length + optionalDocs.length;
  const totalCompleted = requiredCompleted + optionalCompleted;
  
  return {
    completed: totalCompleted,
    total: totalDocs,
    percentage: Math.round((totalCompleted / totalDocs) * 100),
    required: { completed: requiredCompleted, total: requiredDocs.length },
    optional: { completed: optionalCompleted, total: optionalDocs.length }
  };
});

// Method to check if all required documents are uploaded
SellerSchema.methods.hasAllRequiredDocuments = function() {
  const requiredDocs = ['govtIdProof', 'selfieWithId', 'businessPhoto', 'professionalPhoto'];
  return requiredDocs.every(doc => this[doc]);
};

export default model('Seller', SellerSchema);