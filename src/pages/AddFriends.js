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
      toast.error(error.response.data.message || "Failed to fetch users. Please try again later.", {
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
        error.response.data.message ||
          "Failed to fetch friend requests. Please try again later.", {
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
           }
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
