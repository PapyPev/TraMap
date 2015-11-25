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
import psycopg2.pool
import transp_model
from transp_model import s

dbpool = psycopg2.pool.SimpleConnectionPool(1, 10, database=s.database, user=s.username, password=s.password,host=s.host)

app = Flask(__name__)

model = transp_model.tm.TransModel()

def XHRResponse(data, mimetype="application/html"):
    return Response(data, headers={"Access-Control-Allow-Origin": "*"}, mimetype=mimetype)

@app.route("/api")
def api():
    out = "<h2>Api info for TraMap</h2>"""
    out += "<b>/api/interests</b>  - return type for tables (don't need any parameters)"
    out += """<br><b>/api/ssp</b> - return Shortest path from A to B e.g
        <a href="http://localhost:8888/api/ssp?lon1=60.61663&lat1=24.87078&lon2=60.63003&lat2=24.85747">
            http://localhost:8888/api/ssp?lon1=60.61663&lat1=24.87078&lon2=60.63003&lat2=24.85747
        </a>"""

    return out

@app.route("/api/interests")
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
    con = dbpool.getconn()
    cur = con.cursor()
    tables = ["import.osm_amenities", "import.osm_shop", "import.osm_transport_points"]
    sql = "SELECT type from %s group by type"

    res = []
    for table in tables:
        sql_f = sql %(table)
        cur.execute(sql_f)
        qr = cur.fetchall()
        types = []
        for t in qr:
            types.append(t[0])
        res.append({"table": table, "interests": types})

    # only dor table "roads"
    cur.execute("SELECT name FROM type_roads_value")
    qr = cur.fetchall()
    types = []
    for t in qr:
        types.append(t[0])
    res.append({"table": "roads", "interests": types})
    # / only dor table "roads"

    return XHRResponse(json.dumps({"status": "ok", "result": res }), mimetype="application/json")


@app.route('/api/ssp', methods=["GET", "POST"])
def rest_shortestPath():
    get = dict(request.args)
    #return get["lat1"][0]
    x1 =  float(get["lat1"][0])
    y1 =  float(get["lon1"][0])
    x2 =  float(get["lat2"][0])
    y2 =  float(get["lon2"][0])

    con = dbpool.getconn()
    cur = con.cursor()

    nn = """SELECT id
            FROM nodes WHERE
            ST_Dwithin(geometry, ST_transform(st_setsrid('POINT(%s %s)'::geometry,4326),3857) ,100)
            ORDER BY ST_Distance(geometry, ST_transform(st_setsrid('POINT(%s %s)'::geometry,4326),3857))
            limit 1"""
    cur.execute(nn,[x1,y1,x1,y1])
    id1 = cur.fetchall()[0][0]

    cur.execute(nn,[x2,y2,x2,y2])
    id2 = cur.fetchall()[0][0]
    dbpool.putconn(con)

    res = model.g.one_to_one(id1, id2, output="geometry")



    return XHRResponse(json.dumps({"status":"ok","result": res}), mimetype="application/json")


if __name__ == "__main__":
    app.debug = True
    app.run(port=8888)





