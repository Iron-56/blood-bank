from flask import Blueprint, request, jsonify
from db_utils import fetch_all, insert_and_return_id

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('', methods=['GET'])
def get_transactions():
    """Get all transactions"""
    request_id = request.args.get('request_id')
    
    query = """
        SELECT 
            tl.transaction_id, tl.request_id, tl.bag_id, tl.units_ml,
            tl.transaction_type::text, tl.issued_by, tl.issue_date, tl.remarks,
            bi.bag_number, bi.blood_type::text,
            rr.patient_name, h.name as hospital_name
        FROM transaction_log tl
        LEFT JOIN blood_inventory bi ON tl.bag_id = bi.bag_id
        LEFT JOIN recipient_request rr ON tl.request_id = rr.request_id
        LEFT JOIN hospital h ON rr.hospital_id = h.hospital_id
        WHERE 1=1
    """
    params = []
    
    if request_id:
        query += " AND tl.request_id = %s"
        params.append(request_id)
    
    query += " ORDER BY tl.issue_date DESC"
    
    try:
        transactions = fetch_all(query, tuple(params) if params else None)
        for trans in transactions:
            if trans.get('issue_date'):
                trans['issue_date'] = trans['issue_date'].isoformat()
        
        return jsonify(transactions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transactions_bp.route('', methods=['POST'])
def create_transaction():
    """Record new transaction"""
    data = request.get_json()
    
    required_fields = ['requestId', 'bagId', 'unitsMl', 'transactionType']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    query = """
        INSERT INTO transaction_log (
            request_id, bag_id, units_ml, transaction_type, issued_by, remarks
        ) VALUES (
            %s, %s, %s, %s::transaction_type_t, %s, %s
        )
    """
    
    params = (
        data['requestId'],
        data['bagId'],
        data['unitsMl'],
        data['transactionType'],
        data.get('issuedBy'),
        data.get('remarks')
    )
    
    try:
        transaction = insert_and_return_id(query, params)
        transaction['transaction_type'] = str(transaction['transaction_type'])
        if transaction.get('issue_date'):
            transaction['issue_date'] = transaction['issue_date'].isoformat()
        
        return jsonify({'message': 'Transaction recorded successfully', 'transaction': transaction}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
