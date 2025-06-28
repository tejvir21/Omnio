import "./styles/Login.css";
import logo from "../assets/images/omnio-logo.png";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "../components/loader";

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        formData,
        { withCredentials: true }
      );
      localStorage.setItem("user", response.data.id);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("chat_background", response.data.chat_background);

      setIsLoading(false);

      setTimeout(() => {
        toast.success(response.data.message || "Login successful!", {
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
        window.location.href = "/";
      }, 1000); // Give the toast time to show
    } catch (error) {
      setIsLoading(false);

      // Handle error response
      console.error("Login failed error:", error.response);
      setTimeout(() => {
        toast.error(
          error.response.data.message || "Login failed. Please try again.", {
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
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="logo-container">
        <img src={logo} alt="Omnio-logo" />
      </div>
      <div className="login-page">
        <h1>Login</h1>
        {/* <form onSubmit={handleSubmit}> */}
        <form
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={formData["username"]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  username: e.target.value,
                });
              }}
              name="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData["password"]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  password: e.target.value,
                });
              }}
              name="password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};
