import os
from dotenv import load_dotenv

load_dotenv()

def get_neo4j_config():
    neo4j_uri = os.getenv("NEO4J_URI")
    neo4j_username = os.getenv("NEO4J_USERNAME")
    neo4j_password = os.getenv("NEO4J_PASSWORD")
    conn_params = {
        "uri": neo4j_uri,
        "username": neo4j_username,
        "password": neo4j_password,
    }
    return conn_params