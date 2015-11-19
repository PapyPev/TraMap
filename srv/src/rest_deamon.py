#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
rest.py
This file is a REST deamon for server.
When you want some informations on database, you call this script from URL.

:Example:
On web browser, URL : http://domain:8082/api/hello
"""

__author__ = "Pev, František Kolovský"
__version__ = "1.1"
__email__ = "pev.arfan@gmail.com"

from flask import Flask, Response, request
import json
import database
import psycopg2.pool
import transp_model
from transp_model import s

dbpool = psycopg2.pool.SimpleConnectionPool(1, 10, database=s.database, user=s.username, password=s.password,host=s.host)

app = Flask(__name__)

def XHRResponse(data, mimetype="application/html"):
    return Response(data, headers={"Access-Control-Allow-Origin": "*"}, mimetype=mimetype)

@app.route("/")
def api():
    get = dict(request.args)
    return XHRResponse("Running!" + str(get))

@app.route("/")
def rest_interests():
    """
    Return a json object with status and all interests by tables

    :Example:
    >>> rest_interests()
    URL : http://localhost:8082/api/interests

    :Result:
    {
      "status" : "ok",
      "result" : [
        {
          "table" : "roads",
          "interests" : [
            "motorway",
            "footway",
            "cycleway",
            "..."
          ]
        },
        {
          "table" : "osm_building",
          "interests" : [
            {"..."}
          ]
        }
      ]
    }
    """

    ### ---------- TABLES LISTS ----------

    tablesIgnore = [
        'general_area_information',
        'geography_columns',
        'geometry_columns',
        'spatial_ref_sys',
        'raster_columns',
        'raster_overviews',
        'traffic',
        'traffic_geometry',
        'type_roads_value',
        'nodes',
        'od_pairs',
        'osm_buildings',
        'osm_amenities',
        'osm_transport_points'
    ]

    tablesInner = [
    'roads'
    ]

    ### ---------- INIT RETURNED OBJECT ----------

    # REST variables
    status = 'nok'
    result = []

    # JSON object
    data = {}
    data['status'] = status
    data['result'] = result

    ### ---------- DATABASE CONNEXION ----------

    try:
        db = database.Database()

        # Connexion to the database
        db._connect()


        ### ---------- GET ALL TABLES ----------

        try:

          # Prepare the SQL query
          tablesSQL = "SELECT table_name " \
              "FROM information_schema.tables " \
              "WHERE table_schema='public' " \
              "ORDER BY table_name ASC"

          # Execute the query
          tablesResult = db._execute(tablesSQL)

          # Prepare the list of table
          tablesList = []

          # Save the result on a list of elements
          for t in tablesResult:
            if not t[0] in tablesIgnore:
              tablesList.append(t[0])


          ### ---------- GET TYPE ----------

          try:

            # For each table get interests
            for tableName in tablesList:

              # Prepare object list
              interestsByTable = {}
              interestsByTable['table'] = tableName
              interests = []
              interestsByTable['interests'] = interests


              ### ---------- TREATMENT MATCHING ----------

              # Init and refresh
              interestsSQL = ''

              try:

                # Special treatment
                if tableName in tablesInner:

                  # Get all type from tableName with inner join
                  interestsSQL = """SELECT DISTINCT name as type
                    FROM {}, type_{}_value
                    WHERE {}.type = type_{}_value.id""".format(
                      tableName, tableName, tableName, tableName)

                # No special treatment
                else:

                  # Get all type from tableName
                  interestsSQL = 'SELECT DISTINCT type FROM {}'.format(tableName)

                # Execute the query
                interestsResult = db._execute(interestsSQL)

                # Save interests on intersts list
                for i in interestsResult:
                  interests.append(i[0])

                ### ---------- SAVE INTERESTS ON JSON OBJECT ----------
                interestsByTable['interests'] = interests

                ### ---------- SAVE TABLE INTERESTS ----------
                result.append(interestsByTable)

              except Exception, e:
                result = ['Error: SQL treatment matching. Details: {}'.format(e)]

            # End - for tableName in tablesList

            ### ---------- UPDATE STATUS ----------
            status = 'ok'

          # Get Type for all tables
          except Exception, e:
            result = ['Error: SQL get type table. Details: {}'.format(e)]

        # Get all tables error
        except Exception, e:
          result = ['Error: SQL get all tables. Details: {}'.format(e)]

    # Database connexion error
    except Exception, e:
        result = ['Error: Database connexion failed. Details: {}'.format(e)]

    finally:
        pass


    ### ---------- RETURN OBJECT ----------

    # Prepare the JSON object
    data['status'] = status
    data['result'] = result
    json_data = json.loads(json.dumps(data))

    # Return the json object
    return json_data

@app.route('/ssp', methods=["GET", "POST"])
def rest_shortestPath():
    """
    Return a JSON object with the geometry path shortestpath,
    time (in seconds) and distance (in meters)

    :Parameters:
      lat1
        Latitude of the first point (start)
      lon1
        Longitude of the first point (start)
      lat2
        Latitude of the second point (arrival)
      lon2
        Longitude of the second point (arrival)

    :Example:
    #>>> rest_shortestPath(60.639481, 24.851273, 60.631668, 24.858296)
    URL : http://localhost:8082/api/shortestPath?lat1=60.639481&lon1=24.851273&lat2=60.631668&lon2=24.858296

    :Result:
    {
      "status":"ok,
      "result":
      {
        "distance":10,
        "time":5400,
        "feature": [
          {geometry object},
          {geometry object}
        ]
      }
    }
    """
    get = dict(request.args)
    x1 =  get["lat1"]
    y1 =  get["lon1"]
    x2 =  get["lat2"]
    y2 =  get["lon2"]

    con = dbpool.getconn()
    cur = con.cursor()

    nn = """SELECT id
            FROM nodes WHERE
            ST_Dwithin(ST_transform(geometry,3067), st_setsrid('POINT(382289.1635 6722782.235)'::geometry,3067) ,100)
            ORDER BY ST_Distance(ST_transform(geometry,3067), st_setsrid('POINT(382289.1635 6722782.235)'::geometry, 3067))
            limit 1"""
    cur.execute(nn,)


    return XHRResponse(json.dumps({}), mimetype="application/json")


if __name__ == "__main__":
    app.debug = True
    app.run(port=8888)





