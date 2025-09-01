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

export {
     SMSService: new SMSService(),
}