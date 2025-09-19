
import React, { useEffect,useContext, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";



export default function App() {
    const { user } = useContext(AuthContext);  
const USER_ID = user?.id;
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [outText, setOutText] = useState("");
  const [connected, setConnected] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (!USER_ID) return; // wait until AuthContext gives user.id

    const WS_URL = `ws://192.168.1.49:8000/ws?role=user&client_id=${USER_ID}`;

    const socket = new WebSocket(WS_URL);
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected as user:", USER_ID);
      setConnected(true);
    };

    socket.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "chat") {
          setMessages((prev) => [...prev, msg]);
        }
      } catch (e) {
        console.error("Invalid message", e);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("Socket closed");
    };

    return () => socket.close();
  }, [USER_ID]);

  function sendMessage() {
    if (!outText.trim() || !ws) return;
  const payload = {
  type: "chat",
  from: "user",
  sender_id: USER_ID,
  to: "subadmin",   // just a keyword, backend knows to broadcast
  content: outText,
  timestamp: new Date().toISOString(),
};
ws.send(JSON.stringify(payload));

    setMessages((prev) => [...prev, payload]);
    setOutText("");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>User Chat ({USER_ID})</Text>
      <Text style={[styles.status, { color: connected ? "green" : "red" }]}>
        {connected ? "Connected" : "Disconnected"}
      </Text>

      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.map((m, i) => (
          <View
            key={i}
            style={[
              styles.messageWrapper,
              m.from === "user" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{m.content}</Text>
              <Text style={styles.timestamp}>
                {new Date(m.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={outText}
          onChangeText={setOutText}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  title: { textAlign: "center", fontSize: 18, fontWeight: "bold" },
  status: { textAlign: "center", marginVertical: 4 },
  messagesContainer: {
    flex: 1,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  messageWrapper: { marginBottom: 8, flexDirection: "row" },
  myMessage: { justifyContent: "flex-end" },
  otherMessage: { justifyContent: "flex-start" },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#d0f0ff",
  },
  messageText: { fontSize: 14 },
  timestamp: { fontSize: 10, color: "#666", marginTop: 4 },
  inputContainer: { flexDirection: "row", marginTop: 8 },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ccc",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 6,
    marginLeft: 8,
  },
});
