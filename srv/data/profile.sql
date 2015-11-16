CREATE OR REPLACE FUNCTION rp.profile(IN dtm_table text, IN line geometry, IN step int)
  RETURNS double precision[] AS
$BODY$

sql = """select array_agg(ST_value(dtm.rast, foo.geom) order by ord) as profile from
(select (p).path[1] as ord,(p).geom from
(select st_dumppoints(st_segmentize('%s'::geometry,%i)) as p) as foo1) as foo,
%s as dtm
where ST_intersects(dtm.rast, foo.geom);""" 
return plpy.execute(sql % (line, step, dtm_table))[0]['profile']

$BODY$
  LANGUAGE plpythonu;