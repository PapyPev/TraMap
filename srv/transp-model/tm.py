__author__ = 'kolovsky'

import settings as s
import numpy as np
import db
from progress_bar import *
import igraph

class TransModel:
    def __init__(self):
        #database
        self.db = db.Database()
        trip_per_person = self.db.general_information(s.area_name,"cycling")

        # graph
        self.g = MyGraph()
        table, cn = self.db.get_roads()
        self.g.create_graph(table, cn)

        self.O = np.array(map(lambda x: x*trip_per_person, self.db.get_od())) #origin zones
        self.D = np.array(map(lambda x: x*trip_per_person, self.db.get_od())) #destination zones

        #zones property
        self.zones_property_type = self.db.get_od_property("type")
        self.zones_property_subtype = self.db.get_od_property("subtype")
        self.zones_property_id = self.db.get_od_property("id")
        self.zones_property_node_id = self.db.get_od_property("node_id")

        self.zones_property_age_cat = []
        for age_column in s.age_category:
            self.zones_property_age_cat.append(self.db.get_od_property(age_column))

        #cost matrix
        self.C = self.g.get_c(self.zones_property_node_id)
        #self.C = self.g.load_c()

        #transport matrix
        self.T = np.ndarray(shape=(self.O.size, self.D.size))

        self.prepare_od() #only for testing


    #olny for test!!
    def prepare_od(self):
        """
        define O and D value for non home zones
        this function is for testing only
        :return:
        """
        sum_home = 0
        non_home_count = 0
        for i in xrange(0, len(self.O)):
            if self.zones_property_type[i] == "home":
                sum_home += self.O[i]
            else:
                non_home_count += 1

        for i in xrange(0, len(self.O)):
            if self.zones_property_type[i] != "home":
                self.O[i] = sum_home/float(non_home_count)
                self.D[i] = sum_home/float(non_home_count)

    def _is_enable_combination(self, i, j):
        """
        Is it enable combination (type of zones)
        :param i: row index in T matrix
        :param j: column index in T matrix
        :return: True if enable combination (boolen)
        """
        target_type = self.zones_property_type[j]
        source_type = self.zones_property_type[i]
        if target_type in s.enable_type_combination[source_type]:
            return True
        else:
            return False

    def _get_od_rules(self,i,pair_type):
        """
        :param i: zone index (source/destination)
        :param pair_type: zone type (source/destination)
        :return: Number of people who travel from/to zone i from/to zone type
        """
        offer = 0
        num_of_age_cat = 0
        for age_rule in s.age_category_rules:
            if pair_type in age_rule:
                offer += self.O[i] * self.zones_property_age_cat[num_of_age_cat][i]
            num_of_age_cat += 1
        return offer

    def _model(self, i, j):
        """
        Transport model.
        :param i: row index in transportation matrix (T)
        :param j: column index in transportation matrix (T)
        :return: model value for cell
        """
        if self._is_enable_combination(i, j):
            if self.zones_property_type[i] == "home":
                Ti = self._get_od_rules(i,self.zones_property_type[j])
                Tj = self.D[j]
            elif self.zones_property_type[j] == "home":
                Tj = self._get_od_rules(j,self.zones_property_type[i])
                Ti = self.O[i]
            else:
                Ti = self.O[i]
                Tj = self.D[j]

            if Ti == 0 or Tj == 0:
                print Ti, Tj
            return Ti * Tj * self._f(self.C[i][j])

        else:
            return 0

    def _f(self, c):
        """
        Function for model (1/x^2) (gravity model)
        :param c: input cost
        :return: function value
        """
        if c == 0:
            return 0
        return c**(-2)

    def _insert_to_T(self,function):
        """
        :param function: function for insert to matrix T e.g self._model
        :return: matrix T
        """
        Tn = np.ndarray(shape=self.T.shape)
        for i in xrange(0, self.T.shape[0]):
            for j in xrange(0, self.T.shape[1]):
                Tn[i][j] = function(i, j)
        return Tn

    def trip_destination(self, maximum_delta, maximum_iterations):

        self.T = self._insert_to_T(self._model)

        delta = float("inf")
        delta_mid = float("inf")

        num_of_iter = 0
        while delta > maximum_delta:

            nf_row = np.zeros((self.T.shape[0]))
            i = 0
            for row in self.T:
                if sum(row) == 0:
                    nf_row[i] = 1
                else:
                    nf_row[i] = self.O[i] / sum(row)
                i += 1

            self.T = self._insert_to_T(lambda i,j: self.T[i][j] * nf_row[i])

            nf_column = np.zeros((self.T.shape[1]))
            i = 0
            for column in self.T.transpose():
                if sum(column) == 0:
                    nf_column[i] = 1
                else:
                    nf_column[i] = self.D[i] / sum(column)
                i += 1

            self.T = self._insert_to_T(lambda i, j: self.T[i][j] * nf_column[j])


            delta =  max(abs(nf_column - 1))
            delta_mid = sum(abs(nf_column - 1)) / len(nf_column)

            num_of_iter += 1

            if num_of_iter > maximum_iterations:
                break

        np.save("cache/T", self.T)
        return (delta, delta_mid)

    def load_t(self):
        """
        Load T matrix from cache.
        :return:
        """
        self.T = np.load("cache/T.npy")

    def save_t(self):
        """
        Save T matrix to database.
        :return:
        """
        self.db.save_t(self.T, self.zones_property_id)


    def count_transport(self): # je treba jeste dudelat distribuci cen!!!!
        """
        Count traffic for roads.
        :param num_multi_path: how many shortest path will computed for one OD pair. For searching will used different
         cost.
        :return:
        """
        pb = Progress_bar(len(self.zones_property_node_id))
        i = 0
        for node_id in self.zones_property_node_id:
            for cost in s.cost:
                self.g.change_cost(cost[0], cost[1], cost[2])
                paths = self.g.find_paths(node_id, self.zones_property_node_id)
                j = 0
                for path in paths:
                    for edge in path:
                        self.g.g.es[edge]["traffic"] += (1.0/len(s.cost)) * self.T[i][j]
                    j += 1
            i += 1
            pb.go(i)

    def save_traffic(self):
        """
        Save traffic to database
        :return:
        """
        ids = self.g.g.es.get_attribute_values("id")
        traffic = self.g.g.es.get_attribute_values("traffic")
        direction = self.g.g.es.get_attribute_values("direction")
        self.db.save_traffic(ids, traffic, direction)

class Cost(object):

    def __init__(self):
        self.speed = []
        self.length = []
        self.cant = []


    def add_edge_cost(self, length, speed, cant = 0):
        """

        :param length: length in meter
        :param speed: speed in m .s^(-1)
        :param cant: in meter
        :return:
        """
        self.speed.append(speed)
        self.length.append(length)
        self.cant.append(cant)

    def get_cost_list(self, k_length, k_time, k_cant):
        np_length = np.array(self.length)
        np_speed = np.array(self.speed)
        np_cant = np.array(self.cant)
        out = []
        for i in xrange(len(self.length)):
            if np_speed[i] == 0:
                out.append(float("inf"))
            else:
                c = k_length * np_length[i] + k_time * (np_length[i] / np_speed[i]) + k_cant * np_cant[i]
                out.append(c)
        return out



class MyGraph:
    def __init__(self):
        self.g = igraph.Graph(directed = True)
        self.cost = Cost()
        self.min_vertex_id = -1
        self.max_vertex_id = -1
        self.max_count_vertex = 100000000  # max size of graph

    def _create_vertex(self, table, cn):
        """
        Create vertexes
        :param table: list of edges (list of roads)
        :param cn: column name e.g {"source": 1, "target": 2, ...} number is index in edge,
        This function required "source" and "target" column in cn dictionary
        """
        self.min_vertex_id = table[0][cn["source"]]
        self.max_vertex_id = table[0][cn["source"]]
        for row in table:
            if self.min_vertex_id > row[cn["source"]]: self.min_vertex_id = row[cn["source"]]
            if self.min_vertex_id > row[cn["target"]]: self.min_vertex_id = row[cn["target"]]
            if self.max_vertex_id < row[cn["source"]]: self.max_vertex_id = row[cn["source"]]
            if self.max_vertex_id < row[cn["target"]]: self.max_vertex_id = row[cn["target"]]

        # check max size of graph
        if self.max_count_vertex < self.max_vertex_id - self.min_vertex_id:
            raise AttributeError("Too large graph")

        self.g.add_vertices(int(self.max_vertex_id - self.min_vertex_id + 1))


    def id_to_index(self, id):
        """
        Transform ID (node) to vertex index
        :param id: Node ID
        :return: vertex index
        """
        if id > self.max_vertex_id:
            raise IndexError("ID %i no exist, ID must be in interval [%i, %i]" %(id,self.min_vertex_id,
                                                                                 self.max_vertex_id))
        return id - self.min_vertex_id

    def create_graph(self, table, cn):# vyressi reverse cost i v modelu!!!
        """
        Create graph from list of row (edges). Column are id, cost, source, target. eg. SELECT id, cost, source, target FROM graph; in PLPython
        :param table: list of rows (edges)
        :param cn: dictionary of column name eg. {"id": 0, "source": 1, "target": 2, "cost":3 ,"reverse_cost": 4, "length": 5, "speed": 6}
        number is index in edge
        This function required column name "id", "source", "target", "length", "speed", "reverse_cost", "cant".
        """
        self._create_vertex(table,cn)

        ig_e = [] #list of edge [(source, target), ...]
        ig_direction = [] #list of direction [True, False, ...]
        ig_id = [] #list of ID
        for row in table:
            ig_e.append((self.id_to_index(row[cn["source"]]), self.id_to_index(row[cn["target"]])))
            ig_direction.append(True)
            ig_id.append(row[cn["id"]])
            self.cost.add_edge_cost(row[cn["length"]] * 1000, s.speed_cycling[row[cn["type"]]]/3.6, row[cn["vd_pos"]])


            if row[cn["reverse_cost"]] != 1000000:
                ig_e.append((self.id_to_index(row[cn["target"]]), self.id_to_index(row[cn["source"]])))
                ig_direction.append(False)
                ig_id.append(row[cn["id"]])
                self.cost.add_edge_cost(row[cn["length"]] * 1000, s.speed_cycling[row[cn["type"]]]/3.6, abs(row[cn["vd_neg"]]))

        self.g.add_edges(ig_e)
        self.g.es["direction"] = ig_direction
        self.g.es["traffic"] = 0
        self.g.es["id"] = ig_id
        self.g.es["cost"] = self.cost.get_cost_list(1, 0, 0) #setting fo length cost

    def change_cost(self, k_length, k_time, k_cant):
        """
        Changing actual cost for graph.
        Cost is computed as linear combination length, time, cant so sum of these coefficients must be 1
        :param k_length: coefficient for length
        :param k_time: coefficient for time
        :param k_cant: coefficient for cant (altitude)
        """
        self.g.es["cost"] = self.cost.get_cost_list(k_length, k_time, k_cant)

    def get_c(self, zones_propetry_node_id):
        """
        Create cost matrix (C)
        :param zones_propetry_node_id: list of node_id
        :return: C matrix
        """
        pb = Progress_bar(len(zones_propetry_node_id))
        C = np.ndarray(shape=(len(zones_propetry_node_id), len(zones_propetry_node_id)))
        i = 0
        for zone_node_id in zones_propetry_node_id:
            dist_map = self.g.shortest_paths_dijkstra(self.id_to_index(zone_node_id), None, "cost")[0]
            j = 0
            for zone_node_id_v in zones_propetry_node_id:
                C[i][j] = dist_map[self.id_to_index(zone_node_id_v)]
                j += 1
            i += 1
            pb.go(i)
        np.save("cache/C", C)
        return C

    def load_c(self):
        """
        Load C matrix from cache
        :return: C matrix
        """
        self.C = np.load("cache/C.npy")
        return self.C


    def find_paths(self, s, t_list):
        """
        Find paths from s to all vertex in t_list.
        :param s source node
        :param t_list list of target nodes
        :return list of paths (paths is list of edges id)
        """
        ig_paths = self.g.get_shortest_paths(self.id_to_index(s), to=map(self.id_to_index, t_list), weights="cost", output="epath")
        ig_paths_m = filter(lambda x: False if len(x) == 0 else True, ig_paths)

        all_path = []

        for t in map(self.id_to_index, t_list):
            pp = 1
            for i in xrange(len(ig_paths_m)):
                if t == self.g.es[ig_paths_m[i][-1]].target:
                    all_path.append(ig_paths_m[i])
                    pp = 0
                    break
            if pp:
                all_path.append([])
        if len(all_path) != len(t_list):
            raise RuntimeError("not corespond letgth of input and output")
        return all_path


if __name__ == "__main__":
    tm = TransModel()
    delta, delta_mid = tm.trip_destination(0.05, 30)
    print delta, delta_mid
    tm.save_t()
    tm.count_transport()
    tm.save_traffic()

