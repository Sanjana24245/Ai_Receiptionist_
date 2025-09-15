import React, { useEffect, useState } from "react";
import { User, Upload } from "lucide-react";
import axios from "axios";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]); // ✅ Local state

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:8000/patients/list");
      setPatients(res.data.patients || []);
      localStorage.setItem("patients", JSON.stringify(res.data.patients || []));
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
    fetchPatients();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/patients/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Excel file uploaded successfully!");
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Patient Management
        </h2>
        <p className="text-gray-600">
          Upload patient data and manage patient records
        </p>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Upload Patient Data</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Upload Excel File
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
          >
            Choose File
          </label>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Patients List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Issue</th>
                <th className="px-6 py-3">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4 font-medium text-gray-900">
                        {patient.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">{patient.age} years</td>
                    <td className="px-6 py-4">{patient.phone}</td>
                    <td className="px-6 py-4">{patient.issue}</td>
                    <td className="px-6 py-4">{patient.lastVisit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
