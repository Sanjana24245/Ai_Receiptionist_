
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Stethoscope, Clock } from 'lucide-react';

const DoctorManagement = () => {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: '',
    timing: '',
    status: 'present',
    phone: '',
    experience: ''
  });

  const API_URL = 'http://localhost:5000/doctors'; // FastAPI backend

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(API_URL);
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Add new doctor
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, doctorForm);
      setDoctors([...doctors, res.data.doctor]);
      setDoctorForm({
        name: '',
        specialty: '',
        timing: '',
        status: 'present',
        phone: '',
        experience: ''
      });
      setShowDoctorForm(false);
    } catch (err) {
      console.error("Error adding doctor:", err);
    }
  };

  // Toggle status
  const toggleStatus = async (doctor) => {
    const newStatus = doctor.status === 'present' ? 'leave' : 'present';
    try {
      await axios.patch(`${API_URL}/${doctor._id}`, { status: newStatus });
      setDoctors(doctors.map(d => d._id === doctor._id ? { ...d, status: newStatus } : d));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
    

        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Doctor Management</h2>
              <p className="text-gray-600">Manage doctor profiles, schedules, and availability</p>
            </div>
            <button
              onClick={() => setShowDoctorForm(!showDoctorForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Stethoscope className="w-5 h-5" />
              <span>Add Doctor</span>
            </button>
          </div>

          {/* Doctor Form */}
          {showDoctorForm && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Add New Doctor</h3>
              <form onSubmit={handleDoctorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter doctor name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Cardiology"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
                  <input
                    type="text"
                    value={doctorForm.timing}
                    onChange={(e) => setDoctorForm({...doctorForm, timing: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={doctorForm.status}
                    onChange={(e) => setDoctorForm({...doctorForm, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="present">Present</option>
                    <option value="leave">On Leave</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDoctorForm(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Doctors List */}
        {/* Doctors List */}
{/* Doctors List */}
<div className="bg-white rounded-xl shadow-sm border">
  <div className="p-6 border-b">
    <h3 className="text-xl font-semibold">Doctors List</h3>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {doctors.map((doctor) => (
          <tr key={doctor._id} className="hover:bg-gray-50">
            {/* Doctor Name */}
            <td className="px-6 py-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <div className="font-medium text-gray-900">{doctor.name}</div>
            </td>

            {/* Specialty */}
            <td className="px-6 py-4 text-sm text-gray-900">{doctor.specialty}</td>

            {/* Experience */}
            <td className="px-6 py-4 text-sm text-gray-900">{doctor.experience}</td>

            {/* Timing */}
            <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-400" />
              {doctor.timing}
            </td>

            {/* Status Toggle with text inside */}
            <td className="px-6 py-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={doctor.status === 'present'}
                  onChange={() => toggleStatus(doctor)}
                />
                <div className="w-20 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer-checked:bg-green-500 transition-all relative flex items-center justify-center">
                  <span className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${doctor.status === 'present' ? 'translate-x-0' : 'translate-x-12'}`}></span>
                  <span className={`absolute left-1 w-full text-xs font-medium text-gray-700 text-center transition-opacity ${doctor.status === 'present' ? 'opacity-100' : 'opacity-0'}`}>Present</span>
                  <span className={`absolute left-1 w-full text-xs font-medium text-gray-700 text-center transition-opacity ${doctor.status !== 'present' ? 'opacity-100' : 'opacity-0'}`}>Leave</span>
                </div>
              </label>
            </td>

            {/* Contact */}
            <td className="px-6 py-4 text-sm text-gray-900">{doctor.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>




        </div>
      </div>
    
  );
};

export default DoctorManagement;
