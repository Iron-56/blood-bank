'use client';
import { useState } from 'react';
import { FaHandHoldingMedical, FaSave, FaTimes, FaTint } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import FormInput from '@/app/components/FormInput';

export default function RequestBlood() {
  const [formData, setFormData] = useState({
    bloodType: '',
    units: '',
    urgency: '',
    patientName: '',
    patientAge: '',
    reason: '',
    doctorName: '',
    contactNumber: '',
    requiredBy: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Request submitted:', formData);
    alert('Blood request submitted successfully! You will be notified once approved.');
    // Reset form
    setFormData({
      bloodType: '',
      units: '',
      urgency: '',
      patientName: '',
      patientAge: '',
      reason: '',
      doctorName: '',
      contactNumber: '',
      requiredBy: '',
      notes: '',
    });
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const urgencyLevels = ['Emergency', 'Urgent', 'Routine'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <FaHandHoldingMedical className="text-4xl text-red-600 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Request Blood</h1>
                <p className="text-gray-600">Submit a blood request for your hospital</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Blood Request Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Blood Type"
                  type="select"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  options={bloodTypes}
                  required
                />
                <FormInput
                  label="Units Required"
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Urgency Level"
                  type="select"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  options={urgencyLevels}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormInput
                  label="Required By Date"
                  type="date"
                  name="requiredBy"
                  value={formData.requiredBy}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Contact Number"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <FormInput
                    label="Patient Name"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <FormInput
                  label="Patient Age"
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormInput
                  label="Doctor Name"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Reason for Transfusion"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-6">
                <FormInput
                  label="Additional Notes"
                  type="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              {/* Available Blood Units Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-3">
                  <FaTint className="text-blue-600 text-2xl mr-3" />
                  <h3 className="text-lg font-bold text-gray-800">Current Available Units</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bloodTypes.map(type => (
                    <div key={type} className="bg-white p-3 rounded-lg text-center shadow-sm">
                      <p className="font-bold text-lg text-gray-800">{type}</p>
                      <p className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 20) + 5}</p>
                      <p className="text-xs text-gray-600">units</p>
                    </div>
                  ))}
                </div>
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
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <FaSave className="mr-2" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
