from flask import Blueprint, request, jsonify
from db_utils import fetch_all

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
def get_users():
    """Get all users"""
    query = """
        SELECT 
            user_id, username, email, full_name, role::text,
            donor_id, hospital_id, is_active, last_login, created_at
        FROM users
        ORDER BY created_at DESC
    """
    
    try:
        users = fetch_all(query)
        for user in users:
            if user.get('last_login'):
                user['last_login'] = user['last_login'].isoformat()
            if user.get('created_at'):
                user['created_at'] = user['created_at'].isoformat()
        
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/login', methods=['POST'])
def login():
    """Simple login endpoint (placeholder - implement proper authentication)"""
    data = request.get_json()
    
    query = """
        SELECT user_id, username, email, full_name, role::text, is_active
        FROM users
        WHERE username = %s OR email = %s
    """
    
    try:
        user = fetch_all(query, (data.get('username'), data.get('username')))
        if user and len(user) > 0:
            return jsonify({
                'message': 'Login successful',
                'user': user[0]
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
