'use client';
import { FaUserShield, FaUsers, FaHospital, FaTint, FaClipboardList, FaChartBar, FaCog, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '@/app/components/Navbar';
import StatsCard from '@/app/components/StatsCard';

export default function AdminDashboard() {
  const monthlyData = [
    { month: 'Jan', donations: 45, requests: 38 },
    { month: 'Feb', donations: 52, requests: 45 },
    { month: 'Mar', donations: 48, requests: 42 },
    { month: 'Apr', donations: 61, requests: 55 },
    { month: 'May', donations: 55, requests: 48 },
    { month: 'Jun', donations: 67, requests: 60 },
  ];

  const bloodTypeData = [
    { type: 'A+', count: 45 },
    { type: 'A-', count: 12 },
    { type: 'B+', count: 38 },
    { type: 'B-', count: 8 },
    { type: 'O+', count: 52 },
    { type: 'O-', count: 15 },
    { type: 'AB+', count: 20 },
    { type: 'AB-', count: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaUserShield className="text-5xl text-indigo-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Admin Control Panel</h1>
              <p className="text-gray-600">Manage and monitor the entire blood bank system</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={<FaUsers />} title="Total Donors" value="1,284" color="bg-blue-500" />
          <StatsCard icon={<FaHospital />} title="Hospitals" value="42" color="bg-green-500" />
          <StatsCard icon={<FaTint />} title="Blood Units" value="195" color="bg-red-500" />
          <StatsCard icon={<FaClipboardList />} title="Pending Requests" value="18" color="bg-yellow-500" />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/donors">
            <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaUsers className="text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">Manage Donors</h3>
              <p className="text-sm opacity-90">View, add, edit donors</p>
            </div>
          </Link>

          <Link href="/admin/hospitals">
            <div className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaHospital className="text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">Manage Hospitals</h3>
              <p className="text-sm opacity-90">Hospital records & stats</p>
            </div>
          </Link>

          <Link href="/admin/inventory">
            <div className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaTint className="text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">Manage Inventory</h3>
              <p className="text-sm opacity-90">Blood stock control</p>
            </div>
          </Link>

          <Link href="/admin/requests">
            <div className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaClipboardList className="text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">Manage Requests</h3>
              <p className="text-sm opacity-90">Approve/reject requests</p>
            </div>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Donations vs Requests</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#3b82f6" strokeWidth={2} name="Donations" />
                <Line type="monotone" dataKey="requests" stroke="#ef4444" strokeWidth={2} name="Requests" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Most Requested Blood Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bloodTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#dc2626" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Admin Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/reports">
            <div className="bg-white hover:shadow-lg rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaFileAlt className="text-4xl text-purple-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reports</h3>
              <p className="text-gray-600">Generate system reports</p>
            </div>
          </Link>

          <Link href="/admin/analytics">
            <div className="bg-white hover:shadow-lg rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaChartBar className="text-4xl text-teal-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics</h3>
              <p className="text-gray-600">View detailed analytics</p>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="bg-white hover:shadow-lg rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaCog className="text-4xl text-gray-600 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Settings</h3>
              <p className="text-gray-600">System configuration</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
