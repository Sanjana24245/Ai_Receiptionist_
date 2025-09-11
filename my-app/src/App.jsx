// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
// import React, { useState } from 'react';
// import { 
//   Users, 
//   UserPlus, 
//   Calendar, 
//   MessageSquare, 
//   Phone, 
//   BarChart3, 
//   Upload, 
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   User,
//   Stethoscope,
//   FileText,
//   Bot,
//   UserCheck
// } from 'lucide-react';

// const HealthcareSubAdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('doctors');
//   const [showDoctorForm, setShowDoctorForm] = useState(false);
//   const [doctors, setDoctors] = useState([
//     { 
//       id: 1, 
//       name: 'Dr. Amit Sharma', 
//       specialty: 'Cardiology', 
//       timing: '9:00 AM - 5:00 PM', 
//       status: 'present',
//       phone: '+91 9876543210',
//       experience: '10 years'
//     },
//     { 
//       id: 2, 
//       name: 'Dr. Priya Singh', 
//       specialty: 'Dermatology', 
//       timing: '10:00 AM - 6:00 PM', 
//       status: 'leave',
//       phone: '+91 9876543211',
//       experience: '8 years'
//     }
//   ]);
  
//   const [patients, setPatients] = useState([
//     { 
//       id: 1, 
//       name: 'Rahul Kumar', 
//       age: 35, 
//       phone: '+91 9876543212', 
//       issue: 'Heart checkup',
//       lastVisit: '2025-09-05'
//     },
//     { 
//       id: 2, 
//       name: 'Sunita Devi', 
//       age: 45, 
//       phone: '+91 9876543213', 
//       issue: 'Skin consultation',
//       lastVisit: '2025-09-07'
//     }
//   ]);

//   const [calls, setCalls] = useState([
//     { 
//       id: 1, 
//       userName: 'Rohit Mehta', 
//       reason: 'Appointment booking', 
//       handledBy: 'AI', 
//       status: 'completed',
//       appointmentDetails: { date: '2025-09-12', time: '2:00 PM', doctor: 'Dr. Amit Sharma' }
//     },
//     { 
//       id: 2, 
//       userName: 'Kavya Patel', 
//       reason: 'Emergency consultation', 
//       handledBy: 'Human', 
//       status: 'in-progress',
//       appointmentDetails: { date: '2025-09-10', time: '11:00 AM', doctor: 'Dr. Priya Singh' }
//     }
//   ]);

//   const [doctorForm, setDoctorForm] = useState({
//     name: '',
//     specialty: '',
//     timing: '',
//     status: 'present',
//     phone: '',
//     experience: ''
//   });

//   const sidebarTabs = [
//     { id: 'doctors', label: 'Doctor Management', icon: Stethoscope },
//     { id: 'patients', label: 'Patient Management', icon: Users },
//     { id: 'calls', label: 'Calls/Chat Management', icon: MessageSquare },
//     { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 }
//   ];

//   const handleDoctorSubmit = (e) => {
//     e.preventDefault();
//     if (doctorForm.name && doctorForm.specialty && doctorForm.timing) {
//       const newDoctor = {
//         id: doctors.length + 1,
//         ...doctorForm
//       };
//       setDoctors([...doctors, newDoctor]);
//       setDoctorForm({
//         name: '',
//         specialty: '',
//         timing: '',
//         status: 'present',
//         phone: '',
//         experience: ''
//       });
//       setShowDoctorForm(false);
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Simulate file processing
//       setTimeout(() => {
//         const mockPatients = [
//           { id: patients.length + 1, name: 'Ajay Verma', age: 28, phone: '+91 9876543214', issue: 'General checkup', lastVisit: '2025-09-08' },
//           { id: patients.length + 2, name: 'Neha Gupta', age: 32, phone: '+91 9876543215', issue: 'Diabetes consultation', lastVisit: '2025-09-06' }
//         ];
//         setPatients([...patients, ...mockPatients]);
//         alert('Excel file uploaded successfully! New patients added.');
//       }, 1000);
//     }
//   };

//   const renderDoctorManagement = () => (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Doctor Management</h2>
//           <p className="text-gray-600">Manage doctor profiles, schedules, and availability</p>
//         </div>
//         <button
//           onClick={() => setShowDoctorForm(!showDoctorForm)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//         >
//           <UserPlus className="w-5 h-5" />
//           <span>Add Doctor</span>
//         </button>
//       </div>

//       {/* Doctor Form */}
//       {showDoctorForm && (
//         <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
//           <h3 className="text-xl font-semibold mb-4">Add New Doctor</h3>
//           <form onSubmit={handleDoctorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
//               <input
//                 type="text"
//                 value={doctorForm.name}
//                 onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter doctor name"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
//               <input
//                 type="text"
//                 value={doctorForm.specialty}
//                 onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., Cardiology"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
//               <input
//                 type="text"
//                 value={doctorForm.timing}
//                 onChange={(e) => setDoctorForm({...doctorForm, timing: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., 9:00 AM - 5:00 PM"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//               <input
//                 type="text"
//                 value={doctorForm.phone}
//                 onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="+91 9876543210"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
//               <input
//                 type="text"
//                 value={doctorForm.experience}
//                 onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., 5 years"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 value={doctorForm.status}
//                 onChange={(e) => setDoctorForm({...doctorForm, status: e.target.value})}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="present">Present</option>
//                 <option value="leave">On Leave</option>
//               </select>
//             </div>
//             <div className="md:col-span-2 flex space-x-4">
//               <button
//                 type="submit"
//                 className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Add Doctor
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowDoctorForm(false)}
//                 className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Doctors List */}
//       <div className="bg-white rounded-xl shadow-sm border">
//         <div className="p-6 border-b">
//           <h3 className="text-xl font-semibold">Doctors List</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {doctors.map((doctor) => (
//                 <tr key={doctor.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <Stethoscope className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="font-medium text-gray-900">{doctor.name}</div>
//                         <div className="text-sm text-gray-500">{doctor.experience}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{doctor.specialty}</td>
//                   <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
//                     <Clock className="w-4 h-4 mr-2 text-gray-400" />
//                     {doctor.timing}
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       doctor.status === 'present' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {doctor.status === 'present' ? 'Present' : 'On Leave'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{doctor.phone}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPatientManagement = () => (
//     <div className="p-6">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h2>
//         <p className="text-gray-600">Upload patient data and manage patient records</p>
//       </div>

//       {/* File Upload Section */}
//       <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
//         <h3 className="text-xl font-semibold mb-4">Upload Patient Data</h3>
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//           <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-lg font-medium text-gray-700 mb-2">Upload Excel File</p>
//           <p className="text-sm text-gray-500 mb-4">Drag and drop your Excel file or click to browse</p>
//           <input
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleFileUpload}
//             className="hidden"
//             id="file-upload"
//           />
//           <label
//             htmlFor="file-upload"
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
//           >
//             Choose File
//           </label>
//         </div>
//       </div>

//       {/* Patients List */}
//       <div className="bg-white rounded-xl shadow-sm border">
//         <div className="p-6 border-b">
//           <h3 className="text-xl font-semibold">Patients List</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {patients.map((patient) => (
//                 <tr key={patient.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                         <User className="w-5 h-5 text-green-600" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="font-medium text-gray-900">{patient.name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{patient.age} years</td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{patient.phone}</td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{patient.issue}</td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{patient.lastVisit}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   const renderCallsManagement = () => (
//     <div className="p-6">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Calls/Chat Management</h2>
//         <p className="text-gray-600">Monitor calls and chats handled by AI and human agents</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-blue-600 text-sm font-medium">AI Handled</p>
//               <p className="text-2xl font-bold text-blue-700">24</p>
//             </div>
//             <Bot className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>
//         <div className="bg-green-50 border border-green-200 rounded-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-green-600 text-sm font-medium">Human Handled</p>
//               <p className="text-2xl font-bold text-green-700">12</p>
//             </div>
//             <UserCheck className="w-8 h-8 text-green-600" />
//           </div>
//         </div>
//         <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-purple-600 text-sm font-medium">Total Calls</p>
//               <p className="text-2xl font-bold text-purple-700">36</p>
//             </div>
//             <Phone className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-yellow-600 text-sm font-medium">Appointments</p>
//               <p className="text-2xl font-bold text-yellow-700">18</p>
//             </div>
//             <Calendar className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
//       </div>

//       {/* Calls List */}
//       <div className="bg-white rounded-xl shadow-sm border">
//         <div className="p-6 border-b">
//           <h3 className="text-xl font-semibold">Recent Calls/Chats</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handled By</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Details</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {calls.map((call) => (
//                 <tr key={call.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                         <User className="w-5 h-5 text-gray-600" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="font-medium text-gray-900">{call.userName}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{call.reason}</td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       call.handledBy === 'AI' 
//                         ? 'bg-blue-100 text-blue-800' 
//                         : 'bg-green-100 text-green-800'
//                     }`}>
//                       {call.handledBy}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       call.status === 'completed' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {call.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {call.appointmentDetails && (
//                       <div>
//                         <div>{call.appointmentDetails.date} at {call.appointmentDetails.time}</div>
//                         <div className="text-xs text-gray-500">{call.appointmentDetails.doctor}</div>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   const renderAnalyticsDashboard = () => (
//     <div className="p-6">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
//         <p className="text-gray-600">Comprehensive overview of system performance and metrics</p>
//       </div>

//       {/* Main Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Total Calls/Chats</p>
//               <p className="text-3xl font-bold text-gray-900">156</p>
//               <p className="text-sm text-green-600">↑ 12% from last month</p>
//             </div>
//             <MessageSquare className="w-8 h-8 text-blue-500" />
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">AI Handled</p>
//               <p className="text-3xl font-bold text-gray-900">124</p>
//               <p className="text-sm text-blue-600">79.5% success rate</p>
//             </div>
//             <Bot className="w-8 h-8 text-green-500" />
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Human Handled</p>
//               <p className="text-3xl font-bold text-gray-900">32</p>
//               <p className="text-sm text-yellow-600">20.5% of total</p>
//             </div>
//             <UserCheck className="w-8 h-8 text-yellow-500" />
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Appointments</p>
//               <p className="text-3xl font-bold text-gray-900">89</p>
//               <p className="text-sm text-purple-600">57% conversion rate</p>
//             </div>
//             <Calendar className="w-8 h-8 text-purple-500" />
//           </div>
//         </div>
//       </div>

//       {/* Detailed Analytics */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* AI vs Human Performance */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold mb-4">AI vs Human Performance</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-700">AI Resolution Rate</span>
//                 <span className="text-sm font-bold text-blue-600">79.5%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{width: '79.5%'}}></div>
//               </div>
//             </div>
            
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-700">Human Resolution Rate</span>
//                 <span className="text-sm font-bold text-green-600">95.2%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{width: '95.2%'}}></div>
//               </div>
//             </div>
            
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-700">Average Response Time (AI)</span>
//                 <span className="text-sm font-bold text-blue-600">2.3 sec</span>
//               </div>
//             </div>
            
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm font-medium text-gray-700">Average Response Time (Human)</span>
//                 <span className="text-sm font-bold text-green-600">45 sec</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Patient Progress */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold mb-4">Patient Progress Overview</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <CheckCircle className="w-5 h-5 text-green-500" />
//                 <span className="text-sm font-medium">Completed Treatments</span>
//               </div>
//               <span className="text-lg font-bold text-green-600">67</span>
//             </div>
            
//             <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <Clock className="w-5 h-5 text-blue-500" />
//                 <span className="text-sm font-medium">Ongoing Treatments</span>
//               </div>
//               <span className="text-lg font-bold text-blue-600">23</span>
//             </div>
            
//             <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <AlertCircle className="w-5 h-5 text-yellow-500" />
//                 <span className="text-sm font-medium">Pending Appointments</span>
//               </div>
//               <span className="text-lg font-bold text-yellow-600">15</span>
//             </div>
            
//             <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 <Calendar className="w-5 h-5 text-purple-500" />
//                 <span className="text-sm font-medium">Follow-ups Due</span>
//               </div>
//               <span className="text-lg font-bold text-purple-600">8</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Monthly Trends */}
//       <div className="mt-8 bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-600">1,247</div>
//             <div className="text-sm text-gray-500">Total Interactions</div>
//             <div className="text-xs text-green-500">↑ 18% vs last month</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-green-600">892</div>
//             <div className="text-sm text-gray-500">Successful Appointments</div>
//             <div className="text-xs text-green-500">↑ 24% vs last month</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-purple-600">4.8/5</div>
//             <div className="text-sm text-gray-500">Patient Satisfaction</div>
//             <div className="text-xs text-green-500">↑ 0.3 vs last month</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'doctors':
//         return renderDoctorManagement();
//       case 'patients':
//         return renderPatientManagement();
//       case 'calls':
//         return renderCallsManagement();
//       case 'analytics':
//         return renderAnalyticsDashboard();
//       default:
//         return renderDoctorManagement();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
//           <h1 className="text-xl font-bold text-white">SubAdmin Dashboard</h1>
//           <p className="text-blue-100 text-sm mt-1">Healthcare Management</p>
//         </div>
//         <nav className="mt-6">
//           {sidebarTabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`w-full flex items-center space-x-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
//                   activeTab === tab.id 
//                     ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' 
//                     : 'text-gray-600'
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span className="font-medium">{tab.label}</span>
//               </button>
//             );
//           })}
//         </nav>
        
//         {/* Quick Stats in Sidebar */}
//         <div className="mt-8 px-6">
//           <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Stats</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600">Active Doctors</span>
//               <span className="text-sm font-semibold text-green-600">{doctors.filter(d => d.status === 'present').length}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600">Total Patients</span>
//               <span className="text-sm font-semibold text-blue-600">{patients.length}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600">Today's Calls</span>
//               <span className="text-sm font-semibold text-purple-600">{calls.length}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// export default HealthcareSubAdminDashboard;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./screens/Register";
import LoginForm from "./screens/Login";
import Chatbot from "./screens/Chatbot";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}
