'use client';
import { FaExclamationTriangle, FaTrash, FaCalendar } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Table from '@/app/components/Table';

export default function ExpiredUnits() {
  // Sample expired units data
  const expiredUnits = [
    { id: 1, bloodType: 'O+', units: 3, collectionDate: '2024-08-15', expiryDate: '2024-09-26', location: 'Storage A', donor: 'John Doe' },
    { id: 2, bloodType: 'A-', units: 1, collectionDate: '2024-08-20', expiryDate: '2024-10-01', location: 'Storage B', donor: 'Jane Smith' },
    { id: 3, bloodType: 'B+', units: 2, collectionDate: '2024-08-18', expiryDate: '2024-09-29', location: 'Storage A', donor: 'Mike Johnson' },
    { id: 4, bloodType: 'AB+', units: 1, collectionDate: '2024-08-12', expiryDate: '2024-09-23', location: 'Storage C', donor: 'Sarah Williams' },
  ];

  const totalExpiredUnits = expiredUnits.reduce((sum, item) => sum + item.units, 0);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this expired unit from the system?')) {
      console.log('Deleting expired unit:', id);
      alert('Expired unit removed from system');
    }
  };

  const handleBulkCleanup = () => {
    if (confirm(`Remove all ${totalExpiredUnits} expired units from the system?`)) {
      console.log('Bulk cleanup triggered');
      alert('All expired units have been removed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <FaExclamationTriangle className="mr-3 text-red-600" />
            Expired Blood Units
          </h1>
          <p className="text-gray-600">Manage and remove expired blood units from inventory</p>
        </div>

        {/* Summary Card */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-600 text-sm font-medium mb-2">Total Expired Units</p>
              <p className="text-5xl font-bold text-red-700">{totalExpiredUnits}</p>
              <p className="text-sm text-red-600 mt-2">These units must be properly disposed of</p>
            </div>
            <div>
              <button
                onClick={handleBulkCleanup}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FaTrash className="mr-2" />
                Bulk Cleanup
              </button>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <FaExclamationTriangle className="text-yellow-400 text-xl mr-3 mt-1" />
            <div>
              <h3 className="text-yellow-800 font-bold mb-1">Disposal Guidelines</h3>
              <p className="text-yellow-700 text-sm">
                Expired blood units must be disposed of following proper medical waste disposal protocols. 
                Ensure all units are documented before removal and follow your facility's biohazard waste procedures.
              </p>
            </div>
          </div>
        </div>

        {/* Expired Units Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b bg-red-50">
            <h3 className="text-xl font-bold text-gray-800">Expired Units List</h3>
          </div>
          
          {expiredUnits.length > 0 ? (
            <Table headers={['Unit ID', 'Blood Type', 'Units', 'Collection Date', 'Expiry Date', 'Location', 'Donor', 'Actions']}>
              {expiredUnits.map(unit => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">#{unit.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {unit.bloodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {unit.units}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <FaCalendar className="inline mr-1" />
                    {unit.collectionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-red-600 font-semibold">
                      <FaCalendar className="inline mr-1" />
                      {unit.expiryDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unit.donor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(unit.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      title="Remove from system"
                    >
                      <FaTrash className="mr-1" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <div className="text-center py-12">
              <FaExclamationTriangle className="text-6xl text-green-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No expired units found</p>
              <p className="text-gray-400 text-sm mt-2">Great! All your blood units are within their valid period</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-gray-600 text-sm font-medium mb-2">Most Wasted Blood Type</h4>
            <p className="text-3xl font-bold text-gray-800">O+</p>
            <p className="text-sm text-gray-500 mt-1">3 units expired</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-gray-600 text-sm font-medium mb-2">This Month's Waste</h4>
            <p className="text-3xl font-bold text-gray-800">{totalExpiredUnits}</p>
            <p className="text-sm text-gray-500 mt-1">units expired</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-gray-600 text-sm font-medium mb-2">Waste Reduction Target</h4>
            <p className="text-3xl font-bold text-green-600">-20%</p>
            <p className="text-sm text-gray-500 mt-1">vs last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
