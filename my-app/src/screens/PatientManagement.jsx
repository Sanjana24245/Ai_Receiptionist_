
// import React from 'react';
// import { User, Upload } from 'lucide-react';

// const PatientManagement = ({ patients, setPatients }) => {
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

//   return (
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
// };

// export default PatientManagement;

// import React from 'react';
// import Sidebar from './Sidebar'; // Import Sidebar
// import { User, Upload } from 'lucide-react';

// const PatientManagement = ({ patients, setPatients }) => {
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

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto p-6 bg-gray-100">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h2>
//           <p className="text-gray-600">Upload patient data and manage patient records</p>
//         </div>

//         {/* File Upload Section */}
//         <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
//           <h3 className="text-xl font-semibold mb-4">Upload Patient Data</h3>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-lg font-medium text-gray-700 mb-2">Upload Excel File</p>
//             <p className="text-sm text-gray-500 mb-4">Drag and drop your Excel file or click to browse</p>
//             <input
//               type="file"
//               accept=".xlsx,.xls"
//               onChange={handleFileUpload}
//               className="hidden"
//               id="file-upload"
//             />
//             <label
//               htmlFor="file-upload"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
//             >
//               Choose File
//             </label>
//           </div>
//         </div>

//         {/* Patients List */}
//         <div className="bg-white rounded-xl shadow-sm border">
//           <div className="p-6 border-b">
//             <h3 className="text-xl font-semibold">Patients List</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {patients.map((patient) => (
//                   <tr key={patient.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                           <User className="w-5 h-5 text-green-600" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="font-medium text-gray-900">{patient.name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{patient.age} years</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{patient.phone}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{patient.issue}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{patient.lastVisit}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientManagement;
import React from 'react';
import Sidebar from './Sidebar'; // Import Sidebar
import Navbar from './Navbar';   // Import Navbar
import { User, Upload } from 'lucide-react';

const PatientManagement = ({ patients, setPatients }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTimeout(() => {
        const mockPatients = [
          { id: patients.length + 1, name: 'Ajay Verma', age: 28, phone: '+91 9876543214', issue: 'General checkup', lastVisit: '2025-09-08' },
          { id: patients.length + 2, name: 'Neha Gupta', age: 32, phone: '+91 9876543215', issue: 'Diabetes consultation', lastVisit: '2025-09-06' }
        ];
        setPatients([...patients, ...mockPatients]);
        alert('Excel file uploaded successfully! New patients added.');
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-100">
        {/* Navbar */}
        <Navbar />

        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h2>
            <p className="text-gray-600">Upload patient data and manage patient records</p>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Upload Patient Data</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Upload Excel File</p>
              <p className="text-sm text-gray-500 mb-4">Drag and drop your Excel file or click to browse</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{patient.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.age} years</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.issue}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{patient.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
