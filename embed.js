/**
 * Repeaters Map - Embeddable Script for WordPress and other sites
 * 
 * Usage:
 * 1. Add this script to your site:
 *    <script src="https://motorox.github.io/repeaters-map/embed.js"></script>
 * 
 * 2. Add a container element:
 *    <div class="repeaters-map" data-width="100%" data-height="600px"></div>
 * 
 * 3. The map will automatically initialize in the container
 */

(function () {
  'use strict';

  const REPEATERS_MAP_CONFIG = {
    baseUrl: 'https://motorox.github.io/repeaters-map',
    cssFiles: [
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      'https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.css',
      'https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.Default.css',
    ],
    jsFiles: [
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
      'https://unpkg.com/leaflet.markercluster@1.5.1/dist/leaflet.markercluster.js',
    ],
  };

  /**
   * Load CSS file
   */
  function loadCSS(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
      document.head.appendChild(link);
    });
  }

  /**
   * Load JavaScript file
   */
  function loadJS(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load JS: ${url}`));
      document.body.appendChild(script);
    });
  }

  /**
   * Initialize all map containers on the page
   */
  async function initializeAllMaps() {
    const containers = document.querySelectorAll('.repeaters-map');

    if (containers.length === 0) {
      console.warn('No .repeaters-map containers found on page');
      return;
    }

    try {
      // Load all CSS files
      console.log('Loading Repeaters Map stylesheets...');
      await Promise.all(REPEATERS_MAP_CONFIG.cssFiles.map(loadCSS));

      // Load all JS libraries
      console.log('Loading Repeaters Map scripts...');
      await Promise.all(REPEATERS_MAP_CONFIG.jsFiles.map(loadJS));

      // Wait for Leaflet to be available
      await waitForLibrary('L');

      // Load our configuration and utilities
      await loadJS(`${REPEATERS_MAP_CONFIG.baseUrl}/src/config.js`);
      await loadJS(`${REPEATERS_MAP_CONFIG.baseUrl}/src/icon-factory.js`);
      await loadJS(`${REPEATERS_MAP_CONFIG.baseUrl}/src/api-manager.js`);
      await loadJS(`${REPEATERS_MAP_CONFIG.baseUrl}/src/repeaters-map.js`);

      // Load data files
      await loadJS(`${REPEATERS_MAP_CONFIG.baseUrl}/maps/markers-HA.js`);
      await loadJS(`${REPEATERS_MAP_CONFIG.baseUrl}/maps/markers-YT.js`);
      await loadJS(`${REPEATERS_MAP_CONFIG.baseUrl}/maps/markers-S5.js`);

      // Wait for qth-locator to be available
      await waitForLibrary('locatorToLatLng');

      // Initialize each container
      containers.forEach((container, index) => {
        const mapId = `repeaters-map-${index}`;
        const width = container.getAttribute('data-width') || '100%';
        const height = container.getAttribute('data-height') || '600px';

        container.id = mapId;
        container.style.width = width;
        container.style.height = height;
        container.style.border = 'none';

        console.log(`Initializing map in container: ${mapId}`);
        initializeRepeaterMap(mapId);
      });

      console.log('Repeaters Map initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Repeaters Map:', error);
      containers.forEach(container => {
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: #d32f2f; font-family: sans-serif;">Failed to load map. Please try refreshing the page.</div>`;
      });
    }
  }

  /**
   * Wait for a library to be available globally
   */
  function waitForLibrary(libraryName, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (window[libraryName]) {
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(new Error(`Timeout waiting for library: ${libraryName}`));
        }
      }, 100);
    });
  }

  /**
   * Start initialization when DOM is ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllMaps);
  } else {
    initializeAllMaps();
  }

  // Expose initialization function globally
  window.RepeatersMaps = {
    init: initializeAllMaps,
    loadCSS: loadCSS,
    loadJS: loadJS,
  };
})();
