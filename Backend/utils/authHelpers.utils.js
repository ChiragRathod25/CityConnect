import User from '../models/user.model';
import Session from '../models/session.model';
import LoginAttempt from "../models/loginAttempt.model"
import crypto from 'crypto';


class AuthHelpers {
  
  // Generate secure tokens
  static generateAccessToken() {
    return crypto.randomBytes(64).toString('hex');
  }
  
  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }
  
  // Check if user account is valid for login
  static async validateUserForLogin(user, ip) {
    const errors = [];
    
    // Check if user is blocked
    if (user.isBlocked) {
      errors.push('Account is blocked. Contact administrator.');
    }
    
    // Check if account is locked due to failed attempts
    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      errors.push(`Account is locked. Try again in ${lockTimeRemaining} minutes.`);
    }
    
    // Check IP rate limiting
    const ipBlocked = await LoginAttempt.checkIPRateLimit(ip);
    if (ipBlocked) {
      errors.push('Too many failed attempts from this IP. Please try again later.');
    }
    
    // Check if email verification is required
    if (!user.isEmailVerified) {
      errors.push('Please verify your email address before logging in.');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  // Log login attempt
  static async logLoginAttempt(identifier, ip, userAgent, success, reason = null, userId = null) {
    try {
      await LoginAttempt.logAttempt({
        identifier,
        ip,
        userAgent,
        success,
        reason,
        userId
      });
    } catch (error) {
      console.error('Failed to log login attempt:', error);
    }
  }
  
  // Create new session
  static async createSession(userId, deviceInfo) {
    try {
      const accessToken = this.generateAccessToken();
      const refreshToken = this.generateRefreshToken();
      
      const session = new Session({
        userId,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        deviceInfo,
        isActive: true
      });
      
      await session.save();
      
      return {
        sessionId: session._id,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: session.accessTokenExpiresAt,
        refreshTokenExpiresAt: session.refreshTokenExpiresAt
      };
      
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }
  
  // Validate access token
  static async validateAccessToken(accessToken) {
    try {
      const session = await Session.findOne({
        accessToken,
        isActive: true,
        accessTokenExpiresAt: { $gt: new Date() }
      }).populate('userId', '-password');
      
      if (!session) {
        return { isValid: false, error: 'Invalid or expired access token' };
      }
      
      // Update last accessed time
      session.lastAccessedAt = new Date();
      await session.save();
      
      return {
        isValid: true,
        user: session.userId,
        session: session
      };
      
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
  
  // Logout single session
  static async logoutSession(sessionId) {
    try {
      await Session.findByIdAndUpdate(sessionId, { isActive: false });
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Logout all user sessions
  static async logoutAllUserSessions(userId, excludeSessionId = null) {
    try {
      const query = { userId, isActive: true };
      if (excludeSessionId) {
        query._id = { $ne: excludeSessionId };
      }
      
      const result = await Session.updateMany(query, { isActive: false });
      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Failed to logout all sessions: ${error.message}`);
    }
  }
  
  // Get user active sessions
  static async getUserActiveSessions(userId) {
    try {
      return await Session.find({
        userId,
        isActive: true,
        refreshTokenExpiresAt: { $gt: new Date() }
      }).select('-accessToken -refreshToken').sort({ lastAccessedAt: -1 });
    } catch (error) {
      throw new Error(`Failed to get user sessions: ${error.message}`);
    }
  }
  
  // Block user (admin function)
  static async blockUser(userId, reason = 'Admin action') {
    try {
      // Block user account
      await User.blockUser(userId);
      
      // Logout all user sessions
      await this.logoutAllUserSessions(userId);
      
      return true;
    } catch (error) {
      throw new Error(`Failed to block user: ${error.message}`);
    }
  }
  
  // Unblock user (admin function)
  static async unblockUser(userId) {
    try {
      await User.unblockUser(userId);
      return true;
    } catch (error) {
      throw new Error(`Failed to unblock user: ${error.message}`);
    }
  }
}

export {
  AuthHelpers
}