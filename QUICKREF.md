# Quick Reference - Repeaters Map

## Installation Cheatsheet

### 🚀 Fastest (1 line)
```html
<div class="repeaters-map" data-height="600px"></div>
<script src="https://motorox.github.io/repeaters-map/embed.js"></script>
```

### 📱 WordPress
1. Edit Page → Add Custom HTML block
2. Paste the above code
3. Publish

### 🌐 Drupal
```php
// In theme template
echo '<div class="repeaters-map" data-height="600px"></div>';
wp_enqueue_script('repeaters-map', 'https://motorox.github.io/repeaters-map/embed.js');
```

### 🔗 Iframe (Any Site)
```html
<iframe src="https://motorox.github.io/repeaters-map/embed.html" 
  width="100%" height="600px"></iframe>
```

### 🎨 Custom Sizes
```html
<!-- Square map -->
<div class="repeaters-map" data-width="500px" data-height="500px"></div>

<!-- Full width, half height -->
<div class="repeaters-map" data-width="100%" data-height="400px"></div>

<!-- Mobile optimized -->
<div class="repeaters-map" data-width="100%" data-height="300px"></div>
```

## Configuration

Edit `src/config.js` to customize:

```javascript
// Change default location
map: {
  defaultCenter: [latitude, longitude],  // [51.5, 0] for London
  defaultZoom: 6,
}

// Enable auto-refresh (milliseconds)
ui: {
  autoRefreshInterval: 3600000,  // Update every hour
}

// Adjust clustering
clustering: {
  maxClusterRadius: 10,  // Smaller = more clusters
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Map doesn't show | Check browser console (F12) for errors |
| Markers missing | Verify data APIs are accessible (Network tab) |
| Slow performance | Increase `maxClusterRadius` in config.js |
| HTTPS warning | Use latest version (v2.0+) |

## Key URLs

- **Live Demo**: https://motorox.github.io/repeaters-map/osm.html
- **Embed Code**: https://motorox.github.io/repeaters-map/embed.js
- **Full Docs**: https://motorox.github.io/repeaters-map/INTEGRATION.md
- **GitHub Repo**: https://github.com/motorox/repeaters-map

## Data Sources

| Region | Data URL |
|--------|----------|
| YO (Romania) | github.com/yo6nam/yodb |
| HA (Hungary) | RepeaterBook, FrequencyBook |
| S5 (Slovenia) | Local database |
| YT (Serbia) | Local database |

## Browser Support

✅ Chrome/Edge 60+  
✅ Firefox 55+  
✅ Safari 12+  
✅ Mobile (iOS 12+, Android)

## Performance

- **Load Time**: ~2-3 seconds (including map tiles)
- **Markers**: 1000+
- **File Size**: ~12KB (minified, no jQuery)
- **Memory**: ~20MB typical

## Features Checklist

- ✅ Interactive map with zoom/pan
- ✅ Color-coded repeater markers
- ✅ Smart marker clustering
- ✅ Responsive mobile design
- ✅ Error handling & fallbacks
- ✅ Data update timestamps
- ✅ Multi-language support ready
- ✅ No jQuery dependency
- ✅ HTTPS everywhere
- ✅ Easy customization

## API Limits

- **OpenStreetMap Tiles**: ~30,000 requests/day per IP
- **Nominatim Geocoding**: ~1 request/second
- **YO Database**: GitHub rate limits apply

## Getting Help

1. **Check FAQ**: https://motorox.github.io/repeaters-map/#faq
2. **Read Docs**: https://motorox.github.io/repeaters-map/INTEGRATION.md
3. **GitHub Issues**: https://github.com/motorox/repeaters-map/issues
4. **Browser Console**: Press F12 for error messages

## Version History

- **v2.0** (2024) - Complete modernization, no jQuery, better error handling
- **v1.7.1** (2021) - Last jQuery version
- **v0.7.7** (2016) - Original Leaflet version

## License

MIT - Free to use anywhere!

---

**Need more help?** Visit the [full integration guide](INTEGRATION.md)
