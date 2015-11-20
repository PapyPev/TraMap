/*
|------------------------------------------------------------------------------
| Class Layer Style Properties
|------------------------------------------------------------------------------
|
| This class contains all Layer properties and functions.
|
| @author Pev
| @verion 1.0.2
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

