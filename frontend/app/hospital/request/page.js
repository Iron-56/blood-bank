'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHandHoldingMedical, FaSave, FaTimes, FaTint } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import FormInput from '@/app/components/FormInput';
import { requestAPI, hospitalAPI } from '@/app/lib/api';

export default function RequestBlood() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    hospitalId: '',
    bloodType: '',
    units: '',
    urgency: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    reason: '',
    doctorName: '',
    contactNumber: '',
    requiredBy: '',
    notes: '',
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await hospitalAPI.getAll();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        hospital_id: parseInt(formData.hospitalId),
        blood_type: formData.bloodType,
        units_requested: parseInt(formData.units),
        urgency_level: formData.urgency.toLowerCase(),
        patient_name: formData.patientName,
        patient_age: parseInt(formData.patientAge),
        patient_gender: formData.patientGender,
        diagnosis_reason: formData.reason,
        doctor_name: formData.doctorName,
        doctor_contact_number: formData.contactNumber,
        required_by_date: formData.requiredBy,
        notes: formData.notes || null,
      };

      await requestAPI.create(requestData);
      alert('Blood request submitted successfully! You will be notified once approved.');
      router.push('/admin/requests');
    } catch (err) {
      console.error('Request submission error:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const urgencyLevels = ['Normal', 'Urgent', 'Emergency'];
  const genders = ['Male', 'Female', 'Other'];

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
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-800 mb-4">Hospital Selection</h2>
              <div className="mb-6">
                <FormInput
                  label="Select Hospital"
                  type="select"
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleChange}
                  options={hospitals.map(h => ({ value: h.hospital_id, label: h.name }))}
                  required
                  disabled={loading}
                />
              </div>

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
                  disabled={loading}
                />
                <FormInput
                  label="Units Required"
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Urgency Level"
                  type="select"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  options={urgencyLevels}
                  required
                  disabled={loading}
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
                  disabled={loading}
                />
                <FormInput
                  label="Contact Number"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <FormInput
                  label="Patient Age"
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <FormInput
                  label="Doctor Name"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Patient Gender"
                  type="select"
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleChange}
                  options={genders}
                  required
                  disabled={loading}
                />
                <FormInput
                  label="Diagnosis/Reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mt-6">
                <FormInput
                  label="Additional Notes"
                  type="textarea"
                  name="notes"
                  value={formData.notes}
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
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
