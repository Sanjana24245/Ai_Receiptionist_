
// import React from 'react';
// import Sidebar from '../../components/Sidebar'; // Import your Sidebar
// import Navbar from '../../components/Navbar';
// import { 
//   MessageSquare, 
//   Bot, 
//   UserCheck, 
//   Calendar,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Users,
//   Settings,
//   DollarSign
// } from 'lucide-react';

// const AdminDashboard = () => {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}


//         {/* Dashboard Content */}
//         <div className="p-6 flex-1">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
//             <p className="text-gray-600">Full system overview and administrative controls</p>
//           </div>

//           {/* Top Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium">Total Calls/Chats</p>
//                   <p className="text-3xl font-bold text-gray-900">1560</p>
//                   <p className="text-sm text-green-600">↑ 12% from last month</p>
//                 </div>
//                 <MessageSquare className="w-8 h-8 text-blue-500" />
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium">AI Handled</p>
//                   <p className="text-3xl font-bold text-gray-900">1240</p>
//                   <p className="text-sm text-blue-600">79.5% success rate</p>
//                 </div>
//                 <Bot className="w-8 h-8 text-green-500" />
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium">Human Handled</p>
//                   <p className="text-3xl font-bold text-gray-900">320</p>
//                   <p className="text-sm text-yellow-600">20.5% of total</p>
//                 </div>
//                 <UserCheck className="w-8 h-8 text-yellow-500" />
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-600 text-sm font-medium">Appointments</p>
//                   <p className="text-3xl font-bold text-gray-900">890</p>
//                   <p className="text-sm text-purple-600">57% conversion rate</p>
//                 </div>
//                 <Calendar className="w-8 h-8 text-purple-500" />
//               </div>
//             </div>
//           </div>

//           {/* Admin Specific Metrics */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold mb-4">User & Sub-admin Management</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <Users className="w-5 h-5 text-blue-500" />
//                     <span className="text-sm font-medium">Total Users</span>
//                   </div>
//                   <span className="text-lg font-bold text-blue-600">1,245</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <Users className="w-5 h-5 text-green-500" />
//                     <span className="text-sm font-medium">Total Sub-admins</span>
//                   </div>
//                   <span className="text-lg font-bold text-green-600">23</span>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <DollarSign className="w-5 h-5 text-yellow-500" />
//                     <span className="text-sm font-medium">Revenue Generated</span>
//                   </div>
//                   <span className="text-lg font-bold text-yellow-600">$12,430</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold mb-4">System Alerts & Tasks</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <AlertCircle className="w-5 h-5 text-red-500" />
//                     <span className="text-sm font-medium">Critical Alerts</span>
//                   </div>
//                   <span className="text-lg font-bold text-red-600">5</span>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//                   <div className="flex items-center space-x-3">
//                     <Settings className="w-5 h-5 text-purple-500" />
//                     <span className="text-sm font-medium">Pending Admin Tasks</span>
//                   </div>
//                   <span className="text-lg font-bold text-purple-600">7</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Monthly Trends & KPIs */}
//           <div className="mt-8 bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-semibold mb-4">Monthly Trends & KPIs</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
//               <div>
//                 <div className="text-2xl font-bold text-blue-600">1,247</div>
//                 <div className="text-sm text-gray-500">Total Interactions</div>
//                 <div className="text-xs text-green-500">↑ 18% vs last month</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-green-600">892</div>
//                 <div className="text-sm text-gray-500">Successful Appointments</div>
//                 <div className="text-xs text-green-500">↑ 24% vs last month</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-purple-600">4.8/5</div>
//                 <div className="text-sm text-gray-500">Patient Satisfaction</div>
//                 <div className="text-xs text-green-500">↑ 0.3 vs last month</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-yellow-600">23</div>
//                 <div className="text-sm text-gray-500">New Sub-admins</div>
//                 <div className="text-xs text-green-500">↑ 15% vs last month</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
   
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { 
  MessageSquare, 
  Bot, 
  UserCheck, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Settings,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:8000/appointments"); // backend URL
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Derived counts
  const totalAppointments = appointments.length;
  const aiHandled = appointments.filter(a => a.type === "AI").length;
  const humanHandled = appointments.filter(a => a.type === "human").length;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}

      {/* Dashboard Content */}
      <div className="p-6 flex-1">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Full system overview and administrative controls</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Calls/Chats</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : totalAppointments}
                </p>
                <p className="text-sm text-green-600">↑ 12% from last month</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">AI Handled</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : aiHandled}
                </p>
                <p className="text-sm text-blue-600">
                  {loading ? "" : `${((aiHandled / (totalAppointments || 1)) * 100).toFixed(1)}% success rate`}
                </p>
              </div>
              <Bot className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Human Handled</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : humanHandled}
                </p>
                <p className="text-sm text-yellow-600">
                  {loading ? "" : `${((humanHandled / (totalAppointments || 1)) * 100).toFixed(1)}% of total`}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Appointments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : totalAppointments}
                </p>
                <p className="text-sm text-purple-600">57% conversion rate</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Admin Specific Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">User & Sub-admin Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">Total Users</span>
                </div>
                <span className="text-lg font-bold text-blue-600">1,245</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Total Sub-admins</span>
                </div>
                <span className="text-lg font-bold text-green-600">23</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium">Revenue Generated</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">$12,430</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">System Alerts & Tasks</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">Critical Alerts</span>
                </div>
                <span className="text-lg font-bold text-red-600">5</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium">Pending Admin Tasks</span>
                </div>
                <span className="text-lg font-bold text-purple-600">7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends & KPIs */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends & KPIs</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-500">Total Interactions</div>
              <div className="text-xs text-green-500">↑ 18% vs last month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">892</div>
              <div className="text-sm text-gray-500">Successful Appointments</div>
              <div className="text-xs text-green-500">↑ 24% vs last month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">4.8/5</div>
              <div className="text-sm text-gray-500">Patient Satisfaction</div>
              <div className="text-xs text-green-500">↑ 0.3 vs last month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">23</div>
              <div className="text-sm text-gray-500">New Sub-admins</div>
              <div className="text-xs text-green-500">↑ 15% vs last month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
