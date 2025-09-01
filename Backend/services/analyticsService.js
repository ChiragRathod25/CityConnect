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

export{
    AnalyticsService
}