<h1>Database model</h1>
<p>
    In this documentation we will explain how the data are structured and how it's use for the application. We will describe their structure, types and field names. This database model contains six tables.
</p>

<h2>Table of Content</h2>
<ul>
    <li><a href="#roads">Table : roads</a></li>
    <li><a href="#nodes">Table : nodes</a></li>
    <li><a href="#zones">Table : zones</a></li>
    <li><a href="#traffic">Table : traffic</a></li>
    <li><a href="#od_pairs">Table : od_pairs</a></li>
    <li><a href="#general_area_information">Table : general_area_information</a></li>
    <li><a href="#type_roads_value">Table : type_roads_value</a></li>
</ul>

<h2 id="roads">Table : roads</h2>
<p>
    This table contains roadlink (topology clean)
</p>

| Attribute     | Type      | Description           |
| ------------- | --------- | --------------------- |
| id            | PK integer| identificator |
| osm_id        | bigint    | OSM identificator |
| osm_name      | char      | OSM name |
| type          | FK integer| type of roads |
| source_id     | FK integer| source node of edge |
| target_id     | FK integer| target node of edge |
| length        | double    | edge (link) length in km |
| speed         | integer   | avarage speed (not accurate) km/h |
| vertical_distance_pos | double    | positive verical distance (positive value e.g. +4.56) |
| vertical_distance_neg | double    | negative verical distance (negative value e.g. -4.56) |
| oneway                | boolean   | true if edge is oneway |
| geometry              | gemotery  | line |

<u>Information</u> :<br> 
<ul>
    <li>type : more information in <code>srv/data/osm2po.config</code></li>
    <li>cost : computed from speed and length</li>
    <li>vertical_distance_pos/neg: value corespondes in positive direction</li>
</ul>

<h2 id="nodes">Table : nodes</h2>
<p>
    This table contains all nodes in graph (all junkers)
</p>

| Attribute     | Type      | Description           |
| ------------- | --------- | --------------------- |
| id            | PK bigint | identificator         |
| geometry      | geometry  | gemotery of node      |
| osm_id        | bigint    | OSM node ID           |


<h2 id="zones">Table : zones</h2>
<p>
    This table contains point of interest for transport modeling like shop, school, ... and home type point (for living)
</p>

| Attribute     | Type      | Description           |
| ------------- | --------- | --------------------- |
| id            | PK integer| identificator |
| node_id       | FK bigint | id of node (nearest node) |
| names         | text      | node name |
| num_of_people | integer   | number of people who live in the zones |
| type          | char      | zones type |
| subtype       | char      | zones subtype |
| age_FROM_TO   | double    | percentage of people split by age category |
| valid         | boolean   | is valid?|
| geometry      | geometry  | point |

<u>Information</u> : <br>
<ul>
    <li>num_of_people : number of people who live in the zones (for type home) or travel to the zones (for other type)</li>
</ul>

<h2 id="traffic">Table : traffic</h2>
<p>
    This table contains Trafic for roads.
</p>

| Attribute     | Type      | Description           |
| ------------- | --------- | --------------------- |
| id            | PK integer| identificator |
| road_id       | FK integer| road edge |
| traffic       | double    | traffic value |
| direction     | boolean   | positive or reverse direction |

<u>Information</u> : <br>
<ul>
    <li>traffic : number of trip per day</li>
    <li>direction : true - positive direction , false - reverse direction</li>
</ul>

<h2 id="od_pairs">Table : od_pairs</h2>
<p>
    This table contains number of trip from origin to destination zones
</p>

| Attribute     | Type      | Description           |
| ------------- | --------- | --------------------- |
| id            | PK integer| identificator |
| origin_id     | FK integer| origin zone |
| destination   | FK integer| destination zone |
| num_of_trip   | double    | number of trip from Origin to Destination |

<h2 id="general_area_information">Table : general_area_information</h2>
<p>
    This table contains informations about area for transport modeling. 
</p>

| Attribute     | Type      | Description           |
| ------------- | --------- | --------------------- |
| id            | PK integer| identificator |
| name          | text      | area name |
| walking       | double    | number of trip per day on one person (by foot) |
| cycling       | double    | number of trip per day on one person (by bike) |
| driver        | double    | number of trip per day on one person (by car) |
| geometry      | geometry  | area definition, polygon |

<h2 id="type_roads_value">Table : type_roads_value</h2>
<p>
    This table contains type name of roads
</p>

| Attribute     | Type      | Description           |
| ------------- | --------- | --------------------- |
| id            | PK integer| identificator |
| name          | text      | type name |


