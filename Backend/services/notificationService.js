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



const notificationService = new NotificationService(EmailService, SMSService);

// Send security alert
await notificationService.sendNotification(user, 'security_alert', {
  alertType: 'suspicious_login',
  ipAddress: req.ip,
  deviceInfo: deviceInfo
});

export {
    NotificationService
}