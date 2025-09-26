
import React, { useState, useEffect, useRef, useContext } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";

const Navbar = ({ openChatWithUser }) => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCounts, lastMessages, users } = useContext(NotificationContext);

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Total unread messages
  const totalUnread = Object.values(unreadCounts || {}).reduce((a, b) => a + b, 0);

  // 🔹 Build notifications list
  const notifications = Object.entries(unreadCounts || {})
    .filter(([_, count]) => count > 0)
    .map(([userId, count]) => {
      const u = (users || []).find((u) => u.id === userId) || {};
      const name = u.username || lastMessages?.[userId]?.sender_name || "Unknown";
      return {
        id: userId,
        text: `${count} new message${count > 1 ? "s" : ""} from ${name}`,
        userId,
      };
    });

  // 🔹 Close dropdowns on outside click
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

  // 🔹 Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 Open chat from notification
  const handleClickUser = (userId) => {
    setShowNotifications(false);
    openChatWithUser(userId);
  };

  return (
    <div className="bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600">🏥 HealthCare</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6 relative">
        {/* 🔔 Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell size={22} className="text-gray-600 hover:text-blue-600" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {totalUnread}
              </span>
            )}
          </button>

          {/* Dropdown */}
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
                    onClick={() => handleClickUser(n.userId)}
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

        {/* 👤 Profile */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 hover:text-blue-600"
            >
              <User size={22} className="text-gray-700" />
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
