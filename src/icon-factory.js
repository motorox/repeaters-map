/**
 * Icon factory utility
 * Creates marker icons with consistent styling
 */
class IconFactory {
  constructor(config = {}) {
    this.config = config;
    this.icons = {};
    this.initializeIcons();
  }

  /**
   * Initialize all icon variants
   */
  initializeIcons() {
    const colors = ['red', 'blue', 'green', 'grey', 'orange'];
    const baseUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img';

    colors.forEach(color => {
      this.icons[color] = this.createIcon(color, baseUrl);
    });
  }

  /**
   * Create a single icon
   * @param {string} color - Color name (red, blue, green, grey, orange)
   * @param {string} baseUrl - Base URL for icon images
   * @returns {L.Icon} Leaflet icon object
   */
  createIcon(color, baseUrl) {
    const iconConfig = this.config.icons?.[color] || {
      iconSize: [16, 26],
      iconAnchor: [8, 26],
      popupAnchor: [-1, -22],
      shadowSize: [26, 26],
    };

    return new L.Icon({
      iconUrl: `${baseUrl}/marker-icon-${color}.png`,
      shadowUrl: this.config.icons?.shadowUrl,
      iconSize: iconConfig.iconSize,
      iconAnchor: iconConfig.iconAnchor,
      popupAnchor: iconConfig.popupAnchor,
      shadowSize: iconConfig.shadowSize,
    });
  }

  /**
   * Get icon by color
   * @param {string} color - Color name
   * @returns {L.Icon} Leaflet icon object
   */
  getIcon(color) {
    return this.icons[color] || this.icons.blue;
  }

  /**
   * Get all icons
   * @returns {object} Map of all icons
   */
  getAllIcons() {
    return this.icons;
  }
}
