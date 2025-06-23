import "./styles/Register.css";
import logo from "../assets/images/omnio-logo.png";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "../components/loader";

export const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    } else {
      setIsLoading(true);
      // Send a POST request to the server to register the user
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/auth/register`, formData, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("Registration successful:", response.data);
          toast.success("Registration successful!");
          toast.info(response.data.message);
          setIsLoading(false);
          localStorage.setItem("user", response.data.user.id);
          localStorage.setItem("username", response.data.user.username);
        })
        .catch((error) => {
          // Handle error appropriately
          console.error("There was an error registering!", error);
          toast.error("Registration failed. Please try again.");
        });
    }
    // Clear the form data

    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  if (localStorage.getItem("user")) {
    window.location.href = "/";
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="logo-container">
        <img src={logo} alt="Omnio-logo" />
      </div>
      <div className="register-page">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={(e) =>
                setFormData((prvs) => {
                  return { ...prvs, [e.target.name]: e.target.value };
                })
              }
              value={formData["name"]}
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              onChange={(e) =>
                setFormData((prvs) => {
                  return { ...prvs, [e.target.name]: e.target.value };
                })
              }
              name="username"
              value={formData["username"]}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              onChange={(e) =>
                setFormData((prvs) => {
                  return { ...prvs, [e.target.name]: e.target.value };
                })
              }
              name="email"
              value={formData["email"]}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) =>
                setFormData((prvs) => {
                  return { ...prvs, [e.target.name]: e.target.value };
                })
              }
              name="password"
              value={formData["password"]}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              onChange={(e) =>
                setFormData((prvs) => {
                  return { ...prvs, [e.target.name]: e.target.value };
                })
              }
              name="confirmPassword"
              value={formData["confirmPassword"]}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};
