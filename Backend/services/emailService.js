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

export {
      EmailService: new EmailService(),
}