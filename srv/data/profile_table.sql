drop table if exists profile;
create table profile as
select id, rp.cant(p,true) as pos, rp.cant(p,false) as neg , p as profile from
(select id, rp.profile('dtm',st_transform,10) as p from roads_temp) as foo
