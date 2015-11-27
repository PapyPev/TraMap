CREATE SCHEMA IF NOT EXISTS tramap;

DROP TABLE IF EXISTS tramap.type_roads_value CASCADE;
DROP TABLE IF EXISTS tramap.roads CASCADE;
DROP TABLE IF EXISTS tramap.nodes CASCADE;
DROP TABLE IF EXISTS tramap.general_area_information CASCADE;
DROP TABLE IF EXISTS tramap.traffic CASCADE;
DROP TABLE IF EXISTS tramap.od_pairs CASCADE;
DROP TABLE IF EXISTS tramap.zones CASCADE;


CREATE TABLE tramap.general_area_information
(
  id serial NOT NULL PRIMARY KEY,
  name text NOT NULL,
  walking double precision,
  cycling double precision,
  driver double precision,
  geometry geometry(MultiPolygon,3857)
);

CREATE TABLE tramap.type_roads_value(
	id int PRIMARY KEY,
	name text NOT NULL
);

INSERT INTO tramap.type_roads_value(id, name) VALUES (11 ,'motorway');
INSERT INTO tramap.type_roads_value(id, name) VALUES (12 ,'motorway_link');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (13 ,'trunk');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (14 ,'trunk_link');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (15 ,'primary');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (16 ,'primary_link');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (21 ,'secondary');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (22 ,'secondary_link');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (31 ,'tertiary');
INSERT INTO tramap.type_roads_value(id, name) VALUES (32 ,'residential');
INSERT INTO tramap.type_roads_value(id, name) VALUES (41 ,'road');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (42 ,'unclassified');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (51 ,'service');   
INSERT INTO tramap.type_roads_value(id, name) VALUES (63 ,'living_street');   
INSERT INTO tramap.type_roads_value(id, name) VALUES (62 ,'pedestrian');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (71 ,'track'); 
INSERT INTO tramap.type_roads_value(id, name) VALUES (72 ,'path');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (81 ,'cycleway'); 
INSERT INTO tramap.type_roads_value(id, name) VALUES (91 ,'footway');   
INSERT INTO tramap.type_roads_value(id, name) VALUES (92 ,'steps');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (100 ,'tertiary_link'); 
INSERT INTO tramap.type_roads_value(id, name) VALUES (101 ,'raceway');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (102 ,'construction');  
INSERT INTO tramap.type_roads_value(id, name) VALUES (103 ,'proposed');

CREATE TABLE tramap.nodes
(
  id integer NOT NULL PRIMARY KEY,
  geometry geometry(Point,3857),
  osm_id bigint
);

CREATE TABLE tramap.zones
(
  id serial NOT NULL PRIMARY KEY,
  node_id integer REFERENCES tramap.nodes(id) NOT NULL,
  name text,
  num_of_people integer NOT NULL,
  geometry geometry(Point,3857),
  type character varying(50),
  subtype character varying,
  age_00_05 double precision,
  age_06_11 double precision,
  age_12_14 double precision,
  age_15_17 double precision,
  age_18_29 double precision,
  age_30_44 double precision,
  age_45_64 double precision,
  age_65_79 double precision,
  age_80_99 double precision,
  valid boolean
);

CREATE TABLE tramap.od_pairs
(
  id serial NOT NULL PRIMARY KEY,
  origin_id integer NOT NULL REFERENCES tramap.zones(id),
  destination_id integer NOT NULL REFERENCES tramap.zones(id),
  num_of_trip double precision NOT NULL
);

CREATE TABLE tramap.roads
(
  id integer NOT NULL PRIMARY KEY,
  osm_id bigint,
  osm_name character varying,
  type integer REFERENCES tramap.type_roads_value (id)  NOT NULL,
  source_id integer REFERENCES tramap.nodes (id) NOT NULL,
  target_id integer REFERENCES tramap.nodes (id)  NOT NULL,
  length double precision,
  speed integer,
  oneway boolean  NOT NULL,
  speed_bike integer,
  vertical_distance_pos double precision,
  vertical_distance_neg double precision,
  geometry geometry(LineString,3857)
);

CREATE TABLE tramap.traffic
(
  id serial NOT NULL PRIMARY KEY,
  road_id integer REFERENCES tramap.roads(id) NOT NULL,
  traffic double precision NOT NULL,
  direction boolean NOT NULL
);