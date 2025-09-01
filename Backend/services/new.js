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