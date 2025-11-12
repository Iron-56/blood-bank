'use client';
import { useState } from 'react';
import { FaHandHoldingMedical, FaSave, FaTimes, FaHospital, FaTint } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import FormInput from '@/app/components/FormInput';

export default function AssignBloodUnits() {
  const [formData, setFormData] = useState({
    requestId: '',
    hospitalId: '',
    hospitalName: '',
    bloodType: '',
    unitsRequested: '',
    unitsToAssign: '',
    assignmentDate: new Date().toISOString().split('T')[0],
    assignedBy: '',
    notes: '',
  });

  const [availableUnits, setAvailableUnits] = useState(45); // Sample available units

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Update available units when blood type changes
    if (e.target.name === 'bloodType') {
      // In real app, fetch from API
      const mockAvailable = {
        'A+': 45, 'A-': 12, 'B+': 38, 'B-': 8,
        'O+': 52, 'O-': 15, 'AB+': 20, 'AB-': 5
      };
      setAvailableUnits(mockAvailable[e.target.value] || 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (parseInt(formData.unitsToAssign) > availableUnits) {
      alert('Cannot assign more units than available in stock!');
      return;
    }
    
    console.log('Assignment submitted:', formData);
    alert('Blood units assigned successfully!');
    // Reset form
    setFormData({
      requestId: '',
      hospitalId: '',
      hospitalName: '',
      bloodType: '',
      unitsRequested: '',
      unitsToAssign: '',
      assignmentDate: new Date().toISOString().split('T')[0],
      assignedBy: '',
      notes: '',
    });
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Sample pending requests
  const pendingRequests = [
    { id: 'REQ001', hospital: 'City Hospital', bloodType: 'O+', units: 5 },
    { id: 'REQ002', hospital: 'Memorial Hospital', bloodType: 'A-', units: 3 },
    { id: 'REQ003', hospital: 'General Hospital', bloodType: 'B+', units: 4 },
  ];

  const handleSelectRequest = (request) => {
    setFormData({
      ...formData,
      requestId: request.id,
      hospitalName: request.hospital,
      bloodType: request.bloodType,
      unitsRequested: request.units.toString(),
      unitsToAssign: request.units.toString(),
    });
    
    // Update available units
    const mockAvailable = {
      'A+': 45, 'A-': 12, 'B+': 38, 'B-': 8,
      'O+': 52, 'O-': 15, 'AB+': 20, 'AB-': 5
    };
    setAvailableUnits(mockAvailable[request.bloodType] || 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Requests Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaHospital className="mr-2 text-blue-600" />
                  Pending Requests
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map(request => (
                    <div
                      key={request.id}
                      onClick={() => handleSelectRequest(request)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-800">{request.id}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                          {request.bloodType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{request.hospital}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {request.units} units needed
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                  <FaHandHoldingMedical className="text-4xl text-blue-600 mr-4" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">Assign Blood Units</h1>
                    <p className="text-gray-600">Allocate blood units to approved requests</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Request Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Request ID"
                      name="requestId"
                      value={formData.requestId}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Hospital ID"
                      name="hospitalId"
                      value={formData.hospitalId}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <FormInput
                      label="Hospital Name"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">Blood Assignment</h2>
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
                      label="Units Requested"
                      type="number"
                      name="unitsRequested"
                      value={formData.unitsRequested}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Units to Assign"
                      type="number"
                      name="unitsToAssign"
                      value={formData.unitsToAssign}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Available Stock Alert */}
                  {formData.bloodType && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      availableUnits >= parseInt(formData.unitsToAssign || 0)
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center">
                        <FaTint className={`text-2xl mr-3 ${
                          availableUnits >= parseInt(formData.unitsToAssign || 0)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`} />
                        <div>
                          <p className="font-bold text-gray-800">Available Stock: {availableUnits} units</p>
                          <p className="text-sm text-gray-600">
                            {availableUnits >= parseInt(formData.unitsToAssign || 0)
                              ? 'Sufficient units available for assignment'
                              : 'Insufficient units in stock!'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormInput
                      label="Assignment Date"
                      type="date"
                      name="assignmentDate"
                      value={formData.assignmentDate}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="Assigned By (Staff Name)"
                      name="assignedBy"
                      value={formData.assignedBy}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <FormInput
                      label="Notes"
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
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      disabled={availableUnits < parseInt(formData.unitsToAssign || 0)}
                    >
                      <FaSave className="mr-2" />
                      Assign Units
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
