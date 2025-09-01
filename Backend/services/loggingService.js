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

export{
    LoggingService: new LoggingService(),
}