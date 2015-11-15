/*
|------------------------------------------------------------------------------
| Action Map Loader
|------------------------------------------------------------------------------
|
| Initialize map content and all functions for update or map actions.
|
| @author Pev
| @verion 1.1.7
|
|------------------------------------------------------------------------------
*/

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Configuration file about the main map
 * @type {String}
 */
var _MAP_PROP = './config/configMap.json';

/**
 * Configuration file about the Geoserver and REST API
 * @type {String}
 */
var _SRV_PROP = './config/configServer.json';

/**
 * Configuration file about the Content to put on the map
 * @type {String}
 */
var _CON_PROP = './config/configContent.json';

// ============================================================================
// GLOBALS
// ============================================================================

// Current map
var map;

// Properties
var mapProperties;
var geoServerProperties;
var contentProperties;
var restProperties;

// Leaflet Map Layers
var mapLayers;

// Sidebar
var sidebar;

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Refresh the existing GeoServer Layers]
 * @param  {Object} mapBoundingBox [The current bounding box of the map]
 */
function map_refreshGeoserverLayers (mapBoundingBox) {

  for (var i = 0; i < mapLayers.length; i++) {
    if (mapLayers[i].getCheck()) {

      // Reprojection coordinate system
      var sw = convert_LatLonToMercator(
        mapBoundingBox._southWest.lat,
        mapBoundingBox._southWest.lng
      );
      var ne = convert_LatLonToMercator(
        mapBoundingBox._northEast.lat,
        mapBoundingBox._northEast.lng
      );

      // Create the URL query
      var url = mapLayers[i].getURL() 
        +"&bbox="+sw.X+","+sw.Y+","+ne.X+","+ne.Y;

      // if it's not a Tiles layer
      if (mapLayers[i].getCategory()!='Background') {
        mapLayers[i].getContent().refresh(url);
      }

    } // end if check
  } // end for mapLayers

} //--- end map_refreshGeoserverLayers (mapBoundingBox)

// ----------------------------------------------------------------------------

/**
 * [Load GeoServer Layers with Bounding box query]
 * @param  {Object} mapBoundingBox [description]
 */
function map_laodGeoserverLayers (mapBoundingBox) {

  // Get GeoServer Layer
  var listGeoServerLayer = [];
  listGeoServerLayer = gs_getGeoserverLayers(
    geoServerProperties.getAddress(), 
    geoServerProperties.getRepository(),
    mapProperties.getProjection(),
    mapProperties.getMaxFeatures(),
    mapBoundingBox
  );

  // Add all GeoServer Layers
  for (var i = 0; i < listGeoServerLayer.length; i++) {
    mapLayers.push(listGeoServerLayer[i]);
    if (listGeoServerLayer[i].getCheck()) {
      map.addLayer(listGeoServerLayer[i].getContent());
    }
  }

} //--- end map_laodGeoserverLayers(mapBoundingBox)

// ----------------------------------------------------------------------------

/**
 * [On the TOC layer radio/checkbox action : show or hide a layer]
 * @param  {Number} i    [Index of the layer in listOfLayer]
 * @param  {String} type [Type of layer (Radio, Checkbox)]
 */
function map_showLayer (i, type) {

  // If the layer is viewable
  if (mapLayers[i].getCheck()) {
    map.removeLayer(mapLayers[i].getContent()); // unload map layer
    mapLayers[i].setCheck(false); // unload TOC layer
  } else {
    map.addLayer(mapLayers[i].getContent()); // load map layer
    mapLayers[i].setCheck(true); // load TOC layer
  }

  // Loop Layers - Remove the other layer
  for (var j = 0; j < mapLayers.length; j++) {
    if (mapLayers[j].getCategory()==mapLayers[i].getCategory()
      && j != i && type=='Radio') {
      mapLayers[j].setCheck(false);
      map.removeLayer(mapLayers[j].getContent());
    }
  }

} //--- map_showLayer (i, type)

// ----------------------------------------------------------------------------

/**
 * [Load content of Table Of Content (TOC).]
 */
function map_loadHtmlTOC () {

  // Add TOC title and description
  $("#"+contentProperties.getDivTocTitle()+"").html(
    contentProperties.getContentTocTitle()
  ).trigger("create");
  $("#"+contentProperties.getDivTocDescript()+"").html(
    contentProperties.getContentTocDescript()
  ).trigger("create");

  // Prepare TOC content
  var toc = "";

  // Layers Loop
  for (var i = 0; i < mapLayers.length; i++) {

    // Test if it's the first category or a new
    if (i===0 
      || mapLayers[i].getCategory()!=mapLayers[i-1].getCategory()) {
      toc += '<div class="panel panel-default">'
        + '<div class="panel-heading">'
        +   '<h6 class="panel-title">'+mapLayers[i].getCategory()+'</h6>'
        + '</div>'
        + '<div class="panel-body">';
    }

    // Test if checkbox is checked
    var check = "";
    if (mapLayers[i].getCheck()===true) {
      check="checked";
    }

    // Test type of data 
    switch(mapLayers[i].getType()){
      case "Radio":
        toc +=  '<div class="input-group">'
          +     '<span class="input-group-addon">'
          +       '<input type="radio" '
          +       'name="'+mapLayers[i].getCategory()+'" '
          +       'id="'+mapLayers[i].getPosition()+'" '
          +       'onclick="map_showLayer('+i+',\''
          +           mapLayers[i].getType()+'\')" '
          +       check + '>'
          +     '</span>'
          +   '<input type="text" class="form-control" '
          +       'value="'+mapLayers[i].getAlias()+'" readonly>'
          + '</div>';
        break;
      case "Checkbox":
        // Create layer row
        toc +=  '<div class="input-group">'
          +     '<span class="input-group-addon">'
          +       '<input type="checkbox" '
          +       'name="'+mapLayers[i].getName()+'" '
          +       'id="'+mapLayers[i].getPosition()+'" '
          +        'onchange="map_showLayer('+i+',\''
          +           mapLayers[i].getType()+'\')" '
          +       check + '>'
          +     '</span>'
          +   '<input type="text" class="form-control" '
          +       'value="'+mapLayers[i].getAlias()+'" readonly>'
          + '</div>';
        break;
      default:
        // Nothing
        break;
    }

    // Test if it's not the latest layer
    if (i!=mapLayers.length-1) {
      // Test if we need to close category
      if (mapLayers[i].getCategory()!=mapLayers[i+1].getCategory()) {
        toc += '</div></div>';
      }
    } else{
      toc += '</div></div>';
    }

  }

  // Write to the HTML div
  $("#"+contentProperties.getDivTocContent()+"").html(toc).trigger("create");

} //--- end map_loadHtmlTOC()

// ----------------------------------------------------------------------------

/**
 * [Add Tiles background to mapLayers]
 * @return {array} [List of tiles LayerProperties (classLayerProperties)]
 */
function map_loadTiles () {

  // Returned value
  var listOfLayers = [];

  // Create Copyright
  var tiles_copyright = 'Map data &copy;' 
    + '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' 
    + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
    + 'Imagery © <a href="http://mapbox.com">Mapbox</a>';

  // Get tiles sources
  var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?'
    +'access_token=' + mapProperties.getMapboxToken();

  //Create leaflet Layer
  var bgLight = L.tileLayer(mbUrl, {
    id: 'mapbox.light', 
    attribution: tiles_copyright
  });
  var bgDark = L.tileLayer(mbUrl, {
    id: 'mapbox.dark', 
    attribution: tiles_copyright
  });
  var bgStreet = L.tileLayer(mbUrl, {
    id: 'mapbox.streets', 
    attribution: tiles_copyright
  });

  // Create metadata layer
  var bgLightM = new LayerProperties("Radio", "Background", 
    "bgLight", "MapBox : Light", 0, false, "", bgLight);
  var bgDarktM = new LayerProperties("Radio", "Background", 
    "bgDark", "MapBox : Dark", 1, false, "", bgDark);
  var bgStreetM = new LayerProperties("Radio", "Background", 
    "bgStreet", "MapBox : Street", 2, true, "", bgStreet);

  // Add Tiles to default loaded map layers
  listOfLayers.push(bgLightM, bgDarktM, bgStreetM);

  // Return Value
  return listOfLayers;

} //--- end map_loadTiles()

// ----------------------------------------------------------------------------

/**
 * Loading all the necessary components of the map
 */
function map_init () {

  //---------- Load Layers, GeoServer, Content Properties
  mapProperties = new MapProperties('map', _MAP_PROP);
  geoServerProperties = new GeoServerProperties(_SRV_PROP);
  contentProperties = new ContentProperties(_CON_PROP);
  restProperties = new RestProperties(_SRV_PROP);

  //---------- Load Default map
  map = L.map('map', {
    center: [mapProperties.getCenter()[0], mapProperties.getCenter()[1]],
    zoom: mapProperties.getZoom()
  });

  //---------- Load Default Background to map
  mapLayers = map_loadTiles();
  for (var i = 0; i < mapLayers.length; i++) {
    if (mapLayers[i].getCheck()) {
      map.addLayer(mapLayers[i].getContent());
    }
  }

  //---------- Load Sidebar Component
  sidebar = L.control.sidebar('sidebar', {
    closeButton: true,
    position: mapProperties.getSidebarPos()
  });
  map.addControl(sidebar);
  //sidebar.show();

  //---------- Load Default GeoServer layer 
  map_laodGeoserverLayers(map.getBounds());

  //---------- Load TOC
  map_loadHtmlTOC();

  //---------- Load Actions Buttons
  L.easyButton( '<span class="easy-button">&equiv;</span>', 
    function(){
      sidebar.toggle(); // Open-Close sidebar
    }, 'Table of Content'
  ).addTo(map);

  L.easyButton(
    '<span class="glyphicon glyphicon-road" aria-hidden="true"></span>',
    function(){
      window.location.href = "views/pageTimetables.html";
    }, 'TimeTables'
  ).addTo(map);

  L.easyButton(
    '<span class="glyphicon glyphicon-hand-up" aria-hidden="true"></span>',
    function(){
      popup_buttonSearchByPointer();
    }, 'SearchByPointer'
  ).addTo(map);

  //---------- Load Popup
  popup_init();

  //----------- Moving Map view, refresh GeoServerLayer
  map.on('moveend', function() { 
    map_refreshGeoserverLayers(map.getBounds());
  });

} //-- end init ()

// ============================================================================
// MAIN
// ============================================================================

/**
 * Action performed when the page is fully loaded
 */
$(document).ready(function(){

  // initialize all the components of the map
  map_init();

}); //--$(document).ready()
