from flask import Blueprint, request, jsonify
from db_utils import fetch_all, fetch_one, execute_query, insert_and_return_id

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('', methods=['GET'])
def get_inventory():
    """Get blood inventory with filters"""
    blood_type = request.args.get('blood_type')
    status = request.args.get('status')
    
    query = """
        SELECT bag_id, bag_number, donation_id, donor_id,
               blood_type::text, collection_date, expiry_date, volume_ml,
               component_type, storage_location, testing_status::text,
               status::text, assigned_to_request, quality_check_date,
               notes, created_at, updated_at
        FROM blood_inventory
        WHERE 1=1
    """
    params = []
    
    if blood_type:
        query += " AND blood_type = %s::blood_group"
        params.append(blood_type)
    
    if status:
        query += " AND status = %s::inventory_status_t"
        params.append(status)
    
    query += " ORDER BY expiry_date"
    
    try:
        inventory = fetch_all(query, tuple(params) if params else None)
        for item in inventory:
            if item.get('collection_date'):
                item['collection_date'] = item['collection_date'].isoformat()
            if item.get('expiry_date'):
                item['expiry_date'] = item['expiry_date'].isoformat()
            if item.get('quality_check_date'):
                item['quality_check_date'] = item['quality_check_date'].isoformat()
            if item.get('created_at'):
                item['created_at'] = item['created_at'].isoformat()
            if item.get('updated_at'):
                item['updated_at'] = item['updated_at'].isoformat()
        
        return jsonify(inventory), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/stats', methods=['GET'])
def get_inventory_stats():
    """Get inventory statistics by blood type"""
    query = """
        SELECT 
            blood_type::text,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
            SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved,
            SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
            SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) as assigned
        FROM blood_inventory
        GROUP BY blood_type
        ORDER BY blood_type
    """
    
    try:
        stats = fetch_all(query)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('/expiring', methods=['GET'])
def get_expiring():
    """Get inventory expiring soon"""
    days = request.args.get('days', 7, type=int)
    
    query = """
        SELECT bag_id, bag_number, blood_type::text, expiry_date,
               volume_ml, storage_location, status::text,
               (expiry_date - CURRENT_DATE) as days_to_expiry
        FROM blood_inventory
        WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + %s
              AND status IN ('available', 'reserved')
        ORDER BY expiry_date
    """
    
    try:
        items = fetch_all(query, (days,))
        for item in items:
            if item.get('expiry_date'):
                item['expiry_date'] = item['expiry_date'].isoformat()
        
        return jsonify(items), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@inventory_bp.route('', methods=['POST'])
def add_inventory():
    """Add new blood inventory"""
    data = request.get_json()
    
    required_fields = ['bagNumber', 'bloodType', 'collectionDate', 'expiryDate', 'volumeMl']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    query = """
        INSERT INTO blood_inventory (
            bag_number, donation_id, donor_id, blood_type, collection_date, expiry_date,
            volume_ml, component_type, storage_location, testing_status, status, notes
        ) VALUES (
            %s, %s, %s, %s::blood_group, %s, %s, %s, %s, %s, %s::testing_status_t, %s::inventory_status_t, %s
        )
    """
    
    params = (
        data['bagNumber'],
        data.get('donationId'),
        data.get('donorId'),
        data['bloodType'],
        data['collectionDate'],
        data['expiryDate'],
        data['volumeMl'],
        data.get('componentType', 'Whole Blood'),
        data.get('storageLocation'),
        data.get('testingStatus', 'pending'),
        data.get('status', 'available'),
        data.get('notes')
    )
    
    try:
        item = insert_and_return_id(query, params)
        if item.get('collection_date'):
            item['collection_date'] = item['collection_date'].isoformat()
        if item.get('expiry_date'):
            item['expiry_date'] = item['expiry_date'].isoformat()
        item['blood_type'] = str(item['blood_type'])
        item['status'] = str(item['status'])
        item['testing_status'] = str(item['testing_status'])
        
        return jsonify({'message': 'Inventory added successfully', 'inventory': item}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@inventory_bp.route('/<int:bag_id>', methods=['PUT'])
def update_inventory(bag_id):
    """Update inventory item"""
    data = request.get_json()
    
    query = """
        UPDATE blood_inventory SET
            status = COALESCE(%s::inventory_status_t, status),
            storage_location = COALESCE(%s, storage_location),
            assigned_to_request = COALESCE(%s, assigned_to_request),
            testing_status = COALESCE(%s::testing_status_t, testing_status),
            notes = COALESCE(%s, notes)
        WHERE bag_id = %s
    """
    
    params = (
        data.get('status'),
        data.get('storageLocation'),
        data.get('assignedToRequest'),
        data.get('testingStatus'),
        data.get('notes'),
        bag_id
    )
    
    try:
        execute_query(query, params, fetch=False)
        item = fetch_one("SELECT * FROM blood_inventory WHERE bag_id = %s", (bag_id,))
        
        if item.get('collection_date'):
            item['collection_date'] = item['collection_date'].isoformat()
        if item.get('expiry_date'):
            item['expiry_date'] = item['expiry_date'].isoformat()
        item['blood_type'] = str(item['blood_type'])
        item['status'] = str(item['status'])
        item['testing_status'] = str(item['testing_status'])
        
        return jsonify({'message': 'Inventory updated successfully', 'inventory': item}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
