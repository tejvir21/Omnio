import { BottomNav } from '../components/BottomNav'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './styles/Profile.css';
import { useEffect, useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import profileImage from '../assets/images/profile.png';
import { Loader } from '../components/loader';

export const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoading(true);
            // Fetch user profile data
            axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${user}`, {
                withCredentials: true,
            }).then((response) => {
                setProfileData(response.data);
                setIsLoading(false);
                // You can set the profile data in state if needed
            }).catch((error) => {
                setIsLoading(false);
                toast.error("Failed to fetch profile data. Please try again.");
                console.error("There was an error fetching the profile data!", error);
            });
        }
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(true);
        // Make a request to the server to log out
        axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {}, {
            withCredentials: true,
        }).then((response) => {
            toast.success("Logout successful!");
            setIsLoading(false);
            setIsLoggedIn(false);
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }).catch((error) => {
            setIsLoading(false);
            toast.error("Logout failed. Please try again.");
            console.error("There was an error logging out!", error);
        });
    }

    return (
        <>
        <div className="profile-page">
            <span>Profile Page{isLoggedIn ? (
                <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            ) : (
                <button className="login-btn">
                    <a href="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</a>
                </button>
            )}</span>
        </div>
            {profileData ? (
                <div className="profile-info">
                    <img src={profileImage} alt="profile-image" />
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
                    
                </div>
            ) : (
                <p>Loading profile data...</p>
            )}
            
        <BottomNav />
        <ToastContainer position='top-center' />
        </>
    );
}