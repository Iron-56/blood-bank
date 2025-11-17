'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEye, FaTint } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Table from '@/app/components/Table';
import { donorAPI } from '@/app/lib/api';

export default function DonorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  useEffect(() => {
    fetchDonors();
  }, [bloodTypeFilter]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      // Trim the blood type filter to remove any whitespace
      const trimmedFilter = bloodTypeFilter ? bloodTypeFilter.trim() : null;
      const data = await donorAPI.getAll(trimmedFilter);
      setDonors(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch donors:', err);
      setError(err.message);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this donor?')) {
      return;
    }

    try {
      await donorAPI.delete(id);
      alert('Donor deleted successfully');
      fetchDonors(); // Refresh the list
    } catch (err) {
      alert('Failed to delete donor: ' + err.message);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = 
      (donor.first_name && donor.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (donor.last_name && donor.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (donor.phone && donor.phone.includes(searchTerm));
    const matchesCity = !cityFilter || 
      (donor.city && donor.city.toLowerCase().includes(cityFilter.toLowerCase()));
    return matchesSearch && matchesCity;
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
                onChange={(e) => setBloodTypeFilter(e.target.value.trim())}
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

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading donors: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading donors...</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">
              Found {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Donors Table */}
        {!loading && filteredDonors.length > 0 && (
          <Table headers={['Name', 'Blood Type', 'Phone', 'City', 'Status', 'Actions']}>
            {filteredDonors.map(donor => (
              <tr key={donor.donor_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {donor.first_name} {donor.last_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    {donor.blood_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {donor.phone || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {donor.city || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    donor.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {donor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link href={`/donor/profile/${donor.donor_id}`}>
                      <button className="text-blue-600 hover:text-blue-900" title="View">
                        <FaEye />
                      </button>
                    </Link>
                    <Link href={`/donor/edit/${donor.donor_id}`}>
                      <button className="text-yellow-600 hover:text-yellow-900" title="Edit">
                        <FaEdit />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(donor.donor_id)}
                      className="text-red-600 hover:text-red-900" 
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}

        {!loading && filteredDonors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No donors found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
