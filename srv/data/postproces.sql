--SELECT  pgr_createVerticesTable('fin_2po_4pgr','geom_way','source','target');
--ALTER TABLE fin_2po_4pgr_vertices_pgr RENAME TO nodes;
--ALTER TABLE nodes DROP COLUMN cnt;
--ALTER TABLE nodes DROP COLUMN chk;
--ALTER TABLE nodes DROP COLUMN ein;
--ALTER TABLE nodes DROP COLUMN eout;
--ALTER TABLE nodes RENAME COLUMN the_geom TO geometry;

--ALTER TABLE fin_2po_4pgr RENAME TO roads;
--ALTER TABLE roads DROP COLUMN osm_meta;
--ALTER TABLE roads DROP COLUMN flags;
--ALTER TABLE roads RENAME COLUMN km to length;
--ALTER TABLE roads RENAME COLUMN kmh to speed;
--ALTER TABLE roads RENAME COLUMN geom_way to geometry;

--ALTER TABLE roads ADD CONSTRAINT roads_target_fk FOREIGN KEY (target)
--      REFERENCES nodes(id);

--ALTER TABLE roads ADD CONSTRAINT roads_source_fk FOREIGN KEY (source)
--      REFERENCES nodes(id);

