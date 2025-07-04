import "./styles/TopNav.css";
import { IoNotificationsSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import logo from "../assets/images/omnio-logo.png";
import { Loader } from "./loader";

export const TopNav = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/notifications`,
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        setNotifications(response.data);

        setIsLoading(false);

        response.data.length &&
          toast.info(`You have ${response.data.length} new notifications!`, {
              draggable: true,
              autoClose: 3000,
              closeButton: false,
              closeOnClick: true,
              draggablePercent: 30,
              theme: "colored",
              hideProgressBar: true,
              style: {
                borderRadius: "30px",
                width: "fit-content",
                maxWidth: "100vw",
                overflow: "clip",
                color: "#000",
                fontWeight: 700,
              },
           });
      } else {
        setIsLoading(false);

        console.log("No notifications found.");
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/notifications/${notificationId}`,
        {},
        {
          withCredentials: true,
        }
      );

      setNotifications([response.data, ...notifications]);

      if (response.data.type === "message") {
        const friendUsername = response.data.message.split(" ")[3];
        const friend = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/users/username`,
          { friendUsername },
          {
            withCredentials: true,
          }
        );

        localStorage.setItem("id", friend.data._id);
        localStorage.setItem("name", friend.data.name);
        localStorage.setItem("friend", friendUsername);
        localStorage.setItem("profile_image", friend.data.profile_image);

        setIsLoading(false);

        window.location.href = "/chat";
      } else if (response.data.type === "friend_request") {
        setIsLoading(false);

        window.location.href = "/search";
      } else if (response.data.type === "community") {
        setIsLoading(false);

        window.location.href = "/community";
      }
    } catch (error) {
      setIsLoading(false);

      console.log("Error in reading message", error);
    }
  };

  // const handleAllNotificationClick = async () => {
  //     try {
  //         await axios
  //         .post(`${process.env.REACT_APP_SERVER_URL}/notifications/mark-all-as-read`, {}, {
  //             withCredentials: true
  //         })

  //     } catch (error) {
  //         console.log("Error in reading message", error)
  //     }
  // }

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".notifications-icon") &&
        !event.target.closest(".notification-dropdown")
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-left">
          <img src={logo} alt="omnio-logo" className="app-logo" />
          <span className="app-title">Omnio</span>
        </div>
        <span
          className="notifications-icon"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <IoNotificationsSharp className="notification-icon" />
          <span className="notification-count">{notifications.length}</span>
        </span>
      </div>
      <ToastContainer />
      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`notification-item ${
                  notification.isRead ? "fade" : ""
                }`}
                onClick={() => handleNotificationClick(notification._id)}
              >
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <p className="no-notifications">No new notifications</p>
          )}
        </div>
      )}
    </>
  );
};
