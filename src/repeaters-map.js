/**
 * Repeaters Map - Modern implementation without jQuery
 * Uses Fetch API and vanilla JavaScript
 */

// Global instances
let map;
let iconFactory;
let apiManager;
let lastDataUpdateTime;

/**
 * Initialize the map
 */
function initializeMap(mapElementId = 'map') {
  // Initialize map with config
  map = L.map(mapElementId, {
    center: REPEATERS_CONFIG.map.defaultCenter,
    minZoom: REPEATERS_CONFIG.map.minZoom,
    zoom: REPEATERS_CONFIG.map.defaultZoom,
  });

  // Add tile layer
  L.tileLayer(REPEATERS_CONFIG.tileLayer.url, {
    attribution: REPEATERS_CONFIG.tileLayer.attribution,
    subdomains: REPEATERS_CONFIG.tileLayer.subdomains,
  }).addTo(map);

  // Initialize utilities
  iconFactory = new IconFactory(REPEATERS_CONFIG);
  apiManager = new APIManager(REPEATERS_CONFIG);

  console.log('Map initialized successfully');
}

/**
 * Load all repeater data
 */
async function loadAllRepeaters() {
  try {
    const allRepeaters = {};
    const promises = [];

    // Load YO repeaters from JSON API
    promises.push(
      loadYORepeaters()
        .then(repeaters => {
          Object.assign(allRepeaters, repeaters);
        })
        .catch(error => {
          console.error('Failed to load YO repeaters:', error);
          showNotification('Failed to load YO repeaters', 'error');
        })
    );

    // Load HA repeaters
    if (typeof fm_markers_hu !== 'undefined') {
      promises.push(
        placeLocatorMarkers('HA-repeaters', mapHuFunc, fm_markers_hu, dmr_markers_hu, dstar_markers_hu, c4fm_marker_hu)
          .then(repeaters => {
            Object.assign(allRepeaters, repeaters);
          })
          .catch(error => {
            console.error('Failed to load HA repeaters:', error);
            showNotification('Failed to load HA repeaters', 'error');
          })
      );
    }

    // Load S5 repeaters
    if (typeof markers_2m_fm_s5 !== 'undefined') {
      promises.push(
        placeLocatorMarkers('S5-repeaters', mapSiFunc, markers_2m_fm_s5, markers_70cm_fm_s5, markers_ecolink_s5)
          .then(repeaters => {
            Object.assign(allRepeaters, repeaters);
          })
          .catch(error => {
            console.error('Failed to load S5 repeaters:', error);
            showNotification('Failed to load S5 repeaters', 'error');
          })
      );
    }

    // Load YT repeaters
    if (typeof markers_YT !== 'undefined') {
      promises.push(
        placeLocatorMarkers('YT-repeaters', mapYTFunc, markers_YT)
          .then(repeaters => {
            Object.assign(allRepeaters, repeaters);
          })
          .catch(error => {
            console.error('Failed to load YT repeaters:', error);
            showNotification('Failed to load YT repeaters', 'error');
          })
      );
    }

    // Wait for all data sources
    await Promise.all(promises);

    // Add layers to map
    addLayersToMap(allRepeaters);
    updateDataTimestamp();
    showNotification('Repeaters data loaded successfully', 'success');
  } catch (error) {
    console.error('Error loading repeaters:', error);
    showNotification('Failed to load repeaters data', 'error');
  }
}

/**
 * Load YO repeaters from JSON API with error handling
 */
async function loadYORepeaters() {
  const repeaters = {};

  try {
    const data = await apiManager.fetchJSON('https://raw.githubusercontent.com/yo6nam/yodb/main/all.json');

    const repeaterGroup = await placeLocatorMarkers('YO-repeaters', mapYOFunc, Object.values(data.nodes || {}));
    Object.assign(repeaters, repeaterGroup);

    console.log('YO repeaters loaded:', Object.keys(repeaters).length, 'groups');
    return repeaters;
  } catch (error) {
    console.error('Failed to load YO repeaters:', error);
    throw error;
  }
}

/**
 * Create popup content
 */
function makeYOPopup(node) {
  let popup = `<div><b><i>${node.banda || ''}</i></b><br><b>${node.name || ''}</b><br><div>${node.description || ''}</div><ul style="padding-left: 8px;font-size: smaller;">`;

  for (const [k, v] of Object.entries(node)) {
    const excludeFields = ['name', 'k_id', 'banda', 'description', 'nameA', 'online', 'pl_in', 'pl_out', 'lat', 'lon', 'overlay', 'functional'];
    if (!excludeFields.includes(k) && v) {
      popup += `<li><b>${k}</b>: ${v}</li>`;
    }
  }

  popup += '</ul></div>';
  return popup;
}

/**
 * Map function for YO repeaters
 */
function mapYOFunc(val, overlay, repeaters) {
  let selectedIcon = iconFactory.getIcon('blue');
  if (val.overlay === 'dstar') selectedIcon = iconFactory.getIcon('green');
  if (val.overlay === 'tetra') selectedIcon = iconFactory.getIcon('grey');
  if (val.overlay?.includes('dmr')) selectedIcon = iconFactory.getIcon('orange');
  if (val.functional === 'inactiv') selectedIcon = iconFactory.getIcon('red');

  const marker = L.marker([val.lat, val.lon], { icon: selectedIcon }).bindPopup(makeYOPopup(val));
  repeaters[overlay].addLayer(marker);
}

/**
 * Map function for Hungarian repeaters
 */
function mapHuFunc(val, overlay, repeaters) {
  if (val['QTH Locator']) {
    try {
      const [lat, lon] = locatorToLatLng(val['QTH Locator']);
      let selectedIcon = iconFactory.getIcon('blue');
      if (val.Mode?.toLowerCase().includes('dstar')) selectedIcon = iconFactory.getIcon('green');
      if (val.Mode?.toLowerCase().includes('tetra')) selectedIcon = iconFactory.getIcon('grey');
      if (val.Mode?.toLowerCase().includes('dmr')) selectedIcon = iconFactory.getIcon('orange');
      if (val.State === 'inactive') selectedIcon = iconFactory.getIcon('red');

      const marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopupHu(val));
      repeaters[overlay].addLayer(marker);
    } catch (error) {
      console.warn('Error processing Hungarian repeater:', val, error);
    }
  }
}

/**
 * Create popup for Hungarian repeaters
 */
function makePopupHu(node) {
  let popup = `<div><b><i>${node.Callsign || ''}</i></b><br><b>${node['QTH/Name'] || ''}</b><br><ul style="padding-left: 8px;font-size: smaller;">`;

  const excludeFields = ['Callsign', 'QTH/Name', 'banda', 'description', 'nameA', 'overlay', 'online', 'pl_in', 'pl_out', 'QTH Locator'];
  for (const [k, v] of Object.entries(node)) {
    if (!excludeFields.includes(k) && v) {
      popup += `<li><b>${k}</b>: ${v}</li>`;
    }
  }

  popup += '</ul></div>';
  return popup;
}

/**
 * Map function for Slovenian repeaters
 */
function mapSiFunc(val, overlay, repeaters) {
  if (val.LOC) {
    try {
      const [lat, lon] = locatorToLatLng(val.LOC);
      const selectedIcon = iconFactory.getIcon('blue');
      const marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopupSi(val));
      repeaters[overlay].addLayer(marker);
    } catch (error) {
      console.warn('Error processing Slovenian repeater:', val, error);
    }
  }
}

/**
 * Create popup for Slovenian repeaters
 */
function makePopupSi(node) {
  let popup = `<div><b><i>${node.ID || ''}</i></b><br><b>${node.QTH || ''}</b><br><ul style="padding-left: 8px;font-size: smaller;">`;

  const excludeFields = ['Callsign', 'QTH/Name', 'banda', 'description', 'nameA', 'overlay', 'online', 'pl_in', 'pl_out', 'ID', 'QTH', 'LOC'];
  for (const [k, v] of Object.entries(node)) {
    if (!excludeFields.includes(k) && v) {
      popup += `<li><b>${k}</b>: ${v}</li>`;
    }
  }

  popup += '</ul></div>';
  return popup;
}

/**
 * Map function for Yugoslav/Serbian repeaters
 */
function mapYTFunc(val, overlay, repeaters) {
  let selectedIcon = iconFactory.getIcon('blue');
  let [lon, lat] = [20.457, 44.787]; // Default to Belgrade

  if (val.Modes?.toLowerCase().includes('dstar')) selectedIcon = iconFactory.getIcon('green');
  if (val.Modes?.toLowerCase().includes('tetra')) selectedIcon = iconFactory.getIcon('grey');
  if (val.Modes?.toLowerCase().includes('dmr')) selectedIcon = iconFactory.getIcon('orange');
  if (val.State === 'inactive') selectedIcon = iconFactory.getIcon('red');

  const marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopupYt(val));
  repeaters[overlay].addLayer(marker);

  // Attempt geocoding asynchronously
  if (val.Location) {
    apiManager.queueGeocode(val.Location, marker).catch(error => {
      console.warn('Geocoding failed for location:', val.Location, error);
    });
  }
}

/**
 * Create popup for Yugoslav repeaters
 */
function makePopupYt(node) {
  let popup = `<div><b><i>${node.Call || ''}</i></b><br><b>${node.Location || ''}</b><br><ul style="padding-left: 8px;font-size: smaller;">`;

  const excludeFields = ['Call', 'Location', 'FIELD8'];
  for (const [k, v] of Object.entries(node)) {
    if (!excludeFields.includes(k) && v) {
      popup += `<li><b>${k}</b>: ${v}</li>`;
    }
  }

  popup += '</ul></div>';
  return popup;
}

/**
 * Create marker clusters and add to map
 */
function placeLocatorMarkers(overlay, mapFunc, ...data) {
  return new Promise((resolve, reject) => {
    try {
      const repeaters = {};
      repeaters[overlay] = L.markerClusterGroup({
        showCoverageOnHover: REPEATERS_CONFIG.clustering.showCoverageOnHover,
        maxClusterRadius: REPEATERS_CONFIG.clustering.maxClusterRadius,
        iconCreateFunction: function (cluster) {
          return new L.DivIcon({
            html: `<b>${cluster.getChildCount()}</b>`,
            className: 'marker-cluster',
          });
        },
      });

      data.forEach(dataArray => {
        if (Array.isArray(dataArray)) {
          dataArray.forEach(el => mapFunc(el, overlay, repeaters));
        }
      });

      resolve(repeaters);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Add all layers to map
 */
function addLayersToMap(repeaters) {
  const baseLayers = {};
  const overlayLayers = {};

  for (const [key, val] of Object.entries(repeaters)) {
    map.addLayer(val);
    overlayLayers[key] = val;
  }

  L.control.layers(baseLayers, overlayLayers, { collapsed: false }).addTo(map);
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
  const notificationDiv = document.getElementById('notification');
  if (notificationDiv) {
    notificationDiv.textContent = message;
    notificationDiv.className = `notification notification-${type}`;
    notificationDiv.style.display = 'block';

    setTimeout(() => {
      notificationDiv.style.display = 'none';
    }, 5000);
  }
}

/**
 * Update data timestamp in UI
 */
function updateDataTimestamp() {
  lastDataUpdateTime = new Date();
  const timestampDiv = document.getElementById('data-timestamp');
  if (timestampDiv && REPEATERS_CONFIG.ui.showDataTimestamp) {
    timestampDiv.textContent = `Last updated: ${lastDataUpdateTime.toLocaleString()}`;
  }
}

/**
 * Auto-refresh data at configured interval
 */
function enableAutoRefresh() {
  const interval = REPEATERS_CONFIG.ui.autoRefreshInterval;
  if (interval > 0) {
    setInterval(() => {
      console.log('Auto-refreshing repeater data...');
      loadAllRepeaters();
    }, interval);
  }
}

/**
 * Initialize on DOM ready
 */
function initializeRepeaterMap(mapElementId = 'map') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeMap(mapElementId);
      loadAllRepeaters();
      enableAutoRefresh();
    });
  } else {
    initializeMap(mapElementId);
    loadAllRepeaters();
    enableAutoRefresh();
  }
}

// Auto-initialize if this script is loaded directly
if (document.currentScript && !document.currentScript.hasAttribute('data-no-auto-init')) {
  initializeRepeaterMap();
}
