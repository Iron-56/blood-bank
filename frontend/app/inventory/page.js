'use client';
import { useState, useEffect } from 'react';
import { FaTint, FaPlus, FaExclamationTriangle, FaChartPie, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Navbar from '@/app/components/Navbar';
import { inventoryAPI } from '@/app/lib/api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      console.log('Fetching inventory from API...');
      const data = await inventoryAPI.getAll();
      console.log('Inventory data received:', data);
      console.log('Is array?', Array.isArray(data));
      console.log('Data length:', data?.length);
      setInventory(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(err.message || 'Failed to load inventory');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  // Group inventory by blood type and calculate stats
  const inventoryData = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bloodType => {
    const items = inventory.filter(item => item.blood_type === bloodType);
    return {
      bloodType,
      available: items.filter(item => item.status === 'available').length,
      reserved: items.filter(item => item.status === 'reserved').length,
      expired: items.filter(item => item.status === 'expired').length,
      assigned: items.filter(item => item.status === 'assigned').length,
      expiringSoon: items.filter(item => {
        if (item.status !== 'available' && item.status !== 'reserved') return false;
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysToExpiry >= 0 && daysToExpiry <= 7;
      }).length,
    };
  });

  const totalAvailable = inventoryData.reduce((sum, item) => sum + item.available, 0);
  const totalReserved = inventoryData.reduce((sum, item) => sum + item.reserved, 0);
  const totalExpired = inventoryData.reduce((sum, item) => sum + item.expired, 0);
  const totalExpiringSoon = inventoryData.reduce((sum, item) => sum + item.expiringSoon, 0);

  const pieData = inventoryData.map(item => ({
    name: item.bloodType,
    value: item.available,
  }));

  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6'];

  const getStockStatus = (available) => {
    if (available === 0) return { text: 'Critical', color: 'bg-red-100 text-red-800' };
    if (available < 3) return { text: 'Low', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Good', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <FaTint className="mr-3 text-red-600" />
              Blood Inventory
            </h1>
            <p className="text-gray-600">Manage and track blood units</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/inventory/add">
              <button className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                <FaPlus className="mr-2" />
                Add Blood Units
              </button>
            </Link>
            <Link href="/inventory/assign">
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <FaChartPie className="mr-2" />
                Assign Units
              </button>
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading inventory: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory data...</p>
          </div>
        )}

        {/* Inventory Content */}
        {!loading && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-500 text-white rounded-lg shadow-md p-6">
                <p className="text-green-100 text-sm font-medium">Available Units</p>
                <p className="text-4xl font-bold mt-2">{totalAvailable}</p>
              </div>
              <div className="bg-blue-500 text-white rounded-lg shadow-md p-6">
                <p className="text-blue-100 text-sm font-medium">Reserved Units</p>
                <p className="text-4xl font-bold mt-2">{totalReserved}</p>
              </div>
              <div className="bg-yellow-500 text-white rounded-lg shadow-md p-6">
                <p className="text-yellow-100 text-sm font-medium">Expiring Soon</p>
                <p className="text-4xl font-bold mt-2">{totalExpiringSoon}</p>
              </div>
              <div className="bg-red-500 text-white rounded-lg shadow-md p-6">
                <p className="text-red-100 text-sm font-medium">Expired</p>
                <p className="text-4xl font-bold mt-2">{totalExpired}</p>
              </div>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Blood Type Distribution Chart */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/inventory/expired">
              <div className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg p-6 cursor-pointer transition">
                <FaExclamationTriangle className="text-4xl text-red-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Expired Units</h3>
                <p className="text-gray-600">View and manage expired blood units</p>
                <p className="text-3xl font-bold text-red-600 mt-3">{totalExpired} units</p>
              </div>
            </Link>

            <Link href="/inventory/expiring">
              <div className="bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-lg p-6 cursor-pointer transition">
                <FaExclamationTriangle className="text-4xl text-yellow-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Expiring Soon</h3>
                <p className="text-gray-600">Units expiring in next 7 days</p>
                <p className="text-3xl font-bold text-yellow-600 mt-3">{totalExpiringSoon} units</p>
              </div>
            </Link>

            <Link href="/inventory/reserved">
              <div className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-6 cursor-pointer transition">
                <FaTint className="text-4xl text-blue-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Reserved Units</h3>
                <p className="text-gray-600">Units allocated to hospitals</p>
                <p className="text-3xl font-bold text-blue-600 mt-3">{totalReserved} units</p>
              </div>
            </Link>

            <Link href="/inventory/history">
              <div className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-6 cursor-pointer transition">
                <FaFilter className="text-4xl text-green-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Inventory History</h3>
                <p className="text-gray-600">Track all inventory changes</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">Current Stock Levels</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiring Soon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryData.map((item, index) => {
                  const status = getStockStatus(item.available);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaTint className="text-red-600 mr-2 text-xl" />
                          <span className="text-lg font-bold text-gray-900">{item.bloodType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl font-bold text-green-600">{item.available}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-blue-600">{item.reserved}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-lg font-semibold ${item.expiringSoon > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {item.expiringSoon}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-lg font-semibold ${item.expired > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {item.expired}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
