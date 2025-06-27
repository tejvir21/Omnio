import "./styles/TopNav.css";
import { IoNotificationsSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import logo from "../assets/images/omnio-logo.png";

export const TopNav = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/notifications`, {
                withCredentials: true,
            });

            if (response.data) {
                setNotifications(response.data);
                response.data.length && toast.info(`You have ${response.data.length} new notifications!`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    closeButton: false,
                });
            } else {
                console.log("No notifications found.");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };



    const handleNotificationClick = async (notificationId) => {
        try {
            const response = await axios
            .post(`${process.env.REACT_APP_SERVER_URL}/notifications/${notificationId}`, {}, {
                withCredentials: true
            })

            setNotifications([response.data, ...notifications])

            if (response.data.type === "message"){
                const friendUsername = response.data.message.split(" ")[3]
                const friend = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/username`, {friendUsername}, {
                withCredentials: true
            })

               localStorage.setItem("id", friend.data._id);
                localStorage.setItem("name", friend.data.name);
                localStorage.setItem("friend", friendUsername);
                localStorage.setItem("profile_image", friend.data.profile_image);

                window.location.href= "/chat"
}
else if (response.data.type === "friend_request") {
    window.location.href = "/search"
}
else if (response.data.type === "community") {
    window.location.href = "/community"
}

        } catch (error) {
            console.log("Error in reading message", error)
        }
    }


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
            if (!event.target.closest('.notifications-icon') && !event.target.closest('.notification-dropdown')) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

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
                            <div key={index} className={`notification-item ${notification.isRead ? "fade" : ""}`} onClick={() => handleNotificationClick(notification._id)}>
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