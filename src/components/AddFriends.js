import { useEffect, useState } from "react";
import "./styles/AddFriends.css";
import { Loader } from "./loader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import profileImage from "../assets/images/profile.png";

export const AddNewFriends = ({ fetchFriends }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendFriendRequest = async (friendId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/request`,
        { friendId },
        { withCredentials: true }
      );

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== friendId)
      );

      toast.success("Friend request sent successfully!", {
        draggable: true,
        closeButton: false,
        closeOnClick: true,
      });
    } catch (error) {
      console.error(
        "Error sending friend request:",
        error.response || error.message || error
      );
      toast.error(
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
          "Failed to send friend request. Please try again.", {
        draggable: true,
        closeButton: false,
        closeOnClick: true,
      }
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const getFriends = async () => {
      const data = await fetchFriends();
      setUsers(Array.isArray(data) ? data : []);
    };
    getFriends();

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="add-friends-container">
        <h1 className="add-friends-title">Add Friends</h1>
        <input
          type="text"
          className="add-friends-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for friends..."
        />

        <div className="add-friends-results">
          {users
            .filter((user) =>
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((user) => (
              <div key={user._id} className="add-friend-item">
                <div className="friend-profile">
                  <img
                    src={user.profile_image || profileImage}
                    alt={`${user.username}'s profile image`}
                    className="add-friend-avatar"
                  />
                  <span className="add-friend-username">{user.username}</span>
                </div>
                <button
                  className="add-friend-button"
                  onClick={() => sendFriendRequest(user._id)}
                >
                  Add Friend
                </button>
              </div>
            ))}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};
