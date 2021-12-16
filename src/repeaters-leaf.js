/**
 * implemented a sort of a queue for the requests.
 * queryCallFunc() is the function that is called to start the calls until the queus is empty. It contains the call to server.
 * getAddressForMarker() is the function that adds workload to the queue.
 */
var queue = [];
function queryCallFunc() {
  var promise = $.ajax({
        "type": "GET",
        "url": 'https://nominatim.openstreetmap.org/search?format=geojson&limit=5&city=${' + encodeURI(queue[0].address) + '}',        
    }).promise();
  
    promise.then(function(response) {
        if(response.features && response.features.length > 0) {
          queue[0].marker.setLatLng([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]);
        }
        queue[0].deferred.resolve(response);
        queue.shift();
        if(queue.length > 0) {
            queue[0].isActiveRequest = true;
            queryCallFunc();
        }
    });

    promise.fail(function(xhr, error, message) {
       queue[0].deferred.reject(arguments);
       queue.shift();
        if(queue.length > 0) {            
            queue[0].isActiveRequest = true;
            queryCallFunc();
        }
    });
}

function getAddressForMarker(address, marker) {
    var dfd = $.Deferred();
    queue.push({"deferred": dfd, "address": address, "marker": marker, "isActiveRequest": false});
    if(!queue[0].isActiveRequest) {
        queue[0].isActiveRequest = true;  
        queryCallFunc();
    }    
    return dfd.promise();
}

// the map
var map = L.map('map', {
  center: [45.7538, 21.2257], //Timisoara
  minZoom: 2,
  zoom: 6,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c'],
}).addTo(map);

// different pins for different types of repeaters
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

function makeYOPopup(node) {
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

console.log(locatorToLatLng('IO91wm')); // [51.521, -0.125]
console.log(distance('IO91wm', 'KP20le')); // 1821.5 km
console.log(bearingDistance('FN20qr', 'KP21ol')); // 6586.72 km, 49.16 degrees
console.log(latLngToLocator(60.179, 24.945)); // KP21le

function placeLocatorMarkers(overlay, mapFunc, ...data) {
  return new Promise(function (resolve, reject) {
  var repeaters = {};
  if (!repeaters[overlay]) { repeaters[overlay] = L.markerClusterGroup({
    showCoverageOnHover: false,
    // chunkedLoading: true,
    maxClusterRadius: 10,
    iconCreateFunction: function(cluster) {
      return new L.DivIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
    }
  }); }
  data.forEach(element => {
    element.map(el => mapFunc(el, overlay, repeaters));
  });
  resolve(repeaters);
});
}

function addLayers2Map(repeaters) {
  $.each(repeaters, function (key, val) {
    map.addLayer(val);
  });
  L.control.layers(null, repeaters).addTo(map);
}

mapYOFunc = function (val, overlay, repeaters) {
  var selectedIcon = blueIcon;
  if (val.overlay == "dstar") { selectedIcon = greenIcon; }
  if (val.overlay == "tetra") { selectedIcon = greyIcon; }
  if (val.overlay.includes("dmr")) { selectedIcon = orangeIcon; }
  if (val.functional == "inactiv") { selectedIcon = redIcon; }
  var marker = L.marker([val.lat, val.lon], { icon: selectedIcon })
    .bindPopup(makeYOPopup(val));
    // .addTo(map)  
  // marker.addTo(repeaters[overlay]);
  repeaters[overlay].addLayer(marker);
}

mapHuFunc = function(val, overlay, repeaters) {
  if(val["QTH Locator"]){
    var [lat, lon] = locatorToLatLng(val["QTH Locator"]);
    var selectedIcon = blueIcon;
    if (val.Mode.toLowerCase().includes("dstar")) { selectedIcon = greenIcon; }
    if (val.Mode.toLowerCase().includes("tetra")) { selectedIcon = greyIcon; }
    if (val.Mode.toLowerCase().includes("dmr")) { selectedIcon = orangeIcon; }
    if (val.State == "inactive") { selectedIcon = redIcon; }
    var marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopupHu(val));
    repeaters[overlay].addLayer(marker);
  }
}

mapSiFunc = function(val, overlay, repeaters) {
  if(val["LOC"]){
    var [lat, lon] = locatorToLatLng(val["LOC"]);
    var selectedIcon = blueIcon;
    // if (val.Mode.toLowerCase().includes("dstar")) { selectedIcon = greenIcon; }
    // if (val.Mode.toLowerCase().includes("tetra")) { selectedIcon = greyIcon; }
    // if (val.Mode.toLowerCase().includes("dmr")) { selectedIcon = orangeIcon; }
    // if (val.State == "inactive") { selectedIcon = redIcon; }
    var marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopupSi(val));
    repeaters[overlay].addLayer(marker);
  }
}

mapYTFunc = function(val, overlay, repeaters) {
  var selectedIcon = blueIcon;
  var [lon, lat] = [20.457, 44.787];//until getting the real point, they are in Belgrade :)
  if (val.Modes.toLowerCase().includes("dstar")) { selectedIcon = greenIcon; }
  if (val.Modes.toLowerCase().includes("tetra")) { selectedIcon = greyIcon; }
  if (val.Modes.toLowerCase().includes("dmr")) { selectedIcon = orangeIcon; }
  if (val.State == "inactive") { selectedIcon = redIcon; }
  var marker = L.marker([lat, lon], { icon: selectedIcon }).bindPopup(makePopupYt(val));
  marker.addTo(repeaters[overlay]);
  getAddressForMarker(val.Location, marker);
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

function makePopupHu(node) {
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

function makePopupSi(node) {
  let popup = '<div><b><i>' + node.ID + '</i></b><br><b>' + node["QTH"] + '</b><br><div>' + "" + '</div>' + '<ul style="padding-left: 8px;font-size: smaller;">';
  $.each(node, function (k, v) {
    if (k == 'Callsign' || k == 'QTH/Name' || k == 'banda' || k == 'description' || k == 'nameA' || k == 'overlay' || k == 'online' || k == 'pl_in' || k == 'pl_out') {

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

  const prom_yo = placeLocatorMarkers("YO-repeaters", mapYOFunc, Object.values(data.nodes).map((val) => val));
  const prom_ha = placeLocatorMarkers("HA-repeaters", mapHuFunc, fm_markers_hu, dmr_markers_hu, dstar_markers_hu, c4fm_marker_hu);
  const prom_si = placeLocatorMarkers("S5-repeaters", mapSiFunc, markers_2m_fm_s5, markers_70cm_fm_s5, markers_ecolink_s5);
  const prom_yt = placeLocatorMarkers("YT-repeaters", mapYTFunc, markers_YT);
  
  Promise.all([prom_yo, prom_ha, prom_si, prom_yt]).then(function(repeaters) {
    var all_repeaters = {};
    repeaters.map((v) => {
      $.each(v, function(key, val) {
        all_repeaters[key] = val;
      });
    });
    addLayers2Map(all_repeaters);
  });
});
