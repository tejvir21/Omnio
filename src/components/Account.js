import "./styles/Account.css";
import { useState } from "react";
import { Loader } from "../components/loader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export const Account = ({ setSelected }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    // Make a request to the server to log out
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => { 
        
        localStorage.clear();

        setIsLoading(false);

        toast.success("Logout successful!", {
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
        setTimeout(() => {
          window.location.href = "/login";
        }, 1);
      })
      .catch((error) => {
        setIsLoading(false);
        setTimeout(() => {
          toast.error("Logout failed. Please try again.", {
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
        console.error("There was an error logging out!", error);
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className="account-container"
      onClick={() =>
        setSelected((prvs) => {
          return { ...prvs, profile: false };
        })
      }
    >
      <div className="card">
        <div
          className="card-header"
          onClick={() => setSelected((prvs) => ({ ...prvs, profile: true }))}
        >
          <p>Signed in as</p>
          <div className="user-info">
            <div className="user-icon">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="16"
                height="16"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <p className="user-email">{localStorage.getItem("username")}</p>
          </div>
        </div>

        <div className="menu">
          <a
            href="/profile"
            className="menu-item"
            onClick={() => setSelected((prvs) => ({ ...prvs, profile: false }))}
          >
            <div className="indicator"></div>
            <div className="icon-wrapper">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="20"
                height="20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <span>Profile</span>
            <svg fill="currentColor" viewBox="0 0 20 20" className="arrow-icon">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </a>

          <a
            href="/settings"
            className="menu-item"
            onClick={() => setSelected((prvs) => ({ ...prvs, profile: false }))}
          >
            <div className="indicator"></div>
            <div className="icon-wrapper">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="20"
                height="20"
              >
                <path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <span>Settings</span>
            <svg fill="currentColor" viewBox="0 0 20 20" className="arrow-icon">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </a>

          <span onClick={handleLogout} className="menu-item logout">
            <div className="indicator"></div>
            <div className="icon-wrapper">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="20"
                height="20"
              >
                <path d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
              </svg>
            </div>
            <span>Logout</span>
            <svg fill="currentColor" viewBox="0 0 20 20" className="arrow-icon">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </span>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};
