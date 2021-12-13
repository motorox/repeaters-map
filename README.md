# repeaters-map
OSM interactive map with repeaters in YO area, and not only.
- osm.html - the page that makes the below picture
- all-in-one-page.html - a page meant to be deployed on websites and contains everything needed to render the map with repeaters

![alt text](https://github.com/motorox/repeaters-map/blob/master/repeaters-map.png?raw=true)

Started from: https://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

## Used libraries and tools

### Stuff used:
- [leaflet](https://leafletjs.com/)<br/>
- [icons](https://github.com/pointhi/leaflet-color-markers)<br/>
- [YO db file](https://github.com/yo6nam/yodb)<br/>
- [qth-locator](https://github.com/jleh/qth-locator)<br/>
- [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)<br/>
- [reverse geocoding](https://github.com/osm-search/Nominatim)<br/>

### DBs from internet:
From the below links i made the JSON files and/or the JS markers arrays:
      <p>http://ha2to.orbel.hu/content/repeaters/en/index.html</p>
      <p>https://www.repeaterbook.com/row_repeaters/Display_SS.php?state_id=HU&band=14&loc=%&call=%&use=%</p>
      <p>https://repeaterbook.com/row_repeaters/Display_SS.php?state_id=RS&freq=14%&band6=%&loc=%&call=%&status_id=%&features=%&coverage=%&use=%</p>
      <p>http://lea.hamradio.si/~s51kq/S5RPT.HTM</p>
      <p>https://clatsopauxcomm.org/technical/vhf-uhf</p>

### Tools:
- [html-table-to-json](https://www.convertjson.com/html-table-to-json.htm)<br/>

## History
This is from the example found:
    <div>
      <p>An example of how to use <a href="https://leafletjs.com/" target="_blank">Leaflet</a>.
      <p>From the article <a href="https://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap" target="_blank">Creating An Interactive Map With Leaflet and OpenStreetMap</a>
      <p>Andy Maloney // <a href="https://asmaloney.com" target="_blank">asmaloney.com</a>
      <br/>23 Jan 2014
      <p>
        <b>[06 May 2021]</b>        
        <ul>
          <li>Updated to Leaflet 1.7.1, and jQuery 3.6.0.</li>
          <li>All files reformatted with <a href="https://prettier.io/">prettier</a>.</li>
          <li>Use <i>https</i> for URLs.</li>
        </ul>
      </p>
      <p><b>[08 Oct 2019]</b>
        <ul>
          <li>Updated to Leaflet 1.5.1 and jQuery 3.4.1.</li>
          <li>Added <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity">Subresource Integrity</a> to CSS and CDN JavaScript.</li>
          <li>Changed the marker file from .json to .js since it is actually a JavaScript file.</li>
          <li>Added a new country to the list :-)</li>
        </ul>
      <p><b>[16 Jul 2016]</b> Switched to Leaflet 0.7.7.
      <p><b>[12 Jul 2016]</b> MapQuest discontinued the tile set I was using, so I switched to OpenStreetMap’s tiles. Note that these are useful only for testing. They say on their site:
        <blockquote>"Apart from very limited testing purposes, you should not use the tiles supplied by OpenStreetMap.org itself."</blockquote>
      <p><b>[19 Apr 2014]</b> Added <i>http:</i> to the scheme-less ajax.googleapis.com URI so double-clicking this file to open in the browser works.
    </div>
