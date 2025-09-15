import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ApiError } from './ApiError.js';

class JWTUtils {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  // Generate access token
  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'cityconnect',
      audience: 'cityconnect'
    });
  }

  // Generate refresh token
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'cityconnect',
      audience: 'cityconnect'
    });
  }

  // Generate both tokens
  generateTokenPair(payload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    return { accessToken, refreshToken };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      throw new ApiError(`Invalid access token: ${error.message}`);
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      throw new ApiError(`Invalid refresh token: ${error.message}`);
    }
  }

  // Decode token without verification (for expired tokens)
  decodeToken(token) {
    return jwt.decode(token);
  }

  // Generate session ID
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate device ID from user agent and IP
  generateDeviceId(userAgent, ip) {
    return crypto
      .createHash('sha256')
      .update(`${userAgent}_${ip}`)
      .digest('hex')
      .substring(0, 16);
  }

  // Extract device info from request
  extractDeviceInfo(req) {
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    
    // Simple platform detection
    let platform = 'Unknown';
    let browser = 'Unknown';

    if (userAgent.includes('Windows')) platform = 'Windows';
    else if (userAgent.includes('Mac')) platform = 'MacOS';
    else if (userAgent.includes('Linux')) platform = 'Linux';
    else if (userAgent.includes('Android')) platform = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) platform = 'iOS';

    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    return {
      userAgent,
      ip,
      platform,
      browser,
      deviceId: this.generateDeviceId(userAgent, ip)
    };
  }

  // Calculate token expiry dates
  getTokenExpiry() {
    const accessExpiry = new Date();
    const refreshExpiry = new Date();

    // Parse expiry strings (15m, 7d, etc.)
    const parseExpiry = (expiry) => {
      const num = parseInt(expiry);
      const unit = expiry.slice(-1);
      
      switch (unit) {
        case 'm': return num * 60 * 1000; // minutes
        case 'h': return num * 60 * 60 * 1000; // hours
        case 'd': return num * 24 * 60 * 60 * 1000; // days
        default: return num * 1000; // seconds
      }
    };

    accessExpiry.setTime(accessExpiry.getTime() + parseExpiry(this.accessTokenExpiry));
    refreshExpiry.setTime(refreshExpiry.getTime() + parseExpiry(this.refreshTokenExpiry));

    return { accessExpiry, refreshExpiry };
  }
}

export const jwtUtils = new JWTUtils();