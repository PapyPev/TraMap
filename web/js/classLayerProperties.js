/** ***************************************************************************
 * LayerProperties Class.
 *
 * @author Pev
 * @version 1.3
 *************************************************************************** */

/* ============================================================================
 * CONSTRUCTOR
 * ========================================================================= */

/**
 * Creates an instance of LayerProperties.
 *
 * @constructor
 * @this {LayerProperties}
 * @param {string} type The type of layer (Radio, Checkbox).
 * @param {string} cat The category of layer.
 * @param {string} name The name of layer.
 * @param {string} alias The alias of layer.
 * @param {number} position The postion of layer.
 * @param {boolean} checked The default selection of layer.
 * @param {string} url The GeoServer URL for this layer.
 * @param {Object} content The layer.
 */
function LayerProperties(type, category, name, alias, position, checked, url, content) {
  /** @private */ this.type = type;
  /** @private */ this.category = category;
  /** @private */ this.name = name;
  /** @private */ this.alias = alias;
  /** @private */ this.position = position;
  /** @private */ this.checked = checked;
  /** @private */ this.url = url;
  /** @private */ this.content = content;

  var attributesToLog = [{
    category: category, 
    name: name,
    alias: alias,
    position: position,
    checked:  checked,
    url: url,
    content: content
  }];
  console.log('classLayerProperties.LayerProperties('+name+')');
  console.log(attributesToLog);
};

/* ============================================================================
 * GETTERS
 * ========================================================================= */

/**
 * Get LayerProperties's Type.
 * @this {LayerProperties}
 * @return {string} The type of layer.
 */
LayerProperties.prototype.getType = function(){
  //console.log("classLayerProperties.getCategory(): " + this.type);
  return this.type;
};

/**
 * Get LayerProperties's Category.
 * @this {LayerProperties}
 * @return {string} The category of layer.
 */
LayerProperties.prototype.getCategory = function(){
  //console.log("classLayerProperties.getCategory(): " + this.category);
  return this.category;
};

/**
 * Get LayerProperties's Name.
 * @this {LayerProperties}
 * @return {string} The name of layer.
 */
LayerProperties.prototype.getName = function(){
  //console.log("classLayerProperties.getName(): " + this.name);
  return this.name;
};

/**
 * Get LayerProperties's Alias.
 * @this {LayerProperties}
 * @return {string} The alias of layer.
 */
LayerProperties.prototype.getAlias = function(){
  //console.log("classLayerProperties.getAlias(): " + this.alias);
  return this.alias;
};

/**
 * Get LayerProperties's Position.
 * @this {LayerProperties}
 * @return {number} The position of layer.
 */
LayerProperties.prototype.getPosition = function(){
  //console.log("classLayerProperties.getPosition(): " + this.position);
  return this.position;
};

/**
 * Get LayerProperties's Check.
 * @this {LayerProperties}
 * @return {boolean} The checked of layer.
 */
LayerProperties.prototype.getCheck = function(){
  //console.log("classLayerProperties.getCheck(): " + this.checked);
  return this.checked;
};

/**
 * Get LayerProperties's GeoServer URL.
 * @this {LayerProperties}
 * @return {string} The url layer address.
 */
LayerProperties.prototype.getURL = function(){
  //console.log("classLayerProperties.getContent(): " + this.content);
  return this.url;
};

/**
 * Get LayerProperties's Content.
 * @this {LayerProperties}
 * @return {Object} The content of layer.
 */
LayerProperties.prototype.getContent = function(){
  //console.log("classLayerProperties.getContent(): " + this.content);
  return this.content;
};

/* ============================================================================
 * SETERS
 * ========================================================================= */

/**
 * Set LayerProperties's Checked.
 * @this {LayerProperties}
 * @param {Boolean} check Boolean for check.  
 */
LayerProperties.prototype.setCheck = function(check){
  this.checked = check;
  //console.log("classLayerProperties.setCheck(): " + this.checked);
};

/**
 * Set LayerProperties's Content.
 * @this {LayerProperties}
 * @param {Object} content The content of Layer.  
 */
LayerProperties.prototype.setContent = function(content){
  this.content = content;
  //console.log("classLayerProperties.setCheck(): " + this.checked);
};

/* ============================================================================
 * METHODS
 * ========================================================================= */

/**
 * String representation of the LayerProperties
 * @overide
 * @this{LayerProperties}
 * @return {string} Human-readable representation of this LayerProperties.
 */
LayerProperties.prototype.toString = function() {
  var attributesToLog = [{
    category: this.category, 
    name: this.name,
    alias: this.alias,
    position: this.position,
    checked:  this.checked,
    url: this.url,
    content: this.content
  }];
  console.log("classLayerProperties.toString():")
  console.log(attributesToLog);
  return JSON.stringify(attributesToLog);
}

