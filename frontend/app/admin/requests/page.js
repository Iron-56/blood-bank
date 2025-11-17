'use client';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Table from '@/app/components/Table';
import { requestAPI } from '@/app/lib/api';

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestAPI.getAll();
      setRequests(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError(err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this blood request?')) {
      return;
    }

    try {
      await requestAPI.approve(id, 'Admin'); // You can replace 'Admin' with actual user name
      alert('Request approved successfully!');
      fetchRequests(); // Refresh the list
    } catch (err) {
      alert('Failed to approve request: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) {
      return;
    }

    try {
      await requestAPI.reject(id, reason);
      alert('Request rejected.');
      fetchRequests(); // Refresh the list
    } catch (err) {
      alert('Failed to reject request: ' + err.message);
    }
  };

  const stats = {
    pending: requests.filter(r => r.request_status === 'pending').length,
    approved: requests.filter(r => r.request_status === 'approved').length,
    rejected: requests.filter(r => r.request_status === 'rejected').length,
    fulfilled: requests.filter(r => r.request_status === 'fulfilled').length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Blood Requests</h1>
          <p className="text-gray-600">Review, approve, or reject hospital blood requests</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading requests: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-yellow-50 rounded-lg shadow-md p-6">
                <FaClock className="text-3xl text-yellow-600 mb-2" />
                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                <p className="text-4xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <div className="bg-green-50 rounded-lg shadow-md p-6">
                <FaCheckCircle className="text-3xl text-green-600 mb-2" />
                <p className="text-green-600 text-sm font-medium">Approved</p>
                <p className="text-4xl font-bold text-green-700">{stats.approved}</p>
              </div>
              <div className="bg-red-50 rounded-lg shadow-md p-6">
                <FaTimesCircle className="text-3xl text-red-600 mb-2" />
                <p className="text-red-600 text-sm font-medium">Rejected</p>
                <p className="text-4xl font-bold text-red-700">{stats.rejected}</p>
              </div>
              <div className="bg-blue-50 rounded-lg shadow-md p-6">
                <FaCheckCircle className="text-3xl text-blue-600 mb-2" />
                <p className="text-blue-600 text-sm font-medium">Fulfilled</p>
                <p className="text-4xl font-bold text-blue-700">{stats.fulfilled}</p>
              </div>
            </div>

            {/* Requests Table */}
            {requests.length > 0 ? (
              <Table headers={['ID', 'Hospital', 'Blood Type', 'Units', 'Date', 'Urgency', 'Status', 'Actions']}>
                {requests.map(request => (
                  <tr key={request.request_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{request.request_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.hospital_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {request.blood_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {request.units_fulfilled || 0}/{request.units_requested}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.request_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        request.urgency_level === 'emergency' ? 'bg-red-100 text-red-800' :
                        request.urgency_level === 'urgent' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.urgency_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        request.request_status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.request_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.request_status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.request_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {request.request_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.request_id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleReject(request.request_id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No requests found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
