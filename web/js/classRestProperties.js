/** ***************************************************************************
 * RestProperties Class.
 *
 * @author Pev
 * @version 1.0
 *************************************************************************** */

/* ============================================================================
 * CONSTRUCTOR
 * ========================================================================= */

/**
 * Creates an instance of RestProperties.
 *
 * @constructor
 * @this {RestProperties}
 * @param {string} filePath Path or URL to JSON config file 
 */
function RestProperties (filePath) {

  // Read configuration file from JSON
  var restParameters = getRestConfig(filePath);

  /** @private */ this.address = restParameters.address;

  // Log console
  var attributesToLog = [{
    "address": this.address, 
  }];
  console.log('classRestProperties.RestProperties('
    +filePath+')');
  console.log(attributesToLog);

}

/* ============================================================================
 * GETTERS
 * ========================================================================= */

/**
 * Get RestProperties's address.
 * @this {RestProperties}
 * @return {string} The REST address.
 */
RestProperties.prototype.getAddress = function () {
  return this.address;
};


/* ============================================================================
 * METHODS
 * ========================================================================= */

/**
 * String representation of the RestProperties
 * @overide
 * @this{RestProperties}
 * @return {string} Human-readable representation of this RestProperties.
 */
RestProperties.prototype.toString = function() {
  // Log console
  var attributesToLog = [{
    "address": this.address, 
  }];
  console.log("classRestProperties.toString():");
  console.log(attributesToLog);
  return JSON.stringify(attributesToLog);
}


/* ============================================================================
 * FUNCTIONS
 * ========================================================================= */

/**
 * Get REST Configurations from JSON file
 * @param {string} filePath Path to the json file (or url)
 * @return {json} REST configuration : JSON content
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
};

