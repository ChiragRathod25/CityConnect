import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
    index: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    index: true
  },
  
  password: {
    type: String,
    required: true,
    length: 6,
    match: /^\d{6}$/
  },
  
  role: {
    type: String,
    enum: ['user', 'businessman', 'admin'],
    default: 'user',
    index: true
  },
  
  image: {
    type: String,
    default: null
  },
  
  phone: {
    type: String,
    sparse: true,
    match: /^\+?[1-9]\d{1,14}$/,
    index: true
  },
  
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  
  dateOfBirth: {
    type: Date
  },
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  isTwoFactorEnabled: {
    type: Boolean,
    default: false
  },
  
  isBlocked: {
    type: Boolean,
    default: false,
    index: true
  },
  
  lastLogin: {
    type: Date,
    index: true
  },
  
  failedLoginAttempts: {
    type: Number,
    default: 0,
    max: 5
  },
  
  lockUntil: {
    type: Date,
    index: true
  }
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


//! Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

//! Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//! Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//! Method to increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  //* If lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { failedLoginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { failedLoginAttempts: 1 } };
  
  //* Lock account after 5 failed attempts for 2 hours
  if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

//! Method to reset login attempts after successful login
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: { failedLoginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

//! Static method to block user
userSchema.statics.blockUser = async function(userId) {
  return this.findByIdAndUpdate(userId, { 
    isBlocked: true,
    lockUntil: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
};

//! Static method to unblock user
userSchema.statics.unblockUser = async function(userId) {
  return this.findByIdAndUpdate(userId, { 
    isBlocked: false,
    failedLoginAttempts: 0,
    $unset: { lockUntil: 1 }
  });
};

const User = mongoose.model('User', userSchema);

export default User;

