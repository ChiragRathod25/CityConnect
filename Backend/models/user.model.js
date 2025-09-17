import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    dateOfBirth: {
      type: Date,
    },
    username: {
      type: String,
      required: true,
      unique : true,
      trim: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    image: {
      type: String,
      default: null,
    },

    // Account Status
    status: {
      type: String,
      enum: ["pending_verification", "active", "suspended", "blocked"],
      default: "pending_verification",
    },
    role: {
      type: String,
      enum: ["user", "business", "admin"],
      default: "user",
    },

    // Verification Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    phoneVerifiedAt: {
      type: Date,
    },
    // twoFactorEnabled: {
    //   type: Boolean,
    //   default: false
    // },
    // twoFactorMethods: [{
    //   type: String,
    //   enum: ['email', 'phoneNumber']
    // }],

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    lastLoginAt: Date,
    isLocked:{
      type : Boolean,
      default : false
    }
    //   lastLoginIP: String,

    // Admin Controls
    //   blockedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    //   },
    //   blockedAt: Date,
    //   blockedReason: String,

    //   deletedAt: Date
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// // Virtual for account lock status
// userSchema.virtual('isLocked').get(function() {
//   return !!(this.lockUntil && this.lockUntil > Date.now());
// });

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { failedLoginAttempts: 1 },
    });
  }

  const updates = { $inc: { failedLoginAttempts: 1 } };

  // If we have reached max(3) attempts and it's not locked yet, lock the account
  if (this.failedLoginAttempts + 1 >= 3 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { failedLoginAttempts: 1, lockUntil: 1 },
  });
};

export const User = mongoose.model("User", userSchema);
