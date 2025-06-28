import { BottomNav } from "../components/BottomNav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./styles/Profile.css";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import profileImage from "../assets/images/profile.png";
import { Loader } from "../components/loader";
import { EditProfile } from "../components/EditProfile";
import EditButton from "../components/EditButton";
import LoginButton from "../components/LoginButton";

export const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("user"));
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true);
      // Fetch user profile data
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/users/by-id/${isLoggedIn}`, {
          withCredentials: true,
        })
        .then((response) => {
          setProfileData(response.data);
          setIsLoading(false);
          // You can set the profile data in state if needed
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response.data.message || "Failed to fetch profile data. Please try again.", {
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
          console.error("There was an error fetching the profile data!", error);
        });
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

return isEdit ? (
  <EditProfile user={profileData} setEdit={setIsEdit} edit={isEdit} />
) : 
     (
      <>
        <div className="profile-page">
          <span>
            Profile Page
            {!isLoggedIn && <LoginButton />}
          </span>
        </div>
        {profileData ? (
          <div className="profile-info">
            <img src={profileData.profile_image || profileImage} alt="profile-image" />
            <div className="profile-data">
              <FaRegUser className="icons" />
              <span>
                <h3>Name</h3>
                <p>{profileData.name}</p>
              </span>
            </div>

            <div className="profile-data">
              <FaRegUser className="icons" />
              <span>
                <h3>Username</h3>
                <p>{profileData.username}</p>
              </span>
            </div>

            <div className="profile-data">
              <FaRegUser className="icons" />
              <span>
                <h3>Profile</h3>
                <p>{profileData.profile}</p>
              </span>
            </div>

            <div className="profile-data">
              <FaRegUser className="icons" />
              <span>
                <h3>Joined At</h3>
                <p>{profileData.createdAt.split("T")[0]}</p>
              </span>
            </div>
            <div className="profile-data" style={{paddingLeft: "10px"}} onClick={() => setIsEdit(true)}>
              <EditButton />
            </div>
          </div>
        ) : (
          <p>Loading profile data...</p>
        )}

        <BottomNav />
        <ToastContainer position="top-center" />
      </>
    )
}
