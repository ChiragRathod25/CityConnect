// ================== EMAIL SERVICE (services/emailService.js) ==================

const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

class EmailService {
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@yourapp.com';
    this.appName = process.env.APP_NAME || 'Your App';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  // Load and compile email template
  async loadTemplate(templateName, variables = {}) {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
      const templateContent = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);
      
      // Default variables available to all templates
      const defaultVariables = {
        appName: this.appName,
        frontendUrl: this.frontendUrl,
        currentYear: new Date().getFullYear(),
        supportEmail: process.env.SUPPORT_EMAIL || 'support@yourapp.com'
      };
      
      return template({ ...defaultVariables, ...variables });
    } catch (error) {
      console.error(`Error loading email template ${templateName}:`, error);
      // Fallback to basic HTML if template fails
      return this.getBasicTemplate(templateName, variables);
    }
  }

  // Basic fallback template
  getBasicTemplate(type, variables) {
    const templates = {
      otp: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verification Code</h2>
          <p>Your verification code is: <strong style="font-size: 24px; color: #007bff;">${variables.otp}</strong></p>
          <p>This code will expire in ${variables.expiryMinutes || 5} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
      passwordReset: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${variables.resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
      welcome: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ${this.appName}!</h2>
          <p>Hi ${variables.userName},</p>
          <p>Your account has been successfully created and verified.</p>
          <p>You can now access all features of our platform.</p>
          <a href="${this.frontendUrl}/dashboard" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Get Started</a>
        </div>
      `,
      securityAlert: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Security Alert</h2>
          <p>Hi ${variables.userName},</p>
          <p><strong>${variables.alertType}</strong></p>
          <p>Details: ${variables.details}</p>
          <p>If this was you, no action is needed. If not, please secure your account immediately.</p>
          <a href="${this.frontendUrl}/security" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Review Security</a>
        </div>
      `
    };

    return templates[type] || '<p>Email content not available</p>';
  }

  // Send OTP email
  async sendOTP(email, otp, purpose, userInfo = {}) {
    try {
      const subjects = {
        registration: `Complete your ${this.appName} registration`,
        login: `${this.appName} Login Verification`,
        '2fa': `${this.appName} Two-Factor Authentication`,
        password_reset: `Reset your ${this.appName} password`,
        email_change: `Verify your new email address`,
        phone_change: `Verify email for phone change`
      };

      const purposeTexts = {
        registration: 'complete your account registration',
        login: 'complete your login',
        '2fa': 'complete two-factor authentication',
        password_reset: 'reset your password',
        email_change: 'verify your new email address',
        phone_change: 'confirm your phone number change'
      };

      const htmlContent = await this.loadTemplate('otp', {
        userName: userInfo.name || 'User',
        otp: otp,
        purpose: purposeTexts[purpose] || 'verify your account',
        expiryMinutes: 5,
        ipAddress: userInfo.ipAddress,
        deviceInfo: userInfo.deviceInfo,
        timestamp: new Date().toLocaleString()
      });

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: subjects[purpose] || `${this.appName} Verification Code`,
        html: htmlContent,
        tags: [
          { name: 'category', value: 'authentication' },
          { name: 'purpose', value: purpose }
        ]
      });

      console.log(`OTP email sent successfully to ${email} for ${purpose}:`, result.id);
      return { success: true, messageId: result.id };

    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  // Send password reset email
  async sendPasswordReset(email, resetUrl, userInfo = {}) {
    try {
      const htmlContent = await this.loadTemplate('passwordReset', {
        userName: userInfo.name || 'User',
        resetUrl: resetUrl,
        expiryMinutes: 15,
        ipAddress: userInfo.ipAddress,
        timestamp: new Date().toLocaleString()
      });

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Reset your ${this.appName} password`,
        html: htmlContent,
        tags: [
          { name: 'category', value: 'password-reset' },
          { name: 'purpose', value: 'password_reset' }
        ]
      });

      console.log(`Password reset email sent to ${email}:`, result.id);
      return { success: true, messageId: result.id };

    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, userInfo) {
    try {
      const htmlContent = await this.loadTemplate('welcome', {
        userName: userInfo.name,
        userEmail: email,
        registrationDate: new Date().toLocaleDateString()
      });

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Welcome to ${this.appName}!`,
        html: htmlContent,
        tags: [
          { name: 'category', value: 'onboarding' },
          { name: 'purpose', value: 'welcome' }
        ]
      });

      console.log(`Welcome email sent to ${email}:`, result.id);
      return { success: true, messageId: result.id };

    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome emails as they're not critical
      return { success: false, error: error.message };
    }
  }

  // Send security alert email
  async sendSecurityAlert(email, alertType, details, userInfo = {}) {
    try {
      const alertTypes = {
        'suspicious_login': 'Suspicious login attempt detected',
        'password_changed': 'Your password was changed',
        'email_changed': 'Your email address was changed',
        'phone_changed': 'Your phone number was changed',
        '2fa_enabled': 'Two-factor authentication enabled',
        '2fa_disabled': 'Two-factor authentication disabled',
        'account_blocked': 'Your account has been blocked',
        'multiple_failed_logins': 'Multiple failed login attempts detected'
      };

      const htmlContent = await this.loadTemplate('securityAlert', {
        userName: userInfo.name || 'User',
        alertType: alertTypes[alertType] || 'Security Event',
        details: details,
        ipAddress: userInfo.ipAddress,
        deviceInfo: userInfo.deviceInfo,
        timestamp: new Date().toLocaleString()
      });

      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `${this.appName} Security Alert: ${alertTypes[alertType] || 'Security Event'}`,
        html: htmlContent,
        tags: [
          { name: 'category', value: 'security' },
          { name: 'alert_type', value: alertType }
        ]
      });

      console.log(`Security alert email sent to ${email}:`, result.id);
      return { success: true, messageId: result.id };

    } catch (error) {
      console.error('Error sending security alert email:', error);
      // Don't throw error for security alerts to prevent blocking main flow
      return { success: false, error: error.message };
    }
  }

  // Send bulk emails (for admin notifications, etc.)
  async sendBulkEmails(recipients, subject, template, templateVariables = {}) {
    try {
      const results = [];
      const batchSize = 50; // Resend's batch limit

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        const emailPromises = batch.map(async (recipient) => {
          try {
            const htmlContent = await this.loadTemplate(template, {
              ...templateVariables,
              userName: recipient.name || 'User',
              userEmail: recipient.email
            });

            return this.resend.emails.send({
              from: this.fromEmail,
              to: recipient.email,
              subject: subject,
              html: htmlContent,
              tags: [
                { name: 'category', value: 'bulk' },
                { name: 'template', value: template }
              ]
            });
          } catch (error) {
            console.error(`Failed to send email to ${recipient.email}:`, error);
            return { error: error.message, email: recipient.email };
          }
        });

        const batchResults = await Promise.allSettled(emailPromises);
        results.push(...batchResults);
      }

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.length - successful;

      console.log(`Bulk email completed: ${successful} successful, ${failed} failed`);
      return { successful, failed, results };

    } catch (error) {
      console.error('Error sending bulk emails:', error);
      throw new Error(`Failed to send bulk emails: ${error.message}`);
    }
  }

  // Health check for email service
  async healthCheck() {
    try {
      // Simple test to verify Resend API is working
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to: 'test@resend.dev', // Resend's test email
        subject: 'Health Check',
        html: '<p>Health check test</p>'
      });

      return { 
        status: 'healthy', 
        provider: 'Resend',
        testMessageId: result.id 
      };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        provider: 'Resend',
        error: error.message 
      };
    }
  }
}

// ================== SMS SERVICE (services/smsService.js) ==================

const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID, 
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.appName = process.env.APP_NAME || 'Your App';
  }

  // Format phone number to international format
  formatPhoneNumber(phone) {
    // Remove any non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      throw new Error('Phone number must be in international format (+1234567890)');
    }
    
    return cleaned;
  }

  // Send OTP SMS
  async sendOTP(phone, otp, purpose, userInfo = {}) {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      const messages = {
        registration: `${this.appName}: Your verification code is ${otp}. Valid for 5 minutes. Don't share this code.`,
        login: `${this.appName}: Your login code is ${otp}. Valid for 5 minutes. Don't share this code.`,
        '2fa': `${this.appName}: Your 2FA code is ${otp}. Valid for 5 minutes. Don't share this code.`,
        password_reset: `${this.appName}: Your password reset code is ${otp}. Valid for 5 minutes. Don't share this code.`,
        phone_change: `${this.appName}: Your phone verification code is ${otp}. Valid for 5 minutes.`
      };

      const message = messages[purpose] || `${this.appName}: Your verification code is ${otp}. Valid for 5 minutes.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone,
        // Optional: Add status callback URL for delivery tracking
        statusCallback: process.env.TWILIO_STATUS_WEBHOOK
      });

      console.log(`OTP SMS sent to ${formattedPhone} for ${purpose}:`, result.sid);
      
      return { 
        success: true, 
        messageId: result.sid,
        status: result.status,
        to: formattedPhone
      };

    } catch (error) {
      console.error('Error sending OTP SMS:', error);
      
      // Handle specific Twilio errors
      if (error.code === 21211) {
        throw new Error('Invalid phone number format');
      } else if (error.code === 21608) {
        throw new Error('Phone number is not verified with Twilio (trial account)');
      } else if (error.code === 21614) {
        throw new Error('Phone number is not a valid mobile number');
      }
      
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  // Send security alert SMS
  async sendSecurityAlert(phone, alertType, userInfo = {}) {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      const alerts = {
        'suspicious_login': `${this.appName} Security Alert: Suspicious login attempt detected. If this wasn't you, secure your account immediately.`,
        'password_changed': `${this.appName} Security Alert: Your password was changed. If this wasn't you, contact support immediately.`,
        'account_blocked': `${this.appName} Security Alert: Your account has been blocked due to suspicious activity.`,
        'multiple_failed_logins': `${this.appName} Security Alert: Multiple failed login attempts detected.`
      };

      const message = alerts[alertType] || `${this.appName} Security Alert: Important security event on your account.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`Security alert SMS sent to ${formattedPhone}:`, result.sid);
      return { success: true, messageId: result.sid };

    } catch (error) {
      console.error('Error sending security alert SMS:', error);
      // Don't throw error for security alerts to prevent blocking main flow
      return { success: false, error: error.message };
    }
  }

  // Send bulk SMS (for announcements, etc.)
  async sendBulkSMS(recipients, message) {
    try {
      const results = [];
      const batchSize = 100; // Process in batches to avoid rate limits

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        const smsPromises = batch.map(async (recipient) => {
          try {
            const formattedPhone = this.formatPhoneNumber(recipient.phone);
            
            const personalizedMessage = message.replace('{{name}}', recipient.name || 'User');
            
            return await this.client.messages.create({
              body: personalizedMessage,
              from: this.fromNumber,
              to: formattedPhone
            });
          } catch (error) {
            console.error(`Failed to send SMS to ${recipient.phone}:`, error);
            return { error: error.message, phone: recipient.phone };
          }
        });

        const batchResults = await Promise.allSettled(smsPromises);
        results.push(...batchResults);

        // Add delay between batches to respect rate limits
        if (i + batchSize < recipients.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;
      const failed = results.length - successful;

      console.log(`Bulk SMS completed: ${successful} successful, ${failed} failed`);
      return { successful, failed, results };

    } catch (error) {
      console.error('Error sending bulk SMS:', error);
      throw new Error(`Failed to send bulk SMS: ${error.message}`);
    }
  }

  // Get message status
  async getMessageStatus(messageId) {
    try {
      const message = await this.client.messages(messageId).fetch();
      return {
        sid: message.sid,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        dateCreated: message.dateCreated,
        dateUpdated: message.dateUpdated,
        dateSent: message.dateSent,
        price: message.price,
        priceUnit: message.priceUnit
      };
    } catch (error) {
      console.error('Error fetching message status:', error);
      throw new Error(`Failed to get message status: ${error.message}`);
    }
  }

  // Health check for SMS service
  async healthCheck() {
    try {
      // Get account info to verify API credentials
      const account = await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      
      return { 
        status: 'healthy', 
        provider: 'Twilio',
        accountStatus: account.status,
        accountType: account.type
      };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        provider: 'Twilio',
        error: error.message 
      };
    }
  }

  // Validate phone number
  async validatePhoneNumber(phone) {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      const phoneNumber = await this.client.lookups.v1
        .phoneNumbers(formattedPhone)
        .fetch({ type: ['carrier'] });

      return {
        valid: true,
        phoneNumber: phoneNumber.phoneNumber,
        nationalFormat: phoneNumber.nationalFormat,
        countryCode: phoneNumber.countryCode,
        carrier: phoneNumber.carrier
      };
    } catch (error) {
      if (error.code === 20404) {
        return { valid: false, error: 'Phone number not found' };
      }
      throw new Error(`Phone validation failed: ${error.message}`);
    }
  }
}

// ================== GEOLOCATION SERVICE (services/geolocationService.js) ==================

const axios = require('axios');

class GeolocationService {
  constructor() {
    this.apiKey = process.env.IPGEOLOCATION_API_KEY;
    this.baseUrl = 'https://api.ipgeolocation.io/ipgeo';
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Get location from IP address
  async getLocationFromIP(ipAddress) {
    try {
      // Check cache first
      const cacheKey = `location_${ipAddress}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Handle localhost/private IPs
      if (this.isPrivateIP(ipAddress)) {
        const defaultLocation = {
          ip: ipAddress,
          country_name: 'Unknown',
          country_code2: 'XX',
          state_prov: 'Unknown',
          city: 'Unknown',
          latitude: '0',
          longitude: '0',
          timezone: 'UTC',
          isp: 'Unknown',
          isPrivate: true
        };
        
        this.cache.set(cacheKey, {
          data: defaultLocation,
          timestamp: Date.now()
        });
        
        return defaultLocation;
      }

      // Make API request
      const response = await axios.get(this.baseUrl, {
        params: {
          apiKey: this.apiKey,
          ip: ipAddress,
          format: 'json'
        },
        timeout: 5000
      });

      const locationData = {
        ip: response.data.ip,
        country_name: response.data.country_name,
        country_code2: response.data.country_code2,
        state_prov: response.data.state_prov,
        city: response.data.city,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        timezone: response.data.time_zone?.name,
        isp: response.data.isp,
        isPrivate: false
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: locationData,
        timestamp: Date.now()
      });

      return locationData;

    } catch (error) {
      console.error('Error getting location from IP:', error);
      
      // Return basic info on error
      return {
        ip: ipAddress,
        country_name: 'Unknown',
        country_code2: 'XX',
        state_prov: 'Unknown',
        city: 'Unknown',
        latitude: '0',
        longitude: '0',
        timezone: 'UTC',
        isp: 'Unknown',
        error: error.message
      };
    }
  }

  // Check if IP is private/localhost
  isPrivateIP(ip) {
    const privateRanges = [
      /^127\./,  // localhost
      /^10\./,   // 10.x.x.x
      /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.x.x to 172.31.x.x
      /^192\.168\./,  // 192.168.x.x
      /^::1$/,   // IPv6 localhost
      /^fc00:/,  // IPv6 private
      /^fe80:/   // IPv6 link-local
    ];

    return privateRanges.some(range => range.test(ip)) || ip === '::1';
  }

  // Get formatted location string
  getFormattedLocation(locationData) {
    if (!locationData || locationData.isPrivate) {
      return 'Unknown Location';
    }

    const parts = [];
    if (locationData.city && locationData.city !== 'Unknown') parts.push(locationData.city);
    if (locationData.state_prov && locationData.state_prov !== 'Unknown') parts.push(locationData.state_prov);
    if (locationData.country_name && locationData.country_name !== 'Unknown') parts.push(locationData.country_name);

    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  }

  // Check if location is suspicious (different country than usual)
  async checkSuspiciousLocation(ipAddress, userHistory = []) {
    try {
      const currentLocation = await this.getLocationFromIP(ipAddress);
      
      if (userHistory.length === 0 || currentLocation.isPrivate) {
        return { suspicious: false, reason: 'No history or private IP' };
      }

      // Get user's common countries
      const countryHistory = userHistory
        .map(h => h.country_code2)
        .filter(c => c && c !== 'XX');

      if (countryHistory.length === 0) {
        return { suspicious: false, reason: 'No valid location history' };
      }

      const uniqueCountries = [...new Set(countryHistory)];
      const isNewCountry = !uniqueCountries.includes(currentLocation.country_code2);

      // Check if it's a completely new country
      if (isNewCountry && uniqueCountries.length > 0) {
        return {
          suspicious: true,
          reason: 'Login from new country',
          currentLocation: this.getFormattedLocation(currentLocation),
          usualCountries: uniqueCountries
        };
      }

      return { suspicious: false, reason: 'Normal location' };

    } catch (error) {
      console.error('Error checking suspicious location:', error);
      return { suspicious: false, reason: 'Location check failed' };
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp < this.cacheTimeout) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }
}

// ================== BACKGROUND JOBS SERVICE (services/backgroundJobsService.js) ==================

const cron = require('node-cron');
const mongoose = require('mongoose');

class BackgroundJobsService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.jobs = new Map();
  }

  // Initialize all scheduled jobs
  initialize() {
    console.log('🚀 Initializing background jobs...');

    // Clean expired tokens every hour
    this.scheduleJob('cleanExpiredTokens', '0 * * * *', this.cleanExpiredTokens.bind(this));
    
    // Clean expired OTP codes every 5 minutes
    this.scheduleJob('cleanExpiredOTPs', '*/5 * * * *', this.cleanExpiredOTPs.bind(this));
    
    // Clean old audit logs every day at 2 AM
    this.scheduleJob('cleanOldAuditLogs', '0 2 * * *', this.cleanOldAuditLogs.bind(this));
    
    // Generate daily usage reports at 1 AM
    this.scheduleJob('generateDailyReport', '0 1 * * *', this.generateDailyReport.bind(this));
    
    // Clean expired rate limit entries every 30 minutes
    this.scheduleJob('cleanRateLimitEntries', '*/30 * * * *', this.cleanRateLimitEntries.bind(this));
    
    // Send security digest to admins every Monday at 9 AM
    this.scheduleJob('sendSecurityDigest', '0 9 * * 1', this.sendSecurityDigest.bind(this));

    console.log('✅ Background jobs initialized successfully');
  }

  // Schedule a job
  scheduleJob(name, schedule, handler) {
    if (this.jobs.has(name)) {
      console.warn(`Job ${name} already exists, skipping...`);
      return;
    }

    const task = cron.schedule(schedule, async () => {
      console.log(`🔄 Running job: ${name}`);
      const startTime = Date.now();
      
      try {
        await handler();
        const duration = Date.now() - startTime;
        console.log(`✅ Job ${name} completed in ${duration}ms`);
      } catch (error) {
        console.error(`❌ Job ${name} failed:`, error);
      }
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.jobs.set(name, { task, schedule, handler });
    task.start();
    console.log(`📅 Scheduled job: ${name} (${schedule})`);
  }

  // Clean expired access tokens from Redis
  async cleanExpiredTokens() {
    try {
      const keys = await this.redis.keys('access_token:*');
      let cleanedCount = 0;

      for (const key of keys) {
        const data = await this.redis.get(key);
        if (data) {
          const tokenData = JSON.parse(data);
          if (tokenData.expiresAt < Date.now()) {
            await this.redis.del(key);
            cleanedCount++;
          }
        }
      }

      // Clean expired blacklisted tokens
      const blacklistKeys = await this.redis.keys('blacklist:*');
      for (const key of blacklistKeys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -2) { // Key expired
          await this.redis.del(key);
          cleanedCount++;
        }
      }

      console.log(`🧹 Cleaned ${cleanedCount} expired tokens from Redis`);
      return { cleaned: cleanedCount };
    } catch (error) {
      console.error('Error cleaning expired tokens:', error);
      throw error;
    }
  }

  // Clean expired OTP codes
  async cleanExpiredOTPs() {
    try {
      const otpKeys = await this.redis.keys('otp:*');
      let cleanedCount = 0;

      for (const key of otpKeys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -2) { // Key expired
          await this.redis.del(key);
          cleanedCount++;
        }
      }

      console.log(`🧹 Cleaned ${cleanedCount} expired OTP codes from Redis`);
      return { cleaned: cleanedCount };
    } catch (error) {
      console.error('Error cleaning expired OTPs:', error);
      throw error;
    }
  }

  // Clean old audit logs (older than 90 days)
  async cleanOldAuditLogs() {
    try {
      const AuditLog = mongoose.model('AuditLog');
      const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      
      const result = await AuditLog.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      console.log(`🧹 Cleaned ${result.deletedCount} old audit logs`);
      return { cleaned: result.deletedCount };
    } catch (error) {
      console.error('Error cleaning old audit logs:', error);
      throw error;
    }
  }

  // Clean expired rate limit entries
  async cleanRateLimitEntries() {
    try {
      const rateLimitKeys = await this.redis.keys('rate_limit:*');
      let cleanedCount = 0;

      for (const key of rateLimitKeys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -2) { // Key expired
          await this.redis.del(key);
          cleanedCount++;
        }
      }

      console.log(`🧹 Cleaned ${cleanedCount} expired rate limit entries`);
      return { cleaned: cleanedCount };
    } catch (error) {
      console.error('Error cleaning rate limit entries:', error);
      throw error;
    }
  }

  // Generate daily usage report
  async generateDailyReport() {
    try {
      const User = mongoose.model('User');
      const AuditLog = mongoose.model('AuditLog');
      const UserSession = mongoose.model('UserSession');
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Gather statistics
      const stats = {
        date: yesterday.toISOString().split('T')[0],
        newUsers: await User.countDocuments({
          createdAt: { $gte: yesterday, $lt: today }
        }),
        totalUsers: await User.countDocuments({ status: 'active' }),
        loginAttempts: await AuditLog.countDocuments({
          action: { $in: ['LOGIN_SUCCESS', 'LOGIN_FAILED'] },
          timestamp: { $gte: yesterday, $lt: today }
        }),
        successfulLogins: await AuditLog.countDocuments({
          action: 'LOGIN_SUCCESS',
          timestamp: { $gte: yesterday, $lt: today }
        }),
        failedLogins: await AuditLog.countDocuments({
          action: 'LOGIN_FAILED',
          timestamp: { $gte: yesterday, $lt: today }
        }),
        activeSessions: await UserSession.countDocuments({ isActive: true }),
        twoFAVerifications: await AuditLog.countDocuments({
          action: { $in: ['2FA_VERIFY_SUCCESS', '2FA_VERIFY_FAILED'] },
          timestamp: { $gte: yesterday, $lt: today }
        }),
        passwordResets: await AuditLog.countDocuments({
          action: 'PASSWORD_RESET_SUCCESS',
          timestamp: { $gte: yesterday, $lt: today }
        })
      };

      // Store report in Redis for 30 days
      const reportKey = `daily_report:${stats.date}`;
      await this.redis.setex(reportKey, 30 * 24 * 60 * 60, JSON.stringify(stats));

      console.log(`📊 Generated daily report for ${stats.date}:`, stats);
      
      // Optionally send to admin dashboard or external analytics
      await this.sendReportToAdmins(stats);
      
      return stats;
    } catch (error) {
      console.error('Error generating daily report:', error);
      throw error;
    }
  }

  // Send security digest to admins
  async sendSecurityDigest() {
    try {
      const AuditLog = mongoose.model('AuditLog');
      const User = mongoose.model('User');
      
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      // Security events summary
      const securityEvents = await AuditLog.aggregate([
        {
          $match: {
            timestamp: { $gte: lastWeek },
            action: {
              $in: [
                'LOGIN_FAILED',
                'ACCOUNT_BLOCKED',
                '2FA_VERIFY_FAILED',
                'PASSWORD_RESET_REQUEST'
              ]
            }
          }
        },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }
        }
      ]);

      // Blocked users this week
      const blockedUsers = await User.countDocuments({
        status: 'blocked',
        blockedAt: { $gte: lastWeek }
      });

      // Top suspicious IPs
      const suspiciousIPs = await AuditLog.aggregate([
        {
          $match: {
            timestamp: { $gte: lastWeek },
            action: 'LOGIN_FAILED'
          }
        },
        {
          $group: {
            _id: '$ipAddress',
            failedAttempts: { $sum: 1 }
          }
        },
        { $sort: { failedAttempts: -1 } },
        { $limit: 10 }
      ]);

      const digest = {
        period: 'Last 7 days',
        securityEvents: securityEvents.map(event => ({
          event: event._id,
          count: event.count,
          affectedUsers: event.uniqueUsers.length
        })),
        blockedUsers,
        suspiciousIPs: suspiciousIPs.map(ip => ({
          ip: ip._id,
          failedAttempts: ip.failedAttempts
        }))
      };

      console.log('🔒 Security digest generated:', digest);
      
      // Send to admin emails (implement based on your email service)
      // await this.sendDigestToAdmins(digest);
      
      return digest;
    } catch (error) {
      console.error('Error generating security digest:', error);
      throw error;
    }
  }

  // Send report to admins (placeholder)
  async sendReportToAdmins(stats) {
    // Implement based on your notification preferences
    console.log('📨 Sending daily report to admins:', stats.date);
  }

  // Stop a specific job
  stopJob(name) {
    if (this.jobs.has(name)) {
      const job = this.jobs.get(name);
      job.task.stop();
      this.jobs.delete(name);
      console.log(`⏹️ Stopped job: ${name}`);
    }
  }

  // Stop all jobs
  stopAllJobs() {
    for (const [name, job] of this.jobs.entries()) {
      job.task.stop();
    }
    this.jobs.clear();
    console.log('⏹️ All background jobs stopped');
  }

  // Get job status
  getJobStatus() {
    const status = {};
    for (const [name, job] of this.jobs.entries()) {
      status[name] = {
        schedule: job.schedule,
        running: job.task.running
      };
    }
    return status;
  }
}

// ================== LOGGING SERVICE (services/loggingService.js) ==================

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

class LoggingService {
  constructor() {
    this.logger = this.createLogger();
  }

  createLogger() {
    // Custom format
    const customFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          message,
          ...meta
        });
      })
    );

    // Create logger
    const logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: customFormat,
      defaultMeta: { service: 'auth-service' },
      transports: [
        // Error logs
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true
        }),
        
        // Combined logs
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          zippedArchive: true
        }),
        
        // Security logs
        new DailyRotateFile({
          filename: 'logs/security-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'warn',
          maxSize: '20m',
          maxFiles: '90d',
          zippedArchive: true
        })
      ]
    });

    // Add console transport in development
    if (process.env.NODE_ENV !== 'production') {
      logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }));
    }

    return logger;
  }

  // Log authentication events
  logAuth(level, message, metadata = {}) {
    this.logger.log(level, message, {
      category: 'authentication',
      ...metadata
    });
  }

  // Log security events
  logSecurity(level, message, metadata = {}) {
    this.logger.log(level, message, {
      category: 'security',
      ...metadata
    });
  }

  // Log API requests
  logRequest(req, res, responseTime) {
    this.logger.info('API Request', {
      category: 'api',
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?.userId
    });
  }

  // Log errors with context
  logError(error, context = {}) {
    this.logger.error(error.message, {
      category: 'error',
      stack: error.stack,
      ...context
    });
  }

  // Log business metrics
  logMetric(name, value, metadata = {}) {
    this.logger.info('Metric', {
      category: 'metric',
      metricName: name,
      metricValue: value,
      ...metadata
    });
  }

  // Create request logging middleware
  createRequestLogger() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.logRequest(req, res, duration);
      });
      
      next();
    };
  }
}

// ================== NOTIFICATION SERVICE (services/notificationService.js) ==================

class NotificationService {
  constructor(emailService, smsService) {
    this.emailService = emailService;
    this.smsService = smsService;
  }

  // Send multi-channel notification
  async sendNotification(user, type, data = {}) {
    const results = {
      email: null,
      sms: null
    };

    try {
      // Determine notification preferences
      const preferences = await this.getNotificationPreferences(user._id);
      
      // Send email notification
      if (preferences.email && user.email) {
        try {
          results.email = await this.sendEmailNotification(user, type, data);
        } catch (error) {
          console.error('Email notification failed:', error);
          results.email = { success: false, error: error.message };
        }
      }

      // Send SMS notification
      if (preferences.sms && user.phone) {
        try {
          results.sms = await this.sendSMSNotification(user, type, data);
        } catch (error) {
          console.error('SMS notification failed:', error);
          results.sms = { success: false, error: error.message };
        }
      }

      return results;
    } catch (error) {
      console.error('Notification service error:', error);
      return {
        email: { success: false, error: error.message },
        sms: { success: false, error: error.message }
      };
    }
  }

  // Send email notification based on type
  async sendEmailNotification(user, type, data) {
    const userInfo = {
      name: user.name,
      ipAddress: data.ipAddress,
      deviceInfo: data.deviceInfo
    };

    switch (type) {
      case 'welcome':
        return await this.emailService.sendWelcomeEmail(user.email, userInfo);
      
      case 'security_alert':
        return await this.emailService.sendSecurityAlert(
          user.email, 
          data.alertType, 
          data.details, 
          userInfo
        );
      
      case 'password_reset':
        return await this.emailService.sendPasswordReset(
          user.email, 
          data.resetUrl, 
          userInfo
        );
      
      default:
        throw new Error(`Unknown email notification type: ${type}`);
    }
  }

  // Send SMS notification based on type
  async sendSMSNotification(user, type, data) {
    const userInfo = {
      name: user.name,
      ipAddress: data.ipAddress,
      deviceInfo: data.deviceInfo
    };

    switch (type) {
      case 'security_alert':
        return await this.smsService.sendSecurityAlert(
          user.phone, 
          data.alertType, 
          userInfo
        );
      
      default:
        throw new Error(`Unknown SMS notification type: ${type}`);
    }
  }

  // Get user notification preferences (implement based on your user schema)
  async getNotificationPreferences(userId) {
    // Default preferences - customize based on your requirements
    return {
      email: true,
      sms: true
    };
  }

  // Bulk notification sending
  async sendBulkNotification(users, type, data = {}) {
    const results = [];
    const batchSize = 50;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (user) => {
        try {
          return await this.sendNotification(user, type, data);
        } catch (error) {
          return {
            userId: user._id,
            error: error.message,
            success: false
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);

      // Small delay between batches
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}

// ================== ANALYTICS SERVICE (services/analyticsService.js) ==================

class AnalyticsService {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  // Track user event
  async trackEvent(eventName, userId, metadata = {}) {
    try {
      const event = {
        eventName,
        userId,
        metadata,
        timestamp: Date.now()
      };

      // Store in daily bucket
      const date = new Date().toISOString().split('T')[0];
      const key = `analytics:events:${date}`;
      
      await this.redis.lpush(key, JSON.stringify(event));
      await this.redis.expire(key, 90 * 24 * 60 * 60); // 90 days

      // Update counters
      await this.updateCounters(eventName, date);
      
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Update event counters
  async updateCounters(eventName, date) {
    try {
      // Daily counter
      const dailyKey = `analytics:counters:daily:${date}`;
      await this.redis.hincrby(dailyKey, eventName, 1);
      await this.redis.expire(dailyKey, 90 * 24 * 60 * 60);

      // Monthly counter
      const monthKey = `analytics:counters:monthly:${date.substring(0, 7)}`;
      await this.redis.hincrby(monthKey, eventName, 1);
      await this.redis.expire(monthKey, 365 * 24 * 60 * 60);

    } catch (error) {
      console.error('Error updating counters:', error);
    }
  }

  // Get event statistics
  async getEventStats(eventName, period = 'daily', days = 7) {
    try {
      const stats = [];
      const now = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        let key;
        if (period === 'daily') {
          key = `analytics:counters:daily:${dateStr}`;
        } else if (period === 'monthly') {
          key = `analytics:counters:monthly:${dateStr.substring(0, 7)}`;
        }

        const count = await this.redis.hget(key, eventName) || 0;
        stats.unshift({
          date: dateStr,
          count: parseInt(count)
        });
      }

      return stats;
    } catch (error) {
      console.error('Error getting event stats:', error);
      return [];
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const todayKey = `analytics:counters:daily:${today}`;
      const yesterdayKey = `analytics:counters:daily:${yesterday}`;

      const [todayMetrics, yesterdayMetrics] = await Promise.all([
        this.redis.hgetall(todayKey),
        this.redis.hgetall(yesterdayKey)
      ]);

      const metrics = {};
      const events = ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'REGISTER', '2FA_VERIFY_SUCCESS'];

      for (const event of events) {
        const todayCount = parseInt(todayMetrics[event] || 0);
        const yesterdayCount = parseInt(yesterdayMetrics[event] || 0);
        
        metrics[event] = {
          today: todayCount,
          yesterday: yesterdayCount,
          change: yesterdayCount > 0 ? ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(1) : 0
        };
      }

      return metrics;
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      return {};
    }
  }

  // Track user session duration
  async trackSessionDuration(userId, duration) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const key = `analytics:sessions:${date}`;
      
      await this.redis.lpush(key, JSON.stringify({
        userId,
        duration,
        timestamp: Date.now()
      }));
      
      await this.redis.expire(key, 90 * 24 * 60 * 60);
    } catch (error) {
      console.error('Error tracking session duration:', error);
    }
  }

  // Get average session duration
  async getAverageSessionDuration(days = 7) {
    try {
      let totalDuration = 0;
      let totalSessions = 0;

      for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const key = `analytics:sessions:${date}`;
        
        const sessions = await this.redis.lrange(key, 0, -1);
        
        for (const sessionStr of sessions) {
          const session = JSON.parse(sessionStr);
          totalDuration += session.duration;
          totalSessions++;
        }
      }

      return totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
    } catch (error) {
      console.error('Error getting average session duration:', error);
      return 0;
    }
  }
}

// ================== EXPORTS ==================

module.exports = {
  EmailService: new EmailService(),
  SMSService: new SMSService(),
  GeolocationService: new GeolocationService(),
  BackgroundJobsService,
  LoggingService: new LoggingService(),
  NotificationService,
  AnalyticsService
};


// Initialize services
const backgroundJobs = new BackgroundJobsService(redisClient);
backgroundJobs.initialize();

const notificationService = new NotificationService(EmailService, SMSService);

// Send security alert
await notificationService.sendNotification(user, 'security_alert', {
  alertType: 'suspicious_login',
  ipAddress: req.ip,
  deviceInfo: deviceInfo
});