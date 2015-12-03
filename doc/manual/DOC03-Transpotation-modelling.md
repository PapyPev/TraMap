<h1>Transpotation modelling</h1>
<h2>Tutorial</h2>

<p>This tutorial is for Debian based distribution (Debian, Ubuntu, Mint, Lubuntu, ...)</p>

<h3>What you need?</h3>

<li>PostgeSQL database with <a href="http://postgis.net/">PostGIS extension</a></li>
<li><a href="http://www.qgis.org">QGIS</a></li>

<p>Download folder <a href="https://github.com/PapyPev/TraMap/tree/master/srv">srv/</a>.</p>

<h3>Database</h3>
<p>
	Create example database:
	<br><code>cd $ROOT/srv/data/example</code>
	<br><code>psql -d $DBNAME -f db_schema.sql</code>
	<br><code>psql -d $DBNAME -f tramap_backup.sql</code>
</p>
<p>
	Now you can inspect example data in QGIS. You should see roads, nodes and zones.
	<img src="DOC02-Database/screen.png">
</p>
<p>
	We have database with example data. Now we have to configure <code>srv/src/transp_model/db_settings.py.templete.py</code>. In this file you must set information about database like username, password, port, ... and rename to <code>db_settings.py</code>
</p>
<p>
	<code>SELECT r.geometry, t.* FROM tramap.traffic as t, tramap.roads as r WHERE t.road_id = r.id;</code>
</p>

