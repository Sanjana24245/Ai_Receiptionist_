import React, { useState, useEffect, useRef, useContext } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext"
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const { unreadCounts } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // 🔔 Future me API se notifications aayenge
  const notifications = [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout + redirect
  const handleLogout = () => {
    logout();
    navigate("/login"); // logout hone ke baad login page pe bhej do
  };
const handleClickUser = (userId) => {
    setShowNotifications(false);
    openChatWithUser(userId); // callback to open chat
  };
  return (
    <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6 relative">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell size={22} className="text-gray-600 hover:text-blue-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 z-50">
              <p className="px-4 py-2 font-semibold text-gray-700 border-b">
                Notifications
              </p>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <p
                    key={n.id}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    {n.text}
                  </p>
                ))
              ) : (
                <p className="px-4 py-2 text-sm text-gray-400">
                  No new notifications
                </p>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
       {user && (
  <div className="relative" ref={profileRef}>
    <button
      onClick={() => setShowProfile(!showProfile)}
      className="flex items-center space-x-2 hover:text-blue-600"
    >
      <User size={22} className="text-gray-700" />
      {/* ✅ user ka name yaha */}
      <span className="hidden md:inline text-sm">{user.name}</span>
    </button>

    {showProfile && (
      <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-3 z-50">
        <div className="px-4 pb-2 border-b">
          <p className="font-semibold text-gray-800">{user.username}</p>
          {user.number && (
            <p className="text-xs text-gray-500">{user.number}</p>
          )}
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    )}
  </div>
)}

      </div>
    </div>
  );
};

export default Navbar;
