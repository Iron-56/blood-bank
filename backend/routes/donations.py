from flask import Blueprint, request, jsonify
from db_utils import fetch_all, fetch_one, insert_and_return_id

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('', methods=['GET'])
def get_donations():
    """Get all donations"""
    donor_id = request.args.get('donor_id')
    
    query = """
        SELECT 
            bd.donation_id, bd.donor_id, bd.donation_date, bd.location,
            bd.volume_ml, bd.blood_type::text, bd.hemoglobin_level,
            bd.blood_pressure_systolic, bd.blood_pressure_diastolic,
            bd.donation_status, bd.screened, bd.screening_results,
            bd.staff_name, bd.notes, bd.created_at,
            d.first_name || ' ' || d.last_name as donor_name
        FROM blood_donation bd
        JOIN donor d ON bd.donor_id = d.donor_id
        WHERE 1=1
    """
    params = []
    
    if donor_id:
        query += " AND bd.donor_id = %s"
        params.append(donor_id)
    
    query += " ORDER BY bd.donation_date DESC"
    
    try:
        donations = fetch_all(query, tuple(params) if params else None)
        for donation in donations:
            if donation.get('donation_date'):
                donation['donation_date'] = donation['donation_date'].isoformat()
            if donation.get('created_at'):
                donation['created_at'] = donation['created_at'].isoformat()
        
        return jsonify(donations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donations_bp.route('', methods=['POST'])
def create_donation():
    """Record new donation"""
    data = request.get_json()
    
    required_fields = ['donorId', 'donationDate', 'bloodType', 'volumeMl']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    query = """
        INSERT INTO blood_donation (
            donor_id, donation_date, location, volume_ml, blood_type,
            hemoglobin_level, blood_pressure_systolic, blood_pressure_diastolic,
            donation_status, screened, screening_results, staff_name, notes
        ) VALUES (
            %s, %s, %s, %s, %s::blood_group, %s, %s, %s, %s, %s, %s, %s, %s
        )
    """
    
    params = (
        data['donorId'],
        data['donationDate'],
        data.get('location'),
        data['volumeMl'],
        data['bloodType'],
        data.get('hemoglobinLevel'),
        data.get('bloodPressureSystolic'),
        data.get('bloodPressureDiastolic'),
        data.get('status', 'completed'),
        data.get('screened', False),
        data.get('screeningResults'),
        data.get('staffName'),
        data.get('notes')
    )
    
    try:
        donation = insert_and_return_id(query, params)
        donation['blood_type'] = str(donation['blood_type'])
        if donation.get('donation_date'):
            donation['donation_date'] = donation['donation_date'].isoformat()
        
        return jsonify({'message': 'Donation recorded successfully', 'donation': donation}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
