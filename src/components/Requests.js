import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./styles/Requests.css";
import axios from "axios";
import {Loader} from "./loader";

export const Rqts = ({ fetchRequests }) => {
  const [requests_to_accept, setRequestsToAccept] = useState([]);
  const [requests_to_cancel, setRequestsToCancel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getRequests = async () => {
      try {
        const result = await fetchRequests();
        setRequestsToAccept(result.requests_to_accept);
        setRequestsToCancel(result.requests_to_cancel);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        // Handle error gracefully
        toast.error(
          error.response.data.message ||
            "Failed to fetch friend requests. Please try again later."
        );
        console.error("Error fetching friend requests:", error);
      }
    };
    getRequests();
  }, [fetchRequests]);



  const acceptRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/accept`,
        { requestId },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setRequestsToAccept((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // Handle error gracefully
      toast.error(
        error.response.data.message ||
          "Failed to accept friend request. Please try again later."
      );
      console.error("Error accepting friend request:", error);
    }
  };

    const rejectRequest = async (requestId) => {
  setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/reject`,
        { requestId },
        {
          withCredentials: true,
        }
      );
      setIsLoading(false);
      toast.success(response.data.message);
      setRequestsToAccept((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      setIsLoading(false);
      // Handle error gracefully
      toast.error(
        error.response.data.message ||
          "Failed to reject friend request. Please try again later."
      );
      console.error("Error rejecting friend request:", error);
    }
}

    const cancelRequest = async (requestId, username, friendId) => {
  setIsLoading(true);
  try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/friends/cancel`,
        { requestId, username, friendId },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setRequestsToCancel((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // Handle error gracefully
      toast.error(
        error.response.data.message ||
          "Failed to cancel friend request. Please try again later."
      );
      console.error("Error canceling friend request:", error);
    }
}

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="requests-container">
        <h1 className="requests-title">Requests</h1>
        <input
          type="text"
          className="requests-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for friends..."
        />

        <div className="requests-results">
          {requests_to_accept
            .filter((request) =>
              request.request_from.username
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((request) => (
              <div key={request._id} className="requests-item">
                {/* <img src={user.profilePicture || '/default-profile.png'} alt={`${user.username}'s profile`} className="add-friend-avatar" /> */}
                <span className="requests-username">
                  {request.request_from.username}
                </span>
                <button className="requests-button" onClick={() => acceptRequest(request._id)} >Accept</button>
                <button className="requests-button-del" onClick={() => rejectRequest(request._id)} >Reject</button>
              </div>
            ))}
        </div>

        <hr className="hr" />

        <div className="requests-results">
          {requests_to_cancel
            .filter((request) =>
              request.request_to.username
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((request) => (
              <div key={request._id} className="requests-item">
                {/* <img src={user.profilePicture || '/default-profile.png'} alt={`${user.username}'s profile`} className="add-friend-avatar" /> */}
                <span className="requests-username">
                  {request.request_to.username}
                </span>
                <button className="requests-button" onClick={() => cancelRequest(request._id, request.request_from.username, request.request_to._id)} >Cancel</button>
              </div>
            ))}
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
