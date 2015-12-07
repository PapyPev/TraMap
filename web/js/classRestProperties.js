/*
|------------------------------------------------------------------------------
| Class Rest Properties
|------------------------------------------------------------------------------
|
| This class contains all rest properties from configServer.json.
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
