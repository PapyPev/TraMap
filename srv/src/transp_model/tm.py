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

import tm_settings as s
import numpy as np
import db
from progress_bar import *
from graph import Graph
import time
import json

class ComputeInfo:
    def __init__(self):
        self.is_compute = False
        self.progress = 0


class TransModel:
    def __init__(self):
        # database
        self.db = db.Database()
        trip_per_person = self.db.general_information(s.transpotation_type)

        # graph
        self.g = Graph()
        table = self.db.get_graph()
        self.g.create_graph(table)
        # length
        self.g.set_edge_property("length", self.db.get_edge_property("length"))
        # speed
        self.g.set_edge_property("speed", self.db.get_edge_property(s.speed))
        # vertical ditance
        pos = np.array(self.db.get_edge_property("vertical_distance_pos"))
        neg = np.array(self.db.get_edge_property("vertical_distance_neg"))
        vd = pos + neg
        self.g.set_edge_property("vd", vd)
        # edge id
        self.g.set_edge_property("id", self.db.get_edge_property("id"))
        # geometry
        self.g.set_edge_property("geometry", map(lambda x: json.loads(x), self.db.get_edge_property("ST_asgeojson(ST_transform(geometry,4326))")))
        # compute first path
        self.g.change_cost(1, 0, 0)

        self.O = np.array(map(lambda x: x * trip_per_person, self.db.get_zone_property("num_of_people"))) #origin zones
        self.D = np.array(map(lambda x: x * trip_per_person, self.db.get_zone_property("num_of_people"))) #destination zones

        #zones property
        self.zones_property_type = self.db.get_zone_property("type")
        self.zones_property_subtype = self.db.get_zone_property("subtype")
        self.zones_property_id = self.db.get_zone_property("id")
        self.zones_property_node_id = self.db.get_zone_property("node_id")

        self.zones_property_age_cat = []
        for age_column in s.age_category:
            self.zones_property_age_cat.append(self.db.get_zone_property(age_column))

        #cost matrix
        self.C = None

        #transport matrix
        self.T = np.ndarray(shape=(self.O.size, self.D.size))

        self.prepare_od() #only for testing

        # for computing info
        self.compute_info = ComputeInfo()


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
        """
        Compute transportation matrix

        :param maximum_delta: maximum error in balancing matrix
        :param maximum_iterations: maximum number of iteration in balancing matrix
        :return: (delta, average_delta) error in balancing matrix
        """
        self.C = self.g.get_cost_matrix(self.zones_property_node_id)

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

        #np.save("cache/T", self.T)
        return (delta, delta_mid)

    def load_t(self):
        """
        Load T matrix from cache.
        :return:
        """
        self.T = np.load("cache/T.npy")

    def save_t(self):
        """
        Save T matrix to database (table OD_pairs).
        :return:
        """
        self.db.save_t(self.T, self.zones_property_id)


    def count_transport(self): # je treba jeste dudelat distribuci cen!!!!
        """
        Compute traffic for all roads
        """
        pb = Progress_bar(len(self.zones_property_node_id))
        i = 0
        for node_id in self.zones_property_node_id:
            for cost in s.cost:
                self.g.change_cost(cost[0], cost[1], cost[2])
                paths = self.g.one_to_n(node_id, self.zones_property_node_id)
                j = 0
                for path in paths:
                    for edge in path:
                        self.g.p["traffic"][edge] = self.g.p["traffic"][edge] +  cost[3] * self.T[i][j]
                    j += 1
            i += 1
            self.compute_info.progress = pb.go(i)

    def save_traffic(self):
        """
        Save traffic to database table "tramap.traffic"
        """
        ids = self.g.p["id"].tolist()
        traffic = self.g.p["traffic"].tolist()
        direction = self.g.p["direction"].tolist()
        self.db.save_traffic(ids, traffic, direction)


if __name__ == "__main__":
    tm = TransModel()
    delta, delta_mid = tm.trip_destination(0.05, 30)
    tm.count_transport()
    tm.save_traffic()


