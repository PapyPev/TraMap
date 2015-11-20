/*
|------------------------------------------------------------------------------
| Action Popup
|------------------------------------------------------------------------------
|
| All popup functions (load, refresh, actions, events, ...)
|
| @author Pev
| @verion 1.1.4
|
|------------------------------------------------------------------------------
*/

// ============================================================================
// GLOBALS
// ============================================================================

// List : origin destination
var listOD = [];

// ============================================================================
// FUNCTIONS CALCULATE
// ============================================================================

/**
 * [Find itinerary betwin origin and destination and put over the map]
 * @param  {Marker} origin      [Origin contains lat and long coordinates]
 * @param  {Marker} destination [Destination contains lat and long coordinates]
 */
function popup_getIntinerary(origin, destination) {

  console.log('popup_getIntinerary');
  // TODO : algo

} //--- end popup_getIntinerary (origin, destination)

// ============================================================================
// FUNCTIONS DATABASE
// ============================================================================

/**
 * [Get interests from REST service]
 * @return {json} [Response from REST with status and list of interests]
 */
function popup_getInterests() {

  // Return value
  var val = {};

  // Get JSON
  /*
  $.ajax({
    type: 'GET',
    url: restProperties.getAddress() + '/interests',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',

    success: function(data){
      val = data.message;
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
*/

  return val;
} //--- popup_getInterests()

// ============================================================================
// POPUP LOADING
// ============================================================================

/**
 * [Load Popup Focus filter after REST service from database]
 */
function popup_loadHtmlFocusInterests() {

  // Init the div container names
  divFocusInterests = 'optionsFocusInterests';

  // HTML content
  var htmlList = '<select class="selectpicker" id="listOfInterests">' 
    + '<optgroup label="default">'
    + '<option value="default">-- All --</option>'
    + '</optgroup>';

  // Get all tables from REST services
  var interests = popup_getInterests();

  // Verifications
  if (interests.status=='ok') {

    // Loop tables
    for (var i = 0; i < interests.result.length; i++) {
      htmlList += '<optgroup label="' + interests.result[i].table + '">';

      // Loop interests
      for (var j = 0; j < interests.result[i].interests.length; j++) {
        htmlList += '<option id="' + interests.result[i].interests[j] + '">';
        htmlList += interests.result[i].interests[j] + '</option>';
      }

      // Close the optgroup
      htmlList += '</optgroup>';
      
    } // end loop result

  } // end if status

  // Close the select container
  htmlList += '</select>';

  // Add to list of values
  $("#"+divFocusInterests+"").html(htmlList);
} //--- end popup_loadHtmlFocusInterests ()

// ----------------------------------------------------------------------------

/**
 * [Create button and load popup content onclick]
 * @param  {String} glyph     [Name of the glyph icon for the button]
 * @param  {String} popupName [Name of the popup container]
 * @param  {Object} sidebar   [Sidebar object will hide on event]
 */
function popup_loadEvent(glyph, popupName, sidebar) {
  L.easyButton(
    '<span class="glyphicon '+glyph+'" aria-hidden="true"></span>',
    function(){
      sidebar.hide(); // close sidebar
      $('#'+popupName).modal('show'); // load content
    }, popupName // For event
  ).addTo(map);
} //--- end popup_loadEvent (glyph, popupName, sidebar)

// ----------------------------------------------------------------------------

/**
 * [Load Popup content from JSON file (url)]
 * @param  {json} data [JSON config file content]
 */
function popup_loadHtmlContent(data) {

  // Prepare HTML content
  var html = "";

  // Loop object
  for (var i = 0; i < data.content_overTheMap.length; i++) {

    // Prepare content
    content = "";

    // Get HTML Content
    $.ajax({
      url: data.content_overTheMap[i].view,
      type: 'get',
      dataType: 'html',
      async: false,
      success: function(data) {
        content = data;
      } 
    });

    // Switch on content type
    switch(data.content_overTheMap[i].type){
      case 'Popup':
        // Init container
        html  += '<div class="modal fade" '
                + 'id="'+data.content_overTheMap[i].name
                  + data.content_overTheMap[i].type
                  +'" tabindex="-1" role="dialog" '
                  + 'aria-labelledby="contactLabel">'
                  + '<div class="modal-dialog" role="document">'
                    + '<div class="modal-content">';
        // Content
        html += content;
        // End container
        html += '</div></div></div>';
        // Write on the div
        $("#"+data.div_popup_content+"").html(html).trigger("create");
        break;

      default:
        alert('actionPopup.popup_init : error');
        break;

    } //end Switch
  } //end Loop object

} //--- end popup_init (data)

// ----------------------------------------------------------------------------

/**
 * [Load all popup contains on JSON file]
 */
function popup_init() {

  // Ajax request
  $.ajax({

    // GET Parameters
    type: 'GET',
    url: _CON_PROP,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',

    success: function(data){

      // Load Content Properties
      contentProperties = data;
      // Load HTML Popup content
      popup_loadHtmlContent(data);

      // Load Buttons
      for (var i = 0; i < data.content_overTheMap.length; i++) {
        
        // Get button id
        var buttonID = data.content_overTheMap[i].id.toString();
        
        // TODO : Filter by buttonID
        
        // Create and load content and event
        popup_loadEvent(data.content_overTheMap[i].icon, 
          data.content_overTheMap[i].name + data.content_overTheMap[i].type,
          sidebar);

      } // end loop 
      
      // Load Focus Filter
      popup_loadHtmlFocusInterests();
    },

    error: function(jqXHR, exception){
      if (jqXHR.status === 401) {
        console.log('HTTP Error 401 Unauthorized.');
      } else {
        console.log('Uncaught Error.\n' + jqXHR.responseText);
      }
    }

  }); // end $.ajax()
} //--- end popup_init()

// ============================================================================
// FUNCTION EVENT CLICK
// ============================================================================

/**
 * [Get form value from contact popup and open the default system email
 * software]
 */
function popup_buttonContact() {
  // Get Form informations
  var mail = document.getElementById("contactEmail");
  var subj = document.getElementById("contactSubject");
  var mess = document.getElementById("contactMessage");
  // Create link
  var link = "mailto:pev.arfan@gmail.com"
   + "?cc=" + mail
   + "&subject=" + subj
   + "&body=" + mess;
  // Redirection to link
  window.location.href = link;
  //window.open(link);
} //-- end popup_buttonContact ()

// ----------------------------------------------------------------------------

/**
 * [Get form value from focus popup and focus on values]
 */
function popup_buttonFocus() {
  // Get Form information
  var key = document.getElementById("textFocusKeyword").value;
  var lat = document.getElementById("textFocusLat").value;
  var lon = document.getElementById("textFocusLong").value;
  // Test radio button checked
  if(document.getElementById('optionsFocusKeyword').checked) {
    alert("keyword: " + key);
  } else if(document.getElementById('optionsFocusLatLong').checked) {
    // Zoom LatLong
    map.panTo(new L.LatLng(lat, lon));
  }
} //--- end popup_buttonFocus ()

// ----------------------------------------------------------------------------

/**
 * [Active mouse click and wait two points : origin and destination then put
 * the feature over the map]
 */
function popup_buttonSearchByPointer() {

  // Change cursor symbol
  $('.leaflet-container').css('cursor','crosshair');

  // Init marker
  var redMarker = L.icon({
    iconUrl: 'img/icon-map/marker.png',
    iconSize:     [35, 35], // size of the icon
    iconAnchor:   [17, 35], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -35] // point from which the popup should open relative to the iconAnchor
  });

  // Clean old list of marker OD (origin destination)
  if (listOD.length !== 0) {
    for (var i = 0; i < listOD.length; i++) {
      map.removeLayer(listOD[i]);
    }
  }

  // Init list of marker OD
  listOD = [];

  // --------------------

  // Active click on the map
  map.on('click', function(e) {
    
    // Add point on list
    listOD.push(new L.Marker(e.latlng, {
      icon: redMarker,
      draggable:false
    }));
    
    // For each point, add to map
    for (var i = 0; i < listOD.length; i++) {
      map.addLayer(listOD[i].bindPopup(listOD[i].getLatLng().toString()));
    }
    
    // If we have 2 points
    if (listOD.length == 2) {
      // Remove click event
        map.off('click');
      // Remove cursor style
      $('.leaflet-container').css('cursor','');
      // Run itinerary alorithm
      popup_getIntinerary(listOD[0], listOD[1]);
    }
    
  }); // end map.on('click', function(e) {}

  // --------------------
  
  // If esc is pressed
  $(document).keyup(function(e) {
    
    if (e.keyCode == 27) {
      // Remove click event
      map.off('click');
      // Remove cursor style
      $('.leaflet-container').css('cursor','');
      // Remove old marker from the map
      for (var i = 0; i < listOD.length; i++) {
        map.removeLayer(listOD[i]);
      }
    }

  }); // end $(document).keyup(function(e))

} //--- end popup_buttonSearchByPointer()
