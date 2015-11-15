/*
|------------------------------------------------------------------------------
| Class Content Properties
|------------------------------------------------------------------------------
|
| This class contains all content properties from configContent.json.
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
 * [Creates an instance of ContentProperties]
 * @constructor
 * @this {ContentProperties}
 * @param {String} filePath [Path or URL to JSON config file]
 */
function ContentProperties (filePath) {

  // Read configuration file from JSON
  var contentParameters = getContentConfig(filePath);

  /**
   * [Name of the HTML div contains Table of Content title]
   * @type {String}
   * @private
   */
  this.div_toc_title = contentParameters.div_toc_title;

  /**
   * [Name of the HTML div contains Table of Content content]
   * @type {String}
   * @private
   */
  this.div_toc_content = contentParameters.div_toc_content;

  /**
   * [Name of the HTML div contains Table of Content description]
   * @type {String}
   * @private
   */
  this.div_toc_descript = contentParameters.div_toc_descript;

  /**
   * [Name of the HTML div contains Popup content]
   * @type {String}
   * @private
   */
  this.div_popup_content = contentParameters.div_popup_content;

  /**
   * [Value of the Table of Content title]
   * @type {String}
   * @private
   */
  this.content_toc_title = contentParameters.content_toc_title;

  /**
   * [Value of the Table of Content description]
   * @type {String}
   * @private
   */
  this.content_toc_descript = contentParameters.content_toc_descript;

  /**
   * [JSON object contains all popup information to pu over the map]
   * @type {json}
   * @private
   */
  this.content_overTheMap = contentParameters.content_overTheMap;

}

// ============================================================================
// GETTERS
// ============================================================================

/**
 * [Get Div TOC title name]
 * @this {ContentProperties}
 * @return {String} [The name of the div toc title]
 */
ContentProperties.prototype.getDivTocTitle = function () {
  return this.div_toc_title;
};

// ----------------------------------------------------------------------------

/**
 * [Get Div TOC content name]
 * @this {ContentProperties}
 * @return {String} [The name of the div toc content]
 */
ContentProperties.prototype.getDivTocContent = function () {
  return this.div_toc_content;
};

// ----------------------------------------------------------------------------

/**
 * [Get Div TOC description name]
 * @this {ContentProperties}
 * @return {String} [The name of the div toc description]
 */
ContentProperties.prototype.getDivTocDescript = function () {
  return this.div_toc_descript;
};

// ----------------------------------------------------------------------------

/**
 * Get Div Popup content name.
 * @this {ContentProperties}
 * @return {string} The name of the div popup content.
 */
/**
 * [Get Div Popup content name]
 * @this {ContentProperties}
 * @return {String} [The name of the div popup content]
 */
ContentProperties.prototype.getDivPopupContent = function () {
  return this.div_popup_content;
};

// ----------------------------------------------------------------------------

/**
 * [Get Toc Title content]
 * @this {ContentProperties}
 * @return {String} [The content of the TOC title]
 */
ContentProperties.prototype.getContentTocTitle = function () {
  return this.content_toc_title;
};

// ----------------------------------------------------------------------------

/**
 * [Get Toc Description content]
 * @this {ContentProperties}
 * @return {String} [The content of the TOC description]
 */
ContentProperties.prototype.getContentTocDescript = function () {
  return this.content_toc_descript;
};

// ----------------------------------------------------------------------------

/**
 * [Get Popup content (overTheMap)]
 * @this {ContentProperties}
 * @return {json} [The popup json content]
 */
ContentProperties.prototype.getContentOverTheMap = function () {
  return this.content_overTheMap;
};

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Get GeoServer Configurations from JSON file]
 * @this {ContentProperties}
 * @param  {String} filePath [Path to the json file (or url)]
 * @return {json}          [Content configuration : JSON content]
 */
function getContentConfig (filePath) {

  // Returned value
  var contentConfig;

  // Get JSON
  $.ajax({
    type: 'GET',
    url: filePath,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      contentConfig = data;
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

  return contentConfig;
} //-- end getContentConfig (filePath)