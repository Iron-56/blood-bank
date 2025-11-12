'use client';
import { useState } from 'react';
import { FaHistory, FaFilter, FaEye, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Table from '@/app/components/Table';

export default function RequestHistory() {
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Sample request history data
  const requests = [
    { id: 1, bloodType: 'O+', units: 5, date: '2024-11-10', requiredBy: '2024-11-12', urgency: 'Emergency', status: 'Approved', patientName: 'John Smith' },
    { id: 2, bloodType: 'A-', units: 3, date: '2024-11-08', requiredBy: '2024-11-15', urgency: 'Routine', status: 'Pending', patientName: 'Sarah Johnson' },
    { id: 3, bloodType: 'B+', units: 4, date: '2024-11-05', requiredBy: '2024-11-07', urgency: 'Urgent', status: 'Approved', patientName: 'Mike Williams' },
    { id: 4, bloodType: 'AB+', units: 2, date: '2024-10-28', requiredBy: '2024-11-01', urgency: 'Routine', status: 'Rejected', patientName: 'Emma Davis' },
    { id: 5, bloodType: 'O-', units: 6, date: '2024-10-25', requiredBy: '2024-10-26', urgency: 'Emergency', status: 'Approved', patientName: 'David Brown' },
    { id: 6, bloodType: 'A+', units: 3, date: '2024-10-20', requiredBy: '2024-10-25', urgency: 'Urgent', status: 'Approved', patientName: 'Lisa Anderson' },
  ];

  const filteredRequests = requests.filter(request => {
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesDate = !dateFilter || request.date.includes(dateFilter);
    return matchesStatus && matchesDate;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <FaCheckCircle className="inline mr-1" />;
      case 'Pending': return <FaClock className="inline mr-1" />;
      case 'Rejected': return <FaTimesCircle className="inline mr-1" />;
      default: return null;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Urgent': return 'bg-orange-100 text-orange-800';
      case 'Routine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: requests.length,
    approved: requests.filter(r => r.status === 'Approved').length,
    pending: requests.filter(r => r.status === 'Pending').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <FaHistory className="mr-3" />
            Request History
          </h1>
          <p className="text-gray-600">View and track all your blood requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Requests</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-6">
            <p className="text-green-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-md p-6">
            <p className="text-yellow-600 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow-md p-6">
            <p className="text-red-600 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FaFilter className="inline mr-2" />
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Filter by Month
              </label>
              <input
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setDateFilter('');
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">
            Showing {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Requests Table */}
        <Table headers={['Request ID', 'Patient', 'Blood Type', 'Units', 'Date', 'Required By', 'Urgency', 'Status', 'Actions']}>
          {filteredRequests.map(request => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">#{request.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {request.patientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {request.bloodType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.units}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {request.requiredBy}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900" title="View Details">
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </Table>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No requests found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
