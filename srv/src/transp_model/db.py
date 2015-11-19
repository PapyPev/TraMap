__author__ = 'kolovsky'
import psycopg2
import numpy as np
import db_settings
import tm_settings

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(database=db_settings.database,
                                     user=db_settings.username,
                                     password=db_settings.password,
                                     host=db_settings.host,
                                     port=db_settings.port)
        self.cur = self.conn.cursor()

        # get interest area geometry
        sql = "SELECT geometry from general_area_information where name = %s"
        self.cur.execute(sql,[tm_settings.area_name_for_modeling])
        self.area_geometry = self.cur.fetchall()[0][0]

    def create_database_model(self):
        print "Implement me, please!"
        raise RuntimeError("create_database_model: Implement me, please!")


    def get_roads(self):
        sql = """SELECT r.id, r.source_id, r.target_id, r.cost, r.reverse_cost, r.length, r.speed, r.type, p.pos, p.neg, ST_asgeoJSON(r.geometry) as geom
            from roads as r, profile as p where ST_Intersects(geometry,%s) and r.id = p.id"""
        self.cur.execute(sql, [self.area_geometry])
        column_name = {"id": 0,
                       "source": 1,
                       "target": 2,
                       "cost":3 ,
                       "reverse_cost": 4,
                       "length": 5,
                       "speed": 6,
                       "type": 7,
                       "vd_pos": 8,
                       "vd_neg": 9,
                       "geojson": 10}
        return (self.cur.fetchall(), column_name)

    def general_information(self, column, area_name=tm_settings.area_name_for_modeling):
        sql = "SELECT "+column+" from general_area_information where name = %s"
        self.cur.execute(sql,[area_name])
        return self.cur.fetchall()[0][0]

    def save_traffic(self, ids, traffic, direction):
        sql_d = "DELETE FROM traffic where true"
        self.cur.execute(sql_d)
        sql_seq = "ALTER SEQUENCE traffic_id_seq RESTART WITH 1"
        self.cur.execute(sql_seq)
        sql = "INSERT INTO traffic(id, road_id, traffic, direction) VALUES (DEFAULT, %s, %s, %s)"
        for i in xrange(0,len(ids)):
            self.cur.execute(sql, [ids[i], traffic[i], direction[i]])
        self.conn.commit()

    def save_t(self, matrix, zones_property_id):
        sql_d = "DELETE FROM od_pairs WHERE true;"
        self.cur.execute(sql_d)
        sql_seq = "ALTER SEQUENCE od_pairs_id_seq RESTART WITH 1"
        self.cur.execute(sql_seq)
        sql = "INSERT INTO od_pairs(id, origin_id, destination_id, num_of_trip) VALUES (DEFAULT, %s, %s, %s);"
        for i in xrange(matrix.shape[0]):
            for j in xrange(matrix.shape[1]):
                if matrix[i][j] != 0 and matrix[i][j] != float("inf"):
                    self.cur.execute(sql,[zones_property_id[i], zones_property_id[j], matrix[i][j]])
        self.conn.commit()

    def get_graph(self):
        sql = """SELECT id, source_id, target_id, oneway
            FROM roads where ST_Intersects(geometry,%s) order by id"""
        self.cur.execute(sql, [self.area_geometry])

        return self.cur.fetchall()

    def get_vertex_property(self, column):
        sql = "SELECT "+column+" FROM nodes where ST_Intersects(geometry,%s) order by id"
        self.cur.execute(sql, [self.area_geometry])
        return np.transpose(self.cur.fetchall()).tolist()[0]

    def get_edge_property(self, column):
        sql = "SELECT "+column+" FROM roads where ST_Intersects(geometry,%s) order by id"
        self.cur.execute(sql, [self.area_geometry])
        return np.transpose(self.cur.fetchall()).tolist()[0]

    def get_zone_property(self, column):
        sql = "SELECT "+column+" FROM zones where ST_Intersects(geometry,%s) order by id"
        self.cur.execute(sql, [self.area_geometry])
        return np.transpose(self.cur.fetchall()).tolist()[0]



