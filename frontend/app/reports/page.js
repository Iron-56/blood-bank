'use client';
import { FaFileDownload, FaPrint, FaFilePdf, FaFileCsv, FaChartBar, FaCalendar } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '@/app/components/Navbar';

export default function Reports() {
  const bloodUsageData = [
    { month: 'Jan', usage: 45 },
    { month: 'Feb', usage: 52 },
    { month: 'Mar', usage: 48 },
    { month: 'Apr', usage: 61 },
    { month: 'May', usage: 55 },
    { month: 'Jun', usage: 67 },
  ];

  const bloodTypeDistribution = [
    { name: 'A+', value: 45, color: '#ef4444' },
    { name: 'O+', value: 52, color: '#f97316' },
    { name: 'B+', value: 38, color: '#f59e0b' },
    { name: 'AB+', value: 20, color: '#84cc16' },
    { name: 'A-', value: 12, color: '#22c55e' },
    { name: 'O-', value: 15, color: '#10b981' },
    { name: 'B-', value: 8, color: '#14b8a6' },
    { name: 'AB-', value: 5, color: '#06b6d4' },
  ];

  const hospitalRequests = [
    { hospital: 'City Hospital', requests: 45 },
    { hospital: 'Memorial Hospital', requests: 38 },
    { hospital: 'General Hospital', requests: 32 },
    { hospital: 'Central Hospital', requests: 28 },
    { hospital: 'District Hospital', requests: 22 },
  ];

  const handleDownloadPDF = () => {
    alert('Generating PDF report...');
    console.log('PDF download initiated');
  };

  const handleDownloadCSV = () => {
    alert('Generating CSV report...');
    console.log('CSV download initiated');
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
              onClick={handleDownloadCSV}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Donations</p>
            <p className="text-4xl font-bold text-blue-600">328</p>
            <p className="text-sm text-gray-500 mt-2">This period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Requests</p>
            <p className="text-4xl font-bold text-red-600">165</p>
            <p className="text-sm text-gray-500 mt-2">This period</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Active Donors</p>
            <p className="text-4xl font-bold text-green-600">1,284</p>
            <p className="text-sm text-gray-500 mt-2">Registered</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Hospitals Served</p>
            <p className="text-4xl font-bold text-purple-600">42</p>
            <p className="text-sm text-gray-500 mt-2">Partner facilities</p>
          </div>
        </div>

        {/* Report Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <FaCalendar className="text-4xl text-blue-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Monthly Report</h3>
            <p className="text-gray-600 mb-4">Blood usage and donations by month</p>
            <button className="flex items-center text-blue-600 hover:text-blue-800 font-semibold">
              <FaFileDownload className="mr-2" />
              Generate Report
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <FaChartBar className="text-4xl text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Blood Type Analysis</h3>
            <p className="text-gray-600 mb-4">Donations per blood type</p>
            <button className="flex items-center text-green-600 hover:text-green-800 font-semibold">
              <FaFileDownload className="mr-2" />
              Generate Report
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
            <FaChartBar className="text-4xl text-purple-600 mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Hospital Summary</h3>
            <p className="text-gray-600 mb-4">Request summary by hospital</p>
            <button className="flex items-center text-purple-600 hover:text-purple-800 font-semibold">
              <FaFileDownload className="mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Blood Usage</h3>
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Blood Type Distribution</h3>
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
          </div>
        </div>

        {/* Hospital Requests Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Top Requesting Hospitals</h3>
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
        </div>
      </div>
    </div>
  );
}
