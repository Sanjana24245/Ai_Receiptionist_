
import React, { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import Navbar from "../../components/Navbar"; // import Navbar

function SubadminChat() {
  const { user } = useContext(AuthContext);
  const SUBADMIN_ID = user?.id;

  const [ws, setWs] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesByUser, setMessagesByUser] = useState({});
  const { unreadCounts, setUnreadCounts } = useContext(NotificationContext);
  const [lastMessages, setLastMessages] = useState({});
  const [outText, setOutText] = useState("");

  const messagesEndRef = useRef(null);

  // ---------------- WebSocket Setup ----------------
  useEffect(() => {
    if (!SUBADMIN_ID) return;

    const socket = new WebSocket(
      `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
    );

    socket.onopen = async () => {
      console.log("✅ Subadmin connected:", SUBADMIN_ID);

      try {
        const resUsers = await fetch(`http://localhost:8000/chat/users`);
        const usersData = await resUsers.json();

        const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
        const lastData = await resLast.json();
        const lastMsgs = lastData.last_messages || {};
        setLastMessages(lastMsgs);

        const mergedUsers = (usersData.users || []).map((u) => ({
          ...u,
          lastMessage: lastMsgs[u.id] || null,
        }));
        setUsers(mergedUsers);
      } catch (err) {
        console.error("❌ Failed to fetch users or last messages", err);
      }
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat") handleIncomingMessage(msg);
      if (msg.type === "users_list") {
        const merged = (msg.users || []).map((u) => ({
          ...u,
          lastMessage: lastMessages[u.id] || null,
        }));
        setUsers(merged);
      }
    };

    socket.onclose = () => console.log("❌ WebSocket closed");

    setWs(socket);
    return () => socket.close();
  }, [SUBADMIN_ID]);

  useEffect(() => {
    localStorage.setItem("subadmin_unread_counts", JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByUser, selectedUser]);

  // ---------------- Handle incoming messages ----------------
  function handleIncomingMessage(msg) {
    const from = msg.sender_id;

    setMessagesByUser((prev) => {
      const copy = { ...prev };
      if (!copy[from]) copy[from] = [];
      copy[from] = [...copy[from], msg];
      return copy;
    });

    setLastMessages((prev) => ({
      ...prev,
      [from]: msg,
    }));

    setUsers((prev) =>
    prev.map((u) =>
      u.id === from
        ? { ...u, lastMessage: msg, username: msg.sender_name || u.username }
        : u
    )
  );
    if (from !== selectedUser) {
      setUnreadCounts((prev) => ({
        ...prev,
        [from]: (prev[from] || 0) + 1,
      }));
    }
  }

  // ---------------- Select user ----------------
  function selectUser(userId) {
    setSelectedUser(userId);

    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: 0,
    }));

    fetch(`http://localhost:8000/chat/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        let chatMessages = data.messages || [];

        // if (chatMessages.length === 0 && lastMessages[userId]) {
        //   chatMessages = [lastMessages[userId]];
        // }

        setMessagesByUser((prev) => ({
          ...prev,
          [userId]: chatMessages,
        }));

        if (chatMessages.length > 0) {
          setLastMessages((prev) => ({
            ...prev,
            [userId]: chatMessages[chatMessages.length - 1],
          }));
        }

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      })
      .catch((err) => console.error("❌ Failed to load chat history", err));
  }

  // ---------------- Send message ----------------
  function sendMessage() {
    if (!selectedUser || !outText.trim() || !ws) return;

    const payload = {
      type: "chat",
      from: "subadmin",
      sender_id: SUBADMIN_ID,
      sender_name: user?.username || user?.name || "Subadmin",
      to: selectedUser,
      content: outText,
      timestamp: new Date().toISOString(),
    };

    ws.send(JSON.stringify(payload));

    setMessagesByUser((prev) => {
      const copy = { ...prev };
      copy[selectedUser] = [...(copy[selectedUser] || []), payload];
      return copy;
    });

    setLastMessages((prev) => ({
      ...prev,
      [selectedUser]: payload,
    }));

    setUsers((prev) => prev.map((u) => (u.id === selectedUser ? { ...u, lastMessage: payload } : u)));

    setOutText("");
  }

  // ---------------- Open chat from Navbar notifications ----------------
  const openChatWithUser = (userId) => {
    selectUser(userId);
  };

  // ---------------- Sidebar - Users List ----------------
  const renderUserList = () => {
    const sortedUsers = [...users].sort((a, b) => {
      const aUnread = unreadCounts[a.id] || 0;
      const bUnread = unreadCounts[b.id] || 0;
      if (aUnread !== bUnread) return bUnread - aUnread;

      const aLast = (a.lastMessage || lastMessages[a.id])?.timestamp || 0;
      const bLast = (b.lastMessage || lastMessages[b.id])?.timestamp || 0;
      return new Date(bLast) - new Date(aLast);
    });

    return sortedUsers.map((u) => {
      const lastMsg = u.lastMessage || lastMessages[u.id] || null;
      const isFromMe = lastMsg?.from === "subadmin";
      const preview = lastMsg?.content && isFromMe ? `You: ${lastMsg.content}` : lastMsg?.content || "No messages yet";

      return (
        <div
          key={u.id}
          onClick={() => selectUser(u.id)}
          style={{
            padding: "10px 12px",
            marginBottom: 6,
            borderRadius: 6,
            background: u.id === selectedUser ? "#eef" : "#fff",
            cursor: "pointer",
            boxShadow: "0 0 2px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{u.username}</strong>
            {lastMsg?.timestamp && (
              <span style={{ fontSize: 11, color: "#999" }}>
                {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#555",
              marginTop: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {preview}
          </div>

          {unreadCounts[u.id] > 0 && (
            <div
              style={{
                marginTop: 4,
                display: "inline-block",
                background: "red",
                color: "white",
                fontSize: 12,
                borderRadius: "50%",
                padding: "2px 6px",
              }}
            >
              {unreadCounts[u.id]}
            </div>
          )}
        </div>
      );
    });
  };

  const renderSingleMessage = (msg) => (
    <div
      style={{
        display: "flex",
        justifyContent: msg.from === "subadmin" ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: 10,
          borderRadius: 10,
          background: msg.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
          fontSize: 14,
        }}
      >
        <div>{msg.content}</div>
        <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
          {new Date(msg.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* Navbar with notifications */}
      {/* <div >
        <Navbar users={users} openChatWithUser={openChatWithUser} />
      </div> */}

      {/* Sidebar */}
      <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12, marginTop: 60 }}>
        <h3>Connected Users</h3>
        <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {users.length === 0 && <div>No users connected</div>}
          {renderUserList()}
        </div>
      </div>

      {/* Chat Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: 60 }}>
        <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
         {selectedUser ? (
  (() => {
    const msgs = messagesByUser[selectedUser] || [];
    
    // ✅ Sirf messagesByUser se hi messages dikhao
    if (msgs.length > 0) {
      return msgs.map((m, idx) => renderSingleMessage(m));
    } else {
      return (
        <div style={{ color: "#666", textAlign: "center", padding: "40px" }}>
          No messages yet
        </div>
      );
    }
  })()
) : (
  <div style={{ color: "#666", textAlign: "center", padding: "40px" }}>
    Select a user to start chatting
  </div>
)}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: "flex", padding: 12, borderTop: "1px solid #eee" }}>
          <input
            value={outText}
            onChange={(e) => setOutText(e.target.value)}
            placeholder={
              selectedUser ? `Message ${users.find((u) => u.id === selectedUser)?.username || selectedUser}` : "Select a user first"
            }
            disabled={!selectedUser}
            style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage} disabled={!selectedUser} style={{ marginLeft: 8, padding: "8px 12px" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubadminChat;
