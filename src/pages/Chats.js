import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import "./styles/Chats.css";
import profileImage from "../assets/images/profile.png";
import { Loader } from "../components/loader";

export const Chats = () => {
  localStorage.removeItem("id");
  localStorage.removeItem("name");
  localStorage.removeItem("friend");

  if (!localStorage.getItem("user"))
    window.location.href = "/login";

  const [isLoading, setIsLoading] = useState(false);

  const letsChat = ({ friendId, friendName, friendUsername }) => {
    localStorage.setItem("id", friendId);
    localStorage.setItem("name", friendName);
    localStorage.setItem("friend", friendUsername);

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/messages/read/${friendId}`,{}, {
        withCredentials: true,
      })
      .then((response) => {
        // Redirect to the chat page
        window.location.href = "/chat";
      })
      .catch((error) => {
        console.log(error, "Error marking messages as read");
      });
  };

  const fetchFriends = async () => {
    setIsLoading(true);
    // Fetch friends from the server
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/friends`,
        {
          withCredentials: true,
        }
      );

      setIsLoading(false);

      return response.data;
    } catch (error) {
      setIsLoading(false);
      // Handle error appropriately
      console.error("Error fetching friends:", error);
      return [];
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const [chats, setChats] = useState({
    friendsIRequested: [],
    friendsRequestedMe: [],
  });

  // Filtered lists based on searchTerm
  const filteredFriendsIRequested = chats.friendsIRequested.filter(
    (user) =>
      user.request_to.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.request_to.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredFriendsRequestedMe = chats.friendsRequestedMe.filter(
    (user) =>
      user.request_from.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.request_from.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const getChats = async () => {
      const friends = await fetchFriends();
      setChats({
        friendsIRequested: friends.friendsIRequested,
        friendsRequestedMe: friends.friendsRequestedMe,
      });
    };

    getChats();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="chats-page">
      <Navbar />
      <div className="chats-container">
        <div className="search-friends">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chats-list">
          {filteredFriendsIRequested.length > 0 ||
          filteredFriendsRequestedMe.length > 0 ? (
            <>
              {filteredFriendsIRequested.map((user) => (
                <div key={user._id}>
                  <hr className="horizontal-ruler" />
                  <div
                    className="chat-item"
                    onClick={() =>
                      letsChat({
                        friendId: user.request_to._id,
                        friendName: user.request_to.name,
                        friendUsername: user.request_to.username,
                      })
                    }
                  >
                    <img src={profileImage} alt="" className="chat-avatar" />
                    <div className="user-detail">
                      <p className="chat-username">
                        {user.request_to.username}
                      </p>
                      <p className="user-name">{user.request_to.name}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredFriendsRequestedMe.map((user) => (
                <div key={user._id}>
                  <hr className="horizontal-ruler" />
                  <div
                    className="chat-item"
                    onClick={() =>
                      letsChat({
                        friendId: user.request_from._id,
                        friendName: user.request_from.name,
                        friendUsername: user.request_from.username,
                      })
                    }
                  >
                    <img src={profileImage} alt="" className="chat-avatar" />
                    <div className="user-detail">
                      <p className="chat-username">
                        {user.request_from.username}
                      </p>
                      <p className="user-name">{user.request_from.name}</p>
                    </div>
                  </div>
                </div>
              ))}
              <hr className="horizontal-ruler" />
            </>
          ) : (
            <p className="no-chats-info">No chats available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
