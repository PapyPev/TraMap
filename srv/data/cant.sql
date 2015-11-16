CREATE OR REPLACE FUNCTION rp.cant(IN pole double precision[],IN pozitive boolean)
  RETURNS double precision AS
$BODY$
#pozitive: pozitive (true) or negative(false) cant 
pos = 0
neg = 0
for i in xrange(1,len(pole)):
	cant = pole[i] - pole[i - 1]
	if cant > 0:
		pos += cant
	else:
		neg += cant

if pozitive:
	return pos
else:
	return neg

$BODY$
  LANGUAGE plpythonu;
