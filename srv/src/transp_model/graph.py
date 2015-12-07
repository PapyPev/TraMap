"""
The MIT License (MIT)

Copyright (c) 2015 Frantisek Kolovsky, Pierre Vrot

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""
__author__ = 'kolovsky'

import igraph
from progress_bar import *
import numpy as np
import time


class Graph:
    def __init__(self):
        self.g = igraph.Graph(directed = True)
        self.min_vertex_id = -1
        self.max_vertex_id = -1
        self.max_count_vertex = 100000000  # max size of graph
        self.p_oneway = None
        self.p = dict()

    def _create_vertex(self, table):
        """

        :param table:
        :return:
        """
        self.min_vertex_id = table[0][1]
        self.max_vertex_id = table[0][1]
        for row in table:
            if self.min_vertex_id > row[1]: self.min_vertex_id = row[1]
            if self.min_vertex_id > row[2]: self.min_vertex_id = row[2]
            if self.max_vertex_id < row[1]: self.max_vertex_id = row[1]
            if self.max_vertex_id < row[2]: self.max_vertex_id = row[2]

        # check max size of graph
        if self.max_count_vertex < self.max_vertex_id - self.min_vertex_id:
            raise AttributeError("Too large graph")

        self.g.add_vertices(int(self.max_vertex_id - self.min_vertex_id + 1))


    def id_to_index(self, id):
        if id > self.max_vertex_id:
            raise IndexError("ID %i no exist, ID must be in interval [%i, %i]" %(id, self.min_vertex_id,
                                                                                 self.max_vertex_id))
        return id - self.min_vertex_id

    def create_graph(self, table):
        """
        Build graph.

        :param table: list of edges (one edge: [id, source, target, is Oneway (boolen)]
        :return:
        """
        self._create_vertex(table)
        ig_e = [] # edges
        ig_d = [] # directions
        for e in table:
            ig_e.append((self.id_to_index(e[1]), self.id_to_index(e[2])))
            ig_d.append(True)

            if not e[3]:
                ig_e.append((self.id_to_index(e[2]), self.id_to_index(e[1])))
                ig_d.append(False)

        self.g.add_edges(ig_e)
        self.p["direction"] = np.array(ig_d)
        self.p["traffic"] = np.zeros((len(ig_d)))

        self.p_oneway = np.transpose(map(lambda x: x[3], table)).tolist()

    def set_edge_property(self, property_name, data):
        """
        Add property data to graph

        :param property_name: required property names: length, speed, vd  (in  km, km/h, m)
        :param data: list with data (same length like number of edge (undirected))
        :return:
        """
        if len(data) == 1:
            out = np.zeros((self.g.ecount()))
        else:
            out = []
            for i in xrange(len(data)):
                out.append(data[i])
                if not self.p_oneway[i]:
                    if property_name == "vd":
                        out.append(-data[i])
                    else:
                        out.append(data[i])

        self.p[property_name] = np.array(out)

    def set_vertex_property(self, property_name, data):
        print "Implement me please!"
        raise RuntimeError("Implement me please!")

    def change_cost(self, k_length, k_time, k_cant):
        """
        Change cost(weight) for graph depend od coeficients.
        Note: cost > 0  required!!

        :param k_length: coef. for length
        :param k_time:  coef. for time
        :param k_cant: coef. for vertical distance
        :return:
        """
        np_speed = self.p["speed"]
        np_length = self.p["length"]
        np_vd = self.p["vd"]

        a = time.time()
        if k_time == 0:
            np_out = (k_length * np_length +  k_cant * np_vd)
        else:
            np_out = (k_length * np_length + k_time * (np_length / np_speed) + k_cant * np_vd)

        self.g.es["cost"] = np_out.tolist()


    def recompute_cost(self):
        pass

    def get_cost_matrix(self, nodes):
        """
        Create cost matrix (C)

        :param nodes: list of node_id
        :return: C matrix
        """
        pb = Progress_bar(len(nodes))
        C = np.ndarray(shape=(len(nodes), len(nodes)))
        i = 0
        for zone_node_id in nodes:
            dist_map = self.g.shortest_paths_dijkstra(self.id_to_index(zone_node_id), None, "cost")[0]
            j = 0
            for zone_node_id_v in nodes:
                C[i][j] = dist_map[self.id_to_index(zone_node_id_v)]
                j += 1
            i += 1
            pb.go(i)
        return C

    def one_to_one(self,s ,t, output="id"):
        """
        Compute shortest path from s to t

        :param s: source node
        :param t: target node
        :param output: path output property name (e.g for edge 'id')
        :return: {"distance": dist, "time": time, "features": out}
        """
        path = self.g.get_shortest_paths(self.id_to_index(s), self.id_to_index(t),weights="cost",output="epath")[0]
        out = []
        dist = 0
        time = 0
        np_speed = self.p["speed"]
        np_length = self.p["length"]
        for i in path:
            out.append(self.p[output][i])
            dist += np_length[i]
            time += np_length[i]/float(np_speed[i])

        return {"distance": dist, "time": time, "features": out}


    def one_to_n(self, s, t_list):
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

