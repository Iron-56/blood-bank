'use client';
import { FaUsers, FaTint, FaHospital, FaClipboardList, FaUserPlus, FaHandHoldingMedical, FaSearch, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '@/app/components/StatsCard';
import ActionButton from '@/app/components/ActionButton';
import Navbar from '@/app/components/Navbar';

export default function Dashboard() {
  // Sample data for charts
  const bloodTypeData = [
    { name: 'A+', units: 45 },
    { name: 'A-', units: 12 },
    { name: 'B+', units: 38 },
    { name: 'B-', units: 8 },
    { name: 'O+', units: 52 },
    { name: 'O-', units: 15 },
    { name: 'AB+', units: 20 },
    { name: 'AB-', units: 5 },
  ];

  const monthlyDonationsData = [
    { month: 'Jan', donations: 45 },
    { month: 'Feb', donations: 52 },
    { month: 'Mar', donations: 48 },
    { month: 'Apr', donations: 61 },
    { month: 'May', donations: 55 },
    { month: 'Jun', donations: 67 },
  ];

  const requestStatusData = [
    { name: 'Approved', value: 65, color: '#10b981' },
    { name: 'Pending', value: 25, color: '#f59e0b' },
    { name: 'Rejected', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Blood Bank Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your blood bank system.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<FaUsers />}
            title="Total Donors"
            value="1,284"
            color="bg-blue-500"
          />
          <StatsCard
            icon={<FaTint />}
            title="Available Units"
            value="195"
            color="bg-red-500"
          />
          <StatsCard
            icon={<FaHospital />}
            title="Registered Hospitals"
            value="42"
            color="bg-green-500"
          />
          <StatsCard
            icon={<FaClipboardList />}
            title="Pending Requests"
            value="18"
            color="bg-yellow-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionButton
              icon={<FaUserPlus />}
              title="Register Donor"
              description="Add a new donor to the system"
              href="/donor/register"
              color="bg-blue-600"
            />
            <ActionButton
              icon={<FaHandHoldingMedical />}
              title="Request Blood"
              description="Create a new blood request"
              href="/hospital/request"
              color="bg-red-600"
            />
            <ActionButton
              icon={<FaSearch />}
              title="Search Donors"
              description="Find donors by blood type"
              href="/donor/search"
              color="bg-green-600"
            />
            <ActionButton
              icon={<FaTint />}
              title="Manage Inventory"
              description="View and update blood stock"
              href="/inventory"
              color="bg-purple-600"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Blood Type Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Blood Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bloodTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="units" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Donations Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Donations Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyDonationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Status Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Request Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaChartLine className="mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-3 border-b">
                <div className="bg-blue-100 p-2 rounded">
                  <FaUserPlus className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">New Donor Registered</p>
                  <p className="text-sm text-gray-600">John Doe (O+) - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-3 border-b">
                <div className="bg-red-100 p-2 rounded">
                  <FaTint className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold">Blood Unit Added</p>
                  <p className="text-sm text-gray-600">5 units of A+ added - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-3 border-b">
                <div className="bg-green-100 p-2 rounded">
                  <FaClipboardList className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Request Approved</p>
                  <p className="text-sm text-gray-600">City Hospital - 6 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded">
                  <FaHospital className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold">New Hospital Registered</p>
                  <p className="text-sm text-gray-600">Memorial Hospital - 1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
