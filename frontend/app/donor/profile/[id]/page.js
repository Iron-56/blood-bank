'use client';
import { FaUser, FaTint, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar, FaEdit, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function DonorProfile({ params }) {
  // Sample donor data
  const donor = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '123-456-7890',
    bloodType: 'O+',
    gender: 'Male',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    lastDonationDate: '2024-08-15',
    totalDonations: 12,
    status: 'Available',
    medicalHistory: 'No significant medical history',
  };

  const donationHistory = [
    { id: 1, date: '2024-08-15', location: 'City Blood Bank', units: 1, status: 'Completed' },
    { id: 2, date: '2024-05-20', location: 'Memorial Hospital', units: 1, status: 'Completed' },
    { id: 3, date: '2024-02-10', location: 'City Blood Bank', units: 1, status: 'Completed' },
    { id: 4, date: '2023-11-05', location: 'Downtown Clinic', units: 1, status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Donor Profile</h1>
              <p className="text-gray-600">Detailed information about the donor</p>
            </div>
            <Link href={`/donor/edit/${donor.id}`}>
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <FaEdit className="mr-2" />
                Edit Profile
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6 pb-6 border-b">
                  <div className="bg-red-100 p-4 rounded-full mr-4">
                    <FaUser className="text-4xl text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {donor.firstName} {donor.lastName}
                    </h2>
                    <p className="text-gray-600">Donor ID: #{donor.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{donor.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FaPhone className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{donor.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FaCalendar className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="font-medium">{donor.dateOfBirth}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FaUser className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{donor.gender}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-gray-500 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{donor.address}</p>
                          <p className="font-medium">{donor.city}, {donor.state} {donor.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Medical Information</h3>
                  <p className="text-gray-700">{donor.medicalHistory}</p>
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              {/* Blood Type Card */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Blood Type</p>
                    <p className="text-5xl font-bold mt-2">{donor.bloodType}</p>
                  </div>
                  <FaTint className="text-6xl text-red-200 opacity-50" />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Donation Stats</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Total Donations</p>
                    <p className="text-3xl font-bold text-blue-700">{donor.totalDonations}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Last Donation</p>
                    <p className="text-lg font-bold text-green-700">{donor.lastDonationDate}</p>
                  </div>
                  
                  <div className={`${donor.status === 'Available' ? 'bg-green-50' : 'bg-gray-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${donor.status === 'Available' ? 'text-green-600' : 'text-gray-600'} font-medium`}>
                      Status
                    </p>
                    <p className={`text-lg font-bold ${donor.status === 'Available' ? 'text-green-700' : 'text-gray-700'}`}>
                      {donor.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation History */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaHistory className="mr-2" />
              Donation History
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donationHistory.map(donation => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.units}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
