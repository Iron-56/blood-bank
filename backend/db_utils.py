import psycopg2
import psycopg2.extras
from contextlib import contextmanager
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'blood_bank'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        yield conn
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

@contextmanager
def get_db_cursor(commit=True):
    """Context manager for database cursor with auto-commit"""
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            yield cursor
            if commit:
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()

def execute_query(query, params=None, fetch=True):
    """
    Execute a query and return results
    
    Args:
        query: SQL query string
        params: Query parameters (tuple or dict)
        fetch: Whether to fetch results (False for INSERT/UPDATE/DELETE)
    
    Returns:
        List of dictionaries for SELECT, affected row count for others
    """
    with get_db_cursor() as cursor:
        cursor.execute(query, params)
        
        if fetch:
            return cursor.fetchall()
        else:
            return cursor.rowcount

def execute_many(query, params_list):
    """Execute the same query with multiple parameter sets"""
    with get_db_cursor() as cursor:
        cursor.executemany(query, params_list)
        return cursor.rowcount

def fetch_one(query, params=None):
    """Execute query and fetch single result"""
    with get_db_cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchone()

def fetch_all(query, params=None):
    """Execute query and fetch all results"""
    with get_db_cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchall()

def insert_and_return_id(query, params=None):
    """Insert a record and return its ID"""
    with get_db_cursor() as cursor:
        cursor.execute(query + " RETURNING *", params)
        return cursor.fetchone()

def test_connection():
    """Test database connection"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                return True, f"Connected successfully: {version[0]}"
    except Exception as e:
        return False, f"Connection failed: {str(e)}"
