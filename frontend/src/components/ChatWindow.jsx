import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useRef, useEffect } from "react";
import styles from "./ChatWindow.module.css";

const ChatWindow = () => {
  const { selectedUser, messages, sendMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return <div className={styles.empty}>Select a contact to start chatting</div>;
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
  };

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.header}>
        <img
          src={selectedUser.profilePic || "https://via.placeholder.com/40"}
          alt={selectedUser.fullName}
          className={styles.avatar}
        />
        <div>
          <div className={styles.userName}>{selectedUser.fullName}</div>
          <div className={styles.status}>
            {selectedUser.isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg) => {
          const isMine = msg.senderId === authUser._id;
          return (
            <div
              key={msg._id}
              className={`${styles.messageRow} ${
                isMine ? styles.mine : styles.other
              }`}
            >
              <div className={styles.messageBubble}>
                {msg.text}
              </div>
              <div className={styles.messageMeta}>
                <span className={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMine && (
                  <span className={styles.seenIcon}>
                    {msg.seen ? "✔✔" : "✔"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className={styles.inputForm}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className={styles.inputBox}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
