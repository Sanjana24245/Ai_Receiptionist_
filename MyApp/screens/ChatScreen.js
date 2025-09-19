import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const { width } = Dimensions.get("window");

export default function ChatScreen() {
  const { user } = useContext(AuthContext); // ✅ user & token from context
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const flatListRef = useRef();

  // 1️⃣ Start chat (create chat if not exists)
  useEffect(() => {
    if (!user?.token) return;

    const startChat = async () => {
      try {
        const res = await axios.post(
          "http://192.168.1.49:8000/chat/start",
          { mode: "human" },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setChatId(res.data.chat.id);
      } catch (err) {
        console.log("❌ Start chat error:", err.message);
        Alert.alert("Error", "Failed to start chat. Please try again.");
      }
    };

    startChat();
  }, [user?.token]);

  // 2️⃣ Fetch previous messages
  useEffect(() => {
    if (!chatId || !user?.token) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://192.168.1.49:8000/chat/${chatId}/messages`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.log("❌ Fetch messages error:", err.message);
      }
    };

    fetchMessages();
  }, [chatId, user?.token]);

  // 3️⃣ WebSocket connection
  useEffect(() => {
    if (!chatId || !user?.token) return;

    const wsUrl = `ws://192.168.1.49:8000/chat/ws/${chatId}?token=${user.token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("✅ Connected to chat server");
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "new_message") {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.log("❌ WS parse error:", err);
      }
    };

    socketRef.current.onerror = (err) => {
      console.log("❌ WS error:", err.message);
      setIsConnected(false);
    };

    socketRef.current.onclose = () => setIsConnected(false);

    return () => socketRef.current?.close();
  }, [chatId, user?.token]);

  // 4️⃣ Send message
  const sendMessage = () => {
    if (!inputText.trim() || !chatId) return;

    const tempMsg = {
      _id: Date.now().toString(),
      text: inputText.trim(),
      sender_id: user._id,
      sender_role: user.role || "user",
      sender_name: user.username || "You",
      timestamp: new Date().toISOString(),
    };

    // ✅ Show instantly on UI
    setMessages((prev) => [...prev, tempMsg]);
    setInputText("");

    // ✅ Send via WebSocket if open
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
  JSON.stringify({
    chat_id: chatId,
    text: inputText.trim(),
    sender_id: user._id,
    receiver_id: activeChat?.subadmin_id || null
  })
);

      console.log("📤 Sent via WebSocket:", tempMsg);
    } else {
      // ✅ Fallback: send via HTTP
      axios
        .post(
          `http://192.168.1.49:8000/chat/${chatId}/message`,
          tempMsg,
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then(() => console.log("📤 Sent via HTTP"))
        .catch((err) =>
          console.log("❌ Error sending message:", err.message)
        );
    }
  };

  // 🔹 Render each message
  const renderMessage = ({ item }) => {
    const isUser = item.sender_id === user._id;
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={isUser ? styles.userMessageText : styles.otherMessageText}
          >
            {item.text}
          </Text>
        </View>
        <Text style={styles.senderName}>
          {isUser ? "You" : item.sender_name || "Receptionist"}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {isConnected ? "Connected ✅" : "Connecting..."}
        </Text>
        {chatId && (
          <Text style={styles.chatIdText}>Chat ID: {chatId.substring(0, 8)}...</Text>
        )}
      </View>

      {/* 🔹 Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderMessage}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={styles.messagesList}
      />

      {/* 🔹 Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          style={styles.textInput}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={styles.sendButton}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 8 },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    marginBottom: 8,
  },
  statusText: { fontSize: 14, color: "#6200EE" },
  chatIdText: { fontSize: 12, color: "#666" },
  messagesList: { padding: 8 },
  messageContainer: { marginBottom: 16, maxWidth: width * 0.8 },
  userMessageContainer: { alignSelf: "flex-end" },
  otherMessageContainer: { alignSelf: "flex-start" },
  messageBubble: { padding: 12, borderRadius: 18, marginBottom: 4 },
  userMessageBubble: { backgroundColor: "#6200EE" },
  otherMessageBubble: { backgroundColor: "#e9ecef" },
  userMessageText: { color: "#fff", fontSize: 16 },
  otherMessageText: { color: "#000", fontSize: 16 },
  senderName: { fontSize: 12, color: "#666" },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#6200EE",
    borderRadius: 20,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
});
