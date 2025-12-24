import psycopg2
import os

def get_db_conn():
    conn = psycopg2.connect(
        host="localhost",
        database="jenkins_ai_database",
        user="postgres",
        password="saksham123",
        port="5432"
    )
    return conn