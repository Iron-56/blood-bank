# Blood Bank Management System - Frontend

A comprehensive blood bank management system built with Next.js, React Icons, and Recharts.

## 🚀 Features

### Core Functionality
- ✅ Modern, responsive UI with React Icons (no images)
- ✅ Interactive charts and data visualization with Recharts
- ✅ Complete CRUD operations for donors, hospitals, and inventory
- ✅ Blood type matching and compatibility system
- ✅ Real-time inventory tracking
- ✅ Request approval workflow

## 📁 Project Structure

```
app/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation bar with responsive menu
│   ├── StatsCard.js    # Statistics display cards
│   ├── ActionButton.js # Action buttons with icons
│   ├── Table.js        # Reusable table component
│   └── FormInput.js    # Form input components
│
├── dashboard/          # Main dashboard
│   └── page.js         # Overview with stats, charts, quick actions
│
├── donor/              # Donor management
│   ├── register/       # Donor registration form
│   ├── search/         # Search and filter donors
│   ├── profile/[id]/   # View donor details and history
│   └── edit/[id]/      # Edit donor information
│
├── hospital/           # Hospital management
│   ├── page.js         # Hospital dashboard
│   ├── register/       # Hospital registration
│   ├── request/        # Blood request form
│   └── history/        # Request history and tracking
│
├── inventory/          # Blood inventory management
│   ├── page.js         # Current inventory view
│   ├── add/            # Add blood units
│   ├── assign/         # Assign units to requests
│   └── expired/        # Manage expired units
│
├── recipient/          # Recipient management
│   ├── page.js         # Recipient request form
│   └── list/           # List of recipients
│
├── admin/              # Admin control panel
│   ├── page.js         # Admin dashboard
│   └── requests/       # Manage/approve requests
│
├── reports/            # Reports and analytics
│   └── page.js         # Generate PDF/CSV reports
│
├── auth/               # Authentication
│   ├── login/          # Login page
│   └── signup/         # Signup page
│
├── page.js             # Home/Landing page
└── not-found.js        # 404 error page
```

## 🎨 Pages Overview

### 1. Home / Landing Page (`/`)
- Hero section with call-to-action buttons
- Feature highlights
- System statistics and impact metrics
- Footer with contact information

### 2. Dashboard (`/dashboard`)
- **Stats Cards**: Total donors, available units, hospitals, pending requests
- **Quick Actions**: Register donor, request blood, search donors, manage inventory
- **Charts**:
  - Blood type distribution (Bar Chart)
  - Monthly donations trend (Line Chart)
  - Request status distribution (Pie Chart)
- **Recent Activity**: Timeline of recent actions

### 3. Donor Pages

#### Donor Registration (`/donor/register`)
- Comprehensive form with personal information
- Blood type selection
- Medical history
- Address and contact details

#### Donor Search (`/donor/search`)
- Search by name, phone
- Filter by blood type, city
- List view with CRUD actions
- Status indicators (Available/Unavailable)

#### Donor Profile (`/donor/profile/[id]`)
- Personal information display
- Blood type and donation statistics
- Donation history table
- Edit profile button

#### Edit Donor (`/donor/edit/[id]`)
- Pre-populated form with donor data
- Update all donor information
- Save changes functionality

### 4. Hospital Pages

#### Hospital Dashboard (`/hospital`)
- **Statistics**: Pending requests, allocated units, approved requests
- **Quick Actions**: Request blood, view history, check inventory
- **Charts**: Request status overview (Bar Chart)
- **Allocated Inventory**: Blood types and units allocated
- **Recent Requests Table**: Latest blood requests

#### Hospital Registration (`/hospital/register`)
- Hospital information form
- Contact person details
- Login credentials setup
- Hospital type and capacity

#### Request Blood (`/hospital/request`)
- Blood type and units selection
- Urgency level (Emergency/Urgent/Routine)
- Patient information
- Doctor details and reason
- Available units display

#### Request History (`/hospital/history`)
- Filter by status and date
- Request statistics (Total, Approved, Pending, Rejected)
- Detailed request table with urgency indicators
- View request details

### 5. Blood Inventory Pages

#### Main Inventory (`/inventory`)
- **Summary Stats**: Available, reserved, expiring, expired units
- **Distribution Chart**: Pie chart of blood types
- **Quick Links**: Expired units, expiring soon, reserved, history
- **Stock Table**: Current levels by blood type with status indicators

#### Add Blood Units (`/inventory/add`)
- Blood unit details (type, units, component)
- Donor information
- Collection and expiry dates
- Storage location
- Testing status
- Auto-calculate expiry date

#### Assign Units (`/inventory/assign`)
- **Pending Requests Sidebar**: Click to auto-fill
- Request details form
- Blood type and units
- Available stock validation
- Assignment tracking

#### Expired Units (`/inventory/expired`)
- List of expired blood units
- Disposal tracking
- Bulk cleanup option
- Waste statistics and analytics

### 6. Recipient Pages

#### Recipient Request (`/recipient`)
- Patient information form
- Blood requirement details
- Urgency and hospital information
- **Compatible Donors Finder**: Search and display compatible donors
- Blood type compatibility logic

#### Recipient List (`/recipient/list`)
- Statistics: Total recipients, this month, total units
- Complete recipient history
- Hospital and date tracking
- Status indicators

### 7. Admin Panel

#### Admin Dashboard (`/admin`)
- **Stats Cards**: Donors, hospitals, blood units, pending requests
- **Quick Access Cards**: Manage donors, hospitals, inventory, requests
- **Charts**:
  - Donations vs Requests trend (Line Chart)
  - Most requested blood types (Bar Chart)
- **Admin Tools**: Reports, analytics, settings

#### Manage Requests (`/admin/requests`)
- Request statistics dashboard
- Approve/Reject functionality
- Filter by status
- Rejection reason input
- Request details view

### 8. Reports (`/reports`)
- **Quick Stats**: Donations, requests, donors, hospitals
- **Report Types**:
  - Monthly Report
  - Blood Type Analysis
  - Hospital Summary
- **Export Options**: PDF, CSV, Print
- **Charts**:
  - Monthly blood usage (Line Chart)
  - Blood type distribution (Pie Chart)
  - Top requesting hospitals (Bar Chart)

### 9. Authentication Pages

#### Login (`/auth/login`)
- User type selection (Donor/Hospital/Admin)
- Email/username and password
- Remember me option
- Forgot password link
- Sign up redirect

#### Signup (`/auth/signup`)
- User type selection (Donor/Hospital)
- Full registration form
- Blood type for donors
- Password confirmation
- Terms & conditions acceptance

### 10. Error Pages

#### 404 Not Found (`/not-found`)
- Custom error page
- Navigation back to home
- Clear error messaging

## 🎨 UI Components

### Reusable Components

1. **Navbar**: Responsive navigation with mobile menu
2. **StatsCard**: Display statistics with icons and colors
3. **ActionButton**: Call-to-action buttons with icons
4. **Table**: Reusable table with headers
5. **FormInput**: Text, select, textarea, date inputs

## 📊 Charts & Visualizations

All charts use Recharts library:
- **Bar Charts**: Blood type distribution, hospital requests
- **Line Charts**: Monthly trends, donations vs requests
- **Pie Charts**: Status distribution, blood type breakdown

## 🎯 Icons Used

Using `react-icons` (Font Awesome):
- FaTint: Blood/inventory
- FaUsers: Donors
- FaHospital: Hospitals
- FaClipboardList: Requests
- FaUserShield: Admin
- FaChartBar: Reports/Analytics
- FaHeartbeat: Health/vitals
- FaHandHoldingMedical: Blood transfer
- FaUserInjured: Recipients
- FaExclamationTriangle: Warnings/alerts
- FaSearch, FaFilter: Search/filter
- FaEdit, FaTrash, FaEye: CRUD actions
- FaSave, FaTimes, FaPlus: Form actions
- FaCalendar, FaPhone, FaEnvelope: Contact info
- FaMapMarkerAlt: Location
- FaCheckCircle, FaTimesCircle, FaClock: Status indicators

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## 📦 Dependencies

- **Next.js**: React framework
- **React Icons**: Icon library
- **Recharts**: Chart library
- **Tailwind CSS**: Styling

## 🎨 Color Scheme

- **Primary (Red)**: `#dc2626` - Blood, donations, critical actions
- **Secondary (Blue)**: `#3b82f6` - Hospitals, information
- **Success (Green)**: `#10b981` - Available, approved
- **Warning (Yellow)**: `#f59e0b` - Pending, expiring soon
- **Danger (Red)**: `#ef4444` - Rejected, expired, critical
- **Purple**: `#8b5cf6` - Recipients, reports
- **Indigo**: `#6366f1` - Admin functions

## 🔄 Data Flow

1. **Donors** register → Blood units added to inventory
2. **Hospitals** create requests → Admin reviews
3. **Admin** approves → Units assigned from inventory
4. **Recipients** receive blood → Tracked in system
5. **Reports** generated for analytics

## 📝 Features Summary

### Donor Management ✅
- Registration with full details
- Search and filter
- Profile viewing
- Edit functionality
- Donation history tracking

### Hospital Management ✅
- Hospital registration
- Dashboard with statistics
- Blood request system
- Request history and tracking
- Approval workflow

### Inventory Management ✅
- Real-time stock tracking
- Add blood units
- Assign to requests
- Expired units management
- Stock level alerts

### Admin Features ✅
- Central control panel
- Request approval/rejection
- System-wide analytics
- User management interface

### Reports & Analytics ✅
- PDF/CSV export
- Monthly reports
- Blood type analysis
- Hospital summaries
- Interactive charts

### Authentication ✅
- Multi-user type login
- Registration for donors and hospitals
- Secure password handling
- Remember me functionality

## 🎯 Key Highlights

- ✅ **No Images**: All icons using react-icons
- ✅ **Responsive Design**: Mobile-friendly
- ✅ **Interactive Charts**: Recharts integration
- ✅ **Complete CRUD**: All operations implemented
- ✅ **Blood Matching**: Compatibility logic
- ✅ **Real-time Updates**: Live inventory tracking
- ✅ **Professional UI**: Clean, modern design
- ✅ **Workflow Management**: Request approval system

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ for saving lives through blood donation**
