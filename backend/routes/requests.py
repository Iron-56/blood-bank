from flask import Blueprint, request, jsonify
from db_utils import fetch_all, fetch_one, execute_query, insert_and_return_id

requests_bp = Blueprint('requests', __name__)

@requests_bp.route('', methods=['GET'])
def get_requests():
    """Get all blood requests"""
    status = request.args.get('status')
    hospital_id = request.args.get('hospital_id')
    
    query = """
        SELECT 
            rr.request_id, rr.hospital_id, h.name as hospital_name,
            rr.blood_type::text, rr.units_requested, rr.units_fulfilled,
            rr.urgency_level::text, rr.patient_name, rr.patient_age,
            rr.patient_gender, rr.diagnosis_reason, rr.doctor_name,
            rr.doctor_contact_number, rr.required_by_date, rr.request_date,
            rr.request_status::text, rr.approved_by, rr.rejection_reason,
            rr.notes, rr.created_at, rr.updated_at
        FROM recipient_request rr
        JOIN hospital h ON rr.hospital_id = h.hospital_id
        WHERE 1=1
    """
    params = []
    
    if status:
        query += " AND rr.request_status = %s::request_status_t"
        params.append(status)
    
    if hospital_id:
        query += " AND rr.hospital_id = %s"
        params.append(hospital_id)
    
    query += " ORDER BY rr.request_date DESC"
    
    try:
        requests = fetch_all(query, tuple(params) if params else None)
        for req in requests:
            if req.get('required_by_date'):
                req['required_by_date'] = req['required_by_date'].isoformat()
            if req.get('request_date'):
                req['request_date'] = req['request_date'].isoformat()
            if req.get('created_at'):
                req['created_at'] = req['created_at'].isoformat()
            if req.get('updated_at'):
                req['updated_at'] = req['updated_at'].isoformat()
        
        return jsonify(requests), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@requests_bp.route('/<int:request_id>', methods=['GET'])
def get_request(request_id):
    """Get specific request"""
    query = """
        SELECT 
            rr.*, h.name as hospital_name
        FROM recipient_request rr
        JOIN hospital h ON rr.hospital_id = h.hospital_id
        WHERE rr.request_id = %s
    """
    
    try:
        req = fetch_one(query, (request_id,))
        if not req:
            return jsonify({'error': 'Request not found'}), 404
        
        req['blood_type'] = str(req['blood_type'])
        req['urgency_level'] = str(req['urgency_level'])
        req['request_status'] = str(req['request_status'])
        if req.get('required_by_date'):
            req['required_by_date'] = req['required_by_date'].isoformat()
        if req.get('request_date'):
            req['request_date'] = req['request_date'].isoformat()
        
        return jsonify(req), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@requests_bp.route('', methods=['POST'])
def create_request():
    """Create new blood request"""
    data = request.get_json()
    
    required_fields = ['hospitalId', 'bloodType', 'units', 'urgency', 'patientName', 'contactNumber', 'requiredBy']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    query = """
        INSERT INTO recipient_request (
            hospital_id, blood_type, units_requested, urgency_level,
            patient_name, patient_age, patient_gender, diagnosis_reason,
            doctor_name, doctor_contact_number, required_by_date, notes
        ) VALUES (
            %s, %s::blood_group, %s, %s::urgency_level_t,
            %s, %s, %s, %s, %s, %s, %s, %s
        )
    """
    
    params = (
        data['hospitalId'],
        data['bloodType'],
        data['units'],
        data['urgency'],
        data['patientName'],
        data.get('patientAge'),
        data.get('patientGender'),
        data.get('reason'),
        data.get('doctorName'),
        data['contactNumber'],
        data['requiredBy'],
        data.get('notes')
    )
    
    try:
        req = insert_and_return_id(query, params)
        req['blood_type'] = str(req['blood_type'])
        req['urgency_level'] = str(req['urgency_level'])
        req['request_status'] = str(req['request_status'])
        if req.get('required_by_date'):
            req['required_by_date'] = req['required_by_date'].isoformat()
        
        return jsonify({'message': 'Request created successfully', 'request': req}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@requests_bp.route('/<int:request_id>', methods=['PUT'])
def update_request(request_id):
    """Update request status"""
    data = request.get_json()
    
    query = """
        UPDATE recipient_request SET
            request_status = COALESCE(%s::request_status_t, request_status),
            approved_by = COALESCE(%s, approved_by),
            rejection_reason = COALESCE(%s, rejection_reason),
            notes = COALESCE(%s, notes),
            units_fulfilled = COALESCE(%s, units_fulfilled)
        WHERE request_id = %s
    """
    
    params = (
        data.get('status'),
        data.get('approvedBy'),
        data.get('rejectionReason'),
        data.get('notes'),
        data.get('unitsFulfilled'),
        request_id
    )
    
    try:
        execute_query(query, params, fetch=False)
        req = fetch_one("SELECT * FROM recipient_request WHERE request_id = %s", (request_id,))
        
        req['blood_type'] = str(req['blood_type'])
        req['urgency_level'] = str(req['urgency_level'])
        req['request_status'] = str(req['request_status'])
        
        return jsonify({'message': 'Request updated successfully', 'request': req}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
