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

export {
    GeolocationService: new GeolocationService(),
}