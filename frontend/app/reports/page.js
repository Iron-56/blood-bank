'use client';
import { useState, useEffect } from 'react';
import { FaFileDownload, FaPrint, FaFilePdf, FaFileCsv, FaChartBar, FaCalendar } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '@/app/components/Navbar';
import { reportsAPI } from '@/app/lib/api';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [bloodUsageData, setBloodUsageData] = useState([]);
  const [bloodTypeDistribution, setBloodTypeDistribution] = useState([]);
  const [hospitalRequests, setHospitalRequests] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all report data in parallel
      const [statsData, usageData, distributionData, hospitalsData] = await Promise.all([
        reportsAPI.getStats(30),
        reportsAPI.getBloodUsage(6),
        reportsAPI.getBloodTypeDistribution(180),
        reportsAPI.getHospitalRequests(180, 5)
      ]);

      setStats(statsData);
      setBloodUsageData(usageData || []);
      setBloodTypeDistribution(distributionData || []);
      setHospitalRequests(hospitalsData || []);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF generation feature coming soon!');
    console.log('PDF download initiated');
  };

  const handleDownloadCSV = async (type = 'donations') => {
    try {
      const data = await reportsAPI.exportCSV(type);
      
      // Convert JSON to CSV
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        const csv = [
          headers.join(','),
          ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
        ].join('\n');
        
        // Download CSV file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('No data available to export');
      }
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Failed to export CSV: ' + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <FaChartBar className="mr-3 text-purple-600" />
              System Reports
            </h1>
            <p className="text-gray-600">Generate and download comprehensive reports</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FaFilePdf className="mr-2" />
              PDF
            </button>
            <button
              onClick={() => handleDownloadCSV('donations')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <FaFileCsv className="mr-2" />
              CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading reports: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report data...</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report data...</p>
          </div>
        )}

        {/* Report Content */}
        {!loading && stats && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium">Total Donations</p>
                <p className="text-4xl font-bold text-blue-600">{stats.total_donations || 0}</p>
                <p className="text-sm text-gray-500 mt-2">Last {stats.period_days} days</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium">Total Requests</p>
                <p className="text-4xl font-bold text-red-600">{stats.total_requests || 0}</p>
                <p className="text-sm text-gray-500 mt-2">Last {stats.period_days} days</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium">Active Donors</p>
                <p className="text-4xl font-bold text-green-600">{stats.active_donors || 0}</p>
                <p className="text-sm text-gray-500 mt-2">Registered</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm font-medium">Hospitals Served</p>
                <p className="text-4xl font-bold text-purple-600">{stats.hospitals_served || 0}</p>
                <p className="text-sm text-gray-500 mt-2">Partner facilities</p>
              </div>
            </div>

            {/* Report Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                <FaCalendar className="text-4xl text-blue-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Monthly Report</h3>
                <p className="text-gray-600 mb-4">Blood usage and donations by month</p>
                <button 
                  onClick={() => handleDownloadCSV('donations')}
                  className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <FaFileDownload className="mr-2" />
                  Generate Report
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                <FaChartBar className="text-4xl text-green-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Blood Type Analysis</h3>
                <p className="text-gray-600 mb-4">Donations per blood type</p>
                <button 
                  onClick={() => handleDownloadCSV('donations')}
                  className="flex items-center text-green-600 hover:text-green-800 font-semibold"
                >
                  <FaFileDownload className="mr-2" />
                  Generate Report
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                <FaChartBar className="text-4xl text-purple-600 mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Hospital Summary</h3>
                <p className="text-gray-600 mb-4">Request summary by hospital</p>
                <button 
                  onClick={() => handleDownloadCSV('requests')}
                  className="flex items-center text-purple-600 hover:text-purple-800 font-semibold"
                >
                  <FaFileDownload className="mr-2" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Blood Usage</h3>
                {bloodUsageData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bloodUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} name="Units Used" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">No usage data available</div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Blood Type Distribution</h3>
                {bloodTypeDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bloodTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bloodTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-gray-500">No distribution data available</div>
                )}
              </div>
            </div>

            {/* Hospital Requests Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Requesting Hospitals</h3>
              {hospitalRequests.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hospitalRequests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hospital" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="requests" fill="#8b5cf6" name="Total Requests" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">No hospital request data available</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
