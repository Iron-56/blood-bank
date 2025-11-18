from flask import Blueprint, jsonify, request
from db_utils import fetch_all, fetch_one

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    
    try:
        total_donors = fetch_one("SELECT COUNT(*) as count FROM donor")['count']
        total_hospitals = fetch_one("SELECT COUNT(*) as count FROM hospital")['count']
        total_donations = fetch_one("SELECT COUNT(*) as count FROM blood_donation")['count']
        
        available_units = fetch_one("""
            SELECT COUNT(*) as count 
            FROM blood_inventory 
            WHERE status = 'available' AND expiry_date >= CURRENT_DATE
        """)['count']
        
        pending_requests = fetch_one("""
            SELECT COUNT(*) as count 
            FROM recipient_request 
            WHERE request_status = 'pending'
        """)['count']
        
        blood_type_data = fetch_all("""
            SELECT blood_type::text as name, COUNT(*) as units
            FROM blood_inventory
            WHERE status = 'available' AND expiry_date >= CURRENT_DATE
            GROUP BY blood_type
            ORDER BY blood_type
        """)
        
        monthly_donations = fetch_all("""
            SELECT 
                TO_CHAR(donation_date, 'Mon') as month,
                COUNT(*) as donations
            FROM blood_donation
            WHERE donation_date >= CURRENT_DATE - INTERVAL '6 months'
            GROUP BY TO_CHAR(donation_date, 'Mon'), DATE_TRUNC('month', donation_date)
            ORDER BY DATE_TRUNC('month', donation_date)
        """)
        
        request_status = fetch_all("""
            SELECT request_status::text as status, COUNT(*) as count
            FROM recipient_request
            GROUP BY request_status
        """)
        
        requests_by_status = {row['status']: row['count'] for row in request_status}
        
        blood_type_distribution = {row['name']: row['units'] for row in blood_type_data}
        
        expiring_soon = fetch_one("""
            SELECT COUNT(*) as count
            FROM blood_inventory
            WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
                  AND status IN ('available', 'reserved')
        """)['count']
        
        total_inventory = fetch_one("""
            SELECT COUNT(*) as count FROM blood_inventory
        """)['count']
        
        total_requests = fetch_one("""
            SELECT COUNT(*) as count FROM recipient_request
        """)['count']
        
        return jsonify({
            'total_donors': total_donors,
            'total_hospitals': total_hospitals,
            'total_donations': total_donations,
            'total_inventory': total_inventory,
            'total_requests': total_requests,
            'available_units': available_units,
            'expiring_soon': expiring_soon,
            'blood_type_distribution': blood_type_distribution,
            'monthly_donations': monthly_donations,
            'requests_by_status': requests_by_status
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/recent-activity', methods=['GET'])
def get_recent_activity():
    """Get recent activity across all tables"""
    
    try:
        recent_donations = fetch_all("""
            SELECT 
                'donation' as type,
                bd.donation_id as id,
                d.first_name || ' ' || d.last_name as name,
                bd.blood_type::text,
                bd.donation_date as date,
                bd.created_at
            FROM blood_donation bd
            JOIN donor d ON bd.donor_id = d.donor_id
            ORDER BY bd.created_at DESC
            LIMIT 5
        """)
        
        recent_requests = fetch_all("""
            SELECT 
                'request' as type,
                rr.request_id as id,
                h.name,
                rr.blood_type::text,
                rr.request_date as date,
                rr.created_at
            FROM recipient_request rr
            JOIN hospital h ON rr.hospital_id = h.hospital_id
            ORDER BY rr.created_at DESC
            LIMIT 5
        """)
        
        all_activity = recent_donations + recent_requests
        all_activity.sort(key=lambda x: x['created_at'], reverse=True)
        
        for activity in all_activity:
            if activity.get('date'):
                activity['date'] = activity['date'].isoformat()
            if activity.get('created_at'):
                activity['created_at'] = activity['created_at'].isoformat()
        
        return jsonify(all_activity[:10]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/monthly-comparison', methods=['GET'])
def get_monthly_comparison():
    """Get monthly donations vs requests for comparison chart"""
    
    try:
        months = request.args.get('months', 6, type=int)
        
        monthly_donations = fetch_all(f"""
            SELECT 
                TO_CHAR(donation_date, 'Mon') as month,
                DATE_TRUNC('month', donation_date) as month_date,
                COUNT(*) as donations
            FROM blood_donation
            WHERE donation_date >= CURRENT_DATE - INTERVAL '{months} months'
            GROUP BY TO_CHAR(donation_date, 'Mon'), DATE_TRUNC('month', donation_date)
            ORDER BY DATE_TRUNC('month', donation_date)
        """)
        
        monthly_requests = fetch_all(f"""
            SELECT 
                TO_CHAR(request_date, 'Mon') as month,
                DATE_TRUNC('month', request_date) as month_date,
                SUM(units_requested) as requests
            FROM recipient_request
            WHERE request_date >= CURRENT_DATE - INTERVAL '{months} months'
            GROUP BY TO_CHAR(request_date, 'Mon'), DATE_TRUNC('month', request_date)
            ORDER BY DATE_TRUNC('month', request_date)
        """)
        
        result = {}
        for item in monthly_donations:
            month_key = item['month']
            result[month_key] = {
                'month': month_key,
                'donations': item['donations'],
                'requests': 0
            }
        
        for item in monthly_requests:
            month_key = item['month']
            if month_key in result:
                result[month_key]['requests'] = item['requests']
            else:
                result[month_key] = {
                    'month': month_key,
                    'donations': 0,
                    'requests': item['requests']
                }
        
        comparison_data = list(result.values())
        
        return jsonify(comparison_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
