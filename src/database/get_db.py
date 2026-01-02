import psycopg2
import os

def get_db_conn():
    return psycopg2.connect(os.getenv("DATABASE_URL"))