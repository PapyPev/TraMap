/** ***************************************************************************
 * ContentProperties Class.
 *
 * @author Pev
 * @version 1.0
 *************************************************************************** */

/* ============================================================================
 * CONSTRUCTOR
 * ========================================================================= */

/**
 * Creates an instance of ContentProperties.
 *
 * @constructor
 * @this {ContentProperties}
 * @param {string} filePath Path or URL to JSON config file 
 */
function ContentProperties (filePath) {

  // Read configuration file from JSON
  var contentParameters = getContentConfig(filePath);

  /** @private */ this.div_toc_title = contentParameters.div_toc_title;
  /** @private */ this.div_toc_content = contentParameters.div_toc_content;
  /** @private */ this.div_toc_descript = contentParameters.div_toc_descript;
  /** @private */ this.div_popup_content = contentParameters.div_popup_content;
  /** @private */ this.content_toc_title = contentParameters.content_toc_title;
  /** @private */ this.content_toc_descript = contentParameters.content_toc_descript;
  /** @private */ this.content_overTheMap = contentParameters.content_overTheMap;

  // Log console
  var attributesToLog = [{
    "div_toc_title" : this.div_toc_title,
    "div_toc_content" : this.div_toc_content,
    "div_toc_descript" : this.div_toc_descript,
    "div_popup_content" : this.div_popup_content,
    "content_toc_title" : this.content_toc_title,
    "content_toc_descript" : this.content_toc_descript,
    "content_overTheMap" : this.content_overTheMap
  }];
  console.log('classContentProperties.ContentProperties()');
  console.log(attributesToLog);

};

/* ============================================================================
 * GETTERS
 * ========================================================================= */

/**
 * Get Div TOC title name.
 * @this {ContentProperties}
 * @return {string} The name of the div toc title.
 */
ContentProperties.prototype.getDivTocTitle = function () {
  return this.div_toc_title;
};

/**
 * Get Div TOC content name.
 * @this {ContentProperties}
 * @return {string} The name of the div toc content.
 */
ContentProperties.prototype.getDivTocContent = function () {
  return this.div_toc_content;
};

/**
 * Get Div TOC description name.
 * @this {ContentProperties}
 * @return {string} The name of the div toc description.
 */
ContentProperties.prototype.getDivTocDescript = function () {
  return this.div_toc_descript;
};

/**
 * Get Div Popup content name.
 * @this {ContentProperties}
 * @return {string} The name of the div popup content.
 */
ContentProperties.prototype.getDivPopupContent = function () {
  return this.div_popup_content;
};

/**
 * Get Toc Title content.
 * @this {ContentProperties}
 * @return {string} The content of the TOC title.
 */
ContentProperties.prototype.getContentTocTitle = function () {
  return this.content_toc_title;
};

/**
 * Get Toc Description content.
 * @this {ContentProperties}
 * @return {string} The content of the TOC description.
 */
ContentProperties.prototype.getContentTocDescript = function () {
  return this.content_toc_descript;
};

/**
 * Get Popup content (overTheMap).
 * @this {ContentProperties}
 * @return {object} The popup json content.
 */
ContentProperties.prototype.getContentOverTheMap = function () {
  return this.content_overTheMap;
};

/* ============================================================================
 * FUNCTIONS
 * ========================================================================= */

/**
 * Get GeoServer Configurations from JSON file
 * @param {string} filePath Path to the json file (or url)
 * @return {json} Content configuration : JSON content
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
};