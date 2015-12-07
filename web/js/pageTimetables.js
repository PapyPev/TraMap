/*
|------------------------------------------------------------------------------
| Page Timetables Script
|------------------------------------------------------------------------------
|
| Script load on Timetable page ; get Stations autocomplete and search script.
| All function with "tt_" prefix is for TimeTables
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
// CONSTANTS
// ============================================================================

var DIGI_TRAFFIC = 'http://rata.digitraffic.fi/api/v1/live-trains?station=';
var DIGI_STATIONS = 'http://rata.digitraffic.fi/api/v1/metadata/stations';

// ============================================================================
// GLOBALS
// ============================================================================

var dictStations = {};
var listStations = [];

// ============================================================================
// FUNCTIONS AUTOLOAD
// ============================================================================

// Autocomplete for Departure
$(function() {
  $( "#textDeparture" ).autocomplete({
    source: listStations
  });
});

// ----------------------------------------------------------------------------

// Autocomplet for Arrival
$(function() {
  $( "#textArrival" ).autocomplete({
    source: listStations
  });
});

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Return the name of the station by the code]
 * @param  {String} code [The city short code]
 * @return {String}      [The station's name]
 */
function tt_getStationName (code) {
  return dictStations[code];
} //-- end tt_getStationName (code)

// ----------------------------------------------------------------------------

/**
 * [Convert date format to Humand readable]
 * @param  {String} date [Timestam like : 2015-11-03T07:06:00.000Z]
 * @return {String}      [The new Date format like : 07:06:00
 * (03.11.2015)]
 */
function convert_dateForHuman (date) {
  var splitted = date.split("T");
  var theDate = splitted[0];
  var theTime = splitted[1].split("Z")[0].split(".")[0];
  var result = theTime + " ("
    + theDate.split("-")[2]+"."
    + theDate.split("-")[1]+"."
    + theDate.split("-")[0]+ ")";
  return result;
} //-- end convert_dateForHuman (date)

// ----------------------------------------------------------------------------

/**
 * [Return a String for the Acordeon html end content]
 * @return {String} [The Acordeon HTML end]
 */
function tt_acordeonHtmlEnd () {

  // Init HTML content
  var htmlContent = '';

  // End Container
  htmlContent += '</tbody>';
  htmlContent += '</table>';
  htmlContent += '</div>';
  htmlContent += '</div>';
  htmlContent += '</div>';
  htmlContent += '</div>';

  //Return content
  return htmlContent;
} //-- end : tt_acordeonHtmlEnd ()

// ----------------------------------------------------------------------------

/**
 * [Return a String for the Acordeon html begin content]
 * @param  {String} acIdent [Identification name of content]
 * @param  {String} acTitle [Human name of the acordeon (visible)]
 * @param  {String} headId  [Link betwin accordeon and drop down]
 * @return {String}         [The Acordeon HTML initialisation]
 */
function tt_acordeonHtmlInit (acIdent, acTitle, headId) {

  // Init HTML content
  var htmlContent = '';

  // Make Container
  htmlContent += '<div class="panel panel-default">';
  htmlContent += '<div class="panel-heading" role="tab" id="'+headId+'">';
  htmlContent += '<h4 class="panel-title">';
  htmlContent += '<a role="button" data-toggle="collapse" '
    + 'data-parent="#accordion" href="#'+acIdent+'" '
    + 'aria-expanded="true" aria-controls="'+acIdent+'">'
    + acTitle;
  htmlContent += '</a>';
  htmlContent += '</h4>';
  htmlContent += '</div>';
  htmlContent += '<div id="'+acIdent+'" '
    + 'class="panel-collapse collapse" role="tabpanel" '
    + 'aria-labelledby="'+headId+'">';
  htmlContent += '<div class="panel-body">';
  htmlContent += '<div class="table-responsive">';
  htmlContent += '<table class="table table-striped">';
  htmlContent += '<thead>';
  htmlContent += '<tr>';
  htmlContent += '<th>Status</th>';
  htmlContent += '<th>Station</th>';
  htmlContent += '<th>ScheduledTime</th>';
  htmlContent += '<th>CommercialTrack</th>';
  htmlContent += '</tr>';
  htmlContent += '</thead>';
  htmlContent += '<tbody>';

  //Return content
  return htmlContent;
} // end : tt_acordeonHtmlInit (acIdent, acTitle, headId)

// ----------------------------------------------------------------------------

/**
 * [Generate the title of the dropdown widget]
 * @param  {json} data [All train informations]
 * @return {String}      [Title of the dropdown]
 */
function tt_acordeonTrainTitle (data) {
  var type = data.trainType;
  var depKey = data.timeTableRows[0].stationShortCode;
  var depName = dictStations[depKey];
  var lastE = data.timeTableRows.length-1;
  var arrKey = data.timeTableRows[lastE].stationShortCode;
  var arrName = dictStations[arrKey];
  var trainNum = data.trainNumber;
  var title = type + ' - ' + depName + ' > ' + arrName 
    + ' (num:' + trainNum + ')';
  return title;
} // end : tt_acordeonTrainTitle (data)

// ----------------------------------------------------------------------------

/**
 * [Generate HTML Timetables content Arrival]
 * @param  {json} data [Digitraffic data : Timetables]
 * @return {String}      [Timetables HTML content]
 */
function tt_acordeonHtmlArrival (data) {

  // Init returned value
  var htmlContent = '';

  // Loop all Timetables
  for (var i = 0; i < data.length; i++) {

    // Start and End
    if (i === 0 || i == data.length-1) {
      // Init rows
      htmlContent += '<tr>';
      // Test type
      if (data[i].type == 'DEPARTURE') {
        htmlContent += '<td><span class="flaticon-double4"></span></td>';
      } else if (data[i].type == "ARRIVAL"){
        htmlContent += '<td><span class="flaticon-double5"></span></td>';
      }
      // Content
      htmlContent += '<td>'+tt_getStationName(data[i].stationShortCode)+'</td>';
      htmlContent += '<td>'+convert_dateForHuman(data[i].scheduledTime)+'</td>';
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
        htmlContent += '<td>'+tt_getStationName(data[i].stationShortCode)+'</td>';
        htmlContent += '<td>'+convert_dateForHuman(data[i].scheduledTime)+'</td>';
        htmlContent += '<td>'+data[i].commercialTrack+'</td>';
        // End rows
        htmlContent += '</tr>';
      }
    }

  } // end Loop all Timetables

  // Return value
  return htmlContent;
} //-- end tt_acordeonHtmlArrival (data, codeCity)

// ----------------------------------------------------------------------------

/**
 * [Generate HTML Timetables content Departure]
 * @param  {json} data [Digitraffic data : Timetables]
 * @return {String}      [Timetables HTML content]
 */
function tt_acordeonHtmlDeparture (data) {

  // Init returned value
  var htmlContent = '';

  // Loop all Timetables
  for (var i = 0; i < data.length; i++) {

    // Start and End
    if (i === 0 || i == data.length-1) {
      // Init rows
      htmlContent += '<tr>';
      // Test type
      if (data[i].type == 'DEPARTURE') {
        htmlContent += '<td><span class="flaticon-double4"></span></td>';
      } else if (data[i].type == "ARRIVAL"){
        htmlContent += '<td><span class="flaticon-double5"></span></td>';
      }
      // Content
      htmlContent += '<td>'+tt_getStationName(data[i].stationShortCode)+'</td>';
      htmlContent += '<td>'+convert_dateForHuman(data[i].scheduledTime)+'</td>';
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
        htmlContent += '<td>'+tt_getStationName(data[i].stationShortCode)+'</td>';
        htmlContent += '<td>'+convert_dateForHuman(data[i].scheduledTime)+'</td>';
        htmlContent += '<td>'+data[i].commercialTrack+'</td>';
        // End rows
        htmlContent += '</tr>';
      }
    }

  } // end Loop all Timetables

  // Return value
  return htmlContent;
} //-- end tt_acordeonHtmlDeparture (data, codeCity)

// ----------------------------------------------------------------------------

/**
 * [Generate HTML content for Timetables]
 * @param  {json} data [Response from digitraffic]
 * @param  {String} dep  [City short code for Departure]
 * @param  {String} arr  [City short code for Arrival]
 * @param  {String} type [Type of Timetables to load (optionsDeparture
 * or optionsArrival)]
 */
function tt_acordeonHtmlMain (data, dep, arr, type) {

  // ------- INIT -------

  // Init html content
  var htmlContent = '';

  // Init Acordeon group
  htmlContent += '<div class="panel-group" id="accordion" '
    + 'role="tablist" aria-multiselectable="true">';

  // ------- LOOP TRAIN -------

  for (var i = 0; i < data.length; i++) {

    // Acordeon ID
    var acIdent = 'id' + data[i].trainCategory + '-'
      + data[i].trainType + '-' + data[i].trainNumber;
    // Acordeon Title
    var acTitle = tt_acordeonTrainTitle(data[i]);
    // Heading
    var headId = 'head' + data[i].trainCategory + '-'
      + data[i].trainType + '-' + data[i].trainNumber;

    // ------- LOOP TIMETABLE -------    

    switch(type){
      case 'optionsDeparture':
        // If it's not the end of a train
        if (data[i].timeTableRows[data[i].timeTableRows.length-1].stationShortCode!=dep) {
          // Init acordeon
          htmlContent += tt_acordeonHtmlInit(acIdent, acTitle, headId);
          // Get Content
          htmlContent += tt_acordeonHtmlDeparture(data[i].timeTableRows);
          // End acordeon
          htmlContent += tt_acordeonHtmlEnd();
        }
        break;
      case 'optionsArrival':
        // If it's not a departure
        if (data[i].timeTableRows[0].stationShortCode!=arr) {
          // Init acordeon
          htmlContent += tt_acordeonHtmlInit(acIdent, acTitle, headId);
          // Get Content
          htmlContent += tt_acordeonHtmlArrival(data[i].timeTableRows);
          // End acordeon
          htmlContent += tt_acordeonHtmlEnd();
        }
        break;
      default:
        // TODO : nothing
        break;
    } // end switch(type)

  } // end Loop Train

  // ------- END AND PRINT -------

  // End Acordeon group
  htmlContent += '</div>';

  // Add content to the page
  $("#divResults").html(htmlContent);

} //-- end : tt_acordeonHtmlMain (data, dep, arr, type)

// ----------------------------------------------------------------------------

/**
 * [Enable or disable form content based on radio
 * button checked]
 * @param  {String} choice [The radio button choice id]
 */
function tt_radioUpdateForm (choice) {
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
} //-- end : tt_radioUpdateForm (choice)

// ============================================================================
// MAIN
// ============================================================================

/**
 * Action performed when the page is fully loaded
 */
$(document).ready(function($) {

  // ------- STATIONS AUTOCOMPLETE -------

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
      }
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
            tt_acordeonHtmlMain(
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
            tt_acordeonHtmlMain(
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