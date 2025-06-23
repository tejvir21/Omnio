import { AddNewFriends } from "../components/AddFriends";
import { BottomNav } from "../components/BottomNav";
import "./styles/AddFriends.css";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Rqts } from "../components/Requests";

export const AddFriends = () => {

    const [state, setState] = useState({
    addFriends: true,
    requests: false,
  });
  
  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users/public`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching friends:",
        error.response || error.message || error
      );
      toast.error("Failed to fetch users. Please try again later.");
      return [];
    }
  };


  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/friends/requests`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching friend requests:",
        error.response || error.message || error
      );
      toast.error(
        (error.response && error.response.data && error.response.data.message) ||
          "Failed to fetch friend requests. Please try again later."
      );
      return [];
    }
  };

  return (
    <>
      <nav className="add-friends-navbar">
        <span
          onClick={() =>
            setState({
              addFriends: true,
              requests: false,
            })
          }
        >
          Add Friends
        </span>
        <span
          onClick={() =>
            setState({
              requests: true,
              addFriends: false,
            })
          }
        >
          Requests
        </span>
      </nav>

      {state.addFriends && (
        <AddNewFriends
          fetchFriends={fetchFriends}
        />
      )}

      {state.requests && <Rqts fetchRequests={fetchRequests} />}

      <BottomNav />

      <ToastContainer />
    </>
  );
};
