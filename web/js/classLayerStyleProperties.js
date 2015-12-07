/*
|------------------------------------------------------------------------------
| Class Layer Style Properties
|------------------------------------------------------------------------------
|
| This class contains all Layer properties and functions.
|
| @author Pev
| @verion 1.0.3
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
 * [Creates an instance of LayerStyleProperties]
 * @constructor
 * @this {LayerStyleProperties}
 * @param {String} filePath      [The layer style configuration file]
 */
function LayerStyleProperties(filePath) {

  // Read configuration file from JSON
  var fromJson = getLayerStyleConfig(filePath);

  /**
   * [List of all layers configurations style]
   * @type {array}
   * @private
   */
  this.layers = fromJson.layers;

} //-- end LayerStyleProperties(...)

// ============================================================================
// GETTERS
// ============================================================================

/**
 * [Return the list of layers properties]
 * @return {array} [Layer's name]
 */
LayerStyleProperties.prototype.getLayers = function(){
  return this.layers;
}

// ============================================================================
// METHODS
// ============================================================================

/**
 * [Return Style properties for the layers name in parameter]
 * @this {LayerStyleProperties}
 * @param  {String} name [The layer's name]
 * @return {Object}      [The layer's style properties]
 */
LayerStyleProperties.prototype.getLayerStyle = function(name) {
  
  // Define default return
  var style;

  // For each object on the configuration file, search the layer nme
  for (var i = this.layers.length - 1; i >= 0; i--) {
    if (this.layers[i].name === name) {
      style = this.layers[i];
      break;
    }
  }

  return style;
};

/**
 * [String representation of the LayerStyleProperties]
 * @overide
 * @this {LayerStyleProperties}
 * @return {String} [Human-readable representation of this
 * LayerStyleProperties]
 */
LayerStyleProperties.prototype.toString = function() {
  var attributesToLog = [{
    layers : this.layers
  }];
  return JSON.stringify(attributesToLog);
};

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Get GeoServer Configurations from JSON file]
 * @this {LayerStyleProperties}
 * @param  {String} filePath [Path to the json file (or url)]
 * @return {json}          [Content configuration : JSON content]
 */
function getLayerStyleConfig (filePath) {

  // Returned value
  var layerStyleConfig;

  // Get JSON
  $.ajax({
    type: 'GET',
    url: filePath,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){

      layerStyleConfig = data;

    },
    error: function(jqXHR, exception){
      console.warn("failde")
      if (jqXHR.status === 401) {
        console.log('HTTP Error 401 Unauthorized.');
      } else {
        console.log('Uncaught Error.\n' + jqXHR.responseText);
      }
    },
    async: false

  });

  return layerStyleConfig;
} //-- end getContentConfig (filePath)

