// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// import axios from "axios";

// export default function AppointmentPage() {
//   const [humanAppointments, setHumanAppointments] = useState([]);
//   const [aiAppointments, setAiAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     age: "",
//     address: "",
//     time: "",
//     disease: "",
//     doctor_id: "",
//   });

//   // Fetch doctors from backend
//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/doctors")
//       .then((res) => setDoctors(res.data))
//       .catch((err) => console.error("Error fetching doctors:", err));
//   }, []);

//   // Fetch appointments (human and AI)
//   useEffect(() => {
//     axios
//       .get("http://localhost:8000/appointments/human")
//       .then((res) => setHumanAppointments(res.data))
//       .catch((err) => console.error("Error fetching human appointments:", err));

//     axios
//       .get("http://localhost:8000/appointments/AI")
//       .then((res) => setAiAppointments(res.data))
//       .catch((err) => console.error("Error fetching AI appointments:", err));
//   }, []);

//   // Form input handler
//  const handleInputChange = (e) => {
//   let { name, value } = e.target;

//   if (name === "time") {
//     let date = new Date(value);
//     let minutes = date.getMinutes();
//     date.setSeconds(0, 0);

//     // Round to nearest 30 min
//     if (minutes < 15) date.setMinutes(0);
//     else if (minutes < 45) date.setMinutes(30);
//     else {
//       date.setHours(date.getHours() + 1);
//       date.setMinutes(0);
//     }

//     value = date.toISOString().slice(0, 16); // format for datetime-local
//   }

//   setForm((prev) => ({ ...prev, [name]: value }));
// };


//   // Add new human appointment
//  const handleAddAppointment = async (e) => {
//   e.preventDefault();
//   const { name, age, address, time, disease, doctor_id } = form;

//   if (!name || !age || !address || !time || !disease || !doctor_id) {
//     alert("Please fill all fields");
//     return;
//   }

//   try {
//     const payload = { ...form, type: "human", appointment_time: form.time };
//     const res = await axios.post("http://localhost:8000/appointments/", payload);

//     // 👉 Sirf appointment object push karo
//     setHumanAppointments((prev) => [...prev, res.data.appointment]);

//     setForm({ name: "", age: "", address: "", time: "", disease: "", doctor_id: "" });
//     setShowForm(false);
//   } catch (err) {
//     console.error("Error booking appointment:", err);
//     alert("Failed to book appointment");
//   }
// };


//   const combinedAppointments = [...humanAppointments, ...aiAppointments].sort(
//     (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Navbar />

//         <div className="flex-1 p-6">
//           <h1 className="text-3xl font-bold mb-6 text-center">Appointment Page</h1>

//           <div className="mx-auto bg-white p-6 rounded shadow">
//             <button
//               onClick={() => setShowForm((prev) => !prev)}
//               className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               {showForm ? "Cancel" : "Add Appointment"}
//             </button>

//             {showForm && (
//               <form onSubmit={handleAddAppointment} className="space-y-6 mb-6">
//                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
//                   <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
//                     Add Human Appointment
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block font-medium mb-1">Name</label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={form.name}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         placeholder="Enter name"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-medium mb-1">Age</label>
//                       <input
//                         type="number"
//                         name="age"
//                         value={form.age}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         min="0"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block font-medium mb-1">Address</label>
//                       <input
//                         type="text"
//                         name="address"
//                         value={form.address}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         placeholder="Enter address"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-medium mb-1">Appointment Time</label>
//                       <input
//                         type="datetime-local"
//                         name="time"
//                         value={form.time}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block font-medium mb-1">Disease</label>
//                       <input
//                         type="text"
//                         name="disease"
//                         value={form.disease}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         placeholder="Enter disease"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block font-medium mb-1">Doctor</label>
//                       <select
//                         name="doctor_id"
//                         value={form.doctor_id}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                         required
//                       >
//                         <option value="">Select Doctor</option>
//                         {doctors.map((doc) => (
//                           <option key={doc._id} value={doc._id}>
//                             {doc.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <button
//                       type="submit"
//                       className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                     >
//                       Book Appointment
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             )}

//             <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>
//             {combinedAppointments.length === 0 ? (
//               <p className="text-gray-600">No appointments booked yet.</p>
//             ) : (
//               <table className="w-full border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="border border-gray-300 px-3 py-2">Type</th>
//                     <th className="border border-gray-300 px-3 py-2">Name</th>
//                     <th className="border border-gray-300 px-3 py-2">Age</th>
//                     <th className="border border-gray-300 px-3 py-2">Address</th>
//                     <th className="border border-gray-300 px-3 py-2">Appointment Time</th>
//                     <th className="border border-gray-300 px-3 py-2">Disease</th>
//                     <th className="border border-gray-300 px-3 py-2">Doctor</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {combinedAppointments.map((appt) => (
//                     <tr key={appt._id} className="hover:bg-gray-100">
//                       <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
//                         {appt.type}
//                       </td>
//                       <td className="border border-gray-300 px-3 py-2">{appt.name}</td>
//                       <td className="border border-gray-300 px-3 py-2 text-center">{appt.age}</td>
//                       <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
//                       <td className="border border-gray-300 px-3 py-2">
//                         {new Date(appt.appointment_time).toLocaleString()}
//                       </td>
//                       <td className="border border-gray-300 px-3 py-2">{appt.disease}</td>
//                       <td className="border border-gray-300 px-3 py-2">
//                         {doctors.find((d) => d._id === appt.doctor_id)?.name || "N/A"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/screens/Appointment.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../screens/Sidebar";
import Navbar from "../screens/Navbar";

export default function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [humanAppointments, setHumanAppointments] = useState([]);
  const [aiAppointments, setAiAppointments] = useState([]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    appointment_time: "",
    disease: "",
    doctor_id: "",
    type: "human",
  });

  // doctors aur appointments fetch karna
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await axios.get("http://localhost:8000/doctors/");
        setDoctors(doctorRes.data);

        const appointmentRes = await axios.get(
          "http://localhost:8000/appointments/"
        );

        const human = appointmentRes.data.filter((a) => a.type === "human");
        const ai = appointmentRes.data.filter((a) => a.type === "ai");

        setHumanAppointments(human);
        setAiAppointments(ai);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  // input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // appointment book karna
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/appointments/", form);

      if (form.type === "human") {
        setHumanAppointments((prev) => [...prev, res.data.appointment]);
      } else {
        setAiAppointments((prev) => [...prev, res.data.appointment]);
      }

      alert(res.data.msg);

      // form reset
      setForm({
        name: "",
        age: "",
        address: "",
        appointment_time: "",
        disease: "",
        doctor_id: "",
        type: "human",
      });
    } catch (err) {
      alert("Error booking appointment: " + err.response?.data?.detail);
    }
  };

  // merge + sort appointments
  const combinedAppointments = [...humanAppointments, ...aiAppointments].sort(
    (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

          {/* Appointment Form */}
          <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Patient Name"
              required
              className="border p-2 w-full"
            />
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="border p-2 w-full"
            />
            <input
              type="datetime-local"
              name="appointment_time"
              value={form.appointment_time}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />
            <input
              type="text"
              name="disease"
              value={form.disease}
              onChange={handleChange}
              placeholder="Disease"
              required
              className="border p-2 w-full"
            />
            <select
              name="doctor_id"
              value={form.doctor_id}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="human">Human</option>
              <option value="ai">AI</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Book Appointment
            </button>
          </form>

          {/* Appointment Table */}
          <h2 className="text-xl font-semibold mt-6">Appointments</h2>
          <table className="w-full border mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Disease</th>
                <th className="border p-2">Doctor</th>
                <th className="border p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {combinedAppointments.map((appt) => (
                <tr key={appt._id}>
                  <td className="border p-2">{appt.name}</td>
                  <td className="border p-2">{appt.age}</td>
                  <td className="border p-2">{appt.address}</td>
                  <td className="border p-2">
                    {new Date(appt.appointment_time).toLocaleString()}
                  </td>
                  <td className="border p-2">{appt.disease}</td>
                  <td className="border p-2">
                    {doctors.find((d) => d._id === appt.doctor_id)?.name ||
                      "Unknown"}
                  </td>
                  <td className="border p-2">{appt.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
