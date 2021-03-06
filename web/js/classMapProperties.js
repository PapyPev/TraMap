/*
|------------------------------------------------------------------------------
| Class Map Properties
|------------------------------------------------------------------------------
|
| This class contains all map properties from configMap.json.
|
| @author Pev
| @verion 1.1.5
|
|------------------------------------------------------------------------------
| The MIT License (MIT)
| 
| Copyright (c) 2015 František Kolovský, Pierre Vrot
| 
| Permission is hereby granted, free of charge, to any person obtaining
| a copy of this software and associated documentation files (the "Software"),
| to deal in the Software without restriction, including without limitation
| the rights to use, copy, modify, merge, publish, distribute, sublicense,
| and/or sell copies of the Software, and to permit persons to whom the 
| Software is furnished to do so, subject to the following conditions:
| 
| The above copyright notice and this permission notice shall be included in 
| all copies or substantial portions of the Software.
| 
| THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
| IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
| FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
| THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
| LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
| FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
| IN THE SOFTWARE.
|
|------------------------------------------------------------------------------
*/

// ============================================================================
// CONSTRUCTOR
// ============================================================================

/**
 * [Creates an instance of MapProperties]
 * @constructor
 * @this {MapProperties}
 * @param {String} name     [The name of the map]
 * @param {String} filePath [Path or URL to JSON config file]
 */
function MapProperties (name, filePath) {

  // Read configuration file from JSON
  var mapParameters = getMapConfig(filePath);

  /**
   * [The name of the map]
   * @type {String}
   * @private
   */
  this.name = name;

  /**
   * [The default map center coordinates lat/long]
   * @type {array}
   * @private
   */
  this.center = mapParameters.center;

  /**
   * [The default zoom level]
   * @type {Number}
   * @private
   */
  this.zoom = mapParameters.zoom;

  /**
   * [The default map projection]
   * @type {String}
   * @private
   */
  this.projection = mapParameters.projection;

  /**
   * [Token for getting MapBox tiles]
   * @type {String}
   * @private
   */
  this.mapboxToken = mapParameters.mapbox_token;

  /**
   * [The sidebar position (left or right)]
   * @type {String}
   * @private
   */
  this.sidebarPos = mapParameters.sidebar_pos;

  /**
   * [Number of feature loaded by layer query]
   * @type {Number}
   * @private
   */
  this.maxFeatures = mapParameters.maxFeatures;

}

// ============================================================================
// GETTERS
// ============================================================================

/**
 * [Get Map's name]
 * @this {MapProperties}
 * @return {String} [The map's name]
 */
MapProperties.prototype.getName = function () {
  return this.name;
};

// ----------------------------------------------------------------------------

/**
 * [Get Map's default center]
 * @this {MapProperties}
 * @return {array} [The default map's center coordinates]
 */
MapProperties.prototype.getCenter = function () {
  return [this.center[0], this.center[1]];
};

// ----------------------------------------------------------------------------

/**
 * [Get Map's default zoom level]
 * @this {MapProperties}
 * @return {Number} [The default map's zoom level]
 */
MapProperties.prototype.getZoom = function () {
  return this.zoom;
};

// ----------------------------------------------------------------------------

/**
 * [Get Map's default projection]
 * @this {MapProperties}
 * @return {String} [The default map's projection]
 */
MapProperties.prototype.getProjection = function () {
  return this.projection;
};

// ----------------------------------------------------------------------------

/**
 * [Get Mapbox token]
 * @this {MapProperties}
 * @return {String} [The MapBox token]
 */
MapProperties.prototype.getMapboxToken = function () {
  return this.mapboxToken;
};

// ----------------------------------------------------------------------------

/**
 * [Get Map's default sidebar position]
 * @this {MapProperties}
 * @return {String} [The sidebar position (left/right)]
 */
MapProperties.prototype.getSidebarPos = function () {
  return this.sidebarPos;
};

// ----------------------------------------------------------------------------

/**
 * [Get Map's default maxFeatures]
 * @this {MapProperties}
 * @return {Number} [The max features per query]
 */
MapProperties.prototype.getMaxFeatures = function () {
  return this.maxFeatures;
};

// ============================================================================
// METHODS
// ============================================================================

/**
 * [String representation of MapProperties]
 * @overide
 * @this{MapProperties}
 * @return {String} [Human-readable representation of this
 * MapProperties]
 */
MapProperties.prototype.toString = function() {
  var attributesToLog = [{
    name: this.name, 
    center: [this.center[0], this.center[1]],
    zoom: this.zoom,
    projection: this.projection,
    mapboxToken:  this.mapboxToken,
    sidebarPos: this.sidebarPos,
    maxFeatures: this.maxFeatures
  }];
  return JSON.stringify(attributesToLog);
};

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Get Map Configurations from JSON file]
 * @param  {String} filePath [Path to the json file (or url)]
 * @return {json}          [Map configuration : JSON content]
 */
function getMapConfig (filePath) {

  // Returned value
  var mapConfig;

  // Get JSON
  $.ajax({
    type: 'GET',
    url: filePath,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      mapConfig = data;
    },
    error: function(jqXHR, exception){
      if (jqXHR.status === 401) {
        console.log('HTTP Error 401 Unauthorized.');
      } else {
        console.log('Uncaught Error.\n' + jqXHR.responseText);
      }
    },
    async: false

  });

  return mapConfig;
} //-- end getMapConfig (filePath)
