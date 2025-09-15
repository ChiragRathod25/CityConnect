import redis from "../config/redis.js";
import { Token } from "../models/token.model.js";
import { jwtUtils } from "../utils/jwtUtils.js";

class SessionService {
  // Create new session with tokens
  async createSession(userId, req) {
    try {
      const deviceInfo = jwtUtils.extractDeviceInfo(req);
      const sessionId = jwtUtils.generateSessionId();
      
      // Token payload
      const tokenPayload = {
        userId: userId.toString(),
        sessionId,
        deviceId: deviceInfo.deviceId
      };

      // Generate token pair
      const { accessToken, refreshToken } = jwtUtils.generateTokenPair(tokenPayload);
      const { refreshExpiry } = jwtUtils.getTokenExpiry();

      // Store in database
      const tokenDoc = await Token.create({
        userId,
        refreshToken,
        accessToken,
        sessionId,
        deviceInfo,
        expiresAt: refreshExpiry,
        isActive: true,
        lastUsed: new Date()
      });

      // Store session in Redis for quick access
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: userId.toString(),
          deviceInfo,
          isActive: true
        }),
        { ex: 7 * 24 * 60 * 60 } // 7 days
      );

      return {
        sessionId,
        accessToken,
        refreshToken,
        deviceInfo,
        expiresAt: refreshExpiry
      };
    } catch (error) {
      throw new Error(`Session creation failed: ${error.message}`);
    }
  }

  // Validate session
  async validateSession(sessionId) {
    try {
      // Check Redis first for quick validation
      const redisSession = await redis.get(`session:${sessionId}`);
      
      if (redisSession) {
        const sessionData = JSON.parse(redisSession);
        if (sessionData.isActive) {
          return sessionData;
        }
      }

      // Fallback to database
      const tokenDoc = await Token.findOne({
        sessionId,
        isActive: true,
        expiresAt: { $gt: new Date() }
      });

      if (!tokenDoc) {
        return null;
      }

      // Update Redis cache
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: tokenDoc.userId.toString(),
          deviceInfo: tokenDoc.deviceInfo,
          isActive: true
        }),
        { ex: 7 * 24 * 60 * 60 }
      );

      return {
        userId: tokenDoc.userId.toString(),
        deviceInfo: tokenDoc.deviceInfo,
        isActive: true
      };
    } catch (error) {
      return null;
    }
  }

  // Refresh tokens
  async refreshTokens(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwtUtils.verifyRefreshToken(refreshToken);
      
      // Find token in database
      const tokenDoc = await Token.findOne({
        refreshToken,
        isActive: true,
        expiresAt: { $gt: new Date() }
      }).populate('userId');

      if (!tokenDoc) {
        throw new Error('Invalid refresh token');
      }

      // Generate new token pair
      const tokenPayload = {
        userId: tokenDoc.userId._id.toString(),
        sessionId: tokenDoc.sessionId,
        deviceId: tokenDoc.deviceInfo.deviceId
      };

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
        jwtUtils.generateTokenPair(tokenPayload);

      const { refreshExpiry } = jwtUtils.getTokenExpiry();

      // Update token in database
      tokenDoc.accessToken = newAccessToken;
      tokenDoc.refreshToken = newRefreshToken;
      tokenDoc.expiresAt = refreshExpiry;
      tokenDoc.lastUsed = new Date();
      await tokenDoc.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionId: tokenDoc.sessionId,
        user: tokenDoc.userId
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId) {
    try {
      await Token.updateOne(
        { sessionId, isActive: true },
        { lastUsed: new Date() }
      );
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  // Get user sessions
  async getUserSessions(userId) {
    try {
      return await Token.getActiveSessions(userId);
    } catch (error) {
      throw new Error(`Failed to get user sessions: ${error.message}`);
    }
  }

  // Revoke single session
  async revokeSession(sessionId) {
    try {
      await Token.revokeSession(sessionId);
      await redis.del(`session:${sessionId}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to revoke session: ${error.message}`);
    }
  }

  // Revoke all user sessions
  async revokeAllSessions(userId) {
    try {
      // Get all session IDs first
      const sessions = await Token.find({ userId, isActive: true }).select('sessionId');
      
      // Remove from Redis
      const redisKeys = sessions.map(session => `session:${session.sessionId}`);
      if (redisKeys.length > 0) {
        await redis.del(...redisKeys);
      }

      // Revoke in database
      await Token.revokeAllSessions(userId);
      return true;
    } catch (error) {
      throw new Error(`Failed to revoke all sessions: ${error.message}`);
    }
  }

  // Revoke all sessions except current
  async revokeOtherSessions(userId, currentSessionId) {
    try {
      const sessions = await Token.find({ 
        userId, 
        isActive: true,
        sessionId: { $ne: currentSessionId }
      }).select('sessionId');
      
      // Remove from Redis
      const redisKeys = sessions.map(session => `session:${session.sessionId}`);
      if (redisKeys.length > 0) {
        await redis.del(...redisKeys);
      }

      // Revoke in database
      await Token.updateMany(
        { 
          userId, 
          isActive: true, 
          sessionId: { $ne: currentSessionId } 
        },
        { isActive: false }
      );

      return true;
    } catch (error) {
      throw new Error(`Failed to revoke other sessions: ${error.message}`);
    }
  }

  // Cleanup expired tokens (run as cron job)
  async cleanupExpiredTokens() {
    try {
      const result = await Token.cleanExpiredTokens();
      console.log(`Cleaned up ${result.deletedCount} expired tokens`);
      return result.deletedCount;
    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error);
    }
  }

  // Validate access token and session
  async validateAccessToken(accessToken) {
    try {
      const decoded = jwtUtils.verifyAccessToken(accessToken);
      
      // Validate session exists and is active
      const session = await this.validateSession(decoded.sessionId);
      
      if (!session || session.userId !== decoded.userId) {
        throw new Error('Invalid session');
      }

      // Update session activity
      await this.updateSessionActivity(decoded.sessionId);

      return {
        userId: decoded.userId,
        sessionId: decoded.sessionId,
        deviceInfo: session.deviceInfo
      };
    } catch (error) {
      throw new Error(`Access token validation failed: ${error.message}`);
    }
  }
}

export const sessionService = new SessionService();