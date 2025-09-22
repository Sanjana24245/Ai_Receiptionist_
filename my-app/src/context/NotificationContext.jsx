import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    // 🟢 Connect WebSocket (replace with your server URL)
    const ws = new WebSocket(`ws://localhost:8000/ws?role=subadmin&client_id=${user.id}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "chat") {
          console.log("💬 New chat message:", msg);
          // optionally update chat state here
        }

        if (msg.type === "unread_counts") {
          console.log("🔔 Unread counts:", msg.counts);
          // sum all counts
          const total = Object.values(msg.counts).reduce((a, b) => a + b, 0);
          setUnreadCount(total);
        }

        if (msg.type === "users_list") {
          console.log("👥 Active users list:", msg.users);
        }
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => ws.close();
  }, [user]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
