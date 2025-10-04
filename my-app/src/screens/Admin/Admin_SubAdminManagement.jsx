
// // // // // import React, { useState, useEffect, useContext } from "react";
// // // // // import { Info } from "lucide-react";
// // // // // import axios from "axios";
// // // // // import { AuthContext } from "../../context/AuthContext"; // Make sure your context path is correct

// // // // // const SubAdmin = () => {
// // // // //   const { user, token } = useContext(AuthContext); // Get logged-in admin and token
// // // // //   const [pendingRequests, setPendingRequests] = useState([]);
// // // // //   const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
// // // // //   const [shiftTimes, setShiftTimes] = useState({});
// // // // //   const [selectedAdmin, setSelectedAdmin] = useState(null);

// // // // //   // Fetch pending & approved subadmins from backend
// // // // //   useEffect(() => {
// // // // //     const fetchData = async () => {
// // // // //       try {
// // // // //         const pendingRes = await axios.get("/subadmin/pending", {
// // // // //           headers: { Authorization: `Bearer ${token}` },
// // // // //         });
// // // // //         setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);

// // // // //         const approvedRes = await axios.get("/subadmin/approved", {
// // // // //           headers: { Authorization: `Bearer ${token}` },
// // // // //         });
// // // // //         setApprovedSubAdmins(Array.isArray(approvedRes.data) ? approvedRes.data : []);
// // // // //       } catch (err) {
// // // // //         console.error(err);
// // // // //         setPendingRequests([]);
// // // // //         setApprovedSubAdmins([]);
// // // // //       }
// // // // //     };
// // // // //     fetchData();
// // // // //   }, [token]);

// // // // //   const handleShiftChange = (id, field, value) => {
// // // // //     setShiftTimes({
// // // // //       ...shiftTimes,
// // // // //       [id]: { ...shiftTimes[id], [field]: value },
// // // // //     });
// // // // //   };

// // // // //   const handleApprove = async (id) => {
// // // // //     const approved = pendingRequests.find((req) => req.id === id);
// // // // //     const shift = shiftTimes[id];

// // // // //     if (!shift || !shift.start || !shift.end) {
// // // // //       alert("Please enter both Start Time and End Time before approving!");
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       await axios.post(
// // // // //         `/subadmin/approve/${id}`,
// // // // //         { shift: `${shift.start} - ${shift.end}` },
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );

// // // // //       approved.shift = `${shift.start} - ${shift.end}`;
// // // // //       approved.isActive = true;

// // // // //       setApprovedSubAdmins([...approvedSubAdmins, approved]);
// // // // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Error approving sub-admin");
// // // // //     }
// // // // //   };

// // // // //   const handleReject = async (id) => {
// // // // //     try {
// // // // //       await axios.delete(`/subadmin/reject/${id}`, {
// // // // //         headers: { Authorization: `Bearer ${token}` },
// // // // //       });
// // // // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Error rejecting sub-admin");
// // // // //     }
// // // // //   };

// // // // //   const handleToggleActive = async (id) => {
// // // // //     const admin = approvedSubAdmins.find((a) => a.id === id);
// // // // //     const newStatus = !admin.isActive;
// // // // //     try {
// // // // //       await axios.patch(
// // // // //         `/subadmin/status/${id}`,
// // // // //         { isActive: newStatus },
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );
// // // // //       setApprovedSubAdmins(
// // // // //         approvedSubAdmins.map((a) =>
// // // // //           a.id === id ? { ...a, isActive: newStatus } : a
// // // // //         )
// // // // //       );
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Error updating status");
// // // // //     }
// // // // //   };

// // // // //   const handleShiftEdit = async (id, start, end) => {
// // // // //     try {
// // // // //       await axios.patch(
// // // // //         `/subadmin/shift/${id}`,
// // // // //         { shift: `${start} - ${end}` },
// // // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // // //       );
// // // // //       setApprovedSubAdmins(
// // // // //         approvedSubAdmins.map((admin) =>
// // // // //           admin.id === id ? { ...admin, shift: `${start} - ${end}` } : admin
// // // // //         )
// // // // //       );
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Error updating shift");
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="flex h-screen">
// // // // //       <div className="p-6 w-full">
// // // // //         <h2 className="text-3xl font-bold mb-4">Sub Admin Dashboard</h2>

// // // // //         {/* Pending Requests */}
// // // // //         <div className="bg-white p-4 rounded-xl shadow mb-6">
// // // // //           <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
// // // // //           {Array.isArray(pendingRequests) && pendingRequests.length > 0 ? (
// // // // //             <table className="w-full">
// // // // //               <thead className="bg-gray-50">
// // // // //                 <tr>
// // // // //                   <th className="px-4 py-2 text-left">Name</th>
// // // // //                   <th className="px-4 py-2 text-left">Email</th>
// // // // //                   <th className="px-4 py-2 text-left">Phone</th>
// // // // //                   <th className="px-4 py-2 text-left">Shift Start</th>
// // // // //                   <th className="px-4 py-2 text-left">Shift End</th>
// // // // //                   <th className="px-4 py-2 text-center">Actions</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {pendingRequests.map((req) => (
// // // // //                   <tr key={req.id} className="border-b hover:bg-gray-50">
// // // // //                     <td className="px-4 py-2">{req.name}</td>
// // // // //                     <td className="px-4 py-2">{req.email}</td>
// // // // //                     <td className="px-4 py-2">{req.phone}</td>
// // // // //                     <td className="px-4 py-2">
// // // // //                       <input
// // // // //                         type="time"
// // // // //                         value={shiftTimes[req.id]?.start || ""}
// // // // //                         onChange={(e) =>
// // // // //                           handleShiftChange(req.id, "start", e.target.value)
// // // // //                         }
// // // // //                         className="border rounded px-2 py-1 text-sm w-32"
// // // // //                       />
// // // // //                     </td>
// // // // //                     <td className="px-4 py-2">
// // // // //                       <input
// // // // //                         type="time"
// // // // //                         value={shiftTimes[req.id]?.end || ""}
// // // // //                         onChange={(e) =>
// // // // //                           handleShiftChange(req.id, "end", e.target.value)
// // // // //                         }
// // // // //                         className="border rounded px-2 py-1 text-sm w-32"
// // // // //                       />
// // // // //                     </td>
// // // // //                     <td className="px-4 py-2 text-center space-x-2">
// // // // //                       <button
// // // // //                         onClick={() => handleApprove(req.id)}
// // // // //                         className="bg-green-500 text-white px-3 py-1 rounded"
// // // // //                       >
// // // // //                         Approve
// // // // //                       </button>
// // // // //                       <button
// // // // //                         onClick={() => handleReject(req.id)}
// // // // //                         className="bg-red-500 text-white px-3 py-1 rounded"
// // // // //                       >
// // // // //                         Reject
// // // // //                       </button>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           ) : (
// // // // //             <p className="text-gray-500">No pending requests.</p>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Approved SubAdmins */}
// // // // //         <div className="bg-white p-4 rounded-xl shadow">
// // // // //           <h3 className="text-xl font-semibold mb-4">Approved SubAdmins</h3>
// // // // //           {Array.isArray(approvedSubAdmins) && approvedSubAdmins.length > 0 ? (
// // // // //             <table className="w-full">
// // // // //               <thead className="bg-gray-50">
// // // // //                 <tr>
// // // // //                   <th className="px-4 py-2 text-left">Name</th>
// // // // //                   <th className="px-4 py-2 text-left">Email</th>
// // // // //                   <th className="px-4 py-2 text-left">Phone</th>
// // // // //                   <th className="px-4 py-2 text-left">Shift Start</th>
// // // // //                   <th className="px-4 py-2 text-left">Shift End</th>
// // // // //                   <th className="px-4 py-2 text-center">Status</th>
// // // // //                   <th className="px-4 py-2 text-center">Info</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {approvedSubAdmins.map((admin) => {
// // // // //                   const [start, end] = admin.shift.split(" - ");
// // // // //                   return (
// // // // //                     <tr key={admin.id} className="border-b hover:bg-gray-50">
// // // // //                       <td className="px-4 py-2">{admin.name}</td>
// // // // //                       <td className="px-4 py-2">{admin.email}</td>
// // // // //                       <td className="px-4 py-2">{admin.phone}</td>
// // // // //                       <td className="px-4 py-2">
// // // // //                         <input
// // // // //                           type="time"
// // // // //                           value={start}
// // // // //                           onChange={(e) =>
// // // // //                             handleShiftEdit(admin.id, e.target.value, end)
// // // // //                           }
// // // // //                           className="border rounded px-2 py-1 text-sm w-32"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="px-4 py-2">
// // // // //                         <input
// // // // //                           type="time"
// // // // //                           value={end}
// // // // //                           onChange={(e) =>
// // // // //                             handleShiftEdit(admin.id, start, e.target.value)
// // // // //                           }
// // // // //                           className="border rounded px-2 py-1 text-sm w-32"
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="px-4 py-2 text-center">
// // // // //                         <button
// // // // //                           onClick={() => handleToggleActive(admin.id)}
// // // // //                           className={`px-3 py-1 rounded text-white ${
// // // // //                             admin.isActive ? "bg-green-500" : "bg-gray-500"
// // // // //                           }`}
// // // // //                         >
// // // // //                           {admin.isActive ? "Active" : "Inactive"}
// // // // //                         </button>
// // // // //                       </td>
// // // // //                       <td className="px-4 py-2 text-center">
// // // // //                         <button
// // // // //                           onClick={() => setSelectedAdmin(admin)}
// // // // //                           className="text-blue-500 hover:text-blue-700"
// // // // //                         >
// // // // //                           <Info size={20} />
// // // // //                         </button>
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   );
// // // // //                 })}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           ) : (
// // // // //             <p className="text-gray-500">No approved sub-admins yet.</p>
// // // // //           )}
// // // // //         </div>

// // // // //         {/* Modal */}
// // // // //         {selectedAdmin && (
// // // // //           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
// // // // //             <div className="bg-white p-6 rounded-xl shadow-lg w-96">
// // // // //               <h3 className="text-xl font-bold mb-4">{selectedAdmin.name} Details</h3>
// // // // //               <p>
// // // // //                 <strong>Email:</strong> {selectedAdmin.email}
// // // // //               </p>
// // // // //               <p>
// // // // //                 <strong>Phone:</strong> {selectedAdmin.phone}
// // // // //               </p>
// // // // //               <p>
// // // // //                 <strong>Shift:</strong> {selectedAdmin.shift}
// // // // //               </p>
// // // // //               <p>
// // // // //                 <strong>Status:</strong> {selectedAdmin.isActive ? "Active" : "Inactive"}
// // // // //               </p>
// // // // //               <div className="mt-4 text-right">
// // // // //                 <button
// // // // //                   onClick={() => setSelectedAdmin(null)}
// // // // //                   className="bg-red-500 text-white px-3 py-1 rounded"
// // // // //                 >
// // // // //                   Close
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SubAdmin;
// // // // // import React, { useState, useEffect, useContext } from "react";
// // // // // import { Info } from "lucide-react";
// // // // // import axios from "axios";
// // // // // import { AuthContext } from "../../context/AuthContext";

// // // // // const SubAdmin = () => {
// // // // //   const { token } = useContext(AuthContext);
// // // // //   const [pendingRequests, setPendingRequests] = useState([]);
// // // // //   const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
// // // // //   const [shiftTimes, setShiftTimes] = useState({});
// // // // //   const [selectedAdmin, setSelectedAdmin] = useState(null);

// // // // //   const API_BASE = "http://localhost:5000/subadmin";

// // // // //   useEffect(() => {
// // // // //     const fetchData = async () => {
// // // // //       try {
// // // // //         const pendingRes = await axios.get(`${API_BASE}/pending`, { headers: { Authorization: `Bearer ${token}` } });
// // // // //         setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);

// // // // //         const approvedRes = await axios.get(`${API_BASE}/approved`, { headers: { Authorization: `Bearer ${token}` } });
// // // // //         setApprovedSubAdmins(Array.isArray(approvedRes.data) ? approvedRes.data : []);
// // // // //       } catch (err) {
// // // // //         console.error(err);
// // // // //       }
// // // // //     };
// // // // //     fetchData();
// // // // //   }, [token]);

// // // // //   const handleShiftChange = (id, field, value) => {
// // // // //     setShiftTimes({ ...shiftTimes, [id]: { ...shiftTimes[id], [field]: value } });
// // // // //   };

// // // // //   const handleApprove = async (id) => {
// // // // //     const shift = shiftTimes[id];
// // // // //     if (!shift || !shift.start || !shift.end) {
// // // // //       alert("Enter both start & end time!");
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       const res = await axios.put(`${API_BASE}/approve/${id}`, { start: shift.start, end: shift.end }, { headers: { Authorization: `Bearer ${token}` } });
// // // // //       setApprovedSubAdmins([...approvedSubAdmins, res.data]);
// // // // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Approval failed");
// // // // //     }
// // // // //   };

// // // // //   const handleReject = async (id) => {
// // // // //     try {
// // // // //       await axios.delete(`${API_BASE}/reject/${id}`, { headers: { Authorization: `Bearer ${token}` } });
// // // // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Reject failed");
// // // // //     }
// // // // //   };

// // // // //   const handleToggleActive = async (id) => {
// // // // //     const admin = approvedSubAdmins.find((a) => a.id === id);
// // // // //     const newStatus = !admin.isActive;
// // // // //     try {
// // // // //       const res = await axios.put(`${API_BASE}/toggle-active/${id}`, { isActive: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
// // // // //       setApprovedSubAdmins(approvedSubAdmins.map((a) => (a.id === id ? res.data : a)));
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Status update failed");
// // // // //     }
// // // // //   };

// // // // //   const handleShiftEdit = async (id, start, end) => {
// // // // //     try {
// // // // //       const res = await axios.put(`${API_BASE}/shift/${id}`, { start, end }, { headers: { Authorization: `Bearer ${token}` } });
// // // // //       setApprovedSubAdmins(approvedSubAdmins.map((a) => (a.id === id ? res.data : a)));
// // // // //     } catch (err) {
// // // // //       console.error(err);
// // // // //       alert("Shift update failed");
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="flex h-screen p-6">
// // // // //       <div className="w-full space-y-6">
// // // // //         <h2 className="text-3xl font-bold mb-4">SubAdmin Dashboard</h2>

// // // // //         {/* Pending Requests */}
// // // // //         <div className="bg-white p-4 rounded-xl shadow">
// // // // //           <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
// // // // //           {pendingRequests.length > 0 ? (
// // // // //             <table className="w-full">
// // // // //               <thead className="bg-gray-50">
// // // // //                 <tr>
// // // // //                   <th>Name</th><th>Email</th><th>Phone</th><th>Shift Start</th><th>Shift End</th><th>Actions</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {pendingRequests.map((req) => (
// // // // //                   <tr key={req.id} className="border-b">
// // // // //                     <td>{req.username}</td>
// // // // //                     <td>{req.email}</td>
// // // // //                     <td>{req.contactnumber}</td>
// // // // //                     <td><input type="time" value={shiftTimes[req.id]?.start || ""} onChange={(e)=>handleShiftChange(req.id,'start',e.target.value)} className="w-32"/></td>
// // // // //                     <td><input type="time" value={shiftTimes[req.id]?.end || ""} onChange={(e)=>handleShiftChange(req.id,'end',e.target.value)} className="w-32"/></td>
// // // // //                     <td className="space-x-2">
// // // // //                       <button onClick={()=>handleApprove(req.id)} className="bg-green-500 text-white px-3 rounded">Approve</button>
// // // // //                       <button onClick={()=>handleReject(req.id)} className="bg-red-500 text-white px-3 rounded">Reject</button>
// // // // //                     </td>
// // // // //                   </tr>
// // // // //                 ))}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           ) : <p>No pending requests</p>}
// // // // //         </div>

// // // // //         {/* Approved SubAdmins */}
// // // // //         <div className="bg-white p-4 rounded-xl shadow">
// // // // //           <h3 className="text-xl font-semibold mb-4">Approved SubAdmins</h3>
// // // // //           {approvedSubAdmins.length > 0 ? (
// // // // //             <table className="w-full">
// // // // //               <thead className="bg-gray-50">
// // // // //                 <tr>
// // // // //                   <th>Name</th><th>Email</th><th>Phone</th><th>Shift Start</th><th>Shift End</th><th>Status</th><th>Info</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody>
// // // // //                 {approvedSubAdmins.map((admin) => {
// // // // //                   const [start, end] = admin.shift ? admin.shift.split(" - ") : ["",""];
// // // // //                   return (
// // // // //                     <tr key={admin.id} className="border-b">
// // // // //                       <td>{admin.username}</td>
// // // // //                       <td>{admin.email}</td>
// // // // //                       <td>{admin.contactnumber}</td>
// // // // //                       <td><input type="time" value={start} onChange={(e)=>handleShiftEdit(admin.id,e.target.value,end)} className="w-32"/></td>
// // // // //                       <td><input type="time" value={end} onChange={(e)=>handleShiftEdit(admin.id,start,e.target.value)} className="w-32"/></td>
// // // // //                       <td><button onClick={()=>handleToggleActive(admin.id)} className={`px-3 py-1 rounded text-white ${admin.isActive ? 'bg-green-500':'bg-gray-500'}`}>{admin.isActive?'Active':'Inactive'}</button></td>
// // // // //                       <td><button onClick={()=>setSelectedAdmin(admin)} className="text-blue-500"><Info/></button></td>
// // // // //                     </tr>
// // // // //                   )
// // // // //                 })}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           ) : <p>No approved sub-admins yet</p>}
// // // // //         </div>

// // // // //         {/* Modal */}
// // // // //         {selectedAdmin && (
// // // // //           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
// // // // //             <div className="bg-white p-6 rounded-xl shadow-lg w-96">
// // // // //               <h3 className="text-xl font-bold mb-4">{selectedAdmin.username} Details</h3>
// // // // //               <p><strong>Email:</strong> {selectedAdmin.email}</p>
// // // // //               <p><strong>Phone:</strong> {selectedAdmin.contactnumber}</p>
// // // // //               <p><strong>Shift:</strong> {selectedAdmin.shift}</p>
// // // // //               <p><strong>Status:</strong> {selectedAdmin.isActive ? "Active" : "Inactive"}</p>
// // // // //               <div className="mt-4 text-right">
// // // // //                 <button onClick={()=>setSelectedAdmin(null)} className="bg-red-500 text-white px-3 py-1 rounded">Close</button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SubAdmin;


// // // // import React, { useState, useEffect, useContext } from "react";
// // // // import { Info, Check, X } from "lucide-react";
// // // // import axios from "axios";
// // // // import { AuthContext } from "../../context/AuthContext";

// // // // const SubAdmin = () => {
// // // //   const { token } = useContext(AuthContext);
// // // //   const [pendingRequests, setPendingRequests] = useState([]);
// // // //   const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
// // // //   const [shiftTimes, setShiftTimes] = useState({});
// // // //   const [selectedAdmin, setSelectedAdmin] = useState(null);

// // // //   const API_BASE = "http://localhost:5000/subadmin";

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       try {
// // // //         const pendingRes = await axios.get(`${API_BASE}/pending`, {
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         });
// // // //         setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);

// // // //         const approvedRes = await axios.get(`${API_BASE}/approved`, {
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         });
// // // //         setApprovedSubAdmins(Array.isArray(approvedRes.data) ? approvedRes.data : []);
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //       }
// // // //     };
// // // //     fetchData();
// // // //   }, [token]);

// // // //   const handleShiftChange = (id, field, value) => {
// // // //     setShiftTimes({ ...shiftTimes, [id]: { ...shiftTimes[id], [field]: value } });
// // // //   };

// // // //   const handleApprove = async (id) => {
// // // //     const shift = shiftTimes[id];
// // // //     if (!shift || !shift.start || !shift.end) {
// // // //       alert("Enter both start & end time!");
// // // //       return;
// // // //     }
// // // //     try {
// // // //       const res = await axios.put(
// // // //         `${API_BASE}/approve/${id}`,
// // // //         { start: shift.start, end: shift.end },
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       setApprovedSubAdmins([...approvedSubAdmins, res.data]);
// // // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       alert("Approval failed");
// // // //     }
// // // //   };

// // // //   const handleReject = async (id) => {
// // // //     try {
// // // //       await axios.delete(`${API_BASE}/reject/${id}`, {
// // // //         headers: { Authorization: `Bearer ${token}` },
// // // //       });
// // // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       alert("Reject failed");
// // // //     }
// // // //   };

// // // //   const handleToggleActive = async (id) => {
// // // //     const admin = approvedSubAdmins.find((a) => a.id === id);
// // // //     const newStatus = !admin.isActive;
// // // //     try {
// // // //       const res = await axios.put(
// // // //         `${API_BASE}/toggle-active/${id}`,
// // // //         { isActive: newStatus },
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       setApprovedSubAdmins(
// // // //         approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
// // // //       );
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       alert("Status update failed");
// // // //     }
// // // //   };

// // // //   const handleShiftEdit = async (id, start, end) => {
// // // //     try {
// // // //       const res = await axios.put(
// // // //         `${API_BASE}/shift/${id}`,
// // // //         { start, end },
// // // //         { headers: { Authorization: `Bearer ${token}` } }
// // // //       );
// // // //       setApprovedSubAdmins(
// // // //         approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
// // // //       );
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       alert("Shift update failed");
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="flex h-screen bg-gray-50 p-6">
// // // //       <div className="w-full space-y-8">
// // // //         <h2 className="text-3xl font-extrabold text-gray-800">
// // // //           SubAdmin Dashboard
// // // //         </h2>

// // // //         {/* Pending Requests */}
// // // //         <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
// // // //           <h3 className="text-xl font-semibold mb-4 text-gray-700">
// // // //             Pending Requests
// // // //           </h3>
// // // //           {pendingRequests.length > 0 ? (
// // // //             <table className="w-full text-left border-collapse">
// // // //               <thead className="bg-gray-100 text-gray-600">
// // // //                 <tr>
// // // //                   <th className="p-3">Name</th>
// // // //                   <th className="p-3">Email</th>
// // // //                   <th className="p-3">Phone</th>
// // // //                   <th className="p-3 text-center">Shift Start</th>
// // // //                   <th className="p-3 text-center">Shift End</th>
// // // //                   <th className="p-3 text-center">Actions</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {pendingRequests.map((req) => (
// // // //                   <tr key={req.id} className="hover:bg-gray-50 transition">
// // // //                     <td className="p-3 font-medium">{req.username}</td>
// // // //                     <td className="p-3">{req.email}</td>
// // // //                     <td className="p-3">{req.contactnumber}</td>
// // // //                     <td className="p-3 text-center">
// // // //                       <input
// // // //                         type="time"
// // // //                         value={shiftTimes[req.id]?.start || ""}
// // // //                         onChange={(e) =>
// // // //                           handleShiftChange(req.id, "start", e.target.value)
// // // //                         }
// // // //                         className="w-32 border rounded-lg px-2 py-1"
// // // //                       />
// // // //                     </td>
// // // //                     <td className="p-3 text-center">
// // // //                       <input
// // // //                         type="time"
// // // //                         value={shiftTimes[req.id]?.end || ""}
// // // //                         onChange={(e) =>
// // // //                           handleShiftChange(req.id, "end", e.target.value)
// // // //                         }
// // // //                         className="w-32 border rounded-lg px-2 py-1"
// // // //                       />
// // // //                     </td>
// // // //                     <td className="p-3 text-center space-x-2">
// // // //                       <button
// // // //                         onClick={() => handleApprove(req.id)}
// // // //                         className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full shadow-sm flex items-center justify-center gap-1 transition"
// // // //                       >
// // // //                         <Check size={16} /> Approve
// // // //                       </button>
// // // //                       <button
// // // //                         onClick={() => handleReject(req.id)}
// // // //                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full shadow-sm flex items-center justify-center gap-1 transition"
// // // //                       >
// // // //                         <X size={16} /> Reject
// // // //                       </button>
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))}
// // // //               </tbody>
// // // //             </table>
// // // //           ) : (
// // // //             <p className="text-gray-500">No pending requests</p>
// // // //           )}
// // // //         </div>

// // // //         {/* Approved SubAdmins */}
// // // //         <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
// // // //           <h3 className="text-xl font-semibold mb-4 text-gray-700">
// // // //             Approved SubAdmins
// // // //           </h3>
// // // //           {approvedSubAdmins.length > 0 ? (
// // // //             <table className="w-full text-left border-collapse">
// // // //               <thead className="bg-gray-100 text-gray-600">
// // // //                 <tr>
// // // //                   <th className="p-3">Name</th>
// // // //                   <th className="p-3">Email</th>
// // // //                   <th className="p-3">Phone</th>
// // // //                   <th className="p-3 text-center">Shift Start</th>
// // // //                   <th className="p-3 text-center">Shift End</th>
// // // //                   <th className="p-3 text-center">Status</th>
// // // //                   <th className="p-3 text-center">Info</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody>
// // // //                 {approvedSubAdmins.map((admin) => {
// // // //                   const [start, end] = admin.shift
// // // //                     ? admin.shift.split(" - ")
// // // //                     : ["", ""];
// // // //                   return (
// // // //                     <tr key={admin.id} className="hover:bg-gray-50 transition">
// // // //                       <td className="p-3 font-medium">{admin.username}</td>
// // // //                       <td className="p-3">{admin.email}</td>
// // // //                       <td className="p-3">{admin.contactnumber}</td>
// // // //                       <td className="p-3 text-center">
// // // //                         <input
// // // //                           type="time"
// // // //                           value={start}
// // // //                           onChange={(e) =>
// // // //                             handleShiftEdit(admin.id, e.target.value, end)
// // // //                           }
// // // //                           className="w-32 border rounded-lg px-2 py-1"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3 text-center">
// // // //                         <input
// // // //                           type="time"
// // // //                           value={end}
// // // //                           onChange={(e) =>
// // // //                             handleShiftEdit(admin.id, start, e.target.value)
// // // //                           }
// // // //                           className="w-32 border rounded-lg px-2 py-1"
// // // //                         />
// // // //                       </td>
// // // //                       <td className="p-3 text-center">
// // // //                         <button
// // // //                           onClick={() => handleToggleActive(admin.id)}
// // // //                           className={`px-3 py-1 rounded-full text-white shadow-sm transition ${
// // // //                             admin.isActive
// // // //                               ? "bg-green-500 hover:bg-green-600"
// // // //                               : "bg-gray-400 hover:bg-gray-500"
// // // //                           }`}
// // // //                         >
// // // //                           {admin.isActive ? "Active" : "Inactive"}
// // // //                         </button>
// // // //                       </td>
// // // //                       <td className="p-3 text-center">
// // // //                         <button
// // // //                           onClick={() => setSelectedAdmin(admin)}
// // // //                           className="text-blue-500 hover:text-blue-700"
// // // //                         >
// // // //                           <Info className="w-5 h-5" />
// // // //                         </button>
// // // //                       </td>
// // // //                     </tr>
// // // //                   );
// // // //                 })}
// // // //               </tbody>
// // // //             </table>
// // // //           ) : (
// // // //             <p className="text-gray-500">No approved sub-admins yet</p>
// // // //           )}
// // // //         </div>

// // // //         {/* Modal */}
// // // //         {selectedAdmin && (
// // // //           <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
// // // //             <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
// // // //               <h3 className="text-xl font-bold mb-4">
// // // //                 {selectedAdmin.username} Details
// // // //               </h3>
// // // //               <div className="space-y-2 text-gray-700">
// // // //                 <p>
// // // //                   <strong>Email:</strong> {selectedAdmin.email}
// // // //                 </p>
// // // //                 <p>
// // // //                   <strong>Phone:</strong> {selectedAdmin.contactnumber}
// // // //                 </p>
// // // //                 <p>
// // // //                   <strong>Shift:</strong> {selectedAdmin.shift}
// // // //                 </p>
// // // //                 <p>
// // // //                   <strong>Status:</strong>{" "}
// // // //                   {selectedAdmin.isActive ? "Active" : "Inactive"}
// // // //                 </p>
// // // //               </div>
// // // //               <div className="mt-4 text-right">
// // // //                 <button
// // // //                   onClick={() => setSelectedAdmin(null)}
// // // //                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow-sm transition"
// // // //                 >
// // // //                   Close
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SubAdmin;
// // // import React, { useState, useEffect, useContext } from "react";
// // // import { Info } from "lucide-react";
// // // import axios from "axios";
// // // import { AuthContext } from "../../context/AuthContext";

// // // const SubAdmin = () => {
// // //   const { token } = useContext(AuthContext);
// // //   const [pendingRequests, setPendingRequests] = useState([]);
// // //   const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
// // //   const [shiftTimes, setShiftTimes] = useState({});
// // //   const [selectedAdmin, setSelectedAdmin] = useState(null);

// // //   const API_BASE = "http://localhost:5000/subadmin";

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const pendingRes = await axios.get(`${API_BASE}/pending`, {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
// // //         setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);

// // //         const approvedRes = await axios.get(`${API_BASE}/approved`, {
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         });
// // //         setApprovedSubAdmins(
// // //           Array.isArray(approvedRes.data) ? approvedRes.data : []
// // //         );
// // //       } catch (err) {
// // //         console.error(err);
// // //       }
// // //     };
// // //     fetchData();
// // //   }, [token]);

// // //   const handleShiftChange = (id, field, value) => {
// // //     setShiftTimes({
// // //       ...shiftTimes,
// // //       [id]: { ...shiftTimes[id], [field]: value },
// // //     });
// // //   };

// // //   const handleApprove = async (id) => {
// // //     const shift = shiftTimes[id];
// // //     if (!shift || !shift.start || !shift.end) {
// // //       alert("Enter both start & end time!");
// // //       return;
// // //     }
// // //     try {
// // //       const res = await axios.put(
// // //         `${API_BASE}/approve/${id}`,
// // //         { start: shift.start, end: shift.end },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       setApprovedSubAdmins([...approvedSubAdmins, res.data]);
// // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Approval failed");
// // //     }
// // //   };

// // //   const handleReject = async (id) => {
// // //     try {
// // //       await axios.delete(`${API_BASE}/reject/${id}`, {
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Reject failed");
// // //     }
// // //   };

// // //   const handleToggleActive = async (id) => {
// // //     const admin = approvedSubAdmins.find((a) => a.id === id);
// // //     const newStatus = !admin.isActive;
// // //     try {
// // //       const res = await axios.put(
// // //         `${API_BASE}/toggle-active/${id}`,
// // //         { isActive: newStatus },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       setApprovedSubAdmins(
// // //         approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
// // //       );
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Status update failed");
// // //     }
// // //   };

// // //   const handleShiftEdit = async (id, start, end) => {
// // //     try {
// // //       const res = await axios.put(
// // //         `${API_BASE}/shift/${id}`,
// // //         { start, end },
// // //         { headers: { Authorization: `Bearer ${token}` } }
// // //       );
// // //       setApprovedSubAdmins(
// // //         approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
// // //       );
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Shift update failed");
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex h-screen p-6 bg-gray-100">
// // //       <div className="w-full space-y-6">
// // //         <h2 className="text-3xl font-bold mb-4">SubAdmin Dashboard</h2>

// // //         {/* Pending Requests */}
// // //         <div className="bg-white p-4 rounded-xl shadow">
// // //           <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
// // //           {pendingRequests.length > 0 ? (
// // //             <table className="w-full border-collapse">
// // //               <thead className="bg-gray-50 text-left">
// // //                 <tr className="text-gray-700">
// // //                   <th className="p-2">Name</th>
// // //                   <th className="p-2">Email</th>
// // //                   <th className="p-2">Phone</th>
// // //                   <th className="p-2">Shift Start</th>
// // //                   <th className="p-2">Shift End</th>
// // //                   <th className="p-2 text-center">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {pendingRequests.map((req) => (
// // //                   <tr key={req.id} className="border-b hover:bg-gray-50">
// // //                     <td className="p-2">{req.username}</td>
// // //                     <td className="p-2">{req.email}</td>
// // //                     <td className="p-2">{req.contactnumber}</td>
// // //                     <td className="p-2">
// // //                       <input
// // //                         type="time"
// // //                         value={shiftTimes[req.id]?.start || ""}
// // //                         onChange={(e) =>
// // //                           handleShiftChange(req.id, "start", e.target.value)
// // //                         }
// // //                         className="w-32 border rounded px-2 py-1"
// // //                       />
// // //                     </td>
// // //                     <td className="p-2">
// // //                       <input
// // //                         type="time"
// // //                         value={shiftTimes[req.id]?.end || ""}
// // //                         onChange={(e) =>
// // //                           handleShiftChange(req.id, "end", e.target.value)
// // //                         }
// // //                         className="w-32 border rounded px-2 py-1"
// // //                       />
// // //                     </td>
// // //                     <td className="p-2">
// // //                       <div className="flex justify-center gap-3">
// // //                         <button
// // //                           onClick={() => handleApprove(req.id)}
// // //                           className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg shadow transition"
// // //                         >
// // //                           Approve
// // //                         </button>
// // //                         <button
// // //                           onClick={() => handleReject(req.id)}
// // //                           className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow transition"
// // //                         >
// // //                           Reject
// // //                         </button>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           ) : (
// // //             <p className="text-gray-500">No pending requests</p>
// // //           )}
// // //         </div>

// // //         {/* Approved SubAdmins */}
// // //         <div className="bg-white p-4 rounded-xl shadow">
// // //           <h3 className="text-xl font-semibold mb-4">Approved SubAdmins</h3>
// // //           {approvedSubAdmins.length > 0 ? (
// // //             <table className="w-full border-collapse">
// // //               <thead className="bg-gray-50 text-left">
// // //                 <tr className="text-gray-700">
// // //                   <th className="p-2">Name</th>
// // //                   <th className="p-2">Email</th>
// // //                   <th className="p-2">Phone</th>
// // //                   <th className="p-2">Shift Start</th>
// // //                   <th className="p-2">Shift End</th>
// // //                   <th className="p-2">Status</th>
// // //                   <th className="p-2 text-center">Info</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {approvedSubAdmins.map((admin) => {
// // //                   const [start, end] = admin.shift
// // //                     ? admin.shift.split(" - ")
// // //                     : ["", ""];
// // //                   return (
// // //                     <tr key={admin.id} className="border-b hover:bg-gray-50">
// // //                       <td className="p-2">{admin.username}</td>
// // //                       <td className="p-2">{admin.email}</td>
// // //                       <td className="p-2">{admin.contactnumber}</td>
// // //                       <td className="p-2">
// // //                         <input
// // //                           type="time"
// // //                           value={start}
// // //                           onChange={(e) =>
// // //                             handleShiftEdit(admin.id, e.target.value, end)
// // //                           }
// // //                           className="w-32 border rounded px-2 py-1"
// // //                         />
// // //                       </td>
// // //                       <td className="p-2">
// // //                         <input
// // //                           type="time"
// // //                           value={end}
// // //                           onChange={(e) =>
// // //                             handleShiftEdit(admin.id, start, e.target.value)
// // //                           }
// // //                           className="w-32 border rounded px-2 py-1"
// // //                         />
// // //                       </td>
// // //                       <td className="p-2">
// // //                         <button
// // //                           onClick={() => handleToggleActive(admin.id)}
// // //                           className={`px-3 py-1 rounded text-white ${
// // //                             admin.isActive ? "bg-green-500" : "bg-gray-500"
// // //                           }`}
// // //                         >
// // //                           {admin.isActive ? "Active" : "Inactive"}
// // //                         </button>
// // //                       </td>
// // //                       <td className="p-2 text-center">
// // //                         <button
// // //                           onClick={() => setSelectedAdmin(admin)}
// // //                           className="text-blue-500 hover:text-blue-700"
// // //                         >
// // //                           <Info />
// // //                         </button>
// // //                       </td>
// // //                     </tr>
// // //                   );
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           ) : (
// // //             <p className="text-gray-500">No approved sub-admins yet</p>
// // //           )}
// // //         </div>

// // //         {/* Modal */}
// // //         {selectedAdmin && (
// // //           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
// // //             <div className="bg-white p-6 rounded-xl shadow-lg w-96">
// // //               <h3 className="text-xl font-bold mb-4">
// // //                 {selectedAdmin.username} Details
// // //               </h3>
// // //               <p>
// // //                 <strong>Email:</strong> {selectedAdmin.email}
// // //               </p>
// // //               <p>
// // //                 <strong>Phone:</strong> {selectedAdmin.contactnumber}
// // //               </p>
// // //               <p>
// // //                 <strong>Shift:</strong> {selectedAdmin.shift}
// // //               </p>
// // //               <p>
// // //                 <strong>Status:</strong>{" "}
// // //                 {selectedAdmin.isActive ? "Active" : "Inactive"}
// // //               </p>
// // //               <div className="mt-4 text-right">
// // //                 <button
// // //                   onClick={() => setSelectedAdmin(null)}
// // //                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
// // //                 >
// // //                   Close
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SubAdmin;
// // import React, { useState, useEffect, useContext } from "react";
// // import { Info } from "lucide-react";
// // import axios from "axios";
// // import { AuthContext } from "../../context/AuthContext";

// // const SubAdmin = () => {
// //   const { token } = useContext(AuthContext);
// //   const [pendingRequests, setPendingRequests] = useState([]);
// //   const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
// //   const [shiftTimes, setShiftTimes] = useState({});
// //   const [selectedAdmin, setSelectedAdmin] = useState(null);

// //   const API_BASE = "http://localhost:5000/subadmin";

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const pendingRes = await axios.get(`${API_BASE}/pending`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);

// //         const approvedRes = await axios.get(`${API_BASE}/approved`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setApprovedSubAdmins(
// //           Array.isArray(approvedRes.data) ? approvedRes.data : []
// //         );
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };
// //     fetchData();
// //   }, [token]);

// //   const handleShiftChange = (id, field, value) => {
// //     setShiftTimes({
// //       ...shiftTimes,
// //       [id]: { ...shiftTimes[id], [field]: value },
// //     });
// //   };

// //   const handleApprove = async (id) => {
// //     const shift = shiftTimes[id];
// //     if (!shift || !shift.start || !shift.end) {
// //       alert("Enter both start & end time!");
// //       return;
// //     }
// //     try {
// //       const res = await axios.put(
// //         `${API_BASE}/approve/${id}`,
// //         { start: shift.start, end: shift.end },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setApprovedSubAdmins([...approvedSubAdmins, res.data]);
// //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// //     } catch (err) {
// //       console.error(err);
// //       alert("Approval failed");
// //     }
// //   };

// //   const handleReject = async (id) => {
// //     try {
// //       await axios.delete(`${API_BASE}/reject/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
// //     } catch (err) {
// //       console.error(err);
// //       alert("Reject failed");
// //     }
// //   };

// //   const handleToggleActive = async (id) => {
// //     const admin = approvedSubAdmins.find((a) => a.id === id);
// //     const newStatus = !admin.isActive;
// //     try {
// //       const res = await axios.put(
// //         `${API_BASE}/toggle-active/${id}`,
// //         { isActive: newStatus },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setApprovedSubAdmins(
// //         approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
// //       );
// //     } catch (err) {
// //       console.error(err);
// //       alert("Status update failed");
// //     }
// //   };

// //   const handleShiftEdit = async (id, start, end) => {
// //     try {
// //       const res = await axios.put(
// //         `${API_BASE}/shift/${id}`,
// //         { start, end },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setApprovedSubAdmins(
// //         approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
// //       );
// //     } catch (err) {
// //       console.error(err);
// //       alert("Shift update failed");
// //     }
// //   };

// //   return (
// //     <div className="flex h-screen p-6 bg-gray-100">
// //       <div className="w-full space-y-6">
// //         <h2 className="text-3xl font-bold mb-4">SubAdmin Dashboard</h2>

// //         {/* Pending Requests */}
// //         <div className="bg-white p-4 rounded-xl shadow">
// //           <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
// //           {pendingRequests.length > 0 ? (
// //             <table className="w-full border-collapse">
// //               <thead className="bg-gray-50 text-left">
// //                 <tr className="text-gray-700">
// //                   <th className="p-2">Name</th>
// //                   <th className="p-2">Email</th>
// //                   <th className="p-2">Phone</th>
// //                   <th className="p-2">Shift Start</th>
// //                   <th className="p-2">Shift End</th>
// //                   <th className="p-2 text-center">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {pendingRequests.map((req) => (
// //                   <tr
// //                     key={req.id}
// //                     className="hover:bg-gray-50 transition rounded-lg"
// //                   >
// //                     <td className="p-2">{req.username}</td>
// //                     <td className="p-2">{req.email}</td>
// //                     <td className="p-2">{req.contactnumber}</td>
// //                     <td className="p-2">
// //                       <input
// //                         type="time"
// //                         value={shiftTimes[req.id]?.start || ""}
// //                         onChange={(e) =>
// //                           handleShiftChange(req.id, "start", e.target.value)
// //                         }
// //                         className="w-32 border rounded px-2 py-1"
// //                       />
// //                     </td>
// //                     <td className="p-2">
// //                       <input
// //                         type="time"
// //                         value={shiftTimes[req.id]?.end || ""}
// //                         onChange={(e) =>
// //                           handleShiftChange(req.id, "end", e.target.value)
// //                         }
// //                         className="w-32 border rounded px-2 py-1"
// //                       />
// //                     </td>
// //                     <td className="p-2">
// //                       <div className="flex justify-center gap-3">
// //                         <button
// //                           onClick={() => handleApprove(req.id)}
// //                           className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg shadow transition"
// //                         >
// //                           Approve
// //                         </button>
// //                         <button
// //                           onClick={() => handleReject(req.id)}
// //                           className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow transition"
// //                         >
// //                           Reject
// //                         </button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           ) : (
// //             <p className="text-gray-500">No pending requests</p>
// //           )}
// //         </div>

// //         {/* Approved SubAdmins */}
// //         <div className="bg-white p-4 rounded-xl shadow">
// //           <h3 className="text-xl font-semibold mb-4">Approved SubAdmins</h3>
// //           {approvedSubAdmins.length > 0 ? (
// //             <table className="w-full border-collapse">
// //               <thead className="bg-gray-50 text-left">
// //                 <tr className="text-gray-700">
// //                   <th className="p-2">Name</th>
// //                   <th className="p-2">Email</th>
// //                   <th className="p-2">Phone</th>
// //                   <th className="p-2">Shift Start</th>
// //                   <th className="p-2">Shift End</th>
// //                   <th className="p-2">Status</th>
// //                   <th className="p-2 text-center">Info</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {approvedSubAdmins.map((admin) => {
// //                   const [start, end] = admin.shift
// //                     ? admin.shift.split(" - ")
// //                     : ["", ""];
// //                   return (
// //                     <tr
// //                       key={admin.id}
// //                       className="hover:bg-gray-50 transition rounded-lg"
// //                     >
// //                       <td className="p-2">{admin.username}</td>
// //                       <td className="p-2">{admin.email}</td>
// //                       <td className="p-2">{admin.contactnumber}</td>
// //                       <td className="p-2">
// //                         <input
// //                           type="time"
// //                           value={start}
// //                           onChange={(e) =>
// //                             handleShiftEdit(admin.id, e.target.value, end)
// //                           }
// //                           className="w-32 border rounded px-2 py-1"
// //                         />
// //                       </td>
// //                       <td className="p-2">
// //                         <input
// //                           type="time"
// //                           value={end}
// //                           onChange={(e) =>
// //                             handleShiftEdit(admin.id, start, e.target.value)
// //                           }
// //                           className="w-32 border rounded px-2 py-1"
// //                         />
// //                       </td>
// //                       <td className="p-2">
// //                         <button
// //                           onClick={() => handleToggleActive(admin.id)}
// //                           className={`px-3 py-1 rounded text-white ${
// //                             admin.isActive ? "bg-green-500" : "bg-gray-500"
// //                           }`}
// //                         >
// //                           {admin.isActive ? "Active" : "Inactive"}
// //                         </button>
// //                       </td>
// //                       <td className="p-2 text-center">
// //                         <button
// //                           onClick={() => setSelectedAdmin(admin)}
// //                           className="text-blue-500 hover:text-blue-700"
// //                         >
// //                           <Info />
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           ) : (
// //             <p className="text-gray-500">No approved sub-admins yet</p>
// //           )}
// //         </div>

// //         {/* Modal */}
// //         {selectedAdmin && (
// //           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
// //             <div className="bg-white p-6 rounded-xl shadow-lg w-96">
// //               <h3 className="text-xl font-bold mb-4">
// //                 {selectedAdmin.username} Details
// //               </h3>
// //               <p>
// //                 <strong>Email:</strong> {selectedAdmin.email}
// //               </p>
// //               <p>
// //                 <strong>Phone:</strong> {selectedAdmin.contactnumber}
// //               </p>
// //               <p>
// //                 <strong>Shift:</strong> {selectedAdmin.shift}
// //               </p>
// //               <p>
// //                 <strong>Status:</strong>{" "}
// //                 {selectedAdmin.isActive ? "Active" : "Inactive"}
// //               </p>
// //               <div className="mt-4 text-right">
// //                 <button
// //                   onClick={() => setSelectedAdmin(null)}
// //                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
// //                 >
// //                   Close
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SubAdmin;
// import React, { useState, useEffect, useContext } from "react";
// import { Info } from "lucide-react";
// import axios from "axios";
// import { AuthContext } from "../../context/AuthContext";

// const SubAdmin = () => {
//   const { token } = useContext(AuthContext);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
//   const [shiftTimes, setShiftTimes] = useState({});
//   const [selectedAdmin, setSelectedAdmin] = useState(null);

//   const API_BASE = "http://localhost:5000/subadmin";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const pendingRes = await axios.get(`${API_BASE}/pending`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);

//         const approvedRes = await axios.get(`${API_BASE}/approved`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setApprovedSubAdmins(Array.isArray(approvedRes.data) ? approvedRes.data : []);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, [token]);

//   const handleShiftChange = (id, field, value) => {
//     setShiftTimes({ ...shiftTimes, [id]: { ...shiftTimes[id], [field]: value } });
//   };

//   const handleApprove = async (id) => {
//     const shift = shiftTimes[id];
//     if (!shift || !shift.start || !shift.end) {
//       alert("Enter both start & end time!");
//       return;
//     }
//     try {
//       const res = await axios.put(
//         `${API_BASE}/approve/${id}`,
//         { start: shift.start, end: shift.end },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApprovedSubAdmins([...approvedSubAdmins, res.data]);
//       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Approval failed");
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       await axios.delete(`${API_BASE}/reject/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPendingRequests(pendingRequests.filter((req) => req.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Reject failed");
//     }
//   };

//   const handleToggleActive = async (id) => {
//     const admin = approvedSubAdmins.find((a) => a.id === id);
//     const newStatus = !admin.isActive;
//     try {
//       const res = await axios.put(
//         `${API_BASE}/toggle-active/${id}`,
//         { isActive: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApprovedSubAdmins(
//         approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Status update failed");
//     }
//   };

//   return (
//     <div className="flex h-screen p-6">
//       <div className="w-full space-y-6">
//         <h2 className="text-3xl font-bold mb-4">SubAdmin Dashboard</h2>

//         {/* Pending Requests */}
//         <div className="bg-white p-4 rounded-xl shadow">
//           <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
//           {pendingRequests.length > 0 ? (
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Shift Start</th>
//                   <th>Shift End</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingRequests.map((req) => (
//                   <tr key={req.id} className="hover:bg-gray-50">
//                     <td>{req.username}</td>
//                     <td>{req.email}</td>
//                     <td>{req.contactnumber}</td>
//                     <td>
//                       <input
//                         type="time"
//                         value={shiftTimes[req.id]?.start || ""}
//                         onChange={(e) =>
//                           handleShiftChange(req.id, "start", e.target.value)
//                         }
//                         className="w-32 border rounded p-1"
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="time"
//                         value={shiftTimes[req.id]?.end || ""}
//                         onChange={(e) =>
//                           handleShiftChange(req.id, "end", e.target.value)
//                         }
//                         className="w-32 border rounded p-1"
//                       />
//                     </td>
//                     <td className="flex gap-2">
//                       <button
//                         onClick={() => handleApprove(req.id)}
//                         className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                       >
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => handleReject(req.id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                       >
//                         Reject
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No pending requests</p>
//           )}
//         </div>

//         {/* Approved SubAdmins */}
//         <div className="bg-white p-4 rounded-xl shadow">
//           <h3 className="text-xl font-semibold mb-4">Approved SubAdmins</h3>
//           {approvedSubAdmins.length > 0 ? (
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Status</th>
//                   <th>Info</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {approvedSubAdmins.map((admin) => (
//                   <tr key={admin.id} className="hover:bg-gray-50">
//                     <td>{admin.username}</td>
//                     <td>{admin.email}</td>
//                     <td>{admin.contactnumber}</td>
//                     <td>
//                       <button
//                         onClick={() => handleToggleActive(admin.id)}
//                         className={`px-3 py-1 rounded text-white ${
//                           admin.isActive ? "bg-green-500" : "bg-gray-500"
//                         }`}
//                       >
//                         {admin.isActive ? "Active" : "Inactive"}
//                       </button>
//                     </td>
//                     <td>
//                       <button
//                         onClick={() => setSelectedAdmin(admin)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <Info />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No approved sub-admins yet</p>
//           )}
//         </div>

//         {/* Modal */}
//         {selectedAdmin && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-xl shadow-lg w-96">
//               <h3 className="text-xl font-bold mb-4">
//                 {selectedAdmin.username} Details
//               </h3>
//               <p>
//                 <strong>Email:</strong> {selectedAdmin.email}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {selectedAdmin.contactnumber}
//               </p>
//               <p>
//                 <strong>Shift Start:</strong>{" "}
//                 {selectedAdmin.shift?.split(" - ")[0] || "N/A"}
//               </p>
//               <p>
//                 <strong>Shift End:</strong>{" "}
//                 {selectedAdmin.shift?.split(" - ")[1] || "N/A"}
//               </p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 {selectedAdmin.isActive ? "Active" : "Inactive"}
//               </p>
//               <div className="mt-4 text-right">
//                 <button
//                   onClick={() => setSelectedAdmin(null)}
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubAdmin;
import React, { useState, useEffect, useContext } from "react";
import { Info } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const SubAdmin = () => {
  const { token } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedSubAdmins, setApprovedSubAdmins] = useState([]);
  const [shiftTimes, setShiftTimes] = useState({});
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const API_BASE = "http://localhost:5000/subadmin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pendingRes = await axios.get(`${API_BASE}/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingRequests(Array.isArray(pendingRes.data) ? pendingRes.data : []);

        const approvedRes = await axios.get(`${API_BASE}/approved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovedSubAdmins(Array.isArray(approvedRes.data) ? approvedRes.data : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const handleShiftChange = (id, field, value) => {
    setShiftTimes({ ...shiftTimes, [id]: { ...shiftTimes[id], [field]: value } });
  };

  const handleApprove = async (id) => {
    const shift = shiftTimes[id];
    if (!shift || !shift.start || !shift.end) {
      alert("Enter both start & end time!");
      return;
    }
    try {
      const res = await axios.put(
        `${API_BASE}/approve/${id}`,
        { start: shift.start, end: shift.end },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApprovedSubAdmins([...approvedSubAdmins, res.data]);
      setPendingRequests(pendingRequests.filter((req) => req.id !== id));
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`${API_BASE}/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests(pendingRequests.filter((req) => req.id !== id));
    } catch (err) {
      console.error(err);
      alert("Reject failed");
    }
  };

  const handleToggleActive = async (id) => {
    const admin = approvedSubAdmins.find((a) => a.id === id);
    const newStatus = !admin.isActive;
    try {
      const res = await axios.put(
        `${API_BASE}/toggle-active/${id}`,
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApprovedSubAdmins(
        approvedSubAdmins.map((a) => (a.id === id ? res.data : a))
      );
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 p-6 overflow-y-auto">
      <div className="w-full space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">SubAdmin Dashboard</h2>

        {/* Pending Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Pending Requests</h3>
          {pendingRequests.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Shift Start</th>
                  <th className="p-3 text-left">Shift End</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{req.username}</td>
                    <td className="p-3">{req.email}</td>
                    <td className="p-3">{req.contactnumber}</td>
                    <td className="p-3">
                      <input
                        type="time"
                        value={shiftTimes[req.id]?.start || ""}
                        onChange={(e) => handleShiftChange(req.id, "start", e.target.value)}
                        className="w-32 p-2 border rounded-lg"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="time"
                        value={shiftTimes[req.id]?.end || ""}
                        onChange={(e) => handleShiftChange(req.id, "end", e.target.value)}
                        className="w-32 p-2 border rounded-lg"
                      />
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg shadow"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No pending requests</p>
          )}
        </div>

        {/* Approved SubAdmins */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Approved SubAdmins</h3>
          {approvedSubAdmins.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Info</th>
                </tr>
              </thead>
              <tbody>
                {approvedSubAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{admin.username}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">{admin.contactnumber}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleActive(admin.id)}
                        className={`px-4 py-1 rounded-lg shadow text-white transition ${
                          admin.isActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Info />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No approved sub-admins yet</p>
          )}
        </div>

        {/* Info Modal */}
        {selectedAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedAdmin.username} Details
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> {selectedAdmin.email}</p>
                <p><strong>Phone:</strong> {selectedAdmin.contactnumber}</p>
                <p><strong>Shift Start:</strong> {selectedAdmin.shift?.split(" - ")[0] || "N/A"}</p>
                <p><strong>Shift End:</strong> {selectedAdmin.shift?.split(" - ")[1] || "N/A"}</p>
                <p><strong>Status:</strong> {selectedAdmin.isActive ? "Active" : "Inactive"}</p>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubAdmin;
