import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },

  // Account Status
  status: {
    type: String,
    enum: ['unverified', 'active', 'suspended', 'blocked'],
    default: 'unverified'
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },

  // Verification Status
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: Date,
  phoneVerifiedAt: Date,

  // twoFactorEnabled: {
  //   type: Boolean,
  //   default: false
  // },
  // twoFactorMethods: [{
  //   type: String,
  //   enum: ['email', 'phone']
  // }],

  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLoginAt: Date,
  lastLoginIP: String,

  // Admin Controls
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  blockedAt: Date,
  blockedReason: String,

  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1, status: 1 });
userSchema.index({ phone: 1, status: 1 });
userSchema.index({ status: 1, role: 1 });
userSchema.index({ lockUntil: 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we have reached max attempts and it's not locked yet, lock the account
  if (this.loginAttempts + 1 >= 3 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + (2 * 60 * 60 * 1000) }; // 2 hours
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

export const User = mongoose.model('User', userSchema);





// import mongoose from "mongoose";
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 30,
//     match: /^[a-zA-Z0-9_]+$/,
//     index: true
//   },
  
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     index: true
//   },
  
//   password: {
//     type: String,
//     required: true,
//     length: 6,
//     match: /^\d{6}$/
//   },
  
//   role: {
//     type: String,
//     enum: ['user', 'businessman', 'admin'],
//     default: 'user',
//     index: true
//   },
  
//   image: {
//     type: String,
//     default: null
//   },
  
//   phone: {
//     type: String,
//     sparse: true,
//     match: /^\+?[1-9]\d{1,14}$/,
//     index: true
//   },
  
//   firstName: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 2,
//     maxlength: 50
//   },
  
//   lastName: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 2,
//     maxlength: 50
//   },
  
//   dateOfBirth: {
//     type: Date
//   },
  
//   isEmailVerified: {
//     type: Boolean,
//     default: false
//   },
  
//   isPhoneVerified: {
//     type: Boolean,
//     default: false
//   },
  
//   isTwoFactorEnabled: {
//     type: Boolean,
//     default: false
//   },
  
//   isBlocked: {
//     type: Boolean,
//     default: false,
//     index: true
//   },
  
//   lastLogin: {
//     type: Date,
//     index: true
//   },
  
//   failedLoginAttempts: {
//     type: Number,
//     default: 0,
//     max: 5
//   },
  
//   lockUntil: {
//     type: Date,
//     index: true
//   }
// }, {
//   timestamps: true,
//   toJSON: { 
//     transform: function(doc, ret) {
//       delete ret.password;
//       delete ret.__v;
//       return ret;
//     }
//   }
// });


// //! Virtual for account lock status
// userSchema.virtual('isLocked').get(function() {
//   return !!(this.lockUntil && this.lockUntil > Date.now());
// });

// //! Pre-save middleware to hash password
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// //! Method to compare password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// //! Method to increment login attempts
// userSchema.methods.incLoginAttempts = async function() {
//   //* If lock has expired, reset attempts
//   if (this.lockUntil && this.lockUntil < Date.now()) {
//     return this.updateOne({
//       $unset: { lockUntil: 1 },
//       $set: { failedLoginAttempts: 1 }
//     });
//   }
  
//   const updates = { $inc: { failedLoginAttempts: 1 } };
  
//   //* Lock account after 5 failed attempts for 2 hours
//   if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
//     updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
//   }
  
//   return this.updateOne(updates);
// };

// //! Method to reset login attempts after successful login
// userSchema.methods.resetLoginAttempts = async function() {
//   return this.updateOne({
//     $unset: { failedLoginAttempts: 1, lockUntil: 1 },
//     $set: { lastLogin: new Date() }
//   });
// };

// //! Static method to block user
// userSchema.statics.blockUser = async function(userId) {
//   return this.findByIdAndUpdate(userId, { 
//     isBlocked: true,
//     lockUntil: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
//   });
// };

// //! Static method to unblock user
// userSchema.statics.unblockUser = async function(userId) {
//   return this.findByIdAndUpdate(userId, { 
//     isBlocked: false,
//     failedLoginAttempts: 0,
//     $unset: { lockUntil: 1 }
//   });
// };

// const User = mongoose.model('User', userSchema);

// export default User;

