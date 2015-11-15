/** ***************************************************************************
 * Get Train Informations.
 * Initialize Map content
 *
 * @author Pev
 * @version 1.2
 *************************************************************************** */

/* ============================================================================
 * CONSTANTS
 * ========================================================================= */

var DIGI_TRAFFIC = 'http://rata.digitraffic.fi/api/v1/live-trains?station=';
var DIGI_STATIONS = 'http://rata.digitraffic.fi/api/v1/metadata/stations';

/* ============================================================================
 * GLOBALS
 * ========================================================================= */

var dictStations = {};
var listStations = [];

/* ============================================================================
 * FUNCTIONS AUTOLOAD
 * ========================================================================= */

// Autocomplete
$(function() {
  $( "#textDeparture" ).autocomplete({
    source: listStations
  });
});
$(function() {
  $( "#textArrival" ).autocomplete({
    source: listStations
  });
});

/* ============================================================================
 * FUNCTIONS
 * ========================================================================= */

/**
 * Return the name of the station by the code
 * @param {string} code The station's code
 * @return {string} The station's name
 --------------------------------------------------------------------------- */
function getStationName (code) {
  return dictStations[code];
};

/**
 * Return a String for the Acordeon html end content
 * return {string} The Acordeon end
 --------------------------------------------------------------------------- */
function getAcordeonEnd () {
  // Init HTML content
  htmlContent = '';
  // End Container
  htmlContent += '</tbody>'
  htmlContent += '</table>'
  htmlContent += '</div>'
  htmlContent += '</div>'
  htmlContent += '</div>'
  htmlContent += '</div>'
  //Return content
  return htmlContent;
}; // end : getAcordeonEnd ()

/**
 * Return a String for the Acordeon html begin content
 * @param {string} acIdent Identification name of content
 * @param {string} acTitle Human name of the acordeon (visible)
 * @param {string} headId Link betwin accordeon and drop down
 * return {string} The Acordeon initialisation
 --------------------------------------------------------------------------- */
function getAcordeonInit (acIdent, acTitle, headId) {
  // Init HTML content
  htmlContent = '';
  // Make Container
  htmlContent += '<div class="panel panel-default">'
  htmlContent += '<div class="panel-heading" role="tab" id="'+headId+'">'
  htmlContent += '<h4 class="panel-title">'
  htmlContent += '<a role="button" data-toggle="collapse" '
    + 'data-parent="#accordion" href="#'+acIdent+'" '
    + 'aria-expanded="true" aria-controls="'+acIdent+'">'
    + acTitle
  htmlContent += '</a>'
  htmlContent += '</h4>'
  htmlContent += '</div>'
  htmlContent += '<div id="'+acIdent+'" '
    + 'class="panel-collapse collapse" role="tabpanel" '
    + 'aria-labelledby="'+headId+'">'
  htmlContent += '<div class="panel-body">'
  htmlContent += '<div class="table-responsive">'
  htmlContent += '<table class="table table-striped">'
  htmlContent += '<thead>'
  htmlContent += '<tr>'
  htmlContent += '<th>Status</th>'
  htmlContent += '<th>Station</th>'
  htmlContent += '<th>ScheduledTime</th>'
  htmlContent += '<th>CommercialTrack</th>'
  htmlContent += '</tr>'
  htmlContent += '</thead>'
  htmlContent += '<tbody>'
  //Return content
  return htmlContent;
}; // end : getAcordeonInit (acIdent, acTitle, headId)

/**
 * Generate the title of the dropdown widget
 * @param {json} data All train informations
 * @return {string} Title of the dropdown
 --------------------------------------------------------------------------- */
function getTrainTitle (data) {
  console.log('pageTimetables.getTrainTitle()');
  var type = data.trainType;
  var depKey = data.timeTableRows[0].stationShortCode;
  var depName = dictStations[depKey];
  var lastE = data.timeTableRows.length-1;
  var arrKey = data.timeTableRows[lastE].stationShortCode;
  var arrName = dictStations[arrKey];
  var trainNum = data.trainNumber
  var title = type + ' - ' + depName + ' > ' + arrName 
    + ' (num:' + trainNum + ')';
  return title;
}; // end : getTrainTitle (data)

/**
 * Load HTML content Arrival from the city parameter
 * @param {json} data Digitraffic data : Timetables
 * @param {string} codeCity The city's code from arrival
 --------------------------------------------------------------------------- */
function loadArrival (data, codeCity) {

  // Table rows : 
  // Status, Station, ScheduledTime, CommercialTrack

  // Init returned value
  var htmlContent = '';

  // Loop all Timetables
  for (var i = 0; i < data.length; i++) {

    // Start and End
    if (i == 0 || i == data.length-1) {
      // Init rows
      htmlContent += '<tr>';
      // Test type
      if (data[i].type == 'DEPARTURE') {
        htmlContent += '<td><span class="flaticon-double4"></span></td>';
      } else if (data[i].type == "ARRIVAL"){
        htmlContent += '<td><span class="flaticon-double5"></span></td>';
      };
      // Content
      htmlContent += '<td>'+getStationName(data[i].stationShortCode)+'</td>';
      htmlContent += '<td>'+getDateHuman(data[i].scheduledTime)+'</td>';
      htmlContent += '<td>'+data[i].commercialTrack+'</td>';
      // End rows
      htmlContent += '</tr>';

    }

    // Stop station
    else {
      if (data[i].type == 'ARRIVAL' && data[i].trainStopping) {
        // Init rows
        htmlContent += '<tr>';
        // Content
        htmlContent += '<td><span class="flaticon-up11"></span></td>';
        htmlContent += '<td>'+getStationName(data[i].stationShortCode)+'</td>';
        htmlContent += '<td>'+getDateHuman(data[i].scheduledTime)+'</td>';
        htmlContent += '<td>'+data[i].commercialTrack+'</td>';
        // End rows
        htmlContent += '</tr>';
      };
    };

  };

  // Return value
  return htmlContent;

};


/**
 * Load HTML content Departure from the city parameter
 * @param {json} data Digitraffic data : Timetables
 * @param {string} codeCity The city's code from departure
 --------------------------------------------------------------------------- */
function loadDeparture (data, codeCity) {

  // Table rows : 
  // Status, Station, ScheduledTime, CommercialTrack

  // Init returned value
  var htmlContent = '';

  // Loop all Timetables
  for (var i = 0; i < data.length; i++) {

    // Start and End
    if (i == 0 || i == data.length-1) {
      // Init rows
      htmlContent += '<tr>';
      // Test type
      if (data[i].type == 'DEPARTURE') {
        htmlContent += '<td><span class="flaticon-double4"></span></td>';
      } else if (data[i].type == "ARRIVAL"){
        htmlContent += '<td><span class="flaticon-double5"></span></td>';
      };
      // Content
      htmlContent += '<td>'+getStationName(data[i].stationShortCode)+'</td>';
      htmlContent += '<td>'+getDateHuman(data[i].scheduledTime)+'</td>';
      htmlContent += '<td>'+data[i].commercialTrack+'</td>';
      // End rows
      htmlContent += '</tr>';

    }

    // Stop station
    else {
      if (data[i].type == 'DEPARTURE' && data[i].trainStopping) {
        // Init rows
        htmlContent += '<tr>';
        // Content
        htmlContent += '<td><span class="flaticon-up11"></span></td>';
        htmlContent += '<td>'+getStationName(data[i].stationShortCode)+'</td>';
        htmlContent += '<td>'+getDateHuman(data[i].scheduledTime)+'</td>';
        htmlContent += '<td>'+data[i].commercialTrack+'</td>';
        // End rows
        htmlContent += '</tr>';
      };
    };

  };

  // Return value
  return htmlContent;

};

/**
 * Load HTML content for Stations informations
 * @param {json} data JSON response from digitraffic
 * @param {string} type Search type
 --------------------------------------------------------------------------- */
function loadTimetables (data, dep, arr, type) {
  console.log('pageTimetables.loadTimetables(., '
    + dep + ', ' + arr + ', ' + type + ')');

  // ------- INIT -------

  // Init html content
  var htmlContent = '';

  // Init Acordeon group
  htmlContent += '<div class="panel-group" id="accordion" '
    + 'role="tablist" aria-multiselectable="true">'

  // ------- LOOP TRAIN -------

  for (var i = 0; i < data.length; i++) {

    // Acordeon ID
    var acIdent = 'id' + data[i].trainCategory + '-'
      + data[i].trainType + '-' + data[i].trainNumber
    // Acordeon Title
    var acTitle = getTrainTitle(data[i]);
    // Heading
    var headId = 'head' + data[i].trainCategory + '-'
      + data[i].trainType + '-' + data[i].trainNumber

    // ------- LOOP TIMETABLE -------    

    switch(type){
      case 'optionsDeparture':
        // If it's not the end of a train
        if (data[i].timeTableRows[data[i].timeTableRows.length-1].stationShortCode!=dep) {
          // Init acordeon
          htmlContent += getAcordeonInit(acIdent, acTitle, headId);
          // Get Content
          htmlContent += loadDeparture(data[i].timeTableRows, dep);
          // End acordeon
          htmlContent += getAcordeonEnd();
        };
        break;
      case 'optionsArrival':
        // If it's not a departure
        if (data[i].timeTableRows[0].stationShortCode!=arr) {
          // Init acordeon
          htmlContent += getAcordeonInit(acIdent, acTitle, headId);
          // Get Content
          htmlContent += loadArrival(data[i].timeTableRows, dep);
          // End acordeon
          htmlContent += getAcordeonEnd();
        }
        break;
      default:
        // TODO : nothing
        break;
    } // end switch(type)

  };

  // ------- END AND PRINT -------

  // End Acordeon group
  htmlContent += '</div>'

  // Add content to the page
  $("#divResults").html(htmlContent);
}; // end : loadTimetables (data, dep, arr, type)

/**
 * Enable or disable form content based on radio button checked
 * @param {string} choice The radio button choice
 --------------------------------------------------------------------------- */
function updateOptionsChoices (choice) {
  console.log('pageTimetables.updateOptionsChoices('+choice+')');
  switch(choice){
    case "optionsDeparture":
      document.getElementById("textDeparture").disabled = false;
      document.getElementById("textArrival").disabled = true;
      document.getElementById("textArrival").value = '';
      break;
    case "optionsArrival":
      document.getElementById("textDeparture").disabled = true;
      document.getElementById("textDeparture").value = '';
      document.getElementById("textArrival").disabled = false;
      break;
    case "optionsItinerary":
      document.getElementById("textDeparture").disabled = false;
      document.getElementById("textArrival").disabled = false;
      break;
    default:
      document.getElementById("textDeparture").disabled = true;
      document.getElementById("textArrival").disabled = true;
      break;
  }
}; // end : updateOptionsChoices (choice)

/**
 * Convert date format to Humand readable
 * @param {string} date Timestam like : 2015-11-03T07:06:00.000Z
 * return {string} The new Date format like : 07:06:00 (03.11.2015)
 --------------------------------------------------------------------------- */
function getDateHuman (date) {
  var splitted = date.split("T");
  var theDate = splitted[0];
  var theTime = splitted[1].split("Z")[0].split(".")[0];
  var result = theTime + " ("
    + theDate.split("-")[2]+"."
    + theDate.split("-")[1]+"."
    + theDate.split("-")[0]+ ")"
  return result;
}; //end getDateHuman (date)


/* ============================================================================
 * MAIN
 * ========================================================================= */

/**
 * Action performed when the page is fully loaded
 --------------------------------------------------------------------------- */
$(document).ready(function($) {

  // ------- STATIONS AUTOCOMPLETE -------

  console.log("pageTimetables.listStations");
  // Init XMLHttp request
  var xhrAutoCompl = new XMLHttpRequest();
  // GET query
  xhrAutoCompl.open('GET', DIGI_STATIONS);
  // Load Content
  xhrAutoCompl.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      // Data responses from digitraffic
      var data = JSON.parse(this.responseText);
      // Loop
      for (var i = 0; i < data.length; i++) {
        var value = data[i].stationShortCode + ":" + data[i].stationName;
        listStations.push(value);
        dictStations[data[i].stationShortCode] = data[i].stationName;
      };
    }
  };
  // Sent request
  xhrAutoCompl.send();


  // ------- INVERST DEP/ARR -------

  $("#buttonInvert").on('click', function(){
    var dep = $("#textDeparture").val();
    var arr = $("#textArrival").val();
    document.getElementById("textDeparture").value = arr;
    document.getElementById("textArrival").value = dep;
    console.log("pageTimetables.buttonInvert: " + dep + "<->" + arr);
  }); //-- end $("#buttonInvert").click()


  // ------- SEARCH TIME TABLE -------

  // Form button onclick event
  $("#buttonSearch").on('click', function(){

    // Get Radio value
    var type = '';
    var radioForm = document.getElementsByName('optionsTimetable');
    for (var i = 0, length = radioForm.length; i < length; i++) {
      if (radioForm[i].checked) {
          type = radioForm[i].value;
          break;
      }
    }

    // Get Form values
    var depName = $("#textDeparture").val();
    var arrName = $("#textArrival").val();

    // Get Keys
    var depKey = depName.split(":")[0];
    var arrKey = arrName.split(":")[0];

    // Init XMLHttp request
    var xhrTimetables = new XMLHttpRequest();

    switch(type){
      case "optionsDeparture":
        // GET query
        xhrTimetables.open('GET', DIGI_TRAFFIC+depKey);
        // Load Content
        xhrTimetables.onreadystatechange = function () {
          if (this.status == 200 && this.readyState == 4) {
            loadTimetables(
              JSON.parse(this.responseText), 
              depKey, arrKey, type
            );
          }
        };
        break;
      case "optionsArrival":
        // GET query
        xhrTimetables.open('GET', DIGI_TRAFFIC+arrKey);
        // Load Content
        xhrTimetables.onreadystatechange = function () {
          if (this.status == 200 && this.readyState == 4) {
            loadTimetables(
              JSON.parse(this.responseText), 
              depKey, arrKey, type
            );
          }
        };
        break;
      case "optionsItinerary":
        //TODO
        break;
      default:
        break;
    }

    // Sent request
    xhrTimetables.send();
  }); //-- end $("#trainButton").click()

}); //--- end $(document).ready()