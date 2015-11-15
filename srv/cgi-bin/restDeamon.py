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
@mimerender(
  default = 'html',
  html = render_html,
  xml  = render_xml,
  json = render_json,
  txt  = render_txt
)

# ROOTING FUNCTION
# =============================================================================

def api(service='default', param='default'):
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
    '</ul>'
  return value

# REST - SIMPLE TEXT
# -----------------------------------------------------------------------------
def rest_simpleText():
  """
    REST Service function, return a simple text.
  """
  return 'Test ok'


# REST - ALL TABLES
# -----------------------------------------------------------------------------
def rest_interests():
  """
    Return a json object with status and all interests by tables

    :Example:
    >>> rest_interests()
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

        print('DEBUG: Get Type')
        
        # For each table get interests
        for tableName in tablesList:

          # Prepare object list
          interestsByTable = {}
          interestsByTable['table'] = tableName
          interests = []
          interestsByTable['interests'] = interests


          ### ---------- TREATMENT MATCHING ----------

          print('DEBUG: Treatment: ' + tableName)

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

            print('DEBUG: SQL: ' + interestsSQL)

            # Execute the query
            interestsResult = db._execute(interestsSQL)

            print('DEBUG: RESULTS: ')
            print(interestsResult)

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




# MAIN
# =============================================================================

if __name__ == "__main__":
  app.run(port=8082)


