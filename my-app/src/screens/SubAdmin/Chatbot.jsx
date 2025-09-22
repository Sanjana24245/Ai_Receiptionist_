
// import React, { useEffect, useState, useRef } from "react";
// // If you have auth, take it from login
// const SUBADMIN_ID = authUser?.id || `subadmin_${Math.floor(Math.random() * 1000)}`;

// // const SUBADMIN_ID = "sub1"; // unique for this subadmin
// const WS_URL = `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`;



// function App() {
//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]); // list of connected user ids
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({}); // userId -> [{...}]
//   const [outText, setOutText] = useState("");
//   const messagesEndRef = useRef();

//   useEffect(() => {
//     const socket = new WebSocket(WS_URL);
//     socket.onopen = () => {
//       console.log("Connected as receptionist");
//     };
// socket.onmessage = (ev) => {
//   const msg = JSON.parse(ev.data);

//   if (msg.type === "users_list") {
//     setUsers(msg.users);  // user list stays updated
//   } else if (msg.type === "chat") {
//     const from = msg.sender_id;  // user ID
//     setMessagesByUser(prev => {
//       const copy = {...prev};
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });
//   }
// };


//     socket.onclose = () => {
//       console.log("WS closed");
//     };
//     setWs(socket);
//     return () => socket.close();
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

// //   function selectUser(u) {
// //   setSelectedUser(u);
// //   setMessagesByUser(prev => ({ ...prev, [u]: prev[u] ?? [] }));

// //   fetch(`http://localhost:8000/chat/${u}`)
// //     .then(res => res.json())
// //     .then(data => {
// //       setMessagesByUser(prev => ({ ...prev, [u]: data.messages || [] }));
// //     })
// //     .catch(err => console.error("Failed to load chat history", err));
// // }
// function selectUser(userId) {
//   setSelectedUser(userId);
//   setMessagesByUser(prev => ({ ...prev, [userId]: prev[userId] ?? [] }));

//   fetch(`http://localhost:8000/chat/${userId}`)
//     .then(res => res.json())
//     .then(data => {
//       setMessagesByUser(prev => ({ ...prev, [userId]: data.messages || [] }));
//     })
//     .catch(err => console.error("Failed to load chat history", err));
// }


//   function sendMessage() {
//     if (!selectedUser || !outText.trim()) return;
//    const payload = {
//   type: "chat",
//   from: "subadmin",
//   sender_id: SUBADMIN_ID,
//   to: selectedUser,  // user ID
//   content: outText,
//   timestamp: new Date().toISOString(),
// };
// ws.send(JSON.stringify(payload));

//     // also add locally to conversation
//     setMessagesByUser(prev => {
//       const copy = {...prev};
//       copy[selectedUser] = [...(copy[selectedUser]||[]), payload];
//       return copy;
//     });
//     setOutText("");
//   }

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {/* {users.map(u => (
//             <div key={u}
//               onClick={() => selectUser(u)}
//               style={{
//                 padding: 8,
//                 marginBottom: 6,
//                 borderRadius: 6,
//                 background: u === selectedUser ? "#eef" : "#fff",
//                 cursor: "pointer",
//                 boxShadow: "0 0 1px rgba(0,0,0,0.1)"
//               }}>
//               <strong>{u}</strong>
//               <div style={{ fontSize: 12, color: "#666" }}>{(messagesByUser[u] || []).length} msgs</div>
//             </div>
//           ))} */}
//           {users.map(u => (
//   <div key={u.id}
//        onClick={() => selectUser(u.id)}
//        style={{
//          padding: 8,
//          marginBottom: 6,
//          borderRadius: 6,
//          background: u.id === selectedUser ? "#eef" : "#fff",
//          cursor: "pointer",
//          boxShadow: "0 0 1px rgba(0,0,0,0.1)"
//        }}>
//     <strong>{u.username}</strong>  {/* show username */}
//     <div style={{ fontSize: 12, color: "#666" }}>
//       {(messagesByUser[u.id] || []).length} msgs
//     </div>
//   </div>
// ))}

//         </div>
//       </div>

//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Receptionist Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser ? `Chatting with ${selectedUser}` : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).map((m, idx) => (
//               <div key={idx} style={{
//                 display: "flex",
//                 justifyContent: m.from === "subadmin" ? "flex-end" : "flex-start",
//                 marginBottom: 8
//               }}>
//                 <div style={{
//                   maxWidth: "70%",
//                   padding: 10,
//                   borderRadius: 10,
//                   background: m.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
//                   fontSize: 14
//                 }}>
//                   <div style={{fontSize:12, color:"#333"}}>
//   {m.text || m.content}
// </div>

//                   <div style={{fontSize:10, color:"#666", marginTop:6}}>{new Date(m.timestamp).toLocaleString()}</div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div style={{ color: "#666" }}>No chat selected</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div style={{ display: "flex", padding: 12, borderTop: "1px solid #eee" }}>
//           <input
//             value={outText}
//             onChange={e => setOutText(e.target.value)}
//             placeholder={selectedUser ? `Message ${selectedUser}` : "Select a user first"}
//             disabled={!selectedUser}
//             style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
//             onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
//           />
//           <button onClick={sendMessage} disabled={!selectedUser} style={{ marginLeft: 8, padding: "8px 12px" }}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext); // get logged-in subadmin
//   const SUBADMIN_ID = user?.id;

//   const WS_URL = `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [outText, setOutText] = useState("");
//   const messagesEndRef = useRef();
//   const [unreadCounts, setUnreadCounts] = useState({});
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(WS_URL);

//     socket.onopen = () => {
//       console.log("Connected as subadmin:", SUBADMIN_ID);
//     };

//     socket.onmessage = (ev) => {
//       const msg = JSON.parse(ev.data);

//       if (msg.type === "users_list") {
//         setUsers(msg.users);
//       } else if (msg.type === "chat") {
//         const from = msg.sender_id;
//         setMessagesByUser((prev) => {
//           const copy = { ...prev };
//           if (!copy[from]) copy[from] = [];
//           copy[from] = [...copy[from], msg];
//           return copy;
//         });
//         // Increment unread count if user not selected
//     if (from !== selectedUser) {
//       setUnreadCounts(prev => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1
//       }));
//     }
//   } else if (msg.type === "unread_counts") {
//     setUnreadCounts(msg.counts);
//   }
// };
      
    

//     socket.onclose = () => {
//       console.log("WS closed");
//     };

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   function selectUser(userId) {
//     setSelectedUser(userId);
//     setMessagesByUser((prev) => ({ ...prev, [userId]: prev[userId] ?? [] }));

//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setMessagesByUser((prev) => ({ ...prev, [userId]: data.messages || [] }));
//       })
//       .catch((err) => console.error("Failed to load chat history", err));
//   }

//   function sendMessage() {
//     if (!selectedUser || !outText.trim()) return;

//     const payload = {
//       type: "chat",
//       from: "subadmin",
//       sender_id: SUBADMIN_ID,
//       to: selectedUser,
//       content: outText,
//       timestamp: new Date().toISOString(),
//     };

//     ws.send(JSON.stringify(payload));

//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       copy[selectedUser] = [...(copy[selectedUser] || []), payload];
//       return copy;
//     });

//     setOutText("");
//   }

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}

//           {users.map((u) => (
//             <div
//               key={u.id}
//               onClick={() => selectUser(u.id)}
//               style={{
//                 padding: 8,
//                 marginBottom: 6,
//                 borderRadius: 6,
//                 background: u.id === selectedUser ? "#eef" : "#fff",
//                 cursor: "pointer",
//                 boxShadow: "0 0 1px rgba(0,0,0,0.1)",
//               }}
//             >
//               <strong>{u.username}</strong>
//               <div style={{ fontSize: 12, color: "#666" }}>
//                 {(messagesByUser[u.id] || []).length} msgs
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser ? `Chatting with ${selectedUser}` : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).map((m, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   justifyContent: m.from === "subadmin" ? "flex-end" : "flex-start",
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: "70%",
//                     padding: 10,
//                     borderRadius: 10,
//                     background: m.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div style={{ fontSize: 12, color: "#333" }}>{m.content}</div>
//                   <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                     {new Date(m.timestamp).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div style={{ color: "#666" }}>No chat selected</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div style={{ display: "flex", padding: 12, borderTop: "1px solid #eee" }}>
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={selectedUser ? `Message ${selectedUser}` : "Select a user first"}
//             disabled={!selectedUser}
//             style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") sendMessage();
//             }}
//           />
//           <button
//             onClick={sendMessage}
//             disabled={!selectedUser}
//             style={{ marginLeft: 8, padding: "8px 12px" }}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubadminChat;
import React, { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function SubadminChat() {
  const { user } = useContext(AuthContext); // get logged-in subadmin
  const SUBADMIN_ID = user?.id;

  const WS_URL = `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`;

  const [ws, setWs] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesByUser, setMessagesByUser] = useState({});
  const [outText, setOutText] = useState("");
  const messagesEndRef = useRef();
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!SUBADMIN_ID) return;

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("Connected as subadmin:", SUBADMIN_ID);
    };

    socket.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);

      if (msg.type === "users_list") {
        setUsers(msg.users);
      } else if (msg.type === "chat") {
        const from = msg.sender_id;

        setMessagesByUser((prev) => {
          const copy = { ...prev };
          if (!copy[from]) copy[from] = [];
          copy[from] = [...copy[from], msg];
          return copy;
        });

        // Increment unread count if user not selected
        if (from !== selectedUser) {
          setUnreadCounts((prev) => ({
            ...prev,
            [from]: (prev[from] || 0) + 1,
          }));
        }
      } else if (msg.type === "unread_counts") {
        setUnreadCounts(msg.counts);
      }
    };

    socket.onclose = () => {
      console.log("WS closed");
    };

    setWs(socket);
    return () => socket.close();
  }, [SUBADMIN_ID, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByUser, selectedUser]);

  function selectUser(userId) {
    setSelectedUser(userId);
    setMessagesByUser((prev) => ({ ...prev, [userId]: prev[userId] ?? [] }));

    // Reset unread count when user is selected
    setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));

    fetch(`http://localhost:8000/chat/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessagesByUser((prev) => ({ ...prev, [userId]: data.messages || [] }));
      })
      .catch((err) => console.error("Failed to load chat history", err));
  }

  function sendMessage() {
    if (!selectedUser || !outText.trim()) return;

    const payload = {
      type: "chat",
      from: "subadmin",
      sender_id: SUBADMIN_ID,
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

    setOutText("");
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* Users List */}
      <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
        <h3>Connected Users</h3>
        <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {users.length === 0 && <div>No users connected</div>}

          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => selectUser(u.id)}
              style={{
                padding: 8,
                marginBottom: 6,
                borderRadius: 6,
                background: u.id === selectedUser ? "#eef" : "#fff",
                cursor: "pointer",
                boxShadow: "0 0 1px rgba(0,0,0,0.1)",
              }}
            >
              <strong>{u.username}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>
                {unreadCounts[u.id] > 0
                  ? `${unreadCounts[u.id]} new`
                  : `${(messagesByUser[u.id] || []).length} msgs`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
          <h2>Subadmin Chat</h2>
          <div style={{ fontSize: 13, color: "#666" }}>
            {selectedUser
              ? `Chatting with ${selectedUser}`
              : "Select a user to chat"}
          </div>
        </div>

        <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
          {selectedUser ? (
            (messagesByUser[selectedUser] || []).map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    m.from === "subadmin" ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: 10,
                    borderRadius: 10,
                    background: m.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#333" }}>{m.content}</div>
                  <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
                    {new Date(m.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#666" }}>No chat selected</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{ display: "flex", padding: 12, borderTop: "1px solid #eee" }}
        >
          <input
            value={outText}
            onChange={(e) => setOutText(e.target.value)}
            placeholder={
              selectedUser ? `Message ${selectedUser}` : "Select a user first"
            }
            disabled={!selectedUser}
            style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!selectedUser}
            style={{ marginLeft: 8, padding: "8px 12px" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubadminChat;
