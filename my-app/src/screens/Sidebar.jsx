
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  UserCheck, 
  Calendar,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarTabs = [
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 />, path: '/AnalyticsDashboard' },
    { id: 'doctors', name: 'Doctors', icon: <UserCheck />, path: '/DoctorManagement' },
    { id: 'patients', name: 'Patients', icon: <UserCheck />, path: '/PatientManagement' },
    { id: 'calls', name: 'Calls', icon: <MessageSquare />, path: '/CallsManagement' },
    { id: 'appointment', name: 'Appointment', icon: <Calendar />, path: '/Appointment' }, // ✅ Added Appointment
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Toggle Button */}
      <button 
        className="p-2 m-2 bg-gray-700 rounded hover:bg-gray-600"
        onClick={toggleSidebar}
      >
        {isCollapsed ? '➡' : '⬅'}
      </button>

      {/* Tabs */}
      <nav className="flex-1">
        {sidebarTabs.map(tab => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center p-3 m-2 rounded hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-700' : ''
              }`
            }
          >
            <span className="w-6 h-6">{tab.icon}</span>
            {!isCollapsed && <span className="ml-3">{tab.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
