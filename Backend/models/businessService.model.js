import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // stored CDN / S3 / dataURL
    filename: { type: String }, // original filename or storage key
    method: { type: String, enum: ["upload", "camera"], required: true },
    size: { type: Number }, // bytes (optional)
    alt: { type: String, default: "Business image" }, // optional alt text
  },
  { _id: true } // each image keeps its own id
);

const businessServiceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      minlength: [3, "Business name must be at least 3 characters"],
      maxlength: [100, "Business name cannot exceed 100 characters"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Service type is required"],
      enum: [
        "Photography",
        "Videography",
        "Catering",
        "Event Planning",
        "Repair Services",
        "Cleaning Services",
        "Consulting",
        "Design Services",
        "Construction",
        "Beauty & Spa",
        "Fitness & Wellness",
        "Transportation",
        "Other",
      ],
    },
   description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    categories: {
      type: [String],
      default: [],
      validate: {
        validator: function(categories) {
          return categories.length <= 20;
        },
        message: "Cannot have more than 20 categories"
      },
      index: true,
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+\..+/, 'Please enter a valid website URL']
    },
    establishedYear: {
      type: Number,
      min: [1900, "Established year must be after 1900"],
      max: [new Date().getFullYear(), "Established year cannot be in the future"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be >= 0"],
    },
    socialMedia: {
       facebook: { 
        type: String, 
        trim: true,
        match: [/^https?:\/\/(www\.)?facebook\.com\/.+/, 'Please enter a valid Facebook URL']
      },
      instagram: { 
        type: String, 
        trim: true,
        match: [/^https?:\/\/(www\.)?instagram\.com\/.+/, 'Please enter a valid Instagram URL']
      },
       twitter: { 
        type: String, 
        trim: true,
        match: [/^https?:\/\/(www\.)?twitter\.com\/.+/, 'Please enter a valid Twitter URL']
      },
      youtube: { 
        type: String, 
        trim: true,
        match: [/^https?:\/\/(www\.)?youtube\.com\/.+/, 'Please enter a valid YouTube URL']
      },
       linkedin: { 
        type: String, 
        trim: true,
        match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'Please enter a valid LinkedIn URL']
      },
    },
     awards: {
      type: [String],
      default: [],
      validate: {
        validator: function(awards) {
          return awards.length <= 200;
        },
        message: "Cannot have more than 200 awards"
      }
    },
    images: {
      type: [ImageSchema],
      default: [],
      validate: {
        validator: function(images) {
          return images.length > 0;
        },
        message: "At least one business image is required"
      }
    },

    imageMethod: {
      type: String,
      enum: ["upload","camera"],
      default: "",
    },
  },
 { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster lookup (adjust as needed)
businessServiceSchema.index({ name: "text", description: "text", categories: 1 });
businessServiceSchema.index({ createdAt: -1 });
// Virtual example: formatted price string
businessServiceSchema.virtual("priceFormatted").get(function () {
  if (this.price == null) return null;
  return `${"INR"} ${this.price.toFixed(2)}`;
});

businessServiceSchema.virtual('establishedYearFormatted').get(function() {
  return this.establishedYear ? `Est. ${this.establishedYear}` : null;
});

// Pre-save middleware for data sanitization
businessServiceSchema.pre('save', function(next) {
  // Trim and deduplicate categories
  if (this.categories && this.categories.length) {
    this.categories = [...new Set(this.categories.map(cat => cat.trim()).filter(Boolean))];
  }
  
  // Trim and deduplicate awards
  if (this.awards && this.awards.length) {
    this.awards = [...new Set(this.awards.map(award => award.trim()).filter(Boolean))];
  }
  
  // Ensure website has http:// prefix if provided
  if (this.website && !this.website.startsWith('http')) {
    this.website = `https://${this.website}`;
  }
  
  next();
});

const BusinessService = mongoose.model(
  "ServiceProvider",
  businessServiceSchema
);

export default BusinessService;

// import mongoose from "mongoose";

// const businessServiceSchema = new mongoose.Schema(
//   {
//     businessId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Business",
//       required: true,
//       index: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     duration: {
//       type: Number, // in minutes (optional)
//     },
//     category: {
//       type: String, // e.g. Haircare, Fitness, Consultation
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const BusinessService = mongoose.model(
//   "BusinessService",
//   businessServiceSchema
// );

// export default BusinessService;
