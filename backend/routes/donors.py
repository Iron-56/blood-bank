from flask import Blueprint, request, jsonify
from db_utils import fetch_all, fetch_one, execute_query, insert_and_return_id
from datetime import datetime

donors_bp = Blueprint('donors', __name__)

@donors_bp.route('', methods=['GET'])
def get_donors():
    """Get all donors or filter by query parameters"""
    blood_type = request.args.get('blood_type')
    search = request.args.get('search')
    status = request.args.get('status')
    
    query = """
        SELECT donor_id, first_name, last_name, email, phone, 
               blood_type::text, gender, date_of_birth, address, city, state, zip_code,
               status, medical_history, last_donation_date, total_donations,
               created_at, updated_at
        FROM donor
        WHERE 1=1
    """
    params = []
    
    if blood_type:
        query += " AND blood_type = %s"
        params.append(blood_type)
    
    if status:
        query += " AND status = %s"
        params.append(status)
    
    if search:
        query += " AND (first_name ILIKE %s OR last_name ILIKE %s OR email ILIKE %s OR phone ILIKE %s)"
        search_param = f"%{search}%"
        params.extend([search_param, search_param, search_param, search_param])
    
    query += " ORDER BY created_at DESC"
    
    try:
        donors = fetch_all(query, tuple(params) if params else None)
        for donor in donors:
            if donor.get('date_of_birth'):
                donor['date_of_birth'] = donor['date_of_birth'].isoformat()
            if donor.get('last_donation_date'):
                donor['last_donation_date'] = donor['last_donation_date'].isoformat()
            if donor.get('created_at'):
                donor['created_at'] = donor['created_at'].isoformat()
            if donor.get('updated_at'):
                donor['updated_at'] = donor['updated_at'].isoformat()
        
        return jsonify(donors), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donors_bp.route('/<int:donor_id>', methods=['GET'])
def get_donor(donor_id):
    """Get a specific donor by ID"""
    query = """
        SELECT donor_id, first_name, last_name, email, phone, 
               blood_type::text, gender, date_of_birth, address, city, state, zip_code,
               status, medical_history, last_donation_date, total_donations,
               created_at, updated_at
        FROM donor
        WHERE donor_id = %s
    """
    
    try:
        donor = fetch_one(query, (donor_id,))
        if not donor:
            return jsonify({'error': 'Donor not found'}), 404
        
        if donor.get('date_of_birth'):
            donor['date_of_birth'] = donor['date_of_birth'].isoformat()
        if donor.get('last_donation_date'):
            donor['last_donation_date'] = donor['last_donation_date'].isoformat()
        if donor.get('created_at'):
            donor['created_at'] = donor['created_at'].isoformat()
        if donor.get('updated_at'):
            donor['updated_at'] = donor['updated_at'].isoformat()
        
        return jsonify(donor), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donors_bp.route('', methods=['POST'])
def create_donor():
    """Create a new donor"""
    data = request.get_json()
    
    required_fields = ['firstName', 'lastName', 'phone', 'bloodType', 'dateOfBirth']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    query = """
        INSERT INTO donor (
            first_name, last_name, email, phone, blood_type, gender, 
            date_of_birth, address, city, state, zip_code, medical_history, status
        ) VALUES (
            %s, %s, %s, %s, %s::blood_group, %s, %s, %s, %s, %s, %s, %s, %s
        )
    """
    
    params = (
        data['firstName'],
        data['lastName'],
        data.get('email'),
        data['phone'],
        data['bloodType'],
        data.get('gender'),
        data['dateOfBirth'],
        data.get('address'),
        data.get('city'),
        data.get('state'),
        data.get('zipCode'),
        data.get('medicalHistory'),
        data.get('status', 'available')
    )
    
    try:
        donor = insert_and_return_id(query, params)
        
        if donor.get('date_of_birth'):
            donor['date_of_birth'] = donor['date_of_birth'].isoformat()
        if donor.get('created_at'):
            donor['created_at'] = donor['created_at'].isoformat()
        
        return jsonify({
            'message': 'Donor registered successfully',
            'donor': donor
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@donors_bp.route('/<int:donor_id>', methods=['PUT'])
def update_donor(donor_id):
    """Update an existing donor"""
    data = request.get_json()
    
    check_query = "SELECT donor_id FROM donor WHERE donor_id = %s"
    existing = fetch_one(check_query, (donor_id,))
    if not existing:
        return jsonify({'error': 'Donor not found'}), 404
    
    query = """
        UPDATE donor SET
            first_name = COALESCE(%s, first_name),
            last_name = COALESCE(%s, last_name),
            email = COALESCE(%s, email),
            phone = COALESCE(%s, phone),
            blood_type = COALESCE(%s::blood_group, blood_type),
            gender = COALESCE(%s, gender),
            date_of_birth = COALESCE(%s, date_of_birth),
            address = COALESCE(%s, address),
            city = COALESCE(%s, city),
            state = COALESCE(%s, state),
            zip_code = COALESCE(%s, zip_code),
            medical_history = COALESCE(%s, medical_history),
            status = COALESCE(%s, status)
        WHERE donor_id = %s
    """
    
    params = (
        data.get('firstName'),
        data.get('lastName'),
        data.get('email'),
        data.get('phone'),
        data.get('bloodType'),
        data.get('gender'),
        data.get('dateOfBirth'),
        data.get('address'),
        data.get('city'),
        data.get('state'),
        data.get('zipCode'),
        data.get('medicalHistory'),
        data.get('status'),
        donor_id
    )
    
    try:
        execute_query(query, params, fetch=False)
        
        donor = fetch_one(
            "SELECT * FROM donor WHERE donor_id = %s", 
            (donor_id,)
        )
        
        if donor.get('date_of_birth'):
            donor['date_of_birth'] = donor['date_of_birth'].isoformat()
        if donor.get('last_donation_date'):
            donor['last_donation_date'] = donor['last_donation_date'].isoformat()
        if donor.get('created_at'):
            donor['created_at'] = donor['created_at'].isoformat()
        if donor.get('updated_at'):
            donor['updated_at'] = donor['updated_at'].isoformat()
        donor['blood_type'] = str(donor['blood_type'])
        
        return jsonify({
            'message': 'Donor updated successfully',
            'donor': donor
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@donors_bp.route('/<int:donor_id>', methods=['DELETE'])
def delete_donor(donor_id):
    """Delete a donor"""
    check_query = "SELECT donor_id FROM donor WHERE donor_id = %s"
    existing = fetch_one(check_query, (donor_id,))
    if not existing:
        return jsonify({'error': 'Donor not found'}), 404
    
    query = "DELETE FROM donor WHERE donor_id = %s"
    
    try:
        execute_query(query, (donor_id,), fetch=False)
        return jsonify({'message': 'Donor deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@donors_bp.route('/<int:donor_id>/history', methods=['GET'])
def get_donor_history(donor_id):
    """Get donation history for a donor"""
    query = """
        SELECT 
            bd.donation_id, bd.donation_date, bd.location, bd.volume_ml,
            bd.blood_type::text, bd.hemoglobin_level, bd.donation_status,
            bd.screened, bd.staff_name, bd.notes, bd.created_at
        FROM blood_donation bd
        WHERE bd.donor_id = %s
        ORDER BY bd.donation_date DESC
    """
    
    try:
        donations = fetch_all(query, (donor_id,))
        
        for donation in donations:
            if donation.get('donation_date'):
                donation['donation_date'] = donation['donation_date'].isoformat()
            if donation.get('created_at'):
                donation['created_at'] = donation['created_at'].isoformat()
        
        return jsonify(donations), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
