import mysql.connector
from mysql.connector import Error

def create_database_and_import_sql(host, user, password, port, database_name, sql_file_path):
    try:
        
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            port=port
        )
        cursor = connection.cursor()

        # Create a new database
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name}")
        cursor.execute(f"USE {database_name}")

        # Read and execute the SQL file
        with open(sql_file_path, 'r') as sql_file:
            sql_script = sql_file.read()

        for statement in sql_script.split(';'):
            if statement.strip():
                cursor.execute(statement)

        connection.commit()
        print(f"Database '{database_name}' created and SQL script executed successfully.")

    except Error as e:
        print(f"Error: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


aiven_host = 'localhost'
aiven_user = 'root'
aiven_password = ''
aiven_port = 3306  
database_name = 'xyz_enterprises'
sql_file_path = '/xyz_enterprises.sql'

create_database_and_import_sql(aiven_host, aiven_user, aiven_password, aiven_port, database_name, sql_file_path)
