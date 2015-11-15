/*
|------------------------------------------------------------------------------
| Geoserver Layers functions.
|------------------------------------------------------------------------------
|
| To centralize and simplify GeoServer functions access, style and features
|
| @author Fanda/Pev
| @verion 1.1.4
|
|------------------------------------------------------------------------------
*/

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Convert coordinate Lat/Long to Mercator projection]
 * @param {Float} lat [Latitude coordinate on Lat/Long projection]
 * @param {Float} lon [Longitude coordinate on Lat/Long projection]
 * @return {json} Coordinates on Mercator projection
 */
function convert_LatLonToMercator(lat, lon) {
  var rMajor = 6378137; //Equatorial Radius, WGS84
  var shift  = Math.PI * rMajor;
  var x = lon * shift / 180;
  var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
  y = y * shift / 180;
  return {'X': x, 'Y': y};
} //-- end convert_LatLonToMercator(lat, lon)

// ----------------------------------------------------------------------------

/**
 * [This function gives a visual style to data]
 * @param {Object} feature [Feature of the layer]
 */
function gs_setStyle(feature) {

  // Switch on class properties
  switch (feature.properties.clazz) {

    // TODO : Comment
    case 31: return {color: "orange", weight: 17, opacity: 0.5};

    // TODO : Comment
    case 32: return {color: "#0000ff", weight: 17, opacity: 0.5};

  } //end switch(feature.properties.clazz)
} //-- end gs_setStyle(feature)

// ----------------------------------------------------------------------------

/**
 * [Add bind Popup to feature]
 * @param {Object} feature [The feature object]
 * @param {Object} layer   [The layer object]
 */
function gs_setPopup(feature, layer) {
  layer.bindPopup(feature.properties.name);
} //-- end gs_setPopup(feature, layer)

// ----------------------------------------------------------------------------

/**
 * [This function gives a visual style to data]
 * @param  {String} url         [The GeoServer address]
 * @param  {String} repository  [The GeoServer repository]
 * @param  {String} projection  [The default map projection]
 * @param  {Number} maxFeatures [Number of maxFeatures per query]
 * @param  {Object} bbox        [The current map Bounding Box (map extent)]
 * @return {Object}             [Return a list of classLayerProperties object]
 */
function gs_getGeoserverLayers(url, repository, projection, maxFeatures, bbox){

  // Get bbox on Mercator projection (from Lat/Long)
  var southWest = convert_LatLonToMercator(bbox._southWest.lat,bbox._southWest.lng);
  var northEast = convert_LatLonToMercator(bbox._northEast.lat,bbox._northEast.lng);

  // Return value : list of layers
  var listOfLayers = [];
  
  // Prepare POST Request to Geoserver for GetCapabilities XML File
  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  // Callback function after sent the request
  xmlhttp.onload = function() {

    // Prepare the xmlVariable
    var xmlDoc = new DOMParser().parseFromString(
      xmlhttp.responseText,'text/xml');

    // Get layer list
    var x = xmlDoc.getElementsByTagName("FeatureTypeList");

    // Loop Layer Layer's list
    for (i=0;i<x.length;i++){ 

      // Get layer child on the layer's list
      var y = x[i].getElementsByTagName("FeatureType");

      // Loop on layer's properties
      for (var i = 0; i < y.length; i++) {

        // Save layer Name
        var layerName = y[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;

        // Prepare the URL for getting vector data
        var layerUrl = url
          +"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="
          +repository+":"+layerName
          +"&srsName="+projection
          +"&SRS="+projection
          +"&maxFeatures="+maxFeatures
          +"&outputFormat=application/json";

        // Get GeoJSON layer content
        var layerContent = new L.GeoJSON.AJAX(layerUrl
          +"&bbox="+southWest.X+","+southWest.Y+","
          +northEast.X+","+northEast.Y,
          {
            onEachFeature:gs_setPopup, // popup information
            //style: gs_setStyle
          }
        );

        // Add to list of layers
        listOfLayers.push(new LayerProperties(
          "Checkbox", 
          "Data", 
          layerName,
          layerName,
          i,
          true,
          layerUrl,
          layerContent
        ));

      } // end Loop on layer's properties
    } // end Loop Layer Layer's list
  }; // end xmlhttp.onload = function()

  // Request for GetCapabilities - After request : callbac function
  xmlhttp.open(
    "POST",
    url+'/'+repository+'/ows?SERVICE=WFS&REQUEST=GetCapabilities',
    false // True=async and False=synchronous
  );
  xmlhttp.send();

  // Return tab of classLayers
  return listOfLayers;
} //--- end gs_getGeoserverLayers(url){

