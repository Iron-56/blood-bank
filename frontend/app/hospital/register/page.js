'use client';
import { useState } from 'react';
import { FaHospital, FaSave, FaTimes } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import FormInput from '@/app/components/FormInput';

export default function HospitalRegister() {
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactPerson: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    hospitalType: '',
    bedCapacity: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log('Form submitted:', formData);
    alert('Hospital registered successfully!');
    // Reset form or redirect
  };

  const hospitalTypes = ['Government', 'Private', 'Trust', 'Charitable'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <FaHospital className="text-4xl text-blue-600 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Hospital Registration</h1>
                <p className="text-gray-600">Register your hospital to access the blood bank system</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-6">Hospital Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Hospital Name"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Registration Number"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Hospital Type"
                  type="select"
                  name="hospitalType"
                  value={formData.hospitalType}
                  onChange={handleChange}
                  options={hospitalTypes}
                  required
                />
                <FormInput
                  label="Bed Capacity"
                  type="number"
                  name="bedCapacity"
                  value={formData.bedCapacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-6">
                <FormInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Zip Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Contact Person Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Contact Person Name"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Contact Person Phone"
                  type="tel"
                  name="contactPersonPhone"
                  value={formData.contactPersonPhone}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Contact Person Email"
                  type="email"
                  name="contactPersonEmail"
                  value={formData.contactPersonEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Login Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaSave className="mr-2" />
                  Register Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
