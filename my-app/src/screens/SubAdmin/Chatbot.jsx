
import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function SubAdminPage() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
const subadminId = user?.id; 
  // Fetch all chats for subadmin
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`http://192.168.1.49:8000/subadmin/${subadminId}/chats`, { headers: { Authorization: `Bearer ${token}` }})

        setChats(res.data.chats);
      } catch (err) {
        console.log("❌ Fetch chats error:", err.message);
      }
    };
    fetchChats();
  }, [user._id, user.token]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://192.168.1.49:8000/chat/${activeChat.id}/messages`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.log("❌ Fetch messages error:", err.message);
      }
    };
    fetchMessages();
  }, [activeChat, user.token]);

  // WebSocket connection for active chat
  useEffect(() => {
    if (!activeChat) return;

    const wsUrl = `ws://192.168.1.49:8000/chat/ws/${activeChat.id}?token=${user.token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("✅ SubAdmin WS connected");
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "new_message") {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.log("❌ Error parsing message:", err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.log("❌ WS error:", err.message);
      setIsConnected(false);
    };

    socketRef.current.onclose = () => {
      console.log("❌ WS closed");
      setIsConnected(false);
    };

    return () => socketRef.current?.close();
  }, [activeChat, user.token]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;

    

    // Try WebSocket first
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
  socketRef.current.send(
  JSON.stringify({
    chat_id: activeChat.id,
    text: input.trim(),
    sender_id: subadminId,
    receiver_id: activeChat.user_id
  })
);



    } else {
      // Fallback to HTTP
      axios
        .post(
          `http://192.168.1.49:8000/chat/${activeChat.id}/message`,
          {
            sender_id: user._id,
            sender_role: "subadmin",
            text: input.trim(),
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .catch((err) => console.log("❌ Error sending message:", err));
    }

    // Optimistic UI update
    const tempMsg = {
      _id: Date.now().toString(),
      sender_id: user._id,
      sender_role: "subadmin",
      sender_name: user.name || "SubAdmin",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar with chats */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ddd",
          padding: 10,
          overflowY: "auto",
        }}
      >
        <h3>Active Users</h3>
        {chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              padding: 10,
              cursor: "pointer",
              background:
                activeChat?._id === chat.id ? "#eee" : "transparent",
              borderRadius: 6,
              marginBottom: 6,
            }}
            onClick={() => setActiveChat(chat)}
          >
            {chat.user_name || chat.user_id}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeChat ? (
          <>
            {/* Status bar */}
            <div
              style={{
                padding: 8,
                backgroundColor: "#f0f0f0",
                borderBottom: "1px solid #ddd",
              }}
            >
              Chat with: {activeChat.user_name || activeChat.user_id} | Status:{" "}
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 16,
                backgroundColor: "#fafafa",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    textAlign: msg.sender_role === "subadmin" ? "right" : "left",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor:
                        msg.sender_role === "subadmin" ? "#3b82f6" : "#e9ecef",
                      color: msg.sender_role === "subadmin" ? "#fff" : "#000",
                      padding: 12,
                      borderRadius: 18,
                      maxWidth: "70%",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    {msg.sender_name} •{" "}
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 10,
                borderTop: "1px solid #ddd",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 24,
                  border: "1px solid #ccc",
                  fontSize: 16,
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: 8,
                  padding: "12px 20px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  borderRadius: 24,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p style={{ padding: 20 }}>👈 Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}
