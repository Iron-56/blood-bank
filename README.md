# 🏥 Blood Bank Management System

A comprehensive blood bank management system with Flask backend (direct PostgreSQL queries) and Next.js frontend.

## 📊 Features

- **Donor Management**: Register, track, and manage blood donors
- **Hospital Management**: Register hospitals and manage blood requests
- **Inventory Management**: Track blood bags, expiry dates, and availability
- **Request Processing**: Handle blood requests with urgency levels
- **Transaction Logging**: Complete audit trail of all blood assignments
- **Dashboard Analytics**: Real-time statistics and visualizations
- **User Management**: Role-based access (Admin, Hospital, Donor, Staff)
- **Audit Logging**: Track all system changes

## 🏗️ Architecture

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS
- **Backend**: Flask 3.0 with direct PostgreSQL queries
- **Database**: PostgreSQL with 8 normalized tables
- **API**: RESTful JSON API with CORS support

## 📦 Database Schema (8 Tables)

1. **donor** - Donor personal information and status
2. **hospital** - Hospital registration and contact details
3. **blood_donation** - Individual donation event records
4. **blood_inventory** - Blood bag inventory with tracking
5. **recipient_request** - Hospital blood requests
6. **transaction_log** - Blood assignment transactions
7. **users** - Authentication and authorization
8. **audit_log** - System activity audit trail

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Node.js 18+
- npm or yarn

### 1. Database Setup

```bash
# Create database
createdb blood_bank

# Run initialization script
cd backend
chmod +x init_db.sh
./init_db.sh

# Or manually:
psql -d blood_bank -f database/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run server
python app.py
```

Backend will run at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at `http://localhost:3000`

## 📡 API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

### Key Endpoints

- **Donors**: `/api/donors`
- **Hospitals**: `/api/hospitals`
- **Donations**: `/api/donations`
- **Inventory**: `/api/inventory`
- **Requests**: `/api/requests`
- **Transactions**: `/api/transactions`
- **Dashboard**: `/api/dashboard/stats`

## 🗄️ Database Features

### ENUM Types for Data Integrity
- Blood types: O+, O-, A+, A-, B+, B-, AB+, AB-
- Urgency levels: Routine, Urgent, Emergency
- Request statuses: pending, approved, rejected, fulfilled
- Inventory statuses: available, reserved, assigned, expired, used

### Automated Triggers
- Auto-expire inventory past expiry date
- Update donor statistics after donations
- Auto-update modification timestamps

### Views for Reporting
- Available blood by type
- Near-expiry items
- Donor statistics
- Pending requests with priorities

## 🔐 Security Features

- Parameterized SQL queries (SQL injection protection)
- CORS configuration
- Role-based access control structure
- Audit logging for accountability
- Input validation on all endpoints

## 📋 Project Structure

```
blood-bank/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── db_utils.py            # Database utilities
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment template
│   ├── database/
│   │   └── schema.sql        # Database schema
│   └── routes/
│       ├── donors.py         # Donor endpoints
│       ├── hospitals.py      # Hospital endpoints
│       ├── donations.py      # Donation endpoints
│       ├── inventory.py      # Inventory endpoints
│       ├── requests.py       # Request endpoints
│       ├── transactions.py   # Transaction endpoints
│       ├── users.py          # User endpoints
│       └── dashboard.py      # Dashboard endpoints
│
└── frontend/
    ├── app/
    │   ├── page.js           # Landing page
    │   ├── dashboard/        # Dashboard
    │   ├── donor/            # Donor management
    │   ├── hospital/         # Hospital management
    │   ├── inventory/        # Inventory management
    │   ├── admin/            # Admin panel
    │   └── components/       # Reusable components
    └── package.json
```

## 🧪 Testing the API

```bash
# Check health
curl http://localhost:5000/health

# Get all donors
curl http://localhost:5000/api/donors

# Get dashboard stats
curl http://localhost:5000/api/dashboard/stats

# Get available blood inventory
curl "http://localhost:5000/api/inventory?status=available"
```

## 📈 Database Normalization (3NF)

- **1NF**: All attributes are atomic
- **2NF**: No partial dependencies
- **3NF**: No transitive dependencies
- Uses ENUM types for constrained values
- Foreign keys ensure referential integrity
- Indexes on frequently queried columns

## 🤝 Contributing

1. Follow RESTful API conventions
2. Use parameterized queries for all SQL
3. Maintain database normalization
4. Add proper error handling
5. Document all endpoints

## 📄 License

MIT License

## 🐛 Troubleshooting

### Database Connection Issues
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check database exists: `psql -l | grep blood_bank`

### Port Already in Use
- Backend: Change port in `app.py` (default: 5000)
- Frontend: Use `npm run dev -- -p 3001`

### CORS Errors
- Verify `CORS_ORIGINS` in backend `.env`
- Check frontend is running on allowed origin

## 📞 Support

For issues and questions:
- Check [backend/README.md](backend/README.md) for API details
- Review database schema in `backend/database/schema.sql`
- Check frontend documentation in `frontend/PAGES_DOCUMENTATION.md`
