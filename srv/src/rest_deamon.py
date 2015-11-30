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
from transp_model import db_settings as s
import thread

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
        <a href="api/ssp?lon1=24.87078&lat1=60.61663&lon2=24.85747&lat2=60.63003">
            api/ssp?lon1=24.87078&lat1=60.61663&lon2=24.85747&lat2=60.63003
        </a>"""
    out += "<br><b>/api/compute_traffic</b> - start compute traffic (return info about start compute)"
    out += "<br><b>/api/compute_traffic_progress</b> - progress for compute traffic e.g {\"status\": \"ok\", \"result\": {\"progress\": 87, \"isrun\": true}}"

    return out

@app.route("/api/interests")
def rest_interests():
    con = dbpool.getconn()
    cur = con.cursor()
    tables = ["osm_amenities", "osm_transport_points"]
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
def rest_shortest_path():
    get = dict(request.args)
    #return get["lat1"][0]
    y1 =  float(get["lat1"][0])
    x1 =  float(get["lon1"][0])
    y2 =  float(get["lat2"][0])
    x2 =  float(get["lon2"][0])

    con = dbpool.getconn()
    cur = con.cursor()

    nn = """SELECT id
            FROM nodes WHERE
            ST_Dwithin(geometry, ST_transform(st_setsrid('POINT(%s %s)'::geometry,4326),3857) ,1000)
            ORDER BY ST_Distance(geometry, ST_transform(st_setsrid('POINT(%s %s)'::geometry,4326),3857))
            limit 1"""
    cur.execute(nn,[x1,y1,x1,y1])
    id1 = cur.fetchall()[0][0]

    cur.execute(nn,[x2,y2,x2,y2])
    id2 = cur.fetchall()[0][0]
    dbpool.putconn(con)

    model.g.change_cost(1, 0, 0)
    res = model.g.one_to_one(id1, id2, output="geometry")
    res["distance"] = res["distance"] * 1000
    res["time"] = res["time"] * 3600


    return XHRResponse(json.dumps({"status":"ok","result": res}), mimetype="application/json")

@app.route('/api/compute_traffic', methods=["GET", "POST"])
def compute_traffic():
    if model.compute_info.is_compute:
       return XHRResponse(json.dumps({"status":"nok","result": "calculation is running now"}), mimetype="application/json")
    def run():
        model.compute_info.is_compute = True
        model.trip_destination(0.01, 30)
        model.count_transport()
        model.save_traffic()
        model.compute_info.is_compute = False
    thread.start_new_thread(run,())
    return XHRResponse(json.dumps({"status":"ok","result": "calculation began"}), mimetype="application/json")

@app.route('/api/compute_traffic_progress', methods=["GET", "POST"])
def compute_traffic_progress():
    if not model.compute_info.is_compute:
        res = {"isrun": False, "progress": None}
    else:
        res = {"isrun": True, "progress": model.compute_info.progress}
    return XHRResponse(json.dumps({"status":"ok","result": res}), mimetype="application/json")



if __name__ == "__main__":
    app.debug = True
    app.run(port=8082)





