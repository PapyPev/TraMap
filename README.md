# TraMap
In Finland, cycling, walking and public transport are increasingly used, it becomes necessary to bring the most useful information possible means in order to anticipate the movements.

In the current era, companies are always on the lookout for new products, particularly in the GIS domain, either issue new tools or technology. Each companies develop and market their traffic information tools. That is why our project is centered on the sharing of information and free access to sources and data.

Today, open source and open data sources of information are increasingly used and allow to evolve in cooperative community. Our main objective for this project is to recover the data and open source tools on which anyone could build or develop a data model of consultation on transportation habits of a city.

### Results

You can see the <a href="https://youtu.be/MeVcQAZ-tio">demo video.</a><br>
Report form project is <a href="doc/report/main.pdf">readable here.</a><br>
Manual is <a href="doc/manual">here.</a>

### Members

<ul>
  <li><b>Janne Rautio</b>: HAMK Supervisor</li>
  <li><b>Taina Haapamaki</b>: Ramboll Supervisor</li>
  <li><b>Frantisek Kolovský</b>: Exchange Student (CZ)</li>
  <li><b>Pierre Vrot</b>: Exchange Student (FR)</li>
</ul>

### Activities

You can follow our daily activities here : <br>
<a href="https://docs.google.com/spreadsheets/d/1jvHHMdqabpGf975vlxvEoDbC6yT3SY6uP99_pAy3raw/edit?usp=sharing">Google Calc - MapProject Activities</a>

### Background

Prediction of walking and cycling, the number of users there is no standardized methods exist in Finland. In some consultants to have its own prediction models (eg. Strafica Brutus), which is used to work a certain level of accuracy. Identification of the user potential, is a very important project planning and mutual comparison of circumstance. Widely available in Finland spatial data (RHR, YKR) would enable the number of users of the evaluation of spatial analysis. Ramboll Finland Oy has carried out research on the development of demand modeling. Work is still at an early stage and this work would be possible to promote walking and cycling, demand modeling development. The project would link smoothly to one of HAMK ongoing project work (see. Below) and Ramboll development.

### Content of the work

The trainee tasks would include a description and assessment of appropriate use of spatial data where possible. The work should evaluate which are the key variables in forecasting demand (land use, demographics, infrastructure, etc.). After this step should be to evaluate what data is available in Finland (pay / free), and how well these materials are suitable for predicting in advance the estimated demand potential? After the background of the survey defined evaluation framework to make the actual forecast. The forecast would be made responsible for the area where the project is implemented Lempäälän. This maximizes the information obtained through the theoretical data and computations carried out in the terrain as a good match.

### Data sources

<ul>
  <li>Wallpaper Tiles (from OpenStreetMap and MapBox) </li>
  <li>The road network (from OpenStreetMap) </li>
  <li>Demography (of the city, region, country - from Hyvinkää) </li>
  <li>A digital elevation model (altitude - from ??) </li>
  <li>Public or not transport (train, bus - from Hyvinkää) </li>
  <li>Travel Habits (car, bicycle, walking - from ??) </li>
</ul>

### Data sources

Done :
<ul>
  <li>Background Tiles - <a href="http://a.tiles.mapbox.com/v3/mapbox/maps.html">Mapbox</a></li>
  <li>Roads, Buildings, POI - <a href="http://download.geofabrik.de/europe.html">OSM/Geofabrik</a></li>
</ul>

In progress : 
<ul>
  <li>Weather Data - <a href="http://en.ilmatieteenlaitos.fi/open-data-manual">Ilmatieteenlaitos</a></li>
  <li>Train traffic - <a href="http://rata.digitraffic.fi/api/v1/doc/index.html">Digitraffic API</a></li>
  <li>Demographic Data - <a href="http://pxnet2.stat.fi/PXWeb/pxweb/en/StatFin/StatFin__vrm__tyokay/?rxid=b6c650f0-64c9-4f15-947c-ff21a6a21740">PX-web API</a></li>
</ul>

### Applications API

<ul>
  <li><a href="http://leafletjs.com/">Leaflet</a></li>
  <ul>
    <li><a href="https://github.com/Turbo87/leaflet-sidebar">Extension - Sidebar</a></li>
    <li><a href="https://github.com/CliffCloud/Leaflet.EasyButton">Extension - Easy Button</a></li>
    <li><a href="https://github.com/calvinmetcalf/leaflet-ajax">Extension - Ajax</a></li>
  </ul>
  <li><a href="http://getbootstrap.com/">Bootstrap</a></li>
  <ul>
    <li><a href="http://silviomoreto.github.io/bootstrap-select/">Extension - Select</a></li>
  </ul>
  <li><a href="http://www.amcharts.com/">amCharts</a></li>
  <li><a href="https://cordova.apache.org/">Cordova</a></li>
</ul>

### Tools used

<ul>
  <li><a href="http://www.sublimetext.com/">Sublime Text Editor</a></li>
  <li><a href="https://github.com/spadgos/sublime-jsdocs">SublimeText: Package: DocBlockr</a></li>
  <li><a href="https://github.com/jsdoc3/jsdoc">JSDoc (generate documentation)</a></li>
</ul>

### Informations

<b> Janne </b>
<ul>
  <li><a href="http://www.paikkatietoikkuna.fi">www.paikkatietoikkuna.fi</a><br></li>
  <li><a href="http://www.digitraffic.fi">www.digitraffic.fi</a><br></li>
  <li><a href="http://www.digiroad.fi">www.digiroad.fi</a><br></li><br>
  <li><a href="http://portal.liikennevirasto.fi/sivu/www/e/fta/research_development/national_travel_survey/results">information about finnish travel patterns</li>
  <li><a href="http://www.vrk.fi/default.aspx?id=40">Building and Dwelling Register (vr)</a></li>
  <li><a href="http://www.scirp.org/journal/articles.aspx?searchCode=+Origin-Destination+Estimation&searchField=keyword&page=1&SKID=0">Scientif Research - Origin-Destination Estimation</a></li><br>
  <li><a href="https://en.ilmatieteenlaitos.fi/open-data">Meteorological data (Weather)</li>
  <li><a href="http://www.reittiopas.fi/en/">Public Transport (Demography)</a></li>
  <li><a href="http://portal.liikennevirasto.fi/sivu/www/e/fta/research_development/national_travel_survey">National Travel Survey</a></li>
</ul>

<b> Taina </b>
<ul>
  <li>Work Places 1 - <a href="http://pxnet2.stat.fi/PXWeb/pxweb/en/StatFin/StatFin__vrm__tyokay/?rxid=b6c650f0-64c9-4f15-947c-ff21a6a21740">PXnet2</a></li>
  <li>Work Places 2 - <a href="http://www.stat.fi/tup/rajapintapalvelut/paavo_en.html">Stat.fi</a></li>
</ul>


