import uuid
import os
from posixpath import join
from psycopg2 import sql
from werkzeug.utils import secure_filename
import database_common

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
UPLOAD_FOLDER = 'static/upload'
dirname = os.path.dirname(__file__)
FOLDER_NAME = os.path.join(dirname, UPLOAD_FOLDER)


@database_common.connection_handler
def get_all_scores(cursor):
    query = """
        SELECT *
        FROM scores;
        """
    cursor.execute(query)
    return cursor.fetchall()


@database_common.connection_handler
def update_score(cursor, new_score):
    query = """
        UPDATE scores
        SET user_name = %s, score = %s
        WHERE game_type = %s;
        """
    cursor.execute(query, (new_score['user_name'], new_score['score'], new_score['game_type']))
