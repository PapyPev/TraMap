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
        sql = "SELECT geometry from tramap.general_area_information where name = %s"
        self.cur.execute(sql,[tm_settings.area_name_for_modeling])
        self.area_geometry = self.cur.fetchall()[0][0]

    def create_database_model(self):
        print "Implement me, please! You can use SQL script in example data folder"
        raise RuntimeError("create_database_model: Implement me, please!")

    def general_information(self, column, area_name=tm_settings.area_name_for_modeling):
        """

        :param column: Name of column
        :param area_name: area name (column area in table general_area_information)
        :return: cell value
        """
        sql = "SELECT "+column+" from tramap.general_area_information where name = %s"
        self.cur.execute(sql,[area_name])
        return self.cur.fetchall()[0][0]

    def save_traffic(self, ids, traffic, direction):
        """

        :param ids: list of edge id
        :param traffic: list of traffic
        :param direction: list of direction
        :return:
        """
        sql_d = "DELETE FROM tramap.traffic where true"
        self.cur.execute(sql_d)
        sql_seq = "ALTER SEQUENCE tramap.traffic_id_seq RESTART WITH 1"
        self.cur.execute(sql_seq)
        sql = "INSERT INTO tramap.traffic(id, road_id, traffic, direction) VALUES (DEFAULT, %s, %s, %s)"
        for i in xrange(0,len(ids)):
            if traffic[i] != 0:
                self.cur.execute(sql, [ids[i], traffic[i], direction[i]])
        self.conn.commit()

    def save_t(self, matrix, zones_property_id):
        """
        Save T matrix to database

        :param matrix: T matrix
        :param zones_property_id: list of zones id
        :return:
        """
        sql_d = "DELETE FROM tramap.od_pairs WHERE true;"
        self.cur.execute(sql_d)
        sql_seq = "ALTER SEQUENCE tramap.od_pairs_id_seq RESTART WITH 1"
        self.cur.execute(sql_seq)
        sql = "INSERT INTO tramap.od_pairs(id, origin_id, destination_id, num_of_trip) VALUES (DEFAULT, %s, %s, %s);"
        for i in xrange(matrix.shape[0]):
            for j in xrange(matrix.shape[1]):
                if matrix[i][j] != 0 and matrix[i][j] != float("inf"):
                    self.cur.execute(sql,[zones_property_id[i], zones_property_id[j], matrix[i][j]])
        self.conn.commit()

    def get_graph(self):
        """

        :return: list of edges [(id, source, target, is oneway), ..]
        """
        sql = """SELECT id, source_id, target_id, oneway
            FROM tramap.roads where ST_Intersects(geometry,%s) order by id"""
        self.cur.execute(sql, [self.area_geometry])

        return self.cur.fetchall()

    def get_vertex_property(self, column):
        """

        :param column: name of column
        :return: property list
        """
        sql = "SELECT "+column+" FROM tramap.nodes where ST_Intersects(geometry,%s) order by id"
        self.cur.execute(sql, [self.area_geometry])
        return np.transpose(self.cur.fetchall()).tolist()[0]

    def get_edge_property(self, column):
        """

        :param column: name of column
        :return: property list
        """
        sql = "SELECT "+column+" FROM tramap.roads where ST_Intersects(geometry,%s) order by id"
        self.cur.execute(sql, [self.area_geometry])
        return np.transpose(self.cur.fetchall()).tolist()[0]

    def get_zone_property(self, column):
        """

        :param column: name of column
        :return: property list
        """
        sql = "SELECT "+column+" FROM tramap.zones where ST_Intersects(geometry,%s) order by id"
        self.cur.execute(sql, [self.area_geometry])
        return np.transpose(self.cur.fetchall()).tolist()[0]



