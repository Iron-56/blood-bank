'use client';
import { FaUserInjured, FaCalendar, FaHospital } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Table from '@/app/components/Table';

export default function RecipientList() {
  // Sample recipient data
  const recipients = [
    { id: 1, name: 'Alice Brown', bloodType: 'O+', units: 2, date: '2024-11-10', hospital: 'City Hospital', status: 'Completed' },
    { id: 2, name: 'Bob Wilson', bloodType: 'A-', units: 3, date: '2024-11-08', hospital: 'Memorial Hospital', status: 'Completed' },
    { id: 3, name: 'Carol Davis', bloodType: 'B+', units: 1, date: '2024-11-05', hospital: 'General Hospital', status: 'Completed' },
    { id: 4, name: 'David Martinez', bloodType: 'AB+', units: 4, date: '2024-10-28', hospital: 'City Hospital', status: 'Completed' },
    { id: 5, name: 'Emma Taylor', bloodType: 'O-', units: 2, date: '2024-10-25', hospital: 'Memorial Hospital', status: 'Completed' },
  ];

  const stats = {
    total: recipients.length,
    thisMonth: recipients.filter(r => r.date.startsWith('2024-11')).length,
    totalUnits: recipients.reduce((sum, r) => sum + r.units, 0),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <FaUserInjured className="mr-3 text-purple-600" />
            Recipient List
          </h1>
          <p className="text-gray-600">Track patients who received blood transfusions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Recipients</p>
            <p className="text-4xl font-bold text-purple-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">This Month</p>
            <p className="text-4xl font-bold text-blue-600">{stats.thisMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-medium">Total Units Transfused</p>
            <p className="text-4xl font-bold text-red-600">{stats.totalUnits}</p>
          </div>
        </div>

        {/* Recipients Table */}
        <Table headers={['Recipient ID', 'Patient Name', 'Blood Type', 'Units Received', 'Date', 'Hospital', 'Status']}>
          {recipients.map(recipient => (
            <tr key={recipient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">#{recipient.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {recipient.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {recipient.bloodType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {recipient.units}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <FaCalendar className="inline mr-1" />
                {recipient.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <FaHospital className="inline mr-1" />
                {recipient.hospital}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {recipient.status}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
