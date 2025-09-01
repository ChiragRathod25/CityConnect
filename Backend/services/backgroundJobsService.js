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

export {
    BackgroundJobsService
}

// Initialize services
const backgroundJobs = new BackgroundJobsService(redisClient);
backgroundJobs.initialize();