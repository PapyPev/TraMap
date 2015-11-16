DROP TABLE IF EXISTS type_roads_value;

CREATE TABLE type_roads_value(
	id int primary key,
	name text not null
);

INSERT INTO type_roads_value(id, name) VALUES (11 ,'motorway');
INSERT INTO type_roads_value(id, name) VALUES (12 ,'motorway_link');  
INSERT INTO type_roads_value(id, name) VALUES (13 ,'trunk');  
INSERT INTO type_roads_value(id, name) VALUES (14 ,'trunk_link');  
INSERT INTO type_roads_value(id, name) VALUES (15 ,'primary');  
INSERT INTO type_roads_value(id, name) VALUES (16 ,'primary_link');  
INSERT INTO type_roads_value(id, name) VALUES (21 ,'secondary');  
INSERT INTO type_roads_value(id, name) VALUES (22 ,'secondary_link');  
INSERT INTO type_roads_value(id, name) VALUES (31 ,'tertiary');
INSERT INTO type_roads_value(id, name) VALUES (32 ,'residential');
INSERT INTO type_roads_value(id, name) VALUES (41 ,'road');  
INSERT INTO type_roads_value(id, name) VALUES (42 ,'unclassified');  
INSERT INTO type_roads_value(id, name) VALUES (51 ,'service');   
INSERT INTO type_roads_value(id, name) VALUES (63 ,'living_street');   
INSERT INTO type_roads_value(id, name) VALUES (62 ,'pedestrian');  
INSERT INTO type_roads_value(id, name) VALUES (71 ,'track'); 
INSERT INTO type_roads_value(id, name) VALUES (72 ,'path');  
INSERT INTO type_roads_value(id, name) VALUES (81 ,'cycleway'); 
INSERT INTO type_roads_value(id, name) VALUES (91 ,'footway');   
INSERT INTO type_roads_value(id, name) VALUES (92 ,'steps');  
INSERT INTO type_roads_value(id, name) VALUES (100 ,'tertiary_link'); 
INSERT INTO type_roads_value(id, name) VALUES (101 ,'raceway');  
INSERT INTO type_roads_value(id, name) VALUES (102 ,'construction');  
INSERT INTO type_roads_value(id, name) VALUES (103 ,'proposed');

--ALTER TABLE roads ADD CONSTRAINT roads_type_fk FOREIGN KEY (type) REFERENCES type_roads_value(id);