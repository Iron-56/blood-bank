'use client';
import { FaHospital, FaChartBar, FaClipboardList, FaTint, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '@/app/components/Navbar';
import StatsCard from '@/app/components/StatsCard';

export default function HospitalDashboard() {
  // Sample data
  const requestData = [
    { month: 'Jan', approved: 15, pending: 3, rejected: 2 },
    { month: 'Feb', approved: 18, pending: 2, rejected: 1 },
    { month: 'Mar', approved: 22, pending: 4, rejected: 3 },
    { month: 'Apr', approved: 19, pending: 5, rejected: 2 },
  ];

  const recentRequests = [
    { id: 1, bloodType: 'O+', units: 5, date: '2024-11-10', status: 'Approved' },
    { id: 2, bloodType: 'A-', units: 3, date: '2024-11-08', status: 'Pending' },
    { id: 3, bloodType: 'B+', units: 4, date: '2024-11-05', status: 'Approved' },
  ];

  const allocatedInventory = [
    { bloodType: 'A+', units: 12 },
    { bloodType: 'O+', units: 18 },
    { bloodType: 'B+', units: 8 },
    { bloodType: 'AB+', units: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaHospital className="text-5xl text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Hospital Dashboard</h1>
              <p className="text-gray-600">City Memorial Hospital</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<FaClipboardList />}
            title="Pending Requests"
            value="5"
            color="bg-yellow-500"
          />
          <StatsCard
            icon={<FaTint />}
            title="Allocated Units"
            value="43"
            color="bg-red-500"
          />
          <StatsCard
            icon={<FaChartBar />}
            title="Approved This Month"
            value="22"
            color="bg-green-500"
          />
          <StatsCard
            icon={<FaHistory />}
            title="Total Requests"
            value="156"
            color="bg-blue-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/hospital/request">
            <div className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaTint className="text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">Request Blood</h3>
              <p className="text-sm">Submit a new blood request</p>
            </div>
          </Link>
          
          <Link href="/hospital/history">
            <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaHistory className="text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">Request History</h3>
              <p className="text-sm">View past requests</p>
            </div>
          </Link>
          
          <Link href="/inventory">
            <div className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md p-6 cursor-pointer transition">
              <FaChartBar className="text-4xl mb-3" />
              <h3 className="text-xl font-bold mb-2">View Inventory</h3>
              <p className="text-sm">Check available blood units</p>
            </div>
          </Link>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Request Status Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Request Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill="#10b981" name="Approved" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Allocated Inventory */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Allocated Inventory</h3>
            <div className="space-y-3">
              {allocatedInventory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-3">
                      <FaTint className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{item.bloodType}</p>
                      <p className="text-sm text-gray-600">Blood Type</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{item.units}</p>
                    <p className="text-sm text-gray-600">Units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Requests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {request.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.units}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
