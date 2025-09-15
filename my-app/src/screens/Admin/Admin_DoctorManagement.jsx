
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar'; // Import your Sidebar
import Navbar from '../../components/Navbar';
import { Stethoscope, Clock } from 'lucide-react';

const AdminDoctorList = () => {
  const [doctors] = useState([
    { id: 1, name: 'Dr. A', specialty: 'Cardiology', timing: '9:00 AM - 5:00 PM', phone: '+91 9876543210' },
    { id: 2, name: 'Dr. B', specialty: 'Dermatology', timing: '10:00 AM - 6:00 PM', phone: '+91 9123456780' },
    { id: 3, name: 'Dr. C', specialty: 'Neurology', timing: '8:00 AM - 4:00 PM', phone: '+91 9988776655' }
  ]);

  return (
    <div className="flex h-screen">
      

        <div className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Doctor List</h2>
            <p className="text-gray-600">All doctors with their specialties and shift timings</p>
          </div>

          {/* Doctors Table */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Timing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{doctor.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doctor.specialty}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {doctor.timing}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{doctor.phone}</td>
                    </tr>
                  ))}
                  {doctors.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">
                        No doctors available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default AdminDoctorList;
