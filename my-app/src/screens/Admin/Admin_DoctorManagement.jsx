import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stethoscope, Clock } from "lucide-react";

const AdminDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from FastAPI backend
  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:8000/doctors/");
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No doctors available.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50">
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
                      <td className="px-6 py-4 text-sm">
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      doctor.status?.toLowerCase() === "present"
        ? "bg-green-100 text-green-800"
        : doctor.status?.toLowerCase() === "absent"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800" // default
    }`}
  >
    {doctor.status || "unknown"}
  </span>
</td>

                    </tr>
                  ))
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
