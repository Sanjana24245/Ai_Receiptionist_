// src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCounts, setUnreadCounts] = useState(() => {
    const saved = localStorage.getItem("subadmin_unread_counts");
    return saved ? JSON.parse(saved) : {};
  });

  // Total unread
  const unreadCount = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("subadmin_unread_counts", JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  return (
    <NotificationContext.Provider value={{ unreadCounts, setUnreadCounts, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
