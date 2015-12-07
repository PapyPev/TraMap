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
// GLOBALS
// ============================================================================

var chartsJSON = {
  "status": "ok",
  "results": [

    {
      "title": "Beers in Country",
      "alias": "Country",
      "value": "nb of beers",
      "data": [
        {
          "alias": "Czech Republic",
          "value": 301.90
        }, 
        {
          "alias": "Ireland",
          "value": 201.10
        }, 
        {
          "alias": "Germany",
          "value": 165.80
        }, 
        {
          "alias": "Australia",
          "value": 139.90
        }, 
        {
          "alias": "Austria",
          "value": 128.30
        }, 
        {
          "alias": "UK",
          "value": 99.00
        }, 
        {
          "alias": "Belgium",
          "value": 60.00
        }
      ]
    }

  ]
}




var listStats = [];

var chart;

var chartData = [
  {
      "year": 2005,
      "income": 23.5,
      "expenses": 18.1
  },
  {
      "year": 2006,
      "income": 26.2,
      "expenses": 22.8
  },
  {
      "year": 2007,
      "income": 30.1,
      "expenses": 23.9
  },
  {
      "year": 2008,
      "income": 29.5,
      "expenses": 25.1
  },
  {
      "year": 2009,
      "income": 24.6,
      "expenses": 25
  }
];


AmCharts.ready(function () {
  // SERIAL CHART
  chart = new AmCharts.AmSerialChart();
  chart.dataProvider = chartData;
  chart.categoryField = "year";
  chart.startDuration = 1;
  chart.rotate = false;

  // AXES
  // category
  var categoryAxis = chart.categoryAxis;
  categoryAxis.gridPosition = "start";
  categoryAxis.axisColor = "#DADADA";
  categoryAxis.dashLength = 3;

  // value
  var valueAxis = new AmCharts.ValueAxis();
  valueAxis.dashLength = 3;
  valueAxis.axisAlpha = 0.2;
  valueAxis.position = "top";
  valueAxis.title = "Million USD";
  valueAxis.minorGridEnabled = true;
  valueAxis.minorGridAlpha = 0.08;
  valueAxis.gridAlpha = 0.15;
  chart.addValueAxis(valueAxis);

  // GRAPHS
  // column graph
  var graph1 = new AmCharts.AmGraph();
  graph1.type = "column";
  graph1.title = "Income";
  graph1.valueField = "income";
  graph1.lineAlpha = 0;
  graph1.fillColors = "#ADD981";
  graph1.fillAlphas = 0.8;
  graph1.balloonText = "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>";
  chart.addGraph(graph1);

  // line graph
  var graph2 = new AmCharts.AmGraph();
  graph2.type = "line";
  graph2.lineColor = "#27c5ff";
  graph2.bulletColor = "#FFFFFF";
  graph2.bulletBorderColor = "#27c5ff";
  graph2.bulletBorderThickness = 2;
  graph2.bulletBorderAlpha = 1;
  graph2.title = "Expenses";
  graph2.valueField = "expenses";
  graph2.lineThickness = 2;
  graph2.bullet = "round";
  graph2.fillAlphas = 0;
  graph2.balloonText = "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b></span>";
  chart.addGraph(graph2);

  // LEGEND
  var legend = new AmCharts.AmLegend();
  legend.useGraphSettings = true;
  chart.addLegend(legend);

  chart.creditsPosition = "top-right";

  // WRITE
  chart.write("chartdiv");
});


/**
 * [Return json value from REST servies - Getting all charts possible]
 * @return {json} [Json content with list of charts]
 */
function stats_getCharts() {

  // Returned value
  var charts = [];

  // Get JSON
  $.ajax({
    type: 'GET',
    url: restProperties.getAddress() + "/",
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data){
      if (data.status === "ok") {
        for (var i = data.response.length - 1; i >= 0; i--) {
          charts.push(data.response[i]);
        };
      }
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

  // Get list of statistics
  //stats_getCharts();
  listStats.push("Beers");

  // Init the div container names
  divListCharts = 'listCharts';

  // Prepare the HTML content
  var htmlContent = "";

  // HTML content
  var htmlContent = '<select class="selectpicker" id="llistOfCharts">' 
    + '<optgroup label="default">'
    + '<option value="default">-- All --</option>';

  // Loop charts name
  for (var i = listStats.length - 1; i >= 0; i--) {
    htmlContent += '<option value=' + i + '>' + listStats[i] + '</option>';
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

  // Init 
  stats_init();

}); //--- end $(document).ready()

