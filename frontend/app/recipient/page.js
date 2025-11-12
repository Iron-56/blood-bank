'use client';
import { useState } from 'react';
import { FaUserInjured, FaSave, FaTimes, FaTint, FaSearch } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import FormInput from '@/app/components/FormInput';

export default function RecipientForm() {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    bloodType: '',
    unitsRequired: '',
    hospital: '',
    doctorName: '',
    urgency: '',
    diagnosis: '',
    contactNumber: '',
    dateRequired: '',
    notes: '',
  });

  const [compatibleDonors, setCompatibleDonors] = useState([]);
  const [showDonors, setShowDonors] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Recipient request recorded successfully!');
  };

  const findCompatibleDonors = () => {
    // Blood type compatibility logic
    const compatibility = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
    };

    // Mock compatible donors
    const mockDonors = [
      { id: 1, name: 'John Doe', bloodType: 'O+', lastDonation: '2024-08-15', available: true },
      { id: 2, name: 'Jane Smith', bloodType: 'A+', lastDonation: '2024-09-20', available: true },
      { id: 3, name: 'Mike Johnson', bloodType: 'O-', lastDonation: '2024-10-05', available: false },
    ];

    const compatible = mockDonors.filter(donor =>
      compatibility[formData.bloodType]?.includes(donor.bloodType)
    );

    setCompatibleDonors(compatible);
    setShowDonors(true);
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const urgencyLevels = ['Emergency', 'Urgent', 'Routine'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                  <FaUserInjured className="text-4xl text-purple-600 mr-4" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Recipient Request Form</h1>
                    <p className="text-gray-600">Record patient information and blood requirements</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Information</h2>
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
                      label="Age"
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormInput
                      label="Gender"
                      type="select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      options={genders}
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

                  <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Blood Requirement</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                      label="Blood Type Needed"
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
                      name="unitsRequired"
                      value={formData.unitsRequired}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Urgency"
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
                      label="Date Required"
                      type="date"
                      name="dateRequired"
                      value={formData.dateRequired}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Hospital"
                      name="hospital"
                      value={formData.hospital}
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
                      label="Diagnosis/Reason"
                      name="diagnosis"
                      value={formData.diagnosis}
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
                      className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      <FaSave className="mr-2" />
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Compatible Donors Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaTint className="mr-2 text-red-600" />
                  Find Compatible Donors
                </h3>
                
                <button
                  type="button"
                  onClick={findCompatibleDonors}
                  disabled={!formData.bloodType}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
                >
                  <FaSearch className="mr-2" />
                  Search Donors
                </button>

                {!formData.bloodType && (
                  <p className="text-sm text-gray-500 text-center">
                    Select blood type to search for compatible donors
                  </p>
                )}

                {showDonors && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Found {compatibleDonors.length} compatible donor(s)
                    </p>
                    <div className="space-y-3">
                      {compatibleDonors.map(donor => (
                        <div key={donor.id} className="p-3 border-2 border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-800">{donor.name}</span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                              {donor.bloodType}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Last: {donor.lastDonation}</p>
                          <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                            donor.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {donor.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
