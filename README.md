# Blood Bank Management System

A comprehensive blood bank management system with Flask backend (direct PostgreSQL queries) and Next.js frontend.

## Features

- **Donor Management**: Register, track, and manage blood donors
- **Hospital Management**: Register hospitals and manage blood requests
- **Inventory Management**: Track blood bags, expiry dates, and availability
- **Request Processing**: Handle blood requests with urgency levels
- **Transaction Logging**: Complete audit trail of all blood assignments
- **Dashboard Analytics**: Real-time statistics and visualizations
- **User Management**: Role-based access (Admin, Hospital, Donor, Staff)
- **Audit Logging**: Track all system changes

## Architecture

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS
- **Backend**: Flask 3.0 with direct PostgreSQL queries
- **Database**: PostgreSQL with 8 normalized tables
- **API**: RESTful JSON API with CORS support

## Database Schema (8 Tables)

1. **donor** - Donor personal information and status
2. **hospital** - Hospital registration and contact details
3. **blood_donation** - Individual donation event records
4. **blood_inventory** - Blood bag inventory with tracking
5. **recipient_request** - Hospital blood requests
6. **transaction_log** - Blood assignment transactions
7. **users** - Authentication and authorization
8. **audit_log** - System activity audit trail

## Quick Start

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

## API Documentation

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

## Security Features

- Parameterized SQL queries (SQL injection protection)
- CORS configuration
- Role-based access control structure
- Audit logging for accountability
- Input validation on all endpoints

## Project Structure

```
blood-bank/
├── backend/
│   ├── app.py
│   ├── db_utils.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── database/
│   │   └── schema.sql
│   └── routes/
│       ├── donors.py
│       ├── hospitals.py
│       ├── donations.py
│       ├── inventory.py
│       ├── requests.py
│       ├── transactions.py
│       ├── users.py
│       └── dashboard.py
│
└── frontend/
    ├── app/
    │   ├── page.js
    │   ├── dashboard/
    │   ├── donor/
    │   ├── hospital/
    │   ├── inventory/
    │   ├── admin/
    │   └── components/
    └── package.json
```