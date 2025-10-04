
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import Sidebar from '../../components/Sidebar'; // Import your Sidebar
// // import Navbar from '../../components/Navbar';

// // export default function Appointment() {
// //   const [doctors, setDoctors] = useState([]);
// //   const [humanAppointments, setHumanAppointments] = useState([]);
// //   const [aiAppointments, setAiAppointments] = useState([]);

// //  const [form, setForm] = useState({
// //   name: "",
// //   age: "",
// //   address: "",
// //   appointment_time: "",
// //   disease: "",
// //   doctor_id: "",
// //   type: "human",  // keep human/AI only
// // });


// //   // doctors aur appointments fetch karna
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const doctorRes = await axios.get("http://localhost:5000/doctors/");
// //         setDoctors(doctorRes.data);

// //         const appointmentRes = await axios.get(
// //           "http://localhost:5000/appointments/"
// //         );

// //         const human = appointmentRes.data.filter((a) => a.type === "human");
// //         const ai = appointmentRes.data.filter((a) => a.type === "ai");

// //         setHumanAppointments(human);
// //         setAiAppointments(ai);
// //       }catch (err) {
// //   let errorMsg = "Unknown error";
// //   if (err.response?.data?.detail) {
// //     if (Array.isArray(err.response.data.detail)) {
// //       errorMsg = err.response.data.detail[0]?.msg || JSON.stringify(err.response.data.detail);
// //     } else {
// //       errorMsg = err.response.data.detail;
// //     }
// //   }
// //   alert("Error booking appointment: " + errorMsg);
// // }

// //     };
// //     fetchData();
// //   }, []);

// //   // input change
// //   const handleChange = (e) => {
// //     setForm({
// //       ...form,
// //       [e.target.name]: e.target.value,
// //     });
// //   };

// //   // appointment book karna
// //  const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   try {
// //     const res = await axios.post("http://localhost:5000/appointments/", form);

// //     if (form.type === "human") {
// //       setHumanAppointments((prev) => [...prev, res.data.appointment]);
// //     } else {
// //       setAiAppointments((prev) => [...prev, res.data.appointment]);
// //     }

// //     alert(res.data.msg);

// //     // reset form
// //     setForm({
// //       name: "",
// //       age: "",
// //       address: "",
// //       appointment_time: "",
// //       disease: "",
// //       doctor_id: "",
// //       type: "human",
// //     });
// //   } catch (err) {
// //     let errorMsg = "Unknown error";
// //     if (err.response?.data?.detail) {
// //       if (Array.isArray(err.response.data.detail)) {
// //         errorMsg = err.response.data.detail[0]?.msg || JSON.stringify(err.response.data.detail);
// //       } else {
// //         errorMsg = err.response.data.detail;
// //       }
// //     }
// //     alert("Error booking appointment: " + errorMsg);
// //   }
// // };


// //   // merge + sort appointments
// //   const combinedAppointments = [...humanAppointments, ...aiAppointments].sort(
// //     (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
// //   );

// //   return (
// //     <div className="flex">
     
      
// //         <div className="p-6">
// //           <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

// //           {/* Appointment Form */}
// //           <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
// //             <input
// //               type="text"
// //               name="name"
// //               value={form.name}
// //               onChange={handleChange}
// //               placeholder="Patient Name"
// //               required
// //               className="border p-2 w-full"
// //             />
// //             <input
// //               type="number"
// //               name="age"
// //               value={form.age}
// //               onChange={handleChange}
// //               placeholder="Age"
// //               required
// //               className="border p-2 w-full"
// //             />
// //             <input
// //               type="text"
// //               name="address"
// //               value={form.address}
// //               onChange={handleChange}
// //               placeholder="Address"
// //               required
// //               className="border p-2 w-full"
// //             />
// //             <input
// //               type="datetime-local"
// //               name="appointment_time"
// //               value={form.appointment_time}
// //               onChange={handleChange}
// //               required
// //               className="border p-2 w-full"
// //             />
// //             <input
// //               type="text"
// //               name="disease"
// //               value={form.disease}
// //               onChange={handleChange}
// //               placeholder="Disease"
// //               required
// //               className="border p-2 w-full"
// //             />
// //             <select
// //               name="doctor_id"
// //               value={form.doctor_id}
// //               onChange={handleChange}
// //               required
// //               className="border p-2 w-full"
// //             >
// //               <option value="">Select Doctor</option>
// //               {doctors.map((doc) => (
// //                 <option key={doc._id} value={doc._id}>
// //                   {doc.name} ({doc.specialization})
// //                 </option>
// //               ))}
// //             </select>
// //             <select
// //               name="type"
// //               value={form.type}
// //               onChange={handleChange}
// //               className="border p-2 w-full"
// //             >
// //               <option value="human">Human</option>
// //               <option value="ai">AI</option>
// //             </select>
// //             <button
// //               type="submit"
// //               className="bg-blue-600 text-white px-4 py-2 rounded"
// //             >
// //               Book Appointment
// //             </button>
// //           </form>

// //           {/* Appointment Table */}
// //           <h2 className="text-xl font-semibold mt-6">Appointments</h2>
// //           <table className="w-full border mt-2">
// //             <thead>
// //               <tr className="bg-gray-100">
// //                 <th className="border p-2">Name</th>
// //                 <th className="border p-2">Age</th>
// //                 <th className="border p-2">Address</th>
// //                 <th className="border p-2">Time</th>
// //                 <th className="border p-2">Disease</th>
// //                 <th className="border p-2">Doctor</th>
// //                 <th className="border p-2">Type</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {combinedAppointments.map((appt) => (
// //                 <tr key={appt._id}>
// //                   <td className="border p-2">{appt.name}</td>
// //                   <td className="border p-2">{appt.age}</td>
// //                   <td className="border p-2">{appt.address}</td>
// //                   <td className="border p-2">
// //                     {new Date(appt.appointment_time).toLocaleString()}
// //                   </td>
// //                   <td className="border p-2">{appt.disease}</td>
// //                   <td className="border p-2">
// //                     {doctors.find((d) => d._id === appt.doctor_id)?.name ||
// //                       "Unknown"}
// //                   </td>
// //                   <td className="border p-2">{appt.type}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
 
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import axios from "axios";


// export default function Appointment() {
//   const [doctors, setDoctors] = useState([]);
//   const [humanAppointments, setHumanAppointments] = useState([]);
//   const [aiAppointments, setAiAppointments] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     age: "",
//     address: "",
//     appointment_time: "",
//     disease: "",
//     doctor_id: "",
//     type: "human",  // human or ai
//   });

//   // ---------------- Fetch doctors and appointments ----------------
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const doctorRes = await axios.get("http://localhost:5000/doctors/");
//         setDoctors(doctorRes.data);

//         const appointmentRes = await axios.get("http://localhost:5000/appointments/");

//         // Normalize types to lowercase
//         const human = appointmentRes.data.filter((a) => a.type?.toLowerCase() === "human");
//         const ai = appointmentRes.data.filter((a) => a.type?.toLowerCase() === "ai");

//         setHumanAppointments(human);
//         setAiAppointments(ai);
//       } catch (err) {
//         let errorMsg = "Unknown error";
//         if (err.response?.data?.detail) {
//           if (Array.isArray(err.response.data.detail)) {
//             errorMsg = err.response.data.detail[0]?.msg || JSON.stringify(err.response.data.detail);
//           } else {
//             errorMsg = err.response.data.detail;
//           }
//         }
//         alert("Error fetching data: " + errorMsg);
//       }
//     };
//     fetchData();
//   }, []);

//   // ---------------- Handle input change ----------------
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ---------------- Handle appointment booking ----------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/appointments/", form);

//       // Append to state
//       if (form.type.toLowerCase() === "human") {
//         setHumanAppointments((prev) => [...prev, res.data.appointment]);
//       } else {
//         setAiAppointments((prev) => [...prev, res.data.appointment]);
//       }

//       alert(res.data.msg);

//       // Reset form
//       setForm({
//         name: "",
//         age: "",
//         address: "",
//         appointment_time: "",
//         disease: "",
//         doctor_id: "",
//         type: "human",
//       });
//     } catch (err) {
//       let errorMsg = "Unknown error";
//       if (err.response?.data?.detail) {
//         if (Array.isArray(err.response.data.detail)) {
//           errorMsg = err.response.data.detail[0]?.msg || JSON.stringify(err.response.data.detail);
//         } else {
//           errorMsg = err.response.data.detail;
//         }
//       }
//       alert("Error booking appointment: " + errorMsg);
//     }
//   };

//   // ---------------- Merge and sort appointments ----------------
//   const combinedAppointments = [...humanAppointments, ...aiAppointments].sort(
//     (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
//   );

//   return (
//     <div className="flex">
    

//         <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

//         {/* Appointment Form */}
//         <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Patient Name"
//             required
//             className="border p-2 w-full"
//           />
//           <input
//             type="number"
//             name="age"
//             value={form.age}
//             onChange={handleChange}
//             placeholder="Age"
//             required
//             className="border p-2 w-full"
//           />
//           <input
//             type="text"
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             placeholder="Address"
//             required
//             className="border p-2 w-full"
//           />
//           <input
//             type="datetime-local"
//             name="appointment_time"
//             value={form.appointment_time}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           />
//           <input
//             type="text"
//             name="disease"
//             value={form.disease}
//             onChange={handleChange}
//             placeholder="Disease"
//             required
//             className="border p-2 w-full"
//           />
//           <select
//             name="doctor_id"
//             value={form.doctor_id}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           >
//             <option value="">Select Doctor</option>
//             {doctors.map((doc) => (
//               <option key={doc._id} value={doc._id}>
//                 {doc.name} ({doc.specialization})
//               </option>
//             ))}
//           </select>
//           <select
//             name="type"
//             value={form.type}
//             onChange={handleChange}
//             className="border p-2 w-full"
//           >
//             <option value="human">Human</option>
//             <option value="ai">AI</option>
//           </select>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Book Appointment
//           </button>
//         </form>

//         {/* Appointment Table */}
//         <h2 className="text-xl font-semibold mt-6">Appointments</h2>
//         <table className="w-full border mt-2">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Age</th>
//               <th className="border p-2">Address</th>
//               <th className="border p-2">Time</th>
//               <th className="border p-2">Disease</th>
//               <th className="border p-2">Doctor</th>
//               <th className="border p-2">Type</th>
//             </tr>
//           </thead>
//           <tbody>
//             {combinedAppointments.map((appt) => (
//               <tr key={appt._id}>
//                 <td className="border p-2">{appt.name}</td>
//                 <td className="border p-2">{appt.age}</td>
//                 <td className="border p-2">{appt.address}</td>
//                 <td className="border p-2">
//                   {new Date(appt.appointment_time).toLocaleString()}
//                 </td>
//                 <td className="border p-2">{appt.disease}</td>
//                 <td className="border p-2">
//                   {doctors.find((d) => d._id === appt.doctor_id)?.name || "Unknown"}
//                 </td>
//                 <td className="border p-2">{appt.type}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
    
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // ---------------- Fetch doctors and appointments ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await axios.get("http://localhost:5000/doctors/");
        setDoctors(doctorRes.data);

        const appointmentRes = await axios.get("http://localhost:5000/appointments/");

        const human = appointmentRes.data.filter((a) => a.type?.toLowerCase() === "human");
        const ai = appointmentRes.data.filter((a) => a.type?.toLowerCase() === "ai");

        setHumanAppointments(human);
        setAiAppointments(ai);
      } catch (err) {
        let errorMsg = "Unknown error";
        if (err.response?.data?.detail) {
          if (Array.isArray(err.response.data.detail)) {
            errorMsg = err.response.data.detail[0]?.msg || JSON.stringify(err.response.data.detail);
          } else {
            errorMsg = err.response.data.detail;
          }
        }
        alert("Error fetching data: " + errorMsg);
      }
    };
    fetchData();
  }, []);

  // ---------------- Handle input change ----------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- Handle appointment booking ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/appointments/", form);

      if (form.type.toLowerCase() === "human") {
        setHumanAppointments((prev) => [...prev, res.data.appointment]);
      } else {
        setAiAppointments((prev) => [...prev, res.data.appointment]);
      }

      alert(res.data.msg);

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
      let errorMsg = "Unknown error";
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail[0]?.msg || JSON.stringify(err.response.data.detail);
        } else {
          errorMsg = err.response.data.detail;
        }
      }
      alert("Error booking appointment: " + errorMsg);
    }
  };

  // ---------------- Merge and sort appointments ----------------
  const combinedAppointments = [...humanAppointments, ...aiAppointments].sort(
    (a, b) => new Date(a.appointment_time) - new Date(b.appointment_time)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Healthcare Appointment System</h1>
          <p className="text-gray-600">Schedule and manage patient appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Book Appointment</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                  <input
                    type="datetime-local"
                    name="appointment_time"
                    value={form.appointment_time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disease/Condition</label>
                  <input
                    type="text"
                    name="disease"
                    value={form.disease}
                    onChange={handleChange}
                    placeholder="Enter condition"
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                  <select
                    name="doctor_id"
                    value={form.doctor_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="human">Human Consultation</option>
                    <option value="ai">AI Consultation</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Schedule Appointment
                </button>
              </form>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Scheduled Appointments</h2>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {combinedAppointments.length} Total
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Condition</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {combinedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-medium">No appointments scheduled yet</p>
                            <p className="text-sm">Book your first appointment to get started</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      combinedAppointments.map((appt) => (
                        <tr key={appt._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
  {appt.name || appt.patient_name || "Unknown"}
</td>

                          <td className="px-6 py-4 text-sm text-gray-600">{appt.age}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{appt.address}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(appt.appointment_time).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{appt.disease}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {doctors.find((d) => d._id === appt.doctor_id)?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              appt.type.toLowerCase() === 'human' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {appt.type}
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
      </div>
    </div>
  );
}