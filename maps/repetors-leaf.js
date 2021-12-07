// See post: https://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

var map = L.map('map', {
  center: [45.76, 24.0],
  minZoom: 2,
  zoom: 6,
});

// var layer = new L.StamenTileLayer('watercolor');
// map.addLayer(layer);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c'],
}).addTo(map);

var myURL = jQuery('script[src$="repetors-leaf.js"]').attr('src').replace('leaf-demo.js', '');
var myIcon = L.icon({
  iconUrl: myURL + 'images/pin24.png',
  iconRetinaUrl: myURL + 'images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: shadowUrl,
  iconSize: [16, 26],
  iconAnchor: [8, 26],
  popupAnchor: [-1, -22],
  shadowSize: [26, 26]
});
var blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: shadowUrl,
  iconSize: [16, 26],
  iconAnchor: [8, 26],
  popupAnchor: [-1, -22],
  shadowSize: [26, 26]
});
var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: shadowUrl,
  iconSize: [16, 26],
  iconAnchor: [8, 26],
  popupAnchor: [-1, -22],
  shadowSize: [26, 26]
});
var greyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl: shadowUrl,
  iconSize: [16, 26],
  iconAnchor: [8, 26],
  popupAnchor: [-1, -22],
  shadowSize: [26, 26]
});
var orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: shadowUrl,
  iconSize: [16, 26],
  iconAnchor: [8, 26],
  popupAnchor: [-1, -22],
  shadowSize: [26, 26]
});
var repeaters = {}

function makePopup(node) {
  let popup = '<div><b><i>' + node.banda + '</i></b><br><b>' + node.name + '</b><br><div>' + node.description + '</div>' + '<ul style="padding-left: 8px;font-size: smaller;">';
  $.each(node, function (k, v) {
    if (k == 'name' || k == 'k_id' || k == 'banda' || k == 'description' || k == 'nameA' || k == 'overlay' || k == 'online' || k == 'pl_in' || k == 'pl_out') {

    } else {
      popup += '<li><b>' + k + '</b>: ' + v + '</li>';
    }
  });
  popup += '</ul></div>';
  return popup;
}

$.getJSON({
  url: "https://raw.githubusercontent.com/yo6nam/yodb/main/all.json",
  cache: true,
  crossDomain: true,
  crossOriginIsolated: false
}, function (data) {
  $.each(data.nodes, function (key, val) {
    var marker;
    if (!repeaters[val.overlay]) { repeaters[val.overlay] = L.layerGroup(); }

    if (val.functional == "inactiv") {
      marker = L.marker([val.lat, val.lon], { icon: redIcon })
        .bindPopup(makePopup(val))
      // .addTo(map)
    } else {
      var selectedIcon = blueIcon;
      if (val.overlay == "dstar") { selectedIcon = greenIcon; }
      if (val.overlay == "tetra") { selectedIcon = greyIcon; }
      if (val.overlay.includes("dmr")) { selectedIcon = orangeIcon; }
      marker = L.marker([val.lat, val.lon], { icon: selectedIcon })
        .bindPopup(makePopup(val))
      // .addTo(map)  
    }
    marker.addTo(repeaters[val.overlay]);

  });
  $.each(repeaters, function (key, val) {
    map.addLayer(val, key);
  });
  L.control.layers(null, repeaters).addTo(map);
});

// const { locatorToLatLng, distance, bearingDistance, latLngToLocator } = require('qth-locator');

console.log(locatorToLatLng('IO91wm')); // [51.521, -0.125]
console.log(distance('IO91wm', 'KP20le')); // 1821.5 km
console.log(bearingDistance('FN20qr', 'KP21ol')); // 6586.72 km, 49.16 degrees
console.log(latLngToLocator(60.179, 24.945)); // KP21le

var settings = {
  'cache': false,
  'dataType': "jsonp",
  "async": true,
  "crossDomain": true,
  "url": "./FM-repeaters-HU.json",
  "method": "GET",
  "headers": {
    "accept": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
}

$.ajax(settings).done(function (response) {
  console.log(2222);
  console.log(response);
}).fail(function (jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
});

var json = (function() {
  var json = null;
  $.ajax({
    'async': false,
    'global': false,
    "crossDomain": true,
    'url': "./FM-repeaters-HU.json",
    'dataType': "json",
    'success': function(data) {
      json = data;
    }
  });
  return json;
})();

console.log(json);

// import * as data from './FM-repeaters-HU.json';
// const {name} = data;
// console.log(name); // output 'testing'

$.getJSON("./FM-repeaters-HU.json", function(json) {
  console.log(json); // this will show the info it in firebug console
});