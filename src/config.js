/**
 * Configuration file for Repeaters Map
 * Centralized settings for easy customization
 */
const REPEATERS_CONFIG = {
  // Map settings
  map: {
    defaultCenter: [45.7538, 21.2257], // Timisoara
    defaultZoom: 6,
    minZoom: 2,
    maxZoom: 18,
  },

  // Tile layer settings
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
  },

  // Marker clustering
  clustering: {
    enabled: true,
    showCoverageOnHover: false,
    maxClusterRadius: 10,
  },

  // Icon configuration - defines marker colors and their properties
  icons: {
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    red: {
      name: 'Inactive',
      iconSize: [16, 26],
      iconAnchor: [8, 26],
      popupAnchor: [-1, -22],
      shadowSize: [26, 26],
    },
    blue: {
      name: 'FM/C4FM',
      iconSize: [16, 26],
      iconAnchor: [8, 26],
      popupAnchor: [-1, -22],
      shadowSize: [26, 26],
    },
    green: {
      name: 'D-STAR',
      iconSize: [16, 26],
      iconAnchor: [8, 26],
      popupAnchor: [-1, -22],
      shadowSize: [26, 26],
    },
    grey: {
      name: 'Tetra',
      iconSize: [16, 26],
      iconAnchor: [8, 26],
      popupAnchor: [-1, -22],
      shadowSize: [26, 26],
    },
    orange: {
      name: 'DMR',
      iconSize: [16, 26],
      iconAnchor: [8, 26],
      popupAnchor: [-1, -22],
      shadowSize: [26, 26],
    },
  },

  // Data sources
  dataSources: [
    {
      name: 'YO-repeaters',
      type: 'json',
      url: 'https://raw.githubusercontent.com/yo6nam/yodb/main/all.json',
      mapFunction: 'mapYOFunc',
      enabled: true,
    },
    {
      name: 'HA-repeaters',
      type: 'js',
      url: null, // Loaded via external scripts
      mapFunction: 'mapHuFunc',
      enabled: true,
    },
    {
      name: 'S5-repeaters',
      type: 'js',
      url: null,
      mapFunction: 'mapSiFunc',
      enabled: true,
    },
    {
      name: 'YT-repeaters',
      type: 'js',
      url: null,
      mapFunction: 'mapYTFunc',
      enabled: true,
    },
  ],

  // Geocoding API settings
  geocoding: {
    enabled: true,
    apiUrl: 'https://nominatim.openstreetmap.org/search',
    timeout: 5000,
    retryAttempts: 3,
    retryDelay: 1000, // milliseconds
  },

  // UI settings
  ui: {
    showDataTimestamp: true,
    autoRefreshInterval: 0, // 0 = disabled, set to milliseconds to enable
  },
};

// Last updated timestamp (updated programmatically)
REPEATERS_CONFIG.lastUpdated = new Date().toISOString();
