import os
from dotenv import load_dotenv

load_dotenv()

import mysql.connector
from mysql.connector import Error


def get_db_connection():

    try:

        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "smartspenddb")
        )

        if connection.is_connected():

            print("✅ MySQL Database Connected Successfully!")

            return connection

    except Error as e:

        print("❌ Database Connection Error:")
        print(e)

        return None


def fetch_one(query, params=None):

    connection = get_db_connection()

    if not connection:
        return None

    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            query,
            params or ()
        )

        return cursor.fetchone()

    finally:

        cursor.close()
        connection.close()


def fetch_all(query, params=None):

    connection = get_db_connection()

    if not connection:
        return []

    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            query,
            params or ()
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()