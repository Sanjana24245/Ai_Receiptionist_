import { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ user, ws, children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ API se fetch initial count
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8000/notifications/unread/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.unread || 0))
      .catch((err) => console.error("Error fetching unread count", err));
  }, [user]);

  // ✅ WebSocket se real-time update
  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "chat" && msg.receiver_id === user.id) {
        setUnreadCount((prev) => prev + 1);
      }
      if (msg.type === "mark_read" && msg.receiver_id === user.id) {
        setUnreadCount(0); // reset jab read ho jaye
      }
    };
  }, [ws, user]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
