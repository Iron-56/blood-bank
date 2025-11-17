'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaSave, FaTimes } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import FormInput from '@/app/components/FormInput';
import { donorAPI } from '@/app/lib/api';

export default function DonorRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodType: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    medicalHistory: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const donorData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        blood_type: formData.bloodType,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        medical_history: formData.medicalHistory || null,
        status: 'available',
      };

      const response = await donorAPI.create(donorData);
      
      alert('Donor registered successfully!');
      
      router.push('/donor');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register donor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/donor');
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <FaUserPlus className="text-4xl text-red-600 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Register New Donor</h1>
                <p className="text-gray-600">Fill in the donor information below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Blood Type"
                  type="select"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  options={bloodTypes}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Gender"
                  type="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genders}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mt-6">
                <FormInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Zip Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mt-6">
                <FormInput
                  label="Medical History / Notes"
                  type="textarea"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="mr-2" />
                  {loading ? 'Registering...' : 'Register Donor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
