/** ***************************************************************************
 * GeoServerProperties Class.
 *
 * @author Pev
 * @version 1.1
 *************************************************************************** */

/* ============================================================================
 * CONSTRUCTOR
 * ========================================================================= */

/**
 * Creates an instance of LayerProperties.
 *
 * @constructor
 * @this {GeoServerProperties}
 * @param {string} filePath Path or URL to JSON config file 
 */
function GeoServerProperties (filePath) {

  // Read configuration file from JSON
  var geoServerParameters = getGeoServerConfig(filePath);

  /** @private */ this.address = geoServerParameters.address;
  /** @private */ this.repository = geoServerParameters.repository;
  /** @private */ this.user = geoServerParameters.user;
  /** @private */ this.password = geoServerParameters.password;

  // Log console
  var attributesToLog = [{
    "address": this.address, 
    "repository": this.repository,
    "user": this.user,
    //"password": this.password
  }];
  console.log('classGeoServerProperties.GeoServerProperties('
    +this.address+')');
  console.log(attributesToLog);

}

/* ============================================================================
 * GETTERS
 * ========================================================================= */

/**
 * Get GeoServer's address.
 * @this {GeoServerProperties}
 * @return {string} The GeoServer address.
 */
GeoServerProperties.prototype.getAddress = function () {
  return this.address;
};

/**
 * Get GeoServer's repository.
 * @this {GeoServerProperties}
 * @return {string} The GeoServer layer's repository.
 */
GeoServerProperties.prototype.getRepository = function () {
  return this.repository;
};

/**
 * Get GeoServer's user.
 * @this {GeoServerProperties}
 * @return {string} The GeoServer user.
 */
GeoServerProperties.prototype.getUser = function () {
  return this.user;
};

/**
 * Get GeoServer's password.
 * @this {GeoServerProperties}
 * @return {string} The GeoServer password.
 */
GeoServerProperties.prototype.getPassword = function () {
  return this.password;
};

/* ============================================================================
 * METHODS
 * ========================================================================= */

/**
 * String representation of the GeoServerProperties
 * @overide
 * @this{GeoServerProperties}
 * @return {string} Human-readable representation of this GeoServerProperties.
 */
GeoServerProperties.prototype.toString = function() {
  // Log console
  var attributesToLog = [{
    "address": this.address, 
    "repository": this.repository,
    "user": this.user,
    //"password": this.password
  }];
  console.log("classLayerProperties.toString():");
  console.log(attributesToLog);
  return JSON.stringify(attributesToLog);
}


/* ============================================================================
 * FUNCTIONS
 * ========================================================================= */

/**
 * Get GeoServer Configurations from JSON file
 * @param {string} filePath Path to the json file (or url)
 * @return {json} GeoServer configuration : JSON content
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
};

