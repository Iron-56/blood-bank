'use client';
import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaEye } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Table from '@/app/components/Table';

export default function ManageRequests() {
  const [requests, setRequests] = useState([
    { id: 1, hospital: 'City Hospital', bloodType: 'O+', units: 5, date: '2024-11-10', urgency: 'Emergency', status: 'Pending' },
    { id: 2, hospital: 'Memorial Hospital', bloodType: 'A-', units: 3, date: '2024-11-08', urgency: 'Routine', status: 'Pending' },
    { id: 3, hospital: 'General Hospital', bloodType: 'B+', units: 4, date: '2024-11-05', urgency: 'Urgent', status: 'Approved' },
    { id: 4, hospital: 'City Hospital', bloodType: 'AB+', units: 2, date: '2024-10-28', urgency: 'Routine', status: 'Rejected' },
  ]);

  const handleApprove = (id) => {
    if (confirm('Approve this blood request?')) {
      setRequests(requests.map(req =>
        req.id === id ? { ...req, status: 'Approved' } : req
      ));
      alert('Request approved successfully!');
    }
  };

  const handleReject = (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      setRequests(requests.map(req =>
        req.id === id ? { ...req, status: 'Rejected' } : req
      ));
      alert('Request rejected.');
    }
  };

  const stats = {
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Blood Requests</h1>
          <p className="text-gray-600">Review, approve, or reject hospital blood requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
        </div>

        {/* Requests Table */}
        <Table headers={['Request ID', 'Hospital', 'Blood Type', 'Units', 'Date', 'Urgency', 'Status', 'Actions']}>
          {requests.map(request => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{request.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.hospital}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {request.bloodType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{request.units}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  request.urgency === 'Emergency' ? 'bg-red-100 text-red-800' :
                  request.urgency === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {request.urgency}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" title="View">
                    <FaEye />
                  </button>
                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
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
      </div>
    </div>
  );
}
