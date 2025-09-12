// // // // import React, { useState } from 'react';

// // // // const initialAIAppointments = [
// // // //   {
// // // //     id: 1,
// // // //     type: 'AI',
// // // //     name: 'John Doe',
// // // //     age: 30,
// // // //     address: '123 Main St',
// // // //     time: '2025-09-10 10:00 AM',
// // // //     disease: 'Flu',
// // // //   },
// // // //   {
// // // //     id: 2,
// // // //     type: 'AI',
// // // //     name: 'Jane Smith',
// // // //     age: 25,
// // // //     address: '456 Oak Ave',
// // // //     time: '2025-09-11 02:00 PM',
// // // //     disease: 'Cold',
// // // //   },
// // // // ];

// // // // export default function AppointmentPage() {
// // // //   const [humanAppointments, setHumanAppointments] = useState([]);
// // // //   const [showForm, setShowForm] = useState(false);
// // // //   const [form, setForm] = useState({
// // // //     name: '',
// // // //     age: '',
// // // //     address: '',
// // // //     time: '',
// // // //     disease: '',
// // // //   });

// // // //   const combinedAppointments = [...humanAppointments, ...initialAIAppointments].sort(
// // // //     (a, b) => new Date(a.time) - new Date(b.time)
// // // //   );

// // // //   const handleInputChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setForm((prev) => ({ ...prev, [name]: value }));
// // // //   };

// // // //   const handleAddAppointment = (e) => {
// // // //     e.preventDefault();
// // // //     // Basic validation
// // // //     if (!form.name || !form.age || !form.address || !form.time || !form.disease) {
// // // //       alert('Please fill all fields');
// // // //       return;
// // // //     }
// // // //     const newAppointment = {
// // // //       id: humanAppointments.length + initialAIAppointments.length + 1,
// // // //       type: 'Human',
// // // //       ...form,
// // // //     };
// // // //     setHumanAppointments((prev) => [...prev, newAppointment]);
// // // //     setForm({ name: '', age: '', address: '', time: '', disease: '' });
// // // //     setShowForm(false);
// // // //   };

// // // //   return (
// // // //     <div className="min-h-screen p-6 bg-gray-100">
// // // //       <h1 className="text-3xl font-bold mb-6 text-center">Appointment Page</h1>

// // // //       <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
// // // //         <button
// // // //           onClick={() => setShowForm((prev) => !prev)}
// // // //           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
// // // //         >
// // // //           {showForm ? 'Cancel' : 'Add Appointment'}
// // // //         </button>

// // // //         {showForm && (
// // // //           <form onSubmit={handleAddAppointment} className="space-y-4 mb-6">
// // // //             <div>
// // // //               <label className="block font-medium mb-1">Name</label>
// // // //               <input
// // // //                 type="text"
// // // //                 name="name"
// // // //                 value={form.name}
// // // //                 onChange={handleInputChange}
// // // //                 className="w-full p-2 border rounded"
// // // //                 placeholder="Enter name"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="block font-medium mb-1">Age</label>
// // // //               <input
// // // //                 type="number"
// // // //                 name="age"
// // // //                 value={form.age}
// // // //                 onChange={handleInputChange}
// // // //                 className="w-full p-2 border rounded"
// // // //                 placeholder="Enter age"
// // // //                 min="0"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="block font-medium mb-1">Address</label>
// // // //               <input
// // // //                 type="text"
// // // //                 name="address"
// // // //                 value={form.address}
// // // //                 onChange={handleInputChange}
// // // //                 className="w-full p-2 border rounded"
// // // //                 placeholder="Enter address"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="block font-medium mb-1">Appointment Time</label>
// // // //               <input
// // // //                 type="datetime-local"
// // // //                 name="time"
// // // //                 value={form.time}
// // // //                 onChange={handleInputChange}
// // // //                 className="w-full p-2 border rounded"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <div>
// // // //               <label className="block font-medium mb-1">Disease / Customer Name</label>
// // // //               <input
// // // //                 type="text"
// // // //                 name="disease"
// // // //                 value={form.disease}
// // // //                 onChange={handleInputChange}
// // // //                 className="w-full p-2 border rounded"
// // // //                 placeholder="Enter disease or customer name"
// // // //                 required
// // // //               />
// // // //             </div>
// // // //             <button
// // // //               type="submit"
// // // //               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
// // // //             >
// // // //               Book Appointment
// // // //             </button>
// // // //           </form>
// // // //         )}

// // // //         <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>

// // // //         {combinedAppointments.length === 0 ? (
// // // //           <p className="text-gray-600">No appointments booked yet.</p>
// // // //         ) : (
// // // //           <table className="w-full border-collapse border border-gray-300">
// // // //             <thead>
// // // //               <tr className="bg-gray-200">
// // // //                 <th className="border border-gray-300 px-3 py-2">Type</th>
// // // //                 <th className="border border-gray-300 px-3 py-2">Name</th>
// // // //                 <th className="border border-gray-300 px-3 py-2">Age</th>
// // // //                 <th className="border border-gray-300 px-3 py-2">Address</th>
// // // //                 <th className="border border-gray-300 px-3 py-2">Appointment Time</th>
// // // //                 <th className="border border-gray-300 px-3 py-2">Disease / Customer Name</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {combinedAppointments.map((appt) => (
// // // //                 <tr key={appt.id} className="hover:bg-gray-100">
// // // //                   <td className="border border-gray-300 px-3 py-2 font-semibold text-center">
// // // //                     {appt.type}
// // // //                   </td>
// // // //                   <td className="border border-gray-300 px-3 py-2">{appt.name}</td>
// // // //                   <td className="border border-gray-300 px-3 py-2 text-center">{appt.age}</td>
// // // //                   <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
// // // //                   <td className="border border-gray-300 px-3 py-2">
// // // //                     {new Date(appt.time).toLocaleString()}
// // // //                   </td>
// // // //                   <td className="border border-gray-300 px-3 py-2">{appt.disease}</td>
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </table>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // import React, { useState } from 'react';

// // // const initialAIAppointments = [
// // //   {
// // //     id: 1,
// // //     type: 'AI',
// // //     name: 'John Doe',
// // //     age: 30,
// // //     address: '123 Main St',
// // //     time: '2025-09-10 10:00 AM',
// // //     disease: 'Flu',
// // //   },
// // //   {
// // //     id: 2,
// // //     type: 'AI',
// // //     name: 'Jane Smith',
// // //     age: 25,
// // //     address: '456 Oak Ave',
// // //     time: '2025-09-11 02:00 PM',
// // //     disease: 'Cold',
// // //   },
// // // ];

// // // export default function AppointmentPage() {
// // //   const [humanAppointments, setHumanAppointments] = useState([]);
// // //   const [showForm, setShowForm] = useState(false);
// // //   const [form, setForm] = useState({
// // //     name: '',
// // //     age: '',
// // //     address: '',
// // //     time: '',
// // //     disease: '',
// // //   });

// // //   const combinedAppointments = [...humanAppointments, ...initialAIAppointments].sort(
// // //     (a, b) => new Date(a.time) - new Date(b.time)
// // //   );

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleAddAppointment = (e) => {
// // //     e.preventDefault();
// // //     // Basic validation
// // //     if (!form.name || !form.age || !form.address || !form.time || !form.disease) {
// // //       alert('Please fill all fields');
// // //       return;
// // //     }
// // //     const newAppointment = {
// // //       id: humanAppointments.length + initialAIAppointments.length + 1,
// // //       type: 'Human',
// // //       ...form,
// // //     };
// // //     setHumanAppointments((prev) => [...prev, newAppointment]);
// // //     setForm({ name: '', age: '', address: '', time: '', disease: '' });
// // //     setShowForm(false);
// // //   };

// // //   return (
// // //     <div className="min-h-screen p-6 bg-gray-100">
// // //       <h1 className="text-3xl font-bold mb-6 text-center">Appointment Page</h1>

// // //       <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
// // //         <button
// // //           onClick={() => setShowForm((prev) => !prev)}
// // //           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
// // //         >
// // //           {showForm ? 'Cancel' : 'Add Appointment'}
// // //         </button>

// // //         {/* Add Appointment Section */}
// // //         {showForm && (
// // //           <form onSubmit={handleAddAppointment} className="space-y-6 mb-6">
// // //             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
// // //               <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
// // //                 Add Appointment Details
// // //               </h3>

// // //               {/* Name */}
// // //               <div className="mb-4">
// // //                 <label className="block font-medium mb-1">Name</label>
// // //                 <input
// // //                   type="text"
// // //                   name="name"
// // //                   value={form.name}
// // //                   onChange={handleInputChange}
// // //                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Enter name"
// // //                   required
// // //                 />
// // //               </div>

// // //               {/* Age */}
// // //               <div className="mb-4">
// // //                 <label className="block font-medium mb-1">Age</label>
// // //                 <input
// // //                   type="number"
// // //                   name="age"
// // //                   value={form.age}
// // //                   onChange={handleInputChange}
// // //                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Enter age"
// // //                   min="0"
// // //                   required
// // //                 />
// // //               </div>

// // //               {/* Address */}
// // //               <div className="mb-4">
// // //                 <label className="block font-medium mb-1">Address</label>
// // //                 <input
// // //                   type="text"
// // //                   name="address"
// // //                   value={form.address}
// // //                   onChange={handleInputChange}
// // //                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Enter address"
// // //                   required
// // //                 />
// // //               </div>

// // //               {/* Appointment Time */}
// // //               <div className="mb-4">
// // //                 <label className="block font-medium mb-1">Appointment Time</label>
// // //                 <input
// // //                   type="datetime-local"
// // //                   name="time"
// // //                   value={form.time}
// // //                   onChange={handleInputChange}
// // //                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// // //                   required
// // //                 />
// // //               </div>

// // //               {/* Disease / Customer Name */}
// // //               <div className="mb-4">
// // //                 <label className="block font-medium mb-1">Disease / Customer Name</label>
// // //                 <input
// // //                   type="text"
// // //                   name="disease"
// // //                   value={form.disease}
// // //                   onChange={handleInputChange}
// // //                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// // //                   placeholder="Enter disease or customer name"
// // //                   required
// // //                 />
// // //               </div>

// // //               {/* Submit Button */}
// // //               <div className="text-right">
// // //                 <button
// // //                   type="submit"
// // //                   className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
// // //                 >
// // //                   Book Appointment
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </form>
// // //         )}

// // //         {/* Booked Appointments */}
// // //         <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>

// // //         {combinedAppointments.length === 0 ? (
// // //           <p className="text-gray-600">No appointments booked yet.</p>
// // //         ) : (
// // //           <table className="w-full border-collapse border border-gray-300">
// // //             <thead>
// // //               <tr className="bg-gray-200">
// // //                 <th className="border border-gray-300 px-3 py-2">Type</th>
// // //                 <th className="border border-gray-300 px-3 py-2">Name</th>
// // //                 <th className="border border-gray-300 px-3 py-2">Age</th>
// // //                 <th className="border border-gray-300 px-3 py-2">Address</th>
// // //                 <th className="border border-gray-300 px-3 py-2">Appointment Time</th>
// // //                 <th className="border border-gray-300 px-3 py-2">Disease / Customer Name</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {combinedAppointments.map((appt) => (
// // //                 <tr key={appt.id} className="hover:bg-gray-100">
// // //                   <td className="border border-gray-300 px-3 py-2 font-semibold text-center">
// // //                     {appt.type}
// // //                   </td>
// // //                   <td className="border border-gray-300 px-3 py-2">{appt.name}</td>
// // //                   <td className="border border-gray-300 px-3 py-2 text-center">{appt.age}</td>
// // //                   <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
// // //                   <td className="border border-gray-300 px-3 py-2">
// // //                     {new Date(appt.time).toLocaleString()}
// // //                   </td>
// // //                   <td className="border border-gray-300 px-3 py-2">{appt.disease}</td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // import React, { useState } from 'react';

// // const initialAIAppointments = [
// //   {
// //     id: 1,
// //     type: 'AI',
// //     name: 'John Doe',
// //     age: 30,
// //     address: '123 Main St',
// //     time: '2025-09-10 10:00 AM',
// //     disease: 'Flu',
// //   },
// //   {
// //     id: 2,
// //     type: 'AI',
// //     name: 'Jane Smith',
// //     age: 25,
// //     address: '456 Oak Ave',
// //     time: '2025-09-11 02:00 PM',
// //     disease: 'Cold',
// //   },
// // ];

// // export default function AppointmentPage() {
// //   const [humanAppointments, setHumanAppointments] = useState([]);
// //   const [showForm, setShowForm] = useState(false);
// //   const [form, setForm] = useState({
// //     name: '',
// //     age: '',
// //     address: '',
// //     time: '',
// //     disease: '',
// //   });

// //   const combinedAppointments = [...humanAppointments, ...initialAIAppointments].sort(
// //     (a, b) => new Date(a.time) - new Date(b.time)
// //   );

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleAddAppointment = (e) => {
// //     e.preventDefault();
// //     // Basic validation
// //     if (!form.name || !form.age || !form.address || !form.time || !form.disease) {
// //       alert('Please fill all fields');
// //       return;
// //     }
// //     const newAppointment = {
// //       id: humanAppointments.length + initialAIAppointments.length + 1,
// //       type: 'Human',
// //       ...form,
// //     };
// //     setHumanAppointments((prev) => [...prev, newAppointment]);
// //     setForm({ name: '', age: '', address: '', time: '', disease: '' });
// //     setShowForm(false);
// //   };

// //   return (
// //     <div className="min-h-screen p-6 bg-gray-100">
// //       <h1 className="text-3xl font-bold mb-6 text-center">Appointment Page</h1>

// //       <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
// //         <button
// //           onClick={() => setShowForm((prev) => !prev)}
// //           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
// //         >
// //           {showForm ? 'Cancel' : 'Add Appointment'}
// //         </button>

// //         {/* Add Appointment Section */}
// //         {showForm && (
// //           <form onSubmit={handleAddAppointment} className="space-y-6 mb-6">
// //             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
// //               <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
// //                 Add Appointment Details
// //               </h3>

// //               {/* Name + Age */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                 <div>
// //                   <label className="block font-medium mb-1">Name</label>
// //                   <input
// //                     type="text"
// //                     name="name"
// //                     value={form.name}
// //                     onChange={handleInputChange}
// //                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// //                     placeholder="Enter name"
// //                     required
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block font-medium mb-1">Age</label>
// //                   <input
// //                     type="number"
// //                     name="age"
// //                     value={form.age}
// //                     onChange={handleInputChange}
// //                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// //                     placeholder="Enter age"
// //                     min="0"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Address + Appointment Time */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                 <div>
// //                   <label className="block font-medium mb-1">Address</label>
// //                   <input
// //                     type="text"
// //                     name="address"
// //                     value={form.address}
// //                     onChange={handleInputChange}
// //                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// //                     placeholder="Enter address"
// //                     required
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block font-medium mb-1">Appointment Time</label>
// //                   <input
// //                     type="datetime-local"
// //                     name="time"
// //                     value={form.time}
// //                     onChange={handleInputChange}
// //                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Disease */}
// //               <div className="mb-4">
// //                 <label className="block font-medium mb-1">Disease / Customer Name</label>
// //                 <input
// //                   type="text"
// //                   name="disease"
// //                   value={form.disease}
// //                   onChange={handleInputChange}
// //                   className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
// //                   placeholder="Enter disease or customer name"
// //                   required
// //                 />
// //               </div>

// //               {/* Submit Button */}
// //               <div className="text-right">
// //                 <button
// //                   type="submit"
// //                   className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
// //                 >
// //                   Book Appointment
// //                 </button>
// //               </div>
// //             </div>
// //           </form>
// //         )}

// //         {/* Booked Appointments */}
// //         <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>

// //         {combinedAppointments.length === 0 ? (
// //           <p className="text-gray-600">No appointments booked yet.</p>
// //         ) : (
// //           <table className="w-full border-collapse border border-gray-300">
// //             <thead>
// //               <tr className="bg-gray-200">
// //                 <th className="border border-gray-300 px-3 py-2">Type</th>
// //                 <th className="border border-gray-300 px-3 py-2">Name</th>
// //                 <th className="border border-gray-300 px-3 py-2">Age</th>
// //                 <th className="border border-gray-300 px-3 py-2">Address</th>
// //                 <th className="border border-gray-300 px-3 py-2">Appointment Time</th>
// //                 <th className="border border-gray-300 px-3 py-2">Disease / Customer Name</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {combinedAppointments.map((appt) => (
// //                 <tr key={appt.id} className="hover:bg-gray-100">
// //                   <td className="border border-gray-300 px-3 py-2 font-semibold text-center">
// //                     {appt.type}
// //                   </td>
// //                   <td className="border border-gray-300 px-3 py-2">{appt.name}</td>
// //                   <td className="border border-gray-300 px-3 py-2 text-center">{appt.age}</td>
// //                   <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
// //                   <td className="border border-gray-300 px-3 py-2">
// //                     {new Date(appt.time).toLocaleString()}
// //                   </td>
// //                   <td className="border border-gray-300 px-3 py-2">{appt.disease}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState } from 'react';

// const initialAIAppointments = [
//   {
//     id: 1,
//     type: 'AI',
//     name: 'John Doe',
//     age: 30,
//     address: '123 Main St',
//     time: '2025-09-10 10:00 AM',
//     disease: 'Flu',
//     doctor: 'Dr. Smith',
//   },
//   {
//     id: 2,
//     type: 'AI',
//     name: 'Jane Smith',
//     age: 25,
//     address: '456 Oak Ave',
//     time: '2025-09-11 02:00 PM',
//     disease: 'Cold',
//     doctor: 'Dr. Adams',
//   },
// ];

// export default function AppointmentPage() {
//   const [humanAppointments, setHumanAppointments] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     name: '',
//     age: '',
//     address: '',
//     time: '',
//     disease: '',
//     doctor: '',
//   });

//   const combinedAppointments = [...humanAppointments, ...initialAIAppointments].sort(
//     (a, b) => new Date(a.time) - new Date(b.time)
//   );

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddAppointment = (e) => {
//     e.preventDefault();
//     // Basic validation
//     if (!form.name || !form.age || !form.address || !form.time || !form.disease || !form.doctor) {
//       alert('Please fill all fields');
//       return;
//     }
//     const newAppointment = {
//       id: humanAppointments.length + initialAIAppointments.length + 1,
//       type: 'Human',
//       ...form,
//     };
//     setHumanAppointments((prev) => [...prev, newAppointment]);
//     setForm({ name: '', age: '', address: '', time: '', disease: '', doctor: '' });
//     setShowForm(false);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100">
//       <h1 className="text-3xl font-bold mb-6 text-center">Appointment Page</h1>

//       <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
//         <button
//           onClick={() => setShowForm((prev) => !prev)}
//           className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           {showForm ? 'Cancel' : 'Add Appointment'}
//         </button>

//         {/* Add Appointment Section */}
//         {showForm && (
//           <form onSubmit={handleAddAppointment} className="space-y-6 mb-6">
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
//               <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
//                 Add Appointment Details
//               </h3>

//               {/* Row 1: Name + Age */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block font-medium mb-1">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-medium mb-1">Age</label>
//                   <input
//                     type="number"
//                     name="age"
//                     value={form.age}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter age"
//                     min="0"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Row 2: Address + Appointment Time */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block font-medium mb-1">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={form.address}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter address"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-medium mb-1">Appointment Time</label>
//                   <input
//                     type="datetime-local"
//                     name="time"
//                     value={form.time}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Row 3: Disease + Doctor Name */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block font-medium mb-1">Disease / Customer Name</label>
//                   <input
//                     type="text"
//                     name="disease"
//                     value={form.disease}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter disease or customer name"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block font-medium mb-1">Doctor Name</label>
//                   <input
//                     type="text"
//                     name="doctor"
//                     value={form.doctor}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter doctor name"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <div className="text-right">
//                 <button
//                   type="submit"
//                   className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                 >
//                   Book Appointment
//                 </button>
//               </div>
//             </div>
//           </form>
//         )}

//         {/* Booked Appointments */}
//         <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>

//         {combinedAppointments.length === 0 ? (
//           <p className="text-gray-600">No appointments booked yet.</p>
//         ) : (
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border border-gray-300 px-3 py-2">Type</th>
//                 <th className="border border-gray-300 px-3 py-2">Name</th>
//                 <th className="border border-gray-300 px-3 py-2">Age</th>
//                 <th className="border border-gray-300 px-3 py-2">Address</th>
//                 <th className="border border-gray-300 px-3 py-2">Appointment Time</th>
//                 <th className="border border-gray-300 px-3 py-2">Disease / Customer Name</th>
//                 <th className="border border-gray-300 px-3 py-2">Doctor Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {combinedAppointments.map((appt) => (
//                 <tr key={appt.id} className="hover:bg-gray-100">
//                   <td className="border border-gray-300 px-3 py-2 font-semibold text-center">
//                     {appt.type}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">{appt.name}</td>
//                   <td className="border border-gray-300 px-3 py-2 text-center">{appt.age}</td>
//                   <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     {new Date(appt.time).toLocaleString()}
//                   </td>
//                   <td className="border border-gray-300 px-3 py-2">{appt.disease}</td>
//                   <td className="border border-gray-300 px-3 py-2">{appt.doctor}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import Sidebar from "./Sidebar"; // <-- Sidebar import keli

// const initialAIAppointments = [
//   {
//     id: 1,
//     type: "AI",
//     name: "John Doe",
//     age: 30,
//     address: "123 Main St",
//     time: "2025-09-10 10:00 AM",
//     disease: "Flu",
//     doctor: "Dr. Smith",
//   },
//   {
//     id: 2,
//     type: "AI",
//     name: "Jane Smith",
//     age: 25,
//     address: "456 Oak Ave",
//     time: "2025-09-11 02:00 PM",
//     disease: "Cold",
//     doctor: "Dr. Adams",
//   },
// ];

// export default function AppointmentPage() {
//   const [humanAppointments, setHumanAppointments] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     age: "",
//     address: "",
//     time: "",
//     disease: "",
//     doctor: "",
//   });

//   const combinedAppointments = [...humanAppointments, ...initialAIAppointments].sort(
//     (a, b) => new Date(a.time) - new Date(b.time)
//   );

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddAppointment = (e) => {
//     e.preventDefault();
//     if (!form.name || !form.age || !form.address || !form.time || !form.disease || !form.doctor) {
//       alert("Please fill all fields");
//       return;
//     }
//     const newAppointment = {
//       id: humanAppointments.length + initialAIAppointments.length + 1,
//       type: "Human",
//       ...form,
//     };
//     setHumanAppointments((prev) => [...prev, newAppointment]);
//     setForm({ name: "", age: "", address: "", time: "", disease: "", doctor: "" });
//     setShowForm(false);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar Left */}
//       <Sidebar />

//       {/* Appointment Content */}
//       <div className="flex-1 p-6">
//         <h1 className="text-3xl font-bold mb-6 text-center">Appointment Page</h1>

//         <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
//           <button
//             onClick={() => setShowForm((prev) => !prev)}
//             className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             {showForm ? "Cancel" : "Add Appointment"}
//           </button>

//           {/* Add Appointment Section */}
//           {showForm && (
//             <form onSubmit={handleAddAppointment} className="space-y-6 mb-6">
//               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
//                 <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
//                   Add Appointment Details
//                 </h3>

//                 {/* Row 1 */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block font-medium mb-1">Name</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={form.name}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">Age</label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={form.age}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter age"
//                       min="0"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Row 2 */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block font-medium mb-1">Address</label>
//                     <input
//                       type="text"
//                       name="address"
//                       value={form.address}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter address"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">Appointment Time</label>
//                     <input
//                       type="datetime-local"
//                       name="time"
//                       value={form.time}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Row 3 */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block font-medium mb-1">Disease / Customer Name</label>
//                     <input
//                       type="text"
//                       name="disease"
//                       value={form.disease}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter disease"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-medium mb-1">Doctor Name</label>
//                     <input
//                       type="text"
//                       name="doctor"
//                       value={form.doctor}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                       placeholder="Enter doctor name"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               </div>
//             </form>
//           )}

//           {/* Appointment Table */}
//           <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>
//           {combinedAppointments.length === 0 ? (
//             <p className="text-gray-600">No appointments booked yet.</p>
//           ) : (
//             <table className="w-full border-collapse border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border border-gray-300 px-3 py-2">Type</th>
//                   <th className="border border-gray-300 px-3 py-2">Name</th>
//                   <th className="border border-gray-300 px-3 py-2">Age</th>
//                   <th className="border border-gray-300 px-3 py-2">Address</th>
//                   <th className="border border-gray-300 px-3 py-2">Appointment Time</th>
//                   <th className="border border-gray-300 px-3 py-2">Disease</th>
//                   <th className="border border-gray-300 px-3 py-2">Doctor</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {combinedAppointments.map((appt) => (
//                   <tr key={appt.id} className="hover:bg-gray-100">
//                     <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
//                       {appt.type}
//                     </td>
//                     <td className="border border-gray-300 px-3 py-2">{appt.name}</td>
//                     <td className="border border-gray-300 px-3 py-2 text-center">{appt.age}</td>
//                     <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
//                     <td className="border border-gray-300 px-3 py-2">
//                       {new Date(appt.time).toLocaleString()}
//                     </td>
//                     <td className="border border-gray-300 px-3 py-2">{appt.disease}</td>
//                     <td className="border border-gray-300 px-3 py-2">{appt.doctor}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import Sidebar from "./Sidebar"; // <-- Sidebar import keli
import Navbar from "./Navbar";   // <-- Navbar import keli

const initialAIAppointments = [
  {
    id: 1,
    type: "AI",
    name: "John Doe",
    age: 30,
    address: "123 Main St",
    time: "2025-09-10 10:00 AM",
    disease: "Flu",
    doctor: "Dr. Smith",
  },
  {
    id: 2,
    type: "AI",
    name: "Jane Smith",
    age: 25,
    address: "456 Oak Ave",
    time: "2025-09-11 02:00 PM",
    disease: "Cold",
    doctor: "Dr. Adams",
  },
];

export default function AppointmentPage() {
  const [humanAppointments, setHumanAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    time: "",
    disease: "",
    doctor: "",
  });

  const combinedAppointments = [...humanAppointments, ...initialAIAppointments].sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.address || !form.time || !form.disease || !form.doctor) {
      alert("Please fill all fields");
      return;
    }
    const newAppointment = {
      id: humanAppointments.length + initialAIAppointments.length + 1,
      type: "Human",
      ...form,
    };
    setHumanAppointments((prev) => [...prev, newAppointment]);
    setForm({ name: "", age: "", address: "", time: "", disease: "", doctor: "" });
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Left */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Appointment Content */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Appointment Page</h1>

          <div className=" mx-auto bg-white p-6 rounded shadow">
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {showForm ? "Cancel" : "Add Appointment"}
            </button>

            {/* Add Appointment Section */}
            {showForm && (
              <form onSubmit={handleAddAppointment} className="space-y-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">
                    Add Appointment Details
                  </h3>

                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-medium mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter age"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-medium mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Appointment Time</label>
                      <input
                        type="datetime-local"
                        name="time"
                        value={form.time}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-medium mb-1">Disease / Customer Name</label>
                      <input
                        type="text"
                        name="disease"
                        value={form.disease}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter disease"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Doctor Name</label>
                      <input
                        type="text"
                        name="doctor"
                        value={form.doctor}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter doctor name"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Appointment Table */}
            <h2 className="text-2xl font-semibold mb-4">Booked Appointments</h2>
            {combinedAppointments.length === 0 ? (
              <p className="text-gray-600">No appointments booked yet.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-3 py-2">Type</th>
                    <th className="border border-gray-300 px-3 py-2">Name</th>
                    <th className="border border-gray-300 px-3 py-2">Age</th>
                    <th className="border border-gray-300 px-3 py-2">Address</th>
                    <th className="border border-gray-300 px-3 py-2">Appointment Time</th>
                    <th className="border border-gray-300 px-3 py-2">Disease</th>
                    <th className="border border-gray-300 px-3 py-2">Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                        {appt.type}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{appt.name}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">{appt.age}</td>
                      <td className="border border-gray-300 px-3 py-2">{appt.address}</td>
                      <td className="border border-gray-300 px-3 py-2">
                        {new Date(appt.time).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{appt.disease}</td>
                      <td className="border border-gray-300 px-3 py-2">{appt.doctor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
