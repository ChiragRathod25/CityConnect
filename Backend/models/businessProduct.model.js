import mongoose from "mongoose";


const businessProductSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters"],
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be >= 0"],
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    category: {
      type: String,
      trim: true,
      index: true,
    },

    brand: {
      type: String,
      trim: true,
      index: true,
    },

    sku: {
      type: String,
      trim: true,
      unique: false, // set true if you want enforced uniqueness
      sparse: true,
    },

    weight: {
      type: String,
      trim: true,
    }, // keep string to allow "1.5 kg"

    dimensions: {
      type: String,
      trim: true,
    }, // "20x15x10 cm"

    tags: {
      type: [String],
      default: [],
    },

    images: {
      type: [String], // array of image URLs
      default: [],
    },

   
    warranty: {
      type: String,
      trim: true,
    }, // e.g., "3 months"

    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    returnPolicyDays: {
      type: Number,
      enum: [0, 7, 15, 30, 60],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster lookup (adjust as needed)
businessProductSchema.index({ name: "text", description: "text", tags: "text" });
businessProductSchema.index({ deliveryCharge: 1 });

// Virtual example: formatted price string
businessProductSchema.virtual("priceFormatted").get(function () {
  if (this.price == null) return null;
  return `${"INR"} ${this.price.toFixed(2)}`;
});

// Pre-save sanitization example
businessProductSchema.pre("save", function (next) {
  if (this.tags && this.tags.length) {
    // trim tags and dedupe
    this.tags = [...new Set(this.tags.map((t) => t.trim()).filter(Boolean))];
  }
  next();
});


export const BusinessProduct = mongoose.model(
  "BusinessProduct",
  businessProductSchema
);
