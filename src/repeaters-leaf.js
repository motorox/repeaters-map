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

// var myURL = jQuery('script[src$="repeaters-leaf.js"]').attr('src').replace('leaf-demo.js', '');
// var myIcon = L.icon({
//   iconUrl: myURL + 'images/pin24.png',
//   iconRetinaUrl: myURL + 'images/pin48.png',
//   iconSize: [29, 24],
//   iconAnchor: [9, 21],
//   popupAnchor: [0, -14],
// })
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
var repeaters = {"<img src='https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png' /> <span class='my-layer-item'>My Layer</span>" : L.layerGroup()};

function makePopup(node) {
  let popup = '<div><b><i>' + node.banda + '</i></b><br><b>' + node.name + '</b><br><div>' + node.description + '</div>' + '<ul style="padding-left: 8px;font-size: smaller;">';
  $.each(node, function (k, v) {
    if (k == 'name' || k == 'k_id' || k == 'banda' || k == 'description' || k == 'nameA' || k == 'online' || k == 'pl_in' || k == 'pl_out') {

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
  // placeYoMarkers(data);
  // placeLocatorMarkers(fm_markers_hu, "FM-HU");
  // placeLocatorMarkers(dmr_markers_hu, "DMR-HU");
  // placeLocatorMarkers(dstar_markers_hu, "DSTAR-HU");
  // placeLocatorMarkers(dstar_markers_hu, "C4FM-HU");

  placeLocatorMarkers("YO-repeaters", mapYOFunc, Object.values(data.nodes).map((val) => val));
  placeLocatorMarkers("HA-repeaters", mapHuFunc, fm_markers_hu, dmr_markers_hu, dstar_markers_hu,c4fm_marker_hu);
  placeLocatorMarkers("YT-repeaters", mapYTFunc, markers_YT);

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

// var settings = {
//   'cache': false,
//   'dataType': "jsonp",
//   "async": true,
//   "crossDomain": true,
//   "url": "./FM-repeaters-HU.json",
//   "method": "GET",
//   "headers": {
//     "accept": "application/json",
//     "Access-Control-Allow-Origin": "*"
//   }
// }

// $.ajax(settings).done(function (response) {
//   console.log(2222);
//   console.log(response);
// }).fail(function (jqXHR, textStatus, errorThrown) {
//   console.log(jqXHR);
//   console.log(textStatus);
//   console.log(errorThrown);
// });

// var json = (function() {
//   var json = null;
//   $.ajax({
//     'async': false,
//     'global': false,
//     "crossDomain": true,
//     'url': "./FM-repeaters-HU.json",
//     'dataType': "json",
//     'success': function(data) {
//       json = data;
//     }
//   });
//   return json;
// })();

// console.log(json);

// import * as data from './FM-repeaters-HU.json';
// const {name} = data;
// console.log(name); // output 'testing'

// $.getJSON("./FM-repeaters-HU.json", function(json) {
//   console.log(json); // this will show the info it in firebug console
// });

function placeYoMarkers(data) {
  $.each(data.nodes, function (key, val) {
    var marker;
    if (!repeaters[val.overlay]) { repeaters[val.overlay] = L.layerGroup(); }

    if (val.functional == "inactiv") {
      marker = L.marker([val.lat, val.lon], { icon: redIcon })
        .bindPopup(makePopup(val));
      // .addTo(map)
    } else {
      var selectedIcon = blueIcon;
      if (val.overlay == "dstar") { selectedIcon = greenIcon; }
      if (val.overlay == "tetra") { selectedIcon = greyIcon; }
      if (val.overlay.includes("dmr")) { selectedIcon = orangeIcon; }
      marker = L.marker([val.lat, val.lon], { icon: selectedIcon })
        .bindPopup(makePopup(val));
      // .addTo(map)  
    }
    marker.addTo(repeaters[val.overlay]);

  });
}

function placeLocatorMarkers(overlay, mapFunc, ...data) {
  if (!repeaters[overlay]) { repeaters[overlay] = L.markerClusterGroup({
    showCoverageOnHover: false, chunkedLoading: true, maxClusterRadius: 10,
    iconCreateFunction: function(cluster) {
      var children = cluster.getAllChildMarkers();
      console.log(children);
      var sum = children.length;
      // for (var i = 0; i < children.length; i++) {
      //   sum += children[i].feature.properties.total;
      // }

      var childCount = cluster.getChildCount()

      var c = ' marker-cluster-';
      if (childCount + sum <= 50) {
        c += 'small';
      } else if (childCount + sum <= 250) {
        c += 'medium';
      } else {
        c += 'large';
      }

      return new L.DivIcon({
        html: '<div><span>' + sum + '</span></div>',
        className: 'marker-cluster marker-cluster-' + c,
        iconSize: new L.Point(40, 40)
      });
    },
    // spiderfyShapePositions: function(count, centerPt) {
    //   var distanceFromCenter = 35,
    //       markerDistance = 45,
    //       lineLength = markerDistance * (count - 1),
    //       lineStart = centerPt.y - lineLength / 2,
    //       res = [],
    //       i;

    //   res.length = count;

    //   for (i = count - 1; i >= 0; i--) {
    //       res[i] = new Point(centerPt.x + distanceFromCenter, lineStart + markerDistance * i);
    //   }

    //   return res;
    // }
  }); }
  data.forEach(element => {
    element.map(el => mapFunc(el, overlay));
  });
}

mapYOFunc = function (val, overlay) {
  console.log(val);
  var selectedIcon = blueIcon;
  if (val.overlay == "dstar") { selectedIcon = greenIcon; }
  if (val.overlay == "tetra") { selectedIcon = greyIcon; }
  if (val.overlay.includes("dmr")) { selectedIcon = orangeIcon; }
  if (val.functional == "inactiv") { selectedIcon = redIcon; }
  marker = L.marker([val.lat, val.lon], { icon: selectedIcon })
    .bindPopup(makePopup(val));
    // .addTo(map)  
  marker.addTo(repeaters[overlay]);
}

mapHuFunc = function(val, overlay) {
  // console.log(node);
  // $.each(node, function (key, val) {
  //   console.log(key);
    console.log(val);
    if(val["QTH Locator"]){
      var marker;
      var [lat, lon] = locatorToLatLng(val["QTH Locator"]);
      var selectedIcon = blueIcon;
      if (val.Mode.toLowerCase().includes("dstar")) { selectedIcon = greenIcon; }
      if (val.Mode.toLowerCase().includes("tetra")) { selectedIcon = greyIcon; }
      if (val.Mode.toLowerCase().includes("dmr")) { selectedIcon = orangeIcon; }
      if (val.State == "inactive") { selectedIcon = redIcon; }
      marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopup2(val)); // .addTo(map)
      marker.addTo(repeaters[overlay]);
    }
  // });
}

mapYTFunc = function(val, overlay) {
  console.log(val);
  // var coords = ;
    // console.log(coords);
    var marker;
    var [lat, lon] = [ 44.81, 20.45]//getCoordsFromAddress2(val["Location"]);
    var selectedIcon = blueIcon;
    if (val.Modes.toLowerCase().includes("dstar")) { selectedIcon = greenIcon; }
    if (val.Modes.toLowerCase().includes("tetra")) { selectedIcon = greyIcon; }
    if (val.Modes.toLowerCase().includes("dmr")) { selectedIcon = orangeIcon; }
    // if (val.State == "inactive") { selectedIcon = redIcon; }
    marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopupYt(val));
    marker.addTo(repeaters[overlay]);
}

function makePopupYt(node) {
  let popup = '<div><b><i>' + node.Call + '</i></b><br><b>' + node["Location"] + '</b><br><div>' + "" + '</div>' + '<ul style="padding-left: 8px;font-size: smaller;">';
  $.each(node, function (k, v) {
    if (k == 'Call' || k == 'Location' || k == 'FIELD8') {

    } else {
      popup += '<li><b>' + k + '</b>: ' + v + '</li>';
    }
  });
  popup += '</ul></div>';
  return popup;
}

function makePopup2(node) {
  let popup = '<div><b><i>' + node.Callsign + '</i></b><br><b>' + node["QTH/Name"] + '</b><br><div>' + "" + '</div>' + '<ul style="padding-left: 8px;font-size: smaller;">';
  $.each(node, function (k, v) {
    if (k == 'Callsign' || k == 'QTH/Name' || k == 'banda' || k == 'description' || k == 'nameA' || k == 'overlay' || k == 'online' || k == 'pl_in' || k == 'pl_out') {

    } else {
      popup += '<li><b>' + k + '</b>: ' + v + '</li>';
    }
  });
  popup += '</ul></div>';
  return popup;
}

function getCoordsFromAddress(address) {
  const api = 'https://nominatim.openstreetmap.org/search?format=geojson&q=' + encodeURI(address);
  return new Promise((resolve) => {
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        resolve(data.features);
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

function getCoordsFromAddress2(address) {
  const api = 'https://nominatim.openstreetmap.org/search?format=geojson&limit=5&city=${'
   + encodeURI(address) + '}';
  $.ajax({
      url: api,
      method: 'GET',
    })
    .done(function (data) {
      return data;
      // if (data.length > 0) {
      //   return data[0].geometry.coordinates;
      // }
      // return [null, null];
    })
    .fail(function (xhr) {
      console.error(xhr);
  });
  // return new Promise((resolve) => {
  //   fetch(api)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       resolve(data.features);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // });
}