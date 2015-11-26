/*
|------------------------------------------------------------------------------
| Statistics page.
|------------------------------------------------------------------------------
|
| Get information from Server REST services and show summaries
|
| @author Pev
| @verion 1.0.0
|
|------------------------------------------------------------------------------
*/



// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * [Load the charts based on the charts id]
 * @param  {Number} id [ID of the charts]
 */
function stats_load (id) {
  

  // Get JSON
  $.ajax({
    type: 'GET',
    url: '../js/chartsData.json',
    // TODO REST
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      
      var title = data.result[0].title;
      var alias = data.result[0].alias;
      var value = data.result[0].value;

      console.log(title, alias, value)

      var chart;
      var legend;
      var chartData = [data.result[0].data];

      // Not work -----
      AmCharts.ready(function () {
          // PIE CHART
          chart = new AmCharts.AmPieChart();
          chart.dataProvider = chartData;
          chart.titleField = alias;
          chart.valueField = value;
          chart.outlineColor = "#FFFFFF";
          chart.outlineAlpha = 0.8;
          chart.outlineThickness = 2;

          // WRITE
          chart.write("chartdiv");
      });

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


}

/**
 * [Return array from REST servies - Getting all charts possible]
 * @return {array} [array content with list of charts]
 */
function stats_getCharts() {

  // Returned value
  var charts = [];

  // Get JSON
  $.ajax({
    type: 'GET',
    url: '../js/charts.json',
    // TODO REST
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      charts = data.result;
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

  return charts;
}

/**
 * [Default stat loader : get all charts and prepare the HTML content]
 */
function stats_init() {
  console.log("stats_init")

  // Get list of statistics
  listCharts = stats_getCharts();

  // Init the div container names
  divListCharts = 'listCharts';

  // Prepare the HTML content
  var htmlContent = "";

  // HTML content
  var htmlContent = '<select class="selectpicker" id="listOfCharts" onchange="stats_load(value);">' 
    + '<optgroup label="default">'
    + '<option value="default">-- None --</option>';

  // Loop charts name
  for (var i = listCharts.length - 1; i >= 0; i--) {
    htmlContent += '<option value="' + listCharts[i].id +'">' 
      + listCharts[i].alias + '</option>';
  }

  // Close the list
  htmlContent += '</optgroup></select>';

  // Add to list of values
  $("#"+divListCharts+"").html(htmlContent);

}

// ============================================================================
// MAIN
// ============================================================================

/**
 * Action performed when the page is fully loaded
 */
$(document).ready(function($) {

  console.log("load")

  // Init 
  stats_init();

}); //--- end $(document).ready()

