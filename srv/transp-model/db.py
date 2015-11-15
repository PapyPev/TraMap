__author__ = 'kolovsky'
import psycopg2
import numpy as np
import settings as s

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(database=s.database, user=s.username, password=s.password,host=s.host)
        self.cur = self.conn.cursor()
        sql = "SELECT geometry from general_area_information where name = %s"
        self.cur.execute(sql,[s.area_name])
        self.area_geometry = self.cur.fetchall()[0][0]

    def get_od(self):
        sql = "SELECT num_of_people from zones where ST_Intersects(geometry,%s) and valid order by id"
        self.cur.execute(sql ,[self.area_geometry])
        out = np.array(self.cur.fetchall())
        return out.reshape((len(out)))

    def get_od_property(self, column_name):
        sql = "SELECT "+column_name+" from zones where ST_Intersects(geometry,%s) and valid order by id"
        self.cur.execute(sql, [self.area_geometry])
        out = self.cur.fetchall()
        ret = []
        for i in xrange(0,len(out)):
            ret.append(out[i][0])
        return ret

    def get_roads(self):
        sql = "SELECT id, source_id, target_id, cost, reverse_cost, length, speed, type from roads where ST_Intersects(geometry,%s)"
        self.cur.execute(sql, [self.area_geometry])
        column_name = {"id": 0, "source": 1, "target": 2, "cost":3 ,"reverse_cost": 4, "length": 5, "speed": 6, "type": 7}
        return (self.cur.fetchall(), column_name)

    def general_information(self,area_name, column):
        sql = "SELECT "+column+" from general_area_information where name = %s"
        self.cur.execute(sql,[area_name])
        return self.cur.fetchall()[0][0]


    def save_traffic(self,ids,traffic, direction):
        sql_d = "DELETE FROM traffic where true"
        self.cur.execute(sql_d)
        sql = "INSERT INTO traffic(id, road_id, traffic, direction) VALUES (DEFAULT, %s, %s, %s)"
        for i in xrange(0,len(ids)):
            self.cur.execute(sql, [ids[i], traffic[i], direction[i]])
        self.conn.commit()

    def save_t(self, matrix, zones_property_id):
        sql_d = "DELETE FROM od_pairs WHERE true;"
        self.cur.execute(sql_d)
        sql = "INSERT INTO od_pairs(id, origin_id, destination_id, num_of_trip) VALUES (DEFAULT, %s, %s, %s);"
        for i in xrange(matrix.shape[0]):
            for j in xrange(matrix.shape[1]):
                if matrix[i][j] != 0 and matrix[i][j] != float("inf"):
                    self.cur.execute(sql,[zones_property_id[i], zones_property_id[j], matrix[i][j]])
        self.conn.commit()


