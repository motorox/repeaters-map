# Integration Guide - Repeaters Map

This guide explains how to integrate the Repeaters Map into your website.

## Quick Start

### Option 1: Standalone HTML Page
Use `osm.html` or `all-in-one-page.html` for a complete standalone map.

### Option 2: Embedded Script (WordPress, etc.)

The easiest way to add the map to your site is using the embed script.

#### Installation

Add this single line to your page or WordPress theme:

```html
<script src="https://motorox.github.io/repeaters-map/embed.js"></script>
```

#### Add a Container

Add this div where you want the map to appear:

```html
<div class="repeaters-map" data-width="100%" data-height="600px"></div>
```

#### Customization

- `data-width`: Set the map width (default: "100%")
- `data-height`: Set the map height (default: "600px")

**Example:**
```html
<div class="repeaters-map" data-width="800px" data-height="500px"></div>
```

#### WordPress Integration

1. **In Page/Post Editor (Visual):** Add a Custom HTML block
2. **Paste this code:**
   ```html
   <div class="repeaters-map" data-width="100%" data-height="600px"></div>
   <script src="https://motorox.github.io/repeaters-map/embed.js"></script>
   ```
3. **Publish the page**

#### WordPress Plugin Installation

Add to your theme's `functions.php` or a custom plugin:

```php
<?php
function add_repeaters_map_script() {
    if ( is_page( array( 'repeaters', 'radio-map' ) ) ) { // Replace with your page slug
        wp_enqueue_script( 'repeaters-map', 'https://motorox.github.io/repeaters-map/embed.js', array(), '1.0.0', true );
    }
}
add_action( 'wp_enqueue_scripts', 'add_repeaters_map_script' );
```

### Option 3: Iframe Embed

Embed the standalone map in an iframe:

```html
<iframe 
  src="https://motorox.github.io/repeaters-map/embed.html" 
  width="100%" 
  height="600px" 
  frameborder="0"
  style="border-radius: 8px; border: 1px solid #ddd;">
</iframe>
```

## Customization

### Configuration

All map settings are in `src/config.js`:

```javascript
REPEATERS_CONFIG = {
  map: {
    defaultCenter: [45.7538, 21.2257],  // Latitude, Longitude
    defaultZoom: 6,
    minZoom: 2,
    maxZoom: 18,
  },
  
  // ... more options
}
```

### Manual Initialization

If you need more control, load the script with `data-no-auto-init`:

```html
<div id="my-map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.5.1/dist/leaflet.markercluster.js"></script>
<script src="../lib/qth-locator.js"></script>
<script src="../src/config.js"></script>
<script src="../src/icon-factory.js"></script>
<script src="../src/api-manager.js"></script>
<script src="../src/repeaters-map.js" data-no-auto-init></script>
<script>
  initializeRepeaterMap('my-map');
</script>
```

## Features

✅ **No jQuery** - Uses modern Fetch API  
✅ **Error Handling** - Graceful degradation if APIs fail  
✅ **Geocoding Queue** - Prevents API flooding  
✅ **Marker Clustering** - Better performance with many markers  
✅ **Responsive** - Works on mobile and desktop  
✅ **Latest Libraries** - Leaflet 1.9.4, MarkerCluster 1.5.1  
✅ **Data Timestamp** - Shows when data was last updated  

## Troubleshooting

### Map doesn't appear

1. Check browser console for errors (F12)
2. Ensure the container div exists
3. Check that the embed script loaded successfully
4. Clear browser cache and reload

### Markers not showing

1. Check that data files loaded (Network tab in DevTools)
2. Verify data source APIs are accessible
3. Check browser console for warnings

### Performance issues

1. Disable auto-refresh in `config.js`
2. Reduce max cluster radius
3. Check network speed (DevTools Network tab)

## API Data Sources

The map loads repeater data from:

- **YO**: https://raw.githubusercontent.com/yo6nam/yodb/main/all.json
- **HA**: Local markers file (maps/markers-HA.js)
- **S5**: Local markers file (maps/markers-S5.js)
- **YT**: Local markers file (maps/markers-YT.js)

## Browser Support

- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- Mobile browsers (iOS Safari 12+, Chrome Android)

## License

See LICENSE file in repository

## Support

For issues or questions, open an issue on GitHub:
https://github.com/motorox/repeaters-map/issues
