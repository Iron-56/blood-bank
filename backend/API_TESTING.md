# 🧪 API Testing Guide

Quick commands to test all API endpoints after setup.

## Prerequisites
```bash
# Backend running on http://localhost:5000
# Database initialized with sample data
```

## Health & Info

```bash
# Check API health
curl http://localhost:5000/health

# Get API info
curl http://localhost:5000/
```

## Donors API

```bash
# Get all donors
curl http://localhost:5000/api/donors

# Get donors by blood type
curl "http://localhost:5000/api/donors?blood_type=O+"

# Search donors
curl "http://localhost:5000/api/donors?search=Aish"

# Get specific donor
curl http://localhost:5000/api/donors/1

# Get donor history
curl http://localhost:5000/api/donors/1/history

# Create donor
curl -X POST http://localhost:5000/api/donors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "9999999999",
    "bloodType": "B+",
    "gender": "Male",
    "dateOfBirth": "1995-06-15",
    "city": "Mumbai",
    "state": "Maharashtra"
  }'
```

## Hospitals API

```bash
# Get all hospitals
curl http://localhost:5000/api/hospitals

# Get hospital by ID
curl http://localhost:5000/api/hospitals/1

# Get hospital's requests
curl http://localhost:5000/api/hospitals/1/requests

# Create hospital
curl -X POST http://localhost:5000/api/hospitals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hospital",
    "phone": "0801234567",
    "city": "Delhi",
    "state": "Delhi",
    "contactPerson": "Dr. Test",
    "hospitalType": "General",
    "bedCapacity": 100
  }'
```

## Inventory API

```bash
# Get all inventory
curl http://localhost:5000/api/inventory

# Get by blood type and status
curl "http://localhost:5000/api/inventory?blood_type=O+&status=available"

# Get inventory stats
curl http://localhost:5000/api/inventory/stats

# Get expiring items (next 7 days)
curl http://localhost:5000/api/inventory/expiring

# Get expiring items (next 14 days)
curl "http://localhost:5000/api/inventory/expiring?days=14"

# Add inventory
curl -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "bagNumber": "BAG-TEST-001",
    "bloodType": "A+",
    "collectionDate": "2024-11-15",
    "expiryDate": "2024-12-25",
    "volumeMl": 450,
    "componentType": "Whole Blood",
    "storageLocation": "Fridge A1",
    "testingStatus": "tested",
    "status": "available"
  }'

# Update inventory
curl -X PUT http://localhost:5000/api/inventory/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "reserved",
    "notes": "Reserved for request #5"
  }'
```

## Requests API

```bash
# Get all requests
curl http://localhost:5000/api/requests

# Get pending requests
curl "http://localhost:5000/api/requests?status=pending"

# Get requests by hospital
curl "http://localhost:5000/api/requests?hospital_id=1"

# Get specific request
curl http://localhost:5000/api/requests/1

# Create request
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "hospitalId": 1,
    "bloodType": "O+",
    "units": 2,
    "urgency": "Urgent",
    "patientName": "Test Patient",
    "patientAge": 45,
    "patientGender": "Male",
    "reason": "Emergency Surgery",
    "doctorName": "Dr. Smith",
    "contactNumber": "9876543210",
    "requiredBy": "2024-11-20"
  }'

# Update request (approve)
curl -X PUT http://localhost:5000/api/requests/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "approvedBy": "Admin User"
  }'

# Update request (reject)
curl -X PUT http://localhost:5000/api/requests/2 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "rejectionReason": "Insufficient stock"
  }'
```

## Donations API

```bash
# Get all donations
curl http://localhost:5000/api/donations

# Get donations by donor
curl "http://localhost:5000/api/donations?donor_id=1"

# Record donation
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": 1,
    "donationDate": "2024-11-15",
    "location": "Main Blood Bank",
    "volumeMl": 450,
    "bloodType": "O+",
    "hemoglobinLevel": 14.5,
    "bloodPressureSystolic": 120,
    "bloodPressureDiastolic": 80,
    "status": "completed",
    "screened": true,
    "staffName": "Nurse Jane"
  }'
```

## Transactions API

```bash
# Get all transactions
curl http://localhost:5000/api/transactions

# Get transactions for specific request
curl "http://localhost:5000/api/transactions?request_id=1"

# Record transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": 1,
    "bagId": 1,
    "unitsMl": 450,
    "transactionType": "issue",
    "issuedBy": "Admin User",
    "remarks": "Issued for emergency surgery"
  }'
```

## Dashboard API

```bash
# Get comprehensive stats
curl http://localhost:5000/api/dashboard/stats

# Get recent activity
curl http://localhost:5000/api/dashboard/recent-activity
```

## Users API

```bash
# Get all users
curl http://localhost:5000/api/users

# Login (basic - implement JWT in production)
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

## Testing with Python

```python
import requests

BASE_URL = "http://localhost:5000/api"

# Get all donors
response = requests.get(f"{BASE_URL}/donors")
donors = response.json()
print(f"Total donors: {len(donors)}")

# Create donor
new_donor = {
    "firstName": "Python",
    "lastName": "Test",
    "email": "python@test.com",
    "phone": "1111111111",
    "bloodType": "AB+",
    "gender": "Female",
    "dateOfBirth": "1992-03-20",
    "city": "Bangalore",
    "state": "Karnataka"
}
response = requests.post(f"{BASE_URL}/donors", json=new_donor)
print(response.json())

# Get dashboard stats
response = requests.get(f"{BASE_URL}/dashboard/stats")
stats = response.json()
print(f"Available units: {stats['availableUnits']}")
print(f"Pending requests: {stats['pendingRequests']}")
```

## Testing with JavaScript/Node

```javascript
// Using fetch API
const BASE_URL = 'http://localhost:5000/api';

// Get all donors
fetch(`${BASE_URL}/donors`)
  .then(res => res.json())
  .then(donors => console.log(`Total donors: ${donors.length}`));

// Create donor
fetch(`${BASE_URL}/donors`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'JS',
    lastName: 'Test',
    email: 'js@test.com',
    phone: '2222222222',
    bloodType: 'A-',
    gender: 'Male',
    dateOfBirth: '1988-12-10',
    city: 'Chennai',
    state: 'Tamil Nadu'
  })
})
.then(res => res.json())
.then(data => console.log(data));

// Get dashboard stats
fetch(`${BASE_URL}/dashboard/stats`)
  .then(res => res.json())
  .then(stats => {
    console.log(`Available units: ${stats.availableUnits}`);
    console.log(`Pending requests: ${stats.pendingRequests}`);
  });
```

## Expected Response Formats

### Success Response (200/201)
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response (400/404/500)
```json
{
  "error": "Error message description"
}
```

### List Response
```json
[
  { "id": 1, "name": "Item 1", ... },
  { "id": 2, "name": "Item 2", ... }
]
```

## Common Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Tips

1. Use `-v` flag with curl to see full response headers:
   ```bash
   curl -v http://localhost:5000/api/donors
   ```

2. Pretty print JSON with `jq`:
   ```bash
   curl http://localhost:5000/api/donors | jq '.'
   ```

3. Save response to file:
   ```bash
   curl http://localhost:5000/api/donors > donors.json
   ```

4. Test with different HTTP methods:
   ```bash
   curl -X GET    http://localhost:5000/api/donors
   curl -X POST   http://localhost:5000/api/donors -d '{...}'
   curl -X PUT    http://localhost:5000/api/donors/1 -d '{...}'
   curl -X DELETE http://localhost:5000/api/donors/1
   ```

## Troubleshooting

### Connection Refused
```bash
# Check if backend is running
ps aux | grep python
netstat -an | grep 5000
```

### Database Errors
```bash
# Check PostgreSQL is running
pg_isready

# Check database exists
psql -l | grep blood_bank

# Check tables exist
psql -d blood_bank -c "\dt"
```

### CORS Errors (from browser)
- Verify frontend origin in `backend/.env`
- Check CORS_ORIGINS includes frontend URL
- Use browser dev tools Network tab to inspect

Happy Testing! 🧪
