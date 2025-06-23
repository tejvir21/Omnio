import "./styles/Community.css";
import profileImage from "../assets/images/profile.png";
import { IoSend } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import logo from "../assets/images/omnio-logo.png";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader } from "../components/loader";

export const Community = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const lastMessageRef = useRef(null);

  useEffect(() => {
    const newSocket = io(
      `${process.env.REACT_APP_SERVER}` || "http://localhost:5000"
    );
    setSocket(newSocket);

    setIsLoading(true);

    // Fetch chat history
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/community/messages`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessages(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
      });

    // Listen for new community messages

    newSocket.on("communityMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (socket && message.trim()) {
      socket.emit("communityMessage", {
        message_from: localStorage.getItem("user"),
        message: message,
        username: localStorage.getItem("username"),
      });
      setMessage("");
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Only for scrolling, not for socket logic

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="community-page">
        <img src={logo} alt="Omnio-logo" className="omnio-logo" />

        <div className="community-title">
          <button className="back-button" onClick={() => window.history.back()}>
            <IoMdArrowRoundBack />
          </button>
          <img src={logo} alt="" className="community-chat-avatar" />
          Omnio Community
        </div>
        <p className="community-description">
          Welcome to the community page!
          <br />
          Here you can find discussions related to our community.
        </p>

        <div className="community-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`community-message ${msg.message_from._id === localStorage.getItem("user") || msg.message_from === localStorage.getItem("user") ? "sent-to-community" : "received-at-community"}`} ref={index === messages.length - 1 ? lastMessageRef : null}>
              <span className="message-content" >
                <img src={profileImage} alt="" className="chat-avatar" />
              <span className="message-text">{msg.message}</span>
              </span>
              <p className="sender-name">
                - message from <strong>{msg.message_from._id === localStorage.getItem("user") || msg.message_from === localStorage.getItem("user") ? "You" : msg.message_from.username || msg.username}</strong>
              </p>
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
      {/* <BottomNav /> */}
    </>
  );
};
