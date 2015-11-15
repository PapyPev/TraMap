#!/usr/bin/env python
# -*- coding: utf-8 -*- enable debugging

"""
rest.py
This file is a REST deamon for server.
When you want some informations on database, you call this script from URL.

:Example:
On web browser, URL : http://domain:8082/api/hello
"""

__author__ = "Pev"
__version__ = "1.1"
__email__ = "pev.arfan@gmail.com"
__status__ = "Progress"


# IMPORT
# =============================================================================

from flask import Flask
from flask import request
import json
import mimerender
import classDatabase


# INIT
# =============================================================================

# Create instance of mimerender from Flask framework
mimerender = mimerender.FlaskMimeRender()

# Prepare prototype of response
render_xml = lambda message: '<message>%s</message>'%message
render_json = lambda **args: json.dumps(args)
render_html = lambda message: '<html><body>%s</body></html>'%message
render_txt = lambda message: message

# Init the deamon app
app = Flask(__name__)

# Get routing from URL
#@app.route('/')
@app.route('/api/')
@app.route('/api/<service>')
@app.route('/api/<service>?lat1=<lat1>&lon1=<lon1>&lat2=<lat2>&lon2=<lon2>')
@mimerender(
  default = 'json',
  html = render_html,
  xml  = render_xml,
  json = render_json,
  txt  = render_txt
)

# ROOTING FUNCTION
# =============================================================================

def api(service='default', lat1=0, lon1=0, lat2=0, lon2=0, param='default'):
  """
    Rooting function, return a message containing REST awnser

    :Parameters:
      service
        The REST service name (keyword)
  """

  # Dictionnary of REST services
  # keyword : function
  result = {
    'default' : rest_default(),
    'simpleText' : rest_simpleText(),
    'interests' : rest_interests(),
    'shortestPath': rest_shortestPath(\
      request.args.get('lat1'), request.args.get('lon1'), \
      request.args.get('lat2'), request.args.get('lon2'))
  }.get(service, rest_default())

  # Return message
  return {'message': result}


# REST FUNCTIONS
# =============================================================================

# REST - API
# -----------------------------------------------------------------------------
def rest_default():
  """
    REST Service function, return list of all services.

    :Example:
    >>> rest_default()
    URL : http://localhost:8082/api/

    :Result:
    List of HTML links
  """
  value = '<h1>API REST Services</h1>' \
    'Welcome to the API REST Services ! Check all REST services :' \
    '<ul>' \
      '<li><a href="./">/api</a></li>' \
        '<ul><li>Return HTML message</li></ul>' \
      '<li><a href="./simpleText">/api/simpleText</a></li>' \
        '<ul><li>Return a simple Text message</li></ul>' \
      '<li><a href="./interests">/api/interests</a></li>' \
        '<ul><li>Return all interests by tables</li></ul>' \
      '<li><a href="./shortestPath/' \
        'lat1=60.636088&lon1=24.848033&lat2=60.630822&lon2=24.859875">'\
        '/api/shortestPath/default</a></li>' \
        '<ul><li>Return shortest path lines</li></ul>' \
    '</ul>'
  return value

# REST - SIMPLE TEXT
# -----------------------------------------------------------------------------
def rest_simpleText():
  """
    REST Service function, return a simple text.

    :Example:
    >>> rest_simpleText()
    URL : http://localhost:8082/api/simpleText

    :Result:
    Test ok
  """
  return 'Test ok'


# REST - ALL TABLES
# -----------------------------------------------------------------------------
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

    # Create default database connexion object
    db = classDatabase.Database()

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
              interestsSQL = 'SELECT DISTINCT name as type ' \
                'FROM {}, type_{}_value ' \
                'WHERE {}.type = type_{}_value.id'.format(\
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

    ### ---------- RETURN OBJECT ----------

    # Prepare the JSON object
    data['status'] = status
    data['result'] = result
    json_data = json.loads(json.dumps(data))

    # Return the json object
    return json_data 

# REST - ALL TABLES
# -----------------------------------------------------------------------------
def rest_shortestPath(lat1=0, lon1=0, lat2=0, lon2=0):
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
    >>> rest_shortestPath(60.639481, 24.851273, 60.631668, 24.858296)
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

  print('lat1:{}'.format(lat1))
  print('lon1:{}'.format(lon1))
  print('lat2:{}'.format(lat2))
  print('lon2:{}'.format(lon2))

  return {
    'lat1':lat1,
    'lon1':lon1,
    'lat2':lat2,
    'lon2':lon2
  }


# MAIN
# =============================================================================

if __name__ == "__main__":
  app.debug = True
  app.run(port=8082)


