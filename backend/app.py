from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

from db_utils import test_connection

from routes.donors import donors_bp
from routes.hospitals import hospitals_bp
from routes.donations import donations_bp
from routes.inventory import inventory_bp
from routes.requests import requests_bp
from routes.transactions import transactions_bp
from routes.users import users_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JSON_SORT_KEYS'] = False

CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','),
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.register_blueprint(donors_bp, url_prefix='/api/donors')
app.register_blueprint(hospitals_bp, url_prefix='/api/hospitals')
app.register_blueprint(donations_bp, url_prefix='/api/donations')
app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
app.register_blueprint(requests_bp, url_prefix='/api/requests')
app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(reports_bp, url_prefix='/api/reports')

@app.route('/')
def index():
    return jsonify({
        'message': 'Blood Bank Management System API',
        'version': '2.0.0',
        'database': 'PostgreSQL with Direct Queries',
        'endpoints': {
            'donors': '/api/donors',
            'hospitals': '/api/hospitals',
            'donations': '/api/donations',
            'inventory': '/api/inventory',
            'requests': '/api/requests',
            'transactions': '/api/transactions',
            'users': '/api/users',
            'dashboard': '/api/dashboard/stats',
            'reports': '/api/reports'
        }
    })

@app.route('/health')
def health():
    success, message = test_connection()
    return jsonify({
        'status': 'healthy' if success else 'unhealthy',
        'timestamp': datetime.now().isoformat(),
        'database': message
    }), 200 if success else 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    success, message = test_connection()
    if success:
        print(f"✓ {message}")
        print(f"✓ Starting Flask server on http://localhost:5000")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print(f"✗ {message}")
        print("Please check your database configuration and try again.")
