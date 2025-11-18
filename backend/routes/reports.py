from flask import Blueprint, jsonify, request
from db_utils import fetch_all, fetch_one
from datetime import datetime, timedelta

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/stats', methods=['GET'])
def get_report_stats():
    """Get overall statistics for reports"""
    
    try:
        days = request.args.get('days', 30, type=int)
        
        total_donations = fetch_one(f"""
            SELECT COUNT(*) as count 
            FROM blood_donation
            WHERE donation_date >= CURRENT_DATE - INTERVAL '{days} days'
        """)['count']
        
        total_requests = fetch_one(f"""
            SELECT COUNT(*) as count 
            FROM recipient_request
            WHERE request_date >= CURRENT_DATE - INTERVAL '{days} days'
        """)['count']
        
        active_donors = fetch_one("SELECT COUNT(*) as count FROM donor")['count']
        
        hospitals_served = fetch_one("SELECT COUNT(*) as count FROM hospital")['count']
        
        return jsonify({
            'total_donations': total_donations,
            'total_requests': total_requests,
            'active_donors': active_donors,
            'hospitals_served': hospitals_served,
            'period_days': days
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/blood-usage', methods=['GET'])
def get_blood_usage():
    """Get monthly blood usage data for the last 6 months"""
    
    try:
        months = request.args.get('months', 6, type=int)
        
        monthly_usage = fetch_all(f"""
            SELECT 
                TO_CHAR(request_date, 'Mon') as month,
                EXTRACT(YEAR FROM request_date) as year,
                COUNT(*) as usage
            FROM recipient_request
            WHERE request_date >= CURRENT_DATE - INTERVAL '{months} months'
                AND request_status = 'approved'
            GROUP BY TO_CHAR(request_date, 'Mon'), 
                     DATE_TRUNC('month', request_date),
                     EXTRACT(YEAR FROM request_date)
            ORDER BY DATE_TRUNC('month', request_date)
        """)
        
        return jsonify(monthly_usage), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/blood-type-distribution', methods=['GET'])
def get_blood_type_distribution():
    """Get distribution of donations by blood type"""
    
    try:
        days = request.args.get('days', 180, type=int)  # Last 6 months by default
        
        distribution = fetch_all(f"""
            SELECT 
                blood_type::text as name,
                COUNT(*) as value
            FROM blood_donation
            WHERE donation_date >= CURRENT_DATE - INTERVAL '{days} days'
            GROUP BY blood_type
            ORDER BY blood_type
        """)
        
        colors = {
            'A+': '#ef4444', 'A-': '#f97316', 
            'B+': '#f59e0b', 'B-': '#eab308',
            'O+': '#84cc16', 'O-': '#22c55e', 
            'AB+': '#10b981', 'AB-': '#14b8a6'
        }
        
        for item in distribution:
            item['color'] = colors.get(item['name'], '#gray')
        
        return jsonify(distribution), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/hospital-requests', methods=['GET'])
def get_hospital_requests():
    """Get request summary by hospital"""
    
    try:
        days = request.args.get('days', 180, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        hospital_data = fetch_all(f"""
            SELECT 
                h.name as hospital,
                COUNT(rr.request_id) as requests,
                h.hospital_id
            FROM hospital h
            LEFT JOIN recipient_request rr ON h.hospital_id = rr.hospital_id
                AND rr.request_date >= CURRENT_DATE - INTERVAL '{days} days'
            GROUP BY h.hospital_id, h.name
            HAVING COUNT(rr.request_id) > 0
            ORDER BY COUNT(rr.request_id) DESC
            LIMIT {limit}
        """)
        
        return jsonify(hospital_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/donation-trends', methods=['GET'])
def get_donation_trends():
    """Get donation trends over time"""
    
    try:
        months = request.args.get('months', 6, type=int)
        
        trends = fetch_all(f"""
            SELECT 
                TO_CHAR(donation_date, 'Mon') as month,
                blood_type::text,
                COUNT(*) as donations
            FROM blood_donation
            WHERE donation_date >= CURRENT_DATE - INTERVAL '{months} months'
            GROUP BY TO_CHAR(donation_date, 'Mon'), 
                     DATE_TRUNC('month', donation_date),
                     blood_type
            ORDER BY DATE_TRUNC('month', donation_date), blood_type
        """)
        
        return jsonify(trends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/inventory-snapshot', methods=['GET'])
def get_inventory_snapshot():
    """Get current inventory snapshot by blood type"""
    
    try:
        snapshot = fetch_all("""
            SELECT 
                blood_type::text,
                COUNT(*) FILTER (WHERE status = 'available') as available,
                COUNT(*) FILTER (WHERE status = 'reserved') as reserved,
                COUNT(*) FILTER (WHERE status = 'expired') as expired,
                COUNT(*) FILTER (WHERE status = 'assigned') as assigned
            FROM blood_inventory
            GROUP BY blood_type
            ORDER BY blood_type
        """)
        
        return jsonify(snapshot), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/monthly-summary', methods=['GET'])
def get_monthly_summary():
    """Get comprehensive monthly summary"""
    
    try:
        year = request.args.get('year', datetime.now().year, type=int)
        month = request.args.get('month', datetime.now().month, type=int)
        
        donations = fetch_one(f"""
            SELECT COUNT(*) as count
            FROM blood_donation
            WHERE EXTRACT(YEAR FROM donation_date) = {year}
                AND EXTRACT(MONTH FROM donation_date) = {month}
        """)['count']
        
        requests = fetch_one(f"""
            SELECT COUNT(*) as count
            FROM recipient_request
            WHERE EXTRACT(YEAR FROM request_date) = {year}
                AND EXTRACT(MONTH FROM request_date) = {month}
        """)['count']
        
        new_donors = fetch_one(f"""
            SELECT COUNT(*) as count
            FROM donor
            WHERE EXTRACT(YEAR FROM created_at) = {year}
                AND EXTRACT(MONTH FROM created_at) = {month}
        """)['count']
        
        expired = fetch_one(f"""
            SELECT COUNT(*) as count
            FROM blood_inventory
            WHERE EXTRACT(YEAR FROM expiry_date) = {year}
                AND EXTRACT(MONTH FROM expiry_date) = {month}
                AND status = 'expired'
        """)['count']
        
        return jsonify({
            'year': year,
            'month': month,
            'donations': donations,
            'requests': requests,
            'new_donors': new_donors,
            'expired_units': expired
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/donor-demographics', methods=['GET'])
def get_donor_demographics():
    """Get donor demographics by blood type"""
    
    try:
        demographics = fetch_all("""
            SELECT 
                blood_type::text,
                COUNT(*) as donor_count,
                COUNT(CASE WHEN gender = 'male' THEN 1 END) as male_count,
                COUNT(CASE WHEN gender = 'female' THEN 1 END) as female_count,
                COUNT(CASE WHEN gender = 'other' THEN 1 END) as other_count
            FROM donor
            GROUP BY blood_type
            ORDER BY blood_type
        """)
        
        return jsonify(demographics), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/request-status-summary', methods=['GET'])
def get_request_status_summary():
    """Get summary of requests by status"""
    
    try:
        days = request.args.get('days', 30, type=int)
        
        status_summary = fetch_all(f"""
            SELECT 
                request_status::text as status,
                COUNT(*) as count,
                SUM(units_requested) as total_units
            FROM recipient_request
            WHERE request_date >= CURRENT_DATE - INTERVAL '{days} days'
            GROUP BY request_status
            ORDER BY request_status
        """)
        
        return jsonify(status_summary), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/export/csv', methods=['GET'])
def export_csv():
    """Export report data as CSV"""
    
    try:
        report_type = request.args.get('type', 'donations')
        
        if report_type == 'donations':
            data = fetch_all("""
                SELECT 
                    bd.donation_id,
                    d.first_name || ' ' || d.last_name as donor_name,
                    bd.blood_type::text,
                    bd.donation_date,
                    bd.volume_ml,
                    bd.donation_status::text
                FROM blood_donation bd
                JOIN donor d ON bd.donor_id = d.donor_id
                ORDER BY bd.donation_date DESC
            """)
        elif report_type == 'requests':
            data = fetch_all("""
                SELECT 
                    rr.request_id,
                    h.name as hospital_name,
                    rr.blood_type::text,
                    rr.request_date,
                    rr.units_requested,
                    rr.units_fulfilled,
                    rr.request_status::text,
                    rr.urgency_level::text
                FROM recipient_request rr
                JOIN hospital h ON rr.hospital_id = h.hospital_id
                ORDER BY rr.request_date DESC
            """)
        elif report_type == 'inventory':
            data = fetch_all("""
                SELECT 
                    bag_id,
                    bag_number,
                    blood_type::text,
                    collection_date,
                    expiry_date,
                    volume_ml,
                    component_type,
                    status::text,
                    storage_location
                FROM blood_inventory
                ORDER BY collection_date DESC
            """)
        else:
            return jsonify({'error': 'Invalid report type'}), 400
        
        for row in data:
            for key, value in row.items():
                if hasattr(value, 'isoformat'):
                    row[key] = value.isoformat()
        
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
