
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
//         if (from !== selectedUser) {
//           setUnreadCounts((prev) => ({
//             ...prev,
//             [from]: (prev[from] || 0) + 1,
//           }));
//         }
//       } else if (msg.type === "unread_counts") {
//         setUnreadCounts(msg.counts);
//       }
//     };

//     socket.onclose = () => {
//       console.log("WS closed");
//     };

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID, selectedUser]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   function selectUser(userId) {
//     setSelectedUser(userId);
//     setMessagesByUser((prev) => ({ ...prev, [userId]: prev[userId] ?? [] }));

//     // Reset unread count when user is selected
//     setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));

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
//       {/* Users List */}
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
//                 {unreadCounts[u.id] > 0
//                   ? `${unreadCounts[u.id]} new`
//                   : `${(messagesByUser[u.id] || []).length} msgs`}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${selectedUser}`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).map((m, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     m.from === "subadmin" ? "flex-end" : "flex-start",
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

//         <div
//           style={{ display: "flex", padding: 12, borderTop: "1px solid #eee" }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser ? `Message ${selectedUser}` : "Select a user first"
//             }
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









































// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext); // logged-in subadmin
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]); // connected users
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // WebSocket Setup
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(
//       `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//     );

//     socket.onopen = () => {
//       console.log("✅ Subadmin connected:", SUBADMIN_ID);
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);

//       switch (msg.type) {
//         case "users_list":
//           setUsers(msg.users);
//           break;

//         case "chat":
//           handleIncomingMessage(msg);
//           break;

//         case "unread_counts":
//           setUnreadCounts(msg.counts);
//           break;

//         default:
//           console.warn("⚠️ Unknown message type:", msg.type);
//       }
//     };

//     socket.onclose = () => {
//       console.log("❌ WebSocket closed");
//     };

//     setWs(socket);

//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   // Auto-scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // Handle incoming messages
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     // Increment unread count if not in current chat
//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));
//     }
//   }

//   // Select user for chat
//   function selectUser(userId) {
//     setSelectedUser(userId);

//     // Reset unread count for this user
//     setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));

//     // Fetch chat history
//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setMessagesByUser((prev) => ({
//           ...prev,
//           [userId]: data.messages || [],
//         }));
//       })
//       .catch((err) => console.error("❌ Failed to load chat history", err));
//   }

//   // Send message
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

//     const payload = {
//       type: "chat",
//       from: "subadmin",
//       sender_id: SUBADMIN_ID,
//       to: selectedUser,
//       content: outText,
//       timestamp: new Date().toISOString(),
//     };

//     ws.send(JSON.stringify(payload));

//     // Add to UI immediately
//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       copy[selectedUser] = [...(copy[selectedUser] || []), payload];
//       return copy;
//     });

//     setOutText("");
//   }

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar - Users List */}
//       {/* <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
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
//                 {unreadCounts[u.id] > 0
//                   ? `${unreadCounts[u.id]} new`
//                   : `${(messagesByUser[u.id] || []).length} msgs`}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div> */}
//   {/* Sidebar - Users List */}
// <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//   <h3>Connected Users</h3>
//   <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//     {users.length === 0 && <div>No users connected</div>}

//     {users.map((u) => {
//       const msgs = messagesByUser[u.id] || [];
//       const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: 8,
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 1px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>

//             {/* 🔔 Show unread badge */}
//             {unreadCounts[u.id] > 0 && (
//               <span
//                 style={{
//                   background: "red",
//                   color: "white",
//                   fontSize: 12,
//                   borderRadius: "50%",
//                   padding: "2px 6px",
//                 }}
//               >
//                 {unreadCounts[u.id]}
//               </span>
//             )}
//           </div>

//           {/* 📝 Last message preview */}
//           <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
//             {lastMsg ? lastMsg.content : "No messages yet"}
//           </div>
//         </div>
//       );
//     })}
//   </div>
// </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {/* Chat Header */}
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${users.find((u) => u.id === selectedUser)?.username || selectedUser}`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         {/* Chat Messages */}
//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).map((m, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     m.from === "subadmin" ? "flex-end" : "flex-start",
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
//                   <div>{m.content}</div>
//                   <div
//                     style={{ fontSize: 10, color: "#666", marginTop: 6 }}
//                   >
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

//         {/* Input Box */}
//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${users.find((u) => u.id === selectedUser)?.username || selectedUser}`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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
// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext); // logged-in subadmin
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]); // connected users
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [lastMessages, setLastMessages] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // ---------------- WebSocket Setup ----------------
//   // useEffect(() => {
//   //   if (!SUBADMIN_ID) return;

//   //   const socket = new WebSocket(
//   //     `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//   //   );

//   //   socket.onopen = async () => {
//   //     console.log("✅ Subadmin connected:", SUBADMIN_ID);

//   //     // Fetch initial unread counts
//   //     try {
//   //       const res = await fetch(
//   //         `http://localhost:8000/chat/unread_counts/${SUBADMIN_ID}`
//   //       );
//   //       const data = await res.json();
//   //       setUnreadCounts(data.counts || {});
//   //     } catch (err) {
//   //       console.error("❌ Failed to fetch unread counts", err);
//   //     }

//   //     // Fetch last messages for all users
//   //     try {
//   //       const res = await fetch(`http://localhost:8000/chat/last_messages`);
//   //       const data = await res.json();
//   //       setLastMessages(data.last_messages || {}); // { user_id: last_message_obj }
//   //     } catch (err) {
//   //       console.error("❌ Failed to fetch last messages", err);
//   //     }
//   //   };

//   //   socket.onmessage = (event) => {
//   //     const msg = JSON.parse(event.data);

//   //     switch (msg.type) {
//   //       case "users_list":
//   //         setUsers(msg.users);
//   //         break;

//   //       case "chat":
//   //         handleIncomingMessage(msg);
//   //         break;

//   //       case "unread_counts":
//   //         setUnreadCounts(msg.counts);
//   //         break;

//   //       default:
//   //         console.warn("⚠️ Unknown message type:", msg.type);
//   //     }
//   //   };

//   //   socket.onclose = () => {
//   //     console.log("❌ WebSocket closed");
//   //   };

//   //   setWs(socket);

//   //   return () => socket.close();
//   // }, [SUBADMIN_ID]);
// useEffect(() => {
//   if (!SUBADMIN_ID) return;

//   const socket = new WebSocket(
//     `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//   );

//   socket.onopen = async () => {
//     console.log("✅ Subadmin connected:", SUBADMIN_ID);

//     try {
//       // Fetch connected users
//       const resUsers = await fetch(`http://localhost:8000/chat/users`);
//       const usersData = await resUsers.json();
//       setUsers(usersData.users || []);

//       // Fetch last messages for all users
//       const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
//       const lastData = await resLast.json();
//       setLastMessages(lastData.last_messages || {}); 
//     } catch (err) {
//       console.error("❌ Failed to fetch users or last messages", err);
//     }
//   };

//   socket.onmessage = (event) => {
//     const msg = JSON.parse(event.data);
//     if (msg.type === "chat") handleIncomingMessage(msg);
//     if (msg.type === "users_list") setUsers(msg.users);
//     if (msg.type === "unread_counts") setUnreadCounts(msg.counts);
//   };

//   socket.onclose = () => console.log("❌ WebSocket closed");

//   setWs(socket);
//   return () => socket.close();
// }, [SUBADMIN_ID]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // ---------------- Handle incoming messages ----------------
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     // Update messages
//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     // Update last message
//     setLastMessages((prev) => ({
//       ...prev,
//       [from]: msg,
//     }));

//     // Increment unread count if not in current chat
//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));
//     }
//   }

//   // ---------------- Select user ----------------
//   // function selectUser(userId) {
//   //   setSelectedUser(userId);

//   //   // Reset unread count
//   //   setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));

//   //   // Fetch chat history
//   //   fetch(`http://localhost:8000/chat/${userId}`)
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       setMessagesByUser((prev) => ({
//   //         ...prev,
//   //         [userId]: data.messages || [],
//   //       }));

//   //       // Update last message too
//   //       if (data.messages && data.messages.length > 0) {
//   //         setLastMessages((prev) => ({
//   //           ...prev,
//   //           [userId]: data.messages[data.messages.length - 1],
//   //         }));
//   //       }
//   //     })
//   //     .catch((err) => console.error("❌ Failed to load chat history", err));
//   // }
// function selectUser(userId) {
//   setSelectedUser(userId);

//   // Reset unread count
//   setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));

//   // Fetch chat history
//   fetch(`http://localhost:8000/chat/${userId}`)
//     .then((res) => res.json())
//     .then((data) => {
//       const chatMessages = data.messages || [];

//       setMessagesByUser((prev) => ({
//         ...prev,
//         [userId]: chatMessages,
//       }));

//       // Update last message immediately
//       if (chatMessages.length > 0) {
//         setLastMessages((prev) => ({
//           ...prev,
//           [userId]: chatMessages[chatMessages.length - 1],
//         }));
//       }

//       // Scroll to bottom after setting messages
//       setTimeout(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//       }, 50);
//     })
//     .catch((err) => console.error("❌ Failed to load chat history", err));
// }

//   // ---------------- Send message ----------------
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

//     const payload = {
//       type: "chat",
//       from: "subadmin",
//       sender_id: SUBADMIN_ID,
//       to: selectedUser,
//       content: outText,
//       timestamp: new Date().toISOString(),
//     };

//     ws.send(JSON.stringify(payload));

//     // Update messages and last message
//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       copy[selectedUser] = [...(copy[selectedUser] || []), payload];
//       return copy;
//     });

//     setLastMessages((prev) => ({
//       ...prev,
//       [selectedUser]: payload,
//     }));

//     setOutText("");
//   }

//   // ---------------- Sidebar - Users List ----------------
//   const renderUserList = () =>
//     users.map((u) => {
//       const lastMsg = lastMessages[u.id] || null;

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: 8,
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 1px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>

//             {unreadCounts[u.id] > 0 && (
//               <span
//                 style={{
//                   background: "red",
//                   color: "white",
//                   fontSize: 12,
//                   borderRadius: "50%",
//                   padding: "2px 6px",
//                 }}
//               >
//                 {unreadCounts[u.id]}
//               </span>
//             )}
//           </div>

//           <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
//   {lastMessages[u.id]?.content || "No messages yet"}
// </div>

//         </div>
//       );
//     });

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {renderUserList()}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${
//                   users.find((u) => u.id === selectedUser)?.username ||
//                   selectedUser
//                 }`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).map((m, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     m.from === "subadmin" ? "flex-end" : "flex-start",
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
//                   <div>{m.content}</div>
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

//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${
//                     users.find((u) => u.id === selectedUser)?.username ||
//                     selectedUser
//                   }`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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
// import React, { useEffect, useState, useRef, useContext } from "react"; 
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext);
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [lastMessages, setLastMessages] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // ---------------- WebSocket Setup ----------------
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(
//       `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//     );

//     socket.onopen = async () => {
//       console.log("✅ Subadmin connected:", SUBADMIN_ID);

//       try {
//         // Fetch connected users
//         const resUsers = await fetch(`http://localhost:8000/chat/users`);
//         const usersData = await resUsers.json();
//         setUsers(usersData.users || []);

//         // Fetch last messages for all users
//         const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
//         const lastData = await resLast.json();
//         setLastMessages(lastData.last_messages || {});
//       } catch (err) {
//         console.error("❌ Failed to fetch users or last messages", err);
//       }
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === "chat") handleIncomingMessage(msg);
//       if (msg.type === "users_list") setUsers(msg.users);
//       if (msg.type === "unread_counts") setUnreadCounts(msg.counts);
//     };

//     socket.onclose = () => console.log("❌ WebSocket closed");

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // ---------------- Handle incoming messages ----------------
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     // 1️⃣ Update messages
//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     // 2️⃣ Update last message
//     setLastMessages((prev) => ({
//       ...prev,
//       [from]: msg,
//     }));

//     // 3️⃣ Increment unread count automatically if not currently selected
//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));

//       // 4️⃣ Move the user to the top by reordering users array
//       setUsers((prev) => {
//         const copy = prev.filter((u) => u.id !== from);
//         const newUser = prev.find((u) => u.id === from);
//         if (newUser) copy.unshift(newUser);
//         return copy;
//       });
//     }
//   }

//   // ---------------- Select user ----------------
//   function selectUser(userId) {
//     setSelectedUser(userId);

//     // Reset unread count
//     setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));

//     // Fetch chat history
//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const chatMessages = data.messages || [];

//         setMessagesByUser((prev) => ({
//           ...prev,
//           [userId]: chatMessages,
//         }));

//         if (chatMessages.length > 0) {
//           setLastMessages((prev) => ({
//             ...prev,
//             [userId]: chatMessages[chatMessages.length - 1],
//           }));
//         }

//         setTimeout(() => {
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 50);
//       })
//       .catch((err) => console.error("❌ Failed to load chat history", err));
//   }

//   // ---------------- Send message ----------------
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

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

//     setLastMessages((prev) => ({
//       ...prev,
//       [selectedUser]: payload,
//     }));

//     setOutText("");
//   }

//   // ---------------- Sidebar - Users List ----------------
//   const renderUserList = () => {
//     // Sort users: unread count descending, then last message timestamp descending
//     const sortedUsers = [...users].sort((a, b) => {
//       const aUnread = unreadCounts[a.id] || 0;
//       const bUnread = unreadCounts[b.id] || 0;
//       if (aUnread !== bUnread) return bUnread - aUnread;

//       const aLast = lastMessages[a.id]?.timestamp || 0;
//       const bLast = lastMessages[b.id]?.timestamp || 0;
//       return new Date(bLast) - new Date(aLast);
//     });

//     return sortedUsers.map((u) => {
//       const lastMsg = lastMessages[u.id] || null;

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: 8,
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 1px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>

//             {unreadCounts[u.id] > 0 && (
//               <span
//                 style={{
//                   background: "red",
//                   color: "white",
//                   fontSize: 12,
//                   borderRadius: "50%",
//                   padding: "2px 6px",
//                 }}
//               >
//                 {unreadCounts[u.id]}
//               </span>
//             )}
//           </div>

//           <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
//             {lastMsg?.content || ""}
//           </div>
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {renderUserList()}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${
//                   users.find((u) => u.id === selectedUser)?.username || selectedUser
//                 }`
//               : "Select a user to chat"}
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
//                   <div>{m.content}</div>
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

//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${
//                     users.find((u) => u.id === selectedUser)?.username || selectedUser
//                   }`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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
// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext);
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [unreadCounts, setUnreadCounts] = useState(() => {
//     // Load from localStorage
//     const saved = localStorage.getItem("subadmin_unread_counts");
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [lastMessages, setLastMessages] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // ---------------- WebSocket Setup ----------------
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(
//       `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//     );

//     socket.onopen = async () => {
//       console.log("✅ Subadmin connected:", SUBADMIN_ID);

//       try {
//         // Fetch connected users
//         const resUsers = await fetch(`http://localhost:8000/chat/users`);
//         const usersData = await resUsers.json();
//         setUsers(usersData.users || []);

//         // Fetch last messages for all users
//         const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
//         const lastData = await resLast.json();
//         setLastMessages(lastData.last_messages || {});
//       } catch (err) {
//         console.error("❌ Failed to fetch users or last messages", err);
//       }
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === "chat") handleIncomingMessage(msg);
//       if (msg.type === "users_list") setUsers(msg.users);
//     };

//     socket.onclose = () => console.log("❌ WebSocket closed");

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   // Save unreadCounts in localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("subadmin_unread_counts", JSON.stringify(unreadCounts));
//   }, [unreadCounts]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // ---------------- Handle incoming messages ----------------
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     // 1️⃣ Update messages
//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     // 2️⃣ Update last message
//     setLastMessages((prev) => ({
//       ...prev,
//       [from]: msg,
//     }));

//     // 3️⃣ Increment unread count automatically if not currently selected
//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));

//       // 4️⃣ Move the user to the top by reordering users array
//       setUsers((prev) => {
//         const copy = prev.filter((u) => u.id !== from);
//         const newUser = prev.find((u) => u.id === from);
//         if (newUser) copy.unshift(newUser);
//         return copy;
//       });
//     }
//   }

//   // ---------------- Select user ----------------
//   function selectUser(userId) {
//     setSelectedUser(userId);

//     // Reset unread count ONLY for this user
//     setUnreadCounts((prev) => {
//       const updated = { ...prev, [userId]: 0 };
//       localStorage.setItem("subadmin_unread_counts", JSON.stringify(updated));
//       return updated;
//     });

//     // Fetch chat history
//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const chatMessages = data.messages || [];

//         setMessagesByUser((prev) => ({
//           ...prev,
//           [userId]: chatMessages,
//         }));

//         if (chatMessages.length > 0) {
//           setLastMessages((prev) => ({
//             ...prev,
//             [userId]: chatMessages[chatMessages.length - 1],
//           }));
//         }

//         setTimeout(() => {
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 50);
//       })
//       .catch((err) => console.error("❌ Failed to load chat history", err));
//   }

//   // ---------------- Send message ----------------
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

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

//     setLastMessages((prev) => ({
//       ...prev,
//       [selectedUser]: payload,
//     }));

//     setOutText("");
//   }

//   // ---------------- Sidebar - Users List ----------------
//   const renderUserList = () => {
//     // Sort users: unread count descending, then last message timestamp descending
//     const sortedUsers = [...users].sort((a, b) => {
//       const aUnread = unreadCounts[a.id] || 0;
//       const bUnread = unreadCounts[b.id] || 0;
//       if (aUnread !== bUnread) return bUnread - aUnread;

//       const aLast = lastMessages[a.id]?.timestamp || 0;
//       const bLast = lastMessages[b.id]?.timestamp || 0;
//       return new Date(bLast) - new Date(aLast);
//     });

//     return sortedUsers.map((u) => {
//       const lastMsg = lastMessages[u.id] || null;

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: 8,
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 1px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>

//             {unreadCounts[u.id] > 0 && (
//               <span
//                 style={{
//                   background: "red",
//                   color: "white",
//                   fontSize: 12,
//                   borderRadius: "50%",
//                   padding: "2px 6px",
//                 }}
//               >
//                 {unreadCounts[u.id]}
//               </span>
//             )}
//           </div>

//           <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
//             {lastMsg?.content || ""}
//           </div>
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {renderUserList()}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${
//                   users.find((u) => u.id === selectedUser)?.username ||
//                   selectedUser
//                 }`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).map((m, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     m.from === "subadmin" ? "flex-end" : "flex-start",
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
//                   <div>{m.content}</div>
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

//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${
//                     users.find((u) => u.id === selectedUser)?.username ||
//                     selectedUser
//                   }`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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


// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext);
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [unreadCounts, setUnreadCounts] = useState(() => {
//     const saved = localStorage.getItem("subadmin_unread_counts");
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [lastMessages, setLastMessages] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // ---------------- WebSocket Setup ----------------
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(
//       `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//     );

//     socket.onopen = async () => {
//       console.log("✅ Subadmin connected:", SUBADMIN_ID);

//       try {
//         const resUsers = await fetch(`http://localhost:8000/chat/users`);
//         const usersData = await resUsers.json();
//         setUsers(usersData.users || []);

//         const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
//         const lastData = await resLast.json();
//         setLastMessages(lastData.last_messages || {});
//       } catch (err) {
//         console.error("❌ Failed to fetch users or last messages", err);
//       }
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === "chat") handleIncomingMessage(msg);
//       if (msg.type === "users_list") setUsers(msg.users);
//     };

//     socket.onclose = () => console.log("❌ WebSocket closed");

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   // Save unreadCounts in localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(
//       "subadmin_unread_counts",
//       JSON.stringify(unreadCounts)
//     );
//   }, [unreadCounts]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // ---------------- Handle incoming messages ----------------
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     setLastMessages((prev) => ({
//       ...prev,
//       [from]: msg,
//     }));

//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));

//       setUsers((prev) => {
//         const copy = prev.filter((u) => u.id !== from);
//         const newUser = prev.find((u) => u.id === from);
//         if (newUser) copy.unshift(newUser);
//         return copy;
//       });
//     }
//   }

//   // ---------------- Select user ----------------
//   function selectUser(userId) {
//     setSelectedUser(userId);

//     setUnreadCounts((prev) => {
//       const updated = { ...prev, [userId]: 0 };
//       localStorage.setItem("subadmin_unread_counts", JSON.stringify(updated));
//       return updated;
//     });

//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const chatMessages = data.messages || [];

//         setMessagesByUser((prev) => ({
//           ...prev,
//           [userId]: chatMessages,
//         }));

//         if (chatMessages.length > 0) {
//           setLastMessages((prev) => ({
//             ...prev,
//             [userId]: chatMessages[chatMessages.length - 1],
//           }));
//         }

//         setTimeout(() => {
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 50);
//       })
//       .catch((err) => console.error("❌ Failed to load chat history", err));
//   }

//   // ---------------- Send message ----------------
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

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

//     setLastMessages((prev) => ({
//       ...prev,
//       [selectedUser]: payload,
//     }));

//     setOutText("");
//   }

//   // ---------------- Sidebar - Users List ----------------
//   const renderUserList = () => {
//     const sortedUsers = [...users].sort((a, b) => {
//       const aUnread = unreadCounts[a.id] || 0;
//       const bUnread = unreadCounts[b.id] || 0;
//       if (aUnread !== bUnread) return bUnread - aUnread;

//       const aLast = lastMessages[a.id]?.timestamp || 0;
//       const bLast = lastMessages[b.id]?.timestamp || 0;
//       return new Date(bLast) - new Date(aLast);
//     });

//     return sortedUsers.map((u) => {
//       const lastMsg = lastMessages[u.id] || null;
//       const isFromMe = lastMsg?.from === "subadmin";
//       const preview =
//         lastMsg?.content && isFromMe
//           ? `You: ${lastMsg.content}`
//           : lastMsg?.content || "No messages yet";

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: "10px 12px",
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 2px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>
//             {lastMsg?.timestamp && (
//               <span style={{ fontSize: 11, color: "#999" }}>
//                 {new Date(lastMsg.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             )}
//           </div>

//           <div
//             style={{
//               fontSize: 13,
//               color: "#555",
//               marginTop: 4,
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               maxWidth: "200px",
//             }}
//           >
//             {preview}
//           </div>

//           {unreadCounts[u.id] > 0 && (
//             <div
//               style={{
//                 marginTop: 4,
//                 display: "inline-block",
//                 background: "red",
//                 color: "white",
//                 fontSize: 12,
//                 borderRadius: "50%",
//                 padding: "2px 6px",
//               }}
//             >
//               {unreadCounts[u.id]}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {renderUserList()}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${
//                   users.find((u) => u.id === selectedUser)?.username ||
//                   selectedUser
//                 }`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).length > 0 ? (
//               (messagesByUser[selectedUser] || []).map((m, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     display: "flex",
//                     justifyContent:
//                       m.from === "subadmin" ? "flex-end" : "flex-start",
//                     marginBottom: 8,
//                   }}
//                 >
//                   <div
//                     style={{
//                       maxWidth: "70%",
//                       padding: 10,
//                       borderRadius: 10,
//                       background:
//                         m.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
//                       fontSize: 14,
//                     }}
//                   >
//                     <div>{m.content}</div>
//                     <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                       {new Date(m.timestamp).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div style={{ color: "#666" }}>No messages yet</div>
//             )
//           ) : (
//             <div style={{ color: "#666" }}>No chat selected</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${
//                     users.find((u) => u.id === selectedUser)?.username ||
//                     selectedUser
//                   }`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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

// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext);
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [unreadCounts, setUnreadCounts] = useState(() => {
//     const saved = localStorage.getItem("subadmin_unread_counts");
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [lastMessages, setLastMessages] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // ---------------- WebSocket Setup ----------------
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(
//       `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//     );

//     socket.onopen = async () => {
//       console.log("✅ Subadmin connected:", SUBADMIN_ID);

//       try {
//         const resUsers = await fetch(`http://localhost:8000/chat/users`);
//         const usersData = await resUsers.json();
//         setUsers(usersData.users || []);

//         const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
//         const lastData = await resLast.json();
//         setLastMessages(lastData.last_messages || {});
//       } catch (err) {
//         console.error("❌ Failed to fetch users or last messages", err);
//       }
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === "chat") handleIncomingMessage(msg);
//       if (msg.type === "users_list") setUsers(msg.users);
//     };

//     socket.onclose = () => console.log("❌ WebSocket closed");

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   // Save unreadCounts in localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(
//       "subadmin_unread_counts",
//       JSON.stringify(unreadCounts)
//     );
//   }, [unreadCounts]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // ---------------- Handle incoming messages ----------------
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     setLastMessages((prev) => ({
//       ...prev,
//       [from]: msg,
//     }));

//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));

//       setUsers((prev) => {
//         const copy = prev.filter((u) => u.id !== from);
//         const newUser = prev.find((u) => u.id === from);
//         if (newUser) copy.unshift(newUser);
//         return copy;
//       });
//     }
//   }

//   // ---------------- Select user ----------------
//   function selectUser(userId) {
//     setSelectedUser(userId);

//     setUnreadCounts((prev) => {
//       const updated = { ...prev, [userId]: 0 };
//       localStorage.setItem("subadmin_unread_counts", JSON.stringify(updated));
//       return updated;
//     });

//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         let chatMessages = data.messages || [];

//         // fallback to lastMessage if no history
//         if (chatMessages.length === 0 && lastMessages[userId]) {
//           chatMessages = [lastMessages[userId]];
//         }

//         setMessagesByUser((prev) => ({
//           ...prev,
//           [userId]: chatMessages,
//         }));

//         if (chatMessages.length > 0) {
//           setLastMessages((prev) => ({
//             ...prev,
//             [userId]: chatMessages[chatMessages.length - 1],
//           }));
//         }

//         setTimeout(() => {
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 50);
//       })
//       .catch((err) => console.error("❌ Failed to load chat history", err));
//   }

//   // ---------------- Send message ----------------
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

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

//     setLastMessages((prev) => ({
//       ...prev,
//       [selectedUser]: payload,
//     }));

//     setOutText("");
//   }

//   // ---------------- Sidebar - Users List ----------------
//   const renderUserList = () => {
//     const sortedUsers = [...users].sort((a, b) => {
//       const aUnread = unreadCounts[a.id] || 0;
//       const bUnread = unreadCounts[b.id] || 0;
//       if (aUnread !== bUnread) return bUnread - aUnread;

//       const aLast = lastMessages[a.id]?.timestamp || 0;
//       const bLast = lastMessages[b.id]?.timestamp || 0;
//       return new Date(bLast) - new Date(aLast);
//     });

//     return sortedUsers.map((u) => {
//       const lastMsg = lastMessages[u.id] || null;
//       const isFromMe = lastMsg?.from === "subadmin";
//       const preview =
//         lastMsg?.content && isFromMe
//           ? `You: ${lastMsg.content}`
//           : lastMsg?.content || "No messages yet";

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: "10px 12px",
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 2px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>
//             {lastMsg?.timestamp && (
//               <span style={{ fontSize: 11, color: "#999" }}>
//                 {new Date(lastMsg.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             )}
//           </div>

//           <div
//             style={{
//               fontSize: 13,
//               color: "#555",
//               marginTop: 4,
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               maxWidth: "200px",
//             }}
//           >
//             {preview}
//           </div>

//           {unreadCounts[u.id] > 0 && (
//             <div
//               style={{
//                 marginTop: 4,
//                 display: "inline-block",
//                 background: "red",
//                 color: "white",
//                 fontSize: 12,
//                 borderRadius: "50%",
//                 padding: "2px 6px",
//               }}
//             >
//               {unreadCounts[u.id]}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {renderUserList()}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${
//                   users.find((u) => u.id === selectedUser)?.username ||
//                   selectedUser
//                 }`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).length > 0 ? (
//               (messagesByUser[selectedUser] || []).map((m, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     display: "flex",
//                     justifyContent:
//                       m.from === "subadmin" ? "flex-end" : "flex-start",
//                     marginBottom: 8,
//                   }}
//                 >
//                   <div
//                     style={{
//                       maxWidth: "70%",
//                       padding: 10,
//                       borderRadius: 10,
//                       background:
//                         m.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
//                       fontSize: 14,
//                     }}
//                   >
//                     <div>{m.content}</div>
//                     <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                       {new Date(m.timestamp).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : lastMessages[selectedUser] ? (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-start",
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: "70%",
//                     padding: 10,
//                     borderRadius: 10,
//                     background: "#f1f1f1",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div>{lastMessages[selectedUser].content}</div>
//                   <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                     {new Date(
//                       lastMessages[selectedUser].timestamp
//                     ).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ color: "#666" }}>No messages yet</div>
//             )
//           ) : (
//             <div style={{ color: "#666" }}>No chat selected</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${
//                     users.find((u) => u.id === selectedUser)?.username ||
//                     selectedUser
//                   }`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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
// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// function SubadminChat() {
//   const { user } = useContext(AuthContext);
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const [unreadCounts, setUnreadCounts] = useState(() => {
//     const saved = localStorage.getItem("subadmin_unread_counts");
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [lastMessages, setLastMessages] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // ---------------- WebSocket Setup ----------------
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(
//       `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//     );

//     socket.onopen = async () => {
//       console.log("✅ Subadmin connected:", SUBADMIN_ID);

//       try {
//         const resUsers = await fetch(`http://localhost:8000/chat/users`);
//         const usersData = await resUsers.json();

//         const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
//         const lastData = await resLast.json();
//         const lastMsgs = lastData.last_messages || {};
//         setLastMessages(lastMsgs);

//         // merge last messages into users
//         const mergedUsers = (usersData.users || []).map(u => ({
//           ...u,
//           lastMessage: lastMsgs[u.id] || null,
//         }));
//         setUsers(mergedUsers);
//       } catch (err) {
//         console.error("❌ Failed to fetch users or last messages", err);
//       }
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === "chat") handleIncomingMessage(msg);
//       if (msg.type === "users_list") setUsers(msg.users);
//     };

//     socket.onclose = () => console.log("❌ WebSocket closed");

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   // Save unreadCounts in localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(
//       "subadmin_unread_counts",
//       JSON.stringify(unreadCounts)
//     );
//   }, [unreadCounts]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // ---------------- Handle incoming messages ----------------
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     setLastMessages((prev) => ({
//       ...prev,
//       [from]: msg,
//     }));

//     setUsers((prev) => {
//       return prev.map(u =>
//         u.id === from ? { ...u, lastMessage: msg } : u
//       );
//     });

//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));
//     }
//   }

//   // ---------------- Select user ----------------
//   function selectUser(userId) {
//     setSelectedUser(userId);

//     setUnreadCounts((prev) => {
//       const updated = { ...prev, [userId]: 0 };
//       localStorage.setItem("subadmin_unread_counts", JSON.stringify(updated));
//       return updated;
//     });

//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         let chatMessages = data.messages || [];

//         // fallback to lastMessage if no history
//         if (chatMessages.length === 0 && lastMessages[userId]) {
//           chatMessages = [lastMessages[userId]];
//         }

//         setMessagesByUser((prev) => ({
//           ...prev,
//           [userId]: chatMessages,
//         }));

//         if (chatMessages.length > 0) {
//           setLastMessages((prev) => ({
//             ...prev,
//             [userId]: chatMessages[chatMessages.length - 1],
//           }));
//         }

//         setTimeout(() => {
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 50);
//       })
//       .catch((err) => console.error("❌ Failed to load chat history", err));
//   }

//   // ---------------- Send message ----------------
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

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

//     setLastMessages((prev) => ({
//       ...prev,
//       [selectedUser]: payload,
//     }));

//     setUsers((prev) => {
//       return prev.map(u =>
//         u.id === selectedUser ? { ...u, lastMessage: payload } : u
//       );
//     });

//     setOutText("");
//   }

//   // ---------------- Sidebar - Users List ----------------
//   const renderUserList = () => {
//     const sortedUsers = [...users].sort((a, b) => {
//       const aUnread = unreadCounts[a.id] || 0;
//       const bUnread = unreadCounts[b.id] || 0;
//       if (aUnread !== bUnread) return bUnread - aUnread;

//       const aLast = (a.lastMessage || lastMessages[a.id])?.timestamp || 0;
//       const bLast = (b.lastMessage || lastMessages[b.id])?.timestamp || 0;
//       return new Date(bLast) - new Date(aLast);
//     });

//     return sortedUsers.map((u) => {
//       const lastMsg = u.lastMessage || lastMessages[u.id] || null;
//       const isFromMe = lastMsg?.from === "subadmin";
//       const preview =
//         lastMsg?.content && isFromMe
//           ? `You: ${lastMsg.content}`
//           : lastMsg?.content || "No messages yet";

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: "10px 12px",
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 2px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>
//             {lastMsg?.timestamp && (
//               <span style={{ fontSize: 11, color: "#999" }}>
//                 {new Date(lastMsg.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             )}
//           </div>

//           <div
//             style={{
//               fontSize: 13,
//               color: "#555",
//               marginTop: 4,
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               maxWidth: "200px",
//             }}
//           >
//             {preview}
//           </div>

//           {unreadCounts[u.id] > 0 && (
//             <div
//               style={{
//                 marginTop: 4,
//                 display: "inline-block",
//                 background: "red",
//                 color: "white",
//                 fontSize: 12,
//                 borderRadius: "50%",
//                 padding: "2px 6px",
//               }}
//             >
//               {unreadCounts[u.id]}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {renderUserList()}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${
//                   users.find((u) => u.id === selectedUser)?.username ||
//                   selectedUser
//                 }`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).length > 0 ? (
//               (messagesByUser[selectedUser] || []).map((m, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     display: "flex",
//                     justifyContent:
//                       m.from === "subadmin" ? "flex-end" : "flex-start",
//                     marginBottom: 8,
//                   }}
//                 >
//                   <div
//                     style={{
//                       maxWidth: "70%",
//                       padding: 10,
//                       borderRadius: 10,
//                       background:
//                         m.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
//                       fontSize: 14,
//                     }}
//                   >
//                     <div>{m.content}</div>
//                     <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                       {new Date(m.timestamp).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : lastMessages[selectedUser] ? (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-start",
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: "70%",
//                     padding: 10,
//                     borderRadius: 10,
//                     background: "#f1f1f1",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div>{lastMessages[selectedUser].content}</div>
//                   <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                     {new Date(
//                       lastMessages[selectedUser].timestamp
//                     ).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ color: "#666" }}>No messages yet</div>
//             )
//           ) : (
//             <div style={{ color: "#666" }}>No chat selected</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${
//                     users.find((u) => u.id === selectedUser)?.username ||
//                     selectedUser
//                   }`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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


// import React, { useEffect, useState, useRef, useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import { NotificationContext } from "../../context/NotificationContext";
// function SubadminChat() {
//   const { user } = useContext(AuthContext);
//   const SUBADMIN_ID = user?.id;

//   const [ws, setWs] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messagesByUser, setMessagesByUser] = useState({});
//   const { unreadCounts, setUnreadCounts } = useContext(NotificationContext);
//   const [lastMessages, setLastMessages] = useState({});
//   const [outText, setOutText] = useState("");

//   const messagesEndRef = useRef(null);

//   // ---------------- WebSocket Setup ----------------
//   useEffect(() => {
//     if (!SUBADMIN_ID) return;

//     const socket = new WebSocket(
//       `ws://localhost:8000/ws?role=subadmin&client_id=${SUBADMIN_ID}`
//     );

//     socket.onopen = async () => {
//       console.log("✅ Subadmin connected:", SUBADMIN_ID);

//       try {
//         const resUsers = await fetch(`http://localhost:8000/chat/users`);
//         const usersData = await resUsers.json();

//         const resLast = await fetch(`http://localhost:8000/chat/last_messages`);
//         const lastData = await resLast.json();
//         const lastMsgs = lastData.last_messages || {};
//         setLastMessages(lastMsgs);

//         // ✅ Merge last messages into users so we see them immediately
//         const mergedUsers = (usersData.users || []).map(u => ({
//           ...u,
//           lastMessage: lastMsgs[u.id] || null,
//         }));
//         setUsers(mergedUsers);
//       } catch (err) {
//         console.error("❌ Failed to fetch users or last messages", err);
//       }
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === "chat") handleIncomingMessage(msg);
//       if (msg.type === "users_list") {
//         // Merge lastMessages here as well when new users list arrives
//         const merged = (msg.users || []).map(u => ({
//           ...u,
//           lastMessage: lastMessages[u.id] || null,
//         }));
//         setUsers(merged);
//       }
//     };

//     socket.onclose = () => console.log("❌ WebSocket closed");

//     setWs(socket);
//     return () => socket.close();
//   }, [SUBADMIN_ID]);

//   // Save unreadCounts in localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(
//       "subadmin_unread_counts",
//       JSON.stringify(unreadCounts)
//     );
//   }, [unreadCounts]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesByUser, selectedUser]);

//   // ---------------- Handle incoming messages ----------------
//   function handleIncomingMessage(msg) {
//     const from = msg.sender_id;

//     setMessagesByUser((prev) => {
//       const copy = { ...prev };
//       if (!copy[from]) copy[from] = [];
//       copy[from] = [...copy[from], msg];
//       return copy;
//     });

//     setLastMessages((prev) => ({
//       ...prev,
//       [from]: msg,
//     }));

//     setUsers((prev) =>
//       prev.map(u =>
//         u.id === from ? { ...u, lastMessage: msg } : u
//       )
//     );

//     if (from !== selectedUser) {
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [from]: (prev[from] || 0) + 1,
//       }));
//     }
//   }

//   // ---------------- Select user ----------------
//   function selectUser(userId) {
//     setSelectedUser(userId);

//     setUnreadCounts((prev) => ({
//     ...prev,
//     [userId]: 0, // reset unread
//   }));

//     fetch(`http://localhost:8000/chat/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         let chatMessages = data.messages || [];

//         // fallback to lastMessage if no history
//         if (chatMessages.length === 0 && lastMessages[userId]) {
//           chatMessages = [lastMessages[userId]];
//         }

//         setMessagesByUser((prev) => ({
//           ...prev,
//           [userId]: chatMessages,
//         }));

//         if (chatMessages.length > 0) {
//           setLastMessages((prev) => ({
//             ...prev,
//             [userId]: chatMessages[chatMessages.length - 1],
//           }));
//         }

//         setTimeout(() => {
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 50);
//       })
//       .catch((err) => console.error("❌ Failed to load chat history", err));
//   }

//   // ---------------- Send message ----------------
//   function sendMessage() {
//     if (!selectedUser || !outText.trim() || !ws) return;

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

//     setLastMessages((prev) => ({
//       ...prev,
//       [selectedUser]: payload,
//     }));

//     setUsers((prev) =>
//       prev.map(u =>
//         u.id === selectedUser ? { ...u, lastMessage: payload } : u
//       )
//     );

//     setOutText("");
//   }

//   // ---------------- Sidebar - Users List ----------------
//   const renderUserList = () => {
//     const sortedUsers = [...users].sort((a, b) => {
//       const aUnread = unreadCounts[a.id] || 0;
//       const bUnread = unreadCounts[b.id] || 0;
//       if (aUnread !== bUnread) return bUnread - aUnread;

//       const aLast = (a.lastMessage || lastMessages[a.id])?.timestamp || 0;
//       const bLast = (b.lastMessage || lastMessages[b.id])?.timestamp || 0;
//       return new Date(bLast) - new Date(aLast);
//     });

//     return sortedUsers.map((u) => {
//       const lastMsg = u.lastMessage || lastMessages[u.id] || null;
//       const isFromMe = lastMsg?.from === "subadmin";
//       const preview =
//         lastMsg?.content && isFromMe
//           ? `You: ${lastMsg.content}`
//           : lastMsg?.content || "No messages yet";

//       return (
//         <div
//           key={u.id}
//           onClick={() => selectUser(u.id)}
//           style={{
//             padding: "10px 12px",
//             marginBottom: 6,
//             borderRadius: 6,
//             background: u.id === selectedUser ? "#eef" : "#fff",
//             cursor: "pointer",
//             boxShadow: "0 0 2px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <strong>{u.username}</strong>
//             {lastMsg?.timestamp && (
//               <span style={{ fontSize: 11, color: "#999" }}>
//                 {new Date(lastMsg.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             )}
//           </div>

//           <div
//             style={{
//               fontSize: 13,
//               color: "#555",
//               marginTop: 4,
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               maxWidth: "200px",
//             }}
//           >
//             {preview}
//           </div>

//           {unreadCounts[u.id] > 0 && (
//             <div
//               style={{
//                 marginTop: 4,
//                 display: "inline-block",
//                 background: "red",
//                 color: "white",
//                 fontSize: 12,
//                 borderRadius: "50%",
//                 padding: "2px 6px",
//               }}
//             >
//               {unreadCounts[u.id]}
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
//         <h3>Connected Users</h3>
//         <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
//           {users.length === 0 && <div>No users connected</div>}
//           {renderUserList()}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
//           <h2>Subadmin Chat</h2>
//           <div style={{ fontSize: 13, color: "#666" }}>
//             {selectedUser
//               ? `Chatting with ${
//                   users.find((u) => u.id === selectedUser)?.username ||
//                   selectedUser
//                 }`
//               : "Select a user to chat"}
//           </div>
//         </div>

//         <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
//           {selectedUser ? (
//             (messagesByUser[selectedUser] || []).length > 0 ? (
//               (messagesByUser[selectedUser] || []).map((m, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     display: "flex",
//                     justifyContent:
//                       m.from === "subadmin" ? "flex-end" : "flex-start",
//                     marginBottom: 8,
//                   }}
//                 >
//                   <div
//                     style={{
//                       maxWidth: "70%",
//                       padding: 10,
//                       borderRadius: 10,
//                       background:
//                         m.from === "subadmin" ? "#d0f0ff" : "#f1f1f1",
//                       fontSize: 14,
//                     }}
//                   >
//                     <div>{m.content}</div>
//                     <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                       {new Date(m.timestamp).toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : lastMessages[selectedUser] ? (
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-start",
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: "70%",
//                     padding: 10,
//                     borderRadius: 10,
//                     background: "#f1f1f1",
//                     fontSize: 14,
//                   }}
//                 >
//                   <div>{lastMessages[selectedUser].content}</div>
//                   <div style={{ fontSize: 10, color: "#666", marginTop: 6 }}>
//                     {new Date(
//                       lastMessages[selectedUser].timestamp
//                     ).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ color: "#666" }}>No messages yet</div>
//             )
//           ) : (
//             <div style={{ color: "#666" }}>No chat selected</div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             padding: 12,
//             borderTop: "1px solid #eee",
//           }}
//         >
//           <input
//             value={outText}
//             onChange={(e) => setOutText(e.target.value)}
//             placeholder={
//               selectedUser
//                 ? `Message ${
//                     users.find((u) => u.id === selectedUser)?.username ||
//                     selectedUser
//                   }`
//                 : "Select a user first"
//             }
//             disabled={!selectedUser}
//             style={{
//               flex: 1,
//               padding: 10,
//               borderRadius: 6,
//               border: "1px solid #ccc",
//             }}
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
import { NotificationContext } from "../../context/NotificationContext";

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

        // Merge last messages into users
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

    setUsers((prev) => prev.map((u) => (u.id === from ? { ...u, lastMessage: msg } : u)));

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

        if (chatMessages.length === 0 && lastMessages[userId]) {
          chatMessages = [lastMessages[userId]];
        }

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
      {/* Sidebar */}
      <div style={{ width: 260, borderRight: "1px solid #ddd", padding: 12 }}>
        <h3>Connected Users</h3>
        <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {users.length === 0 && <div>No users connected</div>}
          {renderUserList()}
        </div>
      </div>

      {/* Chat Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
          <h2>Subadmin Chat</h2>
          <div style={{ fontSize: 13, color: "#666" }}>
            {selectedUser
              ? `Chatting with ${users.find((u) => u.id === selectedUser)?.username || selectedUser}`
              : "Select a user to chat"}
          </div>
        </div>

        <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
          {selectedUser ? (
            (() => {
              const msgs = messagesByUser[selectedUser] || [];
              if (msgs.length > 0) {
                return msgs.map((m, idx) => renderSingleMessage(m));
              } else if (lastMessages[selectedUser]) {
                return renderSingleMessage(lastMessages[selectedUser]);
              } else {
                return null;
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
