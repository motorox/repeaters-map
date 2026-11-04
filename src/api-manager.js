/**
 * API utility with error handling and retry logic
 */
class APIManager {
  constructor(config = {}) {
    this.config = config;
    this.queue = [];
    this.isProcessing = false;
  }

  /**
   * Fetch JSON with error handling
   * @param {string} url - URL to fetch
   * @param {object} options - Fetch options
   * @returns {Promise} Response data
   */
  async fetchJSON(url, options = {}) {
    const maxRetries = this.config.geocoding?.retryAttempts || 3;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1}/${maxRetries} failed for ${url}:`, error.message);

        if (attempt < maxRetries - 1) {
          const delay = (this.config.geocoding?.retryDelay || 1000) * (attempt + 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`Failed to fetch ${url} after ${maxRetries} attempts:`, lastError);
    throw lastError;
  }

  /**
   * Queue-based geocoding to prevent API flooding
   * @param {string} address - Address to geocode
   * @param {object} marker - Leaflet marker object
   * @returns {Promise} Geocoding result
   */
  queueGeocode(address, marker) {
    return new Promise((resolve, reject) => {
      this.queue.push({ address, marker, resolve, reject });
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process geocoding queue
   */
  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift();

    try {
      const result = await this.geocode(item.address);
      if (result.features && result.features.length > 0) {
        const [lon, lat] = result.features[0].geometry.coordinates;
        item.marker.setLatLng([lat, lon]);
      }
      item.resolve(result);
    } catch (error) {
      console.error(`Geocoding failed for "${item.address}":`, error);
      item.reject(error);
    }

    // Continue processing queue
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 500);
    } else {
      this.isProcessing = false;
    }
  }

  /**
   * Geocode address using Nominatim
   * @param {string} address - Address to geocode
   * @returns {Promise} Geocoding result
   */
  geocode(address) {
    const apiUrl = REPEATERS_CONFIG.geocoding?.apiUrl || 'https://nominatim.openstreetmap.org/search';
    const url = `${apiUrl}?format=geojson&limit=5&city=${encodeURIComponent(address)}`;

    return this.fetchJSON(url);
  }
}
