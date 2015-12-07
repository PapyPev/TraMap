/*
|------------------------------------------------------------------------------
| Class Layer Properties
|------------------------------------------------------------------------------
|
| This class contains all Layer properties and functions.
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
 * [Creates an instance of LayerProperties]
 * @constructor
 * @this {LayerProperties}
 * @param {String} type     [The type of layer (Radio, Checkbox)]
 * @param {String} category [The category of layer]
 * @param {String} name     [The name of layer]
 * @param {String} alias    [The alias of layer]
 * @param {Number} position [The postion of layer]
 * @param {Boolean} checked  [The default selection of layer]
 * @param {String} url      [The GeoServer URL for this layer]
 * @param {Object} content  [Feature of the layer]
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

} //-- end LayerProperties(...)

// ============================================================================
// GETTERS
// ============================================================================

/**
 * [Get LayerProperties's Type]
 * @this {LayerProperties}
 * @return {String} [The type of layer (Radio/Checkbox)]
 */
LayerProperties.prototype.getType = function(){
  return this.type;
};

// ----------------------------------------------------------------------------

/**
 * [Get LayerProperties's Category]
 * @this {LayerProperties}
 * @return {String} [The category of layer]
 */
LayerProperties.prototype.getCategory = function(){
  return this.category;
};

// ----------------------------------------------------------------------------

/**
 * [Get LayerProperties's Name]
 * @this {LayerProperties}
 * @return {String} [The name of layer]
 */
LayerProperties.prototype.getName = function(){
  return this.name;
};

// ----------------------------------------------------------------------------

/**
 * [Get LayerProperties's Alias]
 * @this {LayerProperties}
 * @return {String} [The alias of layer]
 */
LayerProperties.prototype.getAlias = function(){
  return this.alias;
};

// ----------------------------------------------------------------------------

/**
 * [Get LayerProperties's Position]
 * @this {LayerProperties}
 * @return {Number} [The position of layer]
 */
LayerProperties.prototype.getPosition = function(){
  return this.position;
};

// ----------------------------------------------------------------------------

/**
 * [Get LayerProperties's Check]
 * @this {LayerProperties}
 * @return {Boolean} [The default checked layer]
 */
LayerProperties.prototype.getCheck = function(){
  return this.checked;
};

// ----------------------------------------------------------------------------

/**
 * [Get LayerProperties's GeoServer URL]
 * @this {LayerProperties}
 * @return {String} [The url layer address]
 */
LayerProperties.prototype.getURL = function(){
  return this.url;
};

// ----------------------------------------------------------------------------

/**
 * [Get LayerProperties's Content]
 * @this {LayerProperties}
 * @return {Object} [The Feature content of layer]
 */
LayerProperties.prototype.getContent = function(){
  return this.content;
};

// ============================================================================
// SETTERS
// ============================================================================

/**
 * [Set LayerProperties's Checked]
 * @this {LayerProperties}
 * @param {Boolean} check [Checked value of the layer]
 */
LayerProperties.prototype.setCheck = function(check){
  this.checked = check;
};

// ----------------------------------------------------------------------------

/**
 * [Set LayerProperties's Feature Content]
 * @this {LayerProperties}
 * @param {Object} content [Feature content of the layer]
 */
LayerProperties.prototype.setContent = function(content){
  this.content = content;
};

// ============================================================================
// METHODS
// ============================================================================

/**
 * [String representation of the LayerProperties]
 * @overide
 * @this {LayerProperties}
 * @return {String} [Human-readable representation of this
 * LayerProperties]
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
  return JSON.stringify(attributesToLog);
};
