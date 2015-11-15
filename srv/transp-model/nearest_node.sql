INSERT INTO zones(node_id, name,people, geometry, type)
select nid, name,0 , geometry, type from (

select (array_agg(nid) over(partition by aid order by d))[1] as nid,
aid, 
min(d) over(partition by aid) as d,
name,
type,
geometry
from

(select a.geometry,a.name,a.type,n.id as nid, a.id as aid, ST_Distance(ST_Transform(n.geometry, 3857),a.geometry) as d
from nodes as n, import.osm_shop as a
where ST_Dwithin(ST_Transform(n.geometry, 3857),a.geometry,200)) as t

 ) as e
 group by nid,d,aid,name,type,geometry
  
