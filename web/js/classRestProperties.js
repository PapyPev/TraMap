/*
|------------------------------------------------------------------------------
| Class Rest Properties
|------------------------------------------------------------------------------
|
| This class contains all rest properties from configServer.json.
|
| @author Pev
| @verion 1.1.4
|
|------------------------------------------------------------------------------
*/

// ============================================================================
// CONSTRUCTOR
// ============================================================================

/**
 * [Creates an instance of RestProperties]
 * @constructor
 * @this {RestProperties}
 * @param {String} filePath [Path or URL to JSON config file]
 */
function RestProperties (filePath) {

  // Read configuration file from JSON
  var restParameters = getRestConfig(filePath);

  /**
   * [The REST API adress]
   * @type {String}
   */
  this.address = restParameters.address;

}

// ============================================================================
// GETTERS
// ============================================================================

/**
 * [Get REST API address]
 * @return {String} [The REST address]
 */
RestProperties.prototype.getAddress = function () {
  return this.address;
};

// ============================================================================
// METHODS
// ============================================================================

/**
 * [String representation of the RestProperties]
 * @overide
 * @this{RestProperties}
 * @return {String} [Human-readable representation of this
 * RestProperties]
 */
RestProperties.prototype.toString = function() {
  return JSON.stringify(attributesToLog);
};

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Get REST Configurations from JSON file]
 * @param  {String} filePath [Path to the json file (or url)]
 * @return {json}          [REST configuration : JSON content]
 */
function getRestConfig (filePath) {

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

  return serverConfig.rest;
} //-- end getRestConfig (filePath)
