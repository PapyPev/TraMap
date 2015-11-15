#!/usr/bin/env python
# -*- coding: utf-8 -*- enable debugging

"""
  classDatabase.py
  This class contains all database informations and methods
"""

__author__ = "Pev"
__version__ = "1.1"
__email__ = "pev.arfan@gmail.com"
__status__ = "Progress"


# IMPORT
# =============================================================================
import cgitb
import sys
import os
import psycopg2


# CONSTANTS
# =============================================================================
HOST = "localhost"
DBNAME = "postgis"
USER = "james"
PASSWORD = "james007"


# CLASS
# =============================================================================

class Database(object):
  """Class for Database configuration"""

  # CONSTRUCTOR
  # ---------------------------------------------------------------------------
  def __init__(self, host=HOST, dbName=DBNAME, user=USER, password=PASSWORD):
    """
      Database constructor.

      :Parameters:
        host
          The database host name
        database
          The database name
        user
          The user name
        password
          The user password

      :Example:
      >>> db = Database('localhost', 'postgis', 'user', 'password')

    """
    self.host = host
    self.dbName = dbName
    self.user = user
    self.password = password

    self.connect = None
    self.cursor = None


  # GETTER
  # ---------------------------------------------------------------------------

  def get_host(self):
    """ Return the database's host. """
    return self.host

  def get_dbname(self):
    """ Return the database's name. """
    return self.dbName

  def get_user(self):
    """ Return the database user's name. """
    return self.user


  # SETTER
  # ---------------------------------------------------------------------------

  def set_host(self, host):
    """
      Change the host name.

      :Parameters:
        host
          The new host name
    """
    self.host = host

  def set_dbname(self, dbName):
    """
      Change the database name.

      :Parameters:
        database
          The new database name (string)
    """
    self.dbName = dbName

  def set_user(self, user):
    """
      Change the user name.

      :Parameters:
        user
          The new user name (string)
    """
    self.user = user

  def set_password(self, password):
    """
      Change the password.

      :Parameters:
        password 
          The new password (string)
    """
    self.password = password


  # METHODS
  # ---------------------------------------------------------------------------

  def _connect(self):
    """ 
      Create the database connection
    """
    try:

      # Connection to the database
      self.connect = psycopg2.connect( \
        host = self.host, \
        database = self.dbName, \
        user = self.user, \
        password = self.password)

      # Init the database cursor
      self.cursor = self.connect.cursor()

    except Exception, e:
      print('Error classDatabase._connect(): {}'.format(e))

  def _execute(self, sqlQuery):
    """ 
      Return the result of a SQL query.

      :Parameters:
        sqlQuery
          The SQL query (string)
    """
    # Execute the query
    self.cursor.execute(sqlQuery)

    # Save the result on list
    rows = self.cursor.fetchall()

    # Return the result
    return rows

# MAIN
# =============================================================================

if __name__ == '__main__':
  cgitb.enable()
  print('Content-Type: text/html;charset=utf-8')
  print('') # Space End header
  print('classDatabase')
