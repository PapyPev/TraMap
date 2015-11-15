from itertools import *
import datetime

def age_group(age):
	age_list = [0,6,12,15,18,30,45,65,85,150]
	for i in range(0,len(age_list)-1):
		if age >= age_list[i] and age < age_list[i+1]:
			return i
		

y = datetime.datetime.today().year
geom = '0101000020110F0000844EEB3DE2204541104C7AC571476041'
node = 690719

sql = """INSERT INTO zones(
            id, node_id, name, num_of_people, geometry, type, subtype, age_00_05, 
            age_06_11, age_12_14, age_15_17, age_18_29, age_30_44, age_45_64, 
            age_65_79, age_80_99)
    VALUES (DEFAULT, %i, '%s', %i, '%s', '%s', null, %f, 
            %f, %f, %f, %f, %f, %f, 
            %f, %f);\n"""

f = file("dem2.csv","r")
l = []
for r in f:
	l.append(r.rstrip().split(","))

gl = []
fo = file("insetr_dem2.sql","w")
for i,j in groupby(l, lambda x: x[0]):
	tl = map(lambda x: age_group(y - int(x[1])),list(j))
	age_map = [0,0,0,0,0,0,0,0,0]
	aa = [(c,len(list(cgen))) for c,cgen in groupby(tl)]
	for age_i, num in aa:
		age_map[age_i] = num
	age_map_pr = map(lambda x: float(x)/sum(age_map),age_map)
	#gl.append((i,sum(age_map),age_map_pr))
	sql_list = [node,i,sum(age_map),geom,"home"]+age_map_pr
	#print sql_list

	fo.write(sql %tuple(sql_list))





