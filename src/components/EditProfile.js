import { Loader } from "./loader";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./styles/EditProfile.css";
import profileImage from "../assets/images/profile.png";

export const EditProfile = ({ user, setEdit, edit }) => {
  const [editProfileData, setEditProfileData] = useState({
    name: user.name,
    username: user.username,
    profile_image: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEdit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (
      editProfileData.name === user.name &&
      editProfileData.username === user.username &&
      !editProfileData.profile_image
    ) {
      setIsLoading(false);

      setTimeout(() => {
        toast.info("No Changes are made", {
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
      }, 1);

      setTimeout(() => {
              setEdit(false);
      }, 1000);

      
      return;
    } else if (!editProfileData.name || !editProfileData.username) {
      setIsLoading(false);

      setTimeout(() => {
        toast.warning("Name and Username are required", {
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
      }, 1);

      return;
    }

    let transformedUrl = "";

    const formData = new FormData();

    formData.append("upload_preset", process.env.REACT_APP_UNSIGNED_PRESENT);
    formData.append("folder", "Omnio/Profile_Images");

    if (editProfileData.profile_image) {
      formData.append("file", editProfileData.profile_image);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
          formData
        );

        const publicId = res.data.public_id;

        transformedUrl = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/c_fill,g_faces,h_500,w_500/${publicId}.jpg`;
      } catch (err) {
        console.error("Upload failed:", err);
        setIsLoading(false);
        setTimeout(() => {
          toast.error(
            err.response.data.message || "Failed to upload image. Try again.", {
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
        }, 1);
      }
    }

    await axios
      .put(
        `${process.env.REACT_APP_SERVER_URL}/users/${user._id}`,
        { ...editProfileData, transformedUrl },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.data.message === "Username Error") {
          setIsLoading(false);
          setTimeout(() => {
            toast.warning("Username already taken", {
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
          }, 1);
          return;
        }
        setIsLoading(false);
        setTimeout(() => {
          toast.success(response.data.message || "Profile Updated", {
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
        }, 1);
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1000);
      })
      .catch((error) => {
        console.error(error.response || "There is some server error");
        setIsLoading(false);

        setTimeout(() => {
          toast.error(
            error.response.data.message || "There is some server error", {
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
        }, 1);
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="edit-profile">
        <img
          src={user.profile_image || profileImage}
          className="edit-page-profile-image"
          alt="profile-image"
        />
        <form onSubmit={handleSubmitEdit} encType="multipart/form-data">
          <div className="edit-profile-item">
            <label htmlFor="name" className="edit-profile-label">
              Name
            </label>
            <input
              type="text"
              className="edit-profile-input"
              onChange={(e) =>
                setEditProfileData({ ...editProfileData, name: e.target.value })
              }
              value={editProfileData.name}
              name="name"
              id="name"
            />
          </div>

          <div className="edit-profile-item">
            <label htmlFor="username" className="edit-profile-label">
              Username
            </label>
            <input
              type="text"
              className="edit-profile-input"
              onChange={(e) =>
                setEditProfileData({
                  ...editProfileData,
                  username: e.target.value,
                })
              }
              value={editProfileData.username}
              name="username"
              id="username"
            />
          </div>

          <div className="edit-profile-item">
            <label htmlFor="profile" className="edit-profile-label">
              Profile
            </label>
            <input
              type="text"
              value={user.profile}
              className="edit-profile-input"
              name="profile"
              id="profile"
              disabled
            />
          </div>

          <div className="edit-profile-item">
            <label htmlFor="image" className="edit-profile-label">
              Profile Image
            </label>
            <input
              type="file"
              className="edit-profile-input"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) =>
                setEditProfileData({
                  ...editProfileData,
                  profile_image: e.target.files[0],
                })
              }
              name="image"
              id="image"
              placeholder="Upload Profile Image"
            />
          </div>
          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};
