from flask import Blueprint, request, jsonify
from db_utils import fetch_all, fetch_one, execute_query, insert_and_return_id

hospitals_bp = Blueprint('hospitals', __name__)

@hospitals_bp.route('', methods=['GET'])
def get_hospitals():
    """Get all hospitals"""
    city = request.args.get('city')
    status = request.args.get('status')
    
    query = """
        SELECT hospital_id, name, registration_number, email, phone,
               address, city, state, zip_code,
               contact_person, contact_person_phone, contact_person_email,
               hospital_type, bed_capacity, license_status,
               created_at, updated_at
        FROM hospital
        WHERE 1=1
    """
    params = []
    
    if city:
        query += " AND city ILIKE %s"
        params.append(f"%{city}%")
    
    if status:
        query += " AND license_status = %s"
        params.append(status)
    
    query += " ORDER BY name"
    
    try:
        hospitals = fetch_all(query, tuple(params) if params else None)
        
        for hospital in hospitals:
            if hospital.get('created_at'):
                hospital['created_at'] = hospital['created_at'].isoformat()
            if hospital.get('updated_at'):
                hospital['updated_at'] = hospital['updated_at'].isoformat()
        
        return jsonify(hospitals), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hospitals_bp.route('/<int:hospital_id>', methods=['GET'])
def get_hospital(hospital_id):
    """Get a specific hospital by ID"""
    query = """
        SELECT hospital_id, name, registration_number, email, phone,
               address, city, state, zip_code,
               contact_person, contact_person_phone, contact_person_email,
               hospital_type, bed_capacity, license_status,
               created_at, updated_at
        FROM hospital
        WHERE hospital_id = %s
    """
    
    try:
        hospital = fetch_one(query, (hospital_id,))
        if not hospital:
            return jsonify({'error': 'Hospital not found'}), 404
        
        if hospital.get('created_at'):
            hospital['created_at'] = hospital['created_at'].isoformat()
        if hospital.get('updated_at'):
            hospital['updated_at'] = hospital['updated_at'].isoformat()
        
        return jsonify(hospital), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@hospitals_bp.route('', methods=['POST'])
def create_hospital():
    """Create a new hospital"""
    data = request.get_json()
    
    required_fields = ['name', 'phone', 'city', 'state']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    query = """
        INSERT INTO hospital (
            name, registration_number, email, phone, address, city, state, zip_code,
            contact_person, contact_person_phone, contact_person_email,
            hospital_type, bed_capacity, license_status
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
    """
    
    params = (
        data['name'],
        data.get('registrationNumber'),
        data.get('email'),
        data['phone'],
        data.get('address'),
        data['city'],
        data['state'],
        data.get('zipCode'),
        data.get('contactPerson'),
        data.get('contactPersonPhone'),
        data.get('contactPersonEmail'),
        data.get('hospitalType'),
        data.get('bedCapacity'),
        data.get('licenseStatus', 'active')
    )
    
    try:
        hospital = insert_and_return_id(query, params)
        
        if hospital.get('created_at'):
            hospital['created_at'] = hospital['created_at'].isoformat()
        
        return jsonify({
            'message': 'Hospital registered successfully',
            'hospital': hospital
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@hospitals_bp.route('/<int:hospital_id>', methods=['PUT'])
def update_hospital(hospital_id):
    """Update an existing hospital"""
    data = request.get_json()
    
    check_query = "SELECT hospital_id FROM hospital WHERE hospital_id = %s"
    existing = fetch_one(check_query, (hospital_id,))
    if not existing:
        return jsonify({'error': 'Hospital not found'}), 404
    
    query = """
        UPDATE hospital SET
            name = COALESCE(%s, name),
            registration_number = COALESCE(%s, registration_number),
            email = COALESCE(%s, email),
            phone = COALESCE(%s, phone),
            address = COALESCE(%s, address),
            city = COALESCE(%s, city),
            state = COALESCE(%s, state),
            zip_code = COALESCE(%s, zip_code),
            contact_person = COALESCE(%s, contact_person),
            contact_person_phone = COALESCE(%s, contact_person_phone),
            contact_person_email = COALESCE(%s, contact_person_email),
            hospital_type = COALESCE(%s, hospital_type),
            bed_capacity = COALESCE(%s, bed_capacity),
            license_status = COALESCE(%s, license_status)
        WHERE hospital_id = %s
    """
    
    params = (
        data.get('name'),
        data.get('registrationNumber'),
        data.get('email'),
        data.get('phone'),
        data.get('address'),
        data.get('city'),
        data.get('state'),
        data.get('zipCode'),
        data.get('contactPerson'),
        data.get('contactPersonPhone'),
        data.get('contactPersonEmail'),
        data.get('hospitalType'),
        data.get('bedCapacity'),
        data.get('licenseStatus'),
        hospital_id
    )
    
    try:
        execute_query(query, params, fetch=False)
        
        hospital = fetch_one(
            "SELECT * FROM hospital WHERE hospital_id = %s",
            (hospital_id,)
        )
        
        if hospital.get('created_at'):
            hospital['created_at'] = hospital['created_at'].isoformat()
        if hospital.get('updated_at'):
            hospital['updated_at'] = hospital['updated_at'].isoformat()
        
        return jsonify({
            'message': 'Hospital updated successfully',
            'hospital': hospital
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@hospitals_bp.route('/<int:hospital_id>/requests', methods=['GET'])
def get_hospital_requests(hospital_id):
    """Get all requests from a specific hospital"""
    query = """
        SELECT 
            request_id, blood_type::text, units_requested, units_fulfilled,
            urgency_level::text, patient_name, patient_age, patient_gender,
            diagnosis_reason, required_by_date, request_date,
            request_status::text, doctor_name, doctor_contact_number,
            approved_by, approved_date, fulfilled_date, rejection_reason,
            notes, created_at
        FROM recipient_request
        WHERE hospital_id = %s
        ORDER BY request_date DESC
    """
    
    try:
        requests_data = fetch_all(query, (hospital_id,))
        
        for req in requests_data:
            if req.get('required_by_date'):
                req['required_by_date'] = req['required_by_date'].isoformat()
            if req.get('request_date'):
                req['request_date'] = req['request_date'].isoformat()
            if req.get('approved_date'):
                req['approved_date'] = req['approved_date'].isoformat()
            if req.get('fulfilled_date'):
                req['fulfilled_date'] = req['fulfilled_date'].isoformat()
            if req.get('created_at'):
                req['created_at'] = req['created_at'].isoformat()
        
        return jsonify(requests_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
