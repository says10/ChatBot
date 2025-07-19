import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/chat"; // Change to 3001 if your backend runs there

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const lastMsgRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // No JS animation, rely on CSS for 3D effects
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const history = [];
      for (let i = 0; i < newMessages.length - 1; i += 2) {
        if (newMessages[i] && newMessages[i + 1]) {
          history.push([newMessages[i].text, newMessages[i + 1].text]);
        }
      }
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input, history }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: "bot", text: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient">
      <div className="chat-card css-3d">
        <h2 className="chat-title">🤖 AI Chatbot</h2>
        <div className="chat-history">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === "user" ? "chat-bubble user-bubble css-3d-bubble" : "chat-bubble bot-bubble css-3d-bubble"
              }
            >
              <span
                className="bubble-text"
                ref={idx === messages.length - 1 ? lastMsgRef : null}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <div className="chat-bubble bot-bubble css-3d-bubble"><span className="bubble-text">Thinking...</span></div>}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-input-row" onSubmit={sendMessage} autoComplete="off">
          <input
            className="chat-input"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button className="send-btn" type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App; 