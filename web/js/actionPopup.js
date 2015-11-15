/** ***************************************************************************
 * actionPopup.
 * All popup function (load, refresh, actions, events, ...)
 * 
 * @author Pev
 * @version 2.2
 *************************************************************************** */

/* ============================================================================
 * GLOBALS
 * ========================================================================= */

// List : origin destination
var listOD = [];

/* ============================================================================
 * FUNCTIONS CALCULATE
 * ========================================================================= */
/**
 * Find itinerary betwin origin and destination
 * @param {Marker} origin Origin contains lat and long coordinates
 * @param {Marker} destination Destination contains lat and long coordinates
 --------------------------------------------------------------------------- */
function findItinerary (origin, destination) {
  console.log("actionPopup.findItinerary(...)");
  console.log("From:"+origin.getLatLng().toString()
    +" - To:"+destination.getLatLng().toString());

  // TODO : algo

}; //--- end findItinerary (origin, destination)


/* ============================================================================
 * FUNCTIONS DATABASE
 * ========================================================================= */

/**
 * Get Metatables from REST service for Focus Popup filters by Keyword.
 --------------------------------------------------------------------------- */
function getInterests() {
  console.log('actionPopup.getInterests()');

  // Return value
  var val = {};

  // Get JSON
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

  return val;
}; //--- getInterests()


/* ============================================================================
 * POPUP LOADING
 * ========================================================================= */

/**
 * Load Popup Focus Filter after REST service from database
 --------------------------------------------------------------------------- */
function loadPopupFocus () {
  console.log('actionPopup.loadPopupFocus()')

  // Init the div container names
  divFocusInterests = 'optionsFocusInterests';

  var htmlList = '<select class="selectpicker" id="listOfInterests">'
    + '<optgroup label="default">'
    + '<option value="default">-- All --</option>'
    + '</optgroup>'

  // Get all tables from REST services
  var interests = getInterests();

  // Verifications
  if (interests.status=='ok') {

    // Loop tables
    for (var i = 0; i < interests.result.length; i++) {
      htmlList += '<optgroup label="' + interests.result[i].table + '">'

      // Loop interests
      for (var j = 0; j < interests.result[i].interests.length; j++) {
        htmlList += '<option id="' + interests.result[i].interests[j] + '">'
        htmlList += interests.result[i].interests[j] + '</option>'
      };

      // Close the optgroup
      htmlList += '</optgroup>'

    }; // end loop result
  }; // end if status

  // Close the select container
  htmlList += '</select>';

  // Add to list of values
  $("#"+divFocusInterests+"").html(htmlList);
}; //--- end loadPopupFocus ()

/**
 * Create button and load popup content onclick
 * @param {string} glyph Icon on the button
 * @param {string} popupName Name of the popup container (name+type)
 * @param {sidebar} sidebar TOC content will hide on event
 --------------------------------------------------------------------------- */
function loadPopupEvent (glyph, popupName, sidebar) {
  console.log('actionPopup.loadPopupEvent(' 
    + glyph + ','+popupName+','+sidebar+')');

  L.easyButton(
    '<span class="glyphicon '+glyph+'" aria-hidden="true"></span>',
    function(){
      sidebar.hide(); // close sidebar
      $('#'+popupName).modal('show'); // load content
      console.log('actionPopup.loadPopupEvent(...) #'+popupName);
    }, popupName // For event
  ).addTo(map);
} //--- loadPopupEvent (glyph, popupName, sidebar)


/**
 * Load Popup content from JSON file (url)
 * @param {json} data Popup json
 --------------------------------------------------------------------------- */
function loadPopupContent (data) {
  console.log('actionPopup.loadPopupContent()');

  // Prepare HTML content
  var html = "";
  
  // Loop object
  for (var i = 0; i < data.content_overTheMap.length; i++) {

    // Prepare content
    content = ""
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
                    + '<div class="modal-content">'
        // Content
        html += content
        // End container
        html += '</div></div></div>';
        // Write on the div
        $("#"+data.div_popup_content+"").html(html).trigger("create");
        break;

      default:
        alert('actionPopup.loadPopup : error');
        break;

    }; //end Switch
  }; //end Loop object
} //--- end loadPopup (data)

/**
 * Load all popup contains on JSON file
 --------------------------------------------------------------------------- */
function loadPopup () {
  console.log('actionPopup.loadPopup()');

  // Ajax request
  $.ajax({

    // GET Parameters
    type: 'GET',
    url: CON_PROP,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){

      // Load Content Properties
      contentProperties = data;

      // Load HTML Popup content
      loadPopupContent(data);

      // Load Buttons
      for (var i = 0; i < data.content_overTheMap.length; i++) {

        // Get button id
        var title = data.content_overTheMap[i].id.toString();

        // Create and load content and event
        loadPopupEvent(data.content_overTheMap[i].icon, 
          data.content_overTheMap[i].name + data.content_overTheMap[i].type,
          sidebar);

      }; // end loop 

      // Load Focus Filter
      loadPopupFocus();

    },
    error: function(jqXHR, exception){
      if (jqXHR.status === 401) {
        console.log('HTTP Error 401 Unauthorized.');
      } else {
        console.log('Uncaught Error.\n' + jqXHR.responseText);
      }
    }

  });
}; //--- end loadPopup()


/* ============================================================================
 * FUNCTION EVENT CLICK
 * ========================================================================= */

/**
 * Get form value from focus popup and focus on values
 --------------------------------------------------------------------------- */
function buttonFocus () {
  console.log("actionPopup.buttonFocus()");

  // Get Form information
  var key = document.getElementById("textFocusKeyword").value;
  var lat = document.getElementById("textFocusLat").value;
  var lon = document.getElementById("textFocusLong").value;

  console.log(key + " " + lat + " " + lon)

  // Test radio button checked
  if(document.getElementById('optionsFocusKeyword').checked) {
    alert("keyword: " + key);
  }else if(document.getElementById('optionsFocusLatLong').checked) {
    // Zoom LatLong
    map.panTo(new L.LatLng(lat, lon));
  }

}; //--- end buttonFocus ()

/**
 * Active mouse click and wait two points : origin and destination.
 --------------------------------------------------------------------------- */
function buttonSearchByPointer () {
  console.log("actionPopup.buttonSearch()");

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
  if (listOD.length != 0) {
    for (var i = 0; i < listOD.length; i++) {
      map.removeLayer(listOD[i]);
    };
  };

  // Init list of marker OD
  listOD = [];

  // Active click on the map
  map.on('click', function(e) {
    //alert(e.containerPoint.toString() + ', ' + e.latlng.toString());

    // Add point on list
    listOD.push(new L.Marker(e.latlng, {
      icon: redMarker,
      draggable:false
    }));

    // For each point, add to map
    for (var i = 0; i < listOD.length; i++) {
      map.addLayer(listOD[i].bindPopup(listOD[i].getLatLng().toString()))
    };

    // If we have 2 points
    if (listOD.length == 2) {
      // Remove click event
        map.off('click');
      // Remove cursor style
      $('.leaflet-container').css('cursor','');
      // Run itinerary alorithm
      findItinerary(listOD[0], listOD[1]);
    };

  });

  // If esc is pressed
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      // Remove click event
      map.off('click');
      // Remove cursor style
      $('.leaflet-container').css('cursor','');
      // Remove old marker from the map
      for (var i = 0; i < listOD.length; i++) {
        map.removeLayer(listOD[i])
      };
    }
  });

}; //--- end buttonSearchByPointer()

