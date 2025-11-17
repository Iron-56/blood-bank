'use client';
import { useState, useEffect } from 'react';
import { FaUsers, FaTint, FaHospital, FaClipboardList, FaUserPlus, FaHandHoldingMedical, FaSearch, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from '@/app/components/StatsCard';
import ActionButton from '@/app/components/ActionButton';
import Navbar from '@/app/components/Navbar';
import { dashboardAPI } from '@/app/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const bloodTypeData = stats?.blood_type_distribution 
    ? Object.entries(stats.blood_type_distribution).map(([name, units]) => ({
        name,
        units
      }))
    : [];

  const requestStatusData = stats ? [
    { name: 'Approved', value: stats.requests_by_status?.approved || 0, color: '#10b981' },
    { name: 'Pending', value: stats.requests_by_status?.pending || 0, color: '#f59e0b' },
    { name: 'Rejected', value: stats.requests_by_status?.rejected || 0, color: '#ef4444' },
    { name: 'Fulfilled', value: stats.requests_by_status?.fulfilled || 0, color: '#3b82f6' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Blood Bank Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your blood bank system.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading dashboard: {error}</p>
            <p className="text-sm mt-2">Make sure the backend server is running at http://localhost:5000</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={<FaUsers />}
                title="Total Donors"
                value={stats.total_donors?.toString() || '0'}
                color="bg-blue-500"
              />
              <StatsCard
                icon={<FaTint />}
                title="Available Units"
                value={stats.available_units?.toString() || '0'}
                color="bg-red-500"
              />
              <StatsCard
                icon={<FaHospital />}
                title="Registered Hospitals"
                value={stats.total_hospitals?.toString() || '0'}
                color="bg-green-500"
              />
              <StatsCard
                icon={<FaClipboardList />}
                title="Pending Requests"
                value={stats.requests_by_status?.pending?.toString() || '0'}
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
                {bloodTypeData.length > 0 ? (
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
                ) : (
                  <p className="text-gray-500 text-center py-12">No blood inventory data available</p>
                )}
              </div>

              {/* Request Status Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Request Status Distribution</h3>
                {requestStatusData.some(item => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={requestStatusData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {requestStatusData.filter(item => item.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No request data available</p>
                )}
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaChartLine className="mr-2" />
                System Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.total_donations || 0}</p>
                  <p className="text-gray-600 mt-2">Total Donations</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{stats.total_inventory || 0}</p>
                  <p className="text-gray-600 mt-2">Total Inventory Items</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.total_requests || 0}</p>
                  <p className="text-gray-600 mt-2">Total Requests</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
