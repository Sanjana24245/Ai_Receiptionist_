
// import React from 'react';
// import Sidebar from './Sidebar'; // Import your Sidebar
// import { User, Phone, Calendar, Bot, UserCheck } from 'lucide-react';

// const CallsManagement = ({ calls }) => {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto p-6 bg-gray-100">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Calls/Chat Management</h2>
//           <p className="text-gray-600">Monitor calls and chats handled by AI and human agents</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-600 text-sm font-medium">AI Handled</p>
//                 <p className="text-2xl font-bold text-blue-700">24</p>
//               </div>
//               <Bot className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//           <div className="bg-green-50 border border-green-200 rounded-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-600 text-sm font-medium">Human Handled</p>
//                 <p className="text-2xl font-bold text-green-700">12</p>
//               </div>
//               <UserCheck className="w-8 h-8 text-green-600" />
//             </div>
//           </div>
//           <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-600 text-sm font-medium">Total Calls</p>
//                 <p className="text-2xl font-bold text-purple-700">36</p>
//               </div>
//               <Phone className="w-8 h-8 text-purple-600" />
//             </div>
//           </div>
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-yellow-600 text-sm font-medium">Appointments</p>
//                 <p className="text-2xl font-bold text-yellow-700">18</p>
//               </div>
//               <Calendar className="w-8 h-8 text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         {/* Calls List */}
//         <div className="bg-white rounded-xl shadow-sm border">
//           <div className="p-6 border-b">
//             <h3 className="text-xl font-semibold">Recent Calls/Chats</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handled By</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Details</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {calls.map((call) => (
//                   <tr key={call.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                           <User className="w-5 h-5 text-gray-600" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="font-medium text-gray-900">{call.userName}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{call.reason}</td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         call.handledBy === 'AI' 
//                           ? 'bg-blue-100 text-blue-800' 
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {call.handledBy}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         call.status === 'completed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {call.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900">
//                       {call.appointmentDetails && (
//                         <div>
//                           <div>{call.appointmentDetails.date} at {call.appointmentDetails.time}</div>
//                           <div className="text-xs text-gray-500">{call.appointmentDetails.doctor}</div>
//                         </div>
//                       )}
//                     </td>
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

// export default CallsManagement;
import React from 'react';
import Sidebar from './Sidebar'; // Import your Sidebar
import Navbar from './Navbar';   // Import Navbar
import { User, Phone, Calendar, Bot, UserCheck } from 'lucide-react';

const CallsManagement = ({ calls }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-100">
        {/* Navbar */}
        <Navbar />

        <div className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Calls/Chat Management</h2>
            <p className="text-gray-600">Monitor calls and chats handled by AI and human agents</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">AI Handled</p>
                  <p className="text-2xl font-bold text-blue-700">24</p>
                </div>
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Human Handled</p>
                  <p className="text-2xl font-bold text-green-700">12</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Calls</p>
                  <p className="text-2xl font-bold text-purple-700">36</p>
                </div>
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Appointments</p>
                  <p className="text-2xl font-bold text-yellow-700">18</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Calls List */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Recent Calls/Chats</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handled By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calls.map((call) => (
                    <tr key={call.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{call.userName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{call.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          call.handledBy === 'AI' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {call.handledBy}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          call.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {call.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {call.appointmentDetails && (
                          <div>
                            <div>{call.appointmentDetails.date} at {call.appointmentDetails.time}</div>
                            <div className="text-xs text-gray-500">{call.appointmentDetails.doctor}</div>
                          </div>
                        )}
                      </td>
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

export default CallsManagement;
