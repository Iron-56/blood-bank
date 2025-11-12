'use client';
import { useState } from 'react';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEye, FaTint } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Table from '@/app/components/Table';

export default function DonorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Sample donor data
  const donors = [
    { id: 1, name: 'John Doe', bloodType: 'O+', phone: '123-456-7890', city: 'New York', lastDonation: '2024-08-15', status: 'Available' },
    { id: 2, name: 'Jane Smith', bloodType: 'A+', phone: '234-567-8901', city: 'Los Angeles', lastDonation: '2024-09-20', status: 'Available' },
    { id: 3, name: 'Mike Johnson', bloodType: 'B+', phone: '345-678-9012', city: 'Chicago', lastDonation: '2024-10-05', status: 'Unavailable' },
    { id: 4, name: 'Sarah Williams', bloodType: 'AB+', phone: '456-789-0123', city: 'Houston', lastDonation: '2024-07-30', status: 'Available' },
    { id: 5, name: 'David Brown', bloodType: 'O-', phone: '567-890-1234', city: 'Phoenix', lastDonation: '2024-09-10', status: 'Available' },
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.phone.includes(searchTerm);
    const matchesBloodType = !bloodTypeFilter || donor.bloodType === bloodTypeFilter;
    const matchesCity = !cityFilter || donor.city.toLowerCase().includes(cityFilter.toLowerCase());
    return matchesSearch && matchesBloodType && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Donors</h1>
          <p className="text-gray-600">Find and manage donor records</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FaSearch className="inline mr-2" />
                Search by Name or Phone
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name or phone..."
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FaTint className="inline mr-2" />
                Blood Type
              </label>
              <select
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Types</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <FaFilter className="inline mr-2" />
                City
              </label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Enter city..."
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">
            Found {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Donors Table */}
        <Table headers={['Name', 'Blood Type', 'Phone', 'City', 'Last Donation', 'Status', 'Actions']}>
          {filteredDonors.map(donor => (
            <tr key={donor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{donor.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  {donor.bloodType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {donor.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {donor.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {donor.lastDonation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  donor.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {donor.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link href={`/donor/profile/${donor.id}`}>
                    <button className="text-blue-600 hover:text-blue-900" title="View">
                      <FaEye />
                    </button>
                  </Link>
                  <Link href={`/donor/edit/${donor.id}`}>
                    <button className="text-yellow-600 hover:text-yellow-900" title="Edit">
                      <FaEdit />
                    </button>
                  </Link>
                  <button className="text-red-600 hover:text-red-900" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        {filteredDonors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No donors found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
