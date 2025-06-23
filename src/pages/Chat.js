import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import profileImage from "../assets/images/profile.png";
import "./styles/Chat.css";
import { IoSend } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import logo from "../assets/images/omnio-logo.png";

export const Chat = () => {
  const userId = localStorage.getItem("user");
  const friendId = localStorage.getItem("id");
  const friendName = localStorage.getItem("name");
  const myUsername = localStorage.getItem("username");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  // const [unread, setUnread] = useState(0);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const newSocket = io(
      process.env.REACT_APP_SERVER || "http://localhost:5000"
    );
    setSocket(newSocket);

    // Join private room
    newSocket.emit("joinRoom", { userId, friendId });

    // Fetch chat history
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}/messages/${userId}/${friendId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setMessages(res.data.messages);

        // setUnread(res.data.unread);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
      });

    // Listen for new messages
    newSocket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [userId, friendId]);

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (socket && message.trim()) {
      socket.emit("privateMessage", {
        from: userId,
        to: friendId,
        content: message,
        username: myUsername,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Only for scrolling, not for socket logic

  return (
    <div className="chat-page">
      <img src={logo} alt="Omnio-logo" className="omnio-logo" />
      <div className="friend-name">
        <button className="back-button" onClick={() => window.history.back()}>
          <IoMdArrowRoundBack />
        </button>
        <img src={profileImage} alt="" className="chat-avatar" />
        {friendName}

        {/* {unread > 0 && <span className="unread-count">{unread}</span>} */}
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.from === userId ? "sent" : "received"}`}
            ref={idx === messages.length - 1 ? lastMessageRef : null}
          >
            <span className="message-text">{msg.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message here..."
            className="chat-input-field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="send-button">
            <IoSend />
          </button>
        </div>
      </form>
    </div>
  );
};
