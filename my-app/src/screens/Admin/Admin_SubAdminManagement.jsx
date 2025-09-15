
import React, { useState } from "react";
import Sidebar from '../../components/Sidebar'; // Import your Sidebar
import Navbar from '../../components/Navbar';

const SubAdmin = () => {
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: "SubAdmin One", email: "sub1@example.com", phone: "9876543210" },
    { id: 2, name: "SubAdmin Two", email: "sub2@example.com", phone: "9876543211" }
  ]);

  const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
  const [shiftTimes, setShiftTimes] = useState({}); // store shift timing for each request

  // Handle input change for shift timing
  const handleShiftChange = (id, value) => {
    setShiftTimes({ ...shiftTimes, [id]: value });
  };

  // Approve request with shift timing
  const handleApprove = (id) => {
    const approved = pendingRequests.find((req) => req.id === id);
    if (!shiftTimes[id]) {
      alert("Please enter shift timing before approving!");
      return;
    }
    approved.shift = shiftTimes[id]; // add shift to approved data
    setApprovedSubAdmins([...approvedSubAdmins, approved]);
    setPendingRequests(pendingRequests.filter((req) => req.id !== id));
  };

  // Reject request
  const handleReject = (id) => {
    setPendingRequests(pendingRequests.filter((req) => req.id !== id));
  };

  // Delete approved sub-admin
  const handleDelete = (id) => {
    setApprovedSubAdmins(approvedSubAdmins.filter((admin) => admin.id !== id));
  };

  // Edit shift timing for approved sub-admin
  const handleShiftEdit = (id, value) => {
    setApprovedSubAdmins(
      approvedSubAdmins.map((admin) =>
        admin.id === id ? { ...admin, shift: value } : admin
      )
    );
  };

  return (
    <div className="flex h-screen">
   

        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">Sub Admin Dashboard</h2>

          {/* Pending Requests */}
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Shift Timing</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{req.name}</td>
                      <td className="px-4 py-2">{req.email}</td>
                      <td className="px-4 py-2">{req.phone}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          placeholder="e.g., 9 AM - 5 PM"
                          value={shiftTimes[req.id] || ""}
                          onChange={(e) => handleShiftChange(req.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm w-40"
                        />
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Approved SubAdmins */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Approved SubAdmins</h3>
            {approvedSubAdmins.length === 0 ? (
              <p className="text-gray-500">No approved sub-admins yet.</p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Shift Timing</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedSubAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{admin.name}</td>
                      <td className="px-4 py-2">{admin.email}</td>
                      <td className="px-4 py-2">{admin.phone}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={admin.shift || ""}
                          onChange={(e) => handleShiftEdit(admin.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm w-40"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default SubAdmin;
