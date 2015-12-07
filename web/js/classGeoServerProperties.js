/*
|------------------------------------------------------------------------------
| Class GeoServer Properties
|------------------------------------------------------------------------------
|
| This class contains all GeoServer properties from configGeoServer.json.
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
 * [Creates an instance of GeoServerProperties]
 * @constructor
 * @this {GeoServerProperties}
 * @param {String} filePath [Path or URL to JSON config file]
 */
function GeoServerProperties (filePath) {

  // Read configuration file from JSON
  var geoServerParameters = getGeoServerConfig(filePath);

  /**
   * [The Geoserver adress URL]
   * @private
   * @type {String}
   */
  this.address = geoServerParameters.address;

  /**
   * [The Geoserver project repository]
   * @private
   * @type {String}
   */
  this.repository = geoServerParameters.repository;

  /**
   * [The default Geoserver user name]
   * @deprecated
   * @private
   * @type {String}
   */
  this.user = geoServerParameters.user;

  /**
   * [The default Geoserver password name for the username]
   * @deprecated
   * @private
   * @type {String}
   */
  this.password = geoServerParameters.password;

}

// ============================================================================
// GETTERS
// ============================================================================

/**
 * [Get GeoServer's address]
 * @this {GeoServerProperties}
 * @return {String} [The GeoServer address URL]
 */
GeoServerProperties.prototype.getAddress = function () {
  return this.address;
};

// ----------------------------------------------------------------------------

/**
 * [Get GeoServer's repository]
 * @this {GeoServerProperties}
 * @return {String} [The GeoServer layer's repository]
 */
GeoServerProperties.prototype.getRepository = function () {
  return this.repository;
};

// ----------------------------------------------------------------------------

/**
 * [Get GeoServer's username]
 * @this {GeoServerProperties}
 * @return {String} [The GeoServer username]
 */
GeoServerProperties.prototype.getUser = function () {
  return this.user;
};

// ----------------------------------------------------------------------------

/**
 * [Get GeoServer's password]
 * @this {GeoServerProperties}
 * @return {String} [The GeoServer password for username]
 */
GeoServerProperties.prototype.getPassword = function () {
  return this.password;
};

/* ============================================================================
 * METHODS
 * ========================================================================= */

/**
 * [String representation of the GeoServerProperties]
 * @overide
 * @this{GeoServerProperties}
 * @return {String} [Human-readable representation of this
 * GeoServerProperties]
 */
GeoServerProperties.prototype.toString = function() {
  var attributesToLog = [{
    "address": this.address, 
    "repository": this.repository,
    "user": this.user,
    //"password": this.password
  }];
  return JSON.stringify(attributesToLog);
};


/* ============================================================================
 * FUNCTIONS
 * ========================================================================= */

/**
 * [Get GeoServer Configurations from JSON file]
 * @this{GeoServerProperties}
 * @param  {String} filePath [Path to the json file (or url)]
 * @return {json}          [GeoServer configuration : JSON content]
 */
function getGeoServerConfig (filePath) {

  // Returned value
  var serverConfig;

  // Get JSON
  $.ajax({
    type: 'GET',
    url: filePath,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      serverConfig = data;
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

  return serverConfig.geoserver;
} //-- end getGeoServerConfig (filePath)

