import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      // Send to FastAPI
      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: input,
      });

      // Add bot response
      setMessages([
        ...newMessages,
        { sender: "bot", text: res.data.bot },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error connecting to server" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white p-4 rounded-2xl shadow-md flex flex-col">
        <h2 className="text-xl font-bold text-center mb-4">🤖 Chatbot</h2>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 border p-2 rounded-lg">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-1 p-2 rounded-lg max-w-[75%] ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500 text-white text-right"
                  : "mr-auto bg-gray-200 text-black text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
