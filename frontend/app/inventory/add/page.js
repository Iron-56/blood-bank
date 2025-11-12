'use client';
import { useState } from 'react';
import { FaPlus, FaSave, FaTimes, FaTint } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import FormInput from '@/app/components/FormInput';

export default function AddBloodUnits() {
  const [formData, setFormData] = useState({
    bloodType: '',
    units: '',
    donorId: '',
    donorName: '',
    collectionDate: '',
    expiryDate: '',
    location: '',
    componentType: '',
    testingStatus: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Auto-calculate expiry date (42 days from collection for whole blood)
    if (e.target.name === 'collectionDate' && e.target.value) {
      const collectionDate = new Date(e.target.value);
      const expiryDate = new Date(collectionDate);
      expiryDate.setDate(expiryDate.getDate() + 42);
      setFormData(prev => ({
        ...prev,
        expiryDate: expiryDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Blood units added successfully to inventory!');
    // Reset form
    setFormData({
      bloodType: '',
      units: '',
      donorId: '',
      donorName: '',
      collectionDate: '',
      expiryDate: '',
      location: '',
      componentType: '',
      testingStatus: '',
      notes: '',
    });
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const componentTypes = ['Whole Blood', 'Red Blood Cells', 'Plasma', 'Platelets', 'Cryoprecipitate'];
  const testingStatuses = ['Tested - Safe', 'Pending Testing', 'Quarantine'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <FaPlus className="text-4xl text-red-600 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Add Blood Units</h1>
                <p className="text-gray-600">Add new blood units to inventory after donation</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Blood Unit Details</h2>
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
                  label="Number of Units"
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Component Type"
                  type="select"
                  name="componentType"
                  value={formData.componentType}
                  onChange={handleChange}
                  options={componentTypes}
                  required
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Donor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Donor ID"
                  name="donorId"
                  value={formData.donorId}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Donor Name"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleChange}
                  required
                />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Collection & Storage Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Collection Date"
                  type="date"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Expiry Date"
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Storage Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <FormInput
                  label="Testing Status"
                  type="select"
                  name="testingStatus"
                  value={formData.testingStatus}
                  onChange={handleChange}
                  options={testingStatuses}
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

              {/* Info Box */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <FaTint className="text-blue-600 text-2xl mr-3 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Storage Guidelines</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Whole Blood: Store at 2-6°C, expires in 42 days</li>
                      <li>• Red Blood Cells: Store at 2-6°C, expires in 42 days</li>
                      <li>• Plasma: Store frozen at -18°C or below, expires in 1 year</li>
                      <li>• Platelets: Store at 20-24°C with agitation, expires in 5 days</li>
                    </ul>
                  </div>
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
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
