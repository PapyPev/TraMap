/*
|------------------------------------------------------------------------------
| Page Stations Script
|------------------------------------------------------------------------------
|
| List of all stations informations from digitraffic.
| All function with "ts_" prefix is for Table station
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

var DIGI_STATIONS = 'http://rata.digitraffic.fi/api/v1/metadata/stations';

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Load HTML content for Stations informations]
 * @param  {json} data [Response from digitraffic]
 */
function ts_loadHtmlStationList(data) {

  // Init the html return value
  var htmlContent = '';

  // Prepare table
  htmlContent += '<table class="table table-striped">';
  htmlContent += '<thead>';
  htmlContent +=  '<tr>';
  htmlContent +=    '<th>Name</th>';
  htmlContent +=    '<th>Code</th>';
  htmlContent +=    '<th>UIC</th>';
  htmlContent +=    '<th>Lat</th>';
  htmlContent +=    '<th>Lon</th>';
  htmlContent +=  '</tr>';
  htmlContent += '</thead>';
  htmlContent += '<tbody>';

  // Loop all stations objects
  for (var i = 0; i < data.length; i++) {
    
    // Verification if the train take passengers
    if (data[i].passengerTraffic) {
      htmlContent += '<tr>';
      htmlContent += '<td>'+data[i].stationName+'</td>';
      htmlContent += '<td>'+data[i].stationShortCode+'</td>';
      htmlContent += '<td>'+data[i].stationUICCode+'</td>';
      htmlContent += '<td>'+data[i].latitude+'</td>';
      htmlContent += '<td>'+data[i].longitude+'</td>';
      htmlContent += '</tr>';
    }
    
  }

  // End table
  htmlContent += '</tbody>';
  htmlContent += '</table>';

  // Print HTML content
  $("#divStations").html(htmlContent);
} //-- end ts_loadHtmlStationList(data)

// ============================================================================
// MAIN
// ============================================================================

/**
 * Action performed when the page is fully loaded
 */
$(document).ready(function($) {

  // Init XMLHttp request
  var xhr = new XMLHttpRequest();

  // GET query
  xhr.open('GET', DIGI_STATIONS);

  // Load Content
  xhr.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
      ts_loadHtmlStationList(JSON.parse(this.responseText));
    }
  };

  // Sent request
  xhr.send();
}); //--- end $(document).ready()
